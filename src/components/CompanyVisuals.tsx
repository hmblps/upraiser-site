import { motion } from "framer-motion";

export function DossierGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30 mix-blend-overlay flex items-center justify-center overflow-hidden">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dossier-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dossier-grid)" className="text-muted" />
        
        {/* Crosshairs */}
        <path d="M 20% 0 L 20% 100% M 0 20% L 100% 20%" stroke="currentColor" strokeWidth="1" className="text-accent/40" strokeDasharray="4 4" />
        <path d="M 80% 0 L 80% 100% M 0 80% L 100% 80%" stroke="currentColor" strokeWidth="1" className="text-accent/40" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}

export function TerminalBlock() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="my-8 rounded-lg border border-border bg-[#0A0C10] overflow-hidden font-mono text-xs sm:text-sm text-[#8B949E] shadow-xl"
    >
      <div className="flex items-center px-4 py-2 border-b border-border/50 bg-[#161B22]">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
        </div>
        <div className="ml-4 text-xs font-semibold text-[#8B949E]">bash — init_protocol.sh</div>
      </div>
      <div className="p-4 sm:p-6 space-y-2">
        <div className="flex">
          <span className="text-[#3FB950] mr-2">➜</span>
          <span className="text-[#58A6FF]">~</span>
          <span className="text-fg ml-2">./establish_basecamp.sh --mode=stealth</span>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-[#8B949E]"
        >
          [INIT] Securing data pipelines...<br/>
          [OK] MMP API connections verified.<br/>
          [OK] Fraud heuristics loaded.<br/>
          [INFO] Ready for scale.
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex mt-2"
        >
          <span className="text-[#3FB950] mr-2">➜</span>
          <span className="text-[#58A6FF]">~</span>
          <span className="animate-pulse ml-2 text-fg">_</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function NodeGraphDecoration() {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-10 dark:opacity-20 text-accent">
      <svg width="300" height="300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="3" fill="currentColor" />
        <circle cx="80" cy="30" r="4" fill="currentColor" />
        <circle cx="40" cy="80" r="5" fill="currentColor" />
        <circle cx="70" cy="70" r="2" fill="currentColor" />
        <circle cx="50" cy="45" r="3.5" fill="currentColor" />
        
        <path d="M 20 20 L 50 45 L 80 30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" />
        <path d="M 50 45 L 40 80 L 70 70 L 50 45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" />
        <path d="M 20 20 L 40 80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" />
      </svg>
    </div>
  );
}
