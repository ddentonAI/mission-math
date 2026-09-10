import type { Item, SkillId } from "../types";
import { generateMeaPer } from "./mea-per";
import { generateNumAs } from "./num-as";
import { generateNumMd } from "./num-md";
import { generateTimClk } from "./tim-clk";

export function generateItem(skillId: SkillId, level: number, avoid: Set<string> = new Set()): Item {
  switch (skillId) {
    case "NUM-AS":
      return generateNumAs(level, avoid);
    case "NUM-MD":
      return generateNumMd(level, avoid);
    case "TIM-CLK":
      return generateTimClk(level, avoid);
    case "MEA-PER":
      return generateMeaPer(level, avoid);
    default:
      return generateNumAs(1, avoid);
  }
}

export function wordCount(stem: string): number {
  return stem.trim().split(/\s+/).length;
}

export function hintLeaksAnswer(item: Item): boolean {
  const hint = item.hint;
  if (item.answerType === "int") {
    const ans = String(item.answer);
    const re = new RegExp(`(^|\\D)${ans}(\\D|$)`);
    return re.test(hint);
  }
  if (item.answerType === "time") {
    const t = item.answer as { hours: number; minutes: number };
    if (t.minutes === 0) return false;
    return hint.includes(`${t.hours}:${t.minutes.toString().padStart(2, "0")}`);
  }
  return hint.includes(String(item.answer));
}
