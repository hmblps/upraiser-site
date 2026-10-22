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

    document.title = "UPRAISER · Conference Network Hub";

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
  const [position, setPosition] = useState("");
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
        appId: position.trim() || "Conference Attendee",
        geos: "Conference On-Site",
        companyType: "Conference Networking Lead",
        companySize: "On-Site Contact",
        monthlyBudget: "Media Deck Request",
        notes: `[CONFERENCE QR LEAD]\nName: ${name.trim()}\nCompany & Role: ${position.trim() || "Not specified"}\nPreferred Contact: ${contact.trim()}`,
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

        // Fallback to Web3Forms if /api/contact reported error
        const accessKey = "260b2ece-07ce-4a41-8136-88bb30545e23";
        const fd = new FormData();
        fd.append("access_key", accessKey);
        fd.append("subject", `Conference Lead: ${name.trim()} (${position.trim() || "Direct"})`);
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
          setErrorMessage("Failed to send. Please reach out via Telegram or Email directly.");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage("Network issue. Please connect directly via the buttons above.");
      }
    },
    [name, position, contact]
  );

  return (
    <main
      className="relative min-h-[100dvh] w-full overflow-x-hidden text-white flex flex-col items-center justify-between selection:bg-[#e63558] selection:text-white"
      style={{ backgroundColor: "#050504" }}
    >
      {/* 1. Ambient Background: BrandAurora Veil + Static SiteGrain Overlay */}
      <BrandAurora tone="contact" className="opacity-45 pointer-events-none" />
      <div
        className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full blur-[120px] opacity-25"
        style={{ background: "radial-gradient(circle, #e63558 0%, transparent 70%)" }}
        aria-hidden
      />
      <SiteGrain />

      {/* 2. Centered Mobile-First Stack: max-width 420px */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto px-4 py-8 sm:py-10 flex flex-col items-center">
        {/* ============================================================== */}
        {/* SECTION 1: BRAND HEADER                                         */}
        {/* ============================================================== */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center text-center"
        >
          {/* Logo & Mark */}
          <Link
            to="/"
            className="group flex flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#e63558] rounded-xl p-1"
            title="UPRAISER Home"
          >
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_20px_rgba(230,53,88,0.15)] group-hover:border-[#e63558]/40 transition-colors">
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
          <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e63558]/10 border border-[#e63558]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e63558] animate-pulse" />
            <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#e63558] uppercase">
              CHARTING THE ASCENT
            </span>
          </div>

          {/* Tagline */}
          <p className="mt-3 text-xs sm:text-[13px] text-white/70 font-normal leading-relaxed text-center max-w-[360px]">
            Pre-bid filtration, official Lenovo OEM distribution, and 0% log drift.
          </p>
        </motion.header>

        {/* ============================================================== */}
        {/* SECTION 2: PRIMARY CONTACT ACTION (TOP PRIORITY .VCF)            */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6"
        >
          <a
            href="/contact.vcf"
            download="upraiser.vcf"
            className="group relative flex items-center justify-center gap-3 w-full min-h-[52px] px-6 py-3.5 rounded-xl bg-[#e63558] text-[#050504] font-display font-extrabold text-sm sm:text-[15px] uppercase tracking-wider shadow-[0_0_28px_rgba(230,53,88,0.45)] hover:shadow-[0_0_36px_rgba(230,53,88,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all select-none cursor-pointer"
          >
            {/* Contact vCard Icon */}
            <svg
              className="w-5 h-5 text-[#050504] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Save Contact to Phone (.vcf)</span>
          </a>
        </motion.div>

        {/* ============================================================== */}
        {/* SECTION 3: DIRECT TEAM ROSTER (ON-SITE REACH)                   */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-7 flex flex-col"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
              Direct Team
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ON-SITE NOW
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* CARD 1: Alex / Founder */}
            <article className="w-full p-4 rounded-xl bg-white/[0.035] border border-white/10 backdrop-blur-md shadow-lg flex flex-col gap-3 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-white tracking-tight">
                    Alex
                  </h3>
                  <p className="text-xs font-mono text-[#e63558] font-medium tracking-wide">
                    Founder & Lead
                  </p>
                </div>
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest bg-white/[0.04] px-2 py-0.5 rounded border border-white/5">
                  UPRAISER
                </span>
              </div>

              {/* Direct Touch Action Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-0.5">
                {/* Telegram */}
                <a
                  href="https://t.me/alex_upraiser"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-lg bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/30 text-xs font-bold font-mono transition-colors active:scale-95"
                  title="Open Telegram"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                  <span>Telegram</span>
                </a>

                {/* Email */}
                <a
                  href="mailto:alex@upraiser.co.uk"
                  className="flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/90 border border-white/15 text-xs font-bold font-mono transition-colors active:scale-95"
                  title="Send Email"
                >
                  <svg className="w-4 h-4 text-white/80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <polyline points="3 7 12 13 21 7" />
                  </svg>
                  <span>Email</span>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/?text=Hi%20Alex,%20connecting%20from%20the%20conference!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 text-xs font-bold font-mono transition-colors active:scale-95"
                  title="Open WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.31 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </article>

            {/* CARD 2: Partner / Colleague */}
            <article className="w-full p-4 rounded-xl bg-white/[0.035] border border-white/10 backdrop-blur-md shadow-lg flex flex-col gap-3 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-white tracking-tight">
                    Leadership Team
                  </h3>
                  <p className="text-xs font-mono text-[#e63558] font-medium tracking-wide">
                    Operations & Growth
                  </p>
                </div>
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest bg-white/[0.04] px-2 py-0.5 rounded border border-white/5">
                  UPRAISER
                </span>
              </div>

              {/* Direct Touch Action Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-0.5">
                {/* Telegram */}
                <a
                  href="https://t.me/alex_upraiser"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-lg bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/30 text-xs font-bold font-mono transition-colors active:scale-95"
                  title="Open Telegram"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                  <span>Telegram</span>
                </a>

                {/* Email */}
                <a
                  href="mailto:ceo@upraiser.co.uk"
                  className="flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/90 border border-white/15 text-xs font-bold font-mono transition-colors active:scale-95"
                  title="Send Email"
                >
                  <svg className="w-4 h-4 text-white/80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <polyline points="3 7 12 13 21 7" />
                  </svg>
                  <span>Email</span>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/?text=Hi,%20connecting%20from%20the%20conference!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 text-xs font-bold font-mono transition-colors active:scale-95"
                  title="Open WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.31 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </article>
          </div>
        </motion.section>

        {/* ============================================================== */}
        {/* SECTION 4: ESSENTIAL AGENCY LINKS                               */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6 flex flex-col gap-2.5"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45 px-1">
            Experience & Showcase
          </span>

          {/* Button 1: Explore The Routes (3D Showcase) */}
          <Link
            to="/channels?utm_source=qr_wallet"
            className="flex items-center justify-between w-full min-h-[48px] px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#e63558]/40 transition-all text-left group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#e63558]/15 text-[#e63558] border border-[#e63558]/30">
                <svg className="w-4 h-4 fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-white group-hover:text-[#e63558] transition-colors">
                  Explore The Routes (3D Showcase)
                </span>
                <span className="text-[11px] text-white/50">
                  Interactive supply pathways & direct ROM de-drift
                </span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Button 2: Official Website */}
          <a
            href="https://upraiser.co.uk"
            className="flex items-center justify-between w-full min-h-[48px] px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 transition-all text-left group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.06] text-white/80 border border-white/15">
                <svg className="w-4 h-4 fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-white group-hover:text-white/90 transition-colors">
                  Official Website
                </span>
                <span className="text-[11px] text-white/50">upraiser.co.uk</span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0"
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
        {/* SECTION 5: CONFERENCE LEAD CAPTURE FORM ("GET MEDIA DECK")      */}
        {/* ============================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-7"
        >
          <div className="w-full rounded-2xl p-5 sm:p-6 bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Subtle top edge highlight */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(230,53,88,0.5) 50%, transparent 100%)",
              }}
            />

            <div className="flex flex-col mb-4">
              <h2 className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight">
                Get Media Deck & Case Studies
              </h2>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Instant delivery of verified client decks, benchmarks & OEM telemetry.
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
                    Request Received!
                  </h3>
                  <p className="text-xs text-white/70 mt-1 max-w-[280px]">
                    We've routed Your request to our leadership team. We'll follow up shortly with the deck and telemetry logs.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setName("");
                      setPosition("");
                      setContact("");
                    }}
                    className="mt-4 text-[11px] font-mono text-[#e63558] hover:underline uppercase tracking-wider"
                  >
                    Send another request
                  </button>
                </motion.div>
              ) : (
                <form key="capture-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="hub-name" className="block text-[11px] font-mono text-white/50 uppercase tracking-wider mb-1">
                      Full Name <span className="text-[#e63558]">*</span>
                    </label>
                    <input
                      id="hub-name"
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e63558] focus:ring-1 focus:ring-[#e63558] transition-colors"
                    />
                  </div>

                  {/* Company & Position */}
                  <div>
                    <label htmlFor="hub-position" className="block text-[11px] font-mono text-white/50 uppercase tracking-wider mb-1">
                      Company & Role
                    </label>
                    <input
                      id="hub-position"
                      type="text"
                      placeholder="e.g. Head of UA @ Rovio"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e63558] focus:ring-1 focus:ring-[#e63558] transition-colors"
                    />
                  </div>

                  {/* Contact (Email or Telegram) */}
                  <div>
                    <label htmlFor="hub-contact" className="block text-[11px] font-mono text-white/50 uppercase tracking-wider mb-1">
                      Email or Telegram <span className="text-[#e63558]">*</span>
                    </label>
                    <input
                      id="hub-contact"
                      type="text"
                      required
                      placeholder="e.g. alex@company.com or @handle"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e63558] focus:ring-1 focus:ring-[#e63558] transition-colors"
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
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Send to Me</span>
                        <svg className="w-4 h-4 text-[#e63558]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ============================================================== */}
        {/* SECTION 6: FOOTER                                              */}
        {/* ============================================================== */}
        <footer className="w-full mt-10 pt-6 border-t border-white/5 flex flex-col items-center text-center">
          <p className="font-mono text-[11px] text-white/30 tracking-wider">
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
