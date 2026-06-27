# AI Workout Coach — Product Requirements Document

**Version:** 1.0
**Date:** June 2026
**Status:** Draft

---

## 1. Overview

AI Workout Coach is an AI-powered mobile coaching app that delivers adaptive weekly training plans, energy-matched playlists, AI form feedback, and audio briefings to fitness-motivated individuals who cannot afford a personal trainer. The app learns from how each session actually felt — via voice note — and adjusts the following week automatically.

---

## 2. Problem Statement

Personal coaching costs $60–150 per session, making structured, adaptive training inaccessible to most people. Existing free apps (Hevy, Nike Training Club) offer static plans with no real adaptation. Paid coaching apps (Future, Ladder) are expensive. There is no product that delivers coaching-level intelligence at zero cost.

---

## 3. Goals

### Product Goals
- Deliver a complete weekly training experience requiring under 5 minutes of setup
- Adapt the plan automatically each week without requiring manual logging
- Provide form feedback that reduces injury risk for self-coached athletes

### Business Goals
- Achieve weekly active usage before introducing paid features
- Convert 10% of active free users to subscription within 6 months of launch
- Target $8–12/month subscription price point

---

## 4. Success Metrics

| Metric | Target |
|---|---|
| Onboarding completion rate | >80% |
| Week 2 retention | >50% |
| Voice note submission rate per session | >60% |
| Audio briefing play rate on Mondays | >70% |
| Form check usage (Phase 3) | >30% of weekly active users |
| Free to paid conversion | >10% at 6 months |

---

## 5. Users

### Primary
**Marcus (23)** — Self-starter, no structure, zero budget. Downloads for plan generation. Converts if progress is visible.

**Priya (34)** — Busy professional, needs adaptivity and no friction. Most likely to pay. Churns if onboarding is slow.

### Secondary
**David (47)** — Comeback adult, needs form guidance and recovery support. Fully served from Phase 3 onwards.

---

## 6. User Journey

```
Download
  → Onboarding (5 questions, ~90 seconds)
    → Week 1 plan generated
      → Monday: Audio briefing (60 seconds)
        → Each workout day: Plan + Playlist
          → Post-workout: Voice note + Recovery card
            → Optional: Form check upload
              → Next week: Adapted plan
                → Repeat
```

---

## 7. Feature Requirements

---

### 7.1 Onboarding & Plan Generation

**Description:** New users answer 5 questions. An AI-generated weekly plan is produced immediately.

**Onboarding Questions:**
1. What is your primary goal? (Build muscle / Lose weight / Improve endurance / General fitness)
2. What equipment do you have access to? (Full gym / Home gym / No equipment)
3. How many days per week can you train? (2 / 3 / 4 / 5+)
4. What is your experience level? (Beginner / Intermediate / Advanced)
5. Do you have any injuries or limitations? (Free text, optional)

**Requirements:**
- Onboarding must complete in under 90 seconds
- Plan must generate within 10 seconds of final answer
- Plan must display as a full weekly calendar view
- Each day must show: workout name, exercise list, sets, reps, estimated duration
- Rest days must be clearly marked
- Plan must be unique per user — not a static template

**Edge Cases:**
- User selects "No equipment" → bodyweight-only plan
- User reports injury → exclude affected muscle groups
- User selects 2 days/week → full body sessions only

---

### 7.2 Audio Briefing

**Description:** A 60-second AI-generated voice summary of the week's plan, delivered every Monday.

**Requirements:**
- Delivered as an in-app audio card on Monday
- Push notification to surface it ("Your week is ready. Tap to hear it.")
- Content must include: number of sessions, key focus areas, any intensity changes from last week
- Generated via text-to-speech (natural voice, not robotic)
- Must play inline — no external app required
- Maximum 60 seconds

**Edge Cases:**
- User opens app before Monday → briefing pre-loads, plays on Monday
- User misses Monday → briefing available through Wednesday, then archived

---

### 7.3 Energy-Matched Playlists *(Phase 2)*

**Description:** A YouTube playlist is attached to each workout day, matched to the workout type.

**Playlist Matching Logic:**

| Workout Type | Playlist Energy | Genre Examples |
|---|---|---|
| Heavy strength (squat, deadlift) | High intensity | Metal, hard rock, hip-hop |
| Hypertrophy / moderate | Medium intensity | Hip-hop, pop, EDM |
| Cardio / HIIT | High tempo | EDM, dance, pop |
| Mobility / recovery | Low intensity | Lo-fi, acoustic, ambient |

**Requirements:**
- One playlist per workout day
- Playlists sourced via YouTube Data API
- Playlist must be playable within the app (embedded player)
- Playlist refreshes weekly — no repeat of same playlist two weeks running
- User can skip to next playlist if they dislike the current one

**Edge Cases:**
- YouTube API rate limit hit → surface cached playlist from previous week
- User has YouTube Premium → prioritise ad-free playback where API supports it

---

### 7.4 Voice Note Adaptation

**Description:** After each workout, the user records a short voice note describing how the session felt. AI processes it and adjusts the next session's intensity.

**Requirements:**
- Voice note prompt appears immediately post-workout on the completion screen
- Recording capped at 60 seconds
- AI must extract: perceived effort (easy / moderate / hard), any specific exercise difficulty, fatigue level
- Adaptation rules:

| Signal Detected | Adaptation |
|---|---|
| Session felt easy | Increase next session weight/reps by 5–10% |
| Session felt hard / brutal | Decrease next session volume by 10–15% |
| Specific exercise was hard | Reduce that exercise's load next session |
| High fatigue mentioned | Add extra rest day or reduce overall week volume |
| No note recorded | Plan unchanged |

- Adaptation must be visible to user ("Based on your note, we've adjusted Thursday's session")
- Voice note is not stored permanently — processed and discarded after 24 hours (privacy)

**Edge Cases:**
- Unclear or off-topic voice note → default to no adaptation, prompt user to re-record
- User records note but skips workout → flag session as skipped, do not adapt

---

### 7.5 AI Form Check *(Phase 3)*

**Description:** User uploads a video of a specific exercise after their workout. AI returns a score and text coaching feedback.

**Supported Exercises at Launch:**
- Squat
- Calf raise

**Requirements:**
- Upload accessible from post-workout screen ("Check your form")
- User must select exercise before uploading
- Accepted formats: MP4, MOV
- Maximum video length: 60 seconds
- AI returns: score (1–10) + 3–5 bullet points of text feedback
- Processing time: under 30 seconds
- Mandatory safety disclaimer must appear before every feedback result:

> *"This feedback is AI-generated and for informational purposes only. It is not a substitute for advice from a qualified fitness professional. Always train within your limits and consult a professional if you are unsure about your form or have any pain or injury."*

- Disclaimer requires user tap to acknowledge before feedback is shown
- Form check history stored per user (last 10 checks)

**Edge Cases:**
- Video too dark or blurry → return error: "We couldn't analyse this video. Try filming in better light with your full body in frame."
- Exercise not supported → "We don't support this exercise yet. Squat and calf raise are available now."
- AI confidence below threshold → return partial feedback with low-confidence warning

---

### 7.6 Recovery Cards

**Description:** Post-workout stretching tips surfaced after every completed session.

**Requirements:**
- Appears on the post-workout completion screen, below the voice note prompt
- Card shows: stretch name, target muscle, duration, brief instruction (2–3 lines)
- Minimum 3 cards per session, matched to muscles worked that day
- Cards are swipeable
- Content is static at launch (curated library), AI-personalised in Phase 2

**Edge Cases:**
- User marks rest day as complete → show full-body mobility routine
- User has reported injury in onboarding → exclude stretches for affected area

---

## 8. Out of Scope (v1.0)

- Wearable / heart rate integration
- Nutrition tracking or meal planning
- Live coaching or human review of form videos
- Social / community features
- Apple Watch or Wear OS companion
- Exercises beyond squat and calf raise for form check (Phase 3 launch)
- Android tablet or iPad optimised layouts

---

## 9. Technical Requirements

| Area | Requirement |
|---|---|
| Platform | iOS and Android (React Native or Flutter) |
| AI — Plan generation | LLM API (Claude) with structured output |
| AI — Voice note | Speech-to-text + LLM extraction |
| AI — Audio briefing | Text-to-speech (natural voice) |
| AI — Form check | Computer vision / pose estimation model |
| Video — Playlists | YouTube Data API v3 |
| Storage | Voice notes: deleted after 24hrs. Videos: deleted after form check completes. Form check history: retained. |
| Auth | Email + Google/Apple social login |
| Offline | Core plan viewable offline. Voice note queued and submitted on reconnect. |

---

## 10. Release Plan

| Phase | Features | Target |
|---|---|---|
| Phase 1 — MVP | Onboarding, plan generation, voice note adaptation, audio briefing, recovery cards | Month 1–3 |
| Phase 2 — Playlists | YouTube playlist integration by workout type | Month 4–5 |
| Phase 3 — Form Check | AI form check, squat + calf raise, score + text + disclaimer | Month 6–8 |
| Phase 4 — Monetisation | Subscription paywall on form check history + advanced customisation | Month 9+ |

---

## 11. Open Questions

| Question | Owner | Priority |
|---|---|---|
| Which computer vision model for form check? In-house or third-party API? | Engineering | High |
| Legal review of safety disclaimer wording before Phase 3 launch | Legal | High |
| Does YouTube API licensing allow embedded in-app playback commercially? | Engineering / Legal | High |
| What triggers the subscription prompt — time or behaviour? | Product | Medium |
| Will voice notes require explicit user consent for processing under GDPR? | Legal | Medium |

---

*AI Workout Coach PRD v1.0 — June 2026*
