import {
  EXPERTISE_CONTENT,
  isExpertiseGrowthId,
  type ExpertiseClusterId,
} from "../data/innerPagesData";
import { SlideTabs } from "./SlideTabs";

type ExpertiseHubProps = {
  activeId: ExpertiseClusterId;
  onSelect: (id: ExpertiseClusterId, primaryChannel: string) => void;
};

/**
 * Two-level Expertise nav:
 * App Growth | OEM  + inventory strip under App Growth
 */
export function ExpertiseHub({ activeId, onSelect }: ExpertiseHubProps) {
  const growthActive = isExpertiseGrowthId(activeId);
  const primaryId = activeId === "oem" ? "oem" : "media";

  const handlePrimary = (id: string) => {
    if (id === "oem") {
      const cluster = EXPERTISE_CONTENT.clusters.find((c) => c.id === "oem");
      if (cluster) onSelect(cluster.id, cluster.primaryChannel);
      return;
    }
    if (growthActive) return;
    const cluster = EXPERTISE_CONTENT.clusters.find((c) => c.id === "media");
    if (cluster) onSelect(cluster.id, cluster.primaryChannel);
  };

  const handleInventory = (id: string) => {
    const cluster = EXPERTISE_CONTENT.clusters.find((c) => c.id === id);
    if (!cluster) return;
    onSelect(cluster.id, cluster.primaryChannel);
  };

  return (
    <section
      id="help-with"
      className="expertise-cluster-tabs shrink-0 border-b border-border/50"
      aria-label={EXPERTISE_CONTENT.hubLabel}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 py-2">
        <SlideTabs
          items={[...EXPERTISE_CONTENT.primaryTabs]}
          activeId={primaryId}
          onChange={handlePrimary}
          layoutId="expertise-primary-pill"
          className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        />
      </div>

      {growthActive ? (
        <div className="border-t border-border/35 py-2" aria-label={EXPERTISE_CONTENT.inventoryLabel}>
          <SlideTabs
            items={[...EXPERTISE_CONTENT.inventoryTabs]}
            activeId={activeId}
            onChange={handleInventory}
            layoutId="expertise-inventory-pill"
            className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          />
        </div>
      ) : null}
    </section>
  );
}
