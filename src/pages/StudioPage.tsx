import { lazy } from "react";
import { LazySection } from "../layouts/SiteLayout";

const Studio = lazy(() => import("../components/Studio").then((m) => ({ default: m.Studio })));

export function StudioPage() {
  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <LazySection minHeight="70vh">
        <Studio />
      </LazySection>
    </main>
  );
}
