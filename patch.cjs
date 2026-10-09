const fs = require('fs');
let code = fs.readFileSync('src/components/ModeChart.tsx', 'utf8');

// We will inject the Signal Lineage Overlay into ModeChart.tsx
const overlay = `
          {/* Signal Lineage Overlays for Dark Theme (Replaces Ghosts) */}
          {!isGrowth && (
            <div className="absolute inset-0 w-full h-full pointer-events-none font-mono text-[10px] z-20 flex text-white/80">
              {/* STEP 01: INGRESS */}
              <div className="flex-1 relative border-r border-white/10">
                <div className="absolute top-[15%] left-[10%] right-[10%] opacity-90">
                  <div className="text-[9px] text-accent-secondary font-bold tracking-[0.2em] mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent-secondary animate-pulse" />
                    STEP_01 // INGRESS
                  </div>
                  <div className="text-white/60 whitespace-pre text-[9px] leading-tight mb-2">
                    {'{ "device_tier": "Lenovo_OEM_ROM",\\n  "geo": "UK_London_51.5074",\\n  "bid_hash": "0x7F...9A21" }'}
                  </div>
                  <div className="text-accent font-semibold tracking-wide text-[9px]">
                    AUTHENTIC_HARDWARE
                  </div>
                </div>
              </div>

              {/* STEP 02: GATEWAY (Filter occurs here) */}
              <div className="flex-1 relative border-r border-white/10">
                <div className="absolute top-[45%] left-[10%] right-[10%] opacity-90">
                  <div className="text-[9px] text-accent-secondary font-bold tracking-[0.2em] mb-2">
                    STEP_02 // GATEWAY
                  </div>
                  <div className="text-red-400 font-semibold flex flex-col gap-1 text-[9px]">
                    <span>[DROPPED] 2.0% Bot Signatures</span>
                    <span>[ISOLATED] $14,200 Chargeback</span>
                  </div>
                </div>
              </div>

              {/* STEP 03: RECONCILIATION */}
              <div className="flex-1 relative">
                <div className="absolute top-[25%] left-[10%] right-[10%] opacity-90">
                  <div className="text-[9px] text-accent-secondary font-bold tracking-[0.2em] mb-3">
                    STEP_03 // RECONCILIATION
                  </div>
                  <div className="flex flex-col gap-1 text-white/70 mb-3 text-[9px]">
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span>AppsFlyer Receipt</span><span className="text-[#4ade80]">MATCH</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span>Media Invoice</span><span className="text-[#4ade80]">MATCH</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#4ade80] tracking-tighter">DRIFT: 0.00%</div>
                  </div>
                </div>
              </div>
            </div>
          )}
`;

// Insert the overlay right after the fold-chart-ghosts wrapper
code = code.replace(
  /<div className="fold-chart-ghosts">[\s\S]*?<\/div>/,
  (match) => match + '\n' + overlay
);

// We need to conditionally hide the normal ghosts when !isGrowth
code = code.replace(
  /<div className="fold-chart-ghosts">/,
  '<div className="fold-chart-ghosts" style={{ opacity: isGrowth ? 1 : 0 }}>'
);

fs.writeFileSync('src/components/ModeChart.tsx', code);
