import { useState, useEffect, useCallback, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BrandAurora } from "../components/BrandAurora";
import { SiteGrain } from "../components/SiteGrain";

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

  // 2. Lead Capture Form State
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
        notes: `[ON-SITE DESK REQUEST]\nName/Callsign: ${name.trim()}\nCompany & Role: ${companyRole.trim() || "Not specified"}\nDirect Contact: ${contact.trim()}`,
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
          setErrorMessage("Ошибка отправки. Напишите напрямую в Telegram или на Email выше.");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage("Сетевая ошибка. Пожалуйста, напишите нам напрямую в Telegram.");
      }
    },
    [name, companyRole, contact]
  );

  return (
    <main
      className="relative min-h-[100dvh] w-full overflow-x-hidden text-white flex flex-col items-center justify-between selection:bg-[#e63558] selection:text-white"
      style={{ backgroundColor: "#050504" }}
    >
      {/* Ambient Visuals: BrandAurora + Static Grain */}
      <BrandAurora tone="contact" className="opacity-40 pointer-events-none" />
      <div
        className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full blur-[130px] opacity-25"
        style={{ background: "radial-gradient(circle, #e63558 0%, transparent 70%)" }}
        aria-hidden
      />
      <SiteGrain />

      {/* Centered Mobile-First Container (max 420px) */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto px-4 py-8 sm:py-10 flex flex-col items-center">
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
            className="group flex flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#e63558] rounded-xl p-1"
            title="UPRAISER Platform"
          >
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_24px_rgba(230,53,88,0.2)] group-hover:border-[#e63558]/50 transition-colors">
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
          <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e63558]/12 border border-[#e63558]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e63558] animate-pulse" />
            <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#e63558] uppercase">
              CHARTING THE ASCENT
            </span>
          </div>

          {/* Tagline: Ogilvy direct facts */}
          <p className="mt-3 text-xs sm:text-[13px] text-white/75 font-mono leading-relaxed text-center max-w-[360px]">
            Direct operator desk. Zero log drift, pre-bid filtration, and Tier-1 routing.
          </p>
        </motion.header>

        {/* ============================================================== */}
        {/* 2. PRIMARY ACTION: SAVE CONTACT (.VCF)                         */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6"
        >
          <a
            href="/contact.vcf"
            download="upraiser.vcf"
            className="group relative flex items-center justify-center gap-2.5 w-full min-h-[52px] px-5 py-3.5 rounded-xl bg-[#e63558] text-[#050504] font-display font-extrabold text-sm sm:text-[15px] uppercase tracking-wider shadow-[0_0_24px_rgba(230,53,88,0.45)] hover:shadow-[0_0_36px_rgba(230,53,88,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all select-none cursor-pointer"
          >
            <span className="text-base">💾</span>
            <span>Save Contact to Phone (.vcf)</span>
          </a>
          <p className="text-[10px] font-mono text-white/40 text-center mt-1.5">
            Мгновенный импорт визитки в записную книжку iOS / Android
          </p>
        </motion.div>

        {/* ============================================================== */}
        {/* 3. DIRECT TEAM ROSTER (ON-SITE DIRECT)                         */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
              On-Site Direct
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Card 1: Alex — Founder & Lead */}
            <article className="w-full p-4 rounded-xl bg-white/[0.035] border border-white/10 backdrop-blur-md shadow-lg flex flex-col gap-3 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-white tracking-tight">
                    Alex
                  </h3>
                  <p className="text-xs font-mono text-[#e63558] font-semibold tracking-wide">
                    Founder & Lead
                  </p>
                </div>
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest bg-white/[0.04] px-2 py-0.5 rounded border border-white/5">
                  DIRECT
                </span>
              </div>

              {/* Instant Channels: Telegram + Email */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://t.me/alex_upraiser"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-lg bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/35 text-xs font-bold font-mono transition-all active:scale-[0.97]"
                >
                  <span className="text-sm">💬</span>
                  <span>@alex_upraiser</span>
                </a>
                <a
                  href="mailto:alex@upraiser.co.uk"
                  className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/90 border border-white/15 text-xs font-bold font-mono transition-all active:scale-[0.97]"
                >
                  <span className="text-sm">✉️</span>
                  <span>alex@upraiser.co.uk</span>
                </a>
              </div>
            </article>

            {/* Card 2: Operations Desk — Growth & Traffic */}
            <article className="w-full p-4 rounded-xl bg-white/[0.035] border border-white/10 backdrop-blur-md shadow-lg flex flex-col gap-3 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-white tracking-tight">
                    Operations Desk
                  </h3>
                  <p className="text-xs font-mono text-[#e63558] font-semibold tracking-wide">
                    Growth & Traffic
                  </p>
                </div>
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest bg-white/[0.04] px-2 py-0.5 rounded border border-white/5">
                  OPERATIONS
                </span>
              </div>

              {/* Instant Channels: Telegram + Email */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://t.me/upraiser_desk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-lg bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/35 text-xs font-bold font-mono transition-all active:scale-[0.97]"
                >
                  <span className="text-sm">💬</span>
                  <span>@upraiser_desk</span>
                </a>
                <a
                  href="mailto:ceo@upraiser.co.uk"
                  className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/90 border border-white/15 text-xs font-bold font-mono transition-all active:scale-[0.97]"
                >
                  <span className="text-sm">✉️</span>
                  <span>ceo@upraiser.co.uk</span>
                </a>
              </div>
            </article>
          </div>
        </motion.section>

        {/* ============================================================== */}
        {/* 4. INFRASTRUCTURE NAVIGATION                                    */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6 flex flex-col gap-2.5"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45 px-1">
            Infrastructure & Showcase
          </span>

          {/* ⚡ Explore The Routes (3D Showcase) */}
          <Link
            to="/channels?utm_source=qr_wallet"
            className="flex items-center justify-between w-full min-h-[50px] px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#e63558]/45 transition-all text-left group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#e63558]/15 text-[#e63558] border border-[#e63558]/30 shrink-0 text-sm">
                ⚡
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-white group-hover:text-[#e63558] transition-colors">
                  Explore The Routes (3D Showcase)
                </span>
                <span className="text-[11px] text-white/55">
                  Интерактивный пульт Programmatic, CTV & OEM маршрутов
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
                  Official Platform
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
                  LinkedIn Company Page
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
        {/* 5. INTERACTIVE LEAD CAPTURE                                     */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6"
        >
          <div className="w-full rounded-2xl p-5 sm:p-6 bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Top edge glow line */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(230,53,88,0.6) 50%, transparent 100%)",
              }}
            />

            <div className="flex flex-col mb-4">
              <h2 className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight">
                Request Verified Deck & Benchmarks
              </h2>
              <p className="text-xs text-white/65 mt-1 leading-relaxed">
                Укажите контакт — пришлем актуальные сплиты по гео и конверсиям.
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
                >
                  <div className="w-12 h-12 rounded-full bg-[#e63558]/20 flex items-center justify-center text-[#e63558] mb-3">
                    <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-base text-white">
                    Запрос принят!
                  </h3>
                  <p className="text-xs text-white/70 mt-1 max-w-[280px]">
                    Материалы и бенчмарки отправлены команде. Мы свяжемся с Вами в ближайшее время.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setName("");
                      setCompanyRole("");
                      setContact("");
                    }}
                    className="mt-4 text-[11px] font-mono text-[#e63558] hover:underline uppercase tracking-wider"
                  >
                    Отправить ещё один контакт
                  </button>
                </motion.div>
              ) : (
                <form key="capture-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {/* 1. ФИО / Позывной */}
                  <div>
                    <label htmlFor="hub-name" className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1">
                      ФИО / Позывной <span className="text-[#e63558]">*</span>
                    </label>
                    <input
                      id="hub-name"
                      type="text"
                      required
                      placeholder="Имя или никнейм"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e63558] focus:ring-1 focus:ring-[#e63558] transition-colors"
                    />
                  </div>

                  {/* 2. Компания и роль */}
                  <div>
                    <label htmlFor="hub-company" className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1">
                      Компания и роль
                    </label>
                    <input
                      id="hub-company"
                      type="text"
                      placeholder="e.g. Head of UA @ Studio"
                      value={companyRole}
                      onChange={(e) => setCompanyRole(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e63558] focus:ring-1 focus:ring-[#e63558] transition-colors"
                    />
                  </div>

                  {/* 3. Telegram или Email */}
                  <div>
                    <label htmlFor="hub-contact" className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1">
                      Telegram или Email <span className="text-[#e63558]">*</span>
                    </label>
                    <input
                      id="hub-contact"
                      type="text"
                      required
                      placeholder="@handle или email@domain.com"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e63558] focus:ring-1 focus:ring-[#e63558] transition-colors"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-xs text-rose-400 mt-1">{errorMessage}</p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-2 w-full min-h-[46px] rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 hover:border-[#e63558]/50 text-white font-display font-bold text-sm tracking-wide transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Отправка запроса...</span>
                      </>
                    ) : (
                      <>
                        <span>Получить материалы</span>
                        <span className="text-[#e63558] font-bold">→</span>
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
          <p className="font-mono text-[11px] text-white/35 tracking-wider">
            UPRAISER Agency LLP · London · Since 2017
          </p>
          <p className="font-mono text-[10px] text-white/20 mt-1">
            Private Conference Access Point · Unlisted
          </p>
        </footer>
      </div>
    </main>
  );
}

export default ConferenceHubPage;
