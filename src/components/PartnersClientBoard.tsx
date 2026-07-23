import type { CSSProperties } from "react";
import { clientBrandRows, type ClientBrand } from "../data/clients";
import { useReducedMotion } from "../hooks/useReducedMotion";

function ClientMark({ brand }: { brand: ClientBrand }) {
  if (brand.logo) {
    return (
      <div
        className="client-chip"
        style={{ "--logo-scale": brand.scale ?? 1 } as CSSProperties}
      >
        <img
          src={brand.logo}
          alt={brand.name}
          className="client-chip__logo"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className="client-chip client-chip--wordmark">
      <span className="client-chip__name">{brand.name}</span>
    </div>
  );
}

function ClientRow({
  brands,
  direction,
  durationSec,
  reduced,
}: {
  brands: ClientBrand[];
  direction: "left" | "right";
  durationSec: number;
  reduced: boolean;
}) {
  const loop = reduced ? brands : [...brands, ...brands];

  return (
    <div className="clients-board__row">
      <div
        className={`clients-board__track clients-board__track--${direction}${reduced ? " is-static" : ""}`}
        style={{ "--marquee-duration": `${durationSec}s` } as CSSProperties}
      >
        {loop.map((brand, index) => (
          <div
            key={`${brand.slug}-${index}`}
            aria-hidden={!reduced && index >= brands.length ? true : undefined}
          >
            <ClientMark brand={brand} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Brand board for /partners — not a home strip, not the integrations marquee. */
export function PartnersClientBoard() {
  const reduced = useReducedMotion();
  const [rowA, rowB] = clientBrandRows();

  return (
    <div className="clients-board">
      <div className="clients-board__stage">
        <div className="clients-board__fade clients-board__fade--left" aria-hidden />
        <div className="clients-board__fade clients-board__fade--right" aria-hidden />
        <ClientRow brands={rowA} direction="left" durationSec={48} reduced={reduced} />
        <ClientRow brands={rowB} direction="right" durationSec={54} reduced={reduced} />
      </div>
    </div>
  );
}
