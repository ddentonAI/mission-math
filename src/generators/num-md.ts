import type { Item } from "../types";
import { pick, randInt, uid } from "./rng";

function factFamily(a: number, b: number): string[] {
  const p = a * b;
  return [
    `${a} × ${b} = ${p}.`,
    `${b} × ${a} = ${p}.`,
    `${p} ÷ ${a} = ${b}.`,
    `${p} ÷ ${b} = ${a}.`,
  ];
}

export function generateNumMd(level: number, avoid: Set<string> = new Set(), depth = 0): Item {
  const lv = Math.min(5, Math.max(1, level));
  const retry = () => generateNumMd(lv, avoid, depth + 1);
  const skip = (signature: string) => avoid.has(signature) && depth < 16;

  if (lv === 1) {
    const groups = randInt(2, 6);
    const size = randInt(2, 5);
    const answer = groups * size;
    const signature = `NUM-MD|1|*|${groups}|${size}`;
    if (skip(signature)) return retry();
    const stem = pick([
      `${groups} crew pods hold ${size} cadets each. How many cadets?`,
      `${groups} bags hold ${size} moon rocks each. How many rocks?`,
    ]);
    return {
      id: uid("NUM-MD"),
      skillId: "NUM-MD",
      level: 1,
      kind: "equal-groups",
      stem,
      inputType: "numeric",
      payload: {
        visual: { type: "groups", groups, size },
        clockSnap: 1,
        operands: { a: groups, b: size, op: "*" },
      },
      answer,
      answerType: "int",
      hint: "Count the groups. Skip count until you have used every group.",
      workedSolution: [
        `${groups} groups of ${size}.`,
        Array.from({ length: groups }, (_, i) => (i + 1) * size).join(", ") + ".",
        `Total: ${answer}.`,
      ],
      misconceptionTags: ["added_instead", "off_by_one_group"],
      source: "template",
      signature,
    };
  }

  if (lv === 2) {
    const rows = randInt(2, 6);
    const cols = randInt(2, 6);
    const answer = rows * cols;
    const signature = `NUM-MD|2|*|${rows}|${cols}`;
    if (skip(signature)) return retry();
    return {
      id: uid("NUM-MD"),
      skillId: "NUM-MD",
      level: 2,
      kind: "array",
      stem: `A solar panel has ${rows} rows with ${cols} tiles in each row. How many tiles?`,
      inputType: "numeric",
      payload: {
        visual: { type: "array", rows, cols },
        clockSnap: 1,
        operands: { a: rows, b: cols, op: "*" },
      },
      answer,
      answerType: "int",
      hint: `Count one row. Then multiply by the number of rows.`,
      workedSolution: [`${rows} rows of ${cols}.`, `${rows} × ${cols} = ${answer}.`],
      misconceptionTags: ["added_rows_and_cols", "counted_one_row"],
      source: "template",
      signature,
    };
  }

  const easy = [2, 5, 10] as const;
  const harder = [3, 4, 6, 7, 8, 9] as const;

  if (lv === 3 || lv === 4) {
    const factor = lv === 3 ? pick(easy) : pick(harder);
    const other = randInt(2, 10);
    const answer = factor * other;
    const signature = `NUM-MD|${lv}|*|${factor}|${other}`;
    if (skip(signature)) return retry();
    const stem = pick([
      `${other} panels make ${factor} units of power each. How much power?`,
      `Each pod needs ${factor} bolts. There are ${other} pods. How many bolts?`,
    ]);
    return {
      id: uid("NUM-MD"),
      skillId: "NUM-MD",
      level: lv,
      kind: "fact",
      stem,
      inputType: "numeric",
      payload: {
        visual: { type: "groups", groups: other, size: factor },
        clockSnap: 1,
        operands: { a: other, b: factor, op: "*" },
      },
      answer,
      answerType: "int",
      hint: "Use a multiplication fact you know. Think equal groups.",
      workedSolution: [`${other} × ${factor} = ${answer}.`],
      misconceptionTags: ["off_by_one_skip", "added_instead"],
      source: "template",
      signature,
    };
  }

  const withRemainder = Math.random() < 0.45;
  const d = randInt(2, 9);
  const q = randInt(2, 9);
  const rem = withRemainder ? randInt(1, d - 1) : 0;
  const dividend = d * q + rem;
  const signature = `NUM-MD|5|/|${dividend}|${d}`;
  if (skip(signature)) return retry();

  if (rem === 0) {
    return {
      id: uid("NUM-MD"),
      skillId: "NUM-MD",
      level: 5,
      kind: "division",
      stem: `${dividend} moon rocks go into bags of ${d}. How many bags?`,
      inputType: "numeric",
      payload: {
        visual: { type: "groups", groups: q, size: d },
        clockSnap: 1,
        operands: { a: dividend, b: d, op: "/" },
      },
      answer: q,
      answerType: "int",
      hint: "Think of a multiplication fact that matches this sharing.",
      workedSolution: factFamily(d, q),
      misconceptionTags: ["remainder_ignored", "swapped_div"],
      source: "template",
      signature,
    };
  }

  return {
    id: uid("NUM-MD"),
    skillId: "NUM-MD",
    level: 5,
    kind: "division-remainder",
    stem: `${dividend} snacks are shared by ${d} cadets. How many snacks are left over?`,
    inputType: "numeric",
    payload: {
      visual: { type: "groups", groups: d, size: q },
      clockSnap: 1,
      operands: { a: dividend, b: d, op: "/", remainder: rem },
    },
    answer: rem,
    answerType: "int",
    hint: `Share equally first. The leftover is what does not make another full group.`,
    workedSolution: [
      `${d} × ${q} = ${d * q}.`,
      `${dividend} − ${d * q} = ${rem} left over.`,
    ],
    misconceptionTags: ["remainder_ignored", "gave_the_quotient"],
    source: "template",
    signature,
  };
}
