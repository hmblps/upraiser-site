import { UnderConstruction } from "../components/UnderConstruction";
import { useMode } from "../components/SectionHeader";
import { ModeContentTransition } from "../components/motion/ModeContentTransition";

export function CraftPage() {
  const { mode } = useMode();

  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <ModeContentTransition mode={mode}>
        <UnderConstruction
          label={mode === "infrastructure" ? "The Assets" : "The Craft"}
          title={mode === "infrastructure" ? "Transparent asset pipelines under rigging" : "Creative lab under rigging"}
          description={mode === "infrastructure" ? "Verifiable creator networks and raw asset supply chains are being wired. The workshop opens soon." : "Full-spectrum creative and proprietary pipelines are being wired into the ascent line. The workshop opens soon."}
          backHref="/"
          backLabel="Return to The Basecamp"
        />
      </ModeContentTransition>
    </main>
  );
}
