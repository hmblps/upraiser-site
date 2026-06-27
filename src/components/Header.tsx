import { useEffect, useState } from "react";
import { navLinks, primaryCta } from "../data/content";
import { useScroll } from "../context/ScrollContext";
import { Magnetic } from "./motion-preview/Magnetic";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { registerScrollListener } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    return registerScrollListener((scrollY) => {
      setScrolled((prev) => {
        if (scrollY > 32) return true;
        if (scrollY < 12) return false;
        return prev;
      });
    });
  }, [registerScrollListener]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] isolate border-b border-transparent transition-[background-color,backdrop-filter] duration-300 ${
        scrolled ? "bg-bg/90 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#" className="flex items-center gap-3">
          <img src="/upraiser-logo.png" alt="UPRAISER" className="h-10 w-10 object-contain" />
          <span className="text-lg font-bold tracking-tight">UPRAISER</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link text-muted-light transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Magnetic strength={0.35}>
            <a
              href={primaryCta.href}
              data-cursor="cta"
              className="btn-caps inline-block rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:bg-orange-light"
            >
              {primaryCta.label}
            </a>
          </Magnetic>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="text-fg"
            aria-label="Toggle menu"
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
        <div className="border-t border-border bg-bg-elevated px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-muted-light"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={primaryCta.href}
              className="btn-caps rounded-full bg-orange px-5 py-2.5 text-center text-sm font-semibold text-on-accent"
              onClick={() => setMenuOpen(false)}
            >
              {primaryCta.label}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
