import { AppShell } from "@/components/AppShell";
import { LinkButton } from "@/components/ui";

export default function PremiumPage() {
  return (
    <AppShell
      title="Unlock everything"
      subtitle="Your progress is worth it"
      back={{ href: "/plan", label: "Week" }}
    >
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-line bg-panel-2 p-3.5">
          <b className="text-[13px]">Free</b>
          <div className="text-2xl font-black">$0</div>
          <ul className="mt-1 space-y-1 text-xs text-muted">
            <li>→ Weekly plan &amp; adaptation</li>
            <li>→ Audio briefing</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-accent bg-linear-to-b from-accent/15 to-transparent p-3.5">
          <b className="text-[13px] text-accent">Premium</b>
          <div className="text-2xl font-black">
            $10<span className="text-xs font-semibold text-muted"> / month</span>
          </div>
          <ul className="mt-1 space-y-1 text-xs text-muted">
            <li>→ Full form-check history</li>
            <li>→ Advanced customisation</li>
            <li>→ Expanded exercise library</li>
          </ul>
        </div>

        <LinkButton href="/plan">Start 7-day trial</LinkButton>
        <p className="text-center text-[10px] text-dim">
          Billed via App Store · cancel anytime
        </p>
      </div>
    </AppShell>
  );
}
