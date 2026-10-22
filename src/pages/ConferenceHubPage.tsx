import { useState, useCallback, useEffect, useMemo, Suspense, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { NightStars } from "../components/hero-terrain/NightStars";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SiteGrain } from "../components/SiteGrain";
import {
  HUB_LANGS,
  HUB_LANG_NAMES,
  HUB_DICT,
  HUB_RTL,
  HUB_PLAIN_SCRIPT,
  type HubLang,
} from "./conferenceHubI18n";

const MEDIA_DECK_URL = "/Upraiser_Traffic_Infrastructure.pdf";
const SPRING_TACTILE = { type: "spring", bounce: 0.15, duration: 0.4 } as const;

/** Match device language against supported languages. */
function detectDeviceLang(): HubLang {
  if (typeof navigator === "undefined") return "en";
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || "en"];
  for (const raw of langs) {
    if (!raw) continue;
    const norm = raw.toLowerCase().trim();
    const primary = norm.split(/[-_]/)[0];
    if (primary === "ru" || primary === "be" || primary === "kk") return "ru";
    if (primary === "uk") return "uk";
    if (primary === "de") return "de";
    if (primary === "es") return "es";
    if (primary === "fr") return "fr";
    if (primary === "pt") return "pt";
    if (primary === "tr") return "tr";
    if (primary === "ar") return "ar";
    if (primary === "he") return "he";
    if (primary === "hi") return "hi";
    if (primary === "zh") return "zh";
    if (primary === "ja") return "ja";
    if (primary === "ko") return "ko";
    if (primary === "en") return "en";
  }
  return "en";
}

const PLAIN_SCRIPT_CSS = `
[data-hub-plain="true"] h1,
[data-hub-plain="true"] h2,
[data-hub-plain="true"] h3,
[data-hub-plain="true"] p,
[data-hub-plain="true"] label,
[data-hub-plain="true"] button,
[data-hub-plain="true"] span:not([data-latin]) {
  text-transform: none !important;
  letter-spacing: 0 !important;
}
`;

export function ConferenceHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [lang, setLang] = useState<HubLang>(() => {
    const param = searchParams.get("lang")?.toLowerCase().trim();
    if (param && (HUB_LANGS as readonly string[]).includes(param)) {
      return param as HubLang;
    }
    return detectDeviceLang();
  });

  const handleSetLang = useCallback(
    (next: HubLang) => {
      setLang(next);
      setSearchParams(
        (prev) => {
          const updated = new URLSearchParams(prev);
          updated.set("lang", next);
          return updated;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const t = useMemo(() => HUB_DICT[lang] || HUB_DICT.en, [lang]);
  const isRtl = HUB_RTL.has(lang);
  const isPlain = HUB_PLAIN_SCRIPT.has(lang);
  const reduced = useReducedMotion();

  // Keep meta robots noindex
  useEffect(() => {
    let tag = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "robots";
      document.head.appendChild(tag);
    }
    const prevContent = tag.content;
    tag.content = "noindex, nofollow, noarchive";
    return () => {
      if (tag) tag.content = prevContent;
    };
  }, []);

  // Form state — streamlined to 2 inputs per user specification
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !contact.trim()) return;

      setStatus("submitting");
      setErrorMessage("");

      const isEmail = contact.includes("@") && contact.includes(".") && !contact.trim().startsWith("@");
      const payload = {
        name: name.trim(),
        email: isEmail ? contact.trim() : "conference-lead@upraiser.co.uk",
        appId: "Conference Lead",
        geos: "Tier-1 / Conference",
        companyType: "Direct Operator Contact",
        companySize: "On-Site Desk",
        monthlyBudget: "Custom Route & Benchmark Split",
        notes: `[CONFERENCE HUB · DISPATCH TO BASECAMP]\nName/Callsign: ${name.trim()}\nHandle / Email: ${contact.trim()}\nPreferred Language: ${lang.toUpperCase()} (${HUB_LANG_NAMES[lang]})`,
      };

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
        if (res.ok && data.ok) {
          setStatus("success");
          return;
        }

        // Web3Forms Fallback
        const accessKey = "260b2ece-07ce-4a41-8136-88bb30545e23";
        const fd = new FormData();
        fd.append("access_key", accessKey);
        fd.append("subject", `Conference Dispatch to Basecamp: ${name.trim()}`);
        fd.append("from_name", name.trim());
        fd.append("email", isEmail ? contact.trim() : "conference-lead@upraiser.co.uk");
        fd.append("notes", payload.notes);

        const fbRes = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: fd,
        });

        if (fbRes.ok) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(t.errSubmit);
        }
      } catch {
        setStatus("error");
        setErrorMessage(t.errNetwork);
      }
    },
    [name, contact, lang, t]
  );

  return (
    <div
      lang={lang}
      dir={isRtl ? "rtl" : "ltr"}
      data-hub-plain={isPlain ? "true" : "false"}
      className="min-h-[100dvh] bg-gradient-to-b from-[#120407] via-[#090204] to-[#050102] text-white flex flex-col items-center justify-between px-5 sm:px-6 py-8 sm:py-10 relative overflow-hidden font-sans selection:bg-[#e63558] selection:text-white"
    >
      <style>{PLAIN_SCRIPT_CSS}</style>

      {/* Three.js Starfield celestial drift */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-35" aria-hidden="true">
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 2]}
            frameloop={reduced ? "never" : "always"}
            camera={{ position: [0, 0, 0], fov: 60 }}
            gl={{ alpha: true, powerPreference: "low-power", antialias: true }}
            style={{ pointerEvents: "none", position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <NightStars />
          </Canvas>
        </Suspense>
      </div>

      {/* Ambient background glow — soft wine atmospheric haze */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#e63558]/10 blur-[120px] rounded-full pointer-events-none"
        aria-hidden
      />
      <SiteGrain />

      {/* Main Column (max 380px) */}
      <div className="w-full max-w-[380px] flex flex-col items-center z-10 space-y-6 sm:space-y-7">
        
        {/* Top Minimal Bar: Language Switcher */}
        <div className="w-full flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 group outline-none focus-visible:ring-1 focus-visible:ring-[#e63558] rounded-lg p-0.5"
            title="UPRAISER"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
              <img
                src="/upraiser-logo.png"
                alt="UPRAISER"
                className="w-5 h-5 object-contain"
                width={20}
                height={20}
              />
            </div>
            <span data-latin className="font-display font-bold text-xs tracking-widest text-white/80 uppercase">
              UPRAISER
            </span>
          </Link>

          <label className="relative inline-flex items-center">
            <span className="sr-only">{t.langLabel}</span>
            <select
              value={lang}
              onChange={(e) => handleSetLang(e.target.value as HubLang)}
              aria-label={t.langLabel}
              className="appearance-none min-h-[44px] ps-2 pe-6 py-1 bg-transparent hover:bg-white/[0.04] text-xs text-white/50 hover:text-white font-mono cursor-pointer focus:outline-none rounded-lg transition-colors"
            >
              {HUB_LANGS.map((code) => (
                <option key={code} value={code} lang={code} className="bg-[#090204] text-white">
                  {HUB_LANG_NAMES[code]}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute end-1.5 w-3 h-3 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </label>
        </div>

        {/* 1. Primary vCard Action */}
        <motion.a
          href="/contact.vcf"
          download="oleksii-ostroukhov.vcf"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          transition={SPRING_TACTILE}
          className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-[#e63558] hover:bg-[#ff003b] text-white font-medium text-sm text-center shadow-lg shadow-[#e63558]/25 transition-all flex items-center justify-center space-x-2 select-none cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{t.saveContactBtn}</span>
        </motion.a>

        {/* 2. Direct Team Roster (Airy & Clean — Cardless) */}
        <div className="w-full space-y-3 pt-1">
          {/* Oleksii */}
          <div className="flex items-center justify-between py-2.5 px-1 border-b border-white/[0.06]">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="relative shrink-0">
                <img
                  src="/team/oleksii.webp"
                  alt="Oleksii Ostroukhov"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                  loading="eager"
                />
                <span className="absolute bottom-0 end-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#090204] rounded-full" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div dir="ltr" className="text-sm font-medium text-white truncate">Oleksii Ostroukhov</div>
                <div className="text-[10px] sm:text-xs text-[#e63558] font-mono whitespace-nowrap overflow-hidden text-ellipsis">{t.founderRole}</div>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0 ms-2">
              <a
                href="https://t.me/homeboylebz"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] min-w-[34px] px-2 py-1.5 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xs font-mono"
                title="Telegram @homeboylebz"
              >
                TG
              </a>
              <a
                href="https://wa.me/40724787390"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] min-w-[34px] px-2 py-1.5 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xs font-mono"
                title="WhatsApp"
              >
                WA
              </a>
              <a
                href="mailto:alex@upraiser.co.uk"
                className="min-h-[44px] min-w-[34px] px-2 py-1.5 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xs font-mono"
                title="Email alex@upraiser.co.uk"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Vladyslav */}
          <div className="flex items-center justify-between py-2.5 px-1 border-b border-white/[0.06]">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="relative shrink-0">
                <img
                  src="/team/vladyslav.webp"
                  alt="Vladyslav Samoilenko"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                  loading="eager"
                />
                <span className="absolute bottom-0 end-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#090204] rounded-full" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div dir="ltr" className="text-sm font-medium text-white truncate">Vladyslav Samoilenko</div>
                <div className="text-[10px] sm:text-xs text-white/40 font-mono whitespace-nowrap overflow-hidden text-ellipsis">{t.opsRole}</div>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0 ms-2">
              <a
                href="https://t.me/Vladussoboi108"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] min-w-[34px] px-2 py-1.5 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xs font-mono"
                title="Telegram @Vladussoboi108"
              >
                TG
              </a>
              <a
                href="mailto:ceo@upraiser.co.uk"
                className="min-h-[44px] min-w-[34px] px-2 py-1.5 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xs font-mono"
                title="Email ceo@upraiser.co.uk"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* 3. Ecosystem & Links (Clean minimal list) */}
        <div className="w-full space-y-2 pt-1">
          <div className="text-[11px] font-mono tracking-widest text-white/35 uppercase px-1">
            {t.ecosystemHeader}
          </div>

          <a
            href={MEDIA_DECK_URL}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between min-h-[48px] py-3 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors group"
          >
            <span className="text-sm text-white/85 group-hover:text-white">{t.mediaDeckTitle}</span>
            <span className="text-xs text-white/40 font-mono">2.6 MB ↓</span>
          </a>

          <Link
            to="/channels?utm_source=qr_wallet"
            className="flex items-center justify-between min-h-[48px] py-3 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors group"
          >
            <span className="text-sm text-white/85 group-hover:text-white">{t.routesTitle}</span>
            <span className="text-xs text-[#e63558] font-mono group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>

          <a
            href="https://www.linkedin.com/company/upraiser/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between min-h-[48px] py-3 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors group"
          >
            <span className="text-sm text-white/85 group-hover:text-white">{t.linkedinTitle}</span>
            <span className="text-xs text-white/40 font-mono">↗</span>
          </a>

          <a
            href="https://upraiser.co.uk"
            className="flex items-center justify-between min-h-[48px] py-3 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors group"
          >
            <span className="text-sm text-white/85 group-hover:text-white">{t.officialPlatform}</span>
            <span dir="ltr" className="text-xs text-white/40 font-mono">upraiser.co.uk ↗</span>
          </a>
        </div>

        {/* 5. Minimal Lead Capture Form */}
        <div className="w-full pt-2 space-y-3">
          <div className="text-start px-1">
            <h2 className="text-sm font-medium text-white">{t.formHeading}</h2>
            <p className="text-xs text-white/40 mt-1 leading-relaxed">{t.formSub}</p>
          </div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={SPRING_TACTILE}
                className="py-4 px-3 text-center text-xs font-mono text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
              >
                {t.successTitle}
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <input
                  type="text"
                  required
                  placeholder={t.fieldCallsign}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  dir="auto"
                  className="w-full min-h-[46px] bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#e63558] transition-colors"
                />
                <input
                  type="text"
                  required
                  dir="ltr"
                  placeholder={t.fieldContact}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full min-h-[46px] bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#e63558] transition-colors"
                />

                {errorMessage && (
                  <p className="text-xs text-[#ff003b] font-mono px-1">{errorMessage}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === "submitting"}
                  whileTap={{ scale: 0.98 }}
                  transition={SPRING_TACTILE}
                  className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors flex items-center justify-center space-x-2 border border-white/10 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {status === "submitting" ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t.btnSubmit}</span>
                      <span aria-hidden className="inline-block rtl:-scale-x-100 font-bold">→</span>
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full text-center pt-10 pb-2 text-[11px] font-mono text-white/20 z-10">
        UPRAISER Agency LLP · London · Since 2017
      </footer>
    </div>
  );
}

export default ConferenceHubPage;
