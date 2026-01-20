// app/api/send-email/route.ts
import { EmailClient } from "@azure/communication-email";
import { NextResponse } from "next/server";

// Inicializamos el cliente fuera del handler para reutilizarlo
const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
const senderAddress = process.env.AZURE_EMAIL_SENDER_ADDRESS;

export async function POST(request: Request) {
    try {
        // 1. Validar configuración
        if (!connectionString || !senderAddress) {
            return NextResponse.json(
                { error: "Error de configuración en el servidor (faltan variables de entorno)." },
                { status: 500 }
            );
        }

        // 2. Obtener datos del formulario
        const formData = await request.json();
        const { name, email, subject, message } = formData;

        // Validación simple
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        // 3. Preparar el cliente de Email
        const client = new EmailClient(connectionString);

        // 4. Construir el correo
        const emailMessage = {
            senderAddress: senderAddress,
            content: {
                subject: `Nuevo Contacto Web - Roadwise: ${subject}`,
                plainText: `Nombre: ${name}\nEmail: ${email}\nAsunto: ${subject}\nMensaje:\n${message}`,
                html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>Nuevo Contacto Web - Roadwise</title>
                </head>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; background-color: #0a0a0f; margin: 0; padding: 0;">
                    
                    <div style="max-width: 600px; margin: 20px auto; background-color: #12121a; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.4); border: 1px solid rgba(59, 130, 246, 0.2);">
                        
                        <!-- Header con gradiente -->
                        <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">🚗 Roadwise</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Nuevo Mensaje de Contacto</p>
                        </div>

                        <div style="padding: 35px;">
                            
                            <p style="color: #94a3b8; font-size: 16px; margin-bottom: 25px;">
                                Se ha recibido una nueva solicitud de contacto desde el sitio web de <strong style="color: #60a5fa;">Roadwise</strong>.
                            </p>

                            <!-- Tabla de información -->
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                                <tr style="border-bottom: 1px solid rgba(59, 130, 246, 0.2);">
                                    <td style="padding: 15px 0; color: #64748b; font-weight: 600; width: 30%;">👤 Nombre:</td>
                                    <td style="padding: 15px 0; color: #e2e8f0; font-weight: 500;">${name}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid rgba(59, 130, 246, 0.2);">
                                    <td style="padding: 15px 0; color: #64748b; font-weight: 600;">📧 Email:</td>
                                    <td style="padding: 15px 0; color: #e2e8f0;"><a href="mailto:${email}" style="color: #60a5fa; text-decoration: none; font-weight: 500;">${email}</a></td>
                                </tr>
                                <tr style="border-bottom: 1px solid rgba(59, 130, 246, 0.2);">
                                    <td style="padding: 15px 0; color: #64748b; font-weight: 600;">📋 Asunto:</td>
                                    <td style="padding: 15px 0; color: #e2e8f0; font-weight: 500;">${subject}</td>
                                </tr>
                            </table>

                            <!-- Mensaje -->
                            <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border-left: 4px solid #3b82f6; padding: 25px; border-radius: 8px;">
                                <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 700; margin-bottom: 12px; letter-spacing: 1px;">💬 Mensaje del usuario:</p>
                                <p style="margin: 0; color: #e2e8f0; font-style: italic; white-space: pre-wrap; line-height: 1.7;">"${message}"</p>
                            </div>

                            <!-- Botón de respuesta -->
                            <div style="margin-top: 35px; text-align: center;">
                                <a href="mailto:${email}?subject=Re: ${subject}" style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);">Responder al Usuario</a>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: rgba(0,0,0,0.3); padding: 25px; text-align: center; border-top: 1px solid rgba(59, 130, 246, 0.2);">
                            <p style="margin: 0; color: #64748b; font-size: 12px;">
                                Este correo fue enviado automáticamente desde el sitio web de <strong style="color: #60a5fa;">Roadwise</strong> - Soluciones de IA para Infraestructura Vial.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                `,
            },
            recipients: {
                to: [
                    // Correo principal donde se recibirán los mensajes
                    { address: "thepipexalbo@gmail.com" },

                ],
            },
        };

        // 5. Enviar
        const poller = await client.beginSend(emailMessage);

        // Esperamos a que Azure procese la solicitud
        const result = await poller.pollUntilDone();

        if (result.status === "Succeeded") {
            return NextResponse.json({ message: "Correo enviado con éxito" });
        } else {
            throw new Error(`Error en el envío: ${result.error?.message}`);
        }

    } catch (error: unknown) {
        console.error("Error enviando correo:", error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        return NextResponse.json(
            { error: "Error al enviar el correo.", details: errorMessage },
            { status: 500 }
        );
    }
}
