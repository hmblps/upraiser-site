/**
 * Regenerates static dotted world maps for Company footprint.
 * Run: node scripts/generate-world-map.mjs
 * Requires: dotted-map (devDependency).
 */
import DottedMap from "dotted-map";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "maps");
mkdirSync(outDir, { recursive: true });

const map = new DottedMap({ height: 100, grid: "diagonal" });

const themes = [
  { name: "dark", backgroundColor: "#0a0a0a", color: "#FFFFFF40" },
  { name: "light", backgroundColor: "#f7f4f0", color: "#00000040" },
];

for (const theme of themes) {
  const svg = map.getSVG({
    radius: 0.22,
    color: theme.color,
    shape: "circle",
    backgroundColor: theme.backgroundColor,
  });
  const path = join(outDir, `world-dots-${theme.name}.svg`);
  writeFileSync(path, svg);
  console.log(`wrote ${path} (${svg.length} bytes)`);
}
