import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Para deploy en Azure Static Web Apps, usa el híbrido con Azure Functions
  images: {
    unoptimized: true,       // Mantener para compatibilidad
  },
  // ...cualquier otra config que ya tengas...
};

export default nextConfig;
