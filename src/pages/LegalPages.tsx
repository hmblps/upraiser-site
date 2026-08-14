import { Link } from "react-router-dom";
import { Magnetic } from "../components/motion-preview/Magnetic";

type LegalPageProps = {
  title: string;
  updated: string;
  paragraphs: readonly string[];
};

function LegalDocument({ title, updated, paragraphs }: LegalPageProps) {
  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <section className="section-band">
        <div className="section-inner section-inner--narrow">
          <p className="section-label">Legal</p>
          <h1 className="section-title mt-3 normal-case tracking-tight">{title}</h1>
          <p className="text-caption mt-3 text-muted">Last updated {updated}</p>
          <div className="mt-10 space-y-5">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="copy text-muted">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-12">
            <Magnetic>
              <Link
                to="/contact"
                data-cursor="cta"
                className="btn-caps btn-caps--primary inline-block rounded-full px-7 py-3.5"
              >
                Contact
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </main>
  );
}

export function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      updated="23 July 2026"
      paragraphs={[
        "UPRAISER Agency LLP (“we”) processes personal data You submit through this website — typically name, work email, company, and message content — solely to respond to inquiries and operate the pilot request flow.",
        "We use a form processor to deliver messages to our team. We do not sell personal data. Retention follows ordinary business correspondence needs unless a longer period is required by law.",
        "For privacy requests, email info@upraiser.co.uk. Our registered address is 128 City Road, London EC1V 2NX, United Kingdom. ICO registration: ZC000436.",
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <LegalDocument
      title="Terms & Conditions"
      updated="23 July 2026"
      paragraphs={[
        "This website provides general information about UPRAISER Agency LLP services. Nothing on the site constitutes a binding offer, partnership commitment, or guarantee of campaign results.",
        "Case studies and metrics describe historical flights and are not promises of future performance. Any engagement is governed by a separate written agreement.",
        "Questions about these terms: info@upraiser.co.uk.",
      ]}
    />
  );
}
