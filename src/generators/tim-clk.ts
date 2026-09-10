import type { Item, TimeAnswer } from "../types";
import { pick, randInt, uid } from "./rng";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function spokenTime(h: number, m: number): string {
  if (m === 0) return `${h} o'clock`;
  if (m === 30) return `half past ${h}`;
  if (m === 15) return `quarter past ${h}`;
  if (m === 45) return `quarter to ${h === 12 ? 1 : h + 1}`;
  if (m < 10) return `${h}:0${m}`;
  return `${h}:${pad(m)}`;
}

function nextHour(h: number): number {
  return h === 12 ? 1 : h + 1;
}

export function minutesUntilNextHour(minutes: number): number {
  if (minutes === 0) return 60;
  return 60 - minutes;
}

export function generateTimClk(level: number, avoid: Set<string> = new Set(), depth = 0): Item {
  const lv = Math.min(5, Math.max(1, level));
  const retry = () => generateTimClk(lv, avoid, depth + 1);
  const skip = (signature: string) => avoid.has(signature) && depth < 16;
  const hours = randInt(1, 12);

  if (lv <= 3) {
    let minutes = 0;
    if (lv === 1) minutes = pick([0, 30]);
    else if (lv === 2) minutes = randInt(0, 11) * 5;
    else minutes = randInt(0, 59);

    const signature = `TIM-CLK|${lv}|set|${hours}|${minutes}`;
    if (skip(signature)) return retry();

    const spoken = spokenTime(hours, minutes);
    const stem = pick([
      `Set the mission clock to ${spoken}.`,
      `Launch is at ${spoken}. Set the clock.`,
    ]);

    return {
      id: uid("TIM-CLK"),
      skillId: "TIM-CLK",
      level: lv,
      kind: "set-clock",
      stem,
      inputType: "clock",
      payload: {
        visual: { type: "clock", showHands: false },
        clockSnap: lv <= 2 ? 5 : 1,
        operands: { hours, minutes },
      },
      answer: { hours, minutes } satisfies TimeAnswer,
      answerType: "time",
      hint:
        minutes === 0
          ? "The short hand points at the hour. The long hand points straight up."
          : minutes === 30
            ? "Half past means the long hand points straight down."
            : "The long hand shows the minutes. The short hand shows the hour.",
      workedSolution: [
        `Hour hand near ${hours}.`,
        `Minute hand at ${minutes} minutes.`,
        `The time is ${hours}:${pad(minutes)}.`,
      ],
      misconceptionTags: ["minutes_as_hours", "hour_hand_only", "half_past_wrong"],
      source: "template",
      signature,
    };
  }

  if (lv === 4) {
    const minutes = pick([5, 10, 15, 20, 25, 35, 40, 45, 50, 55]);
    const until = minutesUntilNextHour(minutes);
    const signature = `TIM-CLK|4|until|${hours}|${minutes}`;
    if (skip(signature)) return retry();
    const shown = `${hours}:${pad(minutes)}`;
    return {
      id: uid("TIM-CLK"),
      skillId: "TIM-CLK",
      level: 4,
      kind: "until-hour",
      stem: `The clock shows ${shown}. How many minutes until ${nextHour(hours)}:00?`,
      inputType: "numeric",
      payload: {
        visual: { type: "clock", hours, minutes, showHands: true },
        unit: "min",
        clockSnap: 5,
        operands: { hours, minutes, until },
      },
      answer: until,
      answerType: "int",
      hint: "Count minutes from the long hand up to 12.",
      workedSolution: [`60 − ${minutes} = ${until} minutes.`],
      misconceptionTags: ["used_shown_minutes", "counted_from_hour_hand"],
      source: "template",
      signature,
    };
  }

  const startH = randInt(1, 11);
  const startM = randInt(0, 11) * 5;
  const elapsed = randInt(1, 8) * 5;
  let endM = startM + elapsed;
  let endH = startH;
  if (endM >= 60) {
    endM -= 60;
    endH = nextHour(startH);
  }
  const signature = `TIM-CLK|5|elapsed|${startH}|${startM}|${elapsed}`;
  if (skip(signature)) return retry();

  return {
    id: uid("TIM-CLK"),
    skillId: "TIM-CLK",
    level: 5,
    kind: "elapsed",
    stem: `The rover left at ${startH}:${pad(startM)} and landed at ${endH}:${pad(endM)}. How many minutes did it take?`,
    inputType: "numeric",
    payload: {
      visual: { type: "clock", hours: startH, minutes: startM, showHands: true },
      unit: "min",
      clockSnap: 5,
      operands: { startH, startM, endH, endM, elapsed },
    },
    answer: elapsed,
    answerType: "int",
    hint: "Count on from the start time until the land time.",
    workedSolution: [`From ${startH}:${pad(startM)} to ${endH}:${pad(endM)} is ${elapsed} minutes.`],
    misconceptionTags: ["subtracted_hours", "counted_to_next_hour"],
    source: "template",
    signature,
  };
}
