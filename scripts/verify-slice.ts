import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { generatePlanForProfile } from "@/lib/plan-generator";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "smoke@aiworkoutcoach.app" },
    create: { email: "smoke@aiworkoutcoach.app", displayName: "Smoke Test" },
    update: {},
  });

  // Exclude an injured muscle group (Calves) to exercise the exclusion path.
  const calves = await prisma.muscleGroup.findUniqueOrThrow({
    where: { name: "Calves" },
  });

  await prisma.onboardingProfile.deleteMany({ where: { userId: user.id } });
  const profile = await prisma.onboardingProfile.create({
    data: {
      userId: user.id,
      primaryGoal: "BUILD_MUSCLE",
      equipment: "HOME_GYM",
      daysPerWeek: 3,
      experienceLevel: "BEGINNER",
      injuries: { create: [{ muscleGroupId: calves.id, bodyPart: "Left calf" }] },
    },
  });

  const planId = await generatePlanForProfile(profile.id);

  const plan = await prisma.workoutPlan.findUniqueOrThrow({
    where: { id: planId },
    include: {
      days: {
        include: { exercises: { include: { exercise: true, sets: true } } },
      },
    },
  });

  const trainingDays = plan.days.filter((d) => !d.isRestDay);
  const restDays = plan.days.filter((d) => d.isRestDay);
  const totalExercises = trainingDays.reduce((n, d) => n + d.exercises.length, 0);
  const totalSets = trainingDays.reduce(
    (n, d) => n + d.exercises.reduce((m, e) => m + e.sets.length, 0),
    0,
  );
  const usesCalves = trainingDays.some((d) =>
    d.exercises.some((e) => e.exercise.name === "Standing Calf Raise"),
  );

  console.log("Plan:", plan.focusSummary, `(week ${plan.weekNumber})`);
  console.log("  calendar days:", plan.days.length, "(expect 7)");
  console.log("  training days:", trainingDays.length, "(expect 3)");
  console.log("  rest days:", restDays.length, "(expect 4)");
  console.log("  total exercises:", totalExercises);
  console.log("  total sets:", totalSets);
  console.log("  includes injured Calf Raise:", usesCalves, "(expect false)");

  const ok =
    plan.days.length === 7 &&
    trainingDays.length === 3 &&
    restDays.length === 4 &&
    totalExercises > 0 &&
    totalSets > 0 &&
    usesCalves === false;

  console.log(ok ? "\n✅ vertical slice OK" : "\n❌ vertical slice FAILED");
  process.exit(ok ? 0 : 1);
}

main().finally(async () => {
  await prisma.$disconnect();
});
