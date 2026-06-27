# Session Summary — AI Workout Coach
**Date:** June 27, 2026

---

## What We Did

Started with a rough product idea and ran a full product discovery session through brutal product coaching questions. Went from a vague concept to a fully defined product with a brief, personas, PRD, and GitHub repo.

---

## The Idea (Before)

> "Weekly training plan, energy-matched YouTube playlists, a form-check video skill, recovery cards. Describe your lifts on Sunday; have a personalized week, audio briefings, and playlists waiting Monday."

---

## The Product (After)

**AI Workout Coach** — An AI-powered mobile coaching app that delivers adaptive weekly training plans, energy-matched playlists, AI form feedback, and audio briefings to fitness-motivated individuals who cannot afford a personal trainer.

### Target User
Budget-conscious fitness enthusiasts (21–60) who can't afford a personal trainer ($60–150/hour) but want coaching-level structure, adaptivity, and feedback.

### Core Loop
1. Answer 5 onboarding questions → AI generates Week 1 plan
2. Monday: receive 60-second audio briefing of the week
3. Each workout day: follow plan + listen to energy-matched playlist
4. Post-workout: record voice note → AI adjusts next session intensity
5. Optional: upload form check video → receive score + text feedback
6. Recovery cards (stretching tips) shown after every session
7. Repeat with an adapted plan next week

---

## Key Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| Hero feature | Adaptive plans (not playlists) | Playlists are the delight layer; plans solve the core pain |
| Playlist matching | By workout type | More contextual than Spotify's generic "workout" category |
| Post-workout input | Voice note (60 sec max) | Frictionless — no sliders, no manual logging |
| Voice note data | Processed + deleted after 24hrs | Privacy |
| Form check output | Score (1–10) + text feedback | Balances simplicity with usefulness |
| Form check scope | Squat + calf raise at launch | Scope control — expand in later versions |
| Safety disclaimer | Mandatory tap-to-acknowledge | Legal protection before every form check result |
| Sunday ritual | Dropped | Arbitrary timing — not load-bearing |
| Monetisation | Free → $8–12/month subscription | Build retention first, monetise after |

---

## Personas

### Marcus, 23 — The Self-Starter
Goal: Build muscle. No structure, zero budget. Downloads for plan generation.
> *"I don't need a trainer. I just need to know what I'm supposed to do tomorrow."*

### Priya, 34 — The Time-Strapped Professional
Goal: Stay consistent. Needs adaptivity and zero friction. Most likely to pay.
> *"I just want to open the app, know what I'm doing, press play, and go."*

### David, 47 — The Comeback Adult
Goal: Rebuild strength safely after 5-year gap. Needs form feedback + recovery.
> *"I just don't want to hurt myself doing it wrong."*

---

## Features

| Feature | Description | Phase |
|---|---|---|
| Adaptive Weekly Plan | AI-generated from 5 questions, rebuilt weekly from voice note | 1 |
| Audio Briefing | 60-second Monday morning voice summary of the week | 1 |
| Voice Note Adaptation | Post-workout voice input → AI shifts next session intensity | 1 |
| Recovery Cards | Swipeable stretching tips matched to muscles worked | 1 |
| Energy-Matched Playlists | YouTube playlists by workout type | 2 |
| AI Form Check | Upload squat/calf raise → score + text + disclaimer | 3 |

---

## Build Phases

| Phase | Features | Timeline |
|---|---|---|
| Phase 1 — MVP | Onboarding, plan generation, voice adaptation, audio briefing, recovery cards | Month 1–3 |
| Phase 2 — Playlists | YouTube playlist integration by workout type | Month 4–5 |
| Phase 3 — Form Check | AI form check, squat + calf raise only | Month 6–8 |
| Phase 4 — Monetisation | Subscription at $8–12/month | Month 9+ |

---

## Differentiators vs Competitors

- **Voice note adaptation** — beats every RPE slider in the market, frictionless and natural
- **Playlist tied to workout type** — more contextual than Spotify's generic workout playlists
- **Form check + adaptive plan in one app** — competitors (Ladder, Future, Hevy) split these across tools
- **The combination is the moat** — not any single feature

---

## Deliverables Created

| File | Description |
|---|---|
| `README.md` | Project overview and phase plan |
| `docs/product-brief.md` | One-page product brief |
| `docs/personas.md` | Marcus, Priya, David personas |
| `docs/prd.md` | Full Product Requirements Document |
| `docs/landing-page-design-prompt.md` | Design prompt for v0.dev / Lovable / Bolt |

**GitHub repo:** https://github.com/garajugurram/ai-workout-coach

---

## Next Steps

- [ ] Build landing page using design prompt (v0.dev / Lovable / Bolt or direct HTML/CSS)
- [ ] Define tech stack for Phase 1 build
- [ ] Write user stories for Phase 1 features
- [ ] Define AI prompt structure for plan generation
- [ ] Define API design for voice note processing

---

*AI Workout Coach — Session Summary v1.0 | June 27, 2026*
