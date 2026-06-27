import { footerLinks } from "../data/content";

export function Footer() {
  return (
    <footer className="bg-bg-elevated pb-8">
      <div className="mx-auto max-w-7xl px-6 pt-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <a href="#" className="flex items-center gap-3">
              <img src="/upraiser-logo.png" alt="UPRAISER" className="h-9 w-9 object-contain" />
              <span className="text-lg font-bold">UPRAISER</span>
            </a>
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
              <h4 className="footer-heading">Explore</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.explore.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-muted-light hover:text-fg">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Company</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-muted-light hover:text-fg">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Connect</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="mailto:info@upraiser.co.uk" className="text-sm text-muted-light hover:text-fg">
                    info@upraiser.co.uk
                  </a>
                </li>
                <li>
                  <a href="https://upraiser.co.uk" className="text-sm text-muted-light hover:text-fg">
                    upraiser.co.uk
                  </a>
                </li>
                {footerLinks.social.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-light hover:text-fg"
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
          <p className="text-xs text-muted">© {new Date().getFullYear()} UPRAISER Agency LLP. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-muted">
            <a href="#" className="link-caps hover:text-fg">
              Privacy Policy
            </a>
            <a href="#" className="link-caps hover:text-fg">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
