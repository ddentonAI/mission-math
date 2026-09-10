import { describe, expect, it } from "vitest";
import { grade, recomputeTemplateAnswer } from "../engine/grader";
import { generateItem, hintLeaksAnswer, wordCount } from "../generators";
import { regroupCountAdd, regroupCountSub } from "../generators/num-as";
import { minutesUntilNextHour } from "../generators/tim-clk";
import { polygonPerimeter, rectPerimeter } from "../generators/mea-per";
import type { SkillId, TimeAnswer } from "../types";

const SKILLS: SkillId[] = ["NUM-AS", "NUM-MD", "TIM-CLK", "MEA-PER"];

describe("template generators", () => {
  it("recomputes every answer for 40 items at each skill and level", () => {
    for (const skill of SKILLS) {
      for (let level = 1; level <= 5; level++) {
        const avoid = new Set<string>();
        for (let n = 0; n < 40; n++) {
          const item = generateItem(skill, level, avoid);
          avoid.add(item.signature);
          const computed = recomputeTemplateAnswer(item);
          if (item.answerType === "time") {
            const a = item.answer as TimeAnswer;
            const b = computed as TimeAnswer;
            expect(a.hours).toBe(b.hours);
            expect(a.minutes).toBe(b.minutes);
          } else {
            expect(computed).toBe(item.answer);
          }
          expect(grade(item, item.answer)).toBe(true);
          expect(wordCount(item.stem)).toBeLessThanOrEqual(25);
          expect(hintLeaksAnswer(item), `${item.skillId} L${item.level} hint="${item.hint}" answer=${JSON.stringify(item.answer)}`).toBe(false);
          expect(item.workedSolution.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("keeps NUM-AS L1 free of regrouping and negative results", () => {
    for (let i = 0; i < 60; i++) {
      const item = generateItem("NUM-AS", 1);
      const a = Number(item.payload.operands.a);
      const b = Number(item.payload.operands.b);
      if (item.payload.operands.op === "+") {
        expect(regroupCountAdd(a, b)).toBe(0);
        expect(a + b).toBe(item.answer);
      } else {
        expect(regroupCountSub(a, b)).toBe(0);
        expect(a - b).toBeGreaterThan(0);
      }
    }
  });

  it("computes perimeter helpers correctly", () => {
    expect(rectPerimeter(8, 3)).toBe(22);
    expect(polygonPerimeter([2, 4, 5, 3])).toBe(14);
    expect(minutesUntilNextHour(20)).toBe(40);
    expect(minutesUntilNextHour(0)).toBe(60);
  });
});
