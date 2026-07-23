import { lazy } from "react";
import { LazySection } from "../layouts/SiteLayout";

const Contact = lazy(() => import("../components/Contact").then((m) => ({ default: m.Contact })));

export function ContactPage() {
  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <LazySection minHeight="56vh">
        <Contact />
      </LazySection>
    </main>
  );
}
