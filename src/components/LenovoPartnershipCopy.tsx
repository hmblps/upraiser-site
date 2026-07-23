import { lenovoPartnership } from "../data/liveContent";

type LenovoPartnershipCopyProps = {
  className?: string;
  paragraphClassName?: string;
  /** `strip` = one-line home proof; `full` = partners/procurement copy */
  variant?: "strip" | "full";
};

export function LenovoPartnershipCopy({
  className = "space-y-3",
  paragraphClassName = "text-sm leading-relaxed text-muted-light",
  variant = "full",
}: LenovoPartnershipCopyProps) {
  if (variant === "strip") {
    return (
      <div className={className}>
        <p className={paragraphClassName}>{lenovoPartnership.stripLine}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className={paragraphClassName}>{lenovoPartnership.descriptionIntro}</p>
      <p className={paragraphClassName}>{lenovoPartnership.descriptionLead}</p>
    </div>
  );
}
