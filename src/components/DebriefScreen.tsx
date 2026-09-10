import { STUDENT_NAME } from "../curriculum";

export function DebriefScreen({
  fuel,
  praise,
  destination,
  onDone,
}: {
  fuel: number;
  praise: string;
  destination: string;
  onDone: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-[80px] text-center">
      <p className="text-lg uppercase tracking-[0.2em] text-cyan-200">Debrief</p>
      <img src="/ship-plain.png" alt="" className="h-[160px] w-[420px] object-contain" />
      <p className="text-5xl font-semibold text-yellow-50">+{fuel} fuel, Cadet {STUDENT_NAME}</p>
      <p className="max-w-[720px] text-3xl leading-snug text-yellow-100">{praise}</p>
      <p className="text-2xl text-orange-200">You visited {destination}.</p>
      <button
        type="button"
        onClick={onDone}
        className="mt-4 h-[88px] min-w-[280px] rounded-full bg-orange-400 px-10 text-3xl font-semibold text-[#1a1030]"
      >
        Hangar
      </button>
    </div>
  );
}
