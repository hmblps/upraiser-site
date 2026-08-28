import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { SmoothScroll } from "../components/SmoothScroll";
import { SiteGrain } from "../components/SiteGrain";
import { ScrollLink } from "../components/ScrollLink";
import { ScrollToTop } from "../components/ScrollToTop";
import { ViewportChrome } from "../components/ViewportChrome";
import { useApplePreview } from "../hooks/useApplePreview";
import { useViewportRoute } from "../hooks/useViewportRoute";
import { CaseModalProvider } from "../context/CaseModalContext";
import { useModalBackground } from "../lib/modalBackgroundState";

const ApplePreviewPanel = lazy(() =>
  import("../components/apple-preview/ApplePreviewPanel").then((m) => ({ default: m.ApplePreviewPanel })),
);

const CustomCursor = lazy(() =>
  import("../components/CustomCursor").then((m) => ({ default: m.CustomCursor })),
);

const Footer = lazy(() => import("../components/Footer").then((m) => ({ default: m.Footer })));
const GlobalAmbientModalBackground = lazy(() =>
  import("../components/GlobalAmbientModalBackground").then((m) => ({
    default: m.GlobalAmbientModalBackground,
  })),
);

function DeferredModalAmbient() {
  const isOpen = useModalBackground((s) => s.isOpen);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (isOpen) setArmed(true);
  }, [isOpen]);

  if (!armed) return null;

  return (
    <Suspense fallback={null}>
      <GlobalAmbientModalBackground />
    </Suspense>
  );
}

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

/** Render children only when the slot nears the viewport — keeps hero GLB/WebGL uncontested. */
export function LazySection({ children, minHeight = "28dvh" }: { children: ReactNode; minHeight?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShow(true);
        io.disconnect();
      },
      { rootMargin: "30% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {show ? (
        <Suspense fallback={<div className="section-lazy-slot" style={{ minHeight }} aria-hidden />}>
          {children}
        </Suspense>
      ) : (
        <div className="section-lazy-slot" style={{ minHeight }} aria-hidden />
      )}
    </div>
  );
}

export function SiteLayout() {
  const { isPreviewMode: applePreview, features: appleFeatures } = useApplePreview();
  const viewportRoute = useViewportRoute();

  return (
    <SmoothScroll>
      <CaseModalProvider>
        <ScrollToTop />
        <ScrollLink href="/" className="skip-link">
          Skip to content
        </ScrollLink>
        <SiteGrain />
        <DeferredCustomCursor />
        <DeferredModalAmbient />
        <Header />
        <div className={viewportRoute ? "viewport-route-frame" : undefined}>
          <Outlet />
          {viewportRoute ? <ViewportChrome /> : null}
        </div>
        {!viewportRoute ? (
          <LazySection minHeight="20vh">
            <Footer />
          </LazySection>
        ) : null}
        {applePreview && appleFeatures ? (
          <Suspense fallback={null}>
            <ApplePreviewPanel active={appleFeatures} />
          </Suspense>
        ) : null}
      </CaseModalProvider>
    </SmoothScroll>
  );
}
