export function RestartConfirm({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/55">
      <div className="flex w-[560px] flex-col gap-4 rounded-[32px] bg-[#1b1638] p-10 text-center">
        <p className="text-4xl font-semibold">Start over?</p>
        <p className="text-2xl text-yellow-100/80">This clears fuel, the planet map, and all progress.</p>
        <button
          type="button"
          onClick={onCancel}
          className="mt-4 h-[88px] rounded-2xl bg-orange-400 text-3xl font-semibold text-[#1a1030]"
        >
          Keep going
        </button>
        <button
          type="button"
          data-testid="confirm-restart"
          onClick={onConfirm}
          className="h-[72px] rounded-2xl bg-white/10 text-2xl"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
