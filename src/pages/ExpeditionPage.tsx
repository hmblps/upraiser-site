import { BrandAurora } from "../components/BrandAurora";
import { useBrandAuroraNav } from "../hooks/useBrandAuroraNav";
import { Company } from "../components/Company";

export function ExpeditionPage() {
  useBrandAuroraNav();

  return (
    <main className="site-main relative">
      <BrandAurora tone="company" />
      <div className="relative z-[1]">
        <Company />
      </div>
    </main>
  );
}
