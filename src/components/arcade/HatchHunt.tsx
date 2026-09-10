import { useMemo, useState } from "react";
import { playCorrect, playNeutral, playTap, playWhoosh } from "../../audio";
import { fuelFor } from "../../engine/session";
import { makeHatchRound } from "../../modes/arcade";
import { ArcadeHud } from "./ArcadeHud";
import { ArcadeSpace, SparkBurst } from "./Fx";

export function HatchHunt({
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
  const [dive, setDive] = useState<number | null>(null);
  const pack = useMemo(() => makeHatchRound(level), [round, level]);

  function open(n: number, i: number) {
    if (dive != null) return;
    playTap();
    if (n === pack.problem.answer) {
      playWhoosh();
      playCorrect();
      setDive(i);
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
        setDive(null);
      }, 850);
      return;
    }
    playNeutral();
    setMisses((m) => m + 1);
    setHint(true);
  }

  const show = misses >= 2;

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <ArcadeSpace />
      <ArcadeHud
        title="Hatch Hunt"
        index={round}
        total={rounds}
        fuel={fuel}
        onHint={() => setHint(true)}
        onPause={onPause}
        hint={show ? `Open the hatch that shows ${pack.problem.answer}.` : pack.problem.hint}
        hintVisible={hint || show}
      />
      {dive != null && <SparkBurst />}
      <p className="relative z-10 px-[80px] text-center font-medium text-yellow-50" style={{ fontSize: 36 }}>
        {pack.problem.prompt}
      </p>
      <p className="relative z-10 mt-1 text-center text-xl text-orange-200">Fly into the right hatch.</p>
      <div className="relative z-10 mx-auto mt-5 grid grid-cols-2 gap-5" style={{ width: 640 }}>
        {pack.options.map((n, i) => (
          <button
            key={`${round}-${n}`}
            type="button"
            onClick={() => open(n, i)}
            className={`hatch ${dive === i ? "hatch-open" : ""} ${
              show && n === pack.problem.answer ? "ring-4 ring-yellow-300" : ""
            }`}
          >
            {dive === i && <img src="/ship-plain.png" alt="" className="hatch-ship" />}
            <span className="relative z-10">{n}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
