import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',          // <--- La clave para que Azure no de timeout
    images: {
      unoptimized: true,       // <--- Necesario para export estático si usas <Image>
    },
    // ...cualquier otra config que ya tengas...
};

export default nextConfig;
