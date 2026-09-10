export function RotatePrompt() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-10 text-center">
      <div
        className="h-40 w-28 rounded-3xl border-4 border-orange-300 bg-violet-900/60"
        style={{ animation: "spin-slow 3s ease-in-out infinite" }}
      />
      <p className="max-w-sm text-3xl font-semibold leading-snug text-yellow-100">
        Turn your ship sideways to fly.
      </p>
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          40% { transform: rotate(90deg); }
          100% { transform: rotate(90deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[class*="h-40"] { animation: none; transform: rotate(90deg); }
        }
      `}</style>
    </div>
  );
}
