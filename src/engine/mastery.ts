import { PHASE1_SKILLS } from "../curriculum";
import type { MasteryCell, SkillId } from "../types";

export const ALPHA = 0.18;
export const LEVEL_UP_ATTEMPTS = 12;
export const LEVEL_UP_EWMA = 0.9;
export const LEVEL_UP_STREAK = 5;
export const STUDENT_ID = "alastair";

export function emptyMastery(skillId: SkillId): MasteryCell {
  const unlocked = PHASE1_SKILLS.includes(skillId);
  return {
    studentId: STUDENT_ID,
    skillId,
    level: 1,
    state: unlocked ? "introduced" : "locked",
    ewma: 0.5,
    streak: 0,
    attempts: 0,
    lastSeenAt: null,
    recentErrors: [],
    ewmaRising: false,
  };
}

export function outcomeScore(correct: boolean, hintUsed: boolean, errorsOnItem: number): number {
  if (!correct) return 0;
  if (hintUsed || errorsOnItem > 0) return 0.6;
  return 1;
}

export function applyAttempt(
  cell: MasteryCell,
  correct: boolean,
  hintUsed: boolean,
  errorsOnItem: number,
  now = new Date().toISOString(),
): MasteryCell {
  const outcome = outcomeScore(correct, hintUsed, errorsOnItem);
  const prev = cell.ewma;
  const ewma = ALPHA * outcome + (1 - ALPHA) * cell.ewma;
  const recentErrors = [...cell.recentErrors, errorsOnItem].slice(-5);
  const attempts = cell.attempts + 1;
  const streak = correct ? cell.streak + 1 : 0;

  let level = cell.level;
  let state: MasteryCell["state"] = cell.state === "locked" ? "introduced" : "practising";

  const lastThree = recentErrors.slice(-3);
  const noDoubleMissRecently = lastThree.length < 3 || !lastThree.some((e) => e >= 2);
  const readyToRise =
    ewma >= LEVEL_UP_EWMA &&
    attempts >= LEVEL_UP_ATTEMPTS &&
    streak >= LEVEL_UP_STREAK &&
    noDoubleMissRecently;
  if (readyToRise && level < 5) {
    level += 1;
    state = "practising";
  } else if (readyToRise && level >= 5) {
    state = "mastered";
  }

  const last5 = recentErrors.slice(-5);
  const shouldDrop =
    (last5.length >= 5 && ewma <= 0.45) ||
    (recentErrors.length >= 2 && recentErrors.at(-1) === 2 && recentErrors.at(-2) === 2);
  if (shouldDrop && level > 1 && state !== "mastered") {
    level -= 1;
  }

  if (state === "mastered") {
    // stay mastered; review engine reopens later
  } else if (cell.state === "mastered") {
    state = "practising";
  }

  return {
    ...cell,
    level,
    state,
    ewma,
    streak,
    attempts,
    lastSeenAt: now,
    recentErrors,
    ewmaRising: ewma > prev,
  };
}

export function recencyGapNorm(lastSeenAt: string | null, now = Date.now()): number {
  if (!lastSeenAt) return 1;
  const days = (now - new Date(lastSeenAt).getTime()) / 86_400_000;
  return Math.min(1, days / 6);
}

export function focusPriority(cell: MasteryCell): number {
  const readiness = cell.state === "locked" ? 0 : 1;
  return 0.5 * (1 - cell.ewma) + 0.3 * recencyGapNorm(cell.lastSeenAt) + 0.2 * readiness;
}
