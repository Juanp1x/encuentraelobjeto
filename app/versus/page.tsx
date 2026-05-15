"use client";

import { useState } from "react";

import {
  useVersus,
  tokenize,
  stripPunct,
  findTargetTokenIdx,
} from "./game";

import { Difficulty } from "./types";

export default function VersusPage() {
  const {
    state,
    currentRound,
    startGame,
    clickWord,
    requestHint,
  } = useVersus();

  const [started, setStarted] = useState(false);

  const start = () => {
    startGame("Jugador 1", "Jugador 2", "fácil", 6);
    setStarted(true);
  };

  if (!started) {
    return (
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <h1>⚔️ Modo Versus</h1>

        <button
          onClick={start}
          style={{
            padding: "12px 20px",
            borderRadius: 10,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Iniciar partida
        </button>
      </div>
    );
  }

  if (!currentRound) return null;

  const tokens = tokenize(currentRound.scene);

  const targetIdx = findTargetTokenIdx(
    tokens,
    currentRound.target
  );

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1>⚔️ Versus</h1>

      <p>
        Busca:
        <b> {currentRound.target}</b>
      </p>

      {state.showHint && (
        <p>💡 {currentRound.hint}</p>
      )}

      <button
        onClick={requestHint}
        style={{
          marginBottom: 20,
          padding: "8px 14px",
          borderRadius: 8,
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        Mostrar pista
      </button>

      <div
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          lineHeight: 2,
        }}
      >
        {tokens.map((tok, i) => {
          if (/^\s+$/.test(tok)) {
            return <span key={i}>{tok}</span>;
          }

          const core = stripPunct(tok);

          if (core.length <= 2) {
            return <span key={i}>{tok}</span>;
          }

          const isFound = i === state.foundIdx;

          return (
            <span
              key={i}
              onClick={() => clickWord(i, targetIdx)}
              style={{
                cursor: "pointer",
                padding: "2px 4px",
                borderRadius: 4,
                background: isFound
                  ? "#86efac"
                  : "transparent",
              }}
            >
              {tok}
            </span>
          );
        })}
      </div>
    </div>
  );
}