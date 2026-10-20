import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { contactPage } from "../data/liveContent";
import { Magnetic } from "./motion-preview/Magnetic";
import { AccentWord } from "./AccentWord";
import { GradientTraceBorder } from "./GradientTraceBorder";
import { ContactFormField } from "./ContactFormField";
import { supabase } from "../lib/supabaseClient";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/msword", // .doc
  "application/vnd.ms-excel", // .xls
  "text/csv",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

type FormState = {
  name: string;
  email: string;
  appId: string;
  geos: string;
  companyType: string;
  companySize: string;
  monthlyBudget: string;
  notes: string;
  attachment: File | null;
};

type FormErrors = Partial<Record<keyof FormState, string>> & {
  privacyAccepted?: string;
};

type SubmitStatus = "idle" | "loading" | "error";

const initialForm: FormState = {
  name: "",
  email: "",
  appId: "",
  geos: "",
  companyType: "brand",
  companySize: "boutique",
  monthlyBudget: "pilot",
  notes: "",
  attachment: null,
};

const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
const tgBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined;
const tgChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined;

function escapeTgHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendTelegramNotification(state: FormState): Promise<boolean> {
  if (!tgBotToken || !tgChatId) return false;
  try {
    const text = [
      `🚀 <b>New UPRAISER Pilot Request</b>`,
      ``,
      `👤 <b>Name:</b> ${escapeTgHtml(state.name)}`,
      `📧 <b>Email:</b> ${escapeTgHtml(state.email)}`,
      `📱 <b>App / Store:</b> ${escapeTgHtml(state.appId)}`,
      `🌍 <b>GEOs:</b> ${escapeTgHtml(state.geos || "Worldwide / unspecified")}`,
      `🏢 <b>Company Type:</b> ${escapeTgHtml(state.companyType)}`,
      `👥 <b>Company Size:</b> ${escapeTgHtml(state.companySize)}`,
      `💰 <b>Monthly Spend:</b> ${escapeTgHtml(state.monthlyBudget)}`,
      state.notes ? `📝 <b>Notes:</b> ${escapeTgHtml(state.notes)}` : null,
      state.attachment ? `📎 <b>Attachment:</b> ${escapeTgHtml(state.attachment.name)}` : null,
    ].filter(Boolean).join("\n");

    const res = await fetch(`https://api.telegram.org/bot${tgBotToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: tgChatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (state.attachment) {
      const docData = new FormData();
      docData.append("chat_id", tgChatId);
      docData.append("document", state.attachment);
      docData.append("caption", `📎 Brief attachment from ${state.name} (${state.email})`);
      await fetch(`https://api.telegram.org/bot${tgBotToken}/sendDocument`, {
        method: "POST",
        body: docData,
      });
    }

    return res.ok;
  } catch (err) {
    console.error("Telegram ping notification error:", err);
    return false;
  }
}

export function Contact() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const abortCtrl = useRef<AbortController | null>(null);
  useEffect(() => {
    return () => {
      if (abortCtrl.current) abortCtrl.current.abort();
    };
  }, []);

  const validate = () => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Required";
    if (!form.email.trim()) next.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Invalid email";
    if (!form.appId.trim()) next.appId = "Required";
    if (!privacyAccepted) next.privacyAccepted = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setSubmitError(null);
    if (!validate()) return;

    setStatus("loading");
    setSubmitError(null);

    if (abortCtrl.current) {
      abortCtrl.current.abort();
    }
    abortCtrl.current = new AbortController();

    try {
      const tgPromise = sendTelegramNotification(form);

      let filePath: string | null = null;

      // 1. If file attached & Supabase configured, upload directly to temp-briefs bucket
      if (form.attachment && supabase) {
        try {
          const fileExt = form.attachment.name.split(".").pop() || "bin";
          filePath = `brief-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("temp-briefs")
            .upload(filePath, form.attachment);

          if (uploadError) {
            console.warn("Supabase upload failed, proceeding with server fallback:", uploadError.message);
            filePath = null;
          }
        } catch (uploadErr) {
          console.warn("Supabase direct upload exception:", uploadErr);
          filePath = null;
        }
      }

      // 2. Primary: Send to Vercel Serverless Function /api/contact (Resend Email with Attachment)
      let serverSent = false;
      let serverErrorMsg: string | null = null;
      try {
        const payload = {
          name: form.name,
          email: form.email,
          appId: form.appId,
          geos: form.geos,
          companyType: form.companyType,
          companySize: form.companySize,
          monthlyBudget: form.monthlyBudget,
          notes: form.notes,
          filePath,
          fileName: form.attachment ? form.attachment.name : null,
          fileType: form.attachment ? form.attachment.type : null,
          fileSize: form.attachment ? form.attachment.size : null,
        };

        const serverRes = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: abortCtrl.current.signal,
        });

        if (serverRes.ok) {
          const resData = (await serverRes.json().catch(() => ({}))) as { ok?: boolean; error?: string };
          if (resData.ok) {
            serverSent = true;
          } else {
            serverErrorMsg = resData.error || "Email delivery failed";
          }
        } else {
          const errData = (await serverRes.json().catch(() => ({}))) as { error?: string };
          serverErrorMsg = errData.error || `Server responded with ${serverRes.status}`;
        }
      } catch (err) {
        console.warn("Direct /api/contact call failed or running in non-Vercel dev:", err);
      }

      // 3. Fallback: If /api/contact did not handle it, try Web3Forms
      let web3Sent = false;
      if (!serverSent && accessKey) {
        try {
          const formData = new FormData();
          formData.append("access_key", accessKey);
          formData.append("subject", `UPRAISER Pilot Request - ${form.appId}`);
          formData.append("from_name", form.name);
          formData.append("email", form.email);
          formData.append("replyto", form.email);
          formData.append("app_url", form.appId);
          formData.append("geos", form.geos);
          formData.append("company_type", form.companyType);
          formData.append("company_size", form.companySize);
          formData.append("monthly_budget", form.monthlyBudget);
          formData.append("notes", form.notes);
          formData.append("privacy_policy_accepted", "Yes");
          if (form.attachment) {
            formData.append(
              "attachment_notice",
              `User attached file: ${form.attachment.name} (${(form.attachment.size / 1024).toFixed(0)} KB)`
            );
          }

          const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { Accept: "application/json" },
            body: formData,
            signal: abortCtrl.current.signal,
          });
          const data = (await response.json().catch(() => ({}))) as { success?: boolean };
          if (response.ok && data.success) {
            web3Sent = true;
          }
        } catch (web3Err) {
          console.warn("Web3Forms fallback error:", web3Err);
        }
      }

      const tgDelivered = await tgPromise;

      if (serverSent || web3Sent || tgDelivered) {
        setForm(initialForm);
        setPrivacyAccepted(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        navigate("/contact/sent", { replace: true });
        return;
      }

      setStatus("error");
      setSubmitError(serverErrorMsg || "Unable to send message. Please try again.");
    } catch (err) {
      setStatus("error");
      setSubmitError(err instanceof Error ? err.message : "Network error. Please check your connection and try again.");
    }
  };

  const ctaRow = [
    { label: "The Agency", href: "/#audience" },
    { label: "See Cases", href: "/#cases" },
    { label: "The Routes", href: "/#routes" },
    { label: "The Expedition", href: "/#about-us" },
  ];

  return (
    <div className="depth-page depth-page--contact viewport-page">
      <div className="section-inner contact-page-shell">
            <div className="strip-beam-wrap contact-briefing-card relative w-full rounded-[0_1.5rem_0_1.5rem] border border-border bg-bg-card shadow-xl">
              <GradientTraceBorder
                className="z-20"
                duration={3.4}
                strokeWidth={1.5}
                colorFrom="var(--theme-accent-light)"
                colorTo="var(--color-magenta)"
              />
              <div className="contact-briefing-grid relative z-[1]">
                <div data-lenis-prevent className="contact-briefing-copy relative flex flex-col bg-bg-elevated">
                  <h1 className="section-title section-title--compact">
                    {contactPage.titleLead}
                    <AccentWord tone="red">{contactPage.accentWord}</AccentWord>
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {ctaRow.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="link-caps rounded-full border border-border px-3 py-1.5 text-fg transition-colors hover:border-accent hover:text-accent"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="contact-sidebar hidden md:flex flex-col">
                    <div>
                      <h2 className="contact-sidebar__title">{t("misc.basecamp", "Basecamp London")}</h2>
                      <address className="copy mt-2 space-y-1 not-italic">
                        <p className="font-medium text-fg">Upraiser Agency LLP</p>
                        <p>128 City Road, London EC1V 2NX</p>
                        <p>{t("misc.uk", "United Kingdom")}</p>
                      </address>
                    </div>
                    <div>
                      <p className="copy">
                        <span className="font-bold text-fg">{t("misc.directComm", "Direct Communications")}:</span>{" "}
                        <a href="mailto:info@upraiser.co.uk" className="text-fg underline hover:text-accent">
                          info@upraiser.co.uk
                        </a>
                      </p>
                      <p className="mt-2 text-xs font-bold tracking-wider uppercase text-accent">
                        Upraising the standard of digital advertising since 2017
                      </p>
                    </div>
                    <div>
                      <h2 className="contact-sidebar__title">{t("misc.verifiedComp", "Verified Compliance & Partners")}</h2>
                      <ul className="copy mt-2 space-y-3">
                        <li>
                          <strong className="font-medium text-fg">Official Lenovo Partner:</strong> We work directly
                          with Lenovo PC HK LTD to secure procurement-grade OEM ROM and PAI lanes, avoiding competitive
                          ad re-selling.
                        </li>
                        <li>
                          <strong className="font-medium text-fg">EDAA Alignment:</strong> Upraiser voluntarily
                          implements the European Digital Advertising Alliance self-restriction recommendations for
                          global targeting.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div data-lenis-prevent className="contact-briefing-form flex min-h-0 flex-col">
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-1 flex-col gap-2"
                      noValidate
                      aria-busy={status === "loading"}
                    >
                      <AnimatePresence>
                        {status === "error" && submitError ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0, scale: 0.95 }}
                            animate={{ height: "auto", opacity: 1, scale: 1 }}
                            exit={{ height: 0, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                            className="text-caption shrink-0 overflow-hidden rounded-xl border border-magenta/30 bg-magenta/5 px-3 py-2 text-magenta-light"
                            role="alert"
                          >
                            {submitError}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <ContactFormField label="Name & Title *" id="name" error={errors.name} disabled={status === "loading"}>
                          <input
                            type="text"
                            autoComplete="name"
                            enterKeyHint="next"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                        </ContactFormField>

                        <ContactFormField label="Corporate Work Email *" id="email" error={errors.email} disabled={status === "loading"}>
                          <input
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            enterKeyHint="next"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                          />
                        </ContactFormField>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <ContactFormField label="Production App ID / Store URL *" id="appId" error={errors.appId} disabled={status === "loading"}>
                          <input
                            type="text"
                            autoComplete="url"
                            enterKeyHint="next"
                            value={form.appId}
                            onChange={(e) => setForm({ ...form, appId: e.target.value })}
                          />
                        </ContactFormField>

                        <ContactFormField label="Target GEOs" id="geos" disabled={status === "loading"}>
                          <input type="text" enterKeyHint="next" value={form.geos} onChange={(e) => setForm({ ...form, geos: e.target.value })} />
                        </ContactFormField>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <ContactFormField label="Company Type" id="companyType" disabled={status === "loading"}>
                          <select value={form.companyType} onChange={(e) => setForm({ ...form, companyType: e.target.value })}>
                            <option value="brand">App Brand / Developer</option>
                            <option value="agency">{t("misc.agencyPartner", "Agency Partner")}</option>
                            <option value="vendor">Ad Tech / Supply Partner</option>
                          </select>
                        </ContactFormField>

                        <ContactFormField label="Company Size" id="companySize" disabled={status === "loading"}>
                          <select value={form.companySize} onChange={(e) => setForm({ ...form, companySize: e.target.value })}>
                            <option value="boutique">1 to 15 employees</option>
                            <option value="under50">15 to 50 employees</option>
                            <option value="mid">50 to 200 employees</option>
                            <option value="scale">200 to 500 employees</option>
                            <option value="enterprise">500+ employees</option>
                          </select>
                        </ContactFormField>
                      </div>

                      <ContactFormField label={t("contactPage.form.spend", "Average Monthly Media Spend")} id="monthlyBudget" disabled={status === "loading"}>
                        <select value={form.monthlyBudget} onChange={(e) => setForm({ ...form, monthlyBudget: e.target.value })}>
                          <option value="pilot">Under $25,000 (Pilot Testing Only)</option>
                          <option value="growth">$25,000 to $100,000</option>
                          <option value="scaling">$100,000 to $500,000</option>
                          <option value="enterprise">$500,000+</option>
                        </select>
                      </ContactFormField>

                      <ContactFormField label="Details" id="notes" disabled={status === "loading"} expand={true}>
                        <textarea enterKeyHint="done" maxLength={250} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                      </ContactFormField>

                      <div className="mt-0.5 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="attachment"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.webp"
                          disabled={status === "loading"}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > MAX_FILE_SIZE) {
                                setErrors((prev) => ({ ...prev, attachment: "File must be under 10 MB" }));
                                e.target.value = "";
                                return;
                              }
                              if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
                                setErrors((prev) => ({ ...prev, attachment: "Allowed formats: PDF, Word, Excel, CSV, TXT, PNG, JPG" }));
                                e.target.value = "";
                                return;
                              }
                            }
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.attachment;
                              return next;
                            });
                            setForm({ ...form, attachment: file || null });
                          }}
                        />
                        {form.attachment ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-caption flex items-center gap-1.5 text-fg font-medium">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                              <span className="max-w-[180px] sm:max-w-[260px] truncate">{form.attachment.name}</span>
                              <span className="text-muted text-[11px]">({(form.attachment.size / 1024).toFixed(0)} KB)</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setForm((prev) => ({ ...prev, attachment: null }));
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="text-xs text-muted hover:text-accent p-1 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Remove attached file"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                              <span>Remove</span>
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="attachment"
                            className={`text-caption flex cursor-pointer items-center gap-1.5 text-muted transition hover:text-fg ${status === "loading" ? "pointer-events-none opacity-50" : ""}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                            Attach brief (.pdf, .doc, .xlsx, .png, etc.) | max 10MB
                          </label>
                        )}
                        </div>
                        {errors.attachment ? (
                          <p className="text-caption text-magenta-light" role="alert">
                            {errors.attachment}
                          </p>
                        ) : null}
                      </div>

                      <label className="text-caption mt-1 flex shrink-0 items-start gap-2 text-muted">
                        <input
                          type="checkbox"
                          className="mt-0.5"
                          checked={privacyAccepted}
                          onChange={(e) => setPrivacyAccepted(e.target.checked)}
                          disabled={status === "loading"}
                        />
                        <span>
                          I agree to the{" "}
                          <Link to="/privacy" className="underline hover:text-fg">
                            Privacy Policy
                          </Link>
                          {errors.privacyAccepted ? <span className="ml-1 text-magenta-light">· Required</span> : null}
                        </span>
                      </label>

                      <Magnetic className="mt-2 w-full shrink-0">
                        <motion.button
                          type="submit"
                          disabled={status === "loading"}
                          whileTap={status !== "loading" ? { scale: 0.96 } : undefined}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                          data-cursor="cta"
                          className="btn-caps btn-caps--primary w-full rounded-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {status === "loading" ? t("contactPage.form.transmitting", "Transmitting…") : t("contactPage.ctaLabel", contactPage.ctaLabel)}
                        </motion.button>
                      </Magnetic>
                    </form>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
}
