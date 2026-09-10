import { useState } from "react";
import type { Item } from "../types";

export function WorkedExample({ item, onDone }: { item: Item; onDone: () => void }) {
  const [step, setStep] = useState(0);
  const steps = item.workedSolution;
  const last = step >= steps.length - 1;

  return (
    <button
      type="button"
      onClick={() => {
        if (last) onDone();
        else setStep((s) => s + 1);
      }}
      className="flex h-full w-full flex-col items-center justify-center gap-8 px-[80px] text-center"
    >
      <p className="text-lg uppercase tracking-[0.2em] text-cyan-200">Let's walk through it</p>
      <p className="max-w-[800px] text-3xl text-yellow-100/80">{item.stem}</p>
      <div className="flex max-w-[720px] flex-col gap-4">
        {steps.slice(0, step + 1).map((s, i) => (
          <p key={i} className="text-4xl font-medium leading-snug text-yellow-50">
            {s}
          </p>
        ))}
      </div>
      <p className="text-2xl text-orange-200">{last ? "Tap to keep flying" : "Tap for the next step"}</p>
    </button>
  );
}
