import curriculumJson from "../curriculum.json";
import type { SkillId } from "./types";

export type SkillNode = {
  id: SkillId;
  strand: string;
  title: string;
  outcomeRef: string;
  theme: string;
  prereqs: SkillId[];
  maxLevel: number;
  levels: string[];
};

export const STUDENT_NAME = curriculumJson.student.displayName;
export const STUDENT_ID = curriculumJson.student.id;
export const PHASE1_SKILLS = curriculumJson.phase1SkillIds as SkillId[];

export const SKILL_NODES: SkillNode[] = curriculumJson.nodes as SkillNode[];

export const SKILL_BY_ID: Record<SkillId, SkillNode> = Object.fromEntries(
  SKILL_NODES.map((n) => [n.id, n]),
) as Record<SkillId, SkillNode>;

export function levelDescriptor(skillId: SkillId, level: number): string {
  return SKILL_BY_ID[skillId].levels[level - 1] ?? `level ${level}`;
}

export const SKILL_CHOICES: { id: SkillId; label: string; blurb: string }[] = [
  { id: "NUM-AS", label: "Add and subtract", blurb: "Load cargo. Plus and minus." },
  { id: "NUM-MD", label: "Times and divide", blurb: "Crew pods and solar panels." },
  { id: "TIM-CLK", label: "Tell the time", blurb: "Drag the clock hands." },
  { id: "MEA-PER", label: "Fences", blurb: "How long is the landing pad fence?" },
];
