import { AppShell } from "@/components/AppShell";
import { Field, LinkButton } from "@/components/ui";

const chip =
  "cursor-pointer rounded-lg border border-line bg-[#0f1622] px-3 py-2 text-xs text-muted transition peer-checked:border-accent peer-checked:bg-accent peer-checked:font-bold peer-checked:text-white";

export default function FormCheckPage() {
  return (
    <AppShell
      title="AI Form Check"
      subtitle="Upload a video · squat or calf raise"
      back={{ href: "/plan", label: "Week" }}
    >
      <div className="flex flex-col gap-3">
        <Field label="Exercise">
          <div className="flex flex-wrap gap-2">
            {["Squat", "Calf raise"].map((ex, i) => (
              <label key={ex}>
                <input
                  type="radio"
                  name="exercise"
                  defaultChecked={i === 0}
                  className="peer sr-only"
                />
                <span className={chip}>{ex}</span>
              </label>
            ))}
          </div>
        </Field>

        <div className="rounded-2xl border border-dashed border-line bg-panel-2 py-6 text-center">
          <div className="text-3xl">🎥</div>
          <div className="mt-1.5 text-xs">Tap to upload</div>
          <div className="text-[10.5px] text-dim">MP4 / MOV · max 60s</div>
        </div>

        <div className="rounded-xl border border-warn bg-warn/10 p-2.5 text-[10.5px] text-[#ffd489]">
          ⚠ This feedback is AI-generated and for informational purposes only —
          not a substitute for a qualified professional. Tap to acknowledge
          before results.
        </div>

        <LinkButton href="/form-check/demo">Analyze form</LinkButton>
      </div>
    </AppShell>
  );
}
