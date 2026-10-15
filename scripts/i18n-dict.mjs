#!/usr/bin/env node
/**
 * Build / refresh src/locales/strings.json — the English-text → translations dictionary
 * used by src/lib/domTranslate.ts.
 *
 *   npm run i18n:dict                 seed from existing locale JSONs (safe to re-run; never overwrites)
 *   npm run i18n:dict -- merge a.json b.json …
 *                                     merge translator output. Each file is
 *                                     { "<lang>": { "English text": "translation" } }
 *
 * Existing manual edits in strings.json always win over the seed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOCALES = ["pt", "es", "de", "fr", "zh", "ja", "ko"];
const out = path.join(root, "src/locales/strings.json");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const dict = fs.existsSync(out) ? read(out) : {};

const flatten = (o, p = "", acc = {}) => {
  if (typeof o === "string") acc[p] = o;
  else if (Array.isArray(o)) o.forEach((v, i) => flatten(v, `${p}[${i}]`, acc));
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) flatten(v, p ? `${p}.${k}` : k, acc);
  return acc;
};

const [cmd, ...files] = process.argv.slice(2);
let added = 0;
const put = (en, lang, tr, overwrite = false) => {
  const key = en.replace(/\s+/g, " ").trim();
  if (!key || !tr || !tr.trim()) return;
  dict[key] ??= {};
  if (overwrite || dict[key][lang] === undefined) { dict[key][lang] = tr.trim(); added++; }
};

if (cmd === "merge") {
  for (const f of files) {
    const data = read(path.resolve(f));
    for (const [lang, map] of Object.entries(data)) {
      if (!LOCALES.includes(lang)) { console.warn(`skip unknown lang ${lang} in ${f}`); continue; }
      for (const [en, tr] of Object.entries(map)) put(en, lang, tr, true);
    }
  }
} else {
  const en = flatten(read(path.join(root, "src/locales/en.json")));
  for (const lang of LOCALES) {
    const loc = flatten(read(path.join(root, `src/locales/${lang}.json`)));
    for (const [k, v] of Object.entries(en)) {
      if (/\{\{/.test(v) || !/\p{L}{2,}/u.test(v)) continue;
      if (loc[k] && loc[k] !== v) put(v, lang, loc[k]);
    }
  }
}

const sorted = Object.fromEntries(Object.entries(dict).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(out, JSON.stringify(sorted, null, 2) + "\n");
console.log(`strings.json: ${Object.keys(sorted).length} entries (+${added} translations written)`);
