import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/AppShell";
import { Card, LinkButton } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function BriefingPage() {
  const plan = await prisma.workoutPlan.findFirst({
    where: { status: "ACTIVE", user: { email: "demo@aiworkoutcoach.app" } },
    orderBy: { generatedAt: "desc" },
    include: { days: true },
  });
  const sessions = plan?.days.filter((d) => !d.isRestDay).length ?? 0;

  return (
    <AppShell
      title="Your week is ready"
      subtitle="60-second audio briefing"
      back={{ href: "/plan", label: "Week" }}
    >
      <Card className="bg-linear-to-b from-[#241a4d] to-[#12233a] text-center">
        <div className="mx-auto my-2 grid h-20 w-20 place-items-center rounded-full bg-[conic-gradient(var(--color-accent)_0_62%,var(--color-line)_62%_100%)]">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#0d1524] text-2xl">
            ▶
          </div>
        </div>
        <b className="text-[13px]">
          Week {plan?.weekNumber ?? 1} · What&apos;s ahead
        </b>
        <p className="mt-2 text-[11px] text-muted">
          {sessions} sessions · {plan?.focusSummary ?? "focus on consistency"}
        </p>
      </Card>

      <div className="mt-4">
        <LinkButton href="/plan" variant="ghost">
          ▶ Play briefing · 0:58
        </LinkButton>
      </div>
    </AppShell>
  );
}
