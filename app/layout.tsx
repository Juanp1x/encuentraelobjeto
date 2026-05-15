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
  description: "Juego de encontrar objetos escondidos en escenas",
  manifest: "/manifest.json",
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
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e293b 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 999,
            backdropFilter: "blur(12px)",
            background: "rgba(15,23,42,0.8)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
            }}
          >
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg,#2563eb,#7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  boxShadow: "0 10px 25px rgba(37,99,235,.35)",
                }}
              >
                🔍
              </div>

              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "white",
                  }}
                >
                  Encuentra el objeto
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                  }}
                >
                  Juego de observación
                </div>
              </div>
            </Link>

            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  padding: "10px 18px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                🧩 Un jugador
              </Link>

              <Link
                href="/versus"
                style={{
                  textDecoration: "none",
                  padding: "10px 18px",
                  borderRadius: 999,
                  background:
                    "linear-gradient(135deg,#2563eb,#7c3aed)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: 14,
                  boxShadow: "0 10px 25px rgba(37,99,235,.35)",
                }}
              >
                ⚔️ Versus
              </Link>
            </div>
          </div>
        </nav>

        <main
          style={{
            minHeight: "calc(100vh - 72px)",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}