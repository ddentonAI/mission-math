import { useMemo, useState } from "react";
import { playCorrect, playNeutral, playTap, playWhoosh } from "../../audio";
import { fuelFor } from "../../engine/session";
import { makeCaveRound, type CaveGate } from "../../modes/arcade";
import { ArcadeHud } from "./ArcadeHud";
import { ArcadeSpace, SparkBurst } from "./Fx";

export function CaveGates({
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
  const [fly, setFly] = useState<"left" | "right" | null>(null);
  const pack = useMemo(() => makeCaveRound(level), [round, level]);

  function choose(gate: CaveGate, side: "left" | "right") {
    if (fly) return;
    playTap();
    if (gate.ok) {
      playWhoosh();
      playCorrect();
      setFly(side);
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
        setFly(null);
      }, 850);
      return;
    }
    playNeutral();
    setMisses((m) => m + 1);
    setHint(true);
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <ArcadeSpace />
      <ArcadeHud
        title="Cave Gates"
        index={round}
        total={rounds}
        fuel={fuel}
        onHint={() => setHint(true)}
        onPause={onPause}
        hint={pack.hint}
        hintVisible={hint}
      />
      {fly && <SparkBurst />}
      <div className="relative z-10 flex flex-1 items-end justify-center gap-8 px-[72px] pb-10">
        <GateBtn gate={pack.gates[0]!} open={fly === "left"} onClick={() => choose(pack.gates[0]!, "left")} />

        <div className={`cave-cadet ${fly === "left" ? "fly-left" : fly === "right" ? "fly-right" : "cadet-hover"}`}>
          <div className="jet-flame" />
          <img src="/spot.png" alt="" className="h-20 w-20 object-contain" />
          <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-orange-400 text-4xl font-semibold text-[#1a1030]">
            {pack.cadet}
          </div>
        </div>

        <GateBtn gate={pack.gates[1]!} open={fly === "right"} onClick={() => choose(pack.gates[1]!, "right")} />
      </div>
    </div>
  );
}

function GateBtn({
  gate,
  open,
  onClick,
}: {
  gate: CaveGate;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="cave-gate flex flex-col items-center justify-end">
      <p className="mb-3 text-3xl font-semibold text-yellow-50">
        {gate.lo} <span className="text-cyan-200">?</span> {gate.hi}
      </p>
      <div className={`cave-mouth ${open ? "cave-open" : ""}`} />
    </button>
  );
}
