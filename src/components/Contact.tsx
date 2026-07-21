import { useState, type FormEvent } from "react";
import { Reveal } from "./motion/Reveal";
import { footerLinks, lenovoPartnership, sectionsByMode } from "../data/liveContent";
import { LenovoPartnershipLogo } from "./LenovoPartnershipLogo";
import { Magnetic } from "./motion-preview/Magnetic";
import { AccentWord } from "./AccentWord";
import { ContactFormField } from "./ContactFormField";

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

const linkedIn = footerLinks.social.find((link) => link.label === "LinkedIn");

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
          subject: `UPRAISER Contact - ${form.company || form.name}`,
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
      setSubmitError("Network error. Please check Your connection and try again.");
    }
  };

  return (
    <section id="contact" className="section-band">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border bg-bg-card">
          <div className="grid lg:grid-cols-2">
            <div className="relative bg-bg-elevated p-10 lg:p-14">
              <p className="section-label">{sectionsByMode.contact.label}</p>
              <h2 className="section-title">
                {sectionsByMode.contact.titleLead}
                <AccentWord tone="red">{sectionsByMode.contact.accentWord}</AccentWord>?
              </h2>
              <p className="section-description">
                Scaling installs, deposits, or new geos? Let's talk.
              </p>

              <div className="mt-10 space-y-4 text-sm">
                <div>
                  <div className="text-muted stat-label">Email</div>
                  <a href="mailto:info@upraiser.co.uk" className="font-semibold text-fg hover:text-orange">
                    info@upraiser.co.uk
                  </a>
                </div>
                <div>
                  <div className="text-muted stat-label">Address</div>
                  <span className="font-semibold">
                    128 City Road, London EC1V 2NX, United Kingdom
                  </span>
                </div>
                <div>
                  <div className="text-muted stat-label">LinkedIn</div>
                  {linkedIn ? (
                    <a
                      href={linkedIn.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-fg hover:text-orange"
                    >
                      linkedin.com/company/upraiser
                    </a>
                  ) : null}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="text-muted stat-label">{lenovoPartnership.badge}</div>
                  <LenovoPartnershipLogo className="mt-2 h-8 w-auto sm:h-9" />
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
                    Thanks for reaching out. Our team will get back to You within 1-2 business days.
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

                  <ContactFormField label="I am a..." id="vertical" disabled={status === "loading"}>
                    <select
                      value={form.vertical}
                      onChange={(e) => setForm({ ...form, vertical: e.target.value })}
                    >
                      <option value="brand">Brand</option>
                      <option value="advertising-partner">Advertising Partner</option>
                      <option value="app-web-owner">App / Web Owner</option>
                      <option value="direct-publisher">Direct publisher</option>
                      <option value="other">Other</option>
                    </select>
                  </ContactFormField>

                  <ContactFormField label="Message" id="message" error={errors.message} disabled={status === "loading"}>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </ContactFormField>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-light">
                      <input
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={(e) => {
                          setPrivacyAccepted(e.target.checked);
                          if (e.target.checked && errors.privacyAccepted) {
                            setErrors((prev) => ({ ...prev, privacyAccepted: undefined }));
                          }
                        }}
                        disabled={status === "loading"}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-orange"
                      />
                      <span>
                        I have read and agree to the{" "}
                        <a href="/privacy" className="font-semibold text-orange hover:text-orange-light">
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>
                    {errors.privacyAccepted && (
                      <p className="mt-1 text-xs text-red-400">{errors.privacyAccepted}</p>
                    )}
                  </div>

                  <Magnetic className="w-full">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      data-cursor="cta"
                      className="btn-caps w-full rounded-full bg-orange py-3.5 text-sm font-semibold text-on-accent transition hover:bg-orange-light disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "loading" ? "Sending…" : "Send Message"}
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
