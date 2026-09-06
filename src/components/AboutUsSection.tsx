
export function AboutUsSection() {
  return (
    <section className="section-band border-t border-border/30 relative overflow-hidden">
      {/* Topographic / contour decoration */}
      <div className="absolute top-0 right-0 w-full max-w-3xl opacity-[0.05] pointer-events-none translate-x-1/3 -translate-y-1/4">
        <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M541.0,400.0 Q534.5,477.6 479.7,538.1 Q400.0,568.8 325.9,528.3 Q263.2,479.0 248.6,400.0 Q270.9,325.5 329.0,277.0 Q400.0,237.7 475.6,269.0 Q533.8,322.7 543.4,400.0 Z" stroke="currentColor" strokeWidth="6" strokeDasharray="10 20" />
          <path d="M635.2,400.0 Q636.2,497.8 589.6,589.6 Q507.2,658.9 400.0,666.0 Q301.3,638.3 221.0,579.0 Q153.8,502.0 156.1,400.0 Q146.1,294.8 235.9,235.9 Q298.0,153.8 400.0,132.1 Q499.2,160.5 584.0,216.0 Q653.4,295.0 648.6,400.0 Z" stroke="currentColor" strokeWidth="6" />
          <path d="M767.8,400.0 Q727.9,506.5 699.3,617.5 Q611.4,691.0 501.9,713.7 Q400.0,777.2 295.8,720.7 Q175.1,709.6 124.3,600.3 Q29.2,520.5 54.0,400.0 Q73.7,294.0 110.0,189.3 Q188.3,108.6 296.6,81.6 Q400.0,19.3 500.1,92.0 Q609.0,112.3 687.6,191.1 Q751.8,285.7 776.1,400.0 Z" stroke="currentColor" strokeWidth="6" strokeDasharray="20 40" />
          <circle cx="400" cy="400" r="10" fill="currentColor"/>
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
