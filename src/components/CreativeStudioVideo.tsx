import { motion } from "framer-motion";

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
