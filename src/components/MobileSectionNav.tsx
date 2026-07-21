import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "../data/liveContent";
import { scrollSectionIds } from "../data/scrollSections";
import { useActiveSection } from "../hooks/useActiveSection";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScroll } from "../context/ScrollContext";
import { ScrollLink } from "./ScrollLink";

const mobileNavLinks = navLinks.filter((link) => link.href.startsWith("#"));

export function MobileSectionNav() {
  const reduced = useReducedMotion();
  const { registerScrollListener } = useScroll();
  const activeIndex = useActiveSection();
  const activeId = scrollSectionIds[activeIndex] ?? scrollSectionIds[0];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return registerScrollListener((scrollY) => setVisible(scrollY > 420));
  }, [registerScrollListener]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Page sections"
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-[4.75rem] z-[90] border-b border-border bg-bg/95 backdrop-blur-md md:hidden"
        >
          <div className="flex gap-2 overflow-x-auto px-4 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {mobileNavLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeId === sectionId;

              return (
                <ScrollLink
                  key={link.href}
                  href={link.href}
                  className={`text-micro shrink-0 rounded-full px-3.5 py-1.5 tracking-wide transition ${
                    isActive
                      ? "bg-orange text-on-accent shadow-[0_4px_16px_rgba(253,216,53,0.2)]"
                      : "border border-border text-muted-light"
                  }`}
                >
                  {link.label}
                </ScrollLink>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
