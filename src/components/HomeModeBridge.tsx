import { useRef } from "react";
import { ThemeBridge } from "./ThemeBridge";

/** Dual-mode story switch lives on home only (Z2A-style: depth pages stay mode-light). */
export function HomeModeBridge() {
  const anchorRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={anchorRef}
      id="mode-bridge"
      className="relative min-h-[8.5rem] overflow-hidden sm:min-h-[6.75rem]"
      aria-label="Experience mode"
    >
      <ThemeBridge anchorRef={anchorRef} />
    </section>
  );
}
