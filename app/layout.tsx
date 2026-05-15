"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const navLink = (href: string, label: string) => {
    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      <Link
        href={href}
        style={{
          padding: "5px 14px",
          borderRadius: 20,
          fontSize: 13,
          fontWeight: 700,
          textDecoration: "none",
          background: isActive ? "#dbeafe" : "transparent",
          color: isActive ? "#1e40af" : "#6b7280",
          border: `1.5px solid ${isActive ? "#93c5fd" : "transparent"}`,
          transition: "all .15s",
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav
          style={{
            borderBottom: "1px solid #e5e7eb",
            padding: "0 1.5rem",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🔍</span>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>
              Encuentra el objeto
            </span>
          </Link>

          <div style={{ display: "flex", gap: 6 }}>
            {navLink("/", "🧩 Un jugador")}
            {navLink("/versus", "⚔️ Versus")}
          </div>
        </nav>

        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}