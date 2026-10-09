import { lenovoPartnership } from "../data/liveContent";
import { useTranslation } from "react-i18next";

type LenovoPartnershipCopyProps = {
  className?: string;
  paragraphClassName?: string;
};

export function LenovoPartnershipCopy({
  className = "space-y-3",
  paragraphClassName = "text-base leading-relaxed text-muted sm:text-lg",
}: LenovoPartnershipCopyProps) {
  const { t } = useTranslation();
  return (
    <div className={className}>
      <p className={paragraphClassName}>
        {t("lenovo.descriptionIntro", lenovoPartnership.descriptionIntro)} {t("lenovo.descriptionLead", lenovoPartnership.descriptionLead)}
      </p>
    </div>
  );
}
