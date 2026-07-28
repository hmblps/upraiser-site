/** Mini visuals for Studio Craft bento — Proactiv-style live headers, not empty gradients. */
export function StudioCraftVisual({ kind }: { kind: "creatives" | "store" | "channels" }) {
  if (kind === "creatives") {
    return (
      <div className="studio-craft-visual" aria-hidden>
        <div className="studio-craft-visual__reel">
          <span className="studio-craft-visual__frame studio-craft-visual__frame--a" />
          <span className="studio-craft-visual__frame studio-craft-visual__frame--b" />
          <span className="studio-craft-visual__frame studio-craft-visual__frame--c" />
        </div>
        <div className="studio-craft-visual__bars">
          <i style={{ height: "40%" }} />
          <i style={{ height: "70%" }} />
          <i style={{ height: "55%" }} />
          <i style={{ height: "90%" }} />
          <i style={{ height: "48%" }} />
        </div>
      </div>
    );
  }

  if (kind === "store") {
    return (
      <div className="studio-craft-visual studio-craft-visual--store" aria-hidden>
        <div className="studio-craft-visual__phone">
          <span className="studio-craft-visual__notch" />
          <span className="studio-craft-visual__line" />
          <span className="studio-craft-visual__line studio-craft-visual__line--short" />
          <span className="studio-craft-visual__cta" />
        </div>
        <div className="studio-craft-visual__stack">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  return (
    <div className="studio-craft-visual studio-craft-visual--channels" aria-hidden>
      <div className="studio-craft-visual__chips">
        <span>MT</span>
        <span>TT</span>
        <span>CTV</span>
        <span>OEM</span>
      </div>
      <div className="studio-craft-visual__pulse-row">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

export function studioCraftKind(title: string): "creatives" | "store" | "channels" {
  if (/landing|store/i.test(title)) return "store";
  if (/channel/i.test(title)) return "channels";
  return "creatives";
}
