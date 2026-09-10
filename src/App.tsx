import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { playCorrect, playNeutral, setSoundEnabled, unlockAudio } from "./audio";
import { CaveGates } from "./components/arcade/CaveGates";
import { FuelRecycler } from "./components/arcade/FuelRecycler";
import { HatchHunt } from "./components/arcade/HatchHunt";
import { TrashZapper } from "./components/arcade/TrashZapper";
import { BriefingScreen } from "./components/BriefingScreen";
import { DebriefScreen } from "./components/DebriefScreen";
import { LaunchScreen } from "./components/LaunchScreen";
import { PlanetArrival } from "./components/PlanetArrival";
import { PlanetGlobe } from "./components/PlanetGlobe";
import { ModeSelect } from "./components/ModeSelect";
import { SkillSelect } from "./components/SkillSelect";
import { PauseSheet } from "./components/PauseSheet";
import { ProblemScreen } from "./components/ProblemScreen";
import { SpotFound } from "./components/SpotFound";
import { Stage } from "./components/Stage";
import { WorkedExample } from "./components/WorkedExample";
import { SKILL_BY_ID, STUDENT_NAME } from "./curriculum";
import { grade } from "./engine/grader";
import { applyAttempt } from "./engine/mastery";
import { assembleSession, briefingText, fuelFor, sessionPraise } from "./engine/session";
import { generateItem } from "./generators";
import { MODE_META, SPOT_BRIEFING, SPOT_STAGES, type ArcadeMode } from "./modes/arcade";
import { planetAt } from "./planets";
import {
  dueReviews,
  loadState,
  queueReview,
  recentSignatures,
  recordAttempt,
  saveMastery,
  resetProgress,
  saveSession,
  saveStudent,
  updateStreak,
} from "./storage";
import type { LiveSession, MasteryCell, Screen, SkillId, Student } from "./types";

const SESSION_MS = 15 * 60 * 1000;

function stageScreen(mode: ArcadeMode): Screen {
  if (mode === "zapper") return "zapper";
  if (mode === "recycler") return "recycler";
  if (mode === "caves") return "caves";
  return "hatches";
}

export function App() {
  const boot = useMemo(() => loadState(), []);
  const [student, setStudent] = useState<Student>(boot.student);
  const [mastery, setMastery] = useState(boot.mastery);
  const [session, setSession] = useState<LiveSession | null>(boot.session);
  const [screen, setScreen] = useState<Screen>(boot.session && !boot.session.completed ? "problem" : "launch");
  const [nudge, setNudge] = useState(false);
  const [showArrival, setShowArrival] = useState(false);
  const [skyPlanet, setSkyPlanet] = useState<number | null>(
    boot.student.mapStop > 0 ? boot.student.mapStop - 1 : null,
  );
  const pendingAfterArrival = useRef<LiveSession | null>(null);
  const arrivalLock = useRef(false);
  const [paused, setPaused] = useState(false);
  const [briefingCopy, setBriefingCopy] = useState("");
  const [briefingNext, setBriefingNext] = useState<Screen>("problem");
  const [campaign, setCampaign] = useState(false);
  const [spotStep, setSpotStep] = useState(0);
  const [arcadeBank, setArcadeBank] = useState({ fuel: 0, correct: 0 });
  const [soloTitle, setSoloTitle] = useState("Hangar game");
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  const current = session?.items[session.index];
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const arcadeLevel = mastery["NUM-AS"]?.level ?? 1;

  useEffect(() => {
    setSoundEnabled(student.settings.sound);
  }, [student.settings.sound]);

  const persistSession = useCallback((next: LiveSession | null) => {
    setSession(next);
    saveSession(next);
  }, []);

  async function acquireWake() {
    try {
      wakeLock.current = (await navigator.wakeLock?.request("screen")) ?? null;
    } catch {
      wakeLock.current = null;
    }
  }

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") void acquireWake();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (screen !== "problem" || !session) return;
    setNudge(false);
    const t1 = window.setTimeout(() => setNudge(true), 45_000);
    const t2 = window.setTimeout(() => {
      const live = sessionRef.current;
      if (live) persistSession({ ...live, hintUsed: true });
    }, 50_000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [screen, session?.index, session?.id, persistSession]);

  function creditStudent(fuel: number) {
    const next = updateStreak({ ...student, fuelTotal: student.fuelTotal + fuel });
    setStudent(next);
    saveStudent(next);
  }

  function startMission(forcedSkill?: SkillId) {
    void unlockAudio();
    void acquireWake();
    const nextStudent = updateStreak(student);
    const ses = assembleSession(
      mastery,
      nextStudent,
      dueReviews().map((r) => ({ skillId: r.skillId, level: r.level })),
      recentSignatures(),
      forcedSkill,
    );
    const withStudent = {
      ...nextStudent,
      lastFocusSkillId: ses.focusSkillId,
      lastSessionDate: new Date().toISOString().slice(0, 10),
    };
    setStudent(withStudent);
    saveStudent(withStudent);
    persistSession({ ...ses, itemStartedAt: Date.now() });
    setCampaign(false);
    setShowArrival(false);
    setSkyPlanet(withStudent.mapStop > 0 ? withStudent.mapStop - 1 : null);
    pendingAfterArrival.current = null;
    setBriefingCopy(briefingText(ses));
    setBriefingNext("problem");
    setScreen("briefing");
  }

  function startSpot() {
    void unlockAudio();
    void acquireWake();
    setCampaign(true);
    setSpotStep(0);
    setArcadeBank({ fuel: 0, correct: 0 });
    setBriefingCopy(SPOT_BRIEFING);
    setBriefingNext("zapper");
    setScreen("briefing");
  }

  function startSolo(mode: ArcadeMode) {
    void unlockAudio();
    void acquireWake();
    setCampaign(false);
    setArcadeBank({ fuel: 0, correct: 0 });
    setSoloTitle(MODE_META[mode].title);
    setBriefingCopy(MODE_META[mode].briefing);
    setBriefingNext(stageScreen(mode));
    setScreen("briefing");
  }

  function timeUp(ses: LiveSession) {
    return Date.now() - new Date(ses.startedAt).getTime() >= SESSION_MS || ses.index >= 20;
  }

  function finish(ses: LiveSession) {
    const praise = sessionPraise(ses);
    const done = { ...ses, completed: true, praise };
    persistSession(done);
    const nextStudent = {
      ...student,
      fuelTotal: student.fuelTotal + ses.fuelEarned,
    };
    setStudent(nextStudent);
    saveStudent(nextStudent);
    setScreen("debrief");
    void wakeLock.current?.release();
  }

  function gotoNext(ses: LiveSession) {
    const nextIndex = ses.index + 1;
    if (nextIndex >= ses.items.length || timeUp({ ...ses, index: nextIndex })) {
      finish({ ...ses, index: Math.min(nextIndex, ses.items.length) });
      return;
    }
    persistSession({
      ...ses,
      index: nextIndex,
      attemptNumber: 1,
      hintUsed: false,
      draft: "",
      clockDraft: { hours: 12, minutes: 0 },
      itemStartedAt: Date.now(),
    });
    setScreen("problem");
  }

  function dropDifficulty(ses: LiveSession): LiveSession {
    const level = Math.max(1, ses.focusLevel - 1);
    const avoid = new Set(ses.items.map((p) => p.item.signature));
    const items = ses.items.map((p, i) => {
      if (i <= ses.index) return p;
      const item = generateItem(ses.focusSkillId, p.phase === "bonus" ? Math.min(5, level + 1) : level, avoid);
      avoid.add(item.signature);
      return { ...p, item };
    });
    return { ...ses, items, focusLevel: level, consecutiveDoubleMiss: 0 };
  }

  function submit() {
    if (!session || !current) return;
    const item = current.item;
    const response = item.inputType === "clock" ? session.clockDraft : session.draft;
    const ok = grade(item, response);
    const latency = Date.now() - session.itemStartedAt;
    const errorsOnItem = ok ? session.attemptNumber - 1 : session.attemptNumber;
    const firstTry = session.attemptNumber === 1 && !session.hintUsed;

    recordAttempt(
      {
        id: `att-${Date.now()}`,
        sessionId: session.id,
        itemId: item.id,
        skillId: item.skillId,
        level: item.level,
        response,
        correct: ok,
        attemptNumber: session.attemptNumber,
        hintUsed: session.hintUsed,
        latencyMs: latency,
        createdAt: new Date().toISOString(),
        errorsOnItem,
      },
      item.signature,
    );

    const cell = applyAttempt(mastery[item.skillId] as MasteryCell, ok, session.hintUsed, errorsOnItem);
    const nextMastery = { ...mastery, [item.skillId]: cell };
    setMastery(nextMastery);
    saveMastery(nextMastery);

    if (ok) {
      playCorrect();
      const fuel = session.fuelEarned + fuelFor(true, firstTry);
      const next = {
        ...session,
        fuelEarned: fuel,
        itemsCorrect: session.itemsCorrect + 1,
        consecutiveDoubleMiss: 0,
      };
      persistSession(next);
      const stop = student.mapStop;
      const flown = { ...student, mapStop: stop + 1 };
      setStudent(flown);
      saveStudent(flown);
      arrivalLock.current = false;
      pendingAfterArrival.current = next;
      setSkyPlanet(stop);
      setShowArrival(true);
      return;
    }

    playNeutral();
    if (session.attemptNumber === 1) {
      persistSession({
        ...session,
        attemptNumber: 2,
        hintUsed: true,
        fuelEarned: session.fuelEarned + fuelFor(false, false),
      });
      return;
    }

    queueReview(item.skillId, Math.max(1, item.level - 1), 1);
    let next: LiveSession = {
      ...session,
      fuelEarned: session.fuelEarned + fuelFor(false, false),
      consecutiveDoubleMiss: session.consecutiveDoubleMiss + 1,
    };
    if (next.consecutiveDoubleMiss >= 2) next = dropDifficulty(next);
    persistSession(next);
    setScreen("worked");
  }

  function resetAll() {
    const db = resetProgress(student.settings);
    setStudent(db.student);
    setMastery(db.mastery);
    persistSession(null);
    setShowArrival(false);
    setSkyPlanet(null);
    pendingAfterArrival.current = null;
    setPaused(false);
    setCampaign(false);
    setArcadeBank({ fuel: 0, correct: 0 });
    setScreen("launch");
    void wakeLock.current?.release();
  }

  function closeArrival() {
    if (arrivalLock.current) return;
    arrivalLock.current = true;
    setShowArrival(false);
    const next = pendingAfterArrival.current;
    pendingAfterArrival.current = null;
    if (!next || !current) return;
    if (current.skippable) finish(next);
    else gotoNext(next);
  }

  function onArcadeComplete(fuel: number, correct: number) {
    const bank = { fuel: arcadeBank.fuel + fuel, correct: arcadeBank.correct + correct };
    setArcadeBank(bank);
    if (campaign) {
      const nextStep = spotStep + 1;
      if (nextStep >= SPOT_STAGES.length) {
        creditStudent(bank.fuel);
        setScreen("spot-found");
        void wakeLock.current?.release();
        return;
      }
      setSpotStep(nextStep);
      const mode = SPOT_STAGES[nextStep]!;
      setBriefingCopy(MODE_META[mode].briefing);
      setBriefingNext(stageScreen(mode));
      setScreen("briefing");
      return;
    }
    creditStudent(fuel);
    setSoloTitle((t) => t);
    setScreen("debrief");
    void wakeLock.current?.release();
  }

  function pauseArcade() {
    setPaused(true);
  }

  const destination = SKILL_BY_ID[(session?.focusSkillId ?? student.lastFocusSkillId ?? "NUM-AS") as SkillId].theme
    .split(":")[0]!
    .trim()
    .toLowerCase();
  const launchDest = student.lastPracticeDate ? destination : "the cargo depot";
  const arcadeRounds = campaign ? 4 : 8;

  return (
    <Stage font={student.settings.font} textScale={student.settings.textScale}>
      {screen === "launch" && (
        <LaunchScreen
          student={student}
          destination={launchDest}
          onStart={() => startMission()}
          onSpot={startSpot}
          onHangar={() => setScreen("modes")}
          onChoose={() => setScreen("skills")}
          onToggleSound={() => {
            const next = {
              ...student,
              settings: { ...student.settings, sound: !student.settings.sound },
            };
            setStudent(next);
            saveStudent(next);
          }}
          onCycleFont={() => {
            const font = student.settings.font === "fredoka" ? "lexend" : "fredoka";
            const next: Student = {
              ...student,
              settings: { ...student.settings, font },
            };
            setStudent(next);
            saveStudent(next);
          }}
          onReset={resetAll}
        />
      )}

      {screen === "modes" && <ModeSelect onPick={startSolo} onBack={() => setScreen("launch")} />}

      {screen === "skills" && (
        <SkillSelect
          onPick={(skill) => startMission(skill === "mix" ? undefined : skill)}
          onBack={() => setScreen("launch")}
        />
      )}

      {screen === "briefing" && (
        <BriefingScreen text={briefingCopy || (session ? briefingText(session) : SPOT_BRIEFING)} onSkip={() => setScreen(briefingNext)} />
      )}

      {screen === "problem" && session && current && (
        <>
          {skyPlanet !== null && !showArrival && (
            <div className="sky-planet" aria-hidden>
              <PlanetGlobe planet={planetAt(skyPlanet)} size={140} />
            </div>
          )}
          {current.skippable && (
            <button
              type="button"
              onClick={() => finish(session)}
              className="absolute left-1/2 top-20 z-10 h-16 -translate-x-1/2 rounded-2xl bg-white/10 px-6 text-xl"
            >
              Skip bonus
            </button>
          )}
          <ProblemScreen
            item={current.item}
            index={session.index}
            total={session.items.length}
            fuel={session.fuelEarned}
            draft={session.draft}
            clockDraft={session.clockDraft}
            hintVisible={session.hintUsed}
            nudge={nudge}
            disabled={showArrival}
            onDraft={(draft) => persistSession({ ...session, draft })}
            onClock={(clockDraft) => persistSession({ ...session, clockDraft })}
            onSubmit={submit}
            onHint={() => persistSession({ ...session, hintUsed: true })}
            onPause={() => setPaused(true)}
          />
          {showArrival && skyPlanet !== null && (
            <PlanetArrival planet={planetAt(skyPlanet)} stopIndex={skyPlanet} onDone={closeArrival} />
          )}
        </>
      )}

      {screen === "worked" && current && session && (
        <WorkedExample item={current.item} onDone={() => gotoNext(session)} />
      )}

      {screen === "zapper" && (
        <TrashZapper level={arcadeLevel} rounds={arcadeRounds} onComplete={onArcadeComplete} onPause={pauseArcade} />
      )}
      {screen === "recycler" && (
        <FuelRecycler level={arcadeLevel} rounds={arcadeRounds} onComplete={onArcadeComplete} onPause={pauseArcade} />
      )}
      {screen === "caves" && (
        <CaveGates level={arcadeLevel} rounds={arcadeRounds} onComplete={onArcadeComplete} onPause={pauseArcade} />
      )}
      {screen === "hatches" && (
        <HatchHunt level={arcadeLevel} rounds={arcadeRounds} onComplete={onArcadeComplete} onPause={pauseArcade} />
      )}

      {screen === "spot-found" && (
        <SpotFound
          fuel={arcadeBank.fuel}
          onDone={() => {
            persistSession(null);
            setScreen("launch");
          }}
        />
      )}

      {screen === "debrief" && (
        <DebriefScreen
          fuel={session?.fuelEarned ?? arcadeBank.fuel}
          praise={
            session?.praise ??
            `${STUDENT_NAME} finished ${soloTitle}. Spot would be proud.`
          }
          destination={session ? destination : soloTitle}
          onDone={() => {
            persistSession(null);
            setScreen("launch");
          }}
        />
      )}

      {paused && (
        <PauseSheet
          onResume={() => setPaused(false)}
          onEnd={() => {
            setPaused(false);
            if (session && screen === "problem") finish(session);
            else {
              persistSession(null);
              setScreen("launch");
            }
          }}
          onReset={resetAll}
        />
      )}
    </Stage>
  );
}
