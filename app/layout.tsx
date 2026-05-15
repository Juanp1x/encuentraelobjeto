import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Encuentra el objeto",
  description: "Juego de encontrar objetos escondidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <nav
          style={{
            borderBottom: "1px solid #e5e7eb",
            padding: "0 1.5rem",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fff",
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            🔍 Encuentra el objeto
          </Link>

          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/">Inicio</Link>
            <Link href="/versus">Versus</Link>
          </div>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}