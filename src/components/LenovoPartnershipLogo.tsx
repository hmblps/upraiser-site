import { lenovoPartnership } from "../data/content";

type LenovoPartnershipLogoProps = {
  className?: string;
};

export function LenovoPartnershipLogo({ className }: LenovoPartnershipLogoProps) {
  return (
    <img
      src={lenovoPartnership.logo}
      alt={lenovoPartnership.logoAlt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
