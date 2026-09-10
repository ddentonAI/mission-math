import { useEffect, useRef, useState } from "react";
import { playWhoosh } from "../audio";
import {
  MAP_LAYOUT,
  MAP_VIEW,
  SUN,
  mapCamera,
  planetById,
  stopById,
  tourIndexOf,
  type PlanetDef,
} from "../planets";
import { PlanetGlobe } from "./PlanetGlobe";

export function PlanetArrival({
  planet,
  stopIndex,
  onDone,
}: {
  planet: PlanetDef;
  stopIndex: number;
  onDone: () => void;
}) {
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const closed = useRef(false);
  const [phase, setPhase] = useState<"overview" | "zoom">("overview");

  function close() {
    if (closed.current) return;
    closed.current = true;
    doneRef.current();
  }

  useEffect(() => {
    playWhoosh();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("zoom");
      const t = window.setTimeout(close, 500);
      return () => window.clearTimeout(t);
    }
    const zoom = window.setTimeout(() => setPhase("zoom"), 900);
    const done = window.setTimeout(close, 3200);
    return () => {
      window.clearTimeout(zoom);
      window.clearTimeout(done);
    };
  }, [planet.id]);

  const cam = mapCamera(phase === "zoom" ? stopIndex : "overview");
  const planets = MAP_LAYOUT.filter((s) => s.radius > 0);
  const moons = MAP_LAYOUT.filter((s) => s.parent);

  return (
    <button
      type="button"
      data-testid="planet-arrival"
      aria-label={`Next stop: ${planet.name}. Tap to keep flying.`}
      onClick={close}
      className="absolute inset-0 z-30 overflow-hidden bg-[#070a18]"
      style={{ ["--planet-glow" as string]: planet.glow }}
    >
      <MapStars />
      <div
        className="ss-camera"
        style={{
          width: MAP_VIEW.w,
          height: MAP_VIEW.h,
          transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`,
        }}
      >
        <svg className="ss-orbits" viewBox={`0 0 ${MAP_VIEW.w} ${MAP_VIEW.h}`}>
          {planets.map((stop) => (
            <ellipse
              key={stop.id}
              cx={SUN.x}
              cy={SUN.y}
              rx={stop.radius}
              ry={stop.radius * 0.4}
              className="ss-orbit"
            />
          ))}
          {moons.map((moon) => {
            const parent = stopById(moon.parent!);
            const rx = moon.moonOrbit ?? 40;
            return (
              <ellipse
                key={`${moon.id}-orbit`}
                cx={parent.x}
                cy={parent.y}
                rx={rx}
                ry={rx * 0.72}
                className="ss-moon-orbit"
              />
            );
          })}
        </svg>
        <div
          className="ss-sun-glow"
          style={{
            left: SUN.x - 78,
            top: SUN.y - 78,
            width: 156,
            height: 156,
          }}
        />
        {MAP_LAYOUT.map((stop) => {
          const body = planetById(stop.id);
          const rank = tourIndexOf(stop.id);
          const reached = rank >= 0 && rank <= stopIndex;
          const current = rank === stopIndex;
          const showName = phase === "overview" ? !stop.parent : current;
          return (
            <div
              key={stop.id}
              className={`ss-body ${current ? "ss-target" : ""} ${reached ? "ss-reached" : "ss-ahead"}`}
              style={{
                left: stop.x - stop.mapSize / 2,
                top: stop.y - stop.mapSize / 2,
                width: stop.mapSize,
                height: stop.mapSize,
                zIndex: current ? 6 : stop.parent ? 4 : stop.id === "sun" ? 2 : 3,
              }}
            >
              <PlanetGlobe
                planet={body}
                size={stop.mapSize}
                spinning={current || phase === "overview" || stop.id === "sun"}
              />
              {showName ? (
                <span className={`ss-name ${phase === "zoom" ? "ss-name-hide" : ""}`}>{body.name}</span>
              ) : null}
            </div>
          );
        })}
      </div>
      {phase === "zoom" ? <img src="/ship-plain.png" alt="" className="ss-ship-screen" /> : null}
      <div className="pointer-events-none absolute inset-x-0 bottom-14 z-10 flex flex-col items-center gap-2 px-[80px] text-center">
        <p className="text-4xl font-semibold text-yellow-50">Nice flying!</p>
        <p className="text-3xl text-orange-200">Next stop: {planet.name}</p>
        <p className="text-xl text-yellow-100/70">Tap to keep flying</p>
      </div>
    </button>
  );
}

function MapStars() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {Array.from({ length: 40 }, (_, i) => (
        <span
          key={i}
          className="launch-star"
          style={{
            width: i % 6 === 0 ? 4 : 2,
            height: i % 6 === 0 ? 4 : 2,
            left: `${(i * 31 + 5) % 96}%`,
            top: `${(i * 47 + 9) % 92}%`,
            animationDelay: `${(i % 8) * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}
