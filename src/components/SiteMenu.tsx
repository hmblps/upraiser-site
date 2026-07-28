import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { navLinks, primaryCta, type NavLink } from "../data/liveContent";
import { SPRING } from "../lib/motion";
import { ScrollLink } from "./ScrollLink";

type SiteMenuProps = {
  open: boolean;
  onClose: () => void;
  dualStoryReady: boolean;
  bridgeCta: string;
  onSwitchStory: () => void;
};

function navIsActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkSpring = { type: "spring" as const, stiffness: 440, damping: 34 };

export function SiteMenu({
  open,
  onClose,
  dualStoryReady,
  bridgeCta,
  onSwitchStory,
}: SiteMenuProps) {
  const { pathname } = useLocation();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            className="site-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.nav
            id="site-menu"
            aria-label="Site sections"
            className="site-menu"
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={SPRING}
          >
            <div className="site-menu__head">
              <span className="site-menu__label">Menu</span>
              <motion.button
                type="button"
                aria-label="Close menu"
                className="site-menu__close"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={linkSpring}
                onClick={onClose}
              >
                ✕
              </motion.button>
            </div>

            <ul className="site-menu__links">
              {navLinks.map((link: NavLink, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...linkSpring, delay: 0.04 + index * 0.045 }}
                >
                  <ScrollLink
                    href={link.href}
                    contactIntent={link.contactIntent}
                    aria-current={navIsActive(pathname, link.href) ? "page" : undefined}
                    className={`site-menu__link${navIsActive(pathname, link.href) ? " site-menu__link--active" : ""}`}
                    onClick={onClose}
                    data-cursor="link"
                  >
                    {link.label}
                  </ScrollLink>
                </motion.li>
              ))}
            </ul>

            <div className="site-menu__foot">
              {dualStoryReady ? (
                <ScrollLink
                  href={primaryCta.href}
                  data-cursor="cta"
                  className="site-menu__cta btn-caps"
                  onClick={onClose}
                >
                  {primaryCta.label}
                </ScrollLink>
              ) : (
                <motion.button
                  type="button"
                  data-cursor="cta"
                  className="site-menu__cta btn-caps"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={linkSpring}
                  onClick={onSwitchStory}
                >
                  {bridgeCta}
                </motion.button>
              )}
            </div>
          </motion.nav>
        </>
      ) : null}
    </AnimatePresence>
  );
}
