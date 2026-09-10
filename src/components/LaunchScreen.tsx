import { useState } from "react";
import { STUDENT_NAME } from "../curriculum";
import type { Student } from "../types";
import { PlanetField } from "./PlanetField";
import { RestartConfirm } from "./RestartConfirm";

export function LaunchScreen({
  student,
  destination,
  onStart,
  onSpot,
  onHangar,
  onChoose,
  onToggleSound,
  onCycleFont,
  onReset,
}: {
  student: Student;
  destination: string;
  onStart: () => void;
  onSpot: () => void;
  onHangar: () => void;
  onChoose: () => void;
  onToggleSound: () => void;
  onCycleFont: () => void;
  onReset: () => void;
}) {
  const streak = student.streakDays;
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <div className="relative flex h-full flex-col">
      <PlanetField />

      <div className="relative z-10 flex items-start justify-between px-[72px] pt-8">
        <p className="text-2xl text-yellow-100/80">Cadet {STUDENT_NAME}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onToggleSound}
            className="h-16 min-w-16 rounded-2xl bg-black/25 px-4 text-xl"
          >
            {student.settings.sound ? "Sound on" : "Sound off"}
          </button>
          <button
            type="button"
            onClick={onCycleFont}
            className="h-16 min-w-16 rounded-2xl bg-black/25 px-4 text-xl"
          >
            {student.settings.font === "lexend" ? "Easy-read font" : "Chunky font"}
          </button>
        </div>
      </div>

      <div className="relative z-10 ml-auto flex flex-1 flex-col justify-center pr-[72px] pl-8">
        <div className="max-w-[430px] self-end">
          <p className="text-5xl font-semibold leading-tight text-yellow-50">Mission: Math</p>
          <p className="mt-4 text-2xl text-yellow-100/90">Jupiter is on the bow, Cadet {STUDENT_NAME}.</p>
          <p className="mt-3 text-xl text-orange-200">Today we fly to {destination}.</p>
          <p className="mt-3 text-xl text-yellow-100/80">
            {streak > 0
              ? `Mission streak: ${streak} day${streak === 1 ? "" : "s"} — on standby if you miss one.`
              : "First launch. Easy start."}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 pb-6">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onStart}
            className="h-[88px] min-w-[280px] rounded-full bg-orange-400 px-8 text-3xl font-semibold text-[#1a1030] active:scale-95"
          >
            Daily flight
          </button>
          <button
            type="button"
            onClick={onSpot}
            className="h-[88px] min-w-[280px] rounded-full bg-cyan-200 px-8 text-3xl font-semibold text-[#1a1030] active:scale-95"
          >
            Search for Spot
          </button>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            data-testid="choose-questions"
            onClick={onChoose}
            className="h-[72px] min-w-[240px] rounded-full bg-yellow-200 px-8 text-2xl font-semibold text-[#1a1030] active:scale-95"
          >
            Choose questions
          </button>
          <button
            type="button"
            onClick={onHangar}
            className="h-[72px] min-w-[200px] rounded-full bg-black/30 px-8 text-2xl"
          >
            Hangar games
          </button>
        </div>
        <button
          type="button"
          data-testid="restart"
          onClick={() => setConfirmReset(true)}
          className="h-14 min-w-[160px] rounded-2xl bg-black/20 px-5 text-lg text-yellow-100/70"
        >
          Start over
        </button>
      </div>
      {confirmReset && (
        <RestartConfirm onCancel={() => setConfirmReset(false)} onConfirm={onReset} />
      )}
    </div>
  );
}
