import type { Item } from "../types";
import { pick, randInt, uid } from "./rng";

export function rectPerimeter(l: number, w: number): number {
  return 2 * (l + w);
}

export function polygonPerimeter(sides: number[]): number {
  return sides.reduce((s, n) => s + n, 0);
}

function gridRect(w: number, h: number): boolean[][] {
  return Array.from({ length: h }, () => Array.from({ length: w }, () => true));
}

function gridL(w: number, h: number): { cells: boolean[][]; perimeter: number } {
  const cells = Array.from({ length: h }, (_, r) =>
    Array.from({ length: w }, (_, c) => r < h - 1 || c < Math.ceil(w / 2)),
  );
  let edges = 0;
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (!cells[r]![c]) continue;
      if (r === 0 || !cells[r - 1]![c]) edges += 1;
      if (r === h - 1 || !cells[r + 1]![c]) edges += 1;
      if (c === 0 || !cells[r]![c - 1]) edges += 1;
      if (c === w - 1 || !cells[r]![c + 1]) edges += 1;
    }
  }
  return { cells, perimeter: edges };
}

export function generateMeaPer(level: number, avoid: Set<string> = new Set(), depth = 0): Item {
  const lv = Math.min(5, Math.max(1, level));
  const retry = () => generateMeaPer(lv, avoid, depth + 1);
  const skip = (signature: string) => avoid.has(signature) && depth < 16;

  if (lv === 1) {
    const kind = pick(["rect", "L"] as const);
    if (kind === "rect") {
      const w = randInt(3, 6);
      const h = randInt(2, 4);
      const answer = 2 * (w + h);
      const signature = `MEA-PER|1|grid|${w}|${h}`;
      if (skip(signature)) return retry();
      return {
        id: uid("MEA-PER"),
        skillId: "MEA-PER",
        level: 1,
        kind: "unit-sides",
        stem: "Count the unit sides around this landing pad. How long is the fence?",
        inputType: "numeric",
        payload: {
          visual: { type: "perimeter", sides: [w, h, w, h], unit: "units", grid: { cells: gridRect(w, h) } },
          unit: "units",
          clockSnap: 1,
          operands: { w, h, p: answer },
        },
        answer,
        answerType: "int",
        hint: "Walk around the edge. Count every outside side once.",
        workedSolution: [`Width ${w} and height ${h}.`, `2 × (${w} + ${h}) = ${answer}.`],
        misconceptionTags: ["counted_squares", "missed_a_side"],
        source: "template",
        signature,
      };
    }
    const w = randInt(4, 6);
    const h = randInt(3, 5);
    const g = gridL(w, h);
    const signature = `MEA-PER|1|L|${w}|${h}|${g.perimeter}`;
    if (skip(signature)) return retry();
    return {
      id: uid("MEA-PER"),
      skillId: "MEA-PER",
      level: 1,
      kind: "unit-sides-l",
      stem: "Count the unit sides around this pad. How long is the fence?",
      inputType: "numeric",
      payload: {
        visual: { type: "perimeter", sides: [g.perimeter], unit: "units", grid: { cells: g.cells } },
        unit: "units",
        clockSnap: 1,
        operands: { w, h, p: g.perimeter },
      },
      answer: g.perimeter,
      answerType: "int",
      hint: "Count each outside edge. Do not count lines inside the pad.",
      workedSolution: [`The fence is ${g.perimeter} unit sides long.`],
      misconceptionTags: ["counted_squares", "counted_inside"],
      source: "template",
      signature,
    };
  }

  if (lv === 2) {
    const l = randInt(4, 18);
    const w = randInt(3, 12);
    const answer = rectPerimeter(l, w);
    const signature = `MEA-PER|2|rect|${l}|${w}`;
    if (skip(signature)) return retry();
    return {
      id: uid("MEA-PER"),
      skillId: "MEA-PER",
      level: 2,
      kind: "rectangle",
      stem: `A rectangular pad is ${l} m by ${w} m. How long is the fence?`,
      inputType: "numeric",
      payload: {
        visual: { type: "perimeter", sides: [l, w, l, w], unit: "m" },
        unit: "m",
        clockSnap: 1,
        operands: { l, w, p: answer },
      },
      answer,
      answerType: "int",
      hint: "Add length and width. Then double that sum.",
      workedSolution: [`${l} + ${w} = ${l + w}.`, `2 × ${l + w} = ${answer} m.`],
      misconceptionTags: ["perimeter_as_area", "added_once"],
      source: "template",
      signature,
    };
  }

  if (lv === 3) {
    const n = pick([5, 6]);
    const sides = Array.from({ length: n }, () => randInt(2, 12));
    const answer = polygonPerimeter(sides);
    const signature = `MEA-PER|3|poly|${sides.join(",")}`;
    if (skip(signature)) return retry();
    return {
      id: uid("MEA-PER"),
      skillId: "MEA-PER",
      level: 3,
      kind: "irregular",
      stem: `This landing pad has ${n} sides. How long is the fence in metres?`,
      inputType: "numeric",
      payload: {
        visual: { type: "perimeter", sides, unit: "m" },
        unit: "m",
        clockSnap: 1,
        operands: Object.fromEntries(sides.map((s, i) => [`s${i + 1}`, s])),
      },
      answer,
      answerType: "int",
      hint: "Add every side. That sum is the fence.",
      workedSolution: [`${sides.join(" + ")} = ${answer} m.`],
      misconceptionTags: ["missed_a_side", "perimeter_as_area"],
      source: "template",
      signature,
    };
  }

  if (lv === 4) {
    const l = randInt(6, 16);
    const w = randInt(4, 12);
    const p = rectPerimeter(l, w);
    const missingIsLength = Math.random() < 0.5;
    const known = missingIsLength ? w : l;
    const missing = missingIsLength ? l : w;
    const signature = `MEA-PER|4|miss|${p}|${known}`;
    if (skip(signature)) return retry();
    return {
      id: uid("MEA-PER"),
      skillId: "MEA-PER",
      level: 4,
      kind: "missing-side",
      stem: `A rectangular pad has a fence of ${p} m. One side is ${known} m. How long is the missing side?`,
      inputType: "numeric",
      payload: {
        visual: {
          type: "perimeter",
          sides: missingIsLength ? [0, w, 0, w] : [l, 0, l, 0],
          unit: "m",
        },
        unit: "m",
        clockSnap: 1,
        operands: { p, known, missing },
      },
      answer: missing,
      answerType: "int",
      hint: "The two lengths and two widths add to the fence. Take away the sides you know.",
      workedSolution: [
        `Two known sides: 2 × ${known} = ${2 * known}.`,
        `${p} − ${2 * known} = ${p - 2 * known}.`,
        `Each missing side is ${(p - 2 * known) / 2} m.`,
      ],
      misconceptionTags: ["divided_perimeter_by_four", "subtracted_once"],
      source: "template",
      signature,
    };
  }

  const aL = randInt(6, 14);
  const aW = randInt(4, 10);
  const bL = randInt(5, 13);
  const bW = randInt(3, 11);
  const pA = rectPerimeter(aL, aW);
  const pB = rectPerimeter(bL, bW);
  if (pA === pB) return retry();
  const answer = Math.abs(pA - pB);
  const signature = `MEA-PER|5|cmp|${pA}|${pB}`;
  if (skip(signature)) return retry();
  const bigger = pA > pB ? "A" : "B";
  return {
    id: uid("MEA-PER"),
    skillId: "MEA-PER",
    level: 5,
    kind: "compare",
    stem: `Pad A is ${aL} m by ${aW} m. Pad B is ${bL} m by ${bW} m. How many metres longer is the bigger fence?`,
    inputType: "numeric",
    payload: {
      visual: {
        type: "perimeter",
        sides: [aL, aW, aL, aW],
        unit: "m",
        compare: { sides: [bL, bW, bL, bW], label: "B" },
      },
      unit: "m",
      clockSnap: 1,
      operands: { aL, aW, bL, bW, pA, pB },
    },
    answer,
    answerType: "int",
    hint: "Find each fence first. Then subtract the smaller from the larger.",
    workedSolution: [
      `Pad A: 2 × (${aL} + ${aW}) = ${pA} m.`,
      `Pad B: 2 × (${bL} + ${bW}) = ${pB} m.`,
      `Pad ${bigger} is longer by ${answer} m.`,
    ],
    misconceptionTags: ["compared_areas", "added_both"],
    source: "template",
    signature,
  };
}
