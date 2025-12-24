import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roadwise.cl | Mantención y Cuidado de la Infraestructura Vial con IA",
  description:
    "Roadwise desarrolla soluciones de Inteligencia Artificial para el análisis, monitoreo y salvaguarda de la infraestructura vial. Transformamos datos en carreteras más seguras.",
  keywords: [
    "Inteligencia Artificial",
    "Infraestructura Vial",
    "Carreteras Inteligentes",
    "Monitoreo Vial",
    "IA Chile",
    "Roadwise",
    "Análisis de Pavimento",
    "Señalización Vial",
    "Deep Learning",
    "Computer Vision",
  ],
  authors: [{ name: "Felipe Pereira - Departamento I+D Roadwise" }],
  creator: "Roadwise",
  publisher: "Roadwise",
  openGraph: {
    title: "Roadwise | IA para Infraestructura Vial",
    description:
      "Desarrollamos tecnología de vanguardia para el análisis y monitoreo de carreteras mediante Inteligencia Artificial.",
    url: "https://roadwise.cl",
    siteName: "Roadwise",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roadwise | IA para Infraestructura Vial",
    description:
      "Desarrollamos tecnología de vanguardia para el análisis y monitoreo de carreteras mediante Inteligencia Artificial.",
    creator: "@roadwise",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
