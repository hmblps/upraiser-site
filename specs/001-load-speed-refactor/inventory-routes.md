# Inventory: Live routes vs page modules

**Source of truth**: `src/App.tsx`

| Module | Status |
|--------|--------|
| `HomePage.tsx` | live (`/`) |
| `SolutionsPage.tsx` | live (`/solutions`) |
| `StudioPage.tsx` | live (`/studio`) |
| `CasesPage.tsx` / `CaseDetailPage.tsx` | live (`/cases`, `/cases/:slug`) |
| `ClientsPage.tsx` | live (`/clients`) |
| `CompanyPage.tsx` | live (`/company`) |
| `ContactPage.tsx` | live (`/contact`) |
| `LegalPages.tsx` | live (`/privacy`, `/terms`) |
| `NotFoundPage.tsx` | live (`*`) |
| `LegacyRedirects.tsx` | redirect helpers only |
| `AboutPage.tsx` | **dead** — not in App routes (`/about` → `/company`) |
| `ExpertisePage.tsx` | **dead** — `/expertise` redirects to Solutions |

Legacy redirects kept: `/clarity`, `/expertise`, `/measurement`, `/technology`, `/partners`, `/about`, `/how-we-work`, `/resources`.
