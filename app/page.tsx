"use client";

import { useState } from "react";
import { useVersus, tokenize, stripPunct, findTargetTokenIdx } from "./versus/page";
import { Difficulty } from "./versus/types";

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
          <input
            type="text"
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            placeholder="Jugador 1"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1.5px solid #d1d5db",
              fontSize: 14,
              width: "100%",
              outline: "none",
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
            🟣 Nombre Jugador 2
          </label>
          <input
            type="text"
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            placeholder="Jugador 2"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1.5px solid #d1d5db",
              fontSize: 14,
              width: "100%",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Dificultad</p>

        <div style={{ display: "flex", gap: 8 }}>
          {(["fácil", "normal", "difícil"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDiff(d)}
              style={{
                padding: "4px 14px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                border: "1.5px solid #d1d5db",
                cursor: "pointer",
                background: diff === d ? "#dbeafe" : "transparent",
                color: diff === d ? "#1e40af" : "#6b7280",
              }}
            >
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
            <button
              key={r}
              onClick={() => setRounds(r)}
              style={{
                padding: "4px 14px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                border: "1.5px solid #d1d5db",
                cursor: "pointer",
                background: rounds === r ? "#dbeafe" : "transparent",
                color: rounds === r ? "#1e40af" : "#6b7280",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(p1, p2, diff, rounds)}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 16,
          borderRadius: 8,
          border: "none",
          background: "#059669",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        🎮 Comenzar partida
      </button>
    </div>
  );
}

function PlayerCard({ name, score, streak, wins, isActive, side }: {
  name: string;
  score: number;
  streak: number;
  wins: number;
  isActive: boolean;
  side: "p1" | "p2";
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        padding: "14px 18px",
        flex: 1,
        minWidth: 140,
        background: side === "p1" ? "#eff6ff" : "#fdf4ff",
        border: side === "p1" ? "1.5px solid #bfdbfe" : "1.5px solid #e9d5ff",
        boxShadow: isActive
          ? side === "p1"
            ? "0 0 0 3px #3b82f6"
            : "0 0 0 3px #a855f7"
          : "none",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, color: side === "p1" ? "#1e40af" : "#7e22ce", marginBottom: 4 }}>
        {side === "p1" ? "🟦" : "🟣"} {name}
      </div>

      <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{score} pts</div>

      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
        🏆 {wins} rondas · 🔥 racha {streak}
      </div>
    </div>
  );
}

function SceneText({ scene, target, foundIdx, wrongIdxs, revealed, onClickWord }: {
  scene: string;
  target: string;
  foundIdx: number | null;
  wrongIdxs: Set<number>;
  revealed: boolean;
  onClickWord: (idx: number, targetIdx: number) => void;
}) {
  const tokens = tokenize(scene);
  const targetIdx = findTargetTokenIdx(tokens, target);

  return (
    <p style={{ fontSize: 15, lineHeight: 1.9, color: "#111827" }}>
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;

        const core = stripPunct(tok);

        if (core.length <= 2) return <span key={i}>{tok}</span>;

        const isTarget = i === targetIdx;
        const isFound = isTarget && foundIdx !== null;
        const isReveal = isTarget && revealed && foundIdx === null;
        const isWrong = wrongIdxs.has(i);

        return (
          <span
            key={i}
            onClick={() => onClickWord(i, targetIdx)}
            style={{
              cursor: "pointer",
              borderRadius: 4,
              padding: "0 3px",
              borderBottom: "1.5px dashed #aaa",
              background: isFound ? "#bbf7d0" : isReveal || isWrong ? "#fecaca" : "transparent",
              color: isFound ? "#14532d" : isReveal ? "#7f1d1d" : "#111827",
              fontWeight: isFound || isReveal ? 800 : 400,
            }}
          >
            {tok}
          </span>
        );
      })}
    </p>
  );
}

export default function VersusPage() {
  const {
    state,
    player1,
    player2,
    currentRound,
    startGame,
    clickWord,
    nextRound,
    requestHint,
    resetGame,
  } = useVersus();

  if (state.phase === "setup") {
    return <SetupScreen onStart={startGame} />;
  }

  const isRoundEnd = state.phase === "round-end";
  const isLastRound = state.roundNumber >= state.totalRounds;
  const currentPlayer = state.currentPlayer === 1 ? player1 : player2;

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>⚔️ Modo Versus</h1>

          <p style={{ fontSize: 12, color: "#6b7280" }}>
            Ronda {state.roundNumber} de {state.totalRounds} · {state.diff}
          </p>
        </div>

        <button
          onClick={resetGame}
          style={{
            fontSize: 12,
            padding: "5px 12px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            cursor: "pointer",
          }}
        >
          ✕ Salir
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <PlayerCard {...player1} isActive={state.currentPlayer === 1 && !isRoundEnd} side="p1" />

        <div style={{ display: "flex", alignItems: "center", fontWeight: 800, color: "#9ca3af", fontSize: 18 }}>
          VS
        </div>

        <PlayerCard {...player2} isActive={state.currentPlayer === 2 && !isRoundEnd} side="p2" />
      </div>

      {currentRound && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>Busca:</span>

            <span
              style={{
                background: "#dbeafe",
                color: "#1e40af",
                fontWeight: 800,
                fontSize: 15,
                padding: "5px 18px",
                borderRadius: 20,
              }}
            >
              {currentRound.target}
            </span>

            {state.showHint && (
              <span style={{ fontSize: 13, color: "#6b7280", fontStyle: "italic" }}>
                💡 {currentRound.hint}
              </span>
            )}
          </div>

          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "20px 24px",
              marginBottom: 12,
            }}
          >
            <SceneText
              scene={currentRound.scene}
              target={currentRound.target}
              foundIdx={state.foundIdx}
              wrongIdxs={state.wrongIdxs}
              revealed={state.revealed}
              onClickWord={clickWord}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                Turno de{" "}
                <b style={{ color: state.currentPlayer === 1 ? "#1e40af" : "#7e22ce" }}>
                  {currentPlayer.name}
                </b>
              </p>
            </div>

            {!isRoundEnd && (
              <button
                onClick={requestHint}
                style={{
                  fontSize: 13,
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  cursor: "pointer",
                }}
              >
                💡 Pista
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}