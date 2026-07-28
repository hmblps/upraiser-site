import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type BentoGridProps = {
  className?: string;
  children?: ReactNode;
};

/** Aceternity / MagicUI-style bento grid — dense service tiles for viewport panels. */
export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "bento-grid grid auto-rows-[minmax(7.5rem,auto)] grid-cols-1 gap-3 md:grid-cols-3 md:gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

type BentoGridItemProps = {
  className?: string;
  title: string;
  description: string;
  header?: ReactNode;
  icon?: ReactNode;
};

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: BentoGridItemProps) {
  return (
    <div
      className={cn(
        "bento-grid__item group/bento row-span-1 flex flex-col justify-between space-y-3 rounded-[var(--radius-lg)] border border-border/70 bg-bg-card/80 p-4 transition duration-200 hover:border-orange/35",
        className,
      )}
    >
      {header ? <div className="min-h-[3.5rem]">{header}</div> : null}
      <div className="transition duration-200 group-hover/bento:translate-x-1">
        {icon ? <div className="mb-2 text-orange">{icon}</div> : null}
        <h3 className="card-title text-sm font-bold tracking-tight text-fg">{title}</h3>
        <p className="copy mt-1.5 text-xs leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  );
}
