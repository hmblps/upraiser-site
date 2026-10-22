import { useState, useEffect, useCallback, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BrandAurora } from "../components/BrandAurora";
import { SiteGrain } from "../components/SiteGrain";

// Royal Crimson palette
const ROYAL_RED = "#E60039";

type HubLanguage = "en" | "ru";

function getInitialLanguage(): HubLanguage {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem("upraiser_hub_lang");
    if (saved === "en" || saved === "ru") return saved;
  } catch {}

  const navLang = (navigator.language || (navigator as { userLanguage?: string }).userLanguage || "").toLowerCase();
  if (navLang.startsWith("ru") || navLang.startsWith("uk") || navLang.startsWith("be") || navLang.startsWith("kk")) {
    return "ru";
  }
  return "en";
}

const translations = {
  en: {
    kicker: "CHARTING THE ASCENT",
    tagline: "Direct operator desk. Zero log drift, pre-bid filtration, and Tier-1 routing.",
    saveContactBtn: "Save Contact to Phone (.vcf)",
    saveContactSub: "One-tap vCard import to iOS & Android contacts",
    formHeading: "Request Verified Deck & Benchmarks",
    formSub: "Leave Your contact — We will deliver verified geo splits and conversion benchmarks.",
    fieldCallsign: "Full Name / Callsign",
    callsignPlaceholder: "Your name or handle",
    fieldCompany: "Company & Role",
    companyPlaceholder: "e.g. Head of UA @ Studio",
    fieldContact: "Telegram or Email",
    contactPlaceholder: "@handle or name@company.com",
    btnSubmit: "Request Materials",
    btnSubmitting: "Sending Request...",
    successTitle: "Request Dispatched!",
    successBody: "We have logged Your request. Verified Deck & Benchmarks will be delivered to Your direct contact shortly.",
    btnAnother: "Send Another Request",
    errSubmit: "Error sending request. Please connect directly via Telegram or Email below.",
    errNetwork: "Network error. Please reach out via Telegram or Email below.",
    onSiteDirect: "On-Site Direct",
    onlineBadge: "ONLINE",
    oleksiiRole: "Founder & Lead",
    badgeDirect: "DIRECT",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    email: "Email",
    infrastructureHeader: "Infrastructure & Showcase",
    routesTitle: "Explore The Routes (3D Showcase)",
    routesSub: "Interactive Programmatic, CTV & OEM terminal",
    officialPlatform: "Official Platform",
    linkedinTitle: "LinkedIn Company Page",
    footerLLP: "UPRAISER Agency LLP · London · Since 2017",
    footerAccess: "Private Conference Access Point · Unlisted",
  },
  ru: {
    kicker: "CHARTING THE ASCENT",
    tagline: "Прямой операторский деск. Нулевой log drift, pre-bid фильтрация и Tier-1 маршрутизация.",
    saveContactBtn: "Сохранить контакт в телефон (.vcf)",
    saveContactSub: "Мгновенный импорт визитки в записную книжку iOS / Android",
    formHeading: "Request Verified Deck & Benchmarks",
    formSub: "Укажите контакт — пришлем актуальные сплиты по гео и конверсиям.",
    fieldCallsign: "ФИО / Позывной",
    callsignPlaceholder: "Имя или никнейм",
    fieldCompany: "Компания и роль",
    companyPlaceholder: "e.g. Head of UA @ Studio",
    fieldContact: "Telegram или Email",
    contactPlaceholder: "@handle или email@domain.com",
    btnSubmit: "Получить материалы",
    btnSubmitting: "Отправка запроса...",
    successTitle: "Запрос принят!",
    successBody: "Материалы и бенчмарки отправлены команде. Мы свяжемся с Вами в ближайшее время.",
    btnAnother: "Отправить еще один контакт",
    errSubmit: "Ошибка отправки. Напишите напрямую в Telegram или на Email ниже.",
    errNetwork: "Сетевая ошибка. Пожалуйста, напишите напрямую в Telegram.",
    onSiteDirect: "На связи на ивенте",
    onlineBadge: "ONLINE",
    oleksiiRole: "Founder & Lead",
    badgeDirect: "DIRECT",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    email: "Email",
    infrastructureHeader: "Инфраструктура и кейсы",
    routesTitle: "Explore The Routes (3D Showcase)",
    routesSub: "Интерактивный пульт Programmatic, CTV & OEM маршрутов",
    officialPlatform: "Официальный сайт",
    linkedinTitle: "LinkedIn страница компании",
    footerLLP: "UPRAISER Agency LLP · London · Since 2017",
    footerAccess: "Закрытый доступ для конференций · Unlisted",
  },
} as const;

export function ConferenceHubPage() {
  // 1. Strict Search Engine Exclusion (noindex, nofollow, noarchive)
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    const created = !meta;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    const prev = meta.getAttribute("content");
    meta.setAttribute("content", "noindex, nofollow, noarchive");

    let googlebot = document.querySelector('meta[name="googlebot"]');
    const gCreated = !googlebot;
    if (!googlebot) {
      googlebot = document.createElement("meta");
      googlebot.setAttribute("name", "googlebot");
      document.head.appendChild(googlebot);
    }
    googlebot.setAttribute("content", "noindex, nofollow, noarchive");

    document.title = "UPRAISER · On-Site Direct Desk";

    return () => {
      if (created) meta?.remove();
      else if (prev) meta?.setAttribute("content", prev);
      else meta?.removeAttribute("content");

      if (gCreated) googlebot?.remove();
      else googlebot?.removeAttribute("content");
    };
  }, []);

  // 2. Language State (Auto-detected with instant manual toggle)
  const [lang, setLang] = useState<HubLanguage>(getInitialLanguage);
  const t = translations[lang];

  const handleSetLang = (newLang: HubLanguage) => {
    setLang(newLang);
    try {
      localStorage.setItem("upraiser_hub_lang", newLang);
    } catch {}
  };

  // 3. Lead Capture Form State
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

      const isEmail = contact.includes("@");
      const payload = {
        name: name.trim(),
        email: isEmail ? contact.trim() : "conference-lead@upraiser.co.uk",
        appId: companyRole.trim() || "Conference Lead",
        geos: "Tier-1 / Conference",
        companyType: "Direct Operator Contact",
        companySize: "On-Site Desk",
        monthlyBudget: "Verified Deck & Benchmarks Request",
        notes: `[ON-SITE DESK REQUEST]\nName/Callsign: ${name.trim()}\nCompany & Role: ${companyRole.trim() || "Not specified"}\nDirect Contact: ${contact.trim()}\nPreferred Language: ${lang.toUpperCase()}`,
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
        fd.append("subject", `Conference Lead: ${name.trim()} (${companyRole.trim() || "Direct"})`);
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
      } catch (err) {
        setStatus("error");
        setErrorMessage(t.errNetwork);
      }
    },
    [name, companyRole, contact, lang, t]
  );

  return (
    <main
      className="relative min-h-[100dvh] w-full overflow-x-hidden text-white flex flex-col items-center justify-between selection:bg-[#E60039] selection:text-white"
      style={{ backgroundColor: "#050504" }}
    >
      {/* Ambient Visuals: BrandAurora + Static Grain */}
      <BrandAurora tone="contact" className="opacity-40 pointer-events-none" />
      <div
        className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full blur-[130px] opacity-25"
        style={{ background: `radial-gradient(circle, ${ROYAL_RED} 0%, transparent 70%)` }}
        aria-hidden
      />
      <SiteGrain />

      {/* Centered Mobile-First Container (max 420px) */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] flex flex-col items-center">
        {/* Top Bar: Brand Badge & Language Selector */}
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/40 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E60039] animate-pulse" />
            <span>ON-SITE DESK</span>
          </div>

          {/* Language Switcher */}
          <div
            className="flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-[11px]"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => handleSetLang("en")}
              className={`min-h-[30px] min-w-[38px] px-2.5 py-1 rounded-md transition-all font-bold ${
                lang === "en"
                  ? "bg-[#E60039] text-white shadow-[0_0_12px_rgba(230,0,57,0.5)]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => handleSetLang("ru")}
              className={`min-h-[30px] min-w-[38px] px-2.5 py-1 rounded-md transition-all font-bold ${
                lang === "ru"
                  ? "bg-[#E60039] text-white shadow-[0_0_12px_rgba(230,0,57,0.5)]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              RU
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 1. BRAND HEADER                                                */}
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
            className="group flex flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#E60039] rounded-xl p-1"
            title="UPRAISER Platform"
          >
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_24px_rgba(230,0,57,0.25)] group-hover:border-[#E60039]/50 transition-colors">
              <img
                src="/upraiser-logo.png"
                alt="UPRAISER"
                className="w-9 h-9 object-contain"
                width={36}
                height={36}
              />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-white uppercase">
              UPRAISER
            </span>
          </Link>

          {/* Kicker */}
          <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60039]/12 border border-[#E60039]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E60039] animate-pulse" />
            <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#E60039] uppercase">
              {t.kicker}
            </span>
          </div>

          {/* Tagline: Ogilvy direct facts */}
          <p className="mt-3 text-xs sm:text-[13px] text-white/75 font-mono leading-relaxed text-center max-w-[360px]">
            {t.tagline}
          </p>
        </motion.header>

        {/* ============================================================== */}
        {/* 2. PRIMARY ACTION: SAVE CONTACT (.VCF)                         */}
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
            className="group relative flex items-center justify-center gap-2.5 w-full min-h-[52px] px-5 py-3.5 rounded-xl text-white font-display font-extrabold text-sm sm:text-[15px] uppercase tracking-wider shadow-[0_0_28px_rgba(230,0,57,0.45)] hover:shadow-[0_0_40px_rgba(255,4,61,0.65)] hover:scale-[1.015] active:scale-[0.98] transition-all select-none cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #FF043D 0%, #BA002A 100%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <span className="text-base">💾</span>
            <span>{t.saveContactBtn}</span>
          </a>
          <p className="text-[10px] font-mono text-white/40 text-center mt-1.5">
            {t.saveContactSub}
          </p>
        </motion.div>

        {/* ============================================================== */}
        {/* 3. INTERACTIVE LEAD CAPTURE FORM (DIRECTLY UNDER BUTTON)       */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-5"
        >
          <div className="w-full rounded-2xl p-5 sm:p-6 bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Top edge royal glow line */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(230,0,57,0.7) 50%, transparent 100%)",
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
                  className="flex flex-col items-center text-center py-6 px-3 bg-[#E60039]/10 border border-[#E60039]/30 rounded-xl"
                >
                  <div className="w-12 h-12 rounded-full bg-[#E60039]/20 flex items-center justify-center text-[#E60039] mb-3">
                    <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}>
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
                    className="mt-4 min-h-[44px] px-3 inline-flex items-center text-[11px] font-mono text-[#E60039] hover:underline uppercase tracking-wider"
                  >
                    {t.btnAnother}
                  </button>
                </motion.div>
              ) : (
                <form key="capture-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {/* 1. ФИО / Callsign */}
                  <div>
                    <label htmlFor="hub-name" className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1">
                      {t.fieldCallsign} <span className="text-[#E60039]">*</span>
                    </label>
                    <input
                      id="hub-name"
                      type="text"
                      required
                      placeholder={t.callsignPlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#E60039] focus:ring-1 focus:ring-[#E60039] transition-colors"
                    />
                  </div>

                  {/* 2. Компания и роль */}
                  <div>
                    <label htmlFor="hub-company" className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1">
                      {t.fieldCompany}
                    </label>
                    <input
                      id="hub-company"
                      type="text"
                      placeholder={t.companyPlaceholder}
                      value={companyRole}
                      onChange={(e) => setCompanyRole(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#E60039] focus:ring-1 focus:ring-[#E60039] transition-colors"
                    />
                  </div>

                  {/* 3. Telegram или Email */}
                  <div>
                    <label htmlFor="hub-contact" className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1">
                      {t.fieldContact} <span className="text-[#E60039]">*</span>
                    </label>
                    <input
                      id="hub-contact"
                      type="text"
                      required
                      placeholder={t.contactPlaceholder}
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#E60039] focus:ring-1 focus:ring-[#E60039] transition-colors"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-2.5 rounded-lg bg-[#E60039]/15 border border-[#E60039]/35 text-[11px] text-[#FF043D]">
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full min-h-[46px] mt-1 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-[#E60039] hover:border-[#E60039] border border-white/15 text-white font-display font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t.btnSubmitting}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.btnSubmit}</span>
                        <span className="text-[#E60039] group-hover:text-white transition-colors font-bold">→</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ============================================================== */}
        {/* 4. DIRECT CONTACT CARD: OLEKSII OSTROUKHOV                     */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
              {t.onSiteDirect}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t.onlineBadge}
            </span>
          </div>

          <article className="w-full p-4 rounded-xl bg-white/[0.035] border border-white/10 backdrop-blur-md shadow-lg flex flex-col gap-3 hover:border-white/20 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white tracking-tight">
                  Oleksii Ostroukhov
                </h3>
                <p className="text-xs font-mono text-[#E60039] font-semibold tracking-wide">
                  {t.oleksiiRole}
                </p>
              </div>
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest bg-white/[0.04] px-2 py-0.5 rounded border border-white/5">
                {t.badgeDirect}
              </span>
            </div>

            {/* Instant Channels: Telegram + WhatsApp + Email */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://t.me/homeboylebz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-lg bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/35 text-xs font-bold font-mono transition-all active:scale-[0.97]"
              >
                <span className="text-sm">💬</span>
                <span>@homeboylebz</span>
              </a>
              <a
                href="https://wa.me/40724787390"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/35 text-xs font-bold font-mono transition-all active:scale-[0.97]"
              >
                <span className="text-sm">🟢</span>
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Direct Email (Full Width) */}
            <a
              href="mailto:alex@upraiser.co.uk"
              className="flex items-center justify-center gap-2 min-h-[44px] w-full px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/90 border border-white/15 text-xs font-bold font-mono transition-all active:scale-[0.97]"
            >
              <span className="text-sm">✉️</span>
              <span>alex@upraiser.co.uk</span>
            </a>
          </article>
        </motion.section>

        {/* ============================================================== */}
        {/* 5. INFRASTRUCTURE & SHOWCASE NAVIGATION                        */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6 flex flex-col gap-2.5"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45 px-1">
            {t.infrastructureHeader}
          </span>

          {/* ⚡ Explore The Routes (3D Showcase) */}
          <Link
            to="/channels?utm_source=qr_wallet"
            className="flex items-center justify-between w-full min-h-[50px] px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#E60039]/45 transition-all text-left group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#E60039]/15 text-[#E60039] border border-[#E60039]/30 shrink-0 text-sm">
                ⚡
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-white group-hover:text-[#E60039] transition-colors">
                  {t.routesTitle}
                </span>
                <span className="text-[11px] text-white/55">
                  {t.routesSub}
                </span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* 🌐 Official Platform */}
          <a
            href="https://upraiser.co.uk"
            className="flex items-center justify-between w-full min-h-[50px] px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 transition-all text-left group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.06] text-white/80 border border-white/15 shrink-0 text-sm">
                🌐
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-white group-hover:text-white/90 transition-colors">
                  {t.officialPlatform}
                </span>
                <span className="text-[11px] text-white/55">upraiser.co.uk</span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* 💼 LinkedIn Company Page */}
          <a
            href="https://www.linkedin.com/company/upraiser/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full min-h-[50px] px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#0A66C2]/40 transition-all text-left group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0A66C2]/15 text-[#0A66C2] border border-[#0A66C2]/30 shrink-0 text-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-white group-hover:text-white/90 transition-colors">
                  {t.linkedinTitle}
                </span>
                <span className="text-[11px] text-white/55">linkedin.com/company/upraiser</span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.section>

        {/* ============================================================== */}
        {/* 6. FOOTER                                                      */}
        {/* ============================================================== */}
        <footer className="w-full mt-10 pt-6 border-t border-white/5 flex flex-col items-center text-center">
          <p className="font-mono text-[11px] text-white/35 tracking-wider">
            {t.footerLLP}
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

