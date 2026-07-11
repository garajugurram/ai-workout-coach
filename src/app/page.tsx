import { AppShell } from "@/components/AppShell";
import { LinkButton } from "@/components/ui";

const FEATURES = [
  ["🗓️", "Adaptive weekly plan", "Rebuilt every week from how your sessions felt."],
  ["🎧", "Energy-matched playlists", "The right music for every workout type."],
  ["🎙️", "Voice-note adaptation", "Talk after a session; next week adjusts itself."],
  ["🎥", "AI form check", "Score + coaching on your squat and calf raise."],
];

export default function Home() {
  return (
    <AppShell>
      <div className="mt-4 mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-accent-2">
          AI Workout Coach
        </div>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight">
          Coaching-level structure, without the coach.
        </h1>
        <p className="mt-2 text-sm text-muted">
          Adaptive weekly training, audio briefings, and AI form feedback — for
          people who can&apos;t afford a personal trainer.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {FEATURES.map(([icon, title, desc]) => (
          <div
            key={title}
            className="flex items-start gap-3 rounded-2xl border border-line bg-panel-2 p-3.5"
          >
            <span className="text-xl">{icon}</span>
            <div>
              <b className="text-[13px]">{title}</b>
              <p className="text-[11.5px] text-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <LinkButton href="/onboarding">Get started →</LinkButton>
        <LinkButton href="/plan" variant="ghost">
          View this week
        </LinkButton>
      </div>
    </AppShell>
  );
}
