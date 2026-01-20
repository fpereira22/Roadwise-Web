// app/api/submit-denuncia/route.ts
import { BlobServiceClient } from "@azure/storage-blob";
import { NextResponse } from "next/server";

// La cadena de conexión se lee de las Variables de Entorno
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING_SSGL;
const containerName = "denuncias";

/**
 * Genera un código de seguimiento alfanumérico único.
 */
const generateTrackingId = (): string => {
    return Math.random().toString(36).substring(2, 11).toUpperCase();
};

/**
 * Maneja la solicitud POST para registrar una nueva denuncia con adjuntos.
 */
export async function POST(request: Request) {
    console.log("📥 Recibiendo solicitud de denuncia...");

    // 1. Verificar la conexión a Azure
    if (!connectionString) {
        console.error("❌ Error: AZURE_STORAGE_CONNECTION_STRING_SSGL no está configurada");
        return NextResponse.json(
            { error: "Error de configuración: La cadena de conexión a Azure Storage no está configurada." },
            { status: 500 }
        );
    }

    console.log("✅ Cadena de conexión encontrada");

    // 2. Generar Tracking ID
    const trackingId = generateTrackingId();
    console.log("🎫 Tracking ID generado:", trackingId);

    interface FileMetadata {
        name: string;
        size: number;
        type: string;
        blobPath: string;
    }

    const uploadedFilesMetadata: FileMetadata[] = [];

    try {
        // 3. Obtener los datos del cuerpo de la solicitud (multipart/form-data)
        console.log("📋 Parseando formData...");
        const data = await request.formData();

        // A. Parsear el JSON de datos de texto enviado por el frontend
        const dataJsonString = data.get('data');
        if (!dataJsonString || typeof dataJsonString !== 'string') {
            throw new Error("El cuerpo de la denuncia (JSON) está vacío.");
        }
        const formDataJson = JSON.parse(dataJsonString);
        console.log("✅ Datos parseados:", formDataJson.tipoDenuncia);

        // Definir el tipo de denuncia para el prefijo de la carpeta
        const denunciaType = formDataJson.tipoDenuncia || 'general';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        // 4. Conectar a Azure Blob Service
        console.log("🔗 Conectando a Azure Blob Service...");
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Asegurar que el contenedor existe
        console.log("📦 Verificando/creando contenedor:", containerName);
        await containerClient.createIfNotExists();

        // 5. Definir el prefijo de la "carpeta" (TipoDenuncia/TrackingId/)
        const folderPrefix = `${denunciaType}/${trackingId}/`;

        // B. Subir Archivos Adjuntos
        const files = data.getAll('archivos');

        for (const file of files) {
            if (file && typeof file === 'object' && 'size' in file && (file as File).size > 0) {
                const fileObj = file as File;

                // Convertir el objeto File a ArrayBuffer
                const arrayBuffer = await fileObj.arrayBuffer();

                const extension = fileObj.name.split('.').pop();
                const safeFileName = `adjunto-${uploadedFilesMetadata.length + 1}.${extension}`;
                const blobName = folderPrefix + safeFileName;

                const blockBlobClient = containerClient.getBlockBlobClient(blobName);

                // Subir el archivo binario usando el ArrayBuffer
                await blockBlobClient.uploadData(arrayBuffer, {
                    blobHTTPHeaders: {
                        blobContentType: fileObj.type
                    }
                });

                uploadedFilesMetadata.push({
                    name: fileObj.name,
                    size: fileObj.size,
                    type: fileObj.type,
                    blobPath: blobName,
                });
            }
        }

        // C. Subir el Archivo JSON (Metadatos)
        const dataToSave = {
            ...formDataJson,
            trackingId: trackingId,
            receivedAt: timestamp,
            attachments: uploadedFilesMetadata,
        };

        const jsonBlobName = folderPrefix + 'metadata.json';
        const jsonContent = JSON.stringify(dataToSave, null, 2);

        const jsonBlockBlobClient = containerClient.getBlockBlobClient(jsonBlobName);

        // Usar uploadData con un Uint8Array en lugar de upload con Buffer
        const encoder = new TextEncoder();
        const jsonBytes = encoder.encode(jsonContent);

        await jsonBlockBlobClient.uploadData(jsonBytes, {
            blobHTTPHeaders: {
                blobContentType: 'application/json'
            }
        });

        // 7. Devolver éxito al cliente
        return NextResponse.json(
            {
                message: "Denuncia registrada con éxito.",
                trackingId: trackingId,
                jsonPath: jsonBlobName
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error("Error al procesar la denuncia:", error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

        return NextResponse.json(
            {
                error: "Error interno del servidor al guardar la denuncia.",
                detail: errorMessage
            },
            { status: 500 }
        );
    }
}

// Bloquear otros métodos HTTP
export async function GET() {
    return NextResponse.json(
        { error: "Método GET no permitido para esta ruta. Use POST." },
        { status: 405 }
    );
}
