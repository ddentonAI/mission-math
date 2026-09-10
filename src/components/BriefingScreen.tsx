export function BriefingScreen({ text, onSkip }: { text: string; onSkip: () => void }) {
  return (
    <button
      type="button"
      onClick={onSkip}
      className="flex h-full w-full flex-col items-center justify-center gap-8 px-[80px] text-center"
    >
      <p className="text-lg uppercase tracking-[0.2em] text-cyan-200">Mission briefing</p>
      <p className="max-w-[800px] text-4xl font-medium leading-snug text-yellow-50">{text}</p>
      <p className="text-2xl text-orange-200">Tap anywhere to fly</p>
    </button>
  );
}
