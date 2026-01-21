// app/api/auth/login/route.ts
import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    console.log("📥 Recibiendo solicitud de login...");

    // Debug de variables de entorno (sin mostrar contraseñas)
    console.log("🔧 Configuración DB:", {
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        db: process.env.POSTGRES_DB,
        port: process.env.POSTGRES_PORT
    });

    const client = new Client({
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        ssl: {
            rejectUnauthorized: false
        },
        connectionTimeoutMillis: 5000, // 5 segundos de timeout
    });

    try {
        const body = await request.json();
        const { username, password } = body;

        console.log("👤 Usuario intentando login:", username);

        if (!username || !password) {
            return NextResponse.json({ error: "Usuario y contraseña requeridos." }, { status: 400 });
        }

        // Conectar a la base de datos
        console.log("🔗 Conectando a PostgreSQL (Client)...");
        await client.connect();
        console.log("✅ Conexión establecida");

        // Buscar usuario
        const queryText = 'SELECT username, password, nombre, apellido_paterno, tipo_usuario as rol FROM personas WHERE username = $1';
        console.log("🔍 Buscando usuario...");
        const result = await client.query(queryText, [username]);

        if (result.rows.length === 0) {
            console.log("❌ Usuario no encontrado:", username);
            return NextResponse.json({ error: "Usuario no encontrado." }, { status: 401 });
        }

        const user = result.rows[0];
        console.log("✅ Usuario encontrado:", user.username, user.nombre);

        // Verificar contraseña
        let isValid = false;

        if (user.password && user.password.startsWith('$2')) {
            // Contraseña hasheada con bcrypt
            isValid = await bcrypt.compare(password, user.password);
            console.log("🔐 Verificación bcrypt:", isValid);
        } else {
            // Contraseña en texto plano
            isValid = user.password === password;
            console.log("🔐 Verificación texto plano:", isValid);
        }

        if (!isValid) {
            console.log("❌ Credenciales incorrectas");
            return NextResponse.json({ error: "Credenciales incorrectas." }, { status: 401 });
        }

        console.log("✅ Login exitoso para:", username);

        return NextResponse.json({
            success: true,
            user: {
                username: user.username,
                nombre: user.nombre || user.username,
                apellido: user.apellido_paterno || '',
                rol: user.rol || 'admin'
            }
        });

    } catch (error) {
        console.error("❌ Error en login:", error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

        return NextResponse.json({
            error: "Error de conexión con la base de datos.",
            detail: errorMessage
        }, { status: 500 });

    } finally {
        // Cerrar conexión
        await client.end().catch((e) => console.error("Error cerrando conexión:", e));
    }
}
