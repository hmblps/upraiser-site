import { footerLinks } from "../data/liveContent";
import { accentSectionLabel } from "../lib/accent";
import { ScrollLink } from "./ScrollLink";

export function Footer() {
  return (
    <footer className="bg-bg-elevated pb-8">
      <div className="mx-auto max-w-7xl px-6 pt-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <ScrollLink href="#hero" className="flex items-center gap-3">
              <img src="/upraiser-logo.png" alt="UPRAISER" className="h-9 w-9 object-contain" />
              <span className="text-lg font-bold">UPRAISER</span>
            </ScrollLink>
            <p className="mt-4 text-sm text-muted-light">
              UPRAISER Agency LLP
              <br />
              128 City Road, London EC1V 2NX
              <br />
              United Kingdom
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className={accentSectionLabel()}>Explore</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.explore.map((link) => (
                  <li key={link.href}>
                    <ScrollLink href={link.href} className="text-sm text-muted-light transition-colors hover:text-fg">
                      {link.label}
                    </ScrollLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className={accentSectionLabel()}>Company</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("#") ? (
                      <ScrollLink href={link.href} className="text-sm text-muted-light transition-colors hover:text-fg">
                        {link.label}
                      </ScrollLink>
                    ) : (
                      <a href={link.href} className="text-sm text-muted-light transition-colors hover:text-fg">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className={accentSectionLabel()}>Connect</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="mailto:info@upraiser.co.uk"
                    className="text-sm text-muted-light transition-colors hover:text-fg"
                  >
                    info@upraiser.co.uk
                  </a>
                </li>
                <li>
                  <a
                    href="https://upraiser.co.uk"
                    className="text-sm text-muted-light transition-colors hover:text-fg"
                  >
                    upraiser.co.uk
                  </a>
                </li>
                {footerLinks.social.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-light transition-colors hover:text-fg"
                    >
                      {link.label}
                      <span className="text-[10px] text-muted" aria-hidden>
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
          <p className="text-xs text-muted-light">
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
