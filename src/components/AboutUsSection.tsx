
export function AboutUsSection() {
  return (
    <section className="section-band border-t border-border/30 relative overflow-hidden">
      {/* Schematic Ascent Decoration */}
      <div className="absolute top-0 right-0 w-full max-w-4xl opacity-[0.12] pointer-events-none translate-x-[20%] -translate-y-[10%]">
        <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className="font-mono text-[11px] uppercase tracking-widest font-semibold">
          {/* Mountain Ridges (Subtle Background) */}
          <path d="M150,850 L350,550 L480,250 L500,150 L650,400 L850,750" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.4" />
          <path d="M500,150 L550,300 L750,550 L950,850" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.4" />
          <path d="M350,550 L200,700 L50,850" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.4" />

          {/* Climbing Routes (Solid Lines) */}
          {/* Route 1: Far Left (North Ridge) */}
          <path d="M250,850 Q280,600 330,470 T460,310 L500,150" stroke="currentColor" strokeWidth="3" />
          
          {/* Route 2: Center Left (North Face) */}
          <path d="M380,850 Q410,550 450,430 T500,150" stroke="currentColor" strokeWidth="3" />

          {/* Route 3: Center Right (West Ridge) */}
          <path d="M600,850 Q580,600 540,450 T500,150" stroke="currentColor" strokeWidth="3" />

          {/* Route 4: Far Right (South-West Face) */}
          <path d="M800,850 Q750,550 650,400 T500,150" stroke="currentColor" strokeWidth="3" />

          {/* Connectors / Traverses */}
          <path d="M330,470 Q390,450 450,430" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 6" />
          <path d="M540,450 Q580,410 650,400" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 6" />

          {/* Nodes & Labels */}
          <g className="text-current">
            <circle cx="500" cy="150" r="10" fill="currentColor"/>
            <text x="500" y="120" textAnchor="middle" className="text-[14px]">THE SUMMIT</text>
            <text x="500" y="135" textAnchor="middle" opacity="0.6" className="text-[10px]">8,848M</text>

            <circle cx="330" cy="470" r="7" fill="currentColor"/>
            <text x="315" y="474" textAnchor="end">NORTH RIDGE</text>
            
            <circle cx="280" cy="620" r="7" fill="currentColor"/>
            <text x="265" y="624" textAnchor="end">NORTH COL</text>

            <circle cx="450" cy="430" r="7" fill="currentColor"/>
            <text x="435" y="434" textAnchor="end">NORTH FACE</text>

            <circle cx="540" cy="450" r="7" fill="currentColor"/>
            <text x="555" y="454" textAnchor="start">WEST RIDGE</text>

            <circle cx="650" cy="400" r="7" fill="currentColor"/>
            <text x="665" y="404" textAnchor="start">SOUTH COL</text>

            <circle cx="705" cy="565" r="7" fill="currentColor"/>
            <text x="720" y="569" textAnchor="start">ICE FIELD (6100M)</text>

            <circle cx="250" cy="850" r="8" fill="currentColor"/>
            <text x="250" y="875" textAnchor="middle">RONGBUK GLACIER</text>

            <circle cx="600" cy="850" r="8" fill="currentColor"/>
            <text x="600" y="875" textAnchor="middle">KHUMBU GLACIER</text>
          </g>
        </svg>
      </div>

      <div className="page-container relative z-10">
        <div className="section-header">
          <p className="section-label">The Expedition Crew</p>
          <h2 className="section-title max-w-4xl text-balance">
            Elevating Your business to the absolute summit
          </h2>
        </div>

        <div className="grid md:grid-cols-[1fr_1.5fr] lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start mt-8">
          <div className="flex flex-col gap-5">
            <p className="section-description !max-w-none text-body-lg leading-snug text-fg/80 text-balance">
              Scaling the heights of the digital landscape requires a tightly-knit crew of diverse operators. At Upraiser, our unique skills are unified toward a single compass point: guiding Your business to the absolute peak of growth.
            </p>
            <p className="section-description !max-w-none text-body-lg leading-snug text-fg/80 text-balance">
              Our foundation is built to conquer any terrain. We combine mathematical precision, creative power, and bulletproof infrastructure, ensuring that every step of Your ascent is secured by operators who understand the pure mechanics of scale.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 lg:gap-x-12 lg:gap-y-8">
            <div>
              <h3 className="font-semibold text-fg text-sm mb-1">The Engineering Basecamp</h3>
              <p className="text-muted text-[13px] leading-relaxed text-balance">
                Anti-fraud and tracking architects securing Your path, ensuring absolute data integrity and clean traffic.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-fg text-sm mb-1">The Marketing Navigators</h3>
              <p className="text-muted text-[13px] leading-relaxed text-balance">
                Media veterans plotting the optimal, verified route to Your exact audience across complex digital terrains.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-fg text-sm mb-1">The Visual Architects</h3>
              <p className="text-muted text-[13px] leading-relaxed text-balance">
                UX/UI designers translating complex strategies into high-converting assets that actively drive user action.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-fg text-sm mb-1">The Data Scouts</h3>
              <p className="text-muted text-[13px] leading-relaxed text-balance">
                Analysts uncovering hidden growth vectors, monitoring metrics, and optimizing Your budgets in real-time.
              </p>
            </div>
            <div className="sm:col-span-2">
              <h3 className="font-semibold text-fg text-sm mb-1">The Expedition Guides</h3>
              <p className="text-muted text-[13px] leading-relaxed max-w-xl text-balance">
                Dedicated account managers ensuring transparent communication, seamless workflow, and steady momentum at every stage of the climb.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
