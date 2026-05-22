"use client";

import { useState } from "react";
import { useVersus, tokenize, stripPunct, findTargetTokenIdx } from "./game";
import { Difficulty } from "./types";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap');
  .vs-word { cursor:pointer; border-radius:4px; padding:0 3px; border-bottom:1.5px dashed #aaa; transition:background .12s; }
  .vs-word:hover { background:#dbeafe; }
  .vs-word.found { background:#bbf7d0!important; color:#14532d; font-weight:800; border-bottom:none; animation:vspop .3s ease; pointer-events:none; }
  .vs-word.reveal { background:#fecaca!important; color:#7f1d1d; font-weight:800; border-bottom:none; pointer-events:none; }
  .vs-word.wrong { animation:vsshake .35s ease; background:#fecaca; }
  @keyframes vspop { 0%,100%{transform:scale(1)} 50%{transform:scale(1.22)} }
  @keyframes vsshake { 0%,100%{transform:translateX(0)} 30%{transform:translateX(-5px)} 70%{transform:translateX(5px)} }
  .vs-diff { padding:4px 14px; border-radius:20px; font-size:13px; font-weight:700; border:1.5px solid #d1d5db; background:transparent; color:#6b7280; cursor:pointer; }
  .vs-diff.on { background:#dbeafe; color:#1e40af; border-color:#93c5fd; }
  .vs-btn { padding:8px 18px; border-radius:8px; font-size:14px; font-weight:700; border:1.5px solid #d1d5db; background:#fff; color:#374151; cursor:pointer; }
  .vs-btn:hover { background:#f3f4f6; }
  .vs-btn.green { background:#059669; color:#fff; border-color:#059669; }
  .vs-btn.green:hover { background:#047857; }
  .vs-btn.blue { background:#2563eb; color:#fff; border-color:#2563eb; }
  .vs-dot { width:11px; height:11px; border-radius:50%; background:#d1d5db; display:inline-block; }
  .vs-dot.used { background:#ef4444; }
  .vs-card { border-radius:12px; padding:14px 18px; flex:1; }
  .vs-card.p1 { background:#eff6ff; border:1.5px solid #bfdbfe; }
  .vs-card.p2 { background:#fdf4ff; border:1.5px solid #e9d5ff; }
  .vs-card.active { box-shadow:0 0 0 3px #3b82f6; }
  .vs-card.p2.active { box-shadow:0 0 0 3px #a855f7; }
  input.vs-input { padding:8px 12px; border-radius:8px; border:1.5px solid #d1d5db; font-size:14px; width:100%; outline:none; font-family:'Nunito',sans-serif; }
  input.vs-input:focus { border-color:#93c5fd; }
`;

export default function VersusPage() {
  const { state, player1, player2, currentRound, startGame, clickWord, nextRound, requestHint, resetGame } = useVersus();
  const [p1Name, setP1Name] = useState("Jugador 1");
  const [p2Name, setP2Name] = useState("Jugador 2");
  const [diff, setDiff] = useState<Difficulty>("fácil");
  const [totalRounds, setTotalRounds] = useState(6);

  const W = ({ children, center }: { children: React.ReactNode; center?: boolean }) => (
    <div style={{ fontFamily: "'Nunito',sans-serif", maxWidth: 660, margin: "0 auto", padding: "1.5rem 1rem", textAlign: center ? "center" : "left" }}>
      {children}
    </div>
  );

  if (state.phase === "setup") return (
    <W>
      <style>{STYLES}</style>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4 }}>⚔️ Modo Versus</h1>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>Dos jugadores, un dispositivo. ¡El más rápido gana!</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>🟦 Jugador 1</label>
          <input className="vs-input" value={p1Name} onChange={e => setP1Name(e.target.value)} placeholder="Jugador 1" />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>🟣 Jugador 2</label>
          <input className="vs-input" value={p2Name} onChange={e => setP2Name(e.target.value)} placeholder="Jugador 2" />
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Dificultad</p>
        <div style={{ display: "flex", gap: 8 }}>
          {(["fácil", "normal", "difícil"] as Difficulty[]).map(d => (
            <button key={d} className={`vs-diff${diff === d ? " on" : ""}`} onClick={() => setDiff(d)}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Rondas: <span style={{ color: "#2563eb" }}>{totalRounds}</span></p>
        <div style={{ display: "flex", gap: 8 }}>
          {[4, 6, 8, 10].map(r => (
            <button key={r} className={`vs-diff${totalRounds === r ? " on" : ""}`} onClick={() => setTotalRounds(r)}>{r}</button>
          ))}
        </div>
      </div>
      <button className="vs-btn green" style={{ width: "100%", padding: 12, fontSize: 16 }}
        onClick={() => startGame(p1Name, p2Name, diff, totalRounds)}>
        🎮 Comenzar partida
      </button>
    </W>
  );

  if (state.phase === "game-over") {
    const winner = player1.score > player2.score ? player1.name : player2.score > player1.score ? player2.name : null;
    return (
      <W center>
        <style>{STYLES}</style>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🏁</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4 }}>¡Partida terminada!</h1>
        <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 24 }}>{winner ? `🏆 Ganador: ${winner}` : "¡Empate!"}</p>
        <div style={{ display: "flex", gap: 12, marginBottom: 28, textAlign: "left" }}>
          {[player1, player2].map((p, i) => (
            <div key={i} className={`vs-card p${i + 1}`}>
              <div style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? "#1e40af" : "#7e22ce", marginBottom: 4 }}>
                {i === 0 ? "🟦" : "🟣"} {p.name}
                {p.name === winner && <span style={{ marginLeft: 6, fontSize: 11, background: "#bbf7d0", color: "#14532d", padding: "1px 8px", borderRadius: 10 }}>GANADOR</span>}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#111827" }}>{p.score} pts</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>🏆 {p.wins} rondas ganadas</div>
            </div>
          ))}
        </div>
        <button className="vs-btn green" style={{ width: "100%", padding: 12, fontSize: 16 }} onClick={resetGame}>
          🔄 Jugar de nuevo
        </button>
      </W>
    );
  }

  const isRoundEnd = state.phase === "round-end";
  const isLast = state.roundNumber >= state.totalRounds;
  const cp = state.currentPlayer === 1 ? player1 : player2;

  return (
    <W>
      <style>{STYLES}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>⚔️ Modo Versus</h1>
          <p style={{ fontSize: 12, color: "#6b7280" }}>Ronda {state.roundNumber} de {state.totalRounds} · {state.diff}</p>
        </div>
        <button className="vs-btn" style={{ fontSize: 12, padding: "5px 12px" }} onClick={resetGame}>✕ Salir</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        {[player1, player2].map((p, i) => {
          const isActive = state.currentPlayer === i + 1 && !isRoundEnd;
          return (
            <div key={i} className={`vs-card p${i + 1}${isActive ? " active" : ""}`}>
              <div style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? "#1e40af" : "#7e22ce", marginBottom: 4 }}>
                {i === 0 ? "🟦" : "🟣"} {p.name}
                {isActive && <span style={{ marginLeft: 6, fontSize: 11, background: i === 0 ? "#bfdbfe" : "#e9d5ff", padding: "1px 8px", borderRadius: 10 }}>TURNO</span>}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{p.score} pts</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>🏆 {p.wins} rondas · 🔥 racha {p.streak}</div>
            </div>
          );
        })}
        <div style={{ fontWeight: 800, color: "#9ca3af", fontSize: 18, flexShrink: 0 }}>VS</div>
      </div>

      {isRoundEnd && (
        <div style={{ background: state.roundWinner === "tie" ? "#fef3c7" : "#d1fae5", border: `1.5px solid ${state.roundWinner === "tie" ? "#fbbf24" : "#34d399"}`, borderRadius: 12, padding: "16px 20px", marginBottom: 12, textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 10 }}>
            {state.roundWinner === "tie" ? "⚡ ¡Ronda sin ganador!" : `🏆 ¡${state.roundWinner === 1 ? player1.name : player2.name} ganó esta ronda!`}
          </div>
          <button className={`vs-btn ${isLast ? "blue" : "green"}`} onClick={nextRound}>
            {isLast ? "📊 Ver resultados" : "➡️ Siguiente ronda"}
          </button>
        </div>
      )}

      {currentRound && (() => {
        const tokens = tokenize(currentRound.scene);
        const targetIdx = findTargetTokenIdx(tokens, currentRound.target);
        return (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>Busca:</span>
              <span style={{ background: "#dbeafe", color: "#1e40af", fontWeight: 800, fontSize: 15, padding: "5px 18px", borderRadius: 20 }}>{currentRound.target}</span>
              {state.showHint && <span style={{ fontSize: 13, color: "#6b7280", fontStyle: "italic" }}>💡 {currentRound.hint}</span>}
            </div>

            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px 24px", marginBottom: 12 }}>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: "#111827" }}>
                {tokens.map((tok, i) => {
                  if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
                  const core = stripPunct(tok);
                  if (core.length <= 2) return <span key={i}>{tok}</span>;
                  const pre = tok.slice(0, tok.length - tok.replace(/^[¿¡"'(«]+/, "").length);
                  const suf = tok.slice(tok.replace(/[.,;:!?)"'»]+$/, "").length);
                  const isTarget = i === targetIdx;
                  const cls = ["vs-word",
                    isTarget && state.foundIdx !== null ? "found" : "",
                    isTarget && state.revealed && state.foundIdx === null ? "reveal" : "",
                    state.wrongIdxs.has(i) ? "wrong" : "",
                  ].filter(Boolean).join(" ");
                  return (
                    <span key={i}>
                      {pre}
                      <span className={cls} onClick={() => clickWord(i, targetIdx, currentRound.target)}>{core}</span>
                      {suf}
                    </span>
                  );
                })}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Intentos:</span>
                  {[0, 1, 2].map(i => <span key={i} className={`vs-dot${i >= state.tries ? " used" : ""}`} />)}
                </div>
                {state.feedback && <p style={{ fontSize: 13, fontWeight: 700, color: state.feedback.ok ? "#14532d" : "#7f1d1d" }}>{state.feedback.msg}</p>}
                {!isRoundEnd && <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Turno de <b style={{ color: state.currentPlayer === 1 ? "#1e40af" : "#7e22ce" }}>{cp.name}</b></p>}
              </div>
              {!isRoundEnd && <button className="vs-btn" onClick={requestHint}>💡 Pista</button>}
            </div>
          </>
        );
      })()}
    </W>
  );
}