import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/AppShell";
import { Field, Button } from "@/components/ui";
import { completeOnboarding } from "./actions";

export const dynamic = "force-dynamic";

const GOALS = [
  { value: "BUILD_MUSCLE", label: "Build muscle" },
  { value: "LOSE_WEIGHT", label: "Lose weight" },
  { value: "ENDURANCE", label: "Endurance" },
  { value: "GENERAL", label: "General fitness" },
];
const EQUIPMENT = [
  { value: "FULL_GYM", label: "Full gym" },
  { value: "HOME_GYM", label: "Home gym" },
  { value: "NONE", label: "No equipment" },
];
const DAYS = ["2", "3", "4", "5"];
const LEVELS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

const chip =
  "cursor-pointer rounded-lg border border-line bg-[#0f1622] px-3 py-2 text-xs text-muted transition peer-checked:border-accent peer-checked:bg-accent peer-checked:font-bold peer-checked:text-white";
const chipTeal =
  "cursor-pointer rounded-lg border border-line bg-[#0f1622] px-3 py-2 text-xs text-muted transition peer-checked:border-accent-2 peer-checked:bg-accent-2/15 peer-checked:font-bold peer-checked:text-accent-2";

function Radio({
  name,
  value,
  label,
  defaultChecked,
}: {
  name: string;
  value: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label>
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className={chip}>{label}</span>
    </label>
  );
}

export default async function OnboardingPage() {
  const muscleGroups = await prisma.muscleGroup.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <AppShell title="Let's build your plan" subtitle="5 questions · about 90 seconds">
      <form action={completeOnboarding} className="flex flex-col gap-3">
        <Field label="Primary goal">
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g, i) => (
              <Radio key={g.value} name="goal" value={g.value} label={g.label} defaultChecked={i === 0} />
            ))}
          </div>
        </Field>

        <Field label="Equipment">
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT.map((e, i) => (
              <Radio key={e.value} name="equipment" value={e.value} label={e.label} defaultChecked={i === 1} />
            ))}
          </div>
        </Field>

        <Field label="Days per week">
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d, i) => (
              <Radio key={d} name="days" value={d} label={d === "5" ? "5+" : d} defaultChecked={i === 1} />
            ))}
          </div>
        </Field>

        <Field label="Experience level">
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l, i) => (
              <Radio key={l.value} name="experience" value={l.value} label={l.label} defaultChecked={i === 0} />
            ))}
          </div>
        </Field>

        <Field label="Injuries / limitations (optional)">
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((mg) => (
              <label key={mg.id}>
                <input type="checkbox" name="injuries" value={mg.id} className="peer sr-only" />
                <span className={chipTeal}>{mg.name}</span>
              </label>
            ))}
          </div>
        </Field>

        <Button type="submit" className="mt-2">
          Generate my week →
        </Button>
      </form>
    </AppShell>
  );
}
