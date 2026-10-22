import { useState, useCallback, useEffect, useMemo, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BrandAurora } from "../components/BrandAurora";
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

/** Plain-script CSS to avoid uppercase / letter-spacing breaking complex glyphs. */
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

const LABEL_CLASS = "block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5";
const INPUT_CLASS =
  "w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#e63558] focus:bg-white/[0.07] transition-all";

export function ConferenceHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Language state: ?lang= URL param overrides device detection
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

  // Form state
  const [name, setName] = useState("");
  const [companyRole, setCompanyRole] = useState("");
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
        appId: companyRole.trim() || "Conference Lead",
        geos: "Tier-1 / Conference",
        companyType: "Direct Operator Contact",
        companySize: "On-Site Desk",
        monthlyBudget: "Custom Route & Benchmark Split",
        notes: `[CONFERENCE HUB · DIRECT NOTE TO ALEX]\nName/Callsign: ${name.trim()}\nCompany & Role: ${companyRole.trim() || "Not specified"}\nHandle / Email: ${contact.trim()}\nPreferred Language: ${lang.toUpperCase()} (${HUB_LANG_NAMES[lang]})`,
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
        fd.append("subject", `Conference Note to Alex: ${name.trim()} (${companyRole.trim() || "Direct"})`);
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
    [name, companyRole, contact, lang, t]
  );

  return (
    <main
      lang={lang}
      dir={isRtl ? "rtl" : "ltr"}
      data-hub-plain={isPlain ? "true" : "false"}
      className="relative min-h-[100dvh] w-full overflow-x-hidden text-white flex flex-col items-center justify-between selection:bg-[#e63558] selection:text-white"
      style={{
        background: "linear-gradient(180deg, #0a0204 0%, #120306 45%, #140508 100%)",
      }}
    >
      <style>{PLAIN_SCRIPT_CSS}</style>

      {/* Atmospheric Visuals: BrandAurora + Static Grain */}
      <BrandAurora tone="contact" className="opacity-45 pointer-events-none" />
      <div
        className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[380px] h-[380px] rounded-full blur-[140px] opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(230, 53, 88, 0.28) 0%, rgba(245, 197, 66, 0.12) 50%, transparent 70%)",
        }}
        aria-hidden
      />
      <SiteGrain />

      {/* Centered Compact Mobile Container (max-width 420px) */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] flex flex-col items-center">
        {/* Top Bar: On-site status & Native Language Picker */}
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/50 tracking-wider" dir="ltr">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5c542] animate-pulse" />
            <span data-latin>ON-SITE DESK</span>
          </div>

          {/* Language picker: native <select> triggers the OS picker wheel on iOS/Android */}
          <label className="relative inline-flex items-center">
            <span className="sr-only">{t.langLabel}</span>
            <svg
              className="pointer-events-none absolute start-3 w-4 h-4 text-white/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden
            >
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z" />
            </svg>
            <select
              value={lang}
              onChange={(e) => handleSetLang(e.target.value as HubLang)}
              aria-label={t.langLabel}
              className="appearance-none min-h-[44px] ps-9 pe-9 rounded-lg bg-white/[0.05] border border-white/12 text-sm text-white font-medium cursor-pointer focus:outline-none focus-visible:border-[#e63558] focus-visible:ring-1 focus-visible:ring-[#e63558] transition-colors"
            >
              {HUB_LANGS.map((code) => (
                <option key={code} value={code} lang={code} className="bg-[#120306] text-white">
                  {HUB_LANG_NAMES[code]}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute end-3 w-3.5 h-3.5 text-white/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </label>
        </div>

        {/* ============================================================== */}
        {/* 1. BRAND HEADER & PERSONAL TOUCH                               */}
        {/* ============================================================== */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center text-center"
        >
          {/* Logo Mark */}
          <Link
            to="/"
            className="group flex flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#e63558] rounded-xl p-1"
            title="UPRAISER Platform"
          >
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_24px_rgba(230,53,88,0.25)] group-hover:border-[#e63558]/50 transition-colors">
              <img
                src="/upraiser-logo.png"
                alt="UPRAISER"
                className="w-9 h-9 object-contain"
                width={36}
                height={36}
              />
            </div>
            <span data-latin className="font-display font-extrabold text-lg tracking-tight text-white uppercase">
              UPRAISER
            </span>
          </Link>

          {/* Kicker: #f5c542 warm gold/yellow */}
          <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5c542]/10 border border-[#f5c542]/30 shadow-[0_0_12px_rgba(245,197,66,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5c542] animate-pulse" />
            <span data-latin className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#f5c542] uppercase">
              {t.kicker}
            </span>
          </div>

          {/* Headline & Personal Greeting */}
          <h1 className="mt-3.5 font-display font-black text-2xl sm:text-[26px] tracking-tight text-white">
            {t.headline}
          </h1>
          <p className="mt-1 text-sm sm:text-[15px] font-medium text-white/90">
            &ldquo;{t.greeting}&rdquo;
          </p>
          <p className="mt-2 text-xs text-white/65 font-mono leading-relaxed max-w-[340px]">
            {t.subtext}
          </p>
        </motion.header>

        {/* ============================================================== */}
        {/* 2. PRIMARY CONTACT ACTION: SAVE CONTACT (.VCF)                 */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-5"
        >
          <a
            href="/contact.vcf"
            download="oleksii-ostroukhov.vcf"
            className="group relative flex items-center justify-center gap-2.5 w-full min-h-[52px] px-5 py-3.5 rounded-xl text-[#0a0204] text-center font-display font-black text-sm sm:text-[15px] uppercase tracking-wider shadow-[0_0_28px_rgba(230,53,88,0.45)] hover:shadow-[0_0_42px_rgba(230,53,88,0.7)] hover:scale-[1.015] active:scale-[0.98] transition-all select-none cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #FF043D 0%, #e63558 100%)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <span className="text-base" aria-hidden>💾</span>
            <span>{t.saveContactBtn}</span>
          </a>
          <p className="text-[10px] font-mono text-white/50 text-center mt-1.5">
            {t.saveContactSub}
          </p>
        </motion.div>

        {/* ============================================================== */}
        {/* 3. DIRECT TEAM ROSTER (WITH AVATARS & WARM CUES)               */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
              {t.directChannels}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span data-latin>ONLINE · ON-SITE</span>
            </span>
          </div>

          {/* Card 1: Oleksii Ostroukhov (Founder & Lead · On-Site) */}
          <article className="w-full p-4 rounded-2xl bg-white/[0.035] border border-white/10 backdrop-blur-md shadow-lg flex flex-col gap-3.5 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src="/team/oleksii.webp"
                  alt="Oleksii Ostroukhov"
                  width={52}
                  height={52}
                  className="w-[52px] h-[52px] rounded-full object-cover ring-2 ring-[#e63558]/70 shadow-[0_0_14px_rgba(230,53,88,0.4)]"
                  loading="eager"
                />
                <span className="absolute bottom-0 end-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0a0204]" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <h2 dir="ltr" className="font-display font-bold text-base text-white tracking-tight">
                  Oleksii Ostroukhov
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs font-mono text-[#e63558] font-semibold tracking-wide">
                    {t.founderRole}
                  </p>
                </div>
              </div>
            </div>

            {/* Instant Channels: Telegram + WhatsApp + Direct Email */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://t.me/homeboylebz"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/35 text-xs font-bold font-mono transition-colors active:scale-[0.97]"
              >
                <span className="text-sm" aria-hidden>💬</span>
                <span>@homeboylebz</span>
              </a>
              <a
                href="https://wa.me/40724787390"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/35 text-xs font-bold font-mono transition-colors active:scale-[0.97]"
              >
                <span className="text-sm" aria-hidden>🟢</span>
                <span>WhatsApp</span>
              </a>
            </div>

            <a
              href="mailto:alex@upraiser.co.uk"
              dir="ltr"
              className="flex items-center justify-center gap-2 min-h-[44px] w-full px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/90 border border-white/15 text-xs font-bold font-mono transition-colors active:scale-[0.97]"
            >
              <span className="text-sm" aria-hidden>✉️</span>
              <span>alex@upraiser.co.uk</span>
            </a>
          </article>

          {/* Card 2: Operations Desk (Vladyslav Samoilenko) */}
          <article className="w-full mt-3 p-4 rounded-2xl bg-white/[0.035] border border-white/10 backdrop-blur-md shadow-lg flex flex-col gap-3.5 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src="/team/vladyslav.webp"
                  alt="Vladyslav Samoilenko"
                  width={52}
                  height={52}
                  className="w-[52px] h-[52px] rounded-full object-cover ring-2 ring-[#f5c542]/60 shadow-[0_0_14px_rgba(245,197,66,0.3)]"
                  loading="eager"
                />
                <span className="absolute bottom-0 end-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0a0204]" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <h2 dir="ltr" className="font-display font-bold text-base text-white tracking-tight">
                  Vladyslav Samoilenko
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs font-mono text-[#f5c542] font-semibold tracking-wide">
                    {t.opsRole}
                  </p>
                </div>
              </div>
            </div>

            {/* Instant Channels: Telegram + Desk WhatsApp + Email */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://t.me/Vladussoboi108"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/35 text-xs font-bold font-mono transition-colors active:scale-[0.97]"
              >
                <span className="text-sm" aria-hidden>💬</span>
                <span>@Vladussoboi108</span>
              </a>
              <a
                href="https://wa.me/40724787390?text=Hello%20Vladyslav%20/%20Operations%20Desk"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/35 text-xs font-bold font-mono transition-colors active:scale-[0.97]"
              >
                <span className="text-sm" aria-hidden>🟢</span>
                <span>WhatsApp</span>
              </a>
            </div>

            <a
              href="mailto:ceo@upraiser.co.uk"
              dir="ltr"
              className="flex items-center justify-center gap-2 min-h-[44px] w-full px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/90 border border-white/15 text-xs font-bold font-mono transition-colors active:scale-[0.97]"
            >
              <span className="text-sm" aria-hidden>✉️</span>
              <span>ceo@upraiser.co.uk</span>
            </a>
          </article>
        </motion.section>

        {/* ============================================================== */}
        {/* 4. ECOSYSTEM & PROOF                                           */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6 flex flex-col gap-2.5"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 px-1">
            {t.ecosystemHeader}
          </span>

          {/* 📄 Media Deck 2026 (PDF) */}
          <a
            href={MEDIA_DECK_URL}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between w-full min-h-[56px] px-4 py-3 rounded-xl bg-gradient-to-r from-[#e63558]/[0.10] via-white/[0.03] to-[#f5c542]/[0.10] hover:from-[#e63558]/[0.16] hover:to-[#f5c542]/[0.16] border border-[#e63558]/35 hover:border-[#f5c542]/50 transition-all text-start group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#e63558]/25 to-[#f5c542]/25 text-[#f5c542] border border-[#f5c542]/30 shrink-0">
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M9 13h6M9 17h4" />
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-white group-hover:text-white transition-colors">
                  {t.mediaDeckTitle}
                </span>
                <span className="text-[11px] text-white/60">
                  {t.mediaDeckSub}
                </span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-[#f5c542] group-hover:translate-y-0.5 transition-transform shrink-0 ms-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
            </svg>
          </a>

          {/* ⚡ Explore The Routes (3D Showcase) */}
          <Link
            to="/channels?utm_source=qr_wallet"
            className="flex items-center justify-between w-full min-h-[50px] px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#e63558]/40 transition-colors text-start group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#e63558]/15 text-[#e63558] border border-[#e63558]/30 shrink-0 text-sm">
                ⚡
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-white">
                  {t.routesTitle}
                </span>
                <span className="text-[11px] text-white/55">
                  {t.routesSub}
                </span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-white/40 group-hover:text-white transition-colors shrink-0 ms-2 rtl:-scale-x-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* 💼 LinkedIn Agency Profile */}
          <a
            href="https://www.linkedin.com/company/upraiser/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full min-h-[50px] px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#0A66C2]/40 transition-colors text-start group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0A66C2]/15 text-[#0A66C2] border border-[#0A66C2]/30 shrink-0 text-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden>
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-white">
                  {t.linkedinTitle}
                </span>
                <span className="text-[11px] text-white/55">
                  {t.linkedinSub}
                </span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-white/40 group-hover:text-white transition-colors shrink-0 ms-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* 🌐 Official Website */}
          <a
            href="https://upraiser.co.uk"
            className="flex items-center justify-between w-full min-h-[50px] px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 transition-colors text-start group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.06] text-white/80 border border-white/15 shrink-0 text-sm" aria-hidden>
                🌐
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-white">
                  {t.officialPlatform}
                </span>
                <span dir="ltr" className="text-[11px] text-white/55 text-start">upraiser.co.uk</span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-white/40 group-hover:text-white transition-colors shrink-0 ms-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.section>

        {/* ============================================================== */}
        {/* 5. HUMAN LEAD CAPTURE (WARM & DIRECT)                          */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6"
        >
          <div className="w-full rounded-2xl p-5 sm:p-6 bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Top edge dual glow line: crimson + gold */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(230,53,88,0.7) 40%, rgba(245,197,66,0.7) 60%, transparent 100%)",
              }}
            />

            <div className="flex flex-col mb-4">
              <h2 className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight">
                {t.formHeading}
              </h2>
              <p className="text-xs text-white/65 mt-1 leading-relaxed">
                {t.formSub}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center text-center py-6 px-3 bg-[#e63558]/10 border border-[#e63558]/30 rounded-xl"
                  role="status"
                >
                  <div className="w-12 h-12 rounded-full bg-[#e63558]/20 flex items-center justify-center text-[#e63558] mb-3">
                    <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-base text-white">
                    {t.successTitle}
                  </h3>
                  <p className="text-xs text-white/70 mt-1 max-w-[280px]">
                    {t.successBody}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setName("");
                      setCompanyRole("");
                      setContact("");
                    }}
                    className="mt-4 min-h-[44px] px-3 inline-flex items-center text-[11px] font-mono text-[#f5c542] hover:underline uppercase tracking-wider"
                  >
                    {t.btnAnother}
                  </button>
                </motion.div>
              ) : (
                <form key="capture-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {/* 1. Name / Callsign */}
                  <div>
                    <label htmlFor="hub-name" className={LABEL_CLASS}>
                      {t.fieldCallsign} <span className="text-[#e63558]">*</span>
                    </label>
                    <input
                      id="hub-name"
                      type="text"
                      required
                      autoComplete="name"
                      dir="auto"
                      placeholder={t.callsignPlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>

                  {/* 2. Company & Role */}
                  <div>
                    <label htmlFor="hub-company" className={LABEL_CLASS}>
                      {t.fieldCompany}
                    </label>
                    <input
                      id="hub-company"
                      type="text"
                      dir="auto"
                      placeholder={t.companyPlaceholder}
                      value={companyRole}
                      onChange={(e) => setCompanyRole(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>

                  {/* 3. Telegram or Email */}
                  <div>
                    <label htmlFor="hub-contact" className={LABEL_CLASS}>
                      {t.fieldContact} <span className="text-[#e63558]">*</span>
                    </label>
                    <input
                      id="hub-contact"
                      type="text"
                      required
                      dir="ltr"
                      placeholder={t.contactPlaceholder}
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-[#FF043D] mt-1" role="alert">
                      {errorMessage}
                    </p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-2 min-h-[48px] w-full rounded-xl bg-gradient-to-r from-[#e63558]/20 via-[#f5c542]/15 to-[#e63558]/20 hover:from-[#e63558]/30 hover:to-[#f5c542]/25 active:scale-[0.98] border border-[#e63558]/40 hover:border-[#f5c542]/60 text-white font-display font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none group cursor-pointer"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t.btnSubmitting}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.btnSubmit}</span>
                        <span aria-hidden className="inline-block rtl:-scale-x-100 text-[#f5c542] group-hover:translate-x-0.5 transition-transform font-bold">→</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ============================================================== */}
        {/* 6. FOOTER                                                      */}
        {/* ============================================================== */}
        <footer className="w-full mt-10 pt-6 border-t border-white/5 flex flex-col items-center text-center">
          <p dir="ltr" className="font-mono text-[11px] text-white/35 tracking-wider">
            UPRAISER Agency LLP · London · Since 2017
          </p>
          <p className="font-mono text-[10px] text-white/20 mt-1">
            {t.footerAccess}
          </p>
        </footer>
      </div>
    </main>
  );
}

export default ConferenceHubPage;
