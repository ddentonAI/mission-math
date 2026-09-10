import { useEffect, useState, type ReactNode } from "react";
import { RotatePrompt } from "./RotatePrompt";

export const DESIGN_W = 1180;
export const DESIGN_H = 820;
export const PALM = 60;

export function Stage({
  children,
  font,
  textScale,
}: {
  children: ReactNode;
  font: "fredoka" | "lexend";
  textScale: number;
}) {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const onResize = () => {
      const vv = window.visualViewport;
      setSize({
        w: Math.round(vv?.width ?? window.innerWidth),
        h: Math.round(vv?.height ?? window.innerHeight),
      });
    };
    onResize();
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  const portrait = size.h > size.w;
  const scale = Math.min(size.w / DESIGN_W, size.h / DESIGN_H);

  return (
    <div
      className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden"
      style={{
        fontFamily: font === "lexend" ? "Lexend, sans-serif" : "Fredoka, sans-serif",
        background:
          "radial-gradient(1200px 700px at 50% 0%, #2a1b55 0%, #0b1026 42%, #070a18 100%)",
      }}
    >
      <Stars />
      {portrait ? (
        <RotatePrompt />
      ) : (
        <div
          className="relative overflow-hidden"
          style={{
            width: DESIGN_W,
            height: DESIGN_H,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            fontSize: `${textScale * 20}px`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Stars() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70">
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-yellow-100"
          style={{
            width: i % 5 === 0 ? 4 : 2,
            height: i % 5 === 0 ? 4 : 2,
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            opacity: 0.35 + ((i * 13) % 40) / 100,
          }}
        />
      ))}
    </div>
  );
}
