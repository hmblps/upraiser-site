import { lazy } from "react";
import { LazySection } from "../layouts/SiteLayout";

const About = lazy(() => import("../components/About").then((m) => ({ default: m.About })));

export function AboutPage() {
  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <LazySection minHeight="70vh">
        <About />
      </LazySection>
    </main>
  );
}
