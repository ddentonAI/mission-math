export type SkillId =
  | "NUM-PV"
  | "NUM-AS"
  | "NUM-MD"
  | "NUM-FR"
  | "PAT-SEQ"
  | "PAT-MUL"
  | "ALG-EQ"
  | "GEO-POLY"
  | "GEO-TRANS"
  | "MEA-LEN"
  | "MEA-PER"
  | "MEA-ANG"
  | "TIM-CLK"
  | "TIM-DAY"
  | "STA-DATA";

export type InputType = "numeric" | "clock" | "choice";
export type AnswerType = "int" | "time" | "choice";
export type MasteryState =
  | "locked"
  | "introduced"
  | "practising"
  | "mastered"
  | "review_due";

export type TimeAnswer = { hours: number; minutes: number };

export type ChoiceOption = {
  id: string;
  label: string;
  misconception?: string;
};

export type CargoVisual = {
  type: "cargo";
  a: number;
  b: number;
  op: "+" | "-";
  c?: number;
  op2?: "+" | "-";
};

export type ArrayVisual = {
  type: "array";
  rows: number;
  cols: number;
};

export type GroupsVisual = {
  type: "groups";
  groups: number;
  size: number;
};

export type PerimeterVisual = {
  type: "perimeter";
  sides: number[];
  unit: string;
  grid?: { cells: boolean[][] };
  compare?: { sides: number[]; label: string };
};

export type ClockVisual = {
  type: "clock";
  hours?: number;
  minutes?: number;
  showHands: boolean;
};

export type ItemVisual =
  | CargoVisual
  | ArrayVisual
  | GroupsVisual
  | PerimeterVisual
  | ClockVisual;

export type Item = {
  id: string;
  skillId: SkillId;
  level: number;
  kind: string;
  stem: string;
  inputType: InputType;
  payload: {
    visual?: ItemVisual;
    options?: ChoiceOption[];
    unit?: string;
    clockSnap: 1 | 5;
    operands: Record<string, number | string>;
  };
  answer: number | TimeAnswer | string;
  answerType: AnswerType;
  hint: string;
  workedSolution: string[];
  misconceptionTags: string[];
  source: "template";
  signature: string;
};

export type StudentSettings = {
  sound: boolean;
  font: "fredoka" | "lexend";
  textScale: number;
};

export type Student = {
  id: string;
  displayName: string;
  createdAt: string;
  settings: StudentSettings;
  fuelTotal: number;
  streakDays: number;
  lastPracticeDate: string | null;
  lastFocusSkillId: SkillId | null;
  lastSessionDate: string | null;
  mapStop: number;
};

export type AttemptRecord = {
  id: string;
  sessionId: string;
  itemId: string;
  skillId: SkillId;
  level: number;
  response: unknown;
  correct: boolean;
  attemptNumber: number;
  hintUsed: boolean;
  latencyMs: number;
  createdAt: string;
  errorsOnItem: number;
  misconception?: string;
};

export type MasteryCell = {
  studentId: string;
  skillId: SkillId;
  level: number;
  state: MasteryState;
  ewma: number;
  streak: number;
  attempts: number;
  lastSeenAt: string | null;
  recentErrors: number[];
  ewmaRising: boolean;
};

export type ReviewEntry = {
  studentId: string;
  skillId: SkillId;
  level: number;
  box: number;
  dueAt: string;
};

export type SessionPhase =
  | "preflight"
  | "mission"
  | "review"
  | "bonus"
  | "debrief";

export type PlannedItem = {
  item: Item;
  phase: Exclude<SessionPhase, "debrief">;
  skippable: boolean;
};

export type LiveSession = {
  id: string;
  studentId: string;
  startedAt: string;
  items: PlannedItem[];
  index: number;
  attemptNumber: number;
  hintUsed: boolean;
  draft: string;
  clockDraft: TimeAnswer;
  fuelEarned: number;
  itemsCorrect: number;
  consecutiveDoubleMiss: number;
  focusSkillId: SkillId;
  focusLevel: number;
  itemStartedAt: number;
  completed: boolean;
  praise: string | null;
};

export type Screen =
  | "launch"
  | "modes"
  | "skills"
  | "briefing"
  | "problem"
  | "worked"
  | "debrief"
  | "paused"
  | "zapper"
  | "recycler"
  | "caves"
  | "hatches"
  | "spot-found";
