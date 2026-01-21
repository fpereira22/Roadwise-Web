// app/api/denuncias/list/route.ts
import { BlobServiceClient } from "@azure/storage-blob";
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

export async function GET() {
    if (!connectionString) {
        return NextResponse.json(
            { error: "Azure Storage no configurado" },
            { status: 500 }
        );
    }

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        const denuncias: DenunciaMetadata[] = [];

        // Listar todos los blobs en el contenedor
        for await (const blob of containerClient.listBlobsFlat()) {
            // Solo procesar archivos metadata.json
            if (blob.name.endsWith('/metadata.json')) {
                const blobClient = containerClient.getBlobClient(blob.name);
                const downloadResponse = await blobClient.download(0);

                // Leer el contenido del blob
                const chunks: Uint8Array[] = [];
                if (downloadResponse.readableStreamBody) {
                    const reader = downloadResponse.readableStreamBody as unknown as AsyncIterable<Uint8Array>;
                    for await (const chunk of reader) {
                        chunks.push(chunk);
                    }
                }

                const content = Buffer.concat(chunks).toString('utf-8');
                const metadata = JSON.parse(content) as DenunciaMetadata;
                denuncias.push(metadata);
            }
        }

        // Ordenar por fecha de recepción (más reciente primero)
        denuncias.sort((a, b) => {
            return new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime();
        });

        return NextResponse.json({
            success: true,
            total: denuncias.length,
            denuncias
        });

    } catch (error) {
        console.error("Error al listar denuncias:", error);
        return NextResponse.json(
            { error: "Error al obtener denuncias" },
            { status: 500 }
        );
    }
}
