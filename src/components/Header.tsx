import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bridgeByMode, navLinks, primaryCta } from "../data/liveContent";
import { useScroll } from "../context/ScrollContext";
import { useTheme } from "../context/ThemeContext";
import { Magnetic } from "./motion-preview/Magnetic";
import { ScrollLink } from "./ScrollLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useMode } from "./SectionHeader";

function navIsActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const { registerScrollListener, scrollTo } = useScroll();
  const { theme, dualStoryReady, toggleTheme } = useTheme();
  const { mode } = useMode();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const bridge = bridgeByMode[mode];

  useEffect(() => {
    return registerScrollListener((scrollY) => {
      setScrolled((prev) => {
        if (scrollY > 32) return true;
        if (scrollY < 12) return false;
        return prev;
      });
    });
  }, [registerScrollListener]);

  const switchStory = () => {
    setMenuOpen(false);
    toggleTheme();
    navigate("/");
    window.setTimeout(() => scrollTo("hero"), 160);
  };

  const headerSurface = scrolled
    ? "border-border/50 bg-bg/45 shadow-[0_1px_0_color-mix(in_srgb,var(--theme-border)_35%,transparent)] backdrop-blur-md"
    : theme === "dark"
      ? "border-transparent bg-bg/30 backdrop-blur-sm"
      : "border-transparent bg-bg/15 backdrop-blur-[6px]";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] isolate border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ${headerSurface}`}
    >
      <div className="header-bar page-container flex h-[var(--site-header-height)] w-full items-center justify-between">
        <ScrollLink href="/" className="header-brand flex items-center gap-3 rounded-[var(--radius-sm)] transition-opacity hover:opacity-90">
          <img src="/upraiser-logo.png" alt="UPRAISER" className="h-9 w-9 object-contain" />
          <span className="text-lg font-bold tracking-tight uppercase">UPRAISER</span>
        </ScrollLink>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <ScrollLink
              key={link.href}
              href={link.href}
              contactIntent={link.contactIntent}
              aria-current={navIsActive(pathname, link.href) ? "page" : undefined}
              className={`nav-link transition-colors hover:text-fg ${
                navIsActive(pathname, link.href) ? "text-fg" : "text-muted-light"
              }`}
              data-cursor="link"
            >
              {link.label}
            </ScrollLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher />
          <ThemeToggle />
          <Magnetic strength={0.35}>
            {dualStoryReady ? (
              <ScrollLink
                href={primaryCta.href}
                data-cursor="cta"
                className="btn-caps inline-block rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:bg-orange-light"
              >
                {primaryCta.label}
              </ScrollLink>
            ) : (
              <button
                type="button"
                onClick={switchStory}
                data-cursor="cta"
                className="btn-caps inline-block rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:bg-orange-light"
              >
                {bridge.cta}
              </button>
            )}
          </Magnetic>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher />
          <ThemeToggle />
          <button
            type="button"
            className="text-fg"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-nav" className="border-t border-border bg-bg-elevated px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.href}
                href={link.href}
                contactIntent={link.contactIntent}
                className="nav-link text-muted-light"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </ScrollLink>
            ))}
            {dualStoryReady ? (
              <ScrollLink
                href={primaryCta.href}
                className="btn-caps rounded-full bg-orange px-5 py-2.5 text-center text-sm font-semibold text-on-accent"
                onClick={() => setMenuOpen(false)}
              >
                {primaryCta.label}
              </ScrollLink>
            ) : (
              <button
                type="button"
                onClick={switchStory}
                className="btn-caps rounded-full bg-orange px-5 py-2.5 text-center text-sm font-semibold text-on-accent"
              >
                {bridge.cta}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
