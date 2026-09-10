import { describe, expect, it } from "vitest";
import { applyAttempt, emptyMastery } from "../engine/mastery";

describe("mastery", () => {
  it("does not level up after a short burst of correct answers", () => {
    let cell = emptyMastery("NUM-AS");
    for (let i = 0; i < 8; i++) {
      cell = applyAttempt(cell, true, false, 0);
    }
    expect(cell.level).toBe(1);
  });

  it("levels up only after a long run of solid work", () => {
    let cell = emptyMastery("NUM-AS");
    for (let i = 0; i < 12; i++) {
      cell = applyAttempt(cell, true, false, 0);
    }
    expect(cell.level).toBeGreaterThanOrEqual(2);
    expect(cell.ewma).toBeGreaterThan(0.88);
  });

  it("gives less credit after a hint", () => {
    const a = applyAttempt(emptyMastery("NUM-AS"), true, false, 0);
    const b = applyAttempt(emptyMastery("NUM-AS"), true, true, 1);
    expect(a.ewma).toBeGreaterThan(b.ewma);
  });
});
