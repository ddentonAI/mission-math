export function FeedbackOverlay({
  correct,
  onDone,
}: {
  correct: boolean;
  onDone: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onDone}
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/25"
    >
      <div
        className={`rounded-[32px] px-16 py-10 text-4xl font-semibold ${
          correct ? "bg-orange-400 text-[#1a1030]" : "bg-white/15 text-yellow-50"
        }`}
      >
        {correct ? "Nice flying!" : "Let's try that again"}
      </div>
    </button>
  );
}
