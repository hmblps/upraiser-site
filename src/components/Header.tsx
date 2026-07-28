import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { bridgeByMode } from "../data/liveContent";
import { useScroll } from "../context/ScrollContext";
import { useTheme } from "../context/ThemeContext";
import { SPRING } from "../lib/motion";
import { SiteMenu } from "./SiteMenu";
import { ScrollLink } from "./ScrollLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useMode } from "./SectionHeader";

export function Header() {
  const { scrollTo } = useScroll();
  const { dualStoryReady, toggleTheme } = useTheme();
  const { mode } = useMode();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const bridge = bridgeByMode[mode];

  const switchStory = () => {
    setMenuOpen(false);
    toggleTheme();
    navigate("/");
    window.setTimeout(() => scrollTo("hero"), 160);
  };

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-[100] isolate">
        <div className="header-bar page-container flex h-[var(--site-header-height)] w-full items-center justify-between">
          <ScrollLink
            href="/"
            className="header-brand flex items-center rounded-[var(--radius-sm)] transition-opacity hover:opacity-90"
            aria-label="UPRAISER home"
          >
            <img src="/upraiser-logo.png" alt="" className="h-9 w-9 object-contain" />
          </ScrollLink>

          <div className="header-actions">
            <ThemeToggle />
            <LocaleSwitcher />
            <motion.button
              type="button"
              className="site-menu-trigger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="site-menu-trigger__bars" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      <SiteMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        dualStoryReady={dualStoryReady}
        bridgeCta={bridge.cta}
        onSwitchStory={switchStory}
      />
    </>
  );
}
