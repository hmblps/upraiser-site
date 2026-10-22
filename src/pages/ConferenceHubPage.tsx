import { useState, useCallback, useEffect, useMemo, Suspense, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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
const SPRING_TACTILE = { type: "spring", stiffness: 400, damping: 25 } as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

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

function TelegramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.94-1.28 4.91-2.13 5.9-2.54 2.81-1.17 3.4-.97 3.78-.97.08 0 .28.02.4.12.1.08.13.2.14.28-.01.07-.01.2-.03.4z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.01 4.54-3.68 8.23-8.22 8.23zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z" />
    </svg>
  );
}

function MailIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.4 4.25-6.54 4.09c-.65.41-1.47.41-2.12 0L4.4 8.25A1.75 1.75 0 0 1 4 7.25c0-.97.78-1.75 1.75-1.75h12.5c.97 0 1.75.78 1.75 1.75 0 .38-.13.73-.4 1z" />
    </svg>
  );
}

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

  // Form state
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
            <NightStars speed={2.5} />
          </Canvas>
        </Suspense>
      </div>

      {/* Ambient background glow — soft wine atmospheric haze */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#e63558]/10 blur-[120px] rounded-full pointer-events-none"
        aria-hidden
      />
      <SiteGrain />

      {/* Main Column (max 380px) with Staggered Entry Animation */}
      <motion.div
        variants={containerVariants}
        initial={reduced ? "visible" : "hidden"}
        animate="visible"
        className="w-full max-w-[380px] flex flex-col items-center z-10 space-y-6 sm:space-y-7"
      >
        {/* Top Minimal Bar: Language Switcher */}
        <motion.div variants={itemVariants} className="w-full flex items-center justify-between">
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
        </motion.div>

        {/* 1. Primary One-Tap vCard Action (Tactile Spring) */}
        <motion.div variants={itemVariants} className="w-full">
          <motion.a
            href="/contact.vcf"
            download="oleksii-ostroukhov.vcf"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            transition={SPRING_TACTILE}
            className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-[#e63558] hover:bg-[#ff003b] text-white font-medium text-sm text-center shadow-lg shadow-[#e63558]/25 transition-all flex items-center justify-center space-x-2 select-none cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0 text-[#FECF09]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{t.saveContactBtn}</span>
          </motion.a>
        </motion.div>

        {/* 2. Direct Lead Capture Form (Centered Header + Micro-Success) */}
        <motion.div variants={itemVariants} className="w-full pt-1 space-y-3">
          <div className="text-center px-1 flex flex-col items-center">
            <h2 className="text-sm font-medium text-white">{t.formHeading}</h2>
            <p className="text-xs text-white/40 mt-1 whitespace-nowrap overflow-hidden text-ellipsis leading-relaxed max-w-[340px]">
              {t.formSub}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.98, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -6 }}
                transition={SPRING_TACTILE}
                className="py-4 px-4 text-center text-xs font-mono text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center space-x-2"
              >
                <span className="text-[#FECF09] font-bold">✓</span>
                <span>{t.successTitle}</span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-2.5"
              >
                <input
                  type="text"
                  required
                  placeholder={t.fieldCallsign}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  dir="auto"
                  className="w-full min-h-[46px] bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FECF09]/60 transition-colors"
                />
                <input
                  type="text"
                  required
                  dir="ltr"
                  placeholder={t.fieldContact}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full min-h-[46px] bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FECF09]/60 transition-colors"
                />

                {errorMessage && (
                  <p className="text-xs text-[#ff003b] font-mono px-1 text-center">{errorMessage}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === "submitting"}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={SPRING_TACTILE}
                  className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors flex items-center justify-center space-x-2 border border-white/10 cursor-pointer disabled:opacity-50"
                >
                  {status === "submitting" ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t.btnSubmit}</span>
                      <span aria-hidden className="inline-block rtl:-scale-x-100 font-bold text-[#FECF09]">→</span>
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 3. Direct Team Roster (Monochrome App Icons, Clean Role) */}
        <motion.div variants={itemVariants} className="w-full space-y-3 pt-1">
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
              <motion.a
                href="https://t.me/homeboylebz"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={SPRING_TACTILE}
                className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white transition-colors group"
                title="Telegram @homeboylebz"
                aria-label="Telegram @homeboylebz"
              >
                <TelegramIcon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </motion.a>
              <motion.a
                href="https://wa.me/40724787390"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={SPRING_TACTILE}
                className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white transition-colors group"
                title="WhatsApp"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </motion.a>
              <motion.a
                href="mailto:alex@upraiser.co.uk"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={SPRING_TACTILE}
                className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white transition-colors group"
                title="Email alex@upraiser.co.uk"
                aria-label="Email alex@upraiser.co.uk"
              >
                <MailIcon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </motion.a>
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
                <div className="text-[10px] sm:text-xs text-[#FECF09] font-mono whitespace-nowrap overflow-hidden text-ellipsis">{t.opsRole}</div>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0 ms-2">
              <motion.a
                href="https://t.me/Vladussoboi108"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={SPRING_TACTILE}
                className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white transition-colors group"
                title="Telegram @Vladussoboi108"
                aria-label="Telegram @Vladussoboi108"
              >
                <TelegramIcon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </motion.a>
              <motion.a
                href="mailto:ceo@upraiser.co.uk"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={SPRING_TACTILE}
                className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white transition-colors group"
                title="Email ceo@upraiser.co.uk"
                aria-label="Email ceo@upraiser.co.uk"
              >
                <MailIcon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* 4. Ecosystem & Links (Centered, stripped of 2.6 MB & domain labels) */}
        <motion.div variants={itemVariants} className="w-full space-y-2 pt-1">
          {/* Routes */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={SPRING_TACTILE}>
            <Link
              to="/channels?utm_source=qr_wallet"
              className="flex items-center justify-center min-h-[48px] py-3 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors group space-x-2"
            >
              <span className="text-sm font-medium text-white/85 group-hover:text-white">{t.routesTitle}</span>
              <span className="text-xs text-[#FECF09] font-mono group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </motion.div>

          {/* Expedition Dossier */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={SPRING_TACTILE}>
            <a
              href={MEDIA_DECK_URL}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center min-h-[48px] py-3 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors group space-x-2"
            >
              <span className="text-sm font-medium text-white/85 group-hover:text-white">{t.mediaDeckTitle}</span>
              <span className="text-xs text-white/40 font-mono group-hover:translate-y-0.5 transition-transform">↓</span>
            </a>
          </motion.div>

          {/* Website */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={SPRING_TACTILE}>
            <a
              href="https://upraiser.co.uk"
              className="flex items-center justify-center min-h-[48px] py-3 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors group space-x-2"
            >
              <span className="text-sm font-medium text-white/85 group-hover:text-white">{t.officialPlatform}</span>
              <span className="text-xs text-white/40 font-mono group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </a>
          </motion.div>

          {/* LinkedIn */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={SPRING_TACTILE}>
            <a
              href="https://www.linkedin.com/company/upraiser/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center min-h-[48px] py-3 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors group space-x-2"
            >
              <span className="text-sm font-medium text-white/85 group-hover:text-white">{t.linkedinTitle}</span>
              <span className="text-xs text-white/40 font-mono group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="w-full text-center pt-10 pb-2 text-[11px] font-mono text-white/20 z-10">
        UPRAISER Agency LLP · London · Since 2017
      </footer>
    </div>
  );
}

export default ConferenceHubPage;
