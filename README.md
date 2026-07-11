# AI Workout Coach

AI-powered workout coaching app that delivers adaptive weekly training plans, energy-matched playlists, AI form feedback, and audio briefings — for people who can't afford a personal trainer.

## What It Does

- **Adaptive Weekly Plan** — Generated from a 5-question onboarding. Rebuilds each week based on voice note feedback.
- **Audio Briefing** — 60-second Monday morning summary of the week ahead.
- **Energy-Matched Playlists** — YouTube playlists matched to workout type (strength, cardio, mobility).
- **Voice Note Adaptation** — Record how the session felt. AI adjusts next week's intensity automatically.
- **AI Form Check** — Upload a squat or calf raise video. Receive a score (1–10) + text feedback + safety disclaimer.
- **Recovery Cards** — Post-workout stretching tips after every session.

## Target User

Self-motivated fitness enthusiasts (21–60) who want coaching-level structure without paying $60–150/hour for a trainer.

## Build Phases

| Phase | Features | Timeline |
|---|---|---|
| Phase 1 — MVP | Onboarding, plan generation, voice note adaptation, audio briefing, recovery cards | Month 1–3 |
| Phase 2 | YouTube playlist integration | Month 4–5 |
| Phase 3 | AI form check (squat + calf raise) | Month 6–8 |
| Phase 4 | Subscription monetisation | Month 9+ |

## Tech Stack

- **Next.js 16** (App Router, TypeScript) — front-and-back
- **PostgreSQL** via **Prisma 7** (pg driver adapter)
- **Tailwind CSS v4** (design tokens in `src/app/globals.css`)
- **pnpm**

## Local Development

Prerequisites: Node 20+, pnpm, Docker.

```bash
pnpm install                 # install deps (runs prisma generate)
cp .env.example .env         # local database URL
pnpm db:up                   # start Postgres (docker compose)
pnpm db:migrate              # apply migrations
pnpm db:seed                 # seed muscle groups, exercises, recovery cards
pnpm dev                     # http://localhost:3000
```

Useful scripts: `pnpm db:studio` (Prisma Studio), `pnpm db:down` (stop Postgres),
`pnpm lint`, `pnpm build`.

### What works today

The onboarding → plan vertical slice is wired end-to-end against Postgres: the
onboarding form creates a user/profile/injuries and generates a persisted weekly
plan (equipment-filtered, injury-aware). Phase 3/4 screens (form check, premium)
are static UI. **Auth and all AI integrations are stubbed** — see issue #1.

## Project Structure

- `prisma/schema.prisma` — data model (mirrors [ER diagram](docs/er-diagram.md))
- `src/app/*` — routed screens (App Router)
- `src/components/*` — shared UI
- `src/lib/*` — Prisma client, plan generator
- `docs/*` — product docs, ER diagram, original UI mockups (`docs/app/`)

## Docs

- [Product Brief](docs/product-brief.md)
- [User Personas](docs/personas.md)
- [PRD](docs/prd.md)
- [ER Diagram](docs/er-diagram.md)

## Business Model

Free at launch. Subscription at $8–12/month once weekly retention is proven.
