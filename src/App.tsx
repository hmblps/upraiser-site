import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SiteLayout } from "./layouts/SiteLayout";
import { HomePage } from "./pages/HomePage";
import {
  RedirectExpertiseToSolutions,
  RedirectMeasurementToExpertise,
} from "./pages/LegacyRedirects";

const CraftPage = lazy(() => import("./pages/CraftPage").then((m) => ({ default: m.CraftPage })));
const CompanyPage = lazy(() =>
  import("./pages/CompanyPage").then((m) => ({ default: m.CompanyPage })),
);
const ContactPage = lazy(() =>
  import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const PrivacyPage = lazy(() =>
  import("./pages/LegalPages").then((m) => ({ default: m.PrivacyPage })),
);
const TermsPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.TermsPage })));

function RouteFallback() {
  return <div className="section-lazy-slot min-h-[40dvh]" aria-hidden />;
}

/** Legacy depth pages → home anchors (Routes + Peaks live on `/`). */
function RedirectHomeHash({ hash }: { hash: string }) {
  return <Navigate to={{ pathname: "/", hash }} replace />;
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="cases/:slug" element={<HomePage />} />

          <Route path="craft" element={<CraftPage />} />
          <Route path="rigging" element={<Navigate to="/craft" replace />} />
          <Route path="company" element={<CompanyPage />} />

          {/* Retired IA → home sections */}
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
          <Route path="about" element={<Navigate to="/company" replace />} />
          <Route path="how-we-work" element={<Navigate to="/company" replace />} />
          <Route path="resources" element={<Navigate to="/company" replace />} />
          <Route path="resources/*" element={<Navigate to="/company" replace />} />

          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
