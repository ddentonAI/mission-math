export type PlanetKind = "rocky" | "gas" | "ice" | "star";

export type PlanetDef = {
  id: string;
  name: string;
  kind: PlanetKind;
  base: string;
  glow: string;
  size: number;
  spinSec: number;
  bands?: string[];
  craters?: { top: string; left: string; size: string; color: string }[];
  blobs?: { top: string; left: string; w: string; h: string; color: string }[];
  spot?: { top: string; left: string; w: string; h: string; color: string };
  ring?: { color: string; tilt: number };
  atmosphere?: string;
};

export const BODIES: PlanetDef[] = [
  {
    id: "sun",
    name: "the Sun",
    kind: "star",
    base: "#ffb13a",
    glow: "rgba(255, 180, 40, 0.75)",
    size: 1.25,
    spinSec: 30,
    bands: ["#fff4c8", "#ffd36a", "#ff9a1a", "#ffb13a", "#ff7a12"],
    atmosphere: "rgba(255, 170, 40, 0.65)",
  },
  {
    id: "mercury",
    name: "Mercury",
    kind: "rocky",
    base: "#c4b09a",
    glow: "rgba(196, 176, 154, 0.45)",
    size: 0.62,
    spinSec: 14,
    craters: [
      { top: "22%", left: "28%", size: "22%", color: "#9a8774" },
      { top: "58%", left: "54%", size: "16%", color: "#a89480" },
      { top: "40%", left: "68%", size: "10%", color: "#8d7b6a" },
    ],
  },
  {
    id: "venus",
    name: "Venus",
    kind: "ice",
    base: "#ead29a",
    glow: "rgba(255, 210, 120, 0.55)",
    size: 0.86,
    spinSec: 22,
    atmosphere: "rgba(255, 186, 74, 0.35)",
    blobs: [
      { top: "18%", left: "12%", w: "48%", h: "22%", color: "#f3e0b0" },
      { top: "52%", left: "40%", w: "42%", h: "18%", color: "#d9b56a" },
    ],
  },
  {
    id: "earth",
    name: "Earth",
    kind: "rocky",
    base: "#3b7fd4",
    glow: "rgba(90, 180, 255, 0.45)",
    size: 0.9,
    spinSec: 16,
    atmosphere: "rgba(140, 210, 255, 0.4)",
    blobs: [
      { top: "28%", left: "18%", w: "38%", h: "28%", color: "#3d9a5c" },
      { top: "58%", left: "52%", w: "30%", h: "22%", color: "#2f7a48" },
      { top: "16%", left: "60%", w: "24%", h: "12%", color: "#f4f7ff" },
    ],
  },
  {
    id: "moon",
    name: "the Moon",
    kind: "rocky",
    base: "#d5d1c8",
    glow: "rgba(220, 220, 230, 0.35)",
    size: 0.54,
    spinSec: 20,
    craters: [
      { top: "24%", left: "30%", size: "26%", color: "#b7b3aa" },
      { top: "60%", left: "58%", size: "18%", color: "#c4c0b6" },
      { top: "48%", left: "16%", size: "12%", color: "#a8a49c" },
    ],
  },
  {
    id: "mars",
    name: "Mars",
    kind: "rocky",
    base: "#e06a3a",
    glow: "rgba(255, 120, 70, 0.45)",
    size: 0.72,
    spinSec: 15,
    blobs: [{ top: "26%", left: "48%", w: "28%", h: "24%", color: "#b44728" }],
    craters: [
      { top: "58%", left: "22%", size: "20%", color: "#c45a32" },
      { top: "38%", left: "70%", size: "10%", color: "#a83e24" },
    ],
  },
  {
    id: "jupiter",
    name: "Jupiter",
    kind: "gas",
    base: "#e7a35a",
    glow: "rgba(255, 160, 70, 0.5)",
    size: 1.12,
    spinSec: 11,
    bands: ["#f3c07a", "#e7a35a", "#f7e2b8", "#d9843c", "#eeb572"],
    spot: { top: "54%", left: "58%", w: "28%", h: "16%", color: "#d24b3a" },
  },
  {
    id: "io",
    name: "Io",
    kind: "rocky",
    base: "#f0d15a",
    glow: "rgba(255, 210, 80, 0.4)",
    size: 0.5,
    spinSec: 13,
    blobs: [
      { top: "30%", left: "24%", w: "22%", h: "18%", color: "#d4552a" },
      { top: "58%", left: "56%", w: "18%", h: "16%", color: "#c43e6a" },
    ],
  },
  {
    id: "europa",
    name: "Europa",
    kind: "ice",
    base: "#e8eef6",
    glow: "rgba(200, 220, 255, 0.45)",
    size: 0.52,
    spinSec: 18,
    blobs: [
      { top: "22%", left: "10%", w: "70%", h: "8%", color: "#b7c4d8" },
      { top: "48%", left: "18%", w: "60%", h: "6%", color: "#9eafc8" },
      { top: "68%", left: "8%", w: "74%", h: "7%", color: "#c5d0e0" },
    ],
  },
  {
    id: "ganymede",
    name: "Ganymede",
    kind: "rocky",
    base: "#c2b49a",
    glow: "rgba(200, 180, 150, 0.35)",
    size: 0.58,
    spinSec: 17,
    craters: [
      { top: "28%", left: "32%", size: "20%", color: "#a09078" },
      { top: "60%", left: "54%", size: "14%", color: "#b8a888" },
    ],
    blobs: [{ top: "40%", left: "18%", w: "28%", h: "16%", color: "#8a7a62" }],
  },
  {
    id: "callisto",
    name: "Callisto",
    kind: "rocky",
    base: "#8b8174",
    glow: "rgba(160, 150, 140, 0.3)",
    size: 0.56,
    spinSec: 19,
    craters: [
      { top: "22%", left: "28%", size: "24%", color: "#6e665c" },
      { top: "58%", left: "52%", size: "16%", color: "#7a7268" },
      { top: "40%", left: "70%", size: "10%", color: "#5c564e" },
    ],
  },
  {
    id: "saturn",
    name: "Saturn",
    kind: "ice",
    base: "#e8c98a",
    glow: "rgba(255, 210, 130, 0.45)",
    size: 1.04,
    spinSec: 13,
    blobs: [
      { top: "18%", left: "8%", w: "54%", h: "20%", color: "#f4dcb0" },
      { top: "56%", left: "28%", w: "46%", h: "18%", color: "#d4b06e" },
    ],
    ring: { color: "#ead7a6", tilt: -18 },
  },
  {
    id: "titan",
    name: "Titan",
    kind: "ice",
    base: "#d98a3c",
    glow: "rgba(255, 150, 70, 0.4)",
    size: 0.58,
    spinSec: 19,
    atmosphere: "rgba(255, 170, 80, 0.4)",
    blobs: [{ top: "40%", left: "20%", w: "50%", h: "24%", color: "#c46e28" }],
  },
  {
    id: "uranus",
    name: "Uranus",
    kind: "ice",
    base: "#7fd3d8",
    glow: "rgba(120, 230, 230, 0.45)",
    size: 0.92,
    spinSec: 17,
    bands: ["#8fe0e4", "#7fd3d8", "#67c3c8", "#b7eef0"],
    ring: { color: "rgba(210, 240, 245, 0.7)", tilt: 78 },
  },
  {
    id: "neptune",
    name: "Neptune",
    kind: "gas",
    base: "#3b5fe0",
    glow: "rgba(80, 130, 255, 0.5)",
    size: 0.9,
    spinSec: 12,
    bands: ["#4d72ee", "#3b5fe0", "#2a48c4", "#6f8ef2"],
    spot: { top: "42%", left: "56%", w: "22%", h: "14%", color: "#1d2f8a" },
  },
  {
    id: "triton",
    name: "Triton",
    kind: "ice",
    base: "#d8c4d4",
    glow: "rgba(220, 190, 210, 0.35)",
    size: 0.5,
    spinSec: 16,
    blobs: [
      { top: "24%", left: "18%", w: "40%", h: "18%", color: "#c4b0c8" },
      { top: "58%", left: "48%", w: "28%", h: "16%", color: "#e8dce8" },
    ],
  },
  {
    id: "pluto",
    name: "Pluto",
    kind: "rocky",
    base: "#d8b49a",
    glow: "rgba(220, 180, 150, 0.35)",
    size: 0.48,
    spinSec: 21,
    blobs: [{ top: "30%", left: "28%", w: "36%", h: "32%", color: "#e8c8b4" }],
    craters: [{ top: "60%", left: "58%", size: "14%", color: "#c49a82" }],
  },
  {
    id: "charon",
    name: "Charon",
    kind: "rocky",
    base: "#9a8b84",
    glow: "rgba(170, 160, 155, 0.3)",
    size: 0.46,
    spinSec: 22,
    craters: [
      { top: "30%", left: "34%", size: "22%", color: "#7e726c" },
      { top: "58%", left: "50%", size: "14%", color: "#8a8078" },
    ],
  },
];

export const PLANETS = BODIES;

export const TOUR = BODIES.map((b) => b.id);

export const SUN = { x: 108, y: 410, size: 96 };

export type MapStop = {
  id: string;
  x: number;
  y: number;
  radius: number;
  mapSize: number;
  parent?: string;
  moonOrbit?: number;
};

function place(id: string, radius: number, angleDeg: number, mapSize: number): MapStop {
  const a = (angleDeg * Math.PI) / 180;
  return {
    id,
    x: SUN.x + radius * Math.cos(a),
    y: SUN.y + radius * Math.sin(a) * 0.4,
    radius,
    mapSize,
  };
}

function moonOf(parent: MapStop, dist: number, angleDeg: number, id: string, mapSize: number): MapStop {
  const a = (angleDeg * Math.PI) / 180;
  return {
    id,
    x: parent.x + dist * Math.cos(a),
    y: parent.y + dist * Math.sin(a) * 0.72,
    radius: 0,
    mapSize,
    parent: parent.id,
    moonOrbit: dist,
  };
}

const PLANET_STOPS: MapStop[] = [
  place("mercury", 118, -20, 34),
  place("venus", 178, 24, 46),
  place("earth", 242, -28, 50),
  place("mars", 308, 30, 40),
  place("jupiter", 438, -14, 88),
  place("saturn", 568, 22, 102),
  place("uranus", 688, -24, 54),
  place("neptune", 798, 16, 52),
  place("pluto", 898, -10, 26),
];

const byId = (id: string) => PLANET_STOPS.find((s) => s.id === id)!;

const MOON_STOPS: MapStop[] = [
  moonOf(byId("earth"), 40, 58, "moon", 18),
  moonOf(byId("jupiter"), 58, -78, "io", 16),
  moonOf(byId("jupiter"), 72, 108, "europa", 15),
  moonOf(byId("jupiter"), 88, 198, "ganymede", 20),
  moonOf(byId("jupiter"), 106, 268, "callisto", 18),
  moonOf(byId("saturn"), 74, 48, "titan", 22),
  moonOf(byId("neptune"), 40, -42, "triton", 16),
  moonOf(byId("pluto"), 24, 52, "charon", 14),
];

export const MAP_LAYOUT: MapStop[] = [
  { id: "sun", x: SUN.x, y: SUN.y, radius: 0, mapSize: SUN.size },
  ...PLANET_STOPS,
  ...MOON_STOPS,
];

export const MAP_VIEW = { w: 1180, h: 820 };

export function tourId(index: number): string {
  const i = ((index % TOUR.length) + TOUR.length) % TOUR.length;
  return TOUR[i]!;
}

export function stopById(id: string): MapStop {
  return MAP_LAYOUT.find((s) => s.id === id) ?? MAP_LAYOUT[0]!;
}

export function mapCamera(kind: "overview" | number): { x: number; y: number; scale: number } {
  if (kind === "overview") {
    return { x: 4, y: 18, scale: 0.92 };
  }
  const stop = stopById(tourId(kind));
  if (stop.parent) {
    const parent = stopById(stop.parent);
    const minX = Math.min(parent.x - parent.mapSize / 2, stop.x - stop.mapSize / 2);
    const maxX = Math.max(parent.x + parent.mapSize / 2, stop.x + stop.mapSize / 2);
    const minY = Math.min(parent.y - parent.mapSize / 2, stop.y - stop.mapSize / 2);
    const maxY = Math.max(parent.y + parent.mapSize / 2, stop.y + stop.mapSize / 2);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const span = Math.max(maxX - minX, maxY - minY, 48) * 1.4;
    const scale = Math.min(7.2, (Math.min(MAP_VIEW.w, MAP_VIEW.h) * 0.7) / span);
    return {
      x: MAP_VIEW.w / 2 - cx * scale,
      y: MAP_VIEW.h / 2 - cy * scale,
      scale,
    };
  }
  const scale = Math.min(11, 360 / stop.mapSize);
  return {
    x: MAP_VIEW.w / 2 - stop.x * scale,
    y: MAP_VIEW.h / 2 - stop.y * scale,
    scale,
  };
}

export function planetAt(index: number): PlanetDef {
  return planetById(tourId(index));
}

export function planetById(id: string): PlanetDef {
  return BODIES.find((p) => p.id === id) ?? BODIES[1]!;
}

export function tourIndexOf(id: string): number {
  return TOUR.indexOf(id);
}
