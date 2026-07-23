import { Routes, Route } from "react-router-dom";
import { SiteLayout } from "./layouts/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { SolutionsPage } from "./pages/SolutionsPage";
import { TechnologyPage } from "./pages/TechnologyPage";
import { PartnersPage } from "./pages/PartnersPage";
import { CasesPage } from "./pages/CasesPage";
import { CaseDetailPage } from "./pages/CaseDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="solutions" element={<SolutionsPage />} />
        <Route path="technology" element={<TechnologyPage />} />
        <Route path="partners" element={<PartnersPage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="cases/:slug" element={<CaseDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
