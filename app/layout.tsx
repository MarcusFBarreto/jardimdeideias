import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jardim de Ideias | Ideias vivas, melhoradas por pessoas",
  description:
    "Explore, apoie, crie e melhore ideias com outras pessoas em um lugar simples para descobrir bons caminhos.",
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
