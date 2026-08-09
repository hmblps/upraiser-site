import { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { contactPage, contactVerticalOptions, primaryCta } from "../data/liveContent";
import { Magnetic } from "./motion-preview/Magnetic";
import { AccentWord } from "./AccentWord";
import { BorderBeam } from "./BorderBeam";
import { ContactFormField } from "./ContactFormField";
import { ContactIntentChips } from "./ContactIntentChips";
import { LenovoPartnershipLogo } from "./LenovoPartnershipLogo";
import { CONTACT_INTENT_EVENT, consumeContactIntent } from "../lib/contactIntent";

type FormState = {
  email: string;
  appUrl: string;
  vertical: string;
  mmp: string;
  eventHook: string;
};

type FormErrors = Partial<FormState> & {
  privacyAccepted?: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

const initialForm: FormState = {
  email: "",
  appUrl: "",
  vertical: "igaming",
  mmp: "adjust",
  eventHook: "",
};

const mmpOptions = [
  { value: "adjust", label: "Adjust" },
  { value: "appsflyer", label: "AppsFlyer" },
  { value: "singular", label: "Singular" },
  { value: "kochava", label: "Kochava" },
  { value: "custom", label: "Custom API / Server-to-Server" },
];

const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;

export function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const applyIntent = (vertical: string) => {
      const allowed = contactVerticalOptions.some((option) => option.value === vertical);
      if (!allowed) return;
      setForm((current) => ({ ...current, vertical }));
      window.requestAnimationFrame(() => document.getElementById("vertical")?.focus());
    };

    const stored = consumeContactIntent();
    if (stored) applyIntent(stored);

    const onIntent = (event: Event) => {
      applyIntent((event as CustomEvent<string>).detail);
    };

    window.addEventListener(CONTACT_INTENT_EVENT, onIntent);
    return () => window.removeEventListener(CONTACT_INTENT_EVENT, onIntent);
  }, []);

  const validate = () => {
    const next: FormErrors = {};
    if (!form.email.trim()) next.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Invalid email";
    if (!form.appUrl.trim()) next.appUrl = "Required";
    if (!form.eventHook.trim()) next.eventHook = "Required";
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
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `UPRAISER Pilot Request - ${form.appUrl}`,
          from_name: "UPRAISER Website",
          email: form.email,
          replyto: form.email,
          app_url: form.appUrl,
          route: form.vertical,
          mmp: form.mmp,
          event_hook: form.eventHook,
          privacy_policy_accepted: "Yes",
        }),
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
    { label: primaryCta.label, href: primaryCta.href },
    { label: "See Cases", href: "/cases" },
    { label: "Solutions", href: "/solutions" },
    { label: "Company", href: "/company" },
  ];

  return (
    <div className="depth-page depth-page--contact viewport-page">
      <div className="viewport-page__shell section-inner flex min-h-0 flex-col">
        <div className="viewport-page__panel relative min-h-0 flex-1 overflow-hidden pt-3 pb-2">
          <div className="strip-beam-wrap relative h-full min-h-0 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-bg-card">
            <BorderBeam
              className="z-20"
              duration={10}
              size={280}
              colorFrom="var(--theme-accent-light)"
              colorTo="var(--color-magenta)"
            />
            <div className="relative z-[1] grid h-full min-h-0 overflow-hidden lg:grid-cols-2">
            <div className="relative flex min-h-0 flex-col overflow-hidden bg-bg-elevated p-5 sm:p-6 lg:p-8">
              <p className="section-label">{contactPage.label}</p>
              <h1 className="section-title section-title--compact mt-1.5">
                {contactPage.titleLead}
                <AccentWord tone="red">{contactPage.accentWord}</AccentWord>?
              </h1>
              <p className="section-description mt-2 line-clamp-2">{contactPage.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {ctaRow.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-fg hover:border-accent hover:text-accent"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto space-y-2 pt-4 text-sm">
                <div>
                  <div className="text-muted stat-label">Email</div>
                  <a href={`mailto:${contactPage.email}`} className="font-semibold text-fg hover:text-accent">
                    {contactPage.email}
                  </a>
                </div>
                <div className="border-t border-border pt-3">
                  <LenovoPartnershipLogo className="h-7 w-auto sm:h-8" />
                </div>
              </div>
            </div>

            <div className="min-h-0 overflow-hidden p-5 sm:p-6 lg:p-8">
              {status === "success" ? (
                <div className="flex h-full min-h-0 flex-col items-center justify-center text-center" role="status" aria-live="polite">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">Message received</h3>
                  <p className="mt-2 max-w-sm text-xs text-muted-light">
                    Thanks for reaching out. Our team will get back to you within 1–2 business days.
                  </p>
                  <button
                    type="button"
                    className="mt-5 text-sm font-semibold text-accent hover:underline"
                    onClick={() => {
                      setStatus("idle");
                      setForm(initialForm);
                      setPrivacyAccepted(false);
                      setSubmitError(null);
                    }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col space-y-2.5 overflow-hidden" noValidate aria-busy={status === "loading"}>
                  {status === "error" && submitError && (
                    <div
                      className="shrink-0 rounded-xl border border-magenta/30 bg-magenta/5 px-3 py-2 text-xs text-magenta-light"
                      role="alert"
                    >
                      {submitError}
                    </div>
                  )}

                  <ContactFormField label="Business email" id="email" error={errors.email} disabled={status === "loading"}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </ContactFormField>

                  <ContactFormField label="App Store URL / Website" id="appUrl" error={errors.appUrl} disabled={status === "loading"}>
                    <input
                      type="url"
                      value={form.appUrl}
                      onChange={(e) => setForm({ ...form, appUrl: e.target.value })}
                    />
                  </ContactFormField>

                  <ContactIntentChips
                    value={form.vertical}
                    disabled={status === "loading"}
                    onChange={(vertical) => {
                      setForm({ ...form, vertical });
                      setErrors((prev) => ({ ...prev, vertical: undefined }));
                    }}
                  />

                  <ContactFormField label="Target Geo Route" id="vertical" disabled={status === "loading"}>
                    <select
                      value={form.vertical}
                      onChange={(e) => setForm({ ...form, vertical: e.target.value })}
                    >
                      {contactVerticalOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </ContactFormField>

                  <ContactFormField label="MMP Attribution Partner" id="mmp" disabled={status === "loading"}>
                    <select
                      value={form.mmp}
                      onChange={(e) => setForm({ ...form, mmp: e.target.value })}
                    >
                      {mmpOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </ContactFormField>

                  <ContactFormField label="Target Event Hook (e.g. FTD, purchase)" id="eventHook" error={errors.eventHook} disabled={status === "loading"}>
                    <input
                      type="text"
                      value={form.eventHook}
                      onChange={(e) => setForm({ ...form, eventHook: e.target.value })}
                    />
                  </ContactFormField>

                  <label className="flex shrink-0 items-start gap-2 text-xs text-muted">
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
                      {errors.privacyAccepted ? (
                        <span className="ml-1 text-magenta-light">· Required</span>
                      ) : null}
                    </span>
                  </label>

                  <Magnetic className="mt-auto w-full shrink-0">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      data-cursor="cta"
                      className="btn-caps w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-on-accent transition hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "loading" ? "Sending…" : contactPage.ctaLabel}
                    </button>
                  </Magnetic>
                </form>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
