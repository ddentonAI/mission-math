import { playTap } from "../audio";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "back", "0", "go"] as const;

export function Keypad({
  value,
  unit,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  unit?: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  function press(key: (typeof KEYS)[number]) {
    if (disabled) return;
    playTap();
    if (key === "back") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === "go") {
      if (value.length) onSubmit();
      return;
    }
    if (value.length >= 6) return;
    onChange(value + key);
  }

  return (
    <div className="flex flex-col items-end gap-3">
      <div
        className="flex items-center justify-end rounded-2xl bg-black/35 px-5"
        style={{ width: 288, height: 72 }}
      >
        <span className="text-[40px] font-semibold leading-none tracking-wide">
          {value || " "}
          {value && unit ? <span className="ml-2 text-[22px] text-yellow-200">{unit}</span> : null}
        </span>
      </div>
      <div className="grid grid-cols-3" style={{ width: 288, gap: 12 }}>
        {KEYS.map((key) => {
          const label = key === "back" ? "⌫" : key === "go" ? "GO" : key;
          const primary = key === "go";
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onPointerUp={(e) => {
                e.preventDefault();
                press(key);
              }}
              className={`flex items-center justify-center rounded-2xl text-[40px] font-semibold active:scale-95 ${
                primary ? "bg-orange-400 text-[#1a1030]" : "bg-white/12 text-yellow-50"
              }`}
              style={{ width: 88, height: 88, color: primary ? "#1a1030" : undefined }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
