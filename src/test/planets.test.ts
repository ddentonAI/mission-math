import { describe, expect, it } from "vitest";
import {
  BODIES,
  MAP_LAYOUT,
  TOUR,
  mapCamera,
  planetAt,
  planetById,
  stopById,
} from "../planets";

describe("planets", () => {
  it("keeps unique ids and names", () => {
    expect(new Set(BODIES.map((p) => p.id)).size).toBe(BODIES.length);
    expect(new Set(BODIES.map((p) => p.name)).size).toBe(BODIES.length);
  });

  it("tours the sun, planets, and major moons in order", () => {
    expect(planetAt(0).id).toBe("sun");
    expect(planetAt(1).id).toBe("mercury");
    expect(planetAt(4).id).toBe("moon");
    expect(planetAt(7).id).toBe("io");
    expect(TOUR).toEqual(expect.arrayContaining(["ganymede", "titan", "triton", "charon"]));
    expect(planetAt(TOUR.length).id).toBe("sun");
  });

  it("puts every tour stop on the map", () => {
    expect(new Set(MAP_LAYOUT.map((s) => s.id))).toEqual(new Set(TOUR));
    expect(stopById("moon").parent).toBe("earth");
    expect(stopById("io").parent).toBe("jupiter");
    expect(stopById("titan").parent).toBe("saturn");
  });

  it("zooms the camera onto the target, and frames a moon with its planet", () => {
    const overview = mapCamera("overview");
    const sun = mapCamera(0);
    const mercury = mapCamera(1);
    const io = mapCamera(TOUR.indexOf("io"));
    expect(sun.scale).toBeGreaterThan(overview.scale);
    expect(mercury.scale).toBeGreaterThan(8);
    expect(io.scale).toBeGreaterThan(overview.scale);
    expect(io.scale).toBeLessThan(mercury.scale);
  });

  it("finds a planet by id", () => {
    expect(planetById("saturn").ring).toBeTruthy();
    expect(planetById("missing").id).toBe("mercury");
  });
});
