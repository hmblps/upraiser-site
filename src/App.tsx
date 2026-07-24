import { Routes, Route, Navigate } from "react-router-dom";
import { SiteLayout } from "./layouts/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { ExpertisePage } from "./pages/ExpertisePage";
import {
  RedirectMeasurementToExpertise,
  RedirectSolutionsToExpertise,
} from "./pages/LegacyRedirects";
import { CasesPage } from "./pages/CasesPage";
import { CaseDetailPage } from "./pages/CaseDetailPage";
import { CompanyPage } from "./pages/CompanyPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PrivacyPage, TermsPage } from "./pages/LegalPages";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="expertise" element={<ExpertisePage />} />
        <Route path="company" element={<CompanyPage />} />

        {/* Legacy depth URLs → consolidated IA */}
        <Route path="solutions" element={<RedirectSolutionsToExpertise />} />
        <Route path="measurement" element={<RedirectMeasurementToExpertise />} />
        <Route path="technology" element={<RedirectMeasurementToExpertise />} />
        <Route path="partners" element={<Navigate to="/expertise?pillar=oem#help-with" replace />} />
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
  );
}
