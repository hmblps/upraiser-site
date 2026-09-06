import { lenovoPartnership } from "../data/liveContent";

type LenovoPartnershipCopyProps = {
  className?: string;
  paragraphClassName?: string;
};

export function LenovoPartnershipCopy({
  className = "space-y-3",
  paragraphClassName = "text-base leading-relaxed text-muted sm:text-lg text-balance",
}: LenovoPartnershipCopyProps) {
  return (
    <div className={className}>
      <p className={paragraphClassName}>
        {lenovoPartnership.descriptionIntro} {lenovoPartnership.descriptionLead}
      </p>
    </div>
  );
}
