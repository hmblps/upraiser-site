import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { contactPage } from "../data/liveContent";
import { Magnetic } from "./motion-preview/Magnetic";
import { AccentWord } from "./AccentWord";
import { GradientTraceBorder } from "./GradientTraceBorder";
import { ContactFormField } from "./ContactFormField";
import { PrivacyModal } from "./PrivacyModal";
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
  attachments: File[];
};

type FormErrors = Partial<Record<keyof FormState, string>> & {
  privacyAccepted?: string;
  attachment?: string;
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
  attachments: [],
};

const DRAFT_STORAGE_KEY = "upraiser_contact_draft_v1";

type FormDraft = {
  name?: string;
  email?: string;
  appId?: string;
  geos?: string;
  companyType?: string;
  companySize?: string;
  monthlyBudget?: string;
  notes?: string;
  privacyAccepted?: boolean;
};

function readDraft(): FormDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as FormDraft;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function writeDraft(data: FormDraft) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
const tgBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined;
const tgChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined;

function escapeTgHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type UploadedBriefFile = {
  name: string;
  size: number;
  type: string;
  filePath: string;
  url: string;
};

async function sendTelegramNotification(
  state: FormState,
  files?: UploadedBriefFile[]
): Promise<boolean> {
  if (!tgBotToken || !tgChatId) return false;
  try {
    const filesText =
      files && files.length > 0
        ? `📎 <b>Attached Briefs (${files.length}):</b>\n` +
          files
            .map(
              (f, i) =>
                `  ${i + 1}. <a href="${f.url}">${escapeTgHtml(f.name)}</a> (${(f.size / 1024).toFixed(0)} KB)`
            )
            .join("\n")
        : null;

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
      filesText,
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

    return res.ok;
  } catch (err) {
    console.error("Telegram ping notification error:", err);
    return false;
  }
}

export function Contact() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sourceParam = searchParams.get("source") || (location.state as { source?: string } | null)?.source;
  const isFromStudio = sourceParam === "studio" || Boolean((location.state as { fromStudio?: boolean } | null)?.fromStudio);

  useEffect(() => {
    if (isFromStudio) {
      sessionStorage.setItem("upraiser_contact_source", "studio");
    }
  }, [isFromStudio]);

  const [form, setForm] = useState<FormState>(() => {
    const draft = readDraft();
    if (!draft) return initialForm;
    return {
      ...initialForm,
      name: typeof draft.name === "string" ? draft.name : initialForm.name,
      email: typeof draft.email === "string" ? draft.email : initialForm.email,
      appId: typeof draft.appId === "string" ? draft.appId : initialForm.appId,
      geos: typeof draft.geos === "string" ? draft.geos : initialForm.geos,
      companyType: typeof draft.companyType === "string" ? draft.companyType : initialForm.companyType,
      companySize: typeof draft.companySize === "string" ? draft.companySize : initialForm.companySize,
      monthlyBudget: typeof draft.monthlyBudget === "string" ? draft.monthlyBudget : initialForm.monthlyBudget,
      notes: typeof draft.notes === "string" ? draft.notes : initialForm.notes,
      attachments: [],
    };
  });
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(() => {
    const draft = readDraft();
    return typeof draft?.privacyAccepted === "boolean" ? draft.privacyAccepted : false;
  });
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const abortCtrl = useRef<AbortController | null>(null);
  useEffect(() => {
    return () => {
      if (abortCtrl.current) abortCtrl.current.abort();
    };
  }, []);

  // Continuously persist form draft to sessionStorage so navigating to privacy or reloading never resets progress
  useEffect(() => {
    writeDraft({
      name: form.name,
      email: form.email,
      appId: form.appId,
      geos: form.geos,
      companyType: form.companyType,
      companySize: form.companySize,
      monthlyBudget: form.monthlyBudget,
      notes: form.notes,
      privacyAccepted,
    });
  }, [
    form.name,
    form.email,
    form.appId,
    form.geos,
    form.companyType,
    form.companySize,
    form.monthlyBudget,
    form.notes,
    privacyAccepted,
  ]);

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
      let uploadedFiles: UploadedBriefFile[] = [];

      // 1. If files attached & Supabase configured, upload all files in parallel
      if (form.attachments.length > 0 && supabase) {
        const client = supabase;
        try {
          const uploadPromises = form.attachments.map(async (file) => {
            const fileExt = file.name.split(".").pop() || "bin";
            const randomSuffix = Math.random().toString(36).substring(2, 9);
            const filePath = `brief-${Date.now()}-${randomSuffix}.${fileExt}`;

            const { error: uploadError } = await client.storage
              .from("temp-briefs")
              .upload(filePath, file, { cacheControl: "3600", upsert: false });

            if (uploadError) {
              console.warn(`Supabase upload failed for ${file.name}:`, uploadError.message);
              return null;
            }

            const { data: pubData } = client.storage.from("temp-briefs").getPublicUrl(filePath);
            return {
              name: file.name,
              size: file.size,
              type: file.type,
              filePath,
              url: pubData?.publicUrl || "",
            };
          });

          const results = await Promise.all(uploadPromises);
          uploadedFiles = results.filter((r): r is UploadedBriefFile => r !== null && Boolean(r.url));
        } catch (uploadErr) {
          console.warn("Supabase multi-upload exception:", uploadErr);
        }
      }

      const tgPromise = sendTelegramNotification(form, uploadedFiles);

      // 2. Primary: Send to Vercel Serverless Function /api/contact (Resend Email with Attachment)
      let serverSent = false;
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
          files: uploadedFiles,
          filePath: uploadedFiles[0]?.filePath || null,
          fileUrl: uploadedFiles[0]?.url || null,
          fileName: uploadedFiles[0]?.name || null,
          fileType: uploadedFiles[0]?.type || null,
          fileSize: uploadedFiles[0]?.size || null,
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
          }
        }
      } catch (err) {
        console.warn("Direct /api/contact call failed or running in non-Vercel dev:", err);
      }

      // 3. Fallback: If /api/contact did not handle it, try Web3Forms
      let web3Sent = false;
      if (!serverSent && accessKey) {
        try {
          const keys = accessKey.split(/[,;]/).map((k) => k.trim()).filter(Boolean);
          const results = await Promise.allSettled(
            keys.map(async (key) => {
              const formData = new FormData();
              formData.append("access_key", key);
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

              // CRITICAL: NEVER use reserved field name "attachment" which triggers Web3Forms Pro paywall!
              if (uploadedFiles.length > 0) {
                uploadedFiles.forEach((f, idx) => {
                  formData.append(`file_${idx + 1}_name`, f.name);
                  formData.append(`file_${idx + 1}_download_url`, f.url);
                });
                formData.append(
                  "brief_files_summary",
                  uploadedFiles
                    .map((f, idx) => `${idx + 1}. ${f.name} (${(f.size / 1024).toFixed(0)} KB) — Direct Download: ${f.url}`)
                    .join("\n")
                );
              } else if (form.attachments.length > 0) {
                formData.append(
                  "brief_files_notice",
                  form.attachments.map((f, idx) => `${idx + 1}. ${f.name} (${(f.size / 1024).toFixed(0)} KB)`).join(", ")
                );
              }

              const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { Accept: "application/json" },
                body: formData,
                signal: abortCtrl.current?.signal,
              });
              const data = (await response.json().catch(() => ({}))) as { success?: boolean };
              return Boolean(response.ok && data.success);
            })
          );

          if (results.some((r) => r.status === "fulfilled" && r.value)) {
            web3Sent = true;
          }
        } catch (web3Err) {
          console.warn("Web3Forms fallback error:", web3Err);
        }
      }

      const tgDelivered = await tgPromise;

      if (serverSent || web3Sent || tgDelivered) {
        clearDraft();
        setForm(initialForm);
        setPrivacyAccepted(false);
        if (fileInputRef.current) fileInputRef.current.value = "";

        const wasStudio =
          isFromStudio || sessionStorage.getItem("upraiser_contact_source") === "studio";
        sessionStorage.removeItem("upraiser_contact_source");

        if (wasStudio) {
          sessionStorage.setItem("upraiser_studio_submitted", "1");
          navigate("/contact/sent?source=studio", { replace: true, state: { source: "studio" } });
        } else {
          navigate("/contact/sent", { replace: true });
        }
        return;
      }

      setStatus("error");
      setSubmitError("Unable to transmit brief. Please try again or email us directly at info@upraiser.co.uk.");
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

                  <div className="mt-4 flex items-center gap-1.5 sm:gap-2 overflow-x-auto sm:flex-wrap no-scrollbar -mx-1 px-1 sm:mx-0 sm:px-0 py-0.5">
                    {ctaRow.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="link-caps inline-flex items-center shrink-0 rounded-full border border-border px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs text-fg transition-colors hover:border-accent hover:text-accent whitespace-nowrap relative after:absolute after:inset-x-0 after:-inset-y-2 after:content-['']"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="contact-sidebar hidden md:flex flex-col flex-1">
                    <div className="space-y-4">
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
                      </div>
                    </div>

                    <div className="mt-8 md:mt-auto pt-6 border-t border-border/60">
                      <p className="text-xs font-bold tracking-wider uppercase text-accent mb-3">
                        Upraising the standard of digital advertising since 2017
                      </p>
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

                      <div className="mt-0.5 flex flex-col gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="attachment"
                          className="hidden"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.webp"
                          disabled={status === "loading"}
                          onChange={(e) => {
                            const chosen = Array.from(e.target.files || []);
                            if (chosen.length === 0) return;

                            const current = [...form.attachments];
                            let errorMsg: string | null = null;

                            for (const file of chosen) {
                              if (current.length >= 5) {
                                errorMsg = "Maximum 5 files allowed";
                                break;
                              }
                              if (file.size > MAX_FILE_SIZE) {
                                errorMsg = `${file.name} exceeds 10 MB limit`;
                                continue;
                              }
                              if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
                                errorMsg = `${file.name}: format not supported`;
                                continue;
                              }
                              if (!current.some((f) => f.name === file.name && f.size === file.size)) {
                                current.push(file);
                              }
                            }

                            setErrors((prev) => {
                              const next = { ...prev };
                              if (errorMsg) next.attachment = errorMsg;
                              else delete next.attachment;
                              return next;
                            });

                            setForm({ ...form, attachments: current });
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                        />

                        {form.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {form.attachments.map((file, idx) => (
                              <div
                                key={`${file.name}-${idx}`}
                                className="flex items-center gap-1.5 rounded-lg border border-border bg-bg-surface px-2.5 py-1 text-xs"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0">
                                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                                </svg>
                                <span className="max-w-[140px] sm:max-w-[200px] truncate font-medium text-fg">{file.name}</span>
                                <span className="text-muted text-[10px]">({(file.size / 1024).toFixed(0)} KB)</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setForm((prev) => ({
                                      ...prev,
                                      attachments: prev.attachments.filter((_, i) => i !== idx),
                                    }));
                                  }}
                                  className="text-muted hover:text-accent p-0.5 ml-1 transition-colors cursor-pointer"
                                  title={`Remove ${file.name}`}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {form.attachments.length < 5 && (
                          <label
                            htmlFor="attachment"
                            className={`text-caption flex cursor-pointer items-center gap-1.5 text-muted transition hover:text-fg ${status === "loading" ? "pointer-events-none opacity-50" : ""}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                            </svg>
                            {form.attachments.length === 0
                              ? "Attach briefs, data or screenshots (.pdf, .png, .xlsx, etc.) | up to 5 files (max 10MB each)"
                              : "+ Add another file (up to 5)"}
                          </label>
                        )}

                        {errors.attachment ? (
                          <p className="text-caption text-magenta-light" role="alert">
                            {errors.attachment}
                          </p>
                        ) : null}
                      </div>

                      <div className="text-caption mt-1 flex shrink-0 items-start gap-2 text-muted">
                        <input
                          id="privacy-checkbox"
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-accent cursor-pointer"
                          checked={privacyAccepted}
                          onChange={(e) => {
                            setPrivacyAccepted(e.target.checked);
                            if (e.target.checked && errors.privacyAccepted) {
                              setErrors((prev) => {
                                const copy = { ...prev };
                                delete copy.privacyAccepted;
                                return copy;
                              });
                            }
                          }}
                          disabled={status === "loading"}
                        />
                        <span className="leading-tight">
                          <label
                            htmlFor="privacy-checkbox"
                            className="cursor-pointer select-none hover:text-fg"
                          >
                            I agree to the{" "}
                          </label>
                          <a
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                                e.preventDefault();
                                setPrivacyModalOpen(true);
                              }
                            }}
                            className="underline underline-offset-2 transition hover:text-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                            aria-haspopup="dialog"
                          >
                            Privacy Policy
                          </a>
                          {errors.privacyAccepted ? (
                            <span className="ml-1 text-magenta-light">· Required</span>
                          ) : null}
                        </span>
                      </div>

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

      <PrivacyModal
        open={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        onAccept={() => {
          setPrivacyAccepted(true);
          if (errors.privacyAccepted) {
            setErrors((prev) => {
              const copy = { ...prev };
              delete copy.privacyAccepted;
              return copy;
            });
          }
        }}
      />
    </div>
  );
}
