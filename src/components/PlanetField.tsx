import { planetById } from "../planets";
import { PlanetGlobe } from "./PlanetGlobe";

export function PlanetField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <LaunchStars />

      <div className="launch-mars">
        <PlanetGlobe planet={planetById("mars")} size={118} />
      </div>
      <div className="launch-saturn">
        <PlanetGlobe planet={planetById("saturn")} size={210} />
      </div>
      <div className="launch-jupiter">
        <PlanetGlobe planet={planetById("jupiter")} size={460} />
      </div>

      <img src="/ship-plain.png" alt="" className="launch-ship" />
    </div>
  );
}

function LaunchStars() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 36 }, (_, i) => (
        <span
          key={i}
          className="launch-star"
          style={{
            width: i % 7 === 0 ? 5 : 2,
            height: i % 7 === 0 ? 5 : 2,
            left: `${(i * 29 + 8) % 96}%`,
            top: `${(i * 47 + 11) % 92}%`,
            animationDelay: `${(i % 8) * 0.35}s`,
          }}
        />
      ))}
    </div>
  );
}
