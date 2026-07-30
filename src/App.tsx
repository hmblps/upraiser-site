import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SiteLayout } from "./layouts/SiteLayout";
import { HomePage } from "./pages/HomePage";
import {
  RedirectExpertiseToSolutions,
  RedirectMeasurementToExpertise,
} from "./pages/LegacyRedirects";

const SolutionsPage = lazy(() =>
  import("./pages/SolutionsPage").then((m) => ({ default: m.SolutionsPage })),
);
const StudioPage = lazy(() => import("./pages/StudioPage").then((m) => ({ default: m.StudioPage })));
const CraftPage = lazy(() => import("./pages/CraftPage").then((m) => ({ default: m.CraftPage })));
const CasesPage = lazy(() => import("./pages/CasesPage").then((m) => ({ default: m.CasesPage })));
const ClientsPage = lazy(() =>
  import("./pages/ClientsPage").then((m) => ({ default: m.ClientsPage })),
);
const CaseDetailPage = lazy(() =>
  import("./pages/CaseDetailPage").then((m) => ({ default: m.CaseDetailPage })),
);
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

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="solutions" element={<SolutionsPage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="craft" element={<CraftPage />} />
          <Route path="rigging" element={<Navigate to="/craft" replace />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="company" element={<CompanyPage />} />

          {/* Legacy depth URLs → consolidated IA */}
          <Route path="clarity" element={<Navigate to="/solutions" replace />} />
          <Route path="expertise" element={<RedirectExpertiseToSolutions />} />
          <Route path="measurement" element={<RedirectMeasurementToExpertise />} />
          <Route path="technology" element={<RedirectMeasurementToExpertise />} />
          <Route path="partners" element={<Navigate to="/solutions?channel=oem#channels" replace />} />
          <Route path="about" element={<Navigate to="/company" replace />} />
          <Route path="how-we-work" element={<Navigate to="/company" replace />} />
          <Route path="resources" element={<Navigate to="/company" replace />} />
          <Route path="resources/*" element={<Navigate to="/company" replace />} />

          <Route path="cases" element={<CasesPage />}>
            <Route path=":slug" element={<CaseDetailPage />} />
          </Route>
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
