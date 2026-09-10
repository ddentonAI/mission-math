import { describe, expect, it } from "vitest";
import {
  between,
  evalRecycler,
  makeCaveRound,
  makeEquation,
  makeHatchRound,
  makeRecyclerRound,
  makeTrashRound,
} from "../modes/arcade";

describe("arcade generators", () => {
  it("equations recompute", () => {
    for (let i = 0; i < 40; i++) {
      const p = makeEquation(1 + (i % 5));
      const got = p.op === "×" ? p.left * p.right : p.op === "+" ? p.left + p.right : p.left - p.right;
      expect(got).toBe(p.answer);
      expect(p.answer).toBeGreaterThan(0);
    }
  });

  it("trash rounds have one correct piece", () => {
    for (let i = 0; i < 20; i++) {
      const r = makeTrashRound(2);
      const hits = r.trash.filter((t) => t.correct);
      expect(hits).toHaveLength(1);
      expect(hits[0]!.value).toBe(r.problem.answer);
    }
  });

  it("recycler targets are reachable", () => {
    for (let i = 0; i < 20; i++) {
      const r = makeRecyclerRound(3);
      let ok = false;
      for (const a of r.numbers) {
        for (const b of r.numbers) {
          for (const op of r.ops) {
            if (evalRecycler(a, op, b) === r.target) ok = true;
          }
        }
      }
      expect(ok).toBe(true);
    }
  });

  it("cave rounds have exactly one fitting gate", () => {
    for (let i = 0; i < 30; i++) {
      const r = makeCaveRound(2);
      const fits = r.gates.filter((g) => between(r.cadet, g.lo, g.hi));
      expect(fits).toHaveLength(1);
      expect(fits[0]!.ok).toBe(true);
    }
  });

  it("hatches include the answer", () => {
    for (let i = 0; i < 20; i++) {
      const r = makeHatchRound(1);
      expect(r.options).toContain(r.problem.answer);
      expect(r.options).toHaveLength(4);
    }
  });
});
