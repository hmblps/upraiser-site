const fs = require('fs');
let code = fs.readFileSync('src/components/ModeChart.tsx', 'utf8');

// Replace the previous overlay with the new polished one
code = code.replace(
  /\{\/\* Signal Lineage Overlays for Dark Theme \(Replaces Ghosts\) \*\/\}[\s\S]*?(?=\n\s*\{?\/\*?)/,
  `{/* Signal Lineage Overlays for Dark Theme (Replaces Ghosts) */}
          {!isGrowth && (
            <div className="absolute inset-0 w-full h-full pointer-events-none font-mono z-20">
              
              {/* STEP 01: INGRESS */}
              <div className="absolute top-[10%] xl:top-[15%] left-[5%] xl:left-[8%] w-[32%] xl:w-[28%] bg-[#050505]/70 backdrop-blur-md border border-white/10 rounded-lg p-3 xl:p-4 shadow-xl">
                <div className="text-[8px] xl:text-[9px] text-white/50 font-bold tracking-[0.2em] mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--theme-accent)]" />
                  STEP_01 // INGRESS
                </div>
                <div className="text-white/70 whitespace-pre text-[9px] xl:text-[10px] leading-relaxed mb-3 font-mono opacity-90">
                  {\`{\\n  "device": "Lenovo_OEM",\\n  "geo": "UK_London",\\n  "bid_hash": "0x7F..9A21"\\n}\`}
                </div>
                <div className="text-accent font-semibold tracking-wider text-[8px] xl:text-[9px] uppercase">
                  Authentic Hardware
                </div>
              </div>

              {/* STEP 02: GATEWAY */}
              <div className="absolute top-[45%] left-[50%] -translate-x-1/2 w-[34%] xl:w-[32%] min-w-[200px] bg-[#050505]/80 backdrop-blur-md border border-red-500/20 rounded-lg p-3 xl:p-4 shadow-2xl">
                <div className="text-[8px] xl:text-[9px] text-accent-secondary font-bold tracking-[0.2em] mb-3">
                  STEP_02 // GATEWAY
                </div>
                <div className="text-red-400 font-semibold flex flex-col gap-2.5 text-[8px] xl:text-[9px] uppercase tracking-wide">
                  <div className="flex justify-between items-center">
                    <span>Bot Signatures</span>
                    <span className="text-red-500/80 font-bold">[DROPPED]</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>$14k Chargeback</span>
                    <span className="text-red-500/80 font-bold">[ISOLATED]</span>
                  </div>
                </div>
              </div>

              {/* STEP 03: RECONCILIATION */}
              <div className="absolute top-[18%] xl:top-[20%] right-[3%] xl:right-[5%] w-[32%] xl:w-[30%] bg-[#050505]/70 backdrop-blur-md border border-white/10 rounded-lg p-3 xl:p-4 shadow-xl">
                <div className="text-[8px] xl:text-[9px] text-white/50 font-bold tracking-[0.2em] mb-3">
                  STEP_03 // RECONCILIATION
                </div>
                <div className="flex flex-col gap-2 text-white/70 mb-4 text-[8px] xl:text-[9px] uppercase tracking-wide">
                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span>MMP Receipt</span><span className="text-[#4ade80] font-bold">MATCH</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span>Media Invoice</span><span className="text-[#4ade80] font-bold">MATCH</span>
                  </div>
                </div>
                <div>
                  <div className="text-lg xl:text-2xl font-bold text-[#4ade80] tracking-tighter">DRIFT: 0.00%</div>
                  <div className="text-white/30 text-[7px] xl:text-[8px] mt-1 break-all opacity-70">
                    sha256:8f434346648f6b96df89dda901c5176b
                  </div>
                </div>
              </div>

            </div>
          )}`
);

fs.writeFileSync('src/components/ModeChart.tsx', code);
