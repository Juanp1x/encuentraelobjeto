export type Difficulty = "fácil" | "normal" | "difícil";

export interface Round {
  target: string;
  hint: string;
  scene: string;
}

export interface Player {
  id: 1 | 2;
  name: string;
  score: number;
  streak: number;
  wins: number;
}

export interface GameState {
  phase: "setup" | "playing" | "round-end" | "game-over";
  currentPlayer: 1 | 2;
  roundNumber: number;
  totalRounds: number;
  tries: number;
  showHint: boolean;
  foundIdx: number | null;
  wrongIdxs: Set<number>;
  revealed: boolean;
  feedback: { msg: string; ok: boolean } | null;
  roundWinner: 1 | 2 | "tie" | null;
  diff: Difficulty;
}