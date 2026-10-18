import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeaderIsland } from "./HeaderIsland";
import { ScrollLink } from "./ScrollLink";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function Header() {
  const reduced = useReducedMotion();
  const { pathname } = useLocation();

  const isCraft = pathname === "/craft" || pathname.startsWith("/craft");
  const isChannels = pathname === "/channels" || pathname.startsWith("/channels");
  const hasBack = isCraft || isChannels;
  const backTo = isCraft ? "/" : "/#routes";
  const backLabel = isCraft ? "Explore" : "The Routes";

  const backButtonNode = hasBack ? (
    <motion.div
      className="pointer-events-auto flex items-center bg-bg-elevated/70 backdrop-blur-xl rounded-full border border-border/40 shadow-sm shrink-0"
      style={{ padding: "0.15rem" }}
      initial={reduced ? undefined : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={backTo}
        className="island-nav-link group relative inline-flex items-center gap-1.5 h-6 sm:h-8 pl-2 pr-2.5 sm:pl-2.5 sm:pr-3 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase transition-colors whitespace-nowrap text-fg-muted hover:text-fg after:absolute after:inset-x-0 after:-inset-y-1.5 after:content-['']"
      >
        <svg
          className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="hidden lg:inline">Back to {isChannels ? "The " : ""}</span>
        <span className="hidden lg:inline">{isChannels ? "Routes" : backLabel}</span>
      </Link>
    </motion.div>
  ) : null;

  return (
    <header className="site-header fixed inset-x-0 top-0 z-[100] isolate pointer-events-none">
      <div className="page-container flex items-center h-[var(--site-header-bar)] w-full pointer-events-auto mt-2">
        <div className="w-full grid xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-14">
          {/* Desktop Left Column */}
          <div className="hidden xl:flex items-center">
            {backButtonNode}
          </div>

          {/* Desktop & Mobile Main Row */}
          <div className="flex items-center w-full justify-between xl:justify-start gap-2 sm:gap-4">
            {/* Mobile Back Button (on subroutes like /channels where island has no tab) */}
            {isChannels && (
              <div className="flex xl:hidden items-center shrink-0">
                {backButtonNode}
              </div>
            )}

            <div className="flex items-center gap-2 sm:gap-4 ml-auto xl:ml-0 justify-end xl:justify-start shrink-0">
              <HeaderIsland />
              
              <motion.div
                whileTap={reduced ? undefined : { scale: 0.92 }}
                whileHover={reduced ? undefined : { scale: 1.05 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                className="shrink-0 xl:ml-auto"
              >
                <ScrollLink
                  href="/"
                  className="header-brand flex items-center shrink-0"
                  aria-label="UPRAISER — The Agency"
                >
                  <img src="/upraiser-logo.png" alt="" className="h-7 w-7 object-contain" />
                </ScrollLink>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
