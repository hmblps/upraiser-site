import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Magnetic } from "../components/motion-preview/Magnetic";
import { useReducedMotion } from "../hooks/useReducedMotion";

const SPRING = { type: "spring" as const, stiffness: 120, damping: 18, mass: 0.7 };

/** Post-submit confirmation — not a purchase receipt. */
export function ThankYouPage() {
  const reduced = useReducedMotion();

  return (
    <main className="site-main flex min-h-[70dvh] items-center pt-[var(--site-header-height)]">
      <div className="section-inner py-20">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
        >
          <p className="section-label">Route Telemetry Logged</p>
          <h1 className="section-heading--lg max-w-xl">Every summit starts with a verified route.</h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Link
                to="/#cases"
                data-cursor="cta"
                className="btn-caps btn-caps--primary inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 touch-manipulation"
              >
                Proven Summits
              </Link>
            </Magnetic>
            <Magnetic strength={0.22}>
              <Link
                to="/contact"
                className="btn-caps btn-secondary inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 touch-manipulation"
              >
                Send another brief
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
