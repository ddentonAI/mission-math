import { beforeEach, describe, expect, it, vi } from "vitest";

const mem = new Map<string, string>();

vi.stubGlobal("localStorage", {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => {
    mem.set(k, v);
  },
  removeItem: (k: string) => {
    mem.delete(k);
  },
  clear: () => mem.clear(),
});

import { loadState, resetProgress, saveStudent } from "../storage";

describe("resetProgress", () => {
  beforeEach(() => mem.clear());

  it("clears fuel and map progress but keeps settings", () => {
    const boot = loadState();
    saveStudent({
      ...boot.student,
      fuelTotal: 80,
      mapStop: 4,
      streakDays: 3,
      settings: { sound: false, font: "lexend", textScale: 1 },
    });
    const next = resetProgress({ sound: false, font: "lexend", textScale: 1 });
    expect(next.student.fuelTotal).toBe(0);
    expect(next.student.mapStop).toBe(0);
    expect(next.student.streakDays).toBe(0);
    expect(next.session).toBeNull();
    expect(next.student.settings.font).toBe("lexend");
    expect(next.student.settings.sound).toBe(false);
  });
});
