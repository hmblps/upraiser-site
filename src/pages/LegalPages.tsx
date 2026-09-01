import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Magnetic } from "../components/motion-preview/Magnetic";

function extractMain(html: string) {
  const match = html.match(/<main class="legal-main">([\s\S]*?)<\/main>/);
  return match?.[1]?.trim() ?? "";
}

function LegalDocument({ src }: { src: string }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let live = true;
    fetch(src)
      .then((response) => response.text())
      .then((doc) => {
        if (live) setHtml(extractMain(doc));
      })
      .catch(() => {
        if (live) setHtml("");
      });
    return () => {
      live = false;
    };
  }, [src]);

  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <section className="section-band">
        <div className="section-inner">
          {html ? (
            <>
              <article className="legal-doc" dangerouslySetInnerHTML={{ __html: html }} />
              <div className="mt-12">
                <Magnetic>
                  <Link
                    to="/contact"
                    data-cursor="cta"
                    className="btn-caps btn-caps--primary inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 touch-manipulation"
                  >
                    Contact
                  </Link>
                </Magnetic>
              </div>
            </>
          ) : (
            <div className="legal-doc min-h-[40dvh]" role="status" aria-live="polite">
              <span className="sr-only">Loading</span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export function PrivacyPage() {
  return <LegalDocument src="/privacy/index.html" />;
}

export function TermsPage() {
  return <LegalDocument src="/terms/index.html" />;
}
