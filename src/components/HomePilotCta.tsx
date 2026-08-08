import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { bridgeByMode, primaryCta } from "../data/liveContent";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScroll } from "../context/ScrollContext";
import { useTheme } from "../context/ThemeContext";
import { Magnetic } from "./motion-preview/Magnetic";
import { ScrollLink } from "./ScrollLink";
import { Reveal } from "./motion/Reveal";
import { useMode } from "./SectionHeader";

/**
 * Closing runway: until both modes are seen, Request Pilot stays locked —
 * the primary action is switching to the other story.
 */
export function HomePilotCta() {
  const { mode } = useMode();
  const { dualStoryReady, toggleTheme } = useTheme();
  const { scrollTo } = useScroll();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const bridge = bridgeByMode[mode];

  const switchStory = () => {
    toggleTheme();
    navigate("/");
    window.setTimeout(() => scrollTo("hero"), 160);
  };

  if (!dualStoryReady) {
    return (
      <section id="pilot" className="section-band section-band--dense">
        <div className="section-inner">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 border-t border-border/70 pt-10 sm:flex-row sm:items-end">
              <div className="max-w-xl">
                <p className="section-label">{bridge.eyebrow}</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-fg sm:text-3xl">{bridge.lead}</h2>
                <p className="copy mt-3 text-muted">{bridge.preview}</p>
              </div>
              <Magnetic>
                <motion.button
                  type="button"
                  onClick={switchStory}
                  data-cursor="cta"
                  whileHover={reduced ? undefined : { scale: 1.03 }}
                  whileTap={reduced ? undefined : { scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  className="btn-caps inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-on-accent hover:bg-accent-light"
                >
                  {bridge.cta}
                  <span aria-hidden>→</span>
                </motion.button>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="pilot" className="section-band section-band--dense">
      <div className="section-inner">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 border-t border-border/70 pt-10 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="section-label">Next step</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                Ready to be Upraised?
              </h2>
              <p className="copy mt-3 text-muted">
                Brief the route: vertical, GEO, KPI event — we reply with a scoped path, not a deck.
              </p>
            </div>
            <Magnetic>
              <ScrollLink
                href={primaryCta.href}
                data-cursor="cta"
                className="btn-caps inline-block shrink-0 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-on-accent hover:bg-accent-light"
              >
                {primaryCta.label}
              </ScrollLink>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
