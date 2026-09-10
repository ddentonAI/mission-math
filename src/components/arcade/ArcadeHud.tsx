import { PALM } from "../Stage";

export function ArcadeHud({
  title,
  index,
  total,
  fuel,
  onHint,
  onPause,
  hint,
  hintVisible,
}: {
  title: string;
  index: number;
  total: number;
  fuel: number;
  onHint: () => void;
  onPause: () => void;
  hint: string;
  hintVisible: boolean;
}) {
  return (
    <>
      <header
        className="flex items-center justify-between py-4"
        style={{ paddingLeft: PALM + 12, paddingRight: PALM + 12 }}
      >
        <p className="text-xl text-yellow-100">{title}</p>
        <div className="flex gap-2">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full ${i < index ? "bg-orange-400" : i === index ? "bg-yellow-200" : "bg-white/20"}`}
            />
          ))}
        </div>
        <p className="text-xl text-yellow-100">Fuel {fuel}</p>
        <button type="button" onClick={onPause} className="h-16 min-w-16 rounded-2xl bg-white/10 px-5 text-xl">
          Pause
        </button>
      </header>
      {hintVisible ? (
        <p className="mx-auto max-w-[720px] rounded-2xl bg-cyan-200/15 px-6 py-3 text-center text-2xl text-cyan-100">
          {hint}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onHint}
        className="absolute bottom-6 flex items-center justify-center rounded-2xl bg-white/12 text-xl"
        style={{ left: PALM + 12, width: 88, height: 88 }}
      >
        Hint
      </button>
    </>
  );
}
