import { PHASE1_SKILLS, SKILL_BY_ID, STUDENT_NAME } from "../curriculum";
import { generateItem } from "../generators";
import type { LiveSession, MasteryCell, PlannedItem, SkillId, Student } from "../types";
import { focusPriority } from "./mastery";

const PREFLIGHT = 4;
const MISSION_MIN = 8;
const MISSION_MAX = 10;
const REVIEW_MAX = 4;

function clampLevel(n: number): number {
  return Math.min(5, Math.max(1, n));
}

export function pickFocus(mastery: Record<SkillId, MasteryCell>, student: Student): SkillId {
  const open = PHASE1_SKILLS.filter((id) => mastery[id]?.state !== "locked");
  const ranked = [...open].sort((a, b) => focusPriority(mastery[b]!) - focusPriority(mastery[a]!));

  const today = new Date().toISOString().slice(0, 10);
  const last = student.lastFocusSkillId;
  const sameDay = student.lastSessionDate === today;
  const rising = last ? mastery[last]?.ewmaRising : false;

  if (last && sameDay && rising && open.includes(last)) return last;
  if (last && ranked[0] === last && ranked[1] && !rising) return ranked[1];
  return ranked[0] ?? "NUM-AS";
}

export function drawLevel(focusLevel: number, roll = Math.random()): number {
  if (focusLevel <= 1) {
    if (roll < 0.08) return 2;
    return 1;
  }
  if (roll < 0.32) return clampLevel(focusLevel - 1);
  if (roll < 0.38) return clampLevel(focusLevel + 1);
  return focusLevel;
}

function makePlanned(
  skillId: SkillId,
  level: number,
  phase: PlannedItem["phase"],
  avoid: Set<string>,
  skippable = false,
): PlannedItem {
  const item = generateItem(skillId, level, avoid);
  avoid.add(item.signature);
  return { item, phase, skippable };
}

export function assembleSession(
  mastery: Record<SkillId, MasteryCell>,
  student: Student,
  reviewDue: { skillId: SkillId; level: number }[] = [],
  priorSignatures: Set<string> = new Set(),
  forcedSkill?: SkillId,
): LiveSession {
  const firstFlight = !student.lastPracticeDate;
  const focusSkillId = forcedSkill ?? (firstFlight ? "NUM-AS" : pickFocus(mastery, student));
  const focusLevel = mastery[focusSkillId]?.level ?? 1;
  const avoid = new Set<string>(priorSignatures);
  const items: PlannedItem[] = [];
  const easyLevel = clampLevel(focusLevel - (focusLevel > 1 ? 1 : 0));

  for (let i = 0; i < PREFLIGHT; i++) {
    items.push(makePlanned(focusSkillId, easyLevel, "preflight", avoid));
  }

  const missionCount = MISSION_MIN + Math.floor(Math.random() * (MISSION_MAX - MISSION_MIN + 1));
  for (let i = 0; i < missionCount; i++) {
    const isLast = i === missionCount - 1;
    const level = isLast ? focusLevel : drawLevel(focusLevel);
    items.push(makePlanned(focusSkillId, level, "mission", avoid));
  }

  const reviews = forcedSkill ? [] : reviewDue.slice(0, REVIEW_MAX);
  for (const r of reviews) {
    items.push(makePlanned(r.skillId, r.level, "review", avoid));
  }

  items.push(makePlanned(focusSkillId, focusLevel, "bonus", avoid, true));

  return {
    id: `ses-${Date.now().toString(36)}`,
    studentId: student.id,
    startedAt: new Date().toISOString(),
    items,
    index: 0,
    attemptNumber: 1,
    hintUsed: false,
    draft: "",
    clockDraft: { hours: 12, minutes: 0 },
    fuelEarned: 0,
    itemsCorrect: 0,
    consecutiveDoubleMiss: 0,
    focusSkillId,
    focusLevel,
    itemStartedAt: Date.now(),
    completed: false,
    praise: null,
  };
}

export function fuelFor(correct: boolean, firstTry: boolean): number {
  if (correct && firstTry) return 10;
  if (correct) return 6;
  return 3;
}

export function sessionPraise(session: LiveSession): string {
  const skill = SKILL_BY_ID[session.focusSkillId].title.toLowerCase();
  const n = session.itemsCorrect;
  if (n >= 12) return `${STUDENT_NAME} nailed ${skill} today. That was a strong flight.`;
  if (n >= 8) return `${STUDENT_NAME} kept working through ${skill}. The ship is sharper now.`;
  return `${STUDENT_NAME} showed up and practised ${skill}. That is how cadets grow.`;
}

export function briefingText(session: LiveSession): string {
  const node = SKILL_BY_ID[session.focusSkillId];
  return `Cadet ${STUDENT_NAME}, today we fly ${node.theme.split(":")[0]!.trim().toLowerCase()}. ${node.levels[session.focusLevel - 1]}.`;
}
