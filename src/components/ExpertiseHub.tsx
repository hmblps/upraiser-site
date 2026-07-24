import { EXPERTISE_CONTENT, type ExpertiseClusterId } from "../data/innerPagesData";
import { SlideTabs } from "./SlideTabs";

type ExpertiseHubProps = {
  activeId: ExpertiseClusterId;
  onSelect: (id: ExpertiseClusterId, primaryChannel: string) => void;
};

/**
 * Sticky cluster tabs — Media & UA | OEM & Lenovo | Clarity.
 * layoutId pill + spring; sits under the site header.
 */
export function ExpertiseHub({ activeId, onSelect }: ExpertiseHubProps) {
  const tabs = EXPERTISE_CONTENT.tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
  }));

  const handleChange = (id: string) => {
    const cluster = EXPERTISE_CONTENT.clusters.find((c) => c.id === id);
    if (!cluster) return;
    onSelect(cluster.id, cluster.primaryChannel);
  };

  return (
    <section
      id="help-with"
      className="expertise-cluster-tabs sticky top-[var(--site-header-height)] z-30 border-b border-border/50"
      aria-label={EXPERTISE_CONTENT.hubLabel}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="min-w-0">
          <p className="section-label">{EXPERTISE_CONTENT.hubLabel}</p>
          <p className="mt-1 hidden max-w-md text-xs text-muted sm:block">
            {EXPERTISE_CONTENT.hubDescription}
          </p>
        </div>
        <SlideTabs
          items={tabs}
          activeId={activeId}
          onChange={handleChange}
          layoutId="expertise-cluster-pill"
          className="expertise-cluster-tabs__pills overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        />
      </div>
    </section>
  );
}
