import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <style>{`
        .mode-card { background:#fff; border:1.5px solid #e5e7eb; border-radius:16px; padding:28px 24px; text-align:center; height:100%; transition:all .15s; display:block; }
        .mode-card:hover { border-color:#93c5fd; box-shadow:0 4px 20px rgba(37,99,235,0.1); }
        .mode-card.purple:hover { border-color:#c4b5fd; box-shadow:0 4px 20px rgba(124,58,237,0.1); }
        .mode-btn { display:inline-block; color:#fff; font-weight:700; font-size:14px; padding:8px 20px; border-radius:8px; }
      `}</style>

      <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", minHeight: "calc(100vh - 52px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", background: "#f9fafb" }}>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#111827", marginBottom: 10, lineHeight: 1.2 }}>
            Encuentra el objeto
          </h1>
          <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 420, margin: "0 auto" }}>
            Lee la escena, encuentra la palabra escondida. ¿Puedes encontrarla antes de quedarte sin intentos?
          </p>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 600, width: "100%" }}>

          <Link href="/solo" style={{ textDecoration: "none", flex: 1, minWidth: 240 }}>
            <div className="mode-card">
              <div style={{ fontSize: 40, marginBottom: 12 }}>🧩</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Un jugador</h2>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>
                Juega solo, acumula puntos y construye tu racha. Tres dificultades disponibles.
              </p>
              <span className="mode-btn" style={{ background: "#2563eb" }}>Jugar solo</span>
            </div>
          </Link>

          <Link href="/versus" style={{ textDecoration: "none", flex: 1, minWidth: 240 }}>
            <div className="mode-card purple">
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚔️</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Versus</h2>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>
                Dos jugadores, un dispositivo. Tómate los turnos y el más rápido gana.
              </p>
              <span className="mode-btn" style={{ background: "#7c3aed" }}>Jugar versus</span>
            </div>
          </Link>

        </div>

        <p style={{ marginTop: 40, fontSize: 13, color: "#9ca3af" }}>
          Sin registro · Sin anuncios · Solo juego
        </p>

      </div>
    </>
  );
}