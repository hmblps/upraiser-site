/** Cheap static film grain — avoid live SVG turbulence (repaints every frame). */
export function SiteGrain() {
  return <div className="site-grain pointer-events-none fixed inset-0" aria-hidden />;
}
