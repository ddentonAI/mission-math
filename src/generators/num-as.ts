import type { Item } from "../types";
import { pick, randInt, uid } from "./rng";

type Op = "+" | "-";

function digitAt(n: number, place: number): number {
  return Math.floor(n / place) % 10;
}

export function regroupCountAdd(a: number, b: number): number {
  let carry = 0;
  let regroups = 0;
  let place = 1;
  const max = Math.max(a, b, a + b);
  while (place <= max || carry) {
    const sum = digitAt(a, place) + digitAt(b, place) + carry;
    if (sum >= 10) {
      regroups += 1;
      carry = 1;
    } else {
      carry = 0;
    }
    place *= 10;
    if (place > 1000) break;
  }
  return regroups;
}

export function regroupCountSub(a: number, b: number): number {
  let borrow = 0;
  let regroups = 0;
  let place = 1;
  while (place <= a) {
    let top = digitAt(a, place) - borrow;
    const bot = digitAt(b, place);
    if (top < bot) {
      regroups += 1;
      borrow = 1;
    } else {
      borrow = 0;
    }
    place *= 10;
  }
  return regroups;
}

function hasZeroDigit(n: number): boolean {
  return String(n).includes("0");
}

function tryAdd(minA: number, maxA: number, minB: number, maxB: number, wantRegroups: number | null, requireZero: boolean): { a: number; b: number } | null {
  for (let i = 0; i < 200; i++) {
    const a = randInt(minA, maxA);
    const b = randInt(minB, maxB);
    const sum = a + b;
    if (sum > 999) continue;
    if (requireZero && !hasZeroDigit(a) && !hasZeroDigit(b)) continue;
    const r = regroupCountAdd(a, b);
    if (wantRegroups === null || r === wantRegroups) return { a, b };
  }
  return null;
}

function trySub(minA: number, maxA: number, minB: number, maxB: number, wantRegroups: number | null, requireZero: boolean): { a: number; b: number } | null {
  for (let i = 0; i < 200; i++) {
    const a = randInt(minA, maxA);
    const b = randInt(minB, Math.min(maxB, a));
    if (b <= 0 || a - b <= 0) continue;
    if (requireZero && !hasZeroDigit(a)) continue;
    const r = regroupCountSub(a, b);
    if (wantRegroups === null || r === wantRegroups) return { a, b };
  }
  return null;
}

function pairForLevel(level: number, op: Op): { a: number; b: number } {
  if (op === "+") {
    if (level === 1) {
      return tryAdd(8, 34, 3, 15, 0, false) ?? { a: 23, b: 14 };
    }
    if (level === 2) {
      return tryAdd(15, 388, 15, 247, 1, false) ?? { a: 47, b: 28 };
    }
    if (level === 3) {
      return tryAdd(128, 599, 117, 399, 2, false) ?? { a: 178, b: 256 };
    }
    return tryAdd(101, 508, 102, 390, null, true) ?? { a: 304, b: 218 };
  }
  if (level === 1) {
    return trySub(11, 39, 2, 14, 0, false) ?? { a: 28, b: 13 };
  }
  if (level === 2) {
    return trySub(21, 498, 15, 279, 1, false) ?? { a: 52, b: 17 };
  }
  if (level === 3) {
    return trySub(130, 800, 28, 399, 2, false) ?? { a: 423, b: 178 };
  }
  return trySub(201, 805, 18, 390, null, true) ?? { a: 504, b: 178 };
}

function addSteps(a: number, b: number): string[] {
  const steps: string[] = [];
  const places = [
    { name: "Ones", p: 1 },
    { name: "Tens", p: 10 },
    { name: "Hundreds", p: 100 },
  ];
  let carry = 0;
  const usedHundreds = a >= 100 || b >= 100 || a + b >= 100;
  for (const { name, p } of places) {
    if (p === 100 && !usedHundreds && !carry) continue;
    const da = digitAt(a, p);
    const db = digitAt(b, p);
    const sum = da + db + carry;
    if (carry) {
      steps.push(`${name}: ${da} + ${db} + 1 = ${sum}.`);
    } else {
      steps.push(`${name}: ${da} + ${db} = ${sum}.`);
    }
    if (sum >= 10) {
      steps.push(`Write ${sum % 10}, carry 1.`);
      carry = 1;
    } else {
      carry = 0;
    }
  }
  steps.push(`Total: ${a + b}.`);
  return steps;
}

function subSteps(a: number, b: number): string[] {
  const steps: string[] = [];
  const as = String(a).padStart(3, " ").split("");
  const digits = as.map((ch) => (ch === " " ? 0 : Number(ch)));
  const bs = String(b).padStart(3, "0").split("").map(Number);
  const names = ["Hundreds", "Tens", "Ones"] as const;
  const start = a >= 100 ? 0 : 1;
  const work = [...digits];
  for (let i = 2; i >= start; i--) {
    if (work[i]! >= bs[i]!) {
      steps.push(`${names[i]}: ${work[i]} − ${bs[i]} = ${work[i]! - bs[i]!}.`);
      work[i] = work[i]! - bs[i]!;
    } else {
      let j = i - 1;
      while (j >= 0 && work[j] === 0) j -= 1;
      if (j >= 0) {
        work[j] -= 1;
        for (let k = j + 1; k < i; k++) work[k] = 9;
        const from = work[i]!;
        work[i] = from + 10;
        steps.push(`${names[i]}: ${from} is less than ${bs[i]}. Borrow. ${work[i]} − ${bs[i]} = ${work[i]! - bs[i]!}.`);
        work[i] = work[i]! - bs[i]!;
      }
    }
  }
  steps.push(`Total: ${a - b}.`);
  return steps;
}

function hintFor(op: Op, a: number, b: number, answer: number): string {
  if (op === "+") {
    const ones = (a % 10) + (b % 10);
    if (ones >= 10) return "Start with the ones. They make ten or more — write the ones, carry a ten.";
    return "Start with the ones. Then add the tens.";
  }
  const onesA = a % 10;
  const onesB = b % 10;
  if (onesA < onesB) return "Look at the ones. You need to break a ten first.";
  return "Start with the ones. Then subtract the tens.";
  void answer;
}

function addStem(a: number, b: number): string {
  return pick([
    `The depot loaded ${a} crates, then ${b} more. How many crates now?`,
    `A pod held ${a} boxes. Crew added ${b}. How many boxes in all?`,
    `Rover Pip hauled ${a} rocks, then ${b} more. How many rocks total?`,
  ]);
}

function subStem(a: number, b: number): string {
  return pick([
    `A cargo pod had ${a} boxes. Crew took ${b}. How many boxes are left?`,
    `The depot had ${a} crates. Ships took ${b}. How many crates remain?`,
    `Pip stacked ${a} rocks, then used ${b}. How many rocks are left?`,
  ]);
}

function twoStep(): { a: number; b: number; c: number; op2: Op; answer: number; stem: string; steps: string[] } {
  for (let i = 0; i < 80; i++) {
    const a = randInt(120, 420);
    const b = randInt(110, 280);
    const c = randInt(40, 180);
    if (a + b > 999) continue;
    const op2: Op = pick(["+", "-"]);
    const mid = a + b;
    const answer = op2 === "+" ? mid + c : mid - c;
    if (answer <= 0 || answer > 999) continue;
    const stem =
      op2 === "+"
        ? `Pip hauled ${a} m, then ${b} m, then ${c} m more. How far in all?`
        : `A pod had ${a} boxes. Crew added ${b}, then sent ${c}. How many left?`;
    const steps =
      op2 === "+"
        ? [`First: ${a} + ${b} = ${mid}.`, `Then: ${mid} + ${c} = ${answer}.`]
        : [`First: ${a} + ${b} = ${mid}.`, `Then: ${mid} − ${c} = ${answer}.`];
    return { a, b, c, op2, answer, stem, steps };
  }
  return {
    a: 125,
    b: 140,
    c: 50,
    op2: "-",
    answer: 215,
    stem: "A pod had 125 boxes. Crew added 140, then sent 50. How many left?",
    steps: ["First: 125 + 140 = 265.", "Then: 265 − 50 = 215."],
  };
}

export function generateNumAs(level: number, avoid: Set<string> = new Set(), depth = 0): Item {
  const lv = Math.min(5, Math.max(1, level));
  const retry = () => generateNumAs(lv, avoid, depth + 1);
  const skip = (signature: string) => avoid.has(signature) && depth < 16;

  if (lv === 5) {
    const t = twoStep();
    const signature = `NUM-AS|5|+|${t.a}|${t.b}|${t.op2}|${t.c}`;
    if (skip(signature)) return retry();
    return {
      id: uid("NUM-AS"),
      skillId: "NUM-AS",
      level: 5,
      kind: "two-step",
      stem: t.stem,
      inputType: "numeric",
      payload: {
        visual: { type: "cargo", a: t.a, b: t.b, op: "+", c: t.c, op2: t.op2 },
        unit: t.stem.includes(" m") ? "m" : undefined,
        clockSnap: 1,
        operands: { a: t.a, b: t.b, c: t.c, op: "+", op2: t.op2 },
      },
      answer: t.answer,
      answerType: "int",
      hint: "Do the first two numbers. Then use that total with the last number.",
      workedSolution: t.steps,
      misconceptionTags: ["wrong_order", "wrong_operation"],
      source: "template",
      signature,
    };
  }

  const op: Op = pick(["+", "-"]);
  const { a, b } = pairForLevel(lv, op);
  const answer = op === "+" ? a + b : a - b;
  const signature = `NUM-AS|${lv}|${op}|${a}|${b}`;
  if (skip(signature)) return retry();

  const hint = hintFor(op, a, b, answer);
  if (hint.includes(String(answer))) {
    return retry();
  }

  return {
    id: uid("NUM-AS"),
    skillId: "NUM-AS",
    level: lv,
    kind: op === "+" ? "add" : "sub",
    stem: op === "+" ? addStem(a, b) : subStem(a, b),
    inputType: "numeric",
    payload: {
      visual: { type: "cargo", a, b, op },
      clockSnap: 1,
      operands: { a, b, op },
    },
    answer,
    answerType: "int",
    hint,
    workedSolution: op === "+" ? addSteps(a, b) : subSteps(a, b),
    misconceptionTags: op === "+" ? ["regroup_omitted", "place_value_carry"] : ["regroup_omitted", "wrong_operation"],
    source: "template",
    signature,
  };
}
