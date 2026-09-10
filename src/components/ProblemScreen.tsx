import { useEffect, useState } from "react";
import type { Item, TimeAnswer } from "../types";
import { AnalogClock } from "./AnalogClock";
import { Keypad } from "./Keypad";
import { Scratchpad } from "./Scratchpad";
import { PALM } from "./Stage";
import { ItemVisualView } from "./visuals/ItemVisual";

export function ProblemScreen({
  item,
  index,
  total,
  fuel,
  draft,
  clockDraft,
  hintVisible,
  nudge,
  disabled,
  onDraft,
  onClock,
  onSubmit,
  onHint,
  onPause,
}: {
  item: Item;
  index: number;
  total: number;
  fuel: number;
  draft: string;
  clockDraft: TimeAnswer;
  hintVisible: boolean;
  nudge: boolean;
  disabled?: boolean;
  onDraft: (v: string) => void;
  onClock: (t: TimeAnswer) => void;
  onSubmit: () => void;
  onHint: () => void;
  onPause: () => void;
}) {
  const [pad, setPad] = useState(false);

  useEffect(() => {
    setPad(false);
  }, [item.id]);

  return (
    <div className="relative z-10 flex h-full flex-col">
      <header
        className="flex items-center justify-between py-4"
        style={{ paddingLeft: PALM + 12, paddingRight: PALM + 12 }}
      >
        <div className="flex gap-2">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full ${i < index ? "bg-orange-400" : i === index ? "bg-yellow-200" : "bg-white/20"}`}
            />
          ))}
        </div>
        <p className="text-xl text-yellow-100">Fuel {fuel}</p>
        <button
          type="button"
          onClick={onPause}
          className="h-16 min-w-16 rounded-2xl bg-white/10 px-5 text-xl"
        >
          Pause
        </button>
      </header>

      <div className="flex min-h-[150px] max-h-[280px] items-center justify-center">
        {item.inputType === "clock" ? (
          <AnalogClock time={clockDraft} interactive snap={item.payload.clockSnap} onChange={onClock} />
        ) : (
          <ItemVisualView item={item} />
        )}
      </div>

      <p
        className="px-[80px] text-center font-medium leading-snug text-yellow-50"
        style={{ fontSize: 36 }}
      >
        {item.stem}
      </p>

      {hintVisible ? (
        <p className="mx-auto mt-3 max-w-[720px] rounded-2xl bg-cyan-200/15 px-6 py-3 text-center text-2xl text-cyan-100">
          {item.hint}
        </p>
      ) : null}

      <div
        className="mt-auto flex items-end justify-between pb-6"
        style={{ paddingLeft: PALM + 12, paddingRight: PALM + 12 }}
      >
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onHint}
            className={`flex items-center justify-center rounded-2xl bg-white/12 text-xl ${nudge ? "ring-4 ring-yellow-300" : ""}`}
            style={{ width: 88, height: 88 }}
          >
            Hint
          </button>
          <button
            type="button"
            onClick={() => setPad(true)}
            className="flex items-center justify-center rounded-2xl bg-white/12 text-xl"
            style={{ width: 88, height: 88 }}
          >
            Pencil
          </button>
        </div>

        {item.inputType === "clock" ? (
          <button
            type="button"
            disabled={disabled}
            onClick={onSubmit}
            className="flex items-center justify-center rounded-2xl bg-orange-400 text-3xl font-semibold text-[#1a1030]"
            style={{ width: 88, height: 88 }}
          >
            GO
          </button>
        ) : (
          <Keypad
            value={draft}
            unit={item.payload.unit}
            onChange={onDraft}
            onSubmit={onSubmit}
            disabled={disabled}
          />
        )}
      </div>

      {pad ? <Scratchpad onClose={() => setPad(false)} /> : null}
    </div>
  );
}
