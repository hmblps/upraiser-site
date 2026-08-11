import { lazy } from "react";
import { LazySection } from "../layouts/SiteLayout";
import { BrandAurora } from "../components/BrandAurora";
import { useBrandAuroraNav } from "../hooks/useBrandAuroraNav";

const Contact = lazy(() => import("../components/Contact").then((m) => ({ default: m.Contact })));

export function ContactPage() {
  useBrandAuroraNav();

  return (
    <main className="site-main relative min-h-[100dvh] overflow-hidden">
      <BrandAurora tone="contact" />
      <div className="relative z-[1] pt-[var(--site-header-height)]">
        <LazySection minHeight="56vh">
          <Contact />
        </LazySection>
      </div>
    </main>
  );
}
