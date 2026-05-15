"use client";

import { useState } from "react";
import { Difficulty, GameState, Player, Round } from "./types";

export const ROUNDS: Record<Difficulty, Round[]> = {
  fácil: [
    {
      target: "paraguas",
      hint: "Te protege de la lluvia",
      scene:
        "Era una mañana gris y nublada. Una señora abrió su paraguas rojo mientras caminaba por el parque.",
    },
  ],

  normal: [
    {
      target: "brújula",
      hint: "Marca el norte",
      scene:
        "Los exploradores caminaban por el bosque mientras María observaba la brújula.",
    },
  ],

  difícil: [
    {
      target: "compás",
      hint: "Se usa para dibujar círculos",
      scene:
        "En la mesa del salón había un compás metálico junto a varios planos.",
    },
  ],
};

export function tokenize(text: string): string[] {
  return text.split(/(\s+)/);
}

export function stripPunct(w: string): string {
  return w.replace(/^[¿¡"'(«]+|[.,;:!?)"'»]+$/g, "");
}

export function findTargetTokenIdx(
  tokens: string[],
  target: string
): number {
  for (let i = 0; i < tokens.length; i++) {
    const core = stripPunct(tokens[i]);

    if (core.toLowerCase() === target.toLowerCase()) {
      return i;
    }
  }

  return -1;
}

const DEFAULT_PLAYER = (
  id: 1 | 2,
  name: string
): Player => ({
  id,
  name,
  score: 0,
  streak: 0,
  wins: 0,
});

export function useVersus() {
  const [player1] = useState<Player>(
    DEFAULT_PLAYER(1, "Jugador 1")
  );

  const [player2] = useState<Player>(
    DEFAULT_PLAYER(2, "Jugador 2")
  );

  const [state] = useState<GameState>({
    phase: "playing",
    currentPlayer: 1,
    roundNumber: 1,
    totalRounds: 6,
    tries: 3,
    showHint: false,
    foundIdx: null,
    wrongIdxs: new Set(),
    revealed: false,
    feedback: null,
    roundWinner: null,
    diff: "fácil",
  });

  const [currentRound] = useState<Round>(
    ROUNDS["fácil"][0]
  );

  return {
    state,
    player1,
    player2,
    currentRound,
    startGame: () => {},
    clickWord: () => {},
    nextRound: () => {},
    requestHint: () => {},
    resetGame: () => {},
  };
}