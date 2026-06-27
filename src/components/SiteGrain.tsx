export function SiteGrain() {
  return (
    <div className="site-grain pointer-events-none fixed inset-0" aria-hidden>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="upraiser-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#upraiser-grain)" />
      </svg>
    </div>
  );
}
