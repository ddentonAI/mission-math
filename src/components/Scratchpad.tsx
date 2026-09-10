import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

type Pt = { x: number; y: number; p: number };

export function Scratchpad({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Pt[][]>([]);

  function resize() {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.floor(c.clientWidth * dpr);
    c.height = Math.floor(c.clientHeight * dpr);
    redraw();
  }

  function redraw() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#14122a";
    ctx.fillRect(0, 0, c.clientWidth, c.clientHeight);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#ffe7a8";
    for (const s of strokes.current) {
      if (s.length < 2) continue;
      ctx.beginPath();
      ctx.lineWidth = s[0]!.p;
      ctx.moveTo(s[0]!.x, s[0]!.y);
      for (const p of s.slice(1)) ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  function pos(e: ReactPointerEvent<HTMLCanvasElement>): Pt | null {
    const c = canvasRef.current;
    if (!c) return null;
    const r = c.getBoundingClientRect();
    const isPen = e.pointerType === "pen";
    return { x: e.clientX - r.left, y: e.clientY - r.top, p: isPen ? 2.2 : 5 };
  }

  const activePen = useRef(false);

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-[#14122a]">
      <div className="flex items-center justify-between px-16 py-4">
        <button
          type="button"
          onClick={() => {
            strokes.current = [];
            redraw();
          }}
          className="h-[64px] min-w-[140px] rounded-2xl bg-white/10 px-6 text-2xl"
        >
          Clear
        </button>
        <p className="text-2xl text-yellow-100">Scratchpad — not graded</p>
        <button
          type="button"
          onClick={onClose}
          className="h-[64px] min-w-[140px] rounded-2xl bg-orange-400 px-6 text-2xl text-[#1a1030]"
        >
          Done
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="draggable mx-16 mb-8 min-h-0 flex-1 touch-none rounded-3xl"
        onPointerDown={(e) => {
          if (e.pointerType === "touch" && activePen.current) return;
          if (e.pointerType === "pen") {
            activePen.current = true;
          }
          const p = pos(e);
          if (!p) return;
          strokes.current.push([p]);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "touch" && activePen.current) return;
          if (e.buttons === 0) return;
          const p = pos(e);
          const cur = strokes.current.at(-1);
          if (!p || !cur) return;
          cur.push(p);
          redraw();
        }}
        onPointerUp={(e) => {
          if (e.pointerType === "pen") {
            activePen.current = false;
          }
        }}
      />
    </div>
  );
}
