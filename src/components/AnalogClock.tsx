import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { TimeAnswer } from "../types";

const SIZE = 320;
const CX = SIZE / 2;
const CY = SIZE / 2;

function hourAngle(h: number, m: number) {
  return ((h % 12) + m / 60) * 30;
}
function minuteAngle(m: number) {
  return m * 6;
}

function distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const x = x1 + t * dx;
  const y = y1 + t * dy;
  return Math.hypot(px - x, py - y);
}

function pointFromEvent(el: SVGSVGElement, e: PointerEvent | ReactPointerEvent) {
  const r = el.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * SIZE;
  const y = ((e.clientY - r.top) / r.height) * SIZE;
  return { x, y };
}

function angleAt(x: number, y: number) {
  let deg = (Math.atan2(y - CY, x - CX) * 180) / Math.PI + 90;
  if (deg < 0) deg += 360;
  return deg;
}

export function AnalogClock({
  time,
  interactive,
  snap,
  onChange,
}: {
  time: TimeAnswer;
  interactive?: boolean;
  snap: 1 | 5;
  onChange?: (t: TimeAnswer) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"hour" | "minute" | null>(null);
  const hours = ((time.hours - 1 + 12) % 12) + 1;
  const minutes = time.minutes;
  const hAng = hourAngle(hours, minutes);
  const mAng = minuteAngle(minutes);

  const hourLen = 78;
  const minLen = 118;
  const hx = CX + hourLen * Math.sin((hAng * Math.PI) / 180);
  const hy = CY - hourLen * Math.cos((hAng * Math.PI) / 180);
  const mx = CX + minLen * Math.sin((mAng * Math.PI) / 180);
  const my = CY - minLen * Math.cos((mAng * Math.PI) / 180);

  function apply(which: "hour" | "minute", x: number, y: number) {
    if (!onChange) return;
    const deg = angleAt(x, y);
    if (which === "minute") {
      const raw = Math.round(deg / 6) % 60;
      const m = snap === 5 ? Math.round(raw / 5) * 5 % 60 : raw;
      onChange({ hours, minutes: m });
    } else {
      let h = Math.round(deg / 30) % 12;
      if (h === 0) h = 12;
      onChange({ hours: h, minutes });
    }
  }

  function onDown(e: ReactPointerEvent<SVGSVGElement>) {
    if (!interactive) return;
    const svg = svgRef.current;
    if (!svg) return;
    const { x, y } = pointFromEvent(svg, e);
    const dH = distToSegment(x, y, CX, CY, hx, hy);
    const dM = distToSegment(x, y, CX, CY, mx, my);
    const which = dM <= dH ? "minute" : "hour";
    if (Math.min(dH, dM) > 44) return;
    setDrag(which);
    svg.setPointerCapture(e.pointerId);
    apply(which, x, y);
  }

  function onMove(e: ReactPointerEvent<SVGSVGElement>) {
    if (!drag || !svgRef.current) return;
    const { x, y } = pointFromEvent(svgRef.current, e);
    apply(drag, x, y);
  }

  return (
    <svg
      ref={svgRef}
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={interactive ? "draggable touch-none" : ""}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={() => setDrag(null)}
      onPointerCancel={() => setDrag(null)}
    >
      <circle cx={CX} cy={CY} r={154} fill="#f7f3ea" stroke="#ff8a3d" strokeWidth="10" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
        const x = CX + Math.cos(a) * 118;
        const y = CY + Math.sin(a) * 118;
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="22"
            fontWeight="700"
            fill="#1a1030"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            {i + 1}
          </text>
        );
      })}
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const inner = i % 5 === 0 ? 138 : 144;
        return (
          <line
            key={i}
            x1={CX + Math.cos(a) * inner}
            y1={CY + Math.sin(a) * inner}
            x2={CX + Math.cos(a) * 148}
            y2={CY + Math.sin(a) * 148}
            stroke="#1a1030"
            strokeWidth={i % 5 === 0 ? 3 : 1}
          />
        );
      })}
      <line x1={CX} y1={CY} x2={hx} y2={hy} stroke="#1a1030" strokeWidth="10" strokeLinecap="round" />
      <line x1={CX} y1={CY} x2={mx} y2={my} stroke="#e05a2b" strokeWidth="6" strokeLinecap="round" />
      <circle cx={CX} cy={CY} r="9" fill="#1a1030" />
    </svg>
  );
}
