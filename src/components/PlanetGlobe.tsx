import type { CSSProperties } from "react";
import type { PlanetDef } from "../planets";

export function PlanetGlobe({
  planet,
  size,
  spinning = true,
  className = "",
}: {
  planet: PlanetDef;
  size: number;
  spinning?: boolean;
  className?: string;
}) {
  const ringed = Boolean(planet.ring);
  const disk = ringed ? size * 0.62 : size;
  const diskLeft = (size - disk) / 2;
  const diskTop = (size - disk) / 2;

  return (
    <div
      className={`planet-wrap ${className}`}
      style={
        {
          width: size,
          height: size,
          "--planet-glow": planet.glow,
          "--planet-spin": `${planet.spinSec}s`,
        } as CSSProperties
      }
    >
      {planet.ring ? (
        <span
          className="planet-ring planet-ring-back"
          style={ringStyle(planet, disk, diskLeft, diskTop)}
        />
      ) : null}

      <div
        className="planet-disk"
        style={{
          width: disk,
          height: disk,
          left: diskLeft,
          top: diskTop,
          background: planet.base,
          borderWidth: Math.max(2, Math.round(disk * 0.055)),
          boxShadow: `0 0 ${Math.round(disk * 0.28)}px ${planet.atmosphere ?? planet.glow}`,
        }}
      >
        <div className={`planet-strip ${spinning ? "planet-spinning" : ""}`}>
          <Tile planet={planet} />
          <Tile planet={planet} />
          <Tile planet={planet} />
        </div>
        <span className="planet-light" />
        <span className={planet.kind === "star" ? "planet-shade-star" : "planet-shade"} />
      </div>

      {planet.ring ? (
        <span
          className="planet-ring planet-ring-front"
          style={ringStyle(planet, disk, diskLeft, diskTop)}
        />
      ) : null}
    </div>
  );
}

function Tile({ planet }: { planet: PlanetDef }) {
  const band = planet.bands
    ? `repeating-linear-gradient(180deg, ${planet.bands
        .map((c, i) => {
          const start = i * 18;
          return `${c} ${start}px ${start + 18}px`;
        })
        .join(", ")})`
    : undefined;

  return (
    <div className="planet-tile" style={{ backgroundColor: planet.base, backgroundImage: band }}>
      {planet.blobs?.map((b, i) => (
        <span
          key={`b${i}`}
          className="planet-blob"
          style={{ top: b.top, left: b.left, width: b.w, height: b.h, background: b.color }}
        />
      ))}
      {planet.craters?.map((c, i) => (
        <span
          key={`c${i}`}
          className="planet-crater"
          style={{ top: c.top, left: c.left, width: c.size, height: c.size, background: c.color }}
        />
      ))}
      {planet.spot ? (
        <span
          className="planet-spot"
          style={{
            top: planet.spot.top,
            left: planet.spot.left,
            width: planet.spot.w,
            height: planet.spot.h,
            background: planet.spot.color,
          }}
        />
      ) : null}
    </div>
  );
}

function ringStyle(planet: PlanetDef, disk: number, left: number, top: number): CSSProperties {
  const ring = planet.ring!;
  const outer = disk * 1.78;
  return {
    width: outer,
    height: outer,
    left: left - (outer - disk) / 2,
    top: top - (outer - disk) / 2,
    borderColor: ring.color,
    borderWidth: Math.max(7, disk * 0.055),
    boxShadow: `0 0 0 ${Math.max(5, disk * 0.04)}px color-mix(in srgb, ${ring.color} 55%, transparent)`,
    transform: `rotateX(70deg) rotateZ(${ring.tilt}deg)`,
  };
}
