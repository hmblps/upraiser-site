import { lazy } from "react";
import { LazySection } from "../layouts/SiteLayout";

const Clients = lazy(() => import("../components/Clients").then((m) => ({ default: m.Clients })));

export function ClientsPage() {
  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <LazySection minHeight="70vh">
        <Clients />
      </LazySection>
    </main>
  );
}
