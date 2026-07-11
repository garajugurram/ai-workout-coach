import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Muscle groups (catalog) — keyed by name for idempotent upserts.
const MUSCLE_GROUPS = [
  { name: "Chest", region: "upper" },
  { name: "Back", region: "upper" },
  { name: "Shoulders", region: "upper" },
  { name: "Biceps", region: "upper" },
  { name: "Triceps", region: "upper" },
  { name: "Quads", region: "lower" },
  { name: "Hamstrings", region: "lower" },
  { name: "Glutes", region: "lower" },
  { name: "Calves", region: "lower" },
  { name: "Core", region: "core" },
  { name: "Full Body", region: "full" },
];

// Exercises with their primary/secondary muscle groups.
const EXERCISES: {
  name: string;
  description: string;
  equipment: "FULL_GYM" | "HOME_GYM" | "NONE";
  exerciseType: "STRENGTH" | "HYPERTROPHY" | "CARDIO" | "MOBILITY";
  isFormCheckSupported?: boolean;
  primary: string[];
  secondary?: string[];
}[] = [
  {
    name: "Barbell Bench Press",
    description: "Flat barbell press for chest strength.",
    equipment: "FULL_GYM",
    exerciseType: "STRENGTH",
    primary: ["Chest"],
    secondary: ["Shoulders", "Triceps"],
  },
  {
    name: "Overhead Press",
    description: "Standing barbell shoulder press.",
    equipment: "FULL_GYM",
    exerciseType: "STRENGTH",
    primary: ["Shoulders"],
    secondary: ["Triceps"],
  },
  {
    name: "Barbell Squat",
    description: "Back squat for lower-body strength.",
    equipment: "FULL_GYM",
    exerciseType: "STRENGTH",
    isFormCheckSupported: true,
    primary: ["Quads", "Glutes"],
    secondary: ["Hamstrings", "Core"],
  },
  {
    name: "Romanian Deadlift",
    description: "Hip-hinge for posterior chain.",
    equipment: "FULL_GYM",
    exerciseType: "HYPERTROPHY",
    primary: ["Hamstrings", "Glutes"],
    secondary: ["Back"],
  },
  {
    name: "Standing Calf Raise",
    description: "Loaded calf raise for lower legs.",
    equipment: "FULL_GYM",
    exerciseType: "HYPERTROPHY",
    isFormCheckSupported: true,
    primary: ["Calves"],
  },
  {
    name: "Push-up",
    description: "Bodyweight horizontal press.",
    equipment: "NONE",
    exerciseType: "HYPERTROPHY",
    primary: ["Chest"],
    secondary: ["Triceps", "Core"],
  },
  {
    name: "Bodyweight Squat",
    description: "Equipment-free squat pattern.",
    equipment: "NONE",
    exerciseType: "HYPERTROPHY",
    isFormCheckSupported: true,
    primary: ["Quads", "Glutes"],
  },
  {
    name: "Dumbbell Row",
    description: "Single-arm row for the back.",
    equipment: "HOME_GYM",
    exerciseType: "HYPERTROPHY",
    primary: ["Back"],
    secondary: ["Biceps"],
  },
  {
    name: "Plank",
    description: "Isometric core hold.",
    equipment: "NONE",
    exerciseType: "MOBILITY",
    primary: ["Core"],
  },
  {
    name: "Jumping Jacks",
    description: "Full-body cardio conditioning.",
    equipment: "NONE",
    exerciseType: "CARDIO",
    primary: ["Full Body"],
  },
];

// Recovery cards (curated library) keyed by stretch name + muscle group.
const RECOVERY_CARDS: {
  stretchName: string;
  muscleGroup: string;
  durationSeconds: number;
  instruction: string;
}[] = [
  {
    stretchName: "Doorway Chest Stretch",
    muscleGroup: "Chest",
    durationSeconds: 30,
    instruction: "Place forearms on a doorframe and lean through gently.",
  },
  {
    stretchName: "Cross-Body Shoulder Stretch",
    muscleGroup: "Shoulders",
    durationSeconds: 30,
    instruction: "Pull one arm across your chest with the opposite hand.",
  },
  {
    stretchName: "Standing Quad Stretch",
    muscleGroup: "Quads",
    durationSeconds: 30,
    instruction: "Hold one ankle behind you, keeping knees together.",
  },
  {
    stretchName: "Seated Hamstring Stretch",
    muscleGroup: "Hamstrings",
    durationSeconds: 30,
    instruction: "Reach toward your toes with a long spine.",
  },
  {
    stretchName: "Downward Calf Stretch",
    muscleGroup: "Calves",
    durationSeconds: 30,
    instruction: "Press one heel into the floor with the leg straight.",
  },
  {
    stretchName: "Cat-Cow",
    muscleGroup: "Core",
    durationSeconds: 45,
    instruction: "Alternate arching and rounding your spine on all fours.",
  },
  {
    stretchName: "Child's Pose",
    muscleGroup: "Full Body",
    durationSeconds: 45,
    instruction: "Sit hips back to heels and reach arms forward.",
  },
];

async function main() {
  console.log("Seeding muscle groups…");
  const muscleByName = new Map<string, string>();
  for (const mg of MUSCLE_GROUPS) {
    const row = await prisma.muscleGroup.upsert({
      where: { name: mg.name },
      create: mg,
      update: { region: mg.region },
    });
    muscleByName.set(mg.name, row.id);
  }

  console.log("Seeding exercises…");
  for (const ex of EXERCISES) {
    const exercise = await prisma.exercise.upsert({
      where: { name: ex.name },
      create: {
        name: ex.name,
        description: ex.description,
        equipment: ex.equipment,
        exerciseType: ex.exerciseType,
        isFormCheckSupported: ex.isFormCheckSupported ?? false,
      },
      update: {
        description: ex.description,
        equipment: ex.equipment,
        exerciseType: ex.exerciseType,
        isFormCheckSupported: ex.isFormCheckSupported ?? false,
      },
    });

    const links = [
      ...ex.primary.map((m) => ({ muscle: m, role: "PRIMARY" as const })),
      ...(ex.secondary ?? []).map((m) => ({ muscle: m, role: "SECONDARY" as const })),
    ];
    for (const link of links) {
      const muscleGroupId = muscleByName.get(link.muscle);
      if (!muscleGroupId) continue;
      await prisma.exerciseMuscleGroup.upsert({
        where: {
          exerciseId_muscleGroupId: { exerciseId: exercise.id, muscleGroupId },
        },
        create: { exerciseId: exercise.id, muscleGroupId, role: link.role },
        update: { role: link.role },
      });
    }
  }

  console.log("Seeding recovery cards…");
  for (const rc of RECOVERY_CARDS) {
    const muscleGroupId = muscleByName.get(rc.muscleGroup);
    if (!muscleGroupId) continue;
    const existing = await prisma.recoveryCard.findFirst({
      where: { stretchName: rc.stretchName, muscleGroupId },
    });
    if (existing) {
      await prisma.recoveryCard.update({
        where: { id: existing.id },
        data: { durationSeconds: rc.durationSeconds, instruction: rc.instruction },
      });
    } else {
      await prisma.recoveryCard.create({
        data: {
          stretchName: rc.stretchName,
          muscleGroupId,
          durationSeconds: rc.durationSeconds,
          instruction: rc.instruction,
        },
      });
    }
  }

  const counts = {
    muscleGroups: await prisma.muscleGroup.count(),
    exercises: await prisma.exercise.count(),
    recoveryCards: await prisma.recoveryCard.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
