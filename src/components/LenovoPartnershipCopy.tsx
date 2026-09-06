import { lenovoPartnership } from "../data/liveContent";

type LenovoPartnershipCopyProps = {
  className?: string;
  paragraphClassName?: string;
};

export function LenovoPartnershipCopy({
  className = "space-y-3",
  paragraphClassName = "copy text-[14px] sm:text-[15px] leading-tight sm:leading-snug",
}: LenovoPartnershipCopyProps) {
  return (
    <div className={className}>
      <p className={paragraphClassName}>
        {lenovoPartnership.descriptionIntro} {lenovoPartnership.descriptionLead}
      </p>
    </div>
  );
}
