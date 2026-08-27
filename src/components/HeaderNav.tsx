import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, type NavLink } from "../data/liveContent";
import { ScrollLink } from "./ScrollLink";

function navIsActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/cases/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Primary IA — The Craft · The Basecamp · The Expedition */
export function HeaderNav() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-1">
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="overflow-hidden whitespace-nowrap"
            aria-label="Primary"
          >
            <ul className="flex items-center gap-1 bg-bg-elevated/80 backdrop-blur-md rounded-full px-2 h-9 border border-border/40">
              {navLinks.map((link: NavLink) => {
                const active = navIsActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <ScrollLink
                      href={link.href}
                      contactIntent={link.contactIntent}
                      onClick={() => setIsOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`header-nav__link${active ? " header-nav__link--active" : ""}${link.underConstruction ? " header-nav__link--soon" : ""}`}
                      data-cursor="link"
                    >
                      {link.label}
                      {link.underConstruction ? (
                        <span className="header-nav__badge" aria-hidden>
                          Soon
                        </span>
                      ) : null}
                    </ScrollLink>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-bg-elevated/80 backdrop-blur-md border border-border/40 text-fg-muted hover:text-fg hover:bg-bg-elevated transition-colors"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>
    </div>
  );
}
