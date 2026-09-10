import type { ReactNode } from "react";
import type { Item, ItemVisual as Visual, TimeAnswer } from "../../types";
import { AnalogClock } from "../AnalogClock";

export function ItemVisualView({ item }: { item: Item }) {
  const v = item.payload.visual;
  if (!v) return null;
  if (v.type === "cargo") return <Cargo v={v} />;
  if (v.type === "array") return <ArrayGrid v={v} />;
  if (v.type === "groups") return <Groups v={v} />;
  if (v.type === "perimeter") return <Perimeter v={v} />;
  if (v.type === "clock") return <ClockPreview v={v} />;
  return null;
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center gap-4 px-8 py-2 text-[#1a1030]">
      {children}
    </div>
  );
}

function Num({ n, tone = "orange" }: { n: number | string; tone?: "orange" | "cyan" }) {
  return (
    <div
      className={`flex h-[96px] min-w-[120px] items-center justify-center rounded-3xl px-6 text-[44px] font-semibold ${
        tone === "cyan" ? "bg-cyan-200" : "bg-orange-300"
      }`}
    >
      {n}
    </div>
  );
}

function Cargo({ v }: { v: Extract<Visual, { type: "cargo" }> }) {
  return (
    <Card>
      <Num n={v.a} />
      <span className="text-[48px] font-bold text-yellow-100">{v.op}</span>
      <Num n={v.b} tone="cyan" />
      {v.c != null && v.op2 ? (
        <>
          <span className="text-[48px] font-bold text-yellow-100">{v.op2}</span>
          <Num n={v.c} />
        </>
      ) : null}
    </Card>
  );
}

function ArrayGrid({ v }: { v: Extract<Visual, { type: "array" }> }) {
  const cell = v.rows * v.cols > 20 ? 22 : 28;
  return (
    <Card>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${v.cols}, ${cell}px)` }}>
        {Array.from({ length: v.rows * v.cols }, (_, i) => (
          <div key={i} className="rounded-md bg-cyan-300" style={{ width: cell, height: cell }} />
        ))}
      </div>
    </Card>
  );
}

function Groups({ v }: { v: Extract<Visual, { type: "groups" }> }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {Array.from({ length: v.groups }, (_, g) => (
          <div key={g} className="flex gap-1 rounded-2xl bg-white/15 p-2">
            {Array.from({ length: v.size }, (_, i) => (
              <div key={i} className="h-7 w-7 rounded-full bg-orange-300" />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

function Perimeter({ v }: { v: Extract<Visual, { type: "perimeter" }> }) {
  if (v.grid) return <GridShape cells={v.grid.cells} />;
  return (
    <Card>
      <Poly sides={v.sides} label="A" />
      {v.compare ? <Poly sides={v.compare.sides} label={v.compare.label} /> : null}
    </Card>
  );
}

function GridShape({ cells }: { cells: boolean[][] }) {
  const size = 36;
  return (
    <Card>
      <div className="flex flex-col">
        {cells.map((row, r) => (
          <div key={r} className="flex">
            {row.map((on, c) => (
              <div
                key={c}
                className={on ? "border border-orange-200 bg-orange-400/90" : "border border-transparent"}
                style={{ width: size, height: size }}
              />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

function Poly({ sides, label }: { sides: number[]; label: string }) {
  const n = Math.max(3, sides.length);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [110 + Math.cos(a) * 80, 100 + Math.sin(a) * 70];
  });
  const d = pts.map((p) => p.join(",")).join(" ");
  return (
    <svg width="220" height="200" viewBox="0 0 220 200">
      <polygon points={d} fill="#5ce1e6" stroke="#ff8a3d" strokeWidth="5" />
      <text x="110" y="108" textAnchor="middle" fontSize="28" fontWeight="700" fill="#1a1030">
        {label}
      </text>
      {pts.map((p, i) => {
        const q = pts[(i + 1) % n]!;
        const len = sides[i] ?? "?";
        return (
          <text
            key={i}
            x={(p[0]! + q[0]!) / 2}
            y={(p[1]! + q[1]!) / 2}
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            fill="#1a1030"
          >
            {len === 0 ? "?" : len}
          </text>
        );
      })}
    </svg>
  );
}

function ClockPreview({ v }: { v: Extract<Visual, { type: "clock" }> }) {
  if (!v.showHands || v.hours == null || v.minutes == null) return null;
  const time: TimeAnswer = { hours: v.hours, minutes: v.minutes };
  return (
    <div className="flex justify-center py-1">
      <div style={{ transform: "scale(0.5)", transformOrigin: "top center", height: 160 }}>
        <AnalogClock time={time} snap={5} />
      </div>
    </div>
  );
}
