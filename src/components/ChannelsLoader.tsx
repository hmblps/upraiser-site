import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Cpu } from "lucide-react";

export function ChannelsLoader() {
  const { active, progress } = useProgress();
  const show = active && progress < 100;

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none backdrop-blur-xl bg-bg/20"
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="relative flex items-center justify-center w-16 h-16 md:w-32 md:h-32 rounded-full border border-border/30 bg-bg-elevated/40 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute top-1 md:top-3 text-[8px] md:text-xs font-mono font-bold text-fg/60 tracking-tighter">O</div>
              <div className="absolute right-1 md:right-3 text-[8px] md:text-xs font-mono font-bold text-fg/60 tracking-tighter">E</div>
              <div className="absolute bottom-1 md:bottom-3 text-[8px] md:text-xs font-mono font-bold text-fg/60 tracking-tighter">M</div>
              <div className="absolute left-1 md:left-3 text-[8px] md:text-xs font-mono font-bold text-fg/60 tracking-tighter">A</div>
              <div className="animate-pulse">
                <Cpu className="h-6 w-6 md:h-12 md:w-12 text-accent" strokeWidth={2} />
              </div>
            </motion.div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-fg/70 animate-pulse">
              Configuring Devices
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
