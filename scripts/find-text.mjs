#!/usr/bin/env node
/**
 * Find where a piece of site text lives — instead of hunting containers.
 *
 *   npm run text -- "Map the Funnel"
 *
 * Prints every source line containing the phrase (case-insensitive), the
 * locale JSON keys holding it, and its row in src/locales/strings.json.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const q = process.argv.slice(2).join(" ").trim();
if (!q) { console.log('usage: npm run text -- "phrase to find"'); process.exit(1); }
const needle = q.toLowerCase();

const walk = (d, acc = []) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p, acc);
    else if (/\.(tsx?|json|css)$/.test(f.name)) acc.push(p);
  }
  return acc;
};

console.log(`\nSearching "${q}"\n`);
let hits = 0;
for (const file of walk(path.join(root, "src"))) {
  if (file.endsWith("strings.json")) continue;
  fs.readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    if (line.toLowerCase().includes(needle)) {
      hits++;
      console.log(`  ${path.relative(root, file)}:${i + 1}  ${line.trim().slice(0, 120)}`);
    }
  });
}
if (!hits) console.log("  (no source matches — text may be built from several pieces)");

const dict = JSON.parse(fs.readFileSync(path.join(root, "src/locales/strings.json"), "utf8"));
const rows = Object.entries(dict).filter(([k]) => k.toLowerCase().includes(needle));
console.log(`\nDictionary rows (src/locales/strings.json): ${rows.length}`);
for (const [k, v] of rows.slice(0, 10)) {
  const have = Object.keys(v).sort().join(",");
  console.log(`  "${k.slice(0, 80)}"  →  ${have || "no translations"}`);
}
console.log();
