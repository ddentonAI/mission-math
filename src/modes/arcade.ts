import { pick, randInt, shuffle } from "../generators/rng";

export type ArcadeMode = "zapper" | "recycler" | "caves" | "hatches";

export const SPOT_STAGES: ArcadeMode[] = ["zapper", "recycler", "caves", "hatches"];

export const MODE_META: Record<
  ArcadeMode,
  { title: string; blurb: string; briefing: string }
> = {
  zapper: {
    title: "Tractor Trash",
    blurb: "Beam the junk that shows the right answer.",
    briefing: "Trash is floating by Jupiter. Solve each problem. Tap the junk with the matching number. The beam will pull it in.",
  },
  recycler: {
    title: "Fuel Recycler",
    blurb: "Build a true equation to melt junk into fuel.",
    briefing: "Melt the junk into fuel. Tap a number, a sign, then a number. Make the target.",
  },
  caves: {
    title: "Cave Gates",
    blurb: "Fly the hole your number fits between.",
    briefing: "Spot ran into the caves. Your badge shows a number. Tap the gate where that number sits in the middle.",
  },
  hatches: {
    title: "Hatch Hunt",
    blurb: "Open the hatch with the right answer.",
    briefing: "Spot is behind a hatch. Read the problem. Tap the hatch that matches.",
  },
};

export type EqProblem = {
  left: number;
  op: "+" | "-" | "×";
  right: number;
  answer: number;
  prompt: string;
  hint: string;
  steps: string[];
};

function evalOp(a: number, op: "+" | "-" | "×", b: number): number {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  return a * b;
}

export function makeEquation(level: number): EqProblem {
  const lv = Math.min(5, Math.max(1, level));
  if (lv >= 4 && Math.random() < 0.45) {
    const a = randInt(2, 6);
    const b = randInt(2, 5);
    const answer = a * b;
    return {
      left: a,
      op: "×",
      right: b,
      answer,
      prompt: `${a} × ${b} = ?`,
      hint: "Think equal groups. Skip count.",
      steps: [`${a} groups of ${b}.`, `${a} × ${b} = ${answer}.`],
    };
  }
  const op: "+" | "-" = pick(["+", "-"]);
  if (op === "+") {
    const left = lv <= 2 ? randInt(6, 28) : randInt(12, 80);
    const right = lv <= 2 ? randInt(3, 19) : randInt(8, 40);
    const answer = left + right;
    return {
      left,
      op,
      right,
      answer,
      prompt: `${left} + ${right} = ?`,
      hint: "Start with the ones. Then add the tens.",
      steps: [`${left} + ${right} = ${answer}.`],
    };
  }
  const left = lv <= 2 ? randInt(12, 40) : randInt(20, 90);
  const right = randInt(3, Math.min(left - 1, lv <= 2 ? 18 : 40));
  const answer = left - right;
  return {
    left,
    op,
    right,
    answer,
    prompt: `${left} − ${right} = ?`,
    hint: "Start with the ones. Then subtract the tens.",
    steps: [`${left} − ${right} = ${answer}.`],
  };
}

export function makeDistractors(answer: number, n = 3): number[] {
  const bag = new Set<number>();
  const tries = [answer + 1, answer - 1, answer + 10, answer - 10, answer + 2, answer - 2, answer + 5, answer - 5];
  for (const t of tries) {
    if (t > 0 && t !== answer) bag.add(t);
    if (bag.size >= n) break;
  }
  while (bag.size < n) {
    const t = Math.max(1, answer + randInt(-12, 12));
    if (t !== answer) bag.add(t);
  }
  return [...bag].slice(0, n);
}

export type TrashPiece = {
  id: string;
  value: number;
  kind: "can" | "boot" | "peel" | "box" | "bolt";
  correct: boolean;
};

export function makeTrashRound(level: number): { problem: EqProblem; trash: TrashPiece[] } {
  const problem = makeEquation(level);
  const wrongs = makeDistractors(problem.answer, 3);
  const kinds: TrashPiece["kind"][] = shuffle(["can", "boot", "peel", "box", "bolt"]);
  const values = shuffle([problem.answer, ...wrongs]);
  const trash = values.map((value, i) => ({
    id: `t-${i}-${value}`,
    value,
    kind: kinds[i] ?? "can",
    correct: value === problem.answer,
  }));
  return { problem, trash };
}

export type RecyclerRound = {
  target: number;
  numbers: number[];
  ops: Array<"+" | "-" | "×">;
  hint: string;
};

export function makeRecyclerRound(level: number): RecyclerRound {
  const lv = Math.min(5, Math.max(1, level));
  const allowMul = lv >= 3;
  const op: "+" | "-" | "×" = allowMul && Math.random() < 0.4 ? "×" : pick(["+", "-"]);
  let a: number;
  let b: number;
  if (op === "×") {
    a = randInt(2, 6);
    b = randInt(2, 6);
  } else if (op === "+") {
    a = randInt(4, lv <= 2 ? 12 : 30);
    b = randInt(3, lv <= 2 ? 12 : 25);
  } else {
    a = randInt(10, lv <= 2 ? 24 : 40);
    b = randInt(2, a - 2);
  }
  const target = evalOp(a, op, b);
  const extras = makeDistractors(a, 2).concat(makeDistractors(b, 1)).filter((n) => n !== a && n !== b);
  const numbers = shuffle([...new Set([a, b, ...extras])]).slice(0, 4);
  if (!numbers.includes(a)) numbers[0] = a;
  if (!numbers.includes(b)) numbers[1] = b;
  const ops: Array<"+" | "-" | "×"> = allowMul ? ["+", "-", "×"] : ["+", "-"];
  return {
    target,
    numbers: shuffle(numbers),
    ops,
    hint: "Pick two numbers and a sign that make the target.",
  };
}

export function evalRecycler(a: number, op: "+" | "-" | "×", b: number): number {
  return evalOp(a, op, b);
}

export type CaveGate = { label: string; lo: number; hi: number; ok: boolean };

export type CaveRound = {
  cadet: number;
  gates: [CaveGate, CaveGate];
  hint: string;
};

export function between(n: number, lo: number, hi: number): boolean {
  const a = Math.min(lo, hi);
  const b = Math.max(lo, hi);
  return n > a && n < b;
}

export function makeCaveRound(level: number): CaveRound {
  const lv = Math.min(5, Math.max(1, level));
  const cadet = randInt(5, lv <= 2 ? 18 : 40);
  const span = randInt(2, lv <= 2 ? 5 : 8);
  const lo = cadet - randInt(1, span);
  const hi = cadet + randInt(1, span);
  const wLo = cadet + randInt(1, 6);
  const wHi = wLo + randInt(2, 8);
  const good: CaveGate = {
    label: `${lo}    ${hi}`,
    lo,
    hi,
    ok: true,
  };
  const bad: CaveGate = {
    label: `${wLo}    ${wHi}`,
    lo: wLo,
    hi: wHi,
    ok: false,
  };
  const gates = shuffle([good, bad]) as [CaveGate, CaveGate];
  return {
    cadet,
    gates,
    hint: `Your number is ${cadet}. Pick the gate that is smaller on one side and bigger on the other.`,
  };
}

export type HatchRound = {
  problem: EqProblem;
  options: number[];
};

export function makeHatchRound(level: number): HatchRound {
  const problem = makeEquation(level);
  const options = shuffle([problem.answer, ...makeDistractors(problem.answer, 3)]);
  return { problem, options };
}

export const SPOT_BRIEFING =
  "Spot hid in a junk pile near Jupiter. Tractor the right trash, melt it into fuel, fly the cave gates, then open the right hatch. Spot is waiting.";
