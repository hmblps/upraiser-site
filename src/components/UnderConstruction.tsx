import { ScrollLink } from "./ScrollLink";

type UnderConstructionProps = {
  label: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
};

/** Depth-page placeholder — expedition tone, minimal chrome. */
export function UnderConstruction({
  label,
  title,
  description,
  backHref = "/",
  backLabel = "Return to The Basecamp",
}: UnderConstructionProps) {
  return (
    <section className="section-band section-band--statement min-h-[min(72dvh,40rem)]">
      <div className="section-inner flex flex-col items-start justify-center py-16">
        <p className="section-label">{label}</p>
        <h1 className="section-title mt-3 max-w-xl">{title}</h1>
        <p className="section-description mt-4 max-w-lg">{description}</p>
        <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-widest text-accent">Under construction</p>
        <ScrollLink
          href={backHref}
          className="btn-caps btn-secondary mt-10 inline-flex min-h-[44px] items-center rounded-full px-7 py-3 text-sm font-semibold touch-manipulation"
        >
          {backLabel}
        </ScrollLink>
      </div>
    </section>
  );
}
