import { describe, expect, it } from "vitest";
import { emptyMastery } from "../engine/mastery";
import { assembleSession, drawLevel } from "../engine/session";
import { SKILL_NODES } from "../curriculum";
import type { MasteryCell, SkillId, Student } from "../types";

function student(): Student {
  return {
    id: "alastair",
    displayName: "Alastair",
    createdAt: new Date().toISOString(),
    settings: { sound: true, font: "fredoka", textScale: 1 },
    fuelTotal: 0,
    streakDays: 0,
    lastPracticeDate: null,
    lastFocusSkillId: null,
    lastSessionDate: null,
    mapStop: 0,
  };
}

function mastery(): Record<SkillId, MasteryCell> {
  return Object.fromEntries(SKILL_NODES.map((n) => [n.id, emptyMastery(n.id)])) as Record<
    SkillId,
    MasteryCell
  >;
}

describe("session ramp", () => {
  it("keeps level 1 almost always at the floor", () => {
    const bumped = Array.from({ length: 100 }, (_, i) => drawLevel(1, i / 100));
    expect(bumped.filter((n) => n === 1).length).toBeGreaterThanOrEqual(90);
    expect(Math.max(...bumped)).toBe(2);
  });

  it("leans easier than harder once past level 1", () => {
    const rolls = Array.from({ length: 100 }, (_, i) => drawLevel(3, i / 100));
    const down = rolls.filter((n) => n === 2).length;
    const up = rolls.filter((n) => n === 4).length;
    expect(down).toBeGreaterThan(up);
  });

  it("opens with extra easy preflight and no bonus bump", () => {
    const ses = assembleSession(mastery(), student());
    const pre = ses.items.filter((p) => p.phase === "preflight");
    expect(pre).toHaveLength(4);
    expect(pre.every((p) => p.item.level === 1)).toBe(true);
    const bonus = ses.items.find((p) => p.phase === "bonus");
    expect(bonus?.item.level).toBe(1);
  });

  it("honors a forced skill for the whole flight", () => {
    const ses = assembleSession(mastery(), student(), [], new Set(), "TIM-CLK");
    expect(ses.focusSkillId).toBe("TIM-CLK");
    expect(ses.items.every((p) => p.item.skillId === "TIM-CLK")).toBe(true);
    expect(ses.items.some((p) => p.phase === "review")).toBe(false);
  });
});
