import fs from "fs";
import path from "path";

// 1. Remove Expedition routes from App.tsx
let appContent = fs.readFileSync("src/App.tsx", "utf-8");
appContent = appContent.replace(/const ExpeditionPage = lazy[^;]+;/g, "");
appContent = appContent.replace(/<Route path="expedition" element={<ExpeditionPage \/>} \/>\n/g, "");
appContent = appContent.replace(/<Route path="about" element={<Navigate to="\/expedition" replace \/>} \/>/g, `<Route path="about" element={<Navigate to="/" replace />} />`);
appContent = appContent.replace(/<Route path="company" element={<Navigate to="\/expedition" replace \/>} \/>/g, `<Route path="company" element={<Navigate to="/" replace />} />`);
appContent = appContent.replace(/<Route path="how-we-work" element={<Navigate to="\/expedition" replace \/>} \/>/g, `<Route path="how-we-work" element={<Navigate to="/" replace />} />`);
appContent = appContent.replace(/<Route path="resources" element={<Navigate to="\/expedition" replace \/>} \/>/g, `<Route path="resources" element={<Navigate to="/" replace />} />`);
appContent = appContent.replace(/<Route path="resources\/\*" element={<Navigate to="\/expedition" replace \/>} \/>/g, `<Route path="resources/*" element={<Navigate to="/" replace />} />`);

// Add RouteDetailPage route
appContent = appContent.replace(
  'const CaseDetailPage = lazy',
  'const RouteDetailPage = lazy(() => import("./pages/RouteDetailPage").then((m) => ({ default: m.RouteDetailPage })));\nconst CaseDetailPage = lazy'
);
appContent = appContent.replace(
  '<Route path="cases/:slug" element={<CaseDetailPage />} />',
  '<Route path="cases/:slug" element={<CaseDetailPage />} />\n            <Route path="route/:slug" element={<RouteDetailPage />} />'
);

fs.writeFileSync("src/App.tsx", appContent);

// 2. Create src/components/AboutUsSection.tsx
const aboutUsCode = `import { COMPANY_CONTENT } from "../data/innerPagesData";

export function AboutUsSection() {
  const { camps, blocks } = COMPANY_CONTENT.aboutExpedition;
  
  return (
    <section className="py-24 px-[var(--site-pad)] bg-white dark:bg-[#06090e] border-t border-black/5 dark:border-white/5">
      <div className="page-container">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight max-w-2xl mb-16">
          {COMPANY_CONTENT.aboutExpedition.hero.title}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div className="text-xl md:text-2xl font-medium leading-relaxed max-w-xl text-black/80 dark:text-white/80">
            {COMPANY_CONTENT.aboutExpedition.hero.text}
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {camps.map(camp => (
              <div key={camp.id} className="pt-4 border-t border-black/10 dark:border-white/10">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)] mb-2">{camp.altitude}</p>
                <h3 className="text-lg font-bold mb-2 leading-tight">{camp.title}</h3>
                <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">{camp.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {blocks.map(block => (
            <div key={block.id} className="bg-black/5 dark:bg-white/5 p-8 rounded-2xl">
              <h4 className="text-xl font-bold mb-4">{block.title}</h4>
              <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">{block.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
fs.writeFileSync("src/components/AboutUsSection.tsx", aboutUsCode);

// 3. Create src/components/solutions/RoutesPreviewSection.tsx
const previewCode = `import { Link } from "react-router-dom";
import { AD_FORMATS, OEM_CTV_FORMATS } from "./ProgrammaticFormats";

export function RoutesPreviewSection() {
  // Combine all formats for the preview grid
  const formats = [...AD_FORMATS, ...OEM_CTV_FORMATS];
  
  return (
    <section id="routes" className="py-24 px-[var(--site-pad)] bg-gray-50 dark:bg-[#0a0f17]">
      <div className="page-container">
        <div className="mb-16">
          <p className="section-label mb-4">Routes & Formats</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Channels we trade on</h2>
          <p className="mt-4 text-xl text-black/60 dark:text-white/60 max-w-2xl">
            Select a route to view interactive channel visualisations, metrics, and proofs.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formats.map(format => (
            <Link 
              key={format.id} 
              to={\`/route/\${format.id}\`}
              className="group relative flex flex-col bg-white dark:bg-black p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:border-[var(--theme-accent)] transition-colors overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-accent)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--theme-accent)]/20 transition-colors"></div>
              
              <h3 className="text-2xl font-bold mb-2 relative z-10">{format.label}</h3>
              <p className="text-sm font-semibold text-[var(--theme-accent)] uppercase tracking-wide mb-4 relative z-10">{format.tagline}</p>
              
              <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed mb-8 relative z-10 line-clamp-3">
                {format.description}
              </p>
              
              <div className="mt-auto relative z-10 flex items-center text-sm font-bold text-black/50 dark:text-white/50 group-hover:text-[var(--theme-accent)] transition-colors">
                View Channel Experience
                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
fs.writeFileSync("src/components/solutions/RoutesPreviewSection.tsx", previewCode);

// 4. Update HomePage.tsx
let homeContent = fs.readFileSync("src/pages/HomePage.tsx", "utf-8");
homeContent = homeContent.replace(
  /const ProgrammaticScrollSection = lazy[^;]+;/g, 
  'import { RoutesPreviewSection } from "../components/solutions/RoutesPreviewSection";\nimport { AboutUsSection } from "../components/AboutUsSection";'
);
homeContent = homeContent.replace(/const RoutesLaneSwitcher = lazy[^;]+;/g, "");

// Remove useRoutesLane logic
homeContent = homeContent.replace(/import { useRoutesLane } from "\.\.\/hooks\/useRoutesLane";\n/, "");
homeContent = homeContent.replace(/const { mode, lane, setLane, formats, headerLabel, headerTitle, headerDescription } = useRoutesLane\(\);\n/, "");

// Replace the routes LazySection
const scrollSectionRegex = /<LazySection id="routes"[^>]*>[\s\S]*?<\/LazySection>/;
homeContent = homeContent.replace(scrollSectionRegex, `<RoutesPreviewSection />`);

// Add AboutUsSection before HomePilotCta
homeContent = homeContent.replace(
  /<LazySection id="pilot"/,
  `<AboutUsSection />\n        <LazySection id="pilot"`
);

fs.writeFileSync("src/pages/HomePage.tsx", homeContent);

console.log("Migration scripts generated");
