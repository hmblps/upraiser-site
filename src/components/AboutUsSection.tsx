
export function AboutUsSection() {
  return (
    <section className="section-band border-t border-border/30 relative overflow-hidden">
      {/* Schematic Ascent Decoration (Realistic Trace) */}
      <div className="absolute top-0 right-0 w-full max-w-5xl opacity-[0.20] pointer-events-none translate-x-[15%] -translate-y-[5%]">
        <svg viewBox="0 0 1000 750" fill="none" xmlns="http://www.w3.org/2000/svg" className="font-sans uppercase font-semibold">
          
          <style>
            {`
              .mountain-line { stroke: currentColor; stroke-width: 1.5px; opacity: 0.25; stroke-linejoin: round; stroke-linecap: round; }
              .route-line { stroke: var(--accent); stroke-width: 2.5px; opacity: 0.8; stroke-linejoin: round; stroke-linecap: round; }
              .node-circle { fill: var(--accent); }
              .node-text { fill: var(--bg); font-size: 11px; font-weight: bold; text-anchor: middle; dominant-baseline: central; font-family: ui-sans-serif, system-ui, sans-serif; }
              .label-text { fill: currentColor; font-size: 11px; opacity: 0.8; letter-spacing: 0.1em; font-family: ui-sans-serif, system-ui, sans-serif; }
              .label-title { fill: currentColor; font-size: 14px; font-weight: bold; letter-spacing: 0.1em; font-family: ui-sans-serif, system-ui, sans-serif; }
            `}
          </style>

          {/* Mountain Ridges (Silhouette and inner ridges) */}
          <path className="mountain-line" d="M 0 600 L 100 480 L 150 400 L 220 250 L 300 180 L 420 70 L 500 150 L 600 180 L 720 100 L 800 200 L 900 250 L 1000 300" />
          <path className="mountain-line" d="M 420 70 L 450 250 L 500 400 L 700 600 L 950 700" />
          <path className="mountain-line" d="M 420 70 L 380 250 L 300 500 L 250 750" />
          <path className="mountain-line" d="M 720 100 L 750 300 L 850 500" />
          <path className="mountain-line" d="M 600 180 L 650 350" />

          {/* Climbing Routes (Red lines in reference) */}
          <path className="route-line" d="M 420 70 L 320 180 L 240 300 L 180 450 L 120 550" />
          <path className="route-line" d="M 240 300 L 340 250 L 400 180" />
          <path className="route-line" d="M 180 450 L 320 380" />
          <path className="route-line" d="M 400 180 L 350 350 L 310 550 L 280 680" />
          <path className="route-line" d="M 420 70 L 420 200 L 400 400 L 380 600 L 370 720" />
          <path className="route-line" d="M 420 70 L 450 180 L 520 350 L 700 450 L 850 500 L 950 520" />
          <path className="route-line" d="M 500 250 L 520 350 L 600 550 L 620 750" />
          <path className="route-line" d="M 650 420 L 720 500 L 800 550" />
          <path className="route-line" d="M 580 380 L 680 420 L 750 480" />
          <path className="route-line" d="M 420 70 L 480 150 L 550 200 L 650 280 L 750 380 L 780 450" />
          <path className="route-line" d="M 600 180 L 650 200 L 720 250 L 780 350 L 800 420" />

          {/* Nodes */}
          <g>
            <circle cx="150" cy="480" r="10" className="node-circle"/><text x="150" y="481" className="node-text">2</text>
            <circle cx="280" cy="220" r="10" className="node-circle"/><text x="280" y="221" className="node-text">2</text>
            <circle cx="330" cy="260" r="10" className="node-circle"/><text x="330" y="261" className="node-text">8</text>
            <circle cx="230" cy="350" r="10" className="node-circle"/><text x="230" y="351" className="node-text">8</text>
            <circle cx="315" cy="450" r="10" className="node-circle"/><text x="315" y="451" className="node-text">10</text>
            <circle cx="430" cy="180" r="10" className="node-circle"/><text x="430" y="181" className="node-text">6</text>
            <circle cx="405" cy="450" r="10" className="node-circle"/><text x="405" y="451" className="node-text">6</text>
            <circle cx="445" cy="230" r="10" className="node-circle"/><text x="445" y="231" className="node-text">3</text>
            <circle cx="800" cy="500" r="10" className="node-circle"/><text x="800" y="501" className="node-text">3</text>
            <circle cx="500" cy="280" r="10" className="node-circle"/><text x="500" y="281" className="node-text">5</text>
            <circle cx="620" cy="650" r="10" className="node-circle"/><text x="620" y="651" className="node-text">5</text>
            <circle cx="720" cy="500" r="10" className="node-circle"/><text x="720" y="501" className="node-text">9</text>
            <circle cx="680" cy="420" r="10" className="node-circle"/><text x="680" y="421" className="node-text">4</text>
            <circle cx="650" cy="280" r="10" className="node-circle"/><text x="650" y="281" className="node-text">7</text>
            <circle cx="680" cy="220" r="10" className="node-circle"/><text x="680" y="221" className="node-text">1</text>
          </g>

          {/* Labels */}
          <g className="label-text">
            <text x="420" y="30" textAnchor="middle" className="label-title">EVEREST</text>
            <text x="420" y="50" textAnchor="middle">8848M</text>

            <text x="720" y="50" textAnchor="middle" className="label-title">LHOTSE</text>
            <text x="720" y="70" textAnchor="middle">8545M</text>

            <text x="600" y="130" textAnchor="middle">SOUTH COL</text>
            
            <g transform="translate(180, 350) rotate(-65)">
              <text x="0" y="0" textAnchor="middle">NORTH RIDGE</text>
            </g>

            <text x="150" y="620" textAnchor="start">NORTH COL</text>
            
            <text x="350" y="550" textAnchor="middle">NORTH FACE</text>
            <text x="350" y="565" textAnchor="middle">(TIBET)</text>
            
            <g transform="translate(520, 430) rotate(35)">
              <text x="0" y="0" textAnchor="middle">WEST RIDGE</text>
            </g>

            <text x="580" y="350" textAnchor="middle">SOUTH-WEST</text>
            <text x="580" y="365" textAnchor="middle">FACE</text>
            <text x="580" y="380" textAnchor="middle">(NEPAL)</text>

            <text x="850" y="440" textAnchor="start">ICE FIELD</text>
            <text x="850" y="455" textAnchor="start">~ 6100M</text>

            <text x="720" y="570" textAnchor="start">WEST SHOULDER</text>
            <text x="720" y="585" textAnchor="start">7254M</text>

            <text x="650" y="700" textAnchor="start">LHO PASS</text>
            <text x="650" y="715" textAnchor="start">6006M</text>

            <g transform="translate(350, 700) rotate(45)">
              <text x="0" y="0" textAnchor="start">RONGBUK GLACIER</text>
            </g>

            <g transform="translate(850, 700) rotate(-65)">
              <text x="0" y="0" textAnchor="start">KHUMBU GLACIER</text>
            </g>
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
