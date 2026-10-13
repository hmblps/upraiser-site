/**
 * Text-dictionary translation layer.
 *
 * WHY: most site copy lives in `src/data/*.ts` and inside components as plain
 * English. Instead of hunting each container and wrapping it in `t()`, every
 * visible English string is looked up here by its exact text in
 * `src/locales/strings.json`:
 *
 *   { "Map the Funnel": { "de": "Den Funnel kartieren", "ja": "…", … } }
 *
 * Text nodes and the attributes below are translated in place (and restored on
 * language change). Anything without an entry stays English — `npm run i18n:runtime`
 * lists those. See docs/I18N.md.
 *
 * Opt out for a subtree with `data-no-translate`.
 */
import i18n from "../i18n";
import strings from "../locales/strings.json";

type Dict = Record<string, Partial<Record<string, string>>>;
const dict = strings as Dict;

const ATTRS = ["aria-label", "title", "placeholder", "alt"] as const;
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE"]);
const HAS_LETTERS = /\p{L}{2,}/u;

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/** English source text of a node we have translated. */
const textOrig = new WeakMap<Text, string>();
/** What we last wrote into the node (to ignore our own mutations). */
const textSet = new WeakMap<Text, string>();
const attrOrig = new WeakMap<Element, Map<string, string>>();
const attrSet = new WeakMap<Element, Map<string, string>>();

let lang = "en";
let observer: MutationObserver | null = null;

function lookup(text: string): string | undefined {
  if (lang === "en") return undefined;
  const key = norm(text);
  if (key.length < 2 || !HAS_LETTERS.test(key)) return undefined;
  return dict[key]?.[lang];
}

function skipped(el: Element | null): boolean {
  for (let e = el; e; e = e.parentElement) {
    if (SKIP_TAGS.has(e.tagName.toUpperCase()) || e.hasAttribute("data-no-translate")) return true;
  }
  return false;
}

function applyText(node: Text) {
  const cur = node.data;
  const written = textSet.get(node);
  // Our own write — nothing to do. Anything else is fresh English from React.
  const base = written !== undefined && cur === written ? textOrig.get(node)! : cur;
  if (base === undefined || skipped(node.parentElement)) return;

  const hit = lookup(base);
  const next = hit ? (/^\s*/.exec(base)![0] + hit + /\s*$/.exec(base)![0]) : base;
  if (next === cur) {
    if (written !== undefined && base === cur) { textSet.delete(node); textOrig.delete(node); }
    return;
  }
  if (hit) {
    textOrig.set(node, base);
    textSet.set(node, next);
  } else {
    textSet.delete(node);
    textOrig.delete(node);
  }
  node.data = next;
}

function applyAttrs(el: Element) {
  if (skipped(el)) return;
  for (const a of ATTRS) {
    if (!el.hasAttribute(a)) continue;
    const cur = el.getAttribute(a)!;
    const written = attrSet.get(el)?.get(a);
    const base = written !== undefined && cur === written ? attrOrig.get(el)!.get(a)! : cur;
    const hit = lookup(base);
    const next = hit ?? base;
    if (next === cur) continue;
    if (!attrOrig.has(el)) { attrOrig.set(el, new Map()); attrSet.set(el, new Map()); }
    if (hit) { attrOrig.get(el)!.set(a, base); attrSet.get(el)!.set(a, next); }
    else { attrOrig.get(el)!.delete(a); attrSet.get(el)!.delete(a); }
    el.setAttribute(a, next);
  }
}

function walk(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) { applyText(root as Text); return; }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const el = root as Element;
  if (SKIP_TAGS.has(el.tagName.toUpperCase()) || el.hasAttribute("data-no-translate")) return;
  applyAttrs(el);
  for (let c = el.firstChild; c; c = c.nextSibling) walk(c);
}

function onMutations(list: MutationRecord[]) {
  for (const m of list) {
    if (m.type === "childList") m.addedNodes.forEach(walk);
    else if (m.type === "characterData") applyText(m.target as Text);
    else if (m.type === "attributes") applyAttrs(m.target as Element);
  }
}

function start() {
  if (observer || typeof document === "undefined" || !document.body) return;
  observer = new MutationObserver(onMutations);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...ATTRS],
  });
}

function setLang(next: string) {
  lang = (next || "en").split("-")[0];
  if (typeof document === "undefined" || !document.body) return;
  start();
  // Re-run over the whole tree: translates to the new language or restores English.
  walk(document.body);
}

if (typeof document !== "undefined") {
  const boot = () => setLang(i18n.language);
  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot, { once: true });
  i18n.on("languageChanged", setLang);
}
