import { useMemo, useState } from "react";
import { playBeam, playCorrect, playNeutral, playTap } from "../../audio";
import { fuelFor } from "../../engine/session";
import { makeTrashRound, type TrashPiece } from "../../modes/arcade";
import { ArcadeHud } from "./ArcadeHud";
import { ArcadeSpace, SparkBurst } from "./Fx";

const KINDS: Record<TrashPiece["kind"], string> = {
  can: "🥫",
  boot: "👢",
  peel: "🍌",
  box: "📦",
  bolt: "🔩",
};

const SLOTS = [
  { left: "14%", top: "8%", beam: -38 },
  { left: "58%", top: "6%", beam: 34 },
  { left: "16%", top: "42%", beam: -18 },
  { left: "56%", top: "40%", beam: 20 },
];

export function TrashZapper({
  level,
  rounds,
  onComplete,
  onPause,
}: {
  level: number;
  rounds: number;
  onComplete: (fuel: number, correct: number) => void;
  onPause: () => void;
}) {
  const [round, setRound] = useState(0);
  const [fuel, setFuel] = useState(0);
  const [correctN, setCorrectN] = useState(0);
  const [hint, setHint] = useState(false);
  const [misses, setMisses] = useState(0);
  const [caught, setCaught] = useState<number | null>(null);
  const [shake, setShake] = useState<number | null>(null);
  const pack = useMemo(() => makeTrashRound(level), [round, level]);

  function tap(piece: TrashPiece, slot: number) {
    if (caught != null) return;
    playTap();
    if (piece.correct) {
      playBeam();
      playCorrect();
      setCaught(slot);
      const add = fuelFor(true, misses === 0 && !hint);
      window.setTimeout(() => {
        const nextFuel = fuel + add;
        const nextCorrect = correctN + 1;
        if (round + 1 >= rounds) {
          onComplete(nextFuel, nextCorrect);
          return;
        }
        setFuel(nextFuel);
        setCorrectN(nextCorrect);
        setRound((r) => r + 1);
        setHint(false);
        setMisses(0);
        setCaught(null);
      }, 900);
      return;
    }
    playNeutral();
    setShake(slot);
    window.setTimeout(() => setShake(null), 400);
    setMisses((m) => m + 1);
    setHint(true);
  }

  const showAnswer = misses >= 2;
  const beam = caught != null ? SLOTS[caught] : null;

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <ArcadeSpace />
      <ArcadeHud
        title="Tractor Trash"
        index={round}
        total={rounds}
        fuel={fuel}
        onHint={() => setHint(true)}
        onPause={onPause}
        hint={showAnswer ? `The matching junk shows ${pack.problem.answer}.` : pack.problem.hint}
        hintVisible={hint || showAnswer}
      />
      <p className="relative z-10 px-[80px] text-center font-medium text-yellow-50" style={{ fontSize: 36 }}>
        {pack.problem.prompt}
      </p>
      <p className="relative z-10 mt-1 text-center text-xl text-orange-200">Tap the junk. The tractor beam will grab it.</p>

      <div className="relative z-10 min-h-0 flex-1">
        {pack.trash.map((piece, i) => (
          <button
            key={piece.id}
            type="button"
            onClick={() => tap(piece, i)}
            className={`trash-piece trash-float-${i} ${caught === i ? `trash-caught-${i}` : ""} ${shake === i ? "trash-shake" : ""} ${
              showAnswer && piece.correct ? "ring-4 ring-yellow-300" : ""
            }`}
            style={{ left: SLOTS[i]!.left, top: SLOTS[i]!.top }}
          >
            <span className="text-4xl">{KINDS[piece.kind]}</span>
            <span className="text-[40px] font-semibold leading-none">{piece.value}</span>
          </button>
        ))}

        {beam && (
          <div className="beam-pivot" style={{ transform: `translateX(-50%) rotate(${beam.beam}deg)` }}>
            <div className="tractor-beam" />
          </div>
        )}
        {caught != null && <SparkBurst />}

        <img src="/ship-plain.png" alt="" className="zapper-ship" />
      </div>
    </div>
  );
}
