import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/AppShell";
import { Card, LinkButton } from "@/components/ui";

export default async function WorkoutDayPage({
  params,
}: {
  params: Promise<{ dayId: string }>;
}) {
  const { dayId } = await params;
  const day = await prisma.workoutDay.findUnique({
    where: { id: dayId },
    include: {
      playlist: true,
      exercises: {
        orderBy: { orderIndex: "asc" },
        include: {
          exercise: { include: { muscleGroups: { include: { muscleGroup: true } } } },
          sets: { orderBy: { setNumber: "asc" } },
        },
      },
    },
  });

  if (!day) notFound();

  return (
    <AppShell
      title={day.workoutName ?? "Workout"}
      subtitle={`~${day.estimatedDurationMin ?? 45} min · ${day.exercises.length} exercises`}
      back={{ href: "/plan", label: "Week" }}
    >
      <div className="flex flex-col gap-2.5">
        {day.exercises.map((wde) => {
          const primary = wde.exercise.muscleGroups.find(
            (m) => m.role === "PRIMARY",
          )?.muscleGroup.name;
          return (
            <Card key={wde.id}>
              <div className="flex items-center justify-between">
                <b className="text-[13px]">{wde.exercise.name}</b>
                <span className="text-[10.5px] text-dim">{primary}</span>
              </div>
              <div className="mt-2 flex gap-1.5">
                {wde.sets.map((s) => (
                  <div
                    key={s.id}
                    className="flex-1 rounded-lg border border-line bg-[#0f1622] py-1.5 text-center"
                  >
                    <div className="text-[9px] font-extrabold text-dim">
                      SET {s.setNumber}
                    </div>
                    <div className="mt-0.5 text-xs font-extrabold">
                      {s.targetReps} reps
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {day.playlist && (
        <Card className="mt-3 flex items-center gap-2.5">
          <span className="text-xl">🎧</span>
          <div>
            <b className="text-xs">{day.playlist.title}</b>
            <div className="text-[10.5px] text-muted">
              YouTube · {day.playlist.genre}
            </div>
          </div>
        </Card>
      )}

      <div className="mt-5">
        <LinkButton href="/session/demo" variant="hot">
          Start workout
        </LinkButton>
      </div>
    </AppShell>
  );
}
