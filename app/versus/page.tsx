"use client";

import { useState, useCallback } from "react";
import { Difficulty, GameState, Player, Round } from "./types";

// ─── Escenas ─────────────────────────────────────────────────────────────────

export const ROUNDS: Record<Difficulty, Round[]> = {
  fácil: [
    {
      target: "paraguas",
      hint: "Te protege de la lluvia",
      scene:
        "Era una mañana gris y nublada en el parque. Los niños corrían entre los charcos mientras sus madres los llamaban desde los bancos. Una señora mayor sacó su paraguas rojo del bolso antes de que empezara a llover. Los patos del estanque nadaban tranquilamente sin importarles el cielo oscuro.",
    },
    {
      target: "linterna",
      hint: "Da luz en la oscuridad",
      scene:
        "El campamento quedó en silencio cuando cayó la noche. Las estrellas brillaban sobre los pinos y el viento movía suavemente las carpas. Marcos buscó dentro de su mochila y encontró la linterna justo a tiempo. El haz de luz iluminó el camino hacia los baños del camping.",
    },
    {
      target: "llave",
      hint: "Abre puertas",
      scene:
        "La casa olía a café recién hecho cuando llegamos. Mi abuela nos esperaba en la puerta con su delantal de flores. Sobre la mesita de la entrada había una llave colgada de un llavero con forma de mariposa. Las plantas del jardín estaban perfectamente regadas y ordenadas.",
    },
    {
      target: "bicicleta",
      hint: "Tiene dos ruedas",
      scene:
        "El domingo por la mañana el barrio estaba tranquilo. Algunos vecinos paseaban a sus perros por las aceras vacías. Frente a la panadería estaba aparcada una bicicleta azul con una cesta llena de pan. El olor a croissants recién horneados se escapaba por la puerta abierta.",
    },
    {
      target: "espejo",
      hint: "Refleja tu imagen",
      scene:
        "El hotel tenía pasillos largos con moqueta roja. Las habitaciones eran pequeñas pero acogedoras y bien decoradas. En la pared del baño colgaba un espejo ovalado con marco dorado. La vista desde la ventana daba directamente al puerto y al mar.",
    },
    {
      target: "guitarra",
      hint: "Instrumento de cuerdas",
      scene:
        "La fiesta empezó al anochecer en el patio trasero. Había farolillos de colores colgados entre los árboles y una mesa llena de tapas. En un rincón, apoyada contra la pared, descansaba una guitarra española de madera oscura. Todo el mundo esperaba que alguien empezara a tocar.",
    },
  ],
  normal: [
    {
      target: "calendario",
      hint: "Tiene días y meses",
      scene:
        "La oficina estaba abarrotada de gente un lunes por la mañana. Los teléfonos sonaban sin parar y las impresoras escupían papeles a toda velocidad. Ana buscaba nerviosamente entre los papeles apilados sobre su escritorio. Debajo de una taza de café encontró el calendario con todas las reuniones marcadas en rojo. Su compañero Luis seguía mirando la pantalla sin levantar la vista. El aire acondicionado zumbaba ruidosamente en el techo.",
    },
    {
      target: "brújula",
      hint: "Marca el norte",
      scene:
        "El grupo de senderistas llevaba tres horas caminando por el bosque espeso. Los árboles eran tan altos que apenas dejaban pasar la luz del sol. María sacó la brújula de su chaleco naranja y comprobó la dirección. A lo lejos se oía el sonido de un río entre las rocas. Los demás se detuvieron a beber agua y a comer unas barritas energéticas. El cielo empezaba a encapotarse por el oeste.",
    },
    {
      target: "microscopio",
      hint: "Agranda objetos pequeños",
      scene:
        "El laboratorio olía a productos químicos y papel mojado. Los estudiantes tomaban notas en cuadernos llenos de fórmulas y diagramas. En la esquina de la sala, sobre una mesa de acero, había un microscopio de color negro con una pegatina con el número doce. La profesora explicaba el ciclo celular con mucha paciencia. Fuera de las ventanas empañadas caía una lluvia suave y constante. Alguien había olvidado un sándwich envuelto en papel de aluminio encima de la estantería.",
    },
    {
      target: "termómetro",
      hint: "Mide la temperatura",
      scene:
        "La clínica estaba llena de gente con mascarilla y pañuelos. Los niños lloraban en los brazos de sus padres mientras esperaban turno. Una enfermera cruzó la sala con una bandeja metálica en la que había un termómetro, varias jeringuillas y unos guantes de látex. El televisor del techo emitía un programa de cocina sin sonido. Las sillas de plástico azul estaban pegadas a la pared como si nadie quisiera estar en el centro de la habitación.",
    },
  ],
  difícil: [
    {
      target: "dedal",
      hint: "Protege el dedo al coser",
      scene:
        "La habitación de mi bisabuela conservaba el aroma de la lavanda y la madera vieja. Había cajas de cartón apiladas junto a la ventana, algunas abiertas y otras selladas con cinta amarilla. Sobre el escritorio de roble descansaban una lámpara de cristal, varios carretes de hilo de colores y un dedal plateado casi invisible entre los botones sueltos. La colcha de la cama estaba bordada con flores azules que ella misma había cosido durante décadas. En el suelo, una alfombra desgastada guardaba la huella de los pasos de toda una vida. El reloj de pared marcaba las tres y cuarto sin que nadie lo escuchara.",
    },
    {
      target: "veleta",
      hint: "Indica la dirección del viento",
      scene:
        "El pueblo era uno de esos lugares que el tiempo parece haber olvidado. Las calles empedradas bajaban en zigzag hacia la plaza, donde una fuente de piedra goteaba sin pausa. Los balcones estaban llenos de macetas con geranios rojos y ropa tendida al sol. En lo más alto del campanario oxidado giraba lentamente una veleta con forma de gallo negro. Los ancianos del bar discutían sobre el partido de la noche anterior sin demasiado calor. Un gato anaranjado cruzó la calle sin mirar y desapareció entre dos casas blancas. El olor a pan y a anís llegaba desde la tahona del final de la calle.",
    },
    {
      target: "compás",
      hint: "Se usa para dibujar círculos",
      scene:
        "El aula de dibujo técnico tenía una luz fría y azulada que lo hacía todo parecer más serio. Las mesas estaban llenas de planos enrollados, escuadras y lápices de distintos grosores. En el cajón entreabierto de la tercera mesa se veía un compás con la punta oxidada junto a una goma de borrar casi consumida. El profesor escribía en la pizarra verde sin darse la vuelta mientras los alumnos copiaban en silencio. Alguien había pegado en la pared una lámina del sistema solar con las órbitas trazadas a mano. La ventana daba al patio, donde los alumnos de primaria gritaban y corrían con toda la energía del mundo.",
    },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function tokenize(text: string): string[] {
  return text.split(/(\s+)/);
}

export function stripPunct(w: string): string {
  return w.replace(/^[¿¡"'(«]+|[.,;:!?)"'»]+$/g, "");
}

export function findTargetTokenIdx(tokens: string[], target: string): number {
  for (let i = 0; i < tokens.length; i++) {
    const core = stripPunct(tokens[i]);
    if (core.toLowerCase() === target.toLowerCase()) return i;
  }
  return -1;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

const DEFAULT_PLAYER = (id: 1 | 2, name: string): Player => ({
  id,
  name,
  score: 0,
  streak: 0,
  wins: 0,
});

const TRIES_PER_ROUND = 3;

export function useVersus() {
  const [player1, setPlayer1] = useState<Player>(DEFAULT_PLAYER(1, "Jugador 1"));
  const [player2, setPlayer2] = useState<Player>(DEFAULT_PLAYER(2, "Jugador 2"));
  const [usedIndices, setUsedIndices] = useState<number[]>([]);

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

  const [currentRound, setCurrentRound] = useState<Round | null>(null);

  // Pick a random unused round
  const pickRound = useCallback(
    (diff: Difficulty): Round => {
      const pool = ROUNDS[diff];
      const available = pool
        .map((_, i) => i)
        .filter((i) => !usedIndices.includes(i));
      const idx =
        available.length > 0
          ? available[Math.floor(Math.random() * available.length)]
          : Math.floor(Math.random() * pool.length);
      setUsedIndices((prev) => [...prev, idx]);
      return pool[idx];
    },
    [usedIndices]
  );

  // ── Actions ──────────────────────────────────────────────────────────────

  const startGame = useCallback(
    (p1Name: string, p2Name: string, diff: Difficulty, totalRounds: number) => {
      const round = pickRound(diff);
      setPlayer1(DEFAULT_PLAYER(1, p1Name || "Jugador 1"));
      setPlayer2(DEFAULT_PLAYER(2, p2Name || "Jugador 2"));
      setCurrentRound(round);
      setUsedIndices([]);
      setState({
        phase: "playing",
        currentPlayer: 1,
        roundNumber: 1,
        totalRounds,
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
    [pickRound]
  );

  const clickWord = useCallback(
    (idx: number, targetIdx: number) => {
      if (state.phase !== "playing" || state.foundIdx !== null) return;

      const isTarget = idx === targetIdx;
      const currentP = state.currentPlayer === 1 ? player1 : player2;
      const setCurrentP = state.currentPlayer === 1 ? setPlayer1 : setPlayer2;

      if (isTarget) {
        const pts =
          state.diff === "fácil" ? 10 : state.diff === "normal" ? 20 : 35;
        const bonus =
          currentP.streak >= 3 ? Math.floor(pts * 0.5) : 0;
        const earned = pts + bonus;

        setCurrentP((p) => ({
          ...p,
          score: p.score + earned,
          streak: p.streak + 1,
          wins: p.wins + 1,
        }));

        setState((s) => ({
          ...s,
          foundIdx: idx,
          phase: "round-end",
          roundWinner: s.currentPlayer,
          feedback: {
            msg:
              bonus > 0
                ? `¡${currentP.name} encontró el objeto! +${pts} pts 🎉 Bonus racha: +${bonus}`
                : `¡${currentP.name} encontró el objeto! +${earned} pts 🎉`,
            ok: true,
          },
        }));
      } else {
        const newTries = state.tries - 1;

        setState((s) => {
          const newWrong = new Set(s.wrongIdxs).add(idx);
          if (newTries <= 0) {
            // Both failed this round → next player also can't, end round no winner
            return {
              ...s,
              tries: 0,
              wrongIdxs: newWrong,
              revealed: true,
              phase: "round-end",
              roundWinner: "tie",
              feedback: {
                msg: `Sin intentos. Era: "${currentRound?.target}"`,
                ok: false,
              },
            };
          }
          return {
            ...s,
            tries: newTries,
            wrongIdxs: newWrong,
            feedback: {
              msg: `Incorrecto, quedan ${newTries} intento${newTries !== 1 ? "s" : ""}`,
              ok: false,
            },
          };
        });

        // Remove wrong highlight after animation
        setTimeout(() => {
          setState((s) => {
            const n = new Set(s.wrongIdxs);
            n.delete(idx);
            return { ...s, wrongIdxs: n };
          });
        }, 380);

        if (newTries <= 0) {
          // Reset streak for current player
          setCurrentP((p) => ({ ...p, streak: 0 }));
        }
      }
    },
    [state, player1, player2, currentRound]
  );

  const nextRound = useCallback(() => {
    const isLast = state.roundNumber >= state.totalRounds;
    if (isLast) {
      setState((s) => ({ ...s, phase: "game-over" }));
      return;
    }
    const round = pickRound(state.diff);
    setCurrentRound(round);
    setState((s) => ({
      ...s,
      phase: "playing",
      currentPlayer: s.currentPlayer === 1 ? 2 : 1,
      roundNumber: s.roundNumber + 1,
      tries: TRIES_PER_ROUND,
      showHint: false,
      foundIdx: null,
      wrongIdxs: new Set(),
      revealed: false,
      feedback: null,
      roundWinner: null,
    }));
  }, [state, pickRound]);

  const requestHint = useCallback(() => {
    setState((s) => ({ ...s, showHint: true }));
  }, []);

  const resetGame = useCallback(() => {
    setPlayer1(DEFAULT_PLAYER(1, "Jugador 1"));
    setPlayer2(DEFAULT_PLAYER(2, "Jugador 2"));
    setUsedIndices([]);
    setCurrentRound(null);
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