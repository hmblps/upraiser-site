import fs from "fs";

let home = fs.readFileSync("src/pages/HomePage.tsx", "utf-8");

// Remove LazySection wrapping for components on HomePage
home = home.replace(
  /<LazySection minHeight="8rem" gate="hero">\s*<PartnersCarousel \/>\s*<\/LazySection>/,
  '<PartnersCarousel />'
);
home = home.replace(
  /<LazySection id="audience" minHeight="70dvh" warm="mid" gate="hero">\s*<Audience \/>\s*<\/LazySection>/,
  '<div id="audience"><Audience /></div>'
);
home = home.replace(
  /<LazySection id="process" minHeight="52dvh" warm="mid" gate="hero">\s*<Process \/>\s*<\/LazySection>/,
  '<div id="process"><Process /></div>'
);
home = home.replace(
  /<LazySection id="cases" minHeight="56dvh" warm="cases">\s*<CaseStudies \/>\s*<\/LazySection>/,
  '<div id="cases"><CaseStudies /></div>'
);
home = home.replace(
  /<LazySection id="promise" minHeight="70dvh" warm="promise" gate="hero">\s*<PromiseSection \/>\s*<\/LazySection>/,
  '<div id="promise"><PromiseSection /></div>'
);
home = home.replace(
  /<LazySection id="pilot" minHeight="28dvh">\s*<HomePilotCta \/>\s*<\/LazySection>/,
  '<div id="pilot"><HomePilotCta /></div>'
);

// We need to wrap them in Suspense since they are still lazy imports in React
home = home.replace(
  'return (',
  'return (\n    <React.Suspense fallback={<div style={{ minHeight: "50vh" }} />}>'
);
home = home.replace(
  '</main>\n      <SectionNav />',
  '</main>\n      <SectionNav />\n    </React.Suspense>'
);
home = `import React from "react";\n` + home;

fs.writeFileSync("src/pages/HomePage.tsx", home);
