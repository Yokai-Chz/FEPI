import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSC- Web Admin",
  description: "Panel de control de tránsito",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}