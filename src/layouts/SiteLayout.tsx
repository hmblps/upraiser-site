import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { SmoothScroll } from "../components/SmoothScroll";
import { SiteGrain } from "../components/SiteGrain";
import { ScrollLink } from "../components/ScrollLink";
import { ScrollToTop } from "../components/ScrollToTop";
import { useApplePreview } from "../hooks/useApplePreview";
import { CaseModalProvider } from "../context/CaseModalContext";

const ApplePreviewPanel = lazy(() =>
  import("../components/apple-preview/ApplePreviewPanel").then((m) => ({ default: m.ApplePreviewPanel })),
);

const CustomCursor = lazy(() =>
  import("../components/CustomCursor").then((m) => ({ default: m.CustomCursor })),
);

const PartnersCarousel = lazy(() =>
  import("../components/PartnersCarousel").then((m) => ({ default: m.PartnersCarousel })),
);

const Footer = lazy(() => import("../components/Footer").then((m) => ({ default: m.Footer })));

function DeferredCustomCursor() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 900 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <CustomCursor />
    </Suspense>
  );
}

export function LazySection({ children, minHeight = "28vh" }: { children: ReactNode; minHeight?: string }) {
  return (
    <Suspense fallback={<div className="section-lazy-slot" style={{ minHeight }} aria-hidden />}>
      {children}
    </Suspense>
  );
}

export function SiteLayout() {
  const { isPreviewMode: applePreview, features: appleFeatures } = useApplePreview();

  return (
    <SmoothScroll>
      <CaseModalProvider>
        <ScrollToTop />
        <ScrollLink href="/" className="skip-link">
          Skip to content
        </ScrollLink>
        <SiteGrain />
        <DeferredCustomCursor />
        <Header />
        <Outlet />
        {/* Same as production: integrations strip above Footer on every page */}
        <LazySection minHeight="12vh">
          <PartnersCarousel />
        </LazySection>
        <LazySection minHeight="20vh">
          <Footer />
        </LazySection>
        {applePreview && appleFeatures ? (
          <Suspense fallback={null}>
            <ApplePreviewPanel active={appleFeatures} />
          </Suspense>
        ) : null}
      </CaseModalProvider>
    </SmoothScroll>
  );
}
