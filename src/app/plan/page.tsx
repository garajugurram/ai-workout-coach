import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/AppShell";
import { LinkButton, Pill } from "@/components/ui";

export const dynamic = "force-dynamic";

const DOW = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function typeTone(type: string | null) {
  if (type === "STRENGTH") return "hot" as const;
  if (type === "CARDIO") return "accent-2" as const;
  return "accent" as const;
}

export default async function PlanPage() {
  const plan = await prisma.workoutPlan.findFirst({
    where: {
      status: "ACTIVE",
      user: { email: "demo@aiworkoutcoach.app" },
    },
    orderBy: { generatedAt: "desc" },
    include: {
      days: {
        orderBy: { dayOfWeek: "asc" },
        include: {
          exercises: { include: { exercise: true } },
        },
      },
    },
  });

  if (!plan) {
    return (
      <AppShell title="No plan yet" subtitle="Complete onboarding to generate your first week.">
        <LinkButton href="/onboarding">Start onboarding →</LinkButton>
      </AppShell>
    );
  }

  const trainingCount = plan.days.filter((d) => !d.isRestDay).length;

  return (
    <AppShell
      title={`Week ${plan.weekNumber}`}
      subtitle={plan.focusSummary ?? `${trainingCount} sessions`}
    >
      <div className="flex flex-col gap-2">
        {plan.days.map((day) => {
          const muscles = [
            ...new Set(day.exercises.map((e) => e.exercise.name)),
          ]
            .slice(0, 3)
            .join(" · ");

          const inner = (
            <div
              className={`flex items-center gap-3 rounded-xl border border-line bg-panel-2 px-3 py-2.5 ${
                day.isRestDay ? "opacity-55" : "hover:border-accent"
              }`}
            >
              <span className="w-9 text-[11px] font-extrabold uppercase text-dim">
                {DOW[day.dayOfWeek]}
              </span>
              <div className="flex-1">
                <b className="flex items-center gap-2 text-[13px]">
                  {day.workoutName}
                  {!day.isRestDay && day.workoutType && (
                    <Pill tone={typeTone(day.workoutType)}>{day.workoutType}</Pill>
                  )}
                </b>
                <span className="block text-[11px] text-muted">
                  {day.isRestDay ? "Recovery" : muscles || "Training"}
                </span>
              </div>
              {!day.isRestDay && day.estimatedDurationMin && (
                <span className="text-[11px] font-bold text-accent-2">
                  {day.estimatedDurationMin}m
                </span>
              )}
            </div>
          );

          return day.isRestDay ? (
            <div key={day.id}>{inner}</div>
          ) : (
            <Link key={day.id} href={`/workout/${day.id}`}>
              {inner}
            </Link>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <LinkButton href="/briefing" variant="ghost">
          ▶ Monday briefing
        </LinkButton>
      </div>
    </AppShell>
  );
}
