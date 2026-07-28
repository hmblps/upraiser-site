import { Link } from "react-router-dom";
import { Magnetic } from "../components/motion-preview/Magnetic";

/** Soft 404 — never silently dump visitors back on Home. */
export function NotFoundPage() {
  return (
    <main className="site-main flex min-h-[70dvh] items-center pt-[var(--site-header-height)]">
      <div className="section-inner py-20">
        <p className="section-label">404</p>
        <h1 className="mt-3 max-w-[14ch] text-4xl font-extrabold tracking-tighter text-fg sm:text-5xl">
          This page is not on the map
        </h1>
        <p className="copy mt-5 max-w-md text-muted">
          The route may have moved. Head home, or open Solutions if You were looking for capabilities.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Magnetic>
            <Link
              to="/"
              data-cursor="cta"
              className="btn-caps inline-block rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-on-accent hover:bg-orange-light"
            >
              Home
            </Link>
          </Magnetic>
          <Magnetic strength={0.22}>
            <Link
              to="/expertise"
              className="btn-caps btn-secondary inline-block rounded-full px-7 py-3.5 text-sm font-semibold hover:border-orange/35"
            >
              Solutions
            </Link>
          </Magnetic>
        </div>
      </div>
    </main>
  );
}
