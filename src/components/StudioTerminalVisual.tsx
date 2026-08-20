import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const lines = [
  "[SYS] Initializing Log-Reconciliation Matrix...",
  "[SYS] Connecting to MMP (Adjust, AppsFlyer, Singular)...",
  "[OK]  MMP Handshake complete. Latency: 0.4ms",
  "[ACT] Scanning incoming CGC (Creator-Generated Content) assets...",
  "[OK]  Asset ID: vid_x89_final mapped to tracking URL.",
  "[ACT] Verifying post-flight log drift...",
  "[OK]  0% drift detected. Event: first_deposit_complete",
  "[SYS] Ready for programmatic deployment.",
];

export function StudioTerminalVisual() {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => (prev < lines.length ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="aspect-square relative w-full bg-[#0a0a0a] border border-border/20 rounded-xl overflow-hidden flex flex-col font-mono text-xs sm:text-sm shadow-2xl">
      <div className="flex items-center px-4 py-3 bg-[#161616] border-b border-border/20 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-muted-light">creative-tech-workspace ~ bash</span>
      </div>
      <div className="flex-1 p-5 flex flex-col gap-3 overflow-y-auto">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i < visibleLines ? 1 : 0, x: i < visibleLines ? 0 : -10 }}
            transition={{ duration: 0.2 }}
            className={`
              ${line.startsWith("[OK]") ? "text-green-400" : ""}
              ${line.startsWith("[ACT]") ? "text-accent" : ""}
              ${line.startsWith("[SYS]") ? "text-muted-light" : ""}
            `}
          >
            {line}
          </motion.div>
        ))}
        {visibleLines >= lines.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2.5 h-4 bg-accent mt-1"
          />
        )}
      </div>
    </div>
  );
}
