import { useEffect, useState, type RefObject } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { bridgeByMode } from "../data/liveContent";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScroll } from "../context/ScrollContext";
import { useTheme } from "../context/ThemeContext";
import { BorderBeam } from "./BorderBeam";
import { useMode } from "./SectionHeader";
import { EASE_OUT } from "../lib/motion";

const BRIDGE_OFFSET = 96;

function SunIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

export function ThemeBridge({ anchorRef }: { anchorRef: RefObject<HTMLElement | null> }) {
  const { mode } = useMode();
  const { theme, toggleTheme } = useTheme();
  const { scrollTo, registerScrollListener } = useScroll();
  const navigate = useNavigate();
  const content = bridgeByMode[mode];
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  useEffect(() => {
    const node = anchorRef.current;
    if (!node) return;

    const update = () => {
      const bounds = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      setRevealed(bounds.bottom <= viewport + BRIDGE_OFFSET && bounds.top < viewport * 0.92);
    };

    if (reduced) {
      update();
      return;
    }

    update();
    const unsubscribe = registerScrollListener(update);
    window.addEventListener("resize", update);
    return () => {
      unsubscribe();
      window.removeEventListener("resize", update);
    };
  }, [anchorRef, reduced, registerScrollListener]);

  const switchView = () => {
    toggleTheme();
    navigate("/");
    window.setTimeout(() => scrollTo("hero"), 160);
  };

  const dark = theme === "dark";

  return (
    <motion.section
      id="theme-bridge"
      aria-label="Switch experience mode"
      aria-hidden={!revealed}
      initial={false}
      animate={{ y: revealed ? "0%" : "100%", opacity: Number(revealed) }}
      transition={{ duration: reduced ? 0 : 0.52, ease: EASE_OUT }}
      className={`theme-bridge-strip absolute inset-x-0 bottom-0 z-20 border-t border-border bg-bg-card/95 backdrop-blur-md ${dark ? "theme-bridge-strip--to-light" : "theme-bridge-strip--to-dark"} ${revealed ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div className="strip-beam-wrap relative overflow-hidden">
        <BorderBeam
          className="z-20"
          duration={10}
          colorFrom="var(--theme-accent-light)"
          colorTo="var(--color-magenta)"
        />
        <div className="relative z-[1] rail-strip__inner flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex min-w-0 flex-1 items-start gap-3.5 sm:gap-4">
            <div
              className="theme-bridge-mode-icon mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange/35 bg-orange/10 text-orange sm:h-11 sm:w-11"
              aria-hidden
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </div>
            <div className="min-w-0 max-w-2xl">
              <p className="stat-label text-orange">{content.eyebrow}</p>
              <p className="mt-0.5 text-sm font-semibold leading-snug text-fg sm:text-[0.9375rem]">
                {content.lead}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-light">{content.preview}</p>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={switchView}
            whileHover={reduced ? undefined : { scale: 1.03 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="theme-bridge-cta inline-flex w-full shrink-0 items-center justify-center gap-2 self-stretch rounded-full border border-orange/35 bg-orange/10 px-5 py-2.5 text-sm font-semibold text-fg transition hover:border-orange/60 hover:bg-orange/15 hover:text-orange sm:w-auto sm:self-center"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
            {content.cta}
            <span aria-hidden>→</span>
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
