import { footerLinks } from "../data/liveContent";
import { ScrollLink } from "./ScrollLink";

export function Footer() {
  return (
    <footer className="bg-bg-elevated pb-8">
      <div className="section-inner pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <ScrollLink href="#hero" className="flex items-center gap-3">
              <img src="/upraiser-logo.png" alt="UPRAISER" className="h-9 w-9 object-contain" />
              <span className="card-title">UPRAISER</span>
            </ScrollLink>
            <p className="copy mt-4">
              UPRAISER Agency LLP
              <br />
              128 City Road, London EC1V 2NX
              <br />
              United Kingdom
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="footer-heading">Explore</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.explore.map((link) => (
                  <li key={link.href}>
                    <ScrollLink href={link.href} className="footer-link">
                      {link.label}
                    </ScrollLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Company</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    {link.href.startsWith("#") ? (
                      <ScrollLink
                        href={link.href}
                        contactIntent={link.contactIntent}
                        className="footer-link"
                      >
                        {link.label}
                      </ScrollLink>
                    ) : (
                      <a href={link.href} className="footer-link">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Connect</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="mailto:info@upraiser.co.uk" className="footer-link">
                    info@upraiser.co.uk
                  </a>
                </li>
                <li>
                  <a href="https://upraiser.co.uk" className="footer-link">
                    upraiser.co.uk
                  </a>
                </li>
                {footerLinks.social.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link inline-flex items-center gap-2"
                    >
                      {link.label}
                      <span className="text-micro text-muted" aria-hidden>
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-caption text-muted-light">
            © {new Date().getFullYear()} UPRAISER Agency LLP. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <a key={link.label} href={link.href} className="link-caps text-muted-light transition-colors hover:text-fg">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
