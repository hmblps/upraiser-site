import { lazy } from "react";
import { LazySection } from "../layouts/SiteLayout";

const CaseStudies = lazy(() =>
  import("../components/CaseStudies").then((m) => ({ default: m.CaseStudies })),
);

export function CasesPage() {
  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <LazySection minHeight="56vh">
        <CaseStudies />
      </LazySection>
    </main>
  );
}
