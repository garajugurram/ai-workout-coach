"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generatePlanForProfile } from "@/lib/plan-generator";
import type {
  Goal,
  Equipment,
  ExperienceLevel,
} from "@/generated/prisma/enums";

const GOALS: Goal[] = ["BUILD_MUSCLE", "LOSE_WEIGHT", "ENDURANCE", "GENERAL"];
const EQUIPMENT: Equipment[] = ["FULL_GYM", "HOME_GYM", "NONE"];
const LEVELS: ExperienceLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

function pick<T extends string>(value: FormDataEntryValue | null, allowed: T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export async function completeOnboarding(formData: FormData) {
  const primaryGoal = pick(formData.get("goal"), GOALS, "GENERAL");
  const equipment = pick(formData.get("equipment"), EQUIPMENT, "NONE");
  const experienceLevel = pick(formData.get("experience"), LEVELS, "BEGINNER");
  const daysPerWeek = Number(formData.get("days") ?? 3) || 3;
  const injuryMuscleIds = formData.getAll("injuries").map(String).filter(Boolean);

  // Stub user (auth deferred — issue #1 scope). One demo user, upserted.
  const user = await prisma.user.upsert({
    where: { email: "demo@aiworkoutcoach.app" },
    create: { email: "demo@aiworkoutcoach.app", displayName: "Demo Athlete" },
    update: {},
  });

  // Replace any existing profile for the demo user.
  await prisma.onboardingProfile.deleteMany({ where: { userId: user.id } });
  const profile = await prisma.onboardingProfile.create({
    data: {
      userId: user.id,
      primaryGoal,
      equipment,
      daysPerWeek,
      experienceLevel,
      injuries: {
        create: injuryMuscleIds.map((muscleGroupId) => ({ muscleGroupId })),
      },
    },
  });

  await generatePlanForProfile(profile.id);
  redirect("/plan");
}
