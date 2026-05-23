"use client";

import { useState, useCallback } from "react";

type Difficulty = "fácil" | "normal" | "difícil";

interface Round {
  target: string;
  hint: string;
  scene: string;
}

const ROUNDS: Record<Difficulty, Round[]> = {
  fácil: [
    { target: "paraguas", hint: "Te protege de la lluvia", scene: "Era una mañana gris y nublada en el parque. Los niños corrían entre los charcos mientras sus madres los llamaban desde los bancos. Una señora mayor sacó su paraguas rojo del bolso antes de que empezara a llover. Los patos del estanque nadaban tranquilamente sin importarles el cielo oscuro." },
    { target: "linterna", hint: "Da luz en la oscuridad", scene: "El campamento quedó en silencio cuando cayó la noche. Las estrellas brillaban sobre los pinos y el viento movía suavemente las carpas. Marcos buscó dentro de su mochila y encontró la linterna justo a tiempo. El haz de luz iluminó el camino hacia los baños del camping." },
    { target: "llave", hint: "Abre puertas", scene: "La casa olía a café recién hecho cuando llegamos. Mi abuela nos esperaba en la puerta con su delantal de flores. Sobre la mesita de la entrada había una llave colgada de un llavero con forma de mariposa. Las plantas del jardín estaban perfectamente regadas y ordenadas." },
    { target: "bicicleta", hint: "Tiene dos ruedas", scene: "El domingo por la mañana el barrio estaba tranquilo. Algunos vecinos paseaban a sus perros por las aceras vacías. Frente a la panadería estaba aparcada una bicicleta azul con una cesta llena de pan. El olor a croissants recién horneados se escapaba por la puerta abierta." },
    { target: "espejo", hint: "Refleja tu imagen", scene: "El hotel tenía pasillos largos con moqueta roja. Las habitaciones eran pequeñas pero acogedoras y bien decoradas. En la pared del baño colgaba un espejo ovalado con marco dorado. La vista desde la ventana daba directamente al puerto y al mar." },
    { target: "guitarra", hint: "Instrumento de cuerdas", scene: "La fiesta empezó al anochecer en el patio trasero. Había farolillos de colores colgados entre los árboles y una mesa llena de tapas. En un rincón, apoyada contra la pared, descansaba una guitarra española de madera oscura. Todo el mundo esperaba que alguien empezara a tocar." },
  ],
  normal: [
    { target: "calendario", hint: "Tiene días y meses", scene: "La oficina estaba abarrotada de gente un lunes por la mañana. Los teléfonos sonaban sin parar y las impresoras escupían papeles a toda velocidad. Ana buscaba nerviosamente entre los papeles apilados sobre su escritorio. Debajo de una taza de café encontró el calendario con todas las reuniones marcadas en rojo. Su compañero Luis seguía mirando la pantalla sin levantar la vista. El aire acondicionado zumbaba ruidosamente en el techo." },
    { target: "brújula", hint: "Marca el norte", scene: "El grupo de senderistas llevaba tres horas caminando por el bosque espeso. Los árboles eran tan altos que apenas dejaban pasar la luz del sol. María sacó la brújula de su chaleco naranja y comprobó la dirección. A lo lejos se oía el sonido de un río entre las rocas. Los demás se detuvieron a beber agua y a comer unas barritas energéticas. El cielo empezaba a encapotarse por el oeste." },
    { target: "microscopio", hint: "Agranda objetos pequeños", scene: "El laboratorio olía a productos químicos y papel mojado. Los estudiantes tomaban notas en cuadernos llenos de fórmulas y diagramas. En la esquina de la sala, sobre una mesa de acero, había un microscopio de color negro con una pegatina con el número doce. La profesora explicaba el ciclo celular con mucha paciencia. Fuera de las ventanas empañadas caía una lluvia suave y constante." },
    { target: "termómetro", hint: "Mide la temperatura", scene: "La clínica estaba llena de gente con mascarilla y pañuelos. Los niños lloraban en los brazos de sus padres mientras esperaban turno. Una enfermera cruzó la sala con una bandeja metálica en la que había un termómetro, varias jeringuillas y unos guantes de látex. El televisor del techo emitía un programa de cocina sin sonido." },
  ],
  difícil: [
    { target: "dedal", hint: "Protege el dedo al coser", scene: "La habitación de mi bisabuela conservaba el aroma de la lavanda y la madera vieja. Había cajas de cartón apiladas junto a la ventana, algunas abiertas y otras selladas con cinta amarilla. Sobre el escritorio de roble descansaban una lámpara de cristal, varios carretes de hilo de colores y un dedal plateado casi invisible entre los botones sueltos. La colcha de la cama estaba bordada con flores azules que ella misma había cosido durante décadas." },
    { target: "veleta", hint: "Indica la dirección del viento", scene: "El pueblo era uno de esos lugares que el tiempo parece haber olvidado. Las calles empedradas bajaban en zigzag hacia la plaza, donde una fuente de piedra goteaba sin pausa. Los balcones estaban llenos de macetas con geranios rojos y ropa tendida al sol. En lo más alto del campanario oxidado giraba lentamente una veleta con forma de gallo negro." },
    { target: "compás", hint: "Se usa para dibujar círculos", scene: "El aula de dibujo técnico tenía una luz fría y azulada que lo hacía todo parecer más serio. Las mesas estaban llenas de planos enrollados, escuadras y lápices de distintos grosores. En el cajón entreabierto de la tercera mesa se veía un compás con la punta oxidada junto a una goma de borrar casi consumida." },
  ],
};

function tokenize(text: string): string[] {
  return text.split(/(\s+)/);
}

function stripPunct(w: string): string {
  return w.replace(/^[¿¡"'(«]+|[.,;:!?)"'»]+$/g, "");
}

export default function SoloPage() {
  const [diff, setDiff] = useState<Difficulty>("fácil");
  const [roundIdx, setRoundIdx] = useState(0);
  const [tries, setTries] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [active, setActive] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [foundIdx, setFoundIdx] = useState<number | null>(null);
  const [wrongIdxs, setWrongIdxs] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);

  const pool = ROUNDS[diff];
  const round = pool[roundIdx % pool.length];
  const tokens = tokenize(round.scene);

  const targetTokenIdx = (() => {
    for (let i = 0; i < tokens.length; i++) {
      if (stripPunct(tokens[i]).toLowerCase() === round.target.toLowerCase()) return i;
    }
    return -1;
  })();

  const nextRound = useCallback((newDiff?: Difficulty) => {
    const d = newDiff ?? diff;
    setRoundIdx(r => (r + 1) % ROUNDS[d].length);
    setTries(3);
    setActive(true);
    setShowHint(false);
    setFeedback(null);
    setFoundIdx(null);
    setWrongIdxs(new Set());
    setRevealed(false);
  }, [diff]);

  const handleDiff = (d: Difficulty) => {
    setDiff(d);
    setRoundIdx(0);
    setTries(3);
    setActive(true);
    setShowHint(false);
    setFeedback(null);
    setFoundIdx(null);
    setWrongIdxs(new Set());
    setRevealed(false);
  };

  const handleClick = (idx: number) => {
    if (!active || foundIdx !== null) return;
    const isTarget = idx === targetTokenIdx;
    if (isTarget) {
      setFoundIdx(idx);
      setActive(false);
      const pts = diff === "fácil" ? 10 : diff === "normal" ? 20 : 35;
      const bonus = streak >= 3 ? Math.floor(pts * 0.5) : 0;
      setScore(s => s + pts + bonus);
      setStreak(s => s + 1);
      setFeedback({ msg: bonus > 0 ? `¡Correcto! +${pts} pts 🎉 Bonus racha: +${bonus}` : `¡Correcto! +${pts} pts 🎉`, ok: true });
      setTimeout(() => nextRound(), 2200);
    } else {
      setWrongIdxs(prev => new Set(prev).add(idx));
      setTimeout(() => setWrongIdxs(prev => { const n = new Set(prev); n.delete(idx); return n; }), 380);
      const newTries = tries - 1;
      setTries(newTries);
      if (newTries <= 0) {
        setActive(false);
        setStreak(0);
        setRevealed(true);
        setFeedback({ msg: `Sin intentos. Era: "${round.target}"`, ok: false });
        setTimeout(() => nextRound(), 3000);
      } else {
        setFeedback({ msg: `Incorrecto, quedan ${newTries} intento${newTries !== 1 ? "s" : ""}`, ok: false });
      }
    }
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", maxWidth: 660, margin: "0 auto", padding: "2rem 1rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap');
        .word-span { cursor:pointer; border-radius:4px; padding:0 3px; border-bottom:1.5px dashed #aaa; transition:background .12s; display:inline; }
        .word-span:hover { background:#dbeafe; }
        .word-span.found { background:#bbf7d0!important; color:#14532d; font-weight:800; border-bottom:none; animation:pop .3s ease; pointer-events:none; }
        .word-span.reveal { background:#fecaca!important; color:#7f1d1d; font-weight:800; border-bottom:none; pointer-events:none; }
        .word-span.wrong { animation:shake .35s ease; background:#fecaca; }
        @keyframes pop { 0%,100%{transform:scale(1)} 50%{transform:scale(1.22)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 30%{transform:translateX(-5px)} 70%{transform:translateX(5px)} }
        .diff-btn { padding:4px 14px; border-radius:20px; font-size:13px; font-weight:700; border:1.5px solid #d1d5db; background:transparent; color:#6b7280; cursor:pointer; }
        .diff-btn.active { background:#dbeafe; color:#1e40af; border-color:#93c5fd; }
        .ctrl-btn { padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; border:1.5px solid #d1d5db; background:#fff; color:#374151; cursor:pointer; }
        .ctrl-btn:hover { background:#f3f4f6; }
        .ctrl-btn.primary { background:#059669; color:#fff; border-color:#059669; }
        .dot { width:11px; height:11px; border-radius:50%; background:#d1d5db; display:inline-block; transition:background .2s; }
        .dot.used { background:#ef4444; }
      `}</style>

      <div style={{ marginBottom: 4 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>🧩 Un jugador</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Haz clic en la palabra correcta dentro de la escena</p>
      </div>

      <div style={{ display: "flex", gap: 20, margin: "10px 0" }}>
        <span style={{ fontSize: 13, color: "#6b7280" }}>Puntos: <b style={{ color: "#111827" }}>{score}</b></span>
        <span style={{ fontSize: 13, color: "#6b7280" }}>Racha: <b style={{ color: "#111827" }}>{streak}</b></span>
      </div>

      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "#6b7280" }}>Dificultad:</span>
        {(["fácil", "normal", "difícil"] as Difficulty[]).map(d => (
          <button key={d} className={`diff-btn${diff === d ? " active" : ""}`} onClick={() => handleDiff(d)}>
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "#6b7280" }}>Busca:</span>
        <span style={{ background: "#dbeafe", color: "#1e40af", fontWeight: 800, fontSize: 16, padding: "5px 18px", borderRadius: 20 }}>{round.target}</span>
        {showHint && <span style={{ fontSize: 13, color: "#6b7280", fontStyle: "italic" }}>💡 {round.hint}</span>}
      </div>

      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px 24px", marginBottom: 12, lineHeight: 1.9, fontSize: 15, color: "#111827" }}>
        {tokens.map((tok, i) => {
          if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
          const core = stripPunct(tok);
          if (core.length <= 2) return <span key={i}>{tok}</span>;
          const pre = tok.slice(0, tok.length - tok.replace(/^[¿¡"'(«]+/, "").length);
          const suf = tok.slice(tok.replace(/[.,;:!?)"'»]+$/, "").length);
          const isTarget = i === targetTokenIdx;
          const cls = ["word-span",
            isTarget && foundIdx !== null ? "found" : "",
            isTarget && revealed && foundIdx === null ? "reveal" : "",
            wrongIdxs.has(i) ? "wrong" : "",
          ].filter(Boolean).join(" ");
          return (
            <span key={i}>
              {pre}<span className={cls} onClick={() => handleClick(i)}>{core}</span>{suf}
            </span>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Intentos:</span>
            {[0, 1, 2].map(i => <span key={i} className={`dot${i >= tries ? " used" : ""}`} />)}
          </div>
          {feedback && <p style={{ fontSize: 13, fontWeight: 700, color: feedback.ok ? "#14532d" : "#7f1d1d" }}>{feedback.msg}</p>}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="ctrl-btn" onClick={() => setShowHint(true)}>💡 Pista</button>
          <button className="ctrl-btn" onClick={() => { setStreak(0); nextRound(); }}>⏭ Saltar</button>
          <button className="ctrl-btn primary" onClick={() => nextRound()}>🎲 Nueva</button>
        </div>
      </div>
    </div>
  );
}