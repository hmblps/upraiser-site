import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { primaryCta } from "../data/liveContent";
import { useReducedMotion } from "../hooks/useReducedMotion";
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
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const switchStory = () => {
    toggleTheme();
    navigate("/");
    window.setTimeout(() => scrollTo("hero"), 160);
  };

  const switchLabel = theme === "light"
    ? "See the Infrastructure story →"
    : "See the Growth story →";

  return (
    <section id="pilot" className="section-band section-band--dense relative overflow-hidden pilot-cta-section">

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

            <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
              <Magnetic>
                <ScrollLink
                  href={primaryCta.href}
                  data-cursor="cta"
                  className="btn-caps btn-caps--primary inline-block rounded-full px-7 py-3.5"
                >
                  {primaryCta.label}
                </ScrollLink>
              </Magnetic>

              {/* Theme switcher — always visible so mobile users can switch */}
              <motion.button
                type="button"
                onClick={switchStory}
                whileHover={reduced ? undefined : { x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="text-sm text-fg-muted hover:text-fg transition-colors cursor-pointer"
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
