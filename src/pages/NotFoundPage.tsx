import { Link } from "react-router-dom";
import { Magnetic } from "../components/motion-preview/Magnetic";

/** Soft 404 — never silently dump visitors back on Home. */
export function NotFoundPage() {
  return (
    <main className="site-main flex min-h-[70dvh] items-center pt-[var(--site-header-height)]">
      <div className="section-inner py-20">
        <p className="section-label">404</p>
        <h1 className="section-heading--lg max-w-[14ch]">This page is not on the map</h1>
        <p className="copy mt-5 max-w-md text-muted">
          The route may have moved. Head home, or jump to The Routes on the pitch.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Magnetic>
            <Link
              to="/"
              data-cursor="cta"
              className="btn-caps btn-caps--primary inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 touch-manipulation"
            >
              Home
            </Link>
          </Magnetic>
          <Magnetic strength={0.22}>
            <Link
              to="/#routes"
              className="btn-caps btn-secondary inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 touch-manipulation"
            >
              The Routes
            </Link>
          </Magnetic>
        </div>
      </div>
    </main>
  );
}
