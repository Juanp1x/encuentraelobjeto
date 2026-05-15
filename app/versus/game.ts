"use client";

import { useState, useCallback } from "react";
import { Difficulty, GameState, Player, Round } from "./types";

export const ROUNDS: Record<Difficulty, Round[]> = {
  fácil: [
    {
      target: "paraguas",
      hint: "Te protege de la lluvia",
      scene:
        "Era una mañana gris y nublada en el parque. Los niños corrían entre los charcos mientras sus madres los llamaban desde los bancos. Una señora mayor sacó su paraguas rojo del bolso antes de que empezara a llover.",
    },
    {
      target: "linterna",
      hint: "Da luz en la oscuridad",
      scene:
        "El campamento quedó en silencio cuando cayó la noche. Marcos buscó dentro de su mochila y encontró la linterna justo a tiempo.",
    },
  ],

  normal: [
    {
      target: "brújula",
      hint: "Marca el norte",
      scene:
        "El grupo de senderistas caminaba por el bosque. María sacó la brújula de su chaleco y comprobó la dirección.",
    },
  ],

  difícil: [
    {
      target: "compás",
      hint: "Se usa para dibujar círculos",
      scene:
        "El aula de dibujo técnico tenía mesas llenas de reglas y lápices. En un cajón abierto había un compás oxidado.",
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

const DEFAULT_PLAYER = (id: 1 | 2, name: string): Player => ({
  id,
  name,
  score: 0,
  streak: 0,
  wins: 0,
});

const TRIES_PER_ROUND = 3;

export function useVersus() {
  const [player1, setPlayer1] = useState<Player>(
    DEFAULT_PLAYER(1, "Jugador 1")
  );

  const [player2, setPlayer2] = useState<Player>(
    DEFAULT_PLAYER(2, "Jugador 2")
  );

  const [currentRound, setCurrentRound] = useState<Round | null>(null);

  const [state, setState] = useState<GameState>({
    phase: "setup",
    currentPlayer: 1,
    roundNumber: 0,
    totalRounds: 6,
    tries: TRIES_PER_ROUND,
    showHint: false,
    foundIdx: null,
    wrongIdxs: new Set(),
    revealed: false,
    feedback: null,
    roundWinner: null,
    diff: "fácil",
  });

  const startGame = useCallback(
    (
      p1Name: string,
      p2Name: string,
      diff: Difficulty,
      rounds: number
    ) => {
      setPlayer1(DEFAULT_PLAYER(1, p1Name));
      setPlayer2(DEFAULT_PLAYER(2, p2Name));

      setCurrentRound(ROUNDS[diff][0]);

      setState({
        phase: "playing",
        currentPlayer: 1,
        roundNumber: 1,
        totalRounds: rounds,
        tries: TRIES_PER_ROUND,
        showHint: false,
        foundIdx: null,
        wrongIdxs: new Set(),
        revealed: false,
        feedback: null,
        roundWinner: null,
        diff,
      });
    },
    []
  );

  const clickWord = useCallback((idx: number, targetIdx: number) => {
    if (idx === targetIdx) {
      setState((s) => ({
        ...s,
        foundIdx: idx,
      }));
    }
  }, []);

  const requestHint = useCallback(() => {
    setState((s) => ({
      ...s,
      showHint: true,
    }));
  }, []);

  const nextRound = useCallback(() => {}, []);

  const resetGame = useCallback(() => {
    setState({
      phase: "setup",
      currentPlayer: 1,
      roundNumber: 0,
      totalRounds: 6,
      tries: TRIES_PER_ROUND,
      showHint: false,
      foundIdx: null,
      wrongIdxs: new Set(),
      revealed: false,
      feedback: null,
      roundWinner: null,
      diff: "fácil",
    });

    setCurrentRound(null);
  }, []);

  return {
    state,
    player1,
    player2,
    currentRound,
    startGame,
    clickWord,
    nextRound,
    requestHint,
    resetGame,
  };
}