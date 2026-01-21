// app/api/denuncias/[trackingId]/route.ts
import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } from "@azure/storage-blob";
import { NextResponse } from "next/server";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING_SSGL;
const containerName = "denuncias";

interface DenunciaMetadata {
    nombre: string;
    rut: string;
    email: string;
    telefono: string;
    anonimo: boolean;
    tipoDenuncia: string;
    denunciaDetalle: string;
    fechaIncidente: string;
    ubicacion: string;
    trackingId: string;
    receivedAt: string;
    attachments: Array<{
        name: string;
        size: number;
        type: string;
        blobPath: string;
    }>;
}

// Parsear el connection string para obtener account name y key
function parseConnectionString(connStr: string) {
    const parts = connStr.split(';');
    const result: Record<string, string> = {};
    for (const part of parts) {
        const [key, ...valueParts] = part.split('=');
        if (key && valueParts.length > 0) {
            result[key] = valueParts.join('=');
        }
    }
    return result;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ trackingId: string }> }
) {
    const { trackingId } = await params;

    if (!connectionString) {
        return NextResponse.json(
            { error: "Azure Storage no configurado" },
            { status: 500 }
        );
    }

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Buscar el metadata.json de esta denuncia
        let foundMetadata: DenunciaMetadata | null = null;
        let folderPath = '';

        for await (const blob of containerClient.listBlobsFlat()) {
            if (blob.name.includes(`/${trackingId}/metadata.json`)) {
                const blobClient = containerClient.getBlobClient(blob.name);
                const downloadResponse = await blobClient.download(0);

                const chunks: Uint8Array[] = [];
                if (downloadResponse.readableStreamBody) {
                    const reader = downloadResponse.readableStreamBody as unknown as AsyncIterable<Uint8Array>;
                    for await (const chunk of reader) {
                        chunks.push(chunk);
                    }
                }

                const content = Buffer.concat(chunks).toString('utf-8');
                foundMetadata = JSON.parse(content) as DenunciaMetadata;
                folderPath = blob.name.replace('/metadata.json', '');
                break;
            }
        }

        if (!foundMetadata) {
            return NextResponse.json(
                { error: "Denuncia no encontrada" },
                { status: 404 }
            );
        }

        // Generar URLs con SAS para los adjuntos
        const connStrParts = parseConnectionString(connectionString);
        const accountName = connStrParts['AccountName'];
        const accountKey = connStrParts['AccountKey'];

        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

        const attachmentsWithUrls = foundMetadata.attachments.map(attachment => {
            const blobClient = containerClient.getBlobClient(attachment.blobPath);

            // Generar SAS token válido por 1 hora
            const startsOn = new Date();
            const expiresOn = new Date(startsOn.getTime() + 60 * 60 * 1000);

            const sasToken = generateBlobSASQueryParameters({
                containerName,
                blobName: attachment.blobPath,
                permissions: BlobSASPermissions.parse("r"),
                startsOn,
                expiresOn
            }, sharedKeyCredential).toString();

            return {
                ...attachment,
                downloadUrl: `${blobClient.url}?${sasToken}`
            };
        });

        return NextResponse.json({
            success: true,
            denuncia: {
                ...foundMetadata,
                attachments: attachmentsWithUrls
            }
        });

    } catch (error) {
        console.error("Error al obtener denuncia:", error);
        return NextResponse.json(
            { error: "Error al obtener la denuncia" },
            { status: 500 }
        );
    }
}
