import { lenovoPartnership } from "../data/content";

type LenovoPartnershipCopyProps = {
  className?: string;
  paragraphClassName?: string;
};

export function LenovoPartnershipCopy({
  className = "space-y-3",
  paragraphClassName = "text-sm leading-relaxed text-muted-light",
}: LenovoPartnershipCopyProps) {
  return (
    <div className={className}>
      <p className={paragraphClassName}>{lenovoPartnership.descriptionIntro}</p>
      <p className={paragraphClassName}>{lenovoPartnership.descriptionLead}</p>
    </div>
  );
}
