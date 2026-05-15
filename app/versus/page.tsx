"use client";

import {
  useVersus,
  tokenize,
  stripPunct,
  findTargetTokenIdx,
} from "./game";

export default function VersusPage() {
  const { currentRound } = useVersus();

  if (!currentRound) {
    return <div>No hay ronda.</div>;
  }

  const tokens = tokenize(currentRound.scene);

  const targetIdx = findTargetTokenIdx(
    tokens,
    currentRound.target
  );

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1>⚔️ Modo Versus</h1>

      <p>
        Encuentra el objeto:
        <b> {currentRound.target}</b>
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 20,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <p style={{ lineHeight: 2 }}>
          {tokens.map((tok, i) => {
            if (/^\s+$/.test(tok)) {
              return <span key={i}>{tok}</span>;
            }

            const core = stripPunct(tok);

            const isTarget =
              core.toLowerCase() ===
              currentRound.target.toLowerCase();

            return (
              <span
                key={i}
                style={{
                  background:
                    i === targetIdx
                      ? "#fde68a"
                      : "transparent",
                  cursor: "pointer",
                }}
              >
                {tok}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}