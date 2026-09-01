import fs from "fs";

let md = fs.readFileSync("docs/UPRAISER-MASTER.md", "utf-8");

const newSection = `
### Sept 2026 Architecture Update

We completely removed the \`/expedition\` separate page to vastly improve WebGL performance and UX on the site.
- **Home (The Agency)**: Still retains the heavy \`HeroAtmosphere\` (Everest 3D) at the top. The inline heavy \`ProgrammaticScrollSection\` was replaced with a lightweight CSS-only \`ChannelsCtaSection\` (featuring sleek glassmorphic device UI cards in CSS).
- **The Expedition / About Us**: Moved directly onto the homepage right before the final CTA.
- **The Channels (\`/channels\`)**: The heavy \`ProgrammaticScrollSection\` (with Phone3D, Tablet3D, Tv3D) was offloaded to a dedicated page to prevent WebGL context crashing on initial load. This page is accessed via the CTA on the homepage.
- **Header Navigation**: Contains only "The Agency" (Home) and "Creative Studio" (\`/craft\`). "The Channels" is hidden from the header to drive user flow through the homepage storytelling.
`;

md = md.replace("### Where we left off (28 Aug 2026 evening)", newSection + "\n### Where we left off (28 Aug 2026 evening)");

fs.writeFileSync("docs/UPRAISER-MASTER.md", md);
