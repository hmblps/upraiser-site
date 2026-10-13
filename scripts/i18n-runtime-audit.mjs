#!/usr/bin/env node
/**
 * Runtime i18n audit — loads the real site in headless Chrome for every language and
 * lists visible strings (text nodes + aria-label/title/placeholder/alt) that are
 * still identical to the English render. Catches strings no static scan can
 * (data files, ternaries, template literals).
 *
 *   npm run dev            # terminal 1
 *   npm run i18n:runtime   # terminal 2   (optional: BASE=http://localhost:5173 LANGS=de,ja)
 *
 * Needs `puppeteer-core` (npm i -D puppeteer-core) and Google Chrome installed.
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const DICT = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/locales/strings.json"), "utf8"));
const BASE = process.env.BASE || "http://localhost:5173";
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const LANGS = (process.env.LANGS || "en,zh,ja,ko,es,de,fr").split(",");
const ROUTES = (process.env.ROUTES ||
  "/?theme=dark,/?theme=light,/contact?theme=dark,/contact/sent,/craft,/privacy,/terms,/does-not-exist,/channels?theme=dark,/cases/fanatics?theme=dark").split(",");

const KEEP = /^(UPRAISER|Lenovo|Apple|Adjust|AppsFlyer|ROAS|CPA|PAI|OEM|GEOs?|FinTech|KYC|MMP|Heroic|eCPM|ARPU|KPI|LTV|CAC|Q[1-4]|CTV|IVT|SDK|API|GDPR|ISO 27001|EDAA|iOS|Android|TikTok|Meta|Google|Unity|AppLovin|Mintegral|Fanatics|Fiverr|Shopee|Azar|Vantage|Snoop|Autodoc|Banco Azteca|Block Blast!?)$/i;
const NOISE = /^([\d\s.,%+\-–—×x/$€£·:|()#@~*\[\]<>_=&'"“”’…→←↑↓•©]+|[^\p{L}]*|.*@.*\.\w+|https?:\/\/\S+|\S+\.(co\.uk|com))$/u;

const collect = () => {
  const out = new Set();
  const add = (s) => { s = (s || "").replace(/\s+/g, " ").trim(); if (s) out.add(s); };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const p = n.parentElement;
    if (!p || /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(p.tagName)) continue;
    add(n.nodeValue);
  }
  document.querySelectorAll("[aria-label],[title],[placeholder],[alt]").forEach((e) => {
    ["aria-label", "title", "placeholder", "alt"].forEach((a) => e.hasAttribute(a) && add(e.getAttribute(a)));
  });
  return [...out];
};

const crawl = async (browser, lang, route) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument((l) => { localStorage.setItem("i18nextLng", l); }, lang);
  const seen = new Set();
  try {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 45000 });
    await new Promise((r) => setTimeout(r, 3500));
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= total + 900; y += 450) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await new Promise((r) => setTimeout(r, 350));
      (await page.evaluate(collect)).forEach((s) => seen.add(s));
    }
  } catch (e) { console.error(`  ! ${lang} ${route}: ${e.message}`); }
  await page.close();
  return seen;
};

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"],
});

const baseline = {};
for (const r of ROUTES) baseline[r] = await crawl(browser, "en", r);
let issues = 0;
const missingAll = new Set();
for (const lang of LANGS.filter((l) => l !== "en")) {
  console.log(`\n=== ${lang} ===`);
  for (const r of ROUTES) {
    const got = await crawl(browser, lang, r);
    const bad = [...got].filter((s) => baseline[r].has(s) && /\p{L}{3,}/u.test(s) && !NOISE.test(s) && !KEEP.test(s) && DICT[s]?.[lang] === undefined);
    console.log(`${r}  →  ${bad.length} untranslated`);
    bad.forEach((s) => console.log(`    ${s.slice(0, 110)}`));
    issues += bad.length;
    bad.forEach((s) => missingAll.add(s));
  }
}
await browser.close();
const OUT = process.env.OUT || path.join(process.cwd(), "scripts/.i18n-missing.json");
fs.writeFileSync(OUT, JSON.stringify([...missingAll].sort(), null, 2));
console.log(`\nUntranslated English strings written to ${OUT} (${missingAll.size})`);
console.log(issues ? `\n✗ ${issues} string(s) still English` : "\n✓ everything translated");
process.exit(issues ? 1 : 0);
