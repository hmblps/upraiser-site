import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SiteLayout } from "./layouts/SiteLayout";
import { HomePage } from "./pages/HomePage";

import {
  RedirectExpertiseToSolutions,
  RedirectMeasurementToExpertise,
} from "./pages/LegacyRedirects";

const CraftPage = lazy(() => import("./pages/CraftPage").then((m) => ({ default: m.CraftPage })));

const ChannelsPage = lazy(() => import("./pages/ChannelsPage").then((m) => ({ default: m.ChannelsPage })));
const CaseDetailPage = lazy(() =>
  import("./pages/CaseDetailPage").then((m) => ({ default: m.CaseDetailPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const PrivacyPage = lazy(() =>
  import("./pages/LegalPages").then((m) => ({ default: m.PrivacyPage })),
);
const TermsPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.TermsPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage").then((m) => ({ default: m.ThankYouPage })));
const HeroCapturePage = lazy(() =>
  import("./pages/HeroCapturePage").then((m) => ({ default: m.HeroCapturePage })),
);

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

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {import.meta.env.DEV ? <Route path="dev/hero-capture" element={<HeroCapturePage />} /> : null}
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
          <Route path="expertise" element={<RedirectExpertiseToSolutions />} />
          <Route path="measurement" element={<RedirectMeasurementToExpertise />} />
          <Route path="technology" element={<RedirectMeasurementToExpertise />} />
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
