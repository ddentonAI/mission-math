import { PHASE1_SKILLS, SKILL_NODES, STUDENT_ID, STUDENT_NAME } from "./curriculum";
import { emptyMastery } from "./engine/mastery";
import type {
  AttemptRecord,
  LiveSession,
  MasteryCell,
  ReviewEntry,
  SkillId,
  Student,
} from "./types";

const KEY = "mission-math-v1";

type Db = {
  student: Student;
  mastery: Record<SkillId, MasteryCell>;
  attempts: AttemptRecord[];
  review: ReviewEntry[];
  session: LiveSession | null;
  signatures: { signature: string; at: string }[];
};

function defaultStudent(): Student {
  return {
    id: STUDENT_ID,
    displayName: STUDENT_NAME,
    createdAt: new Date().toISOString(),
    settings: { sound: true, font: "fredoka", textScale: 1 },
    fuelTotal: 0,
    streakDays: 0,
    lastPracticeDate: null,
    lastFocusSkillId: null,
    lastSessionDate: null,
    mapStop: 0,
  };
}

function defaultDb(): Db {
  const mastery = Object.fromEntries(
    SKILL_NODES.map((n) => [n.id, emptyMastery(n.id)]),
  ) as Record<SkillId, MasteryCell>;
  return {
    student: defaultStudent(),
    mastery,
    attempts: [],
    review: [],
    session: null,
    signatures: [],
  };
}

function read(): Db {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultDb();
    const parsed = JSON.parse(raw) as Db;
    if (!parsed.student || parsed.student.id !== STUDENT_ID) return defaultDb();
    if (typeof parsed.student.mapStop !== "number") parsed.student.mapStop = 0;
    for (const id of PHASE1_SKILLS) {
      if (!parsed.mastery[id]) parsed.mastery[id] = emptyMastery(id);
    }
    return parsed;
  } catch {
    return defaultDb();
  }
}

function write(db: Db) {
  localStorage.setItem(KEY, JSON.stringify(db));
  void persistIdb(db);
}

async function persistIdb(db: Db) {
  try {
    const req = indexedDB.open("mission-math", 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("kv");
    };
    await new Promise<void>((resolve, reject) => {
      req.onsuccess = () => {
        const tx = req.result.transaction("kv", "readwrite");
        tx.objectStore("kv").put(db, "state");
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      req.onerror = () => reject(req.error);
    });
    if (navigator.storage?.persist) await navigator.storage.persist();
  } catch {
    // localStorage is the fallback
  }
}

export function loadState(): Db {
  return read();
}

export function resetProgress(settings: Student["settings"]): Db {
  const db = defaultDb();
  db.student.settings = settings;
  write(db);
  return db;
}

export function saveStudent(student: Student) {
  const db = read();
  db.student = student;
  write(db);
}

export function saveMastery(mastery: Record<SkillId, MasteryCell>) {
  const db = read();
  db.mastery = mastery;
  write(db);
}

export function saveSession(session: LiveSession | null) {
  const db = read();
  db.session = session;
  write(db);
}

export function recordAttempt(attempt: AttemptRecord, signature: string) {
  const db = read();
  db.attempts = [...db.attempts, attempt].slice(-2000);
  db.signatures = [...db.signatures, { signature, at: attempt.createdAt }].filter((s) => {
    const age = Date.now() - new Date(s.at).getTime();
    return age < 10 * 86_400_000;
  });
  write(db);
}

export function recentSignatures(): Set<string> {
  const db = read();
  return new Set(db.signatures.map((s) => s.signature));
}

export function dueReviews(): ReviewEntry[] {
  const now = Date.now();
  return read().review.filter((r) => new Date(r.dueAt).getTime() <= now);
}

export function queueReview(skillId: SkillId, level: number, box = 1) {
  const db = read();
  const intervals = [1, 3, 7, 16, 35];
  const days = intervals[Math.min(box, 5) - 1] ?? 1;
  const dueAt = new Date(Date.now() + days * 86_400_000).toISOString();
  db.review = db.review.filter((r) => !(r.skillId === skillId && r.level === level));
  db.review.push({
    studentId: STUDENT_ID,
    skillId,
    level,
    box,
    dueAt,
  });
  write(db);
}

export function updateStreak(student: Student): Student {
  const today = new Date().toISOString().slice(0, 10);
  if (student.lastPracticeDate === today) return student;
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const streakDays =
    student.lastPracticeDate === yesterday || student.lastPracticeDate === null
      ? (student.lastPracticeDate === yesterday ? student.streakDays + 1 : 1)
      : student.streakDays;
  return { ...student, lastPracticeDate: today, streakDays: Math.max(1, streakDays) };
}
