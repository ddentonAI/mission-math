import { MODE_META, type ArcadeMode } from "../modes/arcade";

const ORDER: ArcadeMode[] = ["zapper", "recycler", "caves", "hatches"];

export function ModeSelect({
  onPick,
  onBack,
}: {
  onPick: (mode: ArcadeMode) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex h-full flex-col px-[72px] py-8">
      <div className="flex items-center justify-between">
        <p className="text-4xl font-semibold">Hangar games</p>
        <button type="button" onClick={onBack} className="h-16 rounded-2xl bg-white/10 px-6 text-xl">
          Back
        </button>
      </div>
      <p className="mt-3 text-2xl text-yellow-100/80">Tap a game. No timers. No lives. Just math.</p>
      <div className="mt-8 grid grid-cols-2 gap-5">
        {ORDER.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onPick(id)}
            className="rounded-[28px] bg-white/10 px-6 py-6 text-left"
            style={{ minHeight: 140 }}
          >
            <p className="text-3xl font-semibold text-yellow-50">{MODE_META[id].title}</p>
            <p className="mt-2 text-xl text-yellow-100/80">{MODE_META[id].blurb}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
