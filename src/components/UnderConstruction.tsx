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
        <div className="mt-8 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
          <p className="font-mono text-base font-medium tracking-wider uppercase text-accent">System Status: Online</p>
        </div>
        <ScrollLink
          href={backHref}
          className="btn-caps btn-secondary mt-10 inline-flex min-h-[44px] items-center rounded-full px-7 py-3 touch-manipulation"
        >
          {backLabel}
        </ScrollLink>
      </div>
    </section>
  );
}
