import { UnderConstruction } from "../components/UnderConstruction";

export function CraftPage() {
  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <UnderConstruction
        label="The Craft"
        title="Creative lab under rigging"
        description="Full-spectrum creative and proprietary pipelines are being wired into the ascent line. The workshop opens soon."
        backHref="/"
        backLabel="Return to The Basecamp"
      />
    </main>
  );
}
