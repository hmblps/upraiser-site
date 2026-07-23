import { useCallback, useEffect, useRef, type ComponentType, type RefAttributes } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export type LucideAnimatedHandle = {
  startAnimation: () => void | Promise<void>;
  stopAnimation: () => void | Promise<void>;
};

type AnimatedIconComponent = ComponentType<
  { size?: number; className?: string } & RefAttributes<LucideAnimatedHandle>
>;

type LucideAnimatedGlyphProps = {
  Icon: AnimatedIconComponent;
  label: string;
  className?: string;
};

export function LucideAnimatedGlyph({ Icon, label, className = "" }: LucideAnimatedGlyphProps) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLSpanElement>(null);
  const handleRef = useRef<LucideAnimatedHandle | null>(null);

  const setHandle = useCallback((node: LucideAnimatedHandle | null) => {
    handleRef.current = node;
  }, []);

  useEffect(() => {
    const tile = rootRef.current?.closest(".value-bento-tile");
    if (!tile || reduced) return;

    const onEnter = () => {
      void handleRef.current?.startAnimation?.();
    };

    const onLeave = () => {
      void handleRef.current?.stopAnimation?.();
    };

    tile.addEventListener("mouseenter", onEnter);
    tile.addEventListener("mouseleave", onLeave);

    return () => {
      tile.removeEventListener("mouseenter", onEnter);
      tile.removeEventListener("mouseleave", onLeave);
      void handleRef.current?.stopAnimation?.();
    };
  }, [reduced]);

  return (
    <span
      ref={rootRef}
      className={`value-bento-glyph pointer-events-none ${className}`.trim()}
      role="img"
      aria-label={label}
    >
      <Icon ref={setHandle} size={22} className="value-bento-glyph-animated pointer-events-none" />
    </span>
  );
}
