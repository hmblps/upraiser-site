#!/usr/bin/env node
/**
 * i18n audit — one command to answer "is every visible string translated?"
 *
 *   npm run i18n:audit
 *
 * Checks:
 *   1. Hardcoded UI text in .tsx (JSX text + text-like attributes) not going through t()
 *   2. t("key") calls whose key is missing from en.json
 *   3. Keys present in en.json but missing in other locales
 *   4. Locale values identical to English (likely untranslated) — allowlist below
 *   5. Cyrillic leaking into any locale value
 * Informational: the dictionary layer (src/lib/domTranslate.ts) translates plain English in
 * components/data, so [1]–[4] are hints. The source of truth is `npm run i18n:runtime`.
 * Exit code 1 only for Cyrillic in locale values.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "src");
const LOCALES = ["en", "zh", "ja", "ko", "es", "de", "fr"];

/** Strings that stay identical in every language (brands, acronyms, units). */
const KEEP = /^(UPRAISER|Lenovo|Apple|Adjust|AppsFlyer|ROAS|CPA|PAI|OEM|GEOs?|FinTech|KYC|MMP|Heroic|eCPM|ARPU|KPI|LTV|CAC|Q[1-4]|CTV|LTV \/ CAC|Basecamp London|United Kingdom|Q3 Run Rate|[\d\s.,%+\-–—×x/$€£·:|()]+)$/i;
const ATTRS = new Set(["placeholder", "title", "alt", "aria-label", "label", "aria-description"]);

const flatten = (o, p = "", out = {}) => {
  for (const [k, v] of Object.entries(o)) {
    const key = p ? `${p}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
};

const walk = (dir, acc = []) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p, acc);
    else if (/\.tsx$/.test(f.name)) acc.push(p);
  }
  return acc;
};

const locales = Object.fromEntries(
  LOCALES.map((l) => [l, flatten(JSON.parse(fs.readFileSync(path.join(SRC, "locales", `${l}.json`), "utf8")))]),
);
const en = locales.en;
let problems = 0;
const rel = (p) => path.relative(root, p);

// ---- 1 & 2: scan source
const hardcoded = [];
const usedKeys = new Map();
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = (n) => {
    if (ts.isJsxText(n)) {
      const s = n.getText().replace(/\s+/g, " ").trim();
      if (/[A-Za-zА-Яа-я]{2,}/.test(s) && !KEEP.test(s)) {
        const { line } = sf.getLineAndCharacterOfPosition(n.getStart());
        hardcoded.push([rel(file), line + 1, s]);
      }
    } else if (ts.isJsxAttribute(n) && ATTRS.has(n.name.getText()) && n.initializer && ts.isStringLiteral(n.initializer)) {
      const s = n.initializer.text.trim();
      if (/[A-Za-z]{2,}/.test(s) && !KEEP.test(s)) {
        const { line } = sf.getLineAndCharacterOfPosition(n.getStart());
        hardcoded.push([rel(file), line + 1, `${n.name.getText()}="${s}"`]);
      }
    } else if (ts.isCallExpression(n) && n.expression.getText() === "t" && n.arguments[0] && ts.isStringLiteralLike(n.arguments[0])) {
      const k = n.arguments[0].text;
      if (!usedKeys.has(k)) usedKeys.set(k, [rel(file), sf.getLineAndCharacterOfPosition(n.getStart()).line + 1]);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}

console.log(`\n[1] Hardcoded UI text (${hardcoded.length})`);
for (const [f, l, s] of hardcoded) console.log(`  ${f}:${l}  ${s.slice(0, 90)}`);


const hasKey = (k) => k in en || Object.keys(en).some((e) => e.startsWith(`${k}_`) || e === k);
const missingInEn = [...usedKeys].filter(([k]) => !hasKey(k) && !k.includes("${"));
console.log(`\n[2] t() keys missing from en.json (${missingInEn.length})`);
for (const [k, [f, l]] of missingInEn) console.log(`  ${k}  (${f}:${l})`);


// ---- 3: parity
console.log(`\n[3] Keys missing per locale`);
for (const l of LOCALES.slice(1)) {
  const miss = Object.keys(en).filter((k) => !(k in locales[l]));
  console.log(`  ${l}: ${miss.length}${miss.length ? "  e.g. " + miss.slice(0, 5).join(", ") : ""}`);
}

// ---- 4: identical to en
console.log(`\n[4] Values identical to English (review — may be intentional)`);
for (const l of LOCALES.slice(1)) {
  const same = Object.entries(locales[l]).filter(([k, v]) => typeof v === "string" && v === en[k] && /[A-Za-z]{3,}/.test(v) && !KEEP.test(v));
  console.log(`  ${l}: ${same.length}${same.length ? "  e.g. " + same.slice(0, 4).map(([k]) => k).join(", ") : ""}`);
}

// ---- 5: cyrillic
console.log(`\n[5] Cyrillic in locale values`);
for (const l of LOCALES) {
  const cyr = Object.entries(locales[l]).filter(([, v]) => typeof v === "string" && /[А-Яа-яЁё]/.test(v));
  console.log(`  ${l}: ${cyr.length}${cyr.length ? "  e.g. " + cyr.slice(0, 3).map(([k]) => k).join(", ") : ""}`);
  problems += cyr.length;
}

console.log(problems ? `\n✗ ${problems} issue(s)` : "\n✓ clean");
process.exit(problems ? 1 : 0);
