import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface CreativeStudioVideoProps {
  videoSrc: string;
  theme: "light" | "dark";
}

export function CreativeStudioVideo({ videoSrc, theme }: CreativeStudioVideoProps) {
  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* Video with Theme-Specific Filters */}
      <video 
        src={videoSrc}
        autoPlay 
        loop 
        muted 
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          theme === "light"
            ? "opacity-90 contrast-125 saturate-150 sepia-[.1] hue-rotate-[-10deg]"
            : "opacity-100 contrast-[1.15] saturate-[0.8]"
        }`}
        style={{
          filter: theme === "light"
            ? "contrast(1.15) saturate(1.1) brightness(1.1)"
            : "contrast(1.1) saturate(0.95) brightness(1.0)"
        }}
      />
      
      {/* Atmosphere / Color Grade Overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none mix-blend-overlay ${
          theme === "light" 
            ? "bg-gradient-to-b from-[#e0eaf5]/40 to-[#c8d6e5]/40" 
            : "bg-gradient-to-b from-[#111a24]/40 to-[#080d14]/60"
        }`} 
      />
      
      {/* Heavy Local Grain to ensure continuity with Hero */}
      <div className="absolute inset-0 pointer-events-none opacity-50 mix-blend-overlay z-10" style={{ backgroundImage: "url('/grain.svg')", backgroundSize: "128px" }} />
      <div className="site-grain absolute inset-0 z-10 opacity-60" />

      {/* Dark overlay for text contrast (stronger in dark theme) */}
      <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-black/30' : 'bg-black/20'}`} />

      
      {/* Back Button — mirrors the header island: same row, same capsule, same type */}
      <div className="absolute inset-x-0 top-0 z-50 pointer-events-none">
        <div className="page-container flex items-center h-[var(--site-header-bar)] w-full mt-2 max-lg:mt-[calc(var(--site-header-bar)+0.75rem)]">
          <motion.div
            className="pointer-events-auto flex items-center bg-bg-elevated/70 backdrop-blur-xl rounded-full border border-border/40 shadow-sm"
            style={{ padding: "0.15rem" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Link
              to="/"
              className="island-nav-link group relative inline-flex items-center gap-1.5 h-8 pl-2.5 pr-3 rounded-full text-[11px] font-bold tracking-wide uppercase transition-colors whitespace-nowrap text-fg-muted after:absolute after:inset-x-0 after:-inset-y-1.5 after:content-['']"
            >
              <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Explore
            </Link>
          </motion.div>
        </div>
      </div>


      {/* Typography */}
      <motion.div 
        className="relative z-20 text-center px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase max-w-4xl leading-tight" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>
          Creative Lab<br/>In Development
        </h2>
        <p className="mt-6 text-sm md:text-base font-mono text-accent tracking-[0.2em] uppercase" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
          To be released soon
        </p>
      </motion.div>
    </div>
  );
}
