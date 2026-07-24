import { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "./motion/Reveal";
import { contactPage, contactVerticalOptions, lenovoPartnership, primaryCta } from "../data/liveContent";
import { Magnetic } from "./motion-preview/Magnetic";
import { AccentWord } from "./AccentWord";
import { BorderBeam } from "./BorderBeam";
import { ContactFormField } from "./ContactFormField";
import { ContactIntentChips } from "./ContactIntentChips";
import { LenovoPartnershipLogo } from "./LenovoPartnershipLogo";
import { CONTACT_INTENT_EVENT, consumeContactIntent } from "../lib/contactIntent";

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
  vertical: string;
};

type FormErrors = Partial<FormState> & {
  privacyAccepted?: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  message: "",
  vertical: "brand",
};

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
    if (!form.name.trim()) next.name = "Required";
    if (!form.email.trim()) next.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Invalid email";
    if (!form.message.trim()) next.message = "Required";
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
          subject:
            form.vertical === "careers"
              ? "UPRAISER Careers inquiry"
              : `UPRAISER Contact - ${form.company || form.name}`,
          from_name: "UPRAISER Website",
          name: form.name,
          email: form.email,
          replyto: form.email,
          company: form.company || "-",
          vertical: form.vertical,
          message: form.message,
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
    { label: "Request Pilot", href: primaryCta.href },
    { label: "See Cases", href: "/cases" },
    { label: "Expertise", href: "/expertise" },
    { label: "Company", href: "/company" },
  ];

  return (
    <section id="contact" className="section-band">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <div className="strip-beam-wrap relative overflow-hidden rounded-3xl border border-border bg-bg-card">
            <BorderBeam
              className="z-20"
              duration={10}
              size={320}
              colorFrom="var(--theme-accent-light)"
              colorTo="var(--color-magenta)"
            />
            <div className="relative z-[1] grid lg:grid-cols-2">
            <div className="relative bg-bg-elevated p-10 lg:p-14">
              <p className="section-label">{contactPage.label}</p>
              <h1 className="section-title">
                {contactPage.titleLead}
                <AccentWord tone="red">{contactPage.accentWord}</AccentWord>?
              </h1>
              <p className="section-description">{contactPage.description}</p>
              <p className="mt-3 text-sm text-muted">{contactPage.subline}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                {ctaRow.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-fg hover:border-orange hover:text-orange"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-10 space-y-4 text-sm">
                <div>
                  <div className="text-muted stat-label">Email</div>
                  <a href={`mailto:${contactPage.email}`} className="font-semibold text-fg hover:text-orange">
                    {contactPage.email}
                  </a>
                </div>
                <div>
                  <div className="text-muted stat-label">Address</div>
                  <span className="font-semibold">{contactPage.office}</span>
                </div>
                <div>
                  <div className="text-muted stat-label">LinkedIn</div>
                  <a
                    href="https://www.linkedin.com/company/upraiser/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-fg hover:text-orange"
                  >
                    linkedin.com/company/upraiser
                  </a>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="text-muted stat-label">{lenovoPartnership.badge}</div>
                  <LenovoPartnershipLogo className="mt-2 h-8 w-auto sm:h-9" />
                  <p className="mt-3 text-sm text-muted">
                    OEM / Lenovo →{" "}
                    <Link
                      to="/expertise?pillar=oem#help-with"
                      className="font-semibold text-fg underline-offset-4 hover:underline"
                    >
                      Solutions · OEM
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-10 lg:p-14">
              {status === "success" ? (
                <div className="flex h-full flex-col items-center justify-center text-center" role="status" aria-live="polite">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange/10 text-orange">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold">Message received</h3>
                  <p className="mt-3 max-w-sm text-muted-light">
                    Thanks for reaching out. Our team will get back to you within 1–2 business days.
                  </p>
                  <button
                    type="button"
                    className="mt-8 text-sm font-semibold text-orange hover:underline"
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
                <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-busy={status === "loading"}>
                  {status === "error" && submitError && (
                    <div
                      className="rounded-xl border border-magenta/30 bg-magenta/5 px-4 py-3 text-sm text-magenta-light"
                      role="alert"
                    >
                      {submitError}
                    </div>
                  )}

                  <ContactFormField label="Full name" id="name" error={errors.name} disabled={status === "loading"}>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </ContactFormField>

                  <ContactFormField label="Work email" id="email" error={errors.email} disabled={status === "loading"}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </ContactFormField>

                  <ContactFormField label="Company" id="company" disabled={status === "loading"}>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
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

                  <ContactFormField label="I am a..." id="vertical" disabled={status === "loading"}>
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

                  <ContactFormField label="Message" id="message" error={errors.message} disabled={status === "loading"}>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </ContactFormField>

                  <Magnetic className="w-full">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      data-cursor="cta"
                      className="btn-caps w-full rounded-full bg-orange py-3.5 text-sm font-semibold text-on-accent transition hover:bg-orange-light disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "loading" ? "Sending…" : contactPage.ctaLabel}
                    </button>
                  </Magnetic>
                </form>
              )}
            </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
