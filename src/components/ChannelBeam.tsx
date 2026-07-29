import { forwardRef, useRef, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { AnimatedBeam } from "./magicui/AnimatedBeam";

const BeamNode = forwardRef<
  HTMLDivElement,
  { className?: string; children?: ReactNode; label?: string }
>(function BeamNode({ className, children, label }, ref) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-11 items-center justify-center rounded-full border border-border/80 bg-bg-card p-2.5 shadow-[0_0_20px_-12px_color-mix(in_srgb,var(--theme-fg)_40%,transparent)] sm:size-12",
          className,
        )}
      >
        {children}
      </div>
      {label ? (
        <span className="max-w-[4.5rem] text-center text-[0.625rem] font-semibold uppercase tracking-wider text-muted">
          {label}
        </span>
      ) : null}
    </div>
  );
});

export type ChannelBeamNode = {
  id: string;
  label: string;
  mark: string;
};

type ChannelBeamProps = {
  className?: string;
  hubLabel?: string;
  /** Up to 6 spokes keeps the diagram readable in a viewport panel */
  nodes: readonly ChannelBeamNode[];
};

/**
 * Traffic / inventory hub — AnimatedBeam spokes into UPRAISER.
 * Fits Expertise viewport right column.
 */
export function ChannelBeam({
  className,
  hubLabel = "UPRAISER",
  nodes: rawNodes,
}: ChannelBeamProps) {
  const nodes = rawNodes.slice(0, 6);
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const n0 = useRef<HTMLDivElement>(null);
  const n1 = useRef<HTMLDivElement>(null);
  const n2 = useRef<HTMLDivElement>(null);
  const n3 = useRef<HTMLDivElement>(null);
  const n4 = useRef<HTMLDivElement>(null);
  const n5 = useRef<HTMLDivElement>(null);
  const spokeRefs = [n0, n1, n2, n3, n4, n5];

  const mid = Math.ceil(nodes.length / 2);
  const left = nodes.slice(0, mid);
  const right = nodes.slice(mid);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full min-h-[220px] w-full items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-border/50 bg-bg-elevated/40 p-3 sm:min-h-0 sm:p-5",
        className,
      )}
    >
      <div className="flex size-full max-w-lg flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-start justify-between gap-5 py-1 sm:gap-6">
          {left.map((node, i) => (
            <BeamNode key={node.id} ref={spokeRefs[i]} label={node.label}>
              <span className="text-micro tracking-tight text-fg">{node.mark}</span>
            </BeamNode>
          ))}
        </div>

        <BeamNode
          ref={hubRef}
          className="size-14 border-orange/40 bg-orange/10 sm:size-16"
          label={hubLabel}
        >
          <img src="/upraiser-logo.png" alt="" className="size-7 object-contain sm:size-8" />
        </BeamNode>

        <div className="flex flex-col items-end justify-between gap-5 py-1 sm:gap-6">
          {right.map((node, i) => (
            <BeamNode key={node.id} ref={spokeRefs[mid + i]} label={node.label}>
              <span className="text-micro tracking-tight text-fg">{node.mark}</span>
            </BeamNode>
          ))}
        </div>
      </div>

      {nodes.map((node, index) => {
        const isLeft = index < mid;
        const curve = index % 2 === 0 ? -48 : 48;
        return (
          <AnimatedBeam
            key={node.id}
            containerRef={containerRef}
            fromRef={spokeRefs[index]!}
            toRef={hubRef}
            curvature={curve}
            reverse={!isLeft}
            delay={index * 0.12}
            duration={3.6}
          />
        );
      })}
    </div>
  );
}
