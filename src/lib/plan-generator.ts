import { prisma } from "@/lib/prisma";
import type { Equipment, Goal, ExerciseType } from "@/generated/prisma/enums";

/**
 * Deterministic weekly-plan generator (no AI yet — see issue #1 scope).
 * Builds a WorkoutPlan -> WorkoutDay -> WorkoutDayExercise -> ExerciseSet tree
 * from the seeded exercise catalog, honouring equipment access and injury
 * exclusions.
 */

// Which catalog equipment tiers are usable given the user's access.
function allowedEquipment(equipment: Equipment): Equipment[] {
  if (equipment === "FULL_GYM") return ["FULL_GYM", "HOME_GYM", "NONE"];
  if (equipment === "HOME_GYM") return ["HOME_GYM", "NONE"];
  return ["NONE"];
}

// Sets/reps prescription driven by goal.
function prescription(goal: Goal): { sets: number; reps: number } {
  switch (goal) {
    case "BUILD_MUSCLE":
      return { sets: 3, reps: 8 };
    case "LOSE_WEIGHT":
    case "ENDURANCE":
      return { sets: 3, reps: 15 };
    default:
      return { sets: 3, reps: 12 };
  }
}

const WORKOUT_NAMES = [
  "Full Body A",
  "Full Body B",
  "Upper Body",
  "Lower Body",
  "Conditioning",
];

// Spread N training days across a 7-day week (1 = Mon … 7 = Sun).
function trainingDays(count: number): number[] {
  const schedules: Record<number, number[]> = {
    2: [1, 4],
    3: [1, 3, 5],
    4: [1, 2, 4, 5],
    5: [1, 2, 3, 4, 5],
  };
  return schedules[count] ?? [1, 3, 5];
}

export async function generatePlanForProfile(profileId: string): Promise<string> {
  const profile = await prisma.onboardingProfile.findUniqueOrThrow({
    where: { id: profileId },
    include: { injuries: true, user: true },
  });

  const injuredMuscleGroupIds = new Set(
    profile.injuries
      .filter((i) => i.active && i.muscleGroupId)
      .map((i) => i.muscleGroupId as string),
  );

  // Candidate exercises: usable equipment, not targeting an injured muscle group.
  const candidates = await prisma.exercise.findMany({
    where: { equipment: { in: allowedEquipment(profile.equipment) } },
    include: { muscleGroups: true },
  });
  const usable = candidates.filter(
    (ex) =>
      !ex.muscleGroups.some(
        (mg) => mg.role === "PRIMARY" && injuredMuscleGroupIds.has(mg.muscleGroupId),
      ),
  );

  const days = trainingDays(profile.daysPerWeek);
  const rx = prescription(profile.primaryGoal);

  // Archive any previous active plan, then work out the next week number.
  await prisma.workoutPlan.updateMany({
    where: { userId: profile.userId, status: "ACTIVE" },
    data: { status: "ARCHIVED" },
  });
  const priorCount = await prisma.workoutPlan.count({
    where: { userId: profile.userId },
  });

  const goalLabel = profile.primaryGoal
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const plan = await prisma.workoutPlan.create({
    data: {
      userId: profile.userId,
      weekNumber: priorCount + 1,
      weekStartDate: new Date(),
      status: "ACTIVE",
      focusSummary: `${days.length}-day ${goalLabel} week`,
    },
  });

  // Build all 7 calendar days.
  for (let dow = 1; dow <= 7; dow++) {
    const trainingIndex = days.indexOf(dow);
    const isRestDay = trainingIndex === -1;

    if (isRestDay) {
      await prisma.workoutDay.create({
        data: {
          planId: plan.id,
          dayOfWeek: dow,
          isRestDay: true,
          workoutName: "Rest day",
        },
      });
      continue;
    }

    // Rotate exercises so different training days differ.
    const pick = 4;
    const chosen = Array.from({ length: Math.min(pick, usable.length) }, (_, i) => {
      const idx = (trainingIndex * pick + i) % usable.length;
      return usable[idx];
    });
    const primaryType: ExerciseType =
      chosen[0]?.exerciseType ?? "STRENGTH";

    const day = await prisma.workoutDay.create({
      data: {
        planId: plan.id,
        dayOfWeek: dow,
        isRestDay: false,
        workoutName: WORKOUT_NAMES[trainingIndex % WORKOUT_NAMES.length],
        workoutType: primaryType,
        estimatedDurationMin: 30 + chosen.length * 8,
      },
    });

    for (let i = 0; i < chosen.length; i++) {
      const wde = await prisma.workoutDayExercise.create({
        data: {
          workoutDayId: day.id,
          exerciseId: chosen[i].id,
          orderIndex: i,
        },
      });
      await prisma.exerciseSet.createMany({
        data: Array.from({ length: rx.sets }, (_, s) => ({
          workoutDayExerciseId: wde.id,
          setNumber: s + 1,
          targetReps: rx.reps,
        })),
      });
    }
  }

  return plan.id;
}
