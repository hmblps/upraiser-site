import { lenovoPartnership } from "../data/liveContent";

type LenovoPartnershipCopyProps = {
  className?: string;
  paragraphClassName?: string;
};

export function LenovoPartnershipCopy({
  className = "space-y-3",
  paragraphClassName = "copy",
}: LenovoPartnershipCopyProps) {
  return (
    <div className={className}>
      <p className={paragraphClassName}>{lenovoPartnership.descriptionIntro}</p>
      <p className={paragraphClassName}>{lenovoPartnership.descriptionLead}</p>
    </div>
  );
}
