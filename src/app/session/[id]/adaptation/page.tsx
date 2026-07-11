import { AppShell } from "@/components/AppShell";
import { LinkButton } from "@/components/ui";

const DELTAS = [
  ["Bench Press", "↑ +7% load", "up"],
  ["Thursday volume", "↓ −12%", "down"],
  ["Fatigue signal", "+ extra rest day", "up"],
] as const;

export default async function AdaptationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return (
    <AppShell
      title="We adjusted your plan"
      subtitle="Based on your voice note"
      back={{ href: "/plan", label: "Week" }}
    >
      <div className="rounded-2xl border border-accent-2 bg-linear-to-b from-accent-2/10 to-accent/10 p-3.5">
        <div className="text-[11px] font-extrabold uppercase tracking-wide text-accent-2">
          You said
        </div>
        <p className="mt-1 text-[13px]">
          “Bench felt easy but my legs were smoked.”
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {DELTAS.map(([label, change, dir]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl border border-line bg-[#0f1622] px-3 py-2.5"
            >
              <span className="text-xs">{label}</span>
              <span
                className={`text-xs font-extrabold ${
                  dir === "up" ? "text-accent-2" : "text-hot"
                }`}
              >
                {change}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[11px] text-muted">
        Extracted signals feed next week&apos;s plan generation automatically.
      </p>
      <div className="mt-5">
        <LinkButton href="/plan" variant="ghost">
          See updated week
        </LinkButton>
      </div>
    </AppShell>
  );
}
