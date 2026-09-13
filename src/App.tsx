import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { SiteLayout } from "./layouts/SiteLayout";
import { HomePage } from "./pages/HomePage";

import { useGLTF } from "@react-three/drei";
import { DRACO_PATH } from "./lib/heroModel";
useGLTF.preload("/channels/oem/tv-draco.glb", DRACO_PATH);
useGLTF.preload("/channels/oem/tablet.glb", DRACO_PATH);

useGLTF.preload("/phones/deep-blue.glb", DRACO_PATH);
useGLTF.preload("/phones/orange.glb", DRACO_PATH);


import { useTexture } from "@react-three/drei";
if (typeof window !== "undefined") {
  useTexture.preload([
    "/channels/oem/screens/ctv-spot.png",
    "/channels/programmatic-refs/screens/video.png",
    "/channels/programmatic-refs/screens/banner.png"
  ]);
  
  const v = document.createElement("video");
  v.src = "/channels/oem/screens/ctv-spot.mp4";
  v.preload = "auto";
  v.muted = true;
  v.load();
}





const CraftPage = lazy(() => import("./pages/CraftPage").then((m) => ({ default: m.CraftPage })));
const ChannelsPage = lazy(() => import("./pages/ChannelsPage").then((m) => ({ default: m.ChannelsPage })));
const CaseDetailPage = lazy(() => import("./pages/CaseDetailPage").then((m) => ({ default: m.CaseDetailPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));
const PrivacyPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.TermsPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage").then((m) => ({ default: m.ThankYouPage })));
const HeroCapturePage = lazy(() => import("./pages/HeroCapturePage").then((m) => ({ default: m.HeroCapturePage })));
const HeroLitePreviewPage = lazy(() => import("./pages/HeroLitePreviewPage").then((m) => ({ default: m.HeroLitePreviewPage })));

function RouteFallback() {
  return (
    <div className="section-lazy-slot flex min-h-[40dvh] items-center justify-center" role="status" aria-live="polite">
      <span className="sr-only">Loading</span>
    </div>
  );
}

/** Legacy depth pages → home anchors (Routes + Peaks live on `/`). */
function RedirectHomeHash({ hash }: { hash: string }) {
  return <Navigate to={{ pathname: "/", hash }} replace />;
}

const PILLAR_TO_CHANNEL: Record<string, string> = {
  oem: "oem",
  media: "programmatic",
  performance: "performance",
  programmatic: "programmatic",
  social: "social",
  "paid-social": "social",
  creators: "influencer",
  influencer: "influencer",
  ctv: "ctv",
  premium: "native",
  retargeting: "retargeting",
  rewarded: "rewarded",
};

function RedirectExpertiseToRoutes() {
  const [params] = useSearchParams();
  const next = new URLSearchParams();
  const channel = params.get("channel");
  const pillar = params.get("pillar");

  if (channel) {
    next.set("channel", channel);
  } else if (pillar && PILLAR_TO_CHANNEL[pillar]) {
    next.set("channel", PILLAR_TO_CHANNEL[pillar]);
  }

  const qs = next.toString();
  return <Navigate to={qs ? `/?${qs}#routes` : "/#routes"} replace />;
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {import.meta.env.DEV ? <Route path="dev/hero-capture" element={<HeroCapturePage />} /> : null}
        {import.meta.env.DEV ? <Route path="dev/hero-lite" element={<HeroLitePreviewPage theme="light" />} /> : null}
        {import.meta.env.DEV ? <Route path="dev/hero-dark" element={<HeroLitePreviewPage theme="dark" />} /> : null}
        <Route element={<SiteLayout />}>
          {/* Home now includes Cases (Peaks) and Routes natively */}
          <Route path="/" element={<HomePage />}>
            <Route path="cases/:slug" element={<CaseDetailPage />} />
          </Route>
          
          {/* Standalone channels/routes page */}
          <Route path="channels" element={<ChannelsPage />} />

          <Route path="craft" element={<CraftPage />} />
          <Route path="contact/sent" element={<ThankYouPage />} />
          <Route path="contact" element={<ContactPage />} />

          {/* Retired IA → home sections or redirects */}
          <Route path="rigging" element={<Navigate to="/craft" replace />} />
          <Route path="company" element={<Navigate to="/" replace />} />
          <Route path="solutions" element={<RedirectHomeHash hash="routes" />} />
          <Route path="studio" element={<RedirectHomeHash hash="routes" />} />
          <Route path="cases" element={<RedirectHomeHash hash="cases" />} />
          <Route path="clients" element={<RedirectHomeHash hash="cases" />} />

          {/* Legacy depth URLs */}
          <Route path="clarity" element={<RedirectHomeHash hash="routes" />} />
          <Route path="expertise" element={<RedirectExpertiseToRoutes />} />
          <Route path="measurement" element={<RedirectHomeHash hash="routes" />} />
          <Route path="technology" element={<RedirectHomeHash hash="routes" />} />
          <Route path="partners" element={<RedirectHomeHash hash="routes" />} />
          <Route path="about" element={<Navigate to="/" replace />} />
          <Route path="how-we-work" element={<Navigate to="/" replace />} />
          <Route path="resources" element={<Navigate to="/" replace />} />
          <Route path="resources/*" element={<Navigate to="/" replace />} />

          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
