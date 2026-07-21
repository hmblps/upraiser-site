import { lenovoPartnership } from "../data/liveContent";

type LenovoPartnershipLogoProps = {
  className?: string;
};

export function LenovoPartnershipLogo({ className }: LenovoPartnershipLogoProps) {
  return (
    <img
      src={lenovoPartnership.logo}
      alt={lenovoPartnership.logoAlt}
      className={`block ${className ?? ""}`.trim()}
      width={140}
      height={40}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}
