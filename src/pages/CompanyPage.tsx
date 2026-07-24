import { lazy } from "react";
import { LazySection } from "../layouts/SiteLayout";

const Company = lazy(() => import("../components/Company").then((m) => ({ default: m.Company })));

export function CompanyPage() {
  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <LazySection minHeight="70vh">
        <Company />
      </LazySection>
    </main>
  );
}
