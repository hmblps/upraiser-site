import { useNavigate } from "react-router-dom";
import { primaryCta } from "../data/liveContent";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useRef } from "react";
import { motion, useScroll as useFramerScroll, useTransform } from "framer-motion";
import { useScroll } from "../context/ScrollContext";
import { useTheme } from "../context/ThemeContext";
import { Magnetic } from "./motion-preview/Magnetic";
import { ScrollLink } from "./ScrollLink";
import { Reveal } from "./motion/Reveal";

/**
 * Closing runway — always shows both actions:
 * • "Request Pilot" CTA
 * • theme-switch hint ("See the other story") rendered beside it
 */
export function HomePilotCta() {
  const { toggleTheme, theme } = useTheme();
  const { scrollTo } = useScroll();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useFramerScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["20%", "0%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const switchStory = () => {
    toggleTheme();
    navigate("/");
    window.setTimeout(() => scrollTo("hero"), 160);
  };

  const switchLabel = theme === "light"
    ? "Infrastructure story →"
    : "Growth story →";

  return (
    <section id="pilot" ref={containerRef} className="section-band section-band--dense relative overflow-hidden pilot-cta-section">
      {/* Scroll-driven Parallax Mountain Background */}
      <motion.div 
        className="cta-mountain-bg absolute inset-0 z-0 pointer-events-none"
        style={reduced ? {} : { y, scale, transformOrigin: "bottom center" }}
      />

      <div className="section-inner relative z-10">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 border-t border-border/70 pt-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="section-label">Next step</p>
              <h2 className="section-heading">Ready to be Upraised?</h2>
              <p className="copy mt-3">
                Brief the route: vertical, GEO, KPI event — we reply with a scoped path, not a deck.
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-3 shrink-0 w-full sm:w-auto min-w-[240px]">
              <Magnetic className="flex w-full">
                <ScrollLink
                  href={primaryCta.href}
                  data-cursor="cta"
                  className="btn-caps btn-caps--primary flex w-full justify-center rounded-full px-7 py-3.5"
                >
                  {primaryCta.label}
                </ScrollLink>
              </Magnetic>

              {/* Theme switcher — always visible so mobile users can switch */}
              <motion.button
                type="button"
                onClick={switchStory}
                whileHover={reduced ? undefined : { scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="flex items-center justify-center w-full gap-2 text-sm font-medium text-fg-muted hover:text-fg px-5 py-2.5 rounded-full border border-border/40 bg-fg/[0.02] hover:bg-fg/5 hover:border-border/80 transition-all cursor-pointer"
              >
                {switchLabel}
              </motion.button>
            </div>
          </div>
        </Reveal>
      </div>

    </section>
  );
}
