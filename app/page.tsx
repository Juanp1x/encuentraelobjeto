"use client";

import { useState } from "react";
import { useVersus, tokenize, stripPunct, findTargetTokenIdx } from "./versus/page";
import { Difficulty } from "./versus/types";

// ─── Styles (inline so no extra CSS file needed) ──────────────────────────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; }
  .word-span {
    cursor: pointer; border-radius: 4px; padding: 0 3px;
    border-bottom: 1.5px dashed #aaa; transition: background .12s; display: inline;
  }
  .word-span:hover { background: #dbeafe; }
  .word-span.found { background: #bbf7d0 !important; color: #14532d; font-weight: 800; border-bottom: none; animation: pop .3s ease; pointer-events: none; }
  .word-span.reveal { background: #fecaca !important; color: #7f1d1d; font-weight: 800; border-bottom: none; pointer-events: none; }
  .word-span.wrong { animation: shake .35s ease; background: #fecaca; }
  @keyframes pop { 0%,100%{transform:scale(1)} 50%{transform:scale(1.22)} }
  @keyframes shake { 0%,100%{transform:translateX(0)} 30%{transform:translateX(-5px)} 70%{transform:translateX(5px)} }
  .diff-btn { padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 700;
    border: 1.5px solid #d1d5db; background: transparent; color: #6b7280; cursor: pointer; transition: all .15s; }
  .diff-btn.active { background: #dbeafe; color: #1e40af; border-color: #93c5fd; }
  .btn { padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 700;
    border: 1.5px solid #d1d5db; background: #fff; color: #374151; cursor: pointer; transition: background .12s; }
  .btn:hover { background: #f3f4f6; }
  .btn.green { background: #059669; color: #fff; border-color: #059669; }
  .btn.green:hover { background: #047857; }
  .btn.blue { background: #2563eb; color: #fff; border-color: #2563eb; }
  .btn.blue:hover { background: #1d4ed8; }
  .dot { width: 11px; height: 11px; border-radius: 50%; background: #d1d5db; display: inline-block; transition: background .2s; }
  .dot.used { background: #ef4444; }
  input[type=text] { padding: 8px 12px; border-radius: 8px; border: 1.5px solid #d1d5db;
    font-size: 14px; font-family: 'Nunito', sans-serif; width: 100%; outline: none; }
  input[type=text]:focus { border-color: #93c5fd; }
  .player-card { border-radius: 12px; padding: 14px 18px; flex: 1; min-width: 140px; transition: all .2s; }
  .player-card.p1 { background: #eff6ff; border: 1.5px solid #bfdbfe; }
  .player-card.p2 { background: #fdf4ff; border: 1.5px solid #e9d5ff; }
  .player-card.active-turn { box-shadow: 0 0 0 3px #3b82f6; }
  .player-card.p2.active-turn { box-shadow: 0 0 0 3px #a855f7; }
`;

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({ onStart }: { onStart: (p1: string, p2: string, diff: Difficulty, rounds: number) => void }) {
  const [p1, setP1] = useState("Jugador 1");
  const [p2, setP2] = useState("Jugador 2");
  const [diff, setDiff] = useState<Difficulty>("fácil");
  const [rounds, setRounds] = useState(6);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>⚔️ Modo Versus</h1>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 28 }}>Dos jugadores, un mismo dispositivo. ¡El más rápido gana!</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
            🟦 Nombre Jugador 1
          </label>
          <input type="text" value={p1} onChange={(e) => setP1(e.target.value)} placeholder="Jugador 1" />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
            🟣 Nombre Jugador 2
          </label>
          <input type="text" value={p2} onChange={(e) => setP2(e.target.value)} placeholder="Jugador 2" />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Dificultad</p>
        <div style={{ display: "flex", gap: 8 }}>
          {(["fácil", "normal", "difícil"] as Difficulty[]).map((d) => (
            <button key={d} className={`diff-btn${diff === d ? " active" : ""}`} onClick={() => setDiff(d)}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
          Rondas: <span style={{ color: "#2563eb" }}>{rounds}</span>
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {[4, 6, 8, 10].map((r) => (
            <button key={r} className={`diff-btn${rounds === r ? " active" : ""}`} onClick={() => setRounds(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <button className="btn green" style={{ width: "100%", padding: "12px", fontSize: 16 }}
        onClick={() => onStart(p1, p2, diff, rounds)}>
        🎮 Comenzar partida
      </button>
    </div>
  );
}

// ─── Player Card ──────────────────────────────────────────────────────────────

function PlayerCard({ name, score, streak, wins, isActive, side }: {
  name: string; score: number; streak: number; wins: number; isActive: boolean; side: "p1" | "p2";
}) {
  return (
    <div className={`player-card ${side}${isActive ? " active-turn" : ""}`}>
      <div style={{ fontSize: 13, fontWeight: 800, color: side === "p1" ? "#1e40af" : "#7e22ce", marginBottom: 4 }}>
        {side === "p1" ? "🟦" : "🟣"} {name}
        {isActive && <span style={{ marginLeft: 6, fontSize: 11, background: side === "p1" ? "#bfdbfe" : "#e9d5ff", padding: "1px 8px", borderRadius: 10 }}>TURNO</span>}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{score} pts</div>
      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
        🏆 {wins} rondas · 🔥 racha {streak}
      </div>
    </div>
  );
}

// ─── Scene Renderer ───────────────────────────────────────────────────────────

function SceneText({ scene, target, foundIdx, wrongIdxs, revealed, onClickWord }: {
  scene: string; target: string; foundIdx: number | null;
  wrongIdxs: Set<number>; revealed: boolean; onClickWord: (idx: number, targetIdx: number) => void;
}) {
  const tokens = tokenize(scene);
  const targetIdx = findTargetTokenIdx(tokens, target);

  return (
    <p style={{ fontSize: 15, lineHeight: 1.9, color: "#111827" }}>
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
        const core = stripPunct(tok);
        if (core.length <= 2) return <span key={i}>{tok}</span>;
        const pre = tok.slice(0, tok.length - tok.replace(/^[¿¡"'(«]+/, "").length);
        const suf = tok.slice(tok.replace(/[.,;:!?)"'»]+$/, "").length);
        const isTarget = i === targetIdx;
        const isFound = isTarget && foundIdx !== null;
        const isReveal = isTarget && revealed && foundIdx === null;
        const isWrong = wrongIdxs.has(i);

        return (
          <span key={i}>
            {pre}
            <span
              className={`word-span${isFound ? " found" : ""}${isReveal ? " reveal" : ""}${isWrong ? " wrong" : ""}`}
              onClick={() => onClickWord(i, targetIdx)}
            >
              {core}
            </span>
            {suf}
          </span>
        );
      })}
    </p>
  );
}

// ─── Round End Overlay ────────────────────────────────────────────────────────

function RoundEndBanner({ winner, p1Name, p2Name, onNext, isLast }: {
  winner: 1 | 2 | "tie" | null; p1Name: string; p2Name: string; onNext: () => void; isLast: boolean;
}) {
  const msg =
    winner === "tie"
      ? "⚡ ¡Ronda sin ganador!"
      : winner === 1
      ? `🏆 ¡${p1Name} ganó esta ronda!`
      : `🏆 ¡${p2Name} ganó esta ronda!`;

  return (
    <div style={{
      background: winner === "tie" ? "#fef3c7" : "#d1fae5",
      border: `1.5px solid ${winner === "tie" ? "#fbbf24" : "#34d399"}`,
      borderRadius: 12, padding: "16px 20px", marginBottom: 12, textAlign: "center",
    }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 10 }}>{msg}</div>
      <button className={`btn ${isLast ? "blue" : "green"}`} onClick={onNext}>
        {isLast ? "📊 Ver resultados finales" : "➡️ Siguiente ronda"}
      </button>
    </div>
  );
}

// ─── Game Over Screen ─────────────────────────────────────────────────────────

function GameOverScreen({ p1Name, p1Score, p1Wins, p2Name, p2Score, p2Wins, onReset }: {
  p1Name: string; p1Score: number; p1Wins: number;
  p2Name: string; p2Score: number; p2Wins: number;
  onReset: () => void;
}) {
  const winner =
    p1Score > p2Score ? p1Name : p2Score > p1Score ? p2Name : null;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>🏁</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>¡Partida terminada!</h1>
      <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 24 }}>
        {winner ? `🏆 Ganador: ${winner}` : "¡Empate! Ambos jugadores igualaron puntos"}
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        {[
          { name: p1Name, score: p1Score, wins: p1Wins, side: "p1" as const },
          { name: p2Name, score: p2Score, wins: p2Wins, side: "p2" as const },
        ].map(({ name, score, wins, side }) => (
          <div key={side} className={`player-card ${side}`} style={{ textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: side === "p1" ? "#1e40af" : "#7e22ce", marginBottom: 4 }}>
              {side === "p1" ? "🟦" : "🟣"} {name}
              {name === winner && <span style={{ marginLeft: 6, fontSize: 11, background: "#bbf7d0", color: "#14532d", padding: "1px 8px", borderRadius: 10 }}>GANADOR</span>}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#111827" }}>{score} pts</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>🏆 {wins} rondas ganadas</div>
          </div>
        ))}
      </div>

      <button className="btn green" style={{ width: "100%", padding: 12, fontSize: 16 }} onClick={onReset}>
        🔄 Jugar de nuevo
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VersusPage() {
  const { state, player1, player2, currentRound, startGame, clickWord, nextRound, requestHint, resetGame } = useVersus();

  if (state.phase === "setup") {
    return (
      <>
        <style>{STYLES}</style>
        <SetupScreen onStart={startGame} />
      </>
    );
  }

  if (state.phase === "game-over") {
    return (
      <>
        <style>{STYLES}</style>
        <GameOverScreen
          p1Name={player1.name} p1Score={player1.score} p1Wins={player1.wins}
          p2Name={player2.name} p2Score={player2.score} p2Wins={player2.wins}
          onReset={resetGame}
        />
      </>
    );
  }

  const isRoundEnd = state.phase === "round-end";
  const isLastRound = state.roundNumber >= state.totalRounds;
  const currentPlayer = state.currentPlayer === 1 ? player1 : player2;

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>⚔️ Modo Versus</h1>
            <p style={{ fontSize: 12, color: "#6b7280" }}>Ronda {state.roundNumber} de {state.totalRounds} · {state.diff}</p>
          </div>
          <button className="btn" style={{ fontSize: 12, padding: "5px 12px" }} onClick={resetGame}>✕ Salir</button>
        </div>

        {/* Player cards */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <PlayerCard {...player1} isActive={state.currentPlayer === 1 && !isRoundEnd} side="p1" />
          <div style={{ display: "flex", alignItems: "center", fontWeight: 800, color: "#9ca3af", fontSize: 18 }}>VS</div>
          <PlayerCard {...player2} isActive={state.currentPlayer === 2 && !isRoundEnd} side="p2" />
        </div>

        {/* Round end banner */}
        {isRoundEnd && currentRound && (
          <RoundEndBanner
            winner={state.roundWinner}
            p1Name={player1.name}
            p2Name={player2.name}
            onNext={nextRound}
            isLast={isLastRound}
          />
        )}

        {/* Target */}
        {currentRound && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>Busca:</span>
              <span style={{ background: "#dbeafe", color: "#1e40af", fontWeight: 800, fontSize: 15, padding: "5px 18px", borderRadius: 20 }}>
                {currentRound.target}
              </span>
              {state.showHint && (
                <span style={{ fontSize: 13, color: "#6b7280", fontStyle: "italic" }}>💡 {currentRound.hint}</span>
              )}
            </div>

            {/* Scene */}
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px 24px", marginBottom: 12 }}>
              <SceneText
                scene={currentRound.scene}
                target={currentRound.target}
                foundIdx={state.foundIdx}
                wrongIdxs={state.wrongIdxs}
                revealed={state.revealed}
                onClickWord={clickWord}
              />
            </div>

            {/* Bottom bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Intentos:</span>
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={`dot${i >= state.tries ? " used" : ""}`} />
                  ))}
                </div>
                {state.feedback && (
                  <p style={{ fontSize: 13, fontWeight: 700, color: state.feedback.ok ? "#14532d" : "#7f1d1d" }}>
                    {state.feedback.msg}
                  </p>
                )}
                {!isRoundEnd && (
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                    Turno de <b style={{ color: state.currentPlayer === 1 ? "#1e40af" : "#7e22ce" }}>{currentPlayer.name}</b>
                  </p>
                )}
              </div>
              {!isRoundEnd && (
                <button className="btn" style={{ fontSize: 13 }} onClick={requestHint}>💡 Pista</button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}