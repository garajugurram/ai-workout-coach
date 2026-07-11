import { AppShell } from "@/components/AppShell";

const FEEDBACK = [
  "Good depth — hips break below parallel.",
  "Knees track over toes, no valgus collapse.",
  "Slight forward lean — brace core harder.",
  "Keep heels planted through the drive.",
];

export default async function FormResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return (
    <AppShell
      title="Squat · Form Score"
      back={{ href: "/form-check", label: "Form check" }}
    >
      <div className="mx-auto my-2 grid h-24 w-24 place-items-center rounded-full bg-[conic-gradient(var(--color-accent-2)_0_80%,var(--color-line)_80%_100%)]">
        <div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-[#0d1524]">
          <span className="text-[26px] font-black leading-none">8</span>
          <span className="text-[10px] text-dim">/ 10</span>
        </div>
      </div>
      <p className="text-center text-xs font-bold text-accent-2">
        Solid depth &amp; control
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {FEEDBACK.map((f) => (
          <div key={f} className="flex items-start gap-2 text-xs text-muted">
            <span className="font-black text-accent-2">✓</span>
            {f}
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[10.5px] text-dim">
        Saved to history · last 10 checks kept
      </p>
    </AppShell>
  );
}
