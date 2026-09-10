import type { Item, TimeAnswer } from "../types";

export function parseNumeric(raw: string): number | null {
  const t = raw.replace(/\s/g, "");
  if (!t) return null;
  if (!/^\d+$/.test(t)) return null;
  return Number(t);
}

export function timesEqual(a: TimeAnswer, b: TimeAnswer): boolean {
  const ah = ((a.hours - 1 + 12) % 12) + 1;
  const bh = ((b.hours - 1 + 12) % 12) + 1;
  return ah === bh && a.minutes === b.minutes;
}

export function grade(item: Item, response: unknown): boolean {
  if (item.answerType === "int") {
    const n = typeof response === "number" ? response : parseNumeric(String(response ?? ""));
    return n !== null && n === item.answer;
  }
  if (item.answerType === "time") {
    const a = item.answer as TimeAnswer;
    const r = response as TimeAnswer | null;
    if (!r || typeof r.hours !== "number" || typeof r.minutes !== "number") return false;
    return timesEqual(a, r);
  }
  return String(response) === String(item.answer);
}

export function recomputeTemplateAnswer(item: Item): number | TimeAnswer | string {
  const op = item.payload.operands;
  if (item.skillId === "NUM-AS") {
    const a = Number(op.a);
    const b = Number(op.b);
    if (item.level === 5) {
      const mid = a + b;
      return op.op2 === "+" ? mid + Number(op.c) : mid - Number(op.c);
    }
    return op.op === "+" ? a + b : a - b;
  }
  if (item.skillId === "NUM-MD") {
    if (op.op === "/") {
      if (typeof op.remainder === "number") return Number(op.remainder);
      return Number(op.a) / Number(op.b);
    }
    return Number(op.a) * Number(op.b);
  }
  if (item.skillId === "TIM-CLK") {
    if (item.kind === "set-clock") {
      return { hours: Number(op.hours), minutes: Number(op.minutes) };
    }
    if (item.kind === "until-hour") return Number(op.until);
    return Number(op.elapsed);
  }
  if (item.skillId === "MEA-PER") {
    if (item.kind === "unit-sides") return 2 * (Number(op.w) + Number(op.h));
    if (item.kind === "unit-sides-l") return Number(op.p);
    if (item.kind === "rectangle") return Number(op.p);
    if (item.kind === "irregular") {
      return Object.values(op)
        .map(Number)
        .reduce((s, n) => s + n, 0);
    }
    if (item.kind === "missing-side") return Number(op.missing);
    if (item.kind === "compare") return Math.abs(Number(op.pA) - Number(op.pB));
  }
  return item.answer;
}
