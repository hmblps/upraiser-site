
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
          <p className="section-label">The Expedition</p>
          <h2 className="section-title max-w-3xl">
            We mapped the mobile advertising terrain.
          </h2>
        </div>

        <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-start mt-10">
          <p className="section-description !max-w-none text-body-lg leading-snug text-fg/80">
            <span className="font-bold text-fg">Basecamp London, since 2017.</span>{" "}
            Systems, software, finance, and creative operators work at one desk.
            You speak directly to the crew who wires Your pipes and trades Your budgets.
          </p>

          <div className="bg-bg-card/60 p-8 rounded-3xl border border-border/60 backdrop-blur-md">
            <h3 className="section-label text-accent mb-4">Our Disciplines</h3>
            <ul className="flex flex-col gap-4 text-muted-light font-medium">
              {["Systems & Architecture", "Software Engineering", "Financial Trading", "Creative Studio"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
