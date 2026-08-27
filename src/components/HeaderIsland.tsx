import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { navLinks, type NavLink } from "../data/liveContent";
import { ScrollLink } from "./ScrollLink";
import { useTheme } from "../context/ThemeContext";
import { LocaleSwitcher } from "./LocaleSwitcher";

function navIsActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/cases/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderIsland() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div 
      layout
      className="flex items-center bg-bg-elevated/70 backdrop-blur-xl rounded-full border border-border/40 overflow-visible shadow-sm"
      style={{ padding: "0.15rem" }}
      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
    >
      <nav className="flex items-center" aria-label="Primary">
        <ul className="flex items-center gap-0.5 pl-1.5 pr-0.5 h-6">
          {navLinks.map((link: NavLink) => {
            const active = navIsActive(pathname, link.href);
            return (
                  <li key={link.href} className="relative">
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-accent rounded-full shadow-sm"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <ScrollLink
                      href={link.href}
                      contactIntent={link.contactIntent}
                      aria-current={active ? "page" : undefined}
                      className={`relative z-10 inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-bold tracking-wide uppercase transition-colors whitespace-nowrap ${
                        active ? "text-on-accent" : "text-fg-muted hover:text-fg hover:bg-fg/5 font-semibold"
                      }`}
                    >
                      {link.label}
                      {link.underConstruction && (
                        <span className="ml-1 text-[8px] uppercase tracking-wider opacity-60">Soon</span>
                      )}
                    </ScrollLink>
                  </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex items-center shrink-0">
        {/* Divider */}
        <div className="w-[1px] h-2.5 bg-border/50 shrink-0 mx-0.5" />

        {/* Locale */}
        <div className="island-locale-wrapper shrink-0 scale-90">
          <LocaleSwitcher />
        </div>

        {/* Divider */}
        <div className="w-[1px] h-2.5 bg-border/50 shrink-0 mx-0.5" />

        {/* Theme Toggle */}
        <motion.button
          type="button"
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
          className="flex items-center justify-center w-6 h-6 rounded-full text-fg-muted hover:text-accent hover:bg-accent/10 transition-colors shrink-0"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title="Switch content mode"
        >
          <motion.span
            key={theme}
            initial={{ opacity: 0, rotate: -40, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="inline-flex"
          >
            {isDark ? <Sun className="w-3 h-3" strokeWidth={2.5} /> : <Moon className="w-3 h-3" strokeWidth={2.5} />}
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}
