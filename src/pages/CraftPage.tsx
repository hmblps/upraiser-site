import { lazy } from "react";
import { LazySection } from "../layouts/SiteLayout";

const Craft = lazy(() => import("../components/Craft").then((m) => ({ default: m.Craft })));

export function CraftPage() {
  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <LazySection minHeight="70vh">
        <Craft />
      </LazySection>
    </main>
  );
}
