import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jardim de Ideias",
  description: "Uma rede simples para criar, apoiar e evoluir ideias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
