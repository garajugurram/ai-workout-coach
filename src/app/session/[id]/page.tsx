import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/AppShell";
import { Card, LinkButton } from "@/components/ui";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params; // stub session id (auth/session tracking deferred — issue #1 scope)
  const recoveryCards = await prisma.recoveryCard.findMany({
    take: 3,
    include: { muscleGroup: true },
    orderBy: { stretchName: "asc" },
  });

  return (
    <AppShell title="Nice work 💪" subtitle="How did that session feel?">
      <Card className="text-center">
        <div className="mx-auto my-1 grid h-16 w-16 place-items-center rounded-full bg-linear-to-b from-hot to-[#ff8a5d] text-2xl shadow-[0_0_0_8px_rgba(255,93,115,0.14)]">
          ●
        </div>
        <div className="mt-2 text-[11px] text-muted">Tap to record · max 1:00</div>
      </Card>
      <p className="mt-2 text-center text-[11px] text-dim">
        Voice note auto-deletes in 24h · we keep only the adjustment
      </p>

      <h2 className="mt-4 mb-2 text-sm font-extrabold">Recovery stretches</h2>
      <div className="flex flex-col gap-2">
        {recoveryCards.map((rc) => (
          <div
            key={rc.id}
            className="flex items-center gap-2.5 rounded-xl border border-line bg-panel-2 px-3 py-2.5"
          >
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/20 text-base">
              🧘
            </div>
            <div>
              <b className="text-[12.5px]">{rc.stretchName}</b>
              <span className="block text-[10.5px] text-muted">
                {rc.muscleGroup.name} · {rc.durationSeconds}s
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <LinkButton href="/session/demo/adaptation" variant="ghost">
          See how your plan adapts →
        </LinkButton>
      </div>
    </AppShell>
  );
}
