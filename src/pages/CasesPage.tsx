import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { LazySection } from "../layouts/SiteLayout";
import { BrandAurora } from "../components/BrandAurora";
import { useBrandAuroraNav } from "../hooks/useBrandAuroraNav";

const CaseStudies = lazy(() =>
  import("../components/CaseStudies").then((m) => ({ default: m.CaseStudies })),
);

export function CasesPage() {
  useBrandAuroraNav();

  return (
    <main className="site-main relative min-h-[100dvh] overflow-hidden">
      <BrandAurora tone="cases" />
      <div className="relative z-[1] pt-[var(--site-header-height)]">
        <LazySection minHeight="56vh">
          <CaseStudies />
        </LazySection>
        <Outlet />
      </div>
    </main>
  );
}
