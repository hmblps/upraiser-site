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
import {
  isHeroReady,
  warmStage,
  whenHeroReady,
  type PreloadStage,
} from "../lib/scrollPreload";

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
    return whenHeroReady(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <CustomCursor />
    </Suspense>
  );
}

/**
 * Two-phase slot: warm JS/GLB as the block approaches, mount when it is close.
 * `gate="hero"` waits for Everest so Routes 3D cannot steal the first paint.
 */
export function LazySection({
  children,
  minHeight = "28dvh",
  id,
  warm,
  gate,
  warmMargin = "90% 0px",
  showMargin = "30% 0px",
}: {
  children: ReactNode;
  minHeight?: string;
  id?: string;
  warm?: PreloadStage;
  gate?: "hero";
  warmMargin?: string;
  showMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [heroOk, setHeroOk] = useState(() => gate !== "hero" || isHeroReady());
  const warmedRef = useRef(false);

  useEffect(() => {
    if (gate !== "hero" || heroOk) return;
    return whenHeroReady(() => setHeroOk(true));
  }, [gate, heroOk]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const kickWarm = () => {
      if (warmedRef.current) return;
      warmedRef.current = true;
      if (warm) warmStage(warm);
    };

    const warmIo = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        kickWarm();
        warmIo.disconnect();
      },
      { rootMargin: warmMargin, threshold: 0 },
    );
    const showIo = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        kickWarm();
        setShow(true);
        showIo.disconnect();
        warmIo.disconnect();
      },
      { rootMargin: showMargin, threshold: 0 },
    );
    warmIo.observe(el);
    showIo.observe(el);
    return () => {
      warmIo.disconnect();
      showIo.disconnect();
    };
  }, [warm, warmMargin, showMargin]);

  const mounted = show && heroOk;

  return (
    <div ref={ref} id={mounted ? undefined : id}>
      {mounted ? (
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
          <LazySection minHeight="20dvh">
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
