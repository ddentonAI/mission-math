import { SKILL_CHOICES } from "../curriculum";
import type { SkillId } from "../types";

export function SkillSelect({
  onPick,
  onBack,
}: {
  onPick: (skill: SkillId | "mix") => void;
  onBack: () => void;
}) {
  return (
    <div className="flex h-full flex-col px-[72px] py-8">
      <div className="flex items-center justify-between">
        <p className="text-4xl font-semibold">Choose questions</p>
        <button type="button" onClick={onBack} className="h-16 rounded-2xl bg-white/10 px-6 text-xl">
          Back
        </button>
      </div>
      <p className="mt-3 text-2xl text-yellow-100/80">Tap the kind of math for this flight.</p>

      <button
        type="button"
        data-testid="skill-mix"
        onClick={() => onPick("mix")}
        className="mt-6 flex h-[88px] flex-col justify-center rounded-[28px] bg-orange-400 px-6 text-left text-[#1a1030] active:scale-95"
      >
        <span className="text-3xl font-semibold">Mix it up</span>
        <span className="text-xl">The ship picks.</span>
      </button>

      <div className="mt-5 grid grid-cols-2 gap-5">
        {SKILL_CHOICES.map((skill) => (
          <button
            key={skill.id}
            type="button"
            data-testid={`skill-${skill.id}`}
            onClick={() => onPick(skill.id)}
            className="rounded-[28px] bg-white/10 px-6 py-6 text-left active:scale-95"
            style={{ minHeight: 132 }}
          >
            <p className="text-3xl font-semibold text-yellow-50">{skill.label}</p>
            <p className="mt-2 text-xl text-yellow-100/80">{skill.blurb}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
