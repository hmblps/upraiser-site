import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { contactPage } from "../data/liveContent";
import { Magnetic } from "./motion-preview/Magnetic";
import { AccentWord } from "./AccentWord";
import { GradientTraceBorder } from "./GradientTraceBorder";
import { ContactFormField } from "./ContactFormField";

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

type FormErrors = Partial<FormState> & {
  privacyAccepted?: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

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

export function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    if (!validate()) return;

    if (!accessKey) {
      setStatus("error");
      setSubmitError("Form is not configured. Set VITE_WEB3FORMS_ACCESS_KEY in your environment.");
      return;
    }

    setStatus("loading");
    setSubmitError(null);

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
        formData.append("attachment", form.attachment);
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const data = (await response.json()) as { success?: boolean; message?: string };

      if (response.ok && data.success) {
        setStatus("success");
        setForm(initialForm);
        setPrivacyAccepted(false);
        return;
      }

      setStatus("error");
      setSubmitError(data.message ?? "Unable to send message. Please try again.");
    } catch {
      setStatus("error");
      setSubmitError("Network error. Please check your connection and try again.");
    }
  };

  const ctaRow = [
    { label: "The Basecamp", href: "/" },
    { label: "See Cases", href: "/#cases" },
    { label: "The Routes", href: "/#routes" },
    { label: "The Expedition", href: "/#promise" },
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
                <div className="contact-briefing-copy relative flex flex-col bg-bg-elevated">
                  <p className="section-label">{contactPage.label}</p>
                  <h1 className="section-title section-title--compact mt-1.5">
                    {contactPage.titleLead}
                    <AccentWord tone="red">{contactPage.accentWord}</AccentWord>
                  </h1>
                  <p className="section-description mt-2 line-clamp-3">{contactPage.description}</p>

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

                  <div className="contact-sidebar">
                    <div>
                      <h2 className="contact-sidebar__title">Basecamp London</h2>
                      <address className="copy mt-2 space-y-1 not-italic">
                        <p className="font-medium text-fg">Upraiser Agency LLP</p>
                        <p>128 City Road, London EC1V 2NX</p>
                        <p>United Kingdom</p>
                      </address>
                    </div>
                    <div>
                      <h2 className="contact-sidebar__title">Direct Communications</h2>
                      <p className="copy mt-2">
                        Direct Operator Contact:{" "}
                        <a href="mailto:info@upraiser.co.uk" className="text-fg underline hover:text-accent">
                          info@upraiser.co.uk
                        </a>
                      </p>
                    </div>
                    <div>
                      <h2 className="contact-sidebar__title">Verified Compliance & Partners</h2>
                      <ul className="copy mt-2 space-y-3">
                        <li>
                          <strong className="font-medium text-fg">Official Lenovo Partner:</strong> We work directly
                          with Lenovo PC HK LTD to secure procurement-grade OEM ROM and PAI lanes, avoiding competitive
                          ad re-selling.
                        </li>
                        <li>
                          <strong className="font-medium text-fg">Data Audit Protocols:</strong> We maintain complete
                          GDPR alignment and utilize ISO 27001 certified physical systems for programmatic log
                          validation.
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

                <div className="contact-briefing-form flex min-h-0 flex-col">
                  {status === "success" ? (
                    <div
                      className="flex h-full min-h-0 flex-col items-center justify-center text-center"
                      role="status"
                      aria-live="polite"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="section-heading section-heading--sm mt-4">Brief Transmitted</h3>
                      <p className="copy mt-2 max-w-sm">
                        Our systems engineers have received Your parameters. We will review Your App ID logs and respond
                        via secure email within 24 hours.
                      </p>
                      <button
                        type="button"
                        className="link-caps mt-5 text-accent hover:underline"
                        onClick={() => {
                          setStatus("idle");
                          setForm(initialForm);
                          setPrivacyAccepted(false);
                          setSubmitError(null);
                        }}
                      >
                        Send another brief
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-1 flex-col gap-2"
                      noValidate
                      aria-busy={status === "loading"}
                    >
                      {status === "error" && submitError ? (
                        <div
                          className="text-caption shrink-0 rounded-xl border border-magenta/30 bg-magenta/5 px-3 py-2 text-magenta-light"
                          role="alert"
                        >
                          {submitError}
                        </div>
                      ) : null}

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <ContactFormField label="Name & Title *" id="name" error={errors.name} disabled={status === "loading"}>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                        </ContactFormField>

                        <ContactFormField label="Corporate Work Email *" id="email" error={errors.email} disabled={status === "loading"}>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                          />
                        </ContactFormField>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <ContactFormField label="Production App ID / Store URL *" id="appId" error={errors.appId} disabled={status === "loading"}>
                          <input
                            type="text"
                            value={form.appId}
                            onChange={(e) => setForm({ ...form, appId: e.target.value })}
                          />
                        </ContactFormField>

                        <ContactFormField label="Target GEOs" id="geos" disabled={status === "loading"}>
                          <input type="text" value={form.geos} onChange={(e) => setForm({ ...form, geos: e.target.value })} />
                        </ContactFormField>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <ContactFormField label="Company Type" id="companyType" disabled={status === "loading"}>
                          <select value={form.companyType} onChange={(e) => setForm({ ...form, companyType: e.target.value })}>
                            <option value="brand">App Brand / Developer</option>
                            <option value="agency">Agency Partner</option>
                            <option value="vendor">Ad Tech Platform / Vendor</option>
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

                      <ContactFormField label="Average Monthly Media Spend" id="monthlyBudget" disabled={status === "loading"}>
                        <select value={form.monthlyBudget} onChange={(e) => setForm({ ...form, monthlyBudget: e.target.value })}>
                          <option value="pilot">Under $25,000 (Pilot Testing Only)</option>
                          <option value="growth">$25,000 to $100,000</option>
                          <option value="scaling">$100,000 to $500,000</option>
                          <option value="enterprise">$500,000+</option>
                        </select>
                      </ContactFormField>

                      <ContactFormField label="Details" id="notes" disabled={status === "loading"} expand={true}>
                        <textarea maxLength={250} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                      </ContactFormField>

                      <div className="mt-0.5 flex items-center gap-2">
                        <input
                          type="file"
                          id="attachment"
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg"
                          disabled={status === "loading"}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && file.size > 5 * 1024 * 1024) {
                              alert("File size must be less than 5MB");
                              e.target.value = "";
                              return;
                            }
                            setForm({ ...form, attachment: file || null });
                          }}
                        />
                        <label
                          htmlFor="attachment"
                          className={`text-caption flex cursor-pointer items-center gap-1.5 text-muted transition hover:text-fg ${status === "loading" ? "pointer-events-none opacity-50" : ""}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                          {form.attachment ? form.attachment.name : "Attach brief (.pdf, .jpg, .png) | max 5MB"}
                        </label>
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
                          {status === "loading" ? "Transmitting…" : contactPage.ctaLabel}
                        </motion.button>
                      </Magnetic>
                    </form>
                  )}
                </div>
              </div>
            </div>
      </div>
    </div>
  );
}
