import { BrandAurora } from "../components/BrandAurora";
import { useBrandAuroraNav } from "../hooks/useBrandAuroraNav";
import { Company } from "../components/Company";
import { ExpeditionAscentHero } from "../components/ExpeditionAscentHero";

export function ExpeditionPage() {
  useBrandAuroraNav();

  return (
    <main className="site-main relative">
      <BrandAurora tone="company" />
      <ExpeditionAscentHero />
      <div className="relative z-[1]">
        <Company />
      </div>
    </main>
  );
}
