import { Routes, Route, Navigate } from "react-router-dom";
import { SiteLayout } from "./layouts/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { SolutionsPage } from "./pages/SolutionsPage";
import { MeasurementPage } from "./pages/MeasurementPage";
import { CasesPage } from "./pages/CasesPage";
import { CaseDetailPage } from "./pages/CaseDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PrivacyPage, TermsPage } from "./pages/LegalPages";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="solutions" element={<SolutionsPage />} />
        <Route path="measurement" element={<MeasurementPage />} />
        <Route path="technology" element={<Navigate to="/measurement" replace />} />
        <Route path="partners" element={<Navigate to="/solutions?pillar=oem#help-with" replace />} />
        <Route path="cases" element={<CasesPage />}>
          <Route path=":slug" element={<CaseDetailPage />} />
        </Route>
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
