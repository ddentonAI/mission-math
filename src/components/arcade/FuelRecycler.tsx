import { useMemo, useState } from "react";
import { playCorrect, playNeutral, playTap, playWhoosh } from "../../audio";
import { fuelFor } from "../../engine/session";
import { evalRecycler, makeRecyclerRound } from "../../modes/arcade";
import { ArcadeHud } from "./ArcadeHud";
import { ArcadeSpace, SparkBurst } from "./Fx";

export function FuelRecycler({
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
  const [a, setA] = useState<number | null>(null);
  const [op, setOp] = useState<"+" | "-" | "×" | null>(null);
  const [b, setB] = useState<number | null>(null);
  const [melting, setMelting] = useState(false);
  const pack = useMemo(() => makeRecyclerRound(level), [round, level]);

  const result = a != null && op && b != null ? evalRecycler(a, op, b) : null;
  const ready = result === pack.target;
  const filled = Math.min(rounds, round + (melting ? 1 : 0));

  function pickNum(n: number) {
    playTap();
    if (a == null) setA(n);
    else if (op && b == null) setB(n);
  }

  function melt() {
    if (result == null || melting) return;
    if (result !== pack.target) {
      playNeutral();
      setMisses((m) => m + 1);
      setHint(true);
      return;
    }
    playWhoosh();
    playCorrect();
    setMelting(true);
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
      setA(null);
      setOp(null);
      setB(null);
      setHint(false);
      setMisses(0);
      setMelting(false);
    }, 900);
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <ArcadeSpace />
      <ArcadeHud
        title="Fuel Recycler"
        index={round}
        total={rounds}
        fuel={fuel}
        onHint={() => setHint(true)}
        onPause={onPause}
        hint={pack.hint}
        hintVisible={hint}
      />
      {melting && <SparkBurst />}

      <div className="relative z-10 flex min-h-0 flex-1 gap-6 px-[72px]">
        <div className="flex flex-col items-center justify-end pb-8">
          <p className="mb-2 text-xl text-orange-200">Fuel tank</p>
          <div className="fuel-tank">
            {Array.from({ length: rounds }, (_, i) => (
              <div key={i} className={`fuel-seg ${i < filled ? "fuel-seg-on" : ""}`} />
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-center font-medium text-yellow-50" style={{ fontSize: 36 }}>
            Make {pack.target}
          </p>
          <p className="mt-1 text-center text-xl text-orange-200">Tap a number, a sign, then a number.</p>

          <div className="mt-5 flex items-center justify-center gap-4 text-[44px] font-semibold">
            <Slot v={a} onClear={() => setA(null)} pop={a != null} />
            <Slot v={op} onClear={() => setOp(null)} pop={op != null} />
            <Slot v={b} onClear={() => setB(null)} pop={b != null} />
            <span className="text-yellow-100">=</span>
            <div
              className={`flex h-[88px] min-w-[120px] items-center justify-center rounded-2xl ${
                ready ? "bg-orange-400 text-[#1a1030] result-pulse" : "bg-white/12"
              }`}
            >
              {result ?? "?"}
            </div>
          </div>

          <div className={`vat mt-4 ${melting ? "vat-hot" : ""}`}>
            <div className={`junk-drop ${melting ? "junk-dropping" : ""}`}>📦</div>
          </div>

          <div className="mx-auto mt-4 flex flex-wrap justify-center gap-3" style={{ maxWidth: 720 }}>
            {pack.numbers.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => pickNum(n)}
                className="flex items-center justify-center rounded-2xl bg-white/12 text-[36px] font-semibold"
                style={{ width: 88, height: 88 }}
              >
                {n}
              </button>
            ))}
            {pack.ops.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => {
                  playTap();
                  if (a != null) setOp(o);
                }}
                className="flex items-center justify-center rounded-2xl bg-cyan-200/20 text-[36px] font-semibold"
                style={{ width: 88, height: 88 }}
              >
                {o}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setA(null);
                setOp(null);
                setB(null);
              }}
              className="flex items-center justify-center rounded-2xl bg-white/10 text-xl"
              style={{ minWidth: 88, height: 88, padding: "0 16px" }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto flex justify-end pb-6 pr-[72px]">
        <button
          type="button"
          onClick={melt}
          className={`h-[88px] min-w-[220px] rounded-full px-8 text-3xl font-semibold ${
            ready ? "bg-orange-400 text-[#1a1030] result-pulse" : "bg-white/15 text-yellow-100"
          }`}
        >
          Melt junk
        </button>
      </div>
    </div>
  );
}

function Slot({
  v,
  onClear,
  pop,
}: {
  v: string | number | null;
  onClear: () => void;
  pop: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClear}
      className={`flex h-[88px] min-w-[88px] items-center justify-center rounded-2xl bg-white/12 px-4 ${pop ? "slot-pop" : ""}`}
    >
      {v ?? "·"}
    </button>
  );
}
