-- CreateEnum
CREATE TYPE "AuthProviderType" AS ENUM ('EMAIL', 'GOOGLE', 'APPLE');

-- CreateEnum
CREATE TYPE "Goal" AS ENUM ('BUILD_MUSCLE', 'LOSE_WEIGHT', 'ENDURANCE', 'GENERAL');

-- CreateEnum
CREATE TYPE "Equipment" AS ENUM ('FULL_GYM', 'HOME_GYM', 'NONE');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "MuscleRole" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('STRENGTH', 'HYPERTROPHY', 'CARDIO', 'MOBILITY');

-- CreateEnum
CREATE TYPE "PlaylistEnergy" AS ENUM ('HIGH', 'MEDIUM', 'HIGH_TEMPO', 'LOW');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "PerceivedEffort" AS ENUM ('EASY', 'MODERATE', 'HARD');

-- CreateEnum
CREATE TYPE "FatigueLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH');

-- CreateEnum
CREATE TYPE "VoiceNoteStatus" AS ENUM ('PENDING', 'PROCESSED', 'DISCARDED');

-- CreateEnum
CREATE TYPE "SignalType" AS ENUM ('EFFORT', 'FATIGUE', 'EXERCISE_DIFFICULTY');

-- CreateEnum
CREATE TYPE "AdaptationType" AS ENUM ('INCREASE_LOAD', 'DECREASE_VOLUME', 'REDUCE_EXERCISE_LOAD', 'ADD_REST_DAY', 'NONE');

-- CreateEnum
CREATE TYPE "BriefingStatus" AS ENUM ('PENDING', 'AVAILABLE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FormCheckStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED', 'LOW_CONFIDENCE');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'TRIALING', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BillingProvider" AS ENUM ('STRIPE', 'APP_STORE', 'PLAY_STORE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CHARGE', 'REFUND');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "displayName" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_providers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "AuthProviderType" NOT NULL,
    "providerUid" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "primaryGoal" "Goal" NOT NULL,
    "equipment" "Equipment" NOT NULL,
    "daysPerWeek" INTEGER NOT NULL,
    "experienceLevel" "ExperienceLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "injury_limitations" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "muscleGroupId" TEXT,
    "bodyPart" TEXT,
    "note" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "injury_limitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muscle_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT,

    CONSTRAINT "muscle_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "equipment" "Equipment" NOT NULL,
    "exerciseType" "ExerciseType" NOT NULL,
    "isFormCheckSupported" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_muscle_groups" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "muscleGroupId" TEXT NOT NULL,
    "role" "MuscleRole" NOT NULL DEFAULT 'PRIMARY',

    CONSTRAINT "exercise_muscle_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recovery_cards" (
    "id" TEXT NOT NULL,
    "muscleGroupId" TEXT NOT NULL,
    "stretchName" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recovery_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlists" (
    "id" TEXT NOT NULL,
    "youtubePlaylistId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "energyLevel" "PlaylistEnergy" NOT NULL,
    "genre" TEXT,
    "url" TEXT NOT NULL,
    "cachedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adaptedFromPlanId" TEXT,
    "weekNumber" INTEGER NOT NULL,
    "weekStartDate" DATE NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "focusSummary" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_days" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "playlistId" TEXT,
    "dayOfWeek" INTEGER NOT NULL,
    "isRestDay" BOOLEAN NOT NULL DEFAULT false,
    "workoutName" TEXT,
    "workoutType" "ExerciseType",
    "estimatedDurationMin" INTEGER,

    CONSTRAINT "workout_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_day_exercises" (
    "id" TEXT NOT NULL,
    "workoutDayId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "workout_day_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_sets" (
    "id" TEXT NOT NULL,
    "workoutDayExerciseId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "targetReps" INTEGER,
    "targetWeight" DECIMAL(6,2),
    "targetRpe" INTEGER,

    CONSTRAINT "exercise_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audio_briefings" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "audioUrl" TEXT,
    "durationSeconds" INTEGER,
    "scriptText" TEXT,
    "sessionCount" INTEGER,
    "focusAreas" TEXT,
    "intensityChangeNote" TEXT,
    "status" "BriefingStatus" NOT NULL DEFAULT 'PENDING',
    "availableFrom" TIMESTAMP(3),
    "playedAt" TIMESTAMP(3),

    CONSTRAINT "audio_briefings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_sessions" (
    "id" TEXT NOT NULL,
    "workoutDayId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL,
    "durationActualMin" INTEGER,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_recovery_cards" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "recoveryCardId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,

    CONSTRAINT "session_recovery_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_notes" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "audioUrl" TEXT,
    "transcript" TEXT,
    "perceivedEffort" "PerceivedEffort",
    "fatigueLevel" "FatigueLevel",
    "status" "VoiceNoteStatus" NOT NULL DEFAULT 'PENDING',
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "voice_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_note_signals" (
    "id" TEXT NOT NULL,
    "voiceNoteId" TEXT NOT NULL,
    "exerciseId" TEXT,
    "signalType" "SignalType" NOT NULL,
    "value" TEXT,
    "confidence" DECIMAL(4,3),

    CONSTRAINT "voice_note_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adaptations" (
    "id" TEXT NOT NULL,
    "sourceVoiceNoteId" TEXT,
    "sourceSessionId" TEXT NOT NULL,
    "targetPlanId" TEXT NOT NULL,
    "targetWorkoutDayId" TEXT,
    "targetExerciseId" TEXT,
    "adaptationType" "AdaptationType" NOT NULL,
    "changeDescription" TEXT,
    "appliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adaptations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_checks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "sessionId" TEXT,
    "videoUrl" TEXT,
    "score" INTEGER,
    "confidence" DECIMAL(4,3),
    "status" "FormCheckStatus" NOT NULL DEFAULT 'PROCESSING',
    "errorReason" TEXT,
    "disclaimerAcknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_check_feedback_items" (
    "id" TEXT NOT NULL,
    "formCheckId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "feedbackText" TEXT NOT NULL,

    CONSTRAINT "form_check_feedback_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "provider" "BillingProvider",
    "providerSubscriptionRef" TEXT,
    "priceCents" INTEGER,
    "currency" CHAR(3),
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "canceledAt" TIMESTAMP(3),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "BillingProvider" NOT NULL,
    "providerTxnRef" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "auth_providers_userId_idx" ON "auth_providers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_providers_provider_providerUid_key" ON "auth_providers"("provider", "providerUid");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_profiles_userId_key" ON "onboarding_profiles"("userId");

-- CreateIndex
CREATE INDEX "injury_limitations_profileId_idx" ON "injury_limitations"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "muscle_groups_name_key" ON "muscle_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_name_key" ON "exercises"("name");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_muscle_groups_exerciseId_muscleGroupId_key" ON "exercise_muscle_groups"("exerciseId", "muscleGroupId");

-- CreateIndex
CREATE INDEX "recovery_cards_muscleGroupId_idx" ON "recovery_cards"("muscleGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "playlists_youtubePlaylistId_key" ON "playlists"("youtubePlaylistId");

-- CreateIndex
CREATE INDEX "workout_plans_userId_idx" ON "workout_plans"("userId");

-- CreateIndex
CREATE INDEX "workout_days_planId_idx" ON "workout_days"("planId");

-- CreateIndex
CREATE INDEX "workout_day_exercises_workoutDayId_idx" ON "workout_day_exercises"("workoutDayId");

-- CreateIndex
CREATE INDEX "exercise_sets_workoutDayExerciseId_idx" ON "exercise_sets"("workoutDayExerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "audio_briefings_planId_key" ON "audio_briefings"("planId");

-- CreateIndex
CREATE INDEX "workout_sessions_userId_idx" ON "workout_sessions"("userId");

-- CreateIndex
CREATE INDEX "workout_sessions_workoutDayId_idx" ON "workout_sessions"("workoutDayId");

-- CreateIndex
CREATE UNIQUE INDEX "session_recovery_cards_sessionId_recoveryCardId_key" ON "session_recovery_cards"("sessionId", "recoveryCardId");

-- CreateIndex
CREATE UNIQUE INDEX "voice_notes_sessionId_key" ON "voice_notes"("sessionId");

-- CreateIndex
CREATE INDEX "voice_note_signals_voiceNoteId_idx" ON "voice_note_signals"("voiceNoteId");

-- CreateIndex
CREATE INDEX "adaptations_targetPlanId_idx" ON "adaptations"("targetPlanId");

-- CreateIndex
CREATE INDEX "form_checks_userId_idx" ON "form_checks"("userId");

-- CreateIndex
CREATE INDEX "form_check_feedback_items_formCheckId_idx" ON "form_check_feedback_items"("formCheckId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "payment_transactions_subscriptionId_idx" ON "payment_transactions"("subscriptionId");

-- CreateIndex
CREATE INDEX "payment_transactions_userId_idx" ON "payment_transactions"("userId");

-- AddForeignKey
ALTER TABLE "auth_providers" ADD CONSTRAINT "auth_providers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_profiles" ADD CONSTRAINT "onboarding_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "injury_limitations" ADD CONSTRAINT "injury_limitations_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "onboarding_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "injury_limitations" ADD CONSTRAINT "injury_limitations_muscleGroupId_fkey" FOREIGN KEY ("muscleGroupId") REFERENCES "muscle_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_muscle_groups" ADD CONSTRAINT "exercise_muscle_groups_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_muscle_groups" ADD CONSTRAINT "exercise_muscle_groups_muscleGroupId_fkey" FOREIGN KEY ("muscleGroupId") REFERENCES "muscle_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recovery_cards" ADD CONSTRAINT "recovery_cards_muscleGroupId_fkey" FOREIGN KEY ("muscleGroupId") REFERENCES "muscle_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_plans" ADD CONSTRAINT "workout_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_plans" ADD CONSTRAINT "workout_plans_adaptedFromPlanId_fkey" FOREIGN KEY ("adaptedFromPlanId") REFERENCES "workout_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_days" ADD CONSTRAINT "workout_days_planId_fkey" FOREIGN KEY ("planId") REFERENCES "workout_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_days" ADD CONSTRAINT "workout_days_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_day_exercises" ADD CONSTRAINT "workout_day_exercises_workoutDayId_fkey" FOREIGN KEY ("workoutDayId") REFERENCES "workout_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_day_exercises" ADD CONSTRAINT "workout_day_exercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_sets" ADD CONSTRAINT "exercise_sets_workoutDayExerciseId_fkey" FOREIGN KEY ("workoutDayExerciseId") REFERENCES "workout_day_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audio_briefings" ADD CONSTRAINT "audio_briefings_planId_fkey" FOREIGN KEY ("planId") REFERENCES "workout_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_workoutDayId_fkey" FOREIGN KEY ("workoutDayId") REFERENCES "workout_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_recovery_cards" ADD CONSTRAINT "session_recovery_cards_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "workout_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_recovery_cards" ADD CONSTRAINT "session_recovery_cards_recoveryCardId_fkey" FOREIGN KEY ("recoveryCardId") REFERENCES "recovery_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_notes" ADD CONSTRAINT "voice_notes_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "workout_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_note_signals" ADD CONSTRAINT "voice_note_signals_voiceNoteId_fkey" FOREIGN KEY ("voiceNoteId") REFERENCES "voice_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_note_signals" ADD CONSTRAINT "voice_note_signals_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptations" ADD CONSTRAINT "adaptations_sourceVoiceNoteId_fkey" FOREIGN KEY ("sourceVoiceNoteId") REFERENCES "voice_notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptations" ADD CONSTRAINT "adaptations_sourceSessionId_fkey" FOREIGN KEY ("sourceSessionId") REFERENCES "workout_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptations" ADD CONSTRAINT "adaptations_targetPlanId_fkey" FOREIGN KEY ("targetPlanId") REFERENCES "workout_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptations" ADD CONSTRAINT "adaptations_targetWorkoutDayId_fkey" FOREIGN KEY ("targetWorkoutDayId") REFERENCES "workout_days"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptations" ADD CONSTRAINT "adaptations_targetExerciseId_fkey" FOREIGN KEY ("targetExerciseId") REFERENCES "exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_checks" ADD CONSTRAINT "form_checks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_checks" ADD CONSTRAINT "form_checks_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_check_feedback_items" ADD CONSTRAINT "form_check_feedback_items_formCheckId_fkey" FOREIGN KEY ("formCheckId") REFERENCES "form_checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
