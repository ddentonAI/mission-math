import { STUDENT_NAME } from "../curriculum";

export function SpotFound({
  fuel,
  onDone,
}: {
  fuel: number;
  onDone: () => void;
}) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-5 overflow-hidden px-[80px] text-center">
      {Array.from({ length: 24 }, (_, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: `${8 + ((i * 17) % 84)}%`,
            animationDelay: `${(i % 8) * 0.12}s`,
            animationDuration: `${2.2 + (i % 5) * 0.25}s`,
          }}
        />
      ))}
      <p className="relative z-10 text-lg uppercase tracking-[0.2em] text-cyan-200">In Search of Spot</p>
      <img src="/spot.png" alt="Spot" className="spot-bounce relative z-10 h-[220px] w-[220px] object-contain" />
      <p className="relative z-10 text-5xl font-semibold text-yellow-50">You found Spot!</p>
      <p className="relative z-10 max-w-[720px] text-3xl text-yellow-100">
        Cadet {STUDENT_NAME} cleaned the junk, filled the tanks, and opened the right hatch.
      </p>
      <p className="relative z-10 text-2xl text-orange-200">+{fuel} fuel</p>
      <button
        type="button"
        onClick={onDone}
        className="relative z-10 mt-2 h-[88px] min-w-[280px] rounded-full bg-orange-400 px-10 text-3xl font-semibold text-[#1a1030]"
      >
        Hangar
      </button>
    </div>
  );
}
