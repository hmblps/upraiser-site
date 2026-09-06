
export function AboutUsSection() {
  return (
    <section className="section-band border-t border-border/30 relative overflow-hidden">
      {/* Topographic / contour decoration */}
      <div className="absolute top-0 right-0 w-full max-w-3xl opacity-[0.04] pointer-events-none translate-x-1/3 -translate-y-1/4">
        <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="150" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10"/>
          <circle cx="400" cy="400" r="250" stroke="currentColor" strokeWidth="2"/>
          <circle cx="400" cy="400" r="350" stroke="currentColor" strokeWidth="2" strokeDasharray="5 20"/>
          <path d="M400 100 L400 300 M400 500 L400 700 M100 400 L300 400 M500 400 L700 400" stroke="currentColor" strokeWidth="2"/>
          <circle cx="400" cy="400" r="8" fill="currentColor"/>
        </svg>
      </div>

      <div className="page-container relative z-10">
        <div className="section-header">
          <p className="section-label">The Expedition Crew</p>
          <h2 className="section-title max-w-4xl text-balance">
            Elevating Your business to the absolute summit.
          </h2>
        </div>

        <div className="grid md:grid-cols-[1fr_1.2fr] lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 items-start mt-10">
          <div className="flex flex-col gap-6">
            <p className="section-description !max-w-none text-body-lg leading-snug text-fg/80">
              Scaling the digital landscape requires a tightly-knit crew of diverse operators. At Upraiser, we combine mathematical precision, creative power, and bulletproof infrastructure toward a single compass point: guiding Your brand to the peak of growth.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 lg:gap-10">
            <div>
              <h3 className="font-semibold text-fg mb-2">The Engineering Basecamp</h3>
              <p className="text-muted text-sm leading-relaxed">
                Anti-fraud and tracking architects securing Your path, ensuring absolute data integrity and clean traffic.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-fg mb-2">The Marketing Navigators</h3>
              <p className="text-muted text-sm leading-relaxed">
                Media veterans plotting the optimal, verified route to Your exact audience across complex digital terrains.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-fg mb-2">The Visual Architects</h3>
              <p className="text-muted text-sm leading-relaxed">
                UX/UI designers translating complex strategies into high-converting assets that actively drive user action.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-fg mb-2">The Data Scouts</h3>
              <p className="text-muted text-sm leading-relaxed">
                Analysts uncovering hidden growth vectors, monitoring metrics, and optimizing Your budgets in real-time.
              </p>
            </div>
            <div className="sm:col-span-2">
              <h3 className="font-semibold text-fg mb-2">The Expedition Guides</h3>
              <p className="text-muted text-sm leading-relaxed max-w-xl">
                Dedicated account managers ensuring transparent communication, seamless workflow, and steady momentum at every stage of the climb.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
