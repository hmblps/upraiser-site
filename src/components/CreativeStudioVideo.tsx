import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface CreativeStudioVideoProps {
  videoSrc: string;
  theme: "light" | "dark";
}

export function CreativeStudioVideo({ videoSrc, theme }: CreativeStudioVideoProps) {
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black flex flex-col items-center justify-center select-none">
      {/* Video with Theme-Specific Filters — continuous background loop */}
      <video
        key={videoSrc}
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
          filter:
            theme === "light"
              ? "contrast(1.15) saturate(1.1) brightness(1.1)"
              : "contrast(1.1) saturate(0.95) brightness(1.0)",
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
      <div className="site-grain absolute inset-0 z-10 opacity-60 pointer-events-none" />

      {/* Dark overlay for text contrast */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          theme === "dark" ? "bg-black/35" : "bg-black/25"
        }`}
      />

      {/* Typography — First version with enlarged subtitle */}
      <motion.div
        className="relative z-20 text-center px-4 max-w-4xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight uppercase max-w-4xl leading-[1.08] font-display text-balance"
          style={{ textShadow: "0 4px 28px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)" }}
        >
          <span className="block">{t("craftPage.titleLine1", "The Craft")}</span>
          <span className="block">{t("craftPage.titleLine2", "In Development")}</span>
        </h1>
        <p
          className="mt-5 sm:mt-6 md:mt-7 text-base sm:text-lg md:text-xl lg:text-2xl font-mono text-accent tracking-[0.25em] uppercase font-semibold"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}
        >
          {t("To be released soon", "To be released soon")}
        </p>
      </motion.div>
    </div>
  );
}
