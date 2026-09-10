import { useState } from "react";
import { RestartConfirm } from "./RestartConfirm";

export function PauseSheet({
  onResume,
  onEnd,
  onReset,
}: {
  onResume: () => void;
  onEnd: () => void;
  onReset: () => void;
}) {
  const [confirmReset, setConfirmReset] = useState(false);
  if (confirmReset) {
    return <RestartConfirm onCancel={() => setConfirmReset(false)} onConfirm={onReset} />;
  }
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="flex w-[520px] flex-col gap-4 rounded-[32px] bg-[#1b1638] p-10 text-center">
        <p className="text-4xl font-semibold">Mission paused</p>
        <p className="text-2xl text-yellow-100/80">Your problem is saved. Come back when you are ready.</p>
        <button
          type="button"
          onClick={onResume}
          className="mt-4 h-[88px] rounded-2xl bg-orange-400 text-3xl font-semibold text-[#1a1030]"
        >
          Keep flying
        </button>
        <button
          type="button"
          onClick={onEnd}
          className="h-[72px] rounded-2xl bg-white/10 text-2xl"
        >
          End for today
        </button>
        <button
          type="button"
          data-testid="restart"
          onClick={() => setConfirmReset(true)}
          className="h-[64px] rounded-2xl bg-black/20 text-xl text-yellow-100/70"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
