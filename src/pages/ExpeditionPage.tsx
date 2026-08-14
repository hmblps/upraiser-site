import { lazy } from "react";
import { LazySection } from "../layouts/SiteLayout";
import { BrandAurora } from "../components/BrandAurora";
import { useBrandAuroraNav } from "../hooks/useBrandAuroraNav";

const Company = lazy(() => import("../components/Company").then((m) => ({ default: m.Company })));

export function ExpeditionPage() {
  useBrandAuroraNav();

  return (
    <main className="site-main relative min-h-[100dvh] overflow-hidden">
      <BrandAurora tone="company" />
      <div className="relative z-[1] pt-[var(--site-header-height)]">
        <LazySection minHeight="70vh">
          <Company />
        </LazySection>
      </div>
    </main>
  );
}
