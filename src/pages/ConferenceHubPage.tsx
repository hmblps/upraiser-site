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

/** Tuned spring physics according to Emil Kowalski UI principles. */
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
      data-theme="dark"
      lang={lang}
      dir={isRtl ? "rtl" : "ltr"}
      data-hub-plain={isPlain ? "true" : "false"}
      className="relative min-h-[100dvh] w-full overflow-x-hidden text-[#f5f0e8] flex flex-col items-center justify-between selection:bg-[#ff003b] selection:text-white"
      style={{
        backgroundColor: "#050504",
      }}
    >
      <style>{PLAIN_SCRIPT_CSS}</style>

      {/* Atmospheric Visuals: Quiet BrandAurora + Static Grain matching ?theme=dark */}
      <BrandAurora tone="contact" className="opacity-25 pointer-events-none" />
      <div
        className="pointer-events-none absolute top-[-8%] left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full blur-[140px] opacity-15"
        style={{
          background: "radial-gradient(circle, #ff003b 0%, rgba(255, 204, 0, 0.12) 60%, transparent 80%)",
        }}
        aria-hidden
      />
      <SiteGrain />

      {/* Centered Compact Stack (max-width 420px) */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] flex flex-col items-center">
        
        {/* ============================================================== */}
        {/* TOP BAR: Clean minimal header capsule                          */}
        {/* ============================================================== */}
        <div className="w-full flex items-center justify-between mb-4 px-0.5">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#c4b8ae]/60 tracking-wider" dir="ltr">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff003b]" />
            <span data-latin>UPRAISER · ON-SITE</span>
          </div>

          {/* Minimal Language Switcher */}
          <label className="relative inline-flex items-center">
            <span className="sr-only">{t.langLabel}</span>
            <select
              value={lang}
              onChange={(e) => handleSetLang(e.target.value as HubLang)}
              aria-label={t.langLabel}
              className="appearance-none min-h-[44px] ps-3 pe-7 py-1 rounded-full bg-transparent hover:bg-white/[0.04] text-xs text-[#c4b8ae] hover:text-[#f5f0e8] font-mono cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ff003b] transition-colors"
            >
              {HUB_LANGS.map((code) => (
                <option key={code} value={code} lang={code} className="bg-[#0e0d0b] text-[#f5f0e8]">
                  {HUB_LANG_NAMES[code]}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute end-2 w-3 h-3 text-[#c4b8ae]/60"
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

        {/* ============================================================== */}
        {/* 1. BRAND HEADER & PERSONAL GREETING                            */}
        {/* ============================================================== */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_TACTILE}
          className="w-full flex flex-col items-center text-center"
        >
          {/* Logo Mark */}
          <Link
            to="/"
            className="group flex flex-col items-center gap-2 outline-none focus-visible:ring-1 focus-visible:ring-[#ff003b] rounded-xl p-1"
            title="UPRAISER Platform"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0e0d0b] border border-white/[0.06] shadow-sm group-hover:border-white/15 transition-colors">
              <img
                src="/upraiser-logo.png"
                alt="UPRAISER"
                className="w-7 h-7 object-contain"
                width={28}
                height={28}
              />
            </div>
            <span data-latin className="font-display font-bold text-sm tracking-widest text-[#f5f0e8] uppercase">
              UPRAISER
            </span>
          </Link>

          {/* Section Kicker: matching main site .section-label */}
          <p
            data-latin
            className="mt-3 font-mono text-[11px] font-semibold tracking-[0.22em] text-[#ff003b] uppercase"
          >
            {t.kicker}
          </p>

          {/* Headline & Personal Greeting */}
          <h1 className="mt-2 font-display font-extrabold text-2xl sm:text-[28px] tracking-tight text-[#f5f0e8] text-balance">
            {t.headline}
          </h1>
          <p className="mt-1 text-sm sm:text-[15px] font-medium text-[#f5f0e8]/85 text-balance">
            &ldquo;{t.greeting}&rdquo;
          </p>
          <p className="mt-2 text-xs text-[#c4b8ae] font-mono leading-relaxed max-w-[320px]">
            {t.subtext}
          </p>
        </motion.header>

        {/* ============================================================== */}
        {/* 2. PRIMARY CONTACT ACTION: SAVE CONTACT (.VCF)                 */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_TACTILE, delay: 0.08 }}
          className="w-full mt-6"
        >
          <motion.a
            href="/contact.vcf"
            download="oleksii-ostroukhov.vcf"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            transition={SPRING_TACTILE}
            className="group relative flex items-center justify-center gap-2.5 w-full min-h-[48px] px-6 py-3 rounded-full text-white text-center font-display font-bold text-xs uppercase tracking-wider shadow-sm select-none cursor-pointer"
            style={{
              backgroundColor: "#ff003b",
              boxShadow: "0 6px 20px -3px rgba(255, 0, 59, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.25)",
            }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{t.saveContactBtn}</span>
          </motion.a>
          <p className="text-[11px] font-mono text-[#c4b8ae]/60 text-center mt-2">
            {t.saveContactSub}
          </p>
        </motion.div>

        {/* ============================================================== */}
        {/* 3. DIRECT CHANNELS (TEAM ROSTER)                               */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_TACTILE, delay: 0.14 }}
          className="w-full mt-7 flex flex-col"
        >
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c4b8ae]/60 mb-2.5 px-0.5">
            {t.directChannels}
          </p>

          {/* Card 1: Oleksii Ostroukhov */}
          <article className="w-full p-4 rounded-2xl bg-[#0e0d0b] border border-white/[0.06] flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/team/oleksii.webp"
                alt="Oleksii Ostroukhov"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10 shrink-0"
                loading="eager"
              />
              <div className="flex-1 min-w-0">
                <h2 dir="ltr" className="font-display font-semibold text-[15px] text-[#f5f0e8] tracking-tight">
                  Oleksii Ostroukhov
                </h2>
                <p className="text-xs font-mono text-[#ff003b] font-medium tracking-wide mt-0.5">
                  {t.founderRole}
                </p>
              </div>
            </div>

            {/* Actions: Clean unified tactile buttons */}
            <div className="grid grid-cols-2 gap-2">
              <motion.a
                href="https://t.me/homeboylebz"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                whileTap={{ scale: 0.98 }}
                transition={SPRING_TACTILE}
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f0e8] border border-white/[0.05] text-xs font-mono transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-[#229ED9] shrink-0" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                </svg>
                <span>@homeboylebz</span>
              </motion.a>

              <motion.a
                href="https://wa.me/40724787390"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                whileTap={{ scale: 0.98 }}
                transition={SPRING_TACTILE}
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f0e8] border border-white/[0.05] text-xs font-mono transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-[#25D366] shrink-0" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.18 8.18 0 01-5.82 2.42c-1.47 0-2.92-.4-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m-3.56 4.72c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.06 3.29 5.09 4.47 2.52.98 3.03.79 3.58.73.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.89-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01z" />
                </svg>
                <span>WhatsApp</span>
              </motion.a>
            </div>

            <motion.a
              href="mailto:alex@upraiser.co.uk"
              dir="ltr"
              whileTap={{ scale: 0.98 }}
              transition={SPRING_TACTILE}
              className="flex items-center justify-center gap-2 min-h-[44px] w-full px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#c4b8ae] hover:text-[#f5f0e8] border border-white/[0.05] text-xs font-mono transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0 text-[#c4b8ae]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>alex@upraiser.co.uk</span>
            </motion.a>
          </article>

          {/* Card 2: Vladyslav Samoilenko */}
          <article className="w-full mt-2.5 p-4 rounded-2xl bg-[#0e0d0b] border border-white/[0.06] flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/team/vladyslav.webp"
                alt="Vladyslav Samoilenko"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10 shrink-0"
                loading="eager"
              />
              <div className="flex-1 min-w-0">
                <h2 dir="ltr" className="font-display font-semibold text-[15px] text-[#f5f0e8] tracking-tight">
                  Vladyslav Samoilenko
                </h2>
                <p className="text-xs font-mono text-[#ffcc00] font-medium tracking-wide mt-0.5">
                  {t.opsRole}
                </p>
              </div>
            </div>

            {/* Actions: Clean unified tactile buttons */}
            <div className="grid grid-cols-2 gap-2">
              <motion.a
                href="https://t.me/Vladussoboi108"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                whileTap={{ scale: 0.98 }}
                transition={SPRING_TACTILE}
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f0e8] border border-white/[0.05] text-xs font-mono transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-[#229ED9] shrink-0" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                </svg>
                <span>@Vladussoboi108</span>
              </motion.a>

              <motion.a
                href="https://wa.me/40724787390?text=Hello%20Vladyslav%20/%20Operations%20Desk"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                whileTap={{ scale: 0.98 }}
                transition={SPRING_TACTILE}
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f0e8] border border-white/[0.05] text-xs font-mono transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-[#25D366] shrink-0" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.18 8.18 0 01-5.82 2.42c-1.47 0-2.92-.4-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m-3.56 4.72c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.06 3.29 5.09 4.47 2.52.98 3.03.79 3.58.73.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.89-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01z" />
                </svg>
                <span>WhatsApp</span>
              </motion.a>
            </div>

            <motion.a
              href="mailto:ceo@upraiser.co.uk"
              dir="ltr"
              whileTap={{ scale: 0.98 }}
              transition={SPRING_TACTILE}
              className="flex items-center justify-center gap-2 min-h-[44px] w-full px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#c4b8ae] hover:text-[#f5f0e8] border border-white/[0.05] text-xs font-mono transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0 text-[#c4b8ae]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>ceo@upraiser.co.uk</span>
            </motion.a>
          </article>
        </motion.section>

        {/* ============================================================== */}
        {/* 4. ECOSYSTEM & PROOF                                           */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_TACTILE, delay: 0.2 }}
          className="w-full mt-7 flex flex-col gap-2"
        >
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c4b8ae]/60 mb-1 px-0.5">
            {t.ecosystemHeader}
          </p>

          {/* 📄 Media Deck 2026 (PDF) */}
          <motion.a
            href={MEDIA_DECK_URL}
            target="_blank"
            rel="noopener"
            whileTap={{ scale: 0.98 }}
            transition={SPRING_TACTILE}
            className="flex items-center justify-between w-full min-h-[52px] px-4 py-3 rounded-2xl bg-[#0e0d0b] hover:bg-[#141311] border border-white/[0.06] hover:border-white/12 transition-colors text-start group"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] text-[#ffcc00] shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-display font-medium text-sm text-[#f5f0e8] group-hover:text-white transition-colors">
                  {t.mediaDeckTitle}
                </span>
                <span className="text-[11px] text-[#c4b8ae]/70 font-mono">
                  {t.mediaDeckSub}
                </span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-[#c4b8ae]/50 group-hover:text-[#f5f0e8] transition-colors shrink-0 ms-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
            </svg>
          </motion.a>

          {/* ⚡ Explore The Routes (3D Showcase) */}
          <motion.div whileTap={{ scale: 0.98 }} transition={SPRING_TACTILE}>
            <Link
              to="/channels?utm_source=qr_wallet"
              className="flex items-center justify-between w-full min-h-[50px] px-4 py-3 rounded-2xl bg-[#0e0d0b] hover:bg-[#141311] border border-white/[0.06] hover:border-white/12 transition-colors text-start group"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] text-[#ff003b] shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <div className="flex flex-col">
                  <span className="font-display font-medium text-sm text-[#f5f0e8] group-hover:text-white transition-colors">
                    {t.routesTitle}
                  </span>
                  <span className="text-[11px] text-[#c4b8ae]/70 font-mono">
                    {t.routesSub}
                  </span>
                </div>
              </div>
              <svg
                className="w-4 h-4 text-[#c4b8ae]/50 group-hover:text-[#f5f0e8] transition-colors shrink-0 ms-2 rtl:-scale-x-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* 💼 LinkedIn Agency Profile */}
          <motion.a
            href="https://www.linkedin.com/company/upraiser/"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.98 }}
            transition={SPRING_TACTILE}
            className="flex items-center justify-between w-full min-h-[50px] px-4 py-3 rounded-2xl bg-[#0e0d0b] hover:bg-[#141311] border border-white/[0.06] hover:border-white/12 transition-colors text-start group"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] text-[#0A66C2] shrink-0">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden>
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-display font-medium text-sm text-[#f5f0e8] group-hover:text-white transition-colors">
                  {t.linkedinTitle}
                </span>
                <span className="text-[11px] text-[#c4b8ae]/70 font-mono">
                  {t.linkedinSub}
                </span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-[#c4b8ae]/50 group-hover:text-[#f5f0e8] transition-colors shrink-0 ms-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.a>

          {/* 🌐 Official Website */}
          <motion.a
            href="https://upraiser.co.uk"
            whileTap={{ scale: 0.98 }}
            transition={SPRING_TACTILE}
            className="flex items-center justify-between w-full min-h-[50px] px-4 py-3 rounded-2xl bg-[#0e0d0b] hover:bg-[#141311] border border-white/[0.06] hover:border-white/12 transition-colors text-start group"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] text-[#c4b8ae] shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" />
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-display font-medium text-sm text-[#f5f0e8] group-hover:text-white transition-colors">
                  {t.officialPlatform}
                </span>
                <span dir="ltr" className="text-[11px] text-[#c4b8ae]/70 font-mono text-start">upraiser.co.uk</span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-[#c4b8ae]/50 group-hover:text-[#f5f0e8] transition-colors shrink-0 ms-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.a>
        </motion.section>

        {/* ============================================================== */}
        {/* 5. HUMAN LEAD CAPTURE (WARM & DIRECT)                          */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_TACTILE, delay: 0.26 }}
          className="w-full mt-7"
        >
          <div className="w-full rounded-2xl p-5 sm:p-6 bg-[#0e0d0b] border border-white/[0.06] shadow-sm">
            <div className="flex flex-col mb-4">
              <h2 className="font-display font-bold text-base text-[#f5f0e8] tracking-tight">
                {t.formHeading}
              </h2>
              <p className="text-xs text-[#c4b8ae] mt-1 leading-relaxed">
                {t.formSub}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={SPRING_TACTILE}
                  className="flex flex-col items-center text-center py-6 px-3 bg-white/[0.02] border border-white/[0.06] rounded-xl"
                  role="status"
                >
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center text-[#ffcc00] mb-3">
                    <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display font-semibold text-base text-[#f5f0e8]">
                    {t.successTitle}
                  </h3>
                  <p className="text-xs text-[#c4b8ae] mt-1 max-w-[280px]">
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
                    className="mt-4 min-h-[44px] px-3 inline-flex items-center text-xs font-mono text-[#ffcc00] hover:underline"
                  >
                    {t.btnAnother}
                  </button>
                </motion.div>
              ) : (
                <form key="capture-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {/* 1. Name / Callsign */}
                  <div>
                    <label htmlFor="hub-name" className="block text-[10px] font-mono uppercase tracking-wider text-[#c4b8ae]/80 mb-1.5">
                      {t.fieldCallsign} <span className="text-[#ff003b]">*</span>
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
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#050504] border border-white/[0.08] text-sm text-[#f5f0e8] placeholder-[#c4b8ae]/30 focus:outline-none focus:border-white/25 transition-colors"
                    />
                  </div>

                  {/* 2. Company & Role */}
                  <div>
                    <label htmlFor="hub-company" className="block text-[10px] font-mono uppercase tracking-wider text-[#c4b8ae]/80 mb-1.5">
                      {t.fieldCompany}
                    </label>
                    <input
                      id="hub-company"
                      type="text"
                      dir="auto"
                      placeholder={t.companyPlaceholder}
                      value={companyRole}
                      onChange={(e) => setCompanyRole(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#050504] border border-white/[0.08] text-sm text-[#f5f0e8] placeholder-[#c4b8ae]/30 focus:outline-none focus:border-white/25 transition-colors"
                    />
                  </div>

                  {/* 3. Telegram or Email */}
                  <div>
                    <label htmlFor="hub-contact" className="block text-[10px] font-mono uppercase tracking-wider text-[#c4b8ae]/80 mb-1.5">
                      {t.fieldContact} <span className="text-[#ff003b]">*</span>
                    </label>
                    <input
                      id="hub-contact"
                      type="text"
                      required
                      dir="ltr"
                      placeholder={t.contactPlaceholder}
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#050504] border border-white/[0.08] text-sm text-[#f5f0e8] placeholder-[#c4b8ae]/30 focus:outline-none focus:border-white/25 transition-colors"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-[#ff003b] mt-1 font-mono" role="alert">
                      {errorMessage}
                    </p>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={status === "submitting"}
                    whileTap={{ scale: 0.98 }}
                    transition={SPRING_TACTILE}
                    className="mt-1 min-h-[46px] w-full rounded-xl bg-[#f5f0e8] hover:bg-white text-[#050504] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>{t.btnSubmitting}</span>
                      </>
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
        </motion.section>

        {/* ============================================================== */}
        {/* 6. FOOTER                                                      */}
        {/* ============================================================== */}
        <footer className="w-full mt-10 pt-6 border-t border-white/[0.04] flex flex-col items-center text-center">
          <p dir="ltr" className="font-mono text-[11px] text-[#c4b8ae]/45 tracking-wider">
            UPRAISER Agency LLP · London · Since 2017
          </p>
          <p className="font-mono text-[10px] text-[#c4b8ae]/30 mt-1">
            {t.footerAccess}
          </p>
        </footer>
      </div>
    </main>
  );
}

export default ConferenceHubPage;
