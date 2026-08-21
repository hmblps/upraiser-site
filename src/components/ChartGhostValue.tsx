import { memo } from "react";

export const ChartGhostValue = memo(function ChartGhostValue({ value, className = "fold-chart-ghost-value" }: { value: string | number; className?: string }) {
  const strVal = String(value);
  const match = strVal.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);

  if (!match) {
    return <span className={className}>{strVal}</span>;
  }

  const [, prefix, num, suffix] = match;
  return (
    <span className={className}>
      {prefix && <span className="font-sans font-semibold tracking-normal text-[0.7em] mr-[0.1em] opacity-80">{prefix}</span>}
      {num}
      {suffix && <span className="font-sans font-semibold tracking-normal text-[0.7em] ml-[0.05em] opacity-80">{suffix}</span>}
    </span>
  );
});
