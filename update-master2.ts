import fs from "fs";

let md = fs.readFileSync("docs/UPRAISER-MASTER.md", "utf-8");

const replacement = `
- **Performance & Lazy Loading**: We removed the \`LazySection\` wrappers from the homepage sections (\`Audience\`, \`Process\`, \`CaseStudies\`, \`PromiseSection\`). Since the heavy 3D canvases were moved off the homepage, these sections are now lightweight enough to be mounted immediately using a single top-level \`<React.Suspense>\`. This fixes intersection observer bugs and ensures scroll charts (like the SCALE chart) mount reliably without relying on the \`heroOk\` gate.
`;

// Insert the replacement into the Sept 2026 Architecture Update section
md = md.replace(
  '- **Header Navigation**: Contains only "The Agency" (Home) and "Creative Studio" (`/craft`). "The Channels" is hidden from the header to drive user flow through the homepage storytelling.',
  '- **Header Navigation**: Contains only "The Agency" (Home) and "Creative Studio" (`/craft`). "The Channels" is hidden from the header to drive user flow through the homepage storytelling.' + replacement
);

fs.writeFileSync("docs/UPRAISER-MASTER.md", md);
