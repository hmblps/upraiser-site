import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import type { SiteMode } from "../../data/liveContent";
import { InterstitialVideo } from "./InterstitialVideo";
import { AD_W, AD_H } from "./PhoneConstants";

export function AdCloseButton({ onClick }: { onClick?: () => void }) {
  return (
    <motion.button
      type="button"
      aria-label="Close ad"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 520, damping: 28 }}
      style={{
        position: "absolute",
        top: "clamp(1.35rem, 3.2vw, 1.85rem)",
        right: "clamp(0.45rem, 1.4vw, 0.7rem)",
        zIndex: 6,
        width: 44,
        height: 44,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        touchAction: "manipulation",
        userSelect: "none",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(12,12,12,0.55)",
          border: "1px solid rgba(255,255,255,0.45)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 15,
          fontWeight: 500,
          lineHeight: 1,
          boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M1.2 1.2l9.6 9.6M10.8 1.2L1.2 10.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
    </motion.button>
  );
}

/**
 * CSS chassis for formats that need real HTML (rich iframe, video interstitial).
 * Drop-shadow lives on the untransformed wrapper so perspective cannot square the shadow.
 */
export function CssFormatPhone({ mode, formatId }: { mode: SiteMode; formatId: "rich" | "video" }) {
  const isDark = mode !== "growth";
  const wrapRef = useRef<HTMLDivElement>(null);
  const [adScale, setAdScale] = useState(0.64);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    setClosed(false);
  }, [formatId]);

  useEffect(() => {
    if (!closed) return;
    const t = window.setTimeout(() => setClosed(false), 1800);
    return () => window.clearTimeout(t);
  }, [closed]);

  useEffect(() => {
    if (formatId !== "rich") return;
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      if (width > 0) setAdScale(Math.min(1, width / AD_W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [formatId]);

  const phoneGrad = isDark
    ? "linear-gradient(155deg, #f0a06a, #c96f3a 42%, #9a5228)"
    : "linear-gradient(155deg, #5a7498 0%, #2a4060 34%, #152238 68%, #0c1524 100%)";

  return (
    <motion.div
      key={`css-phone-${formatId}`}
      initial={false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -16 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        pointerEvents: "all",
      }}
    >
      {/* Shadow on this untransformed box so perspective cannot square it */}
      <div
        style={{
          height: "clamp(340px, 56dvh, 520px)",
          aspectRatio: "430 / 879",
          flexShrink: 0,
          borderRadius: "clamp(1.55rem, 2.6vh, 2.2rem)",
          transform: "translateY(2dvh)"
        }}
      >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: phoneGrad,
          borderRadius: "clamp(1.55rem, 2.6vw, 2.2rem)",
          padding: "clamp(0.14rem, 0.4vw, 0.22rem)",
          boxShadow: isDark
            ? "inset 0 1px 0 rgba(255,220,160,0.35), inset 0 -1px 0 rgba(0,0,0,0.45)"
            : "inset 0 1px 0 rgba(210,230,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.45)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          ref={wrapRef}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "clamp(1.3rem, 2.3vw, 1.95rem)",
            overflow: "hidden",
            background: "#000",
            border: "2px solid rgba(0,0,0,0.84)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "clamp(0.45rem, 1.2vw, 0.65rem)",
              left: "50%",
              transform: "translateX(-50%)",
              width: "clamp(2.2rem, 20%, 3.1rem)",
              height: "clamp(0.5rem, 1.4vw, 0.7rem)",
              borderRadius: "999px",
              background: "#000",
              zIndex: 5,
              pointerEvents: "none",
          }}
          />

          {formatId === "rich" ? (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                width: AD_W,
                height: AD_H,
                transformOrigin: "top center",
                transform: `translateX(-50%) scale(${adScale})`,
                overflow: "hidden",
              }}
            >
              <iframe
                src="/rich-media-ad.html"
                style={{ width: AD_W, height: AD_H, border: "none", display: "block", cursor: "none" }}
                allow="autoplay; encrypted-media"
                title="Rich Media Ad"
              />
            </div>
          ) : closed ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#0a0a0a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.45)",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Ad closed
            </div>
          ) : (
            <>
              <InterstitialVideo
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <AdCloseButton onClick={() => setClosed(true)} />
            </>
          )}

          {formatId === "rich" && (
            <div
              style={{
                pointerEvents: "none",
                position: "absolute",
                inset: 0,
                zIndex: 4,
                background:
                  "linear-gradient(125deg, rgba(255,255,255,0.14) 0%, transparent 28%, transparent 74%, rgba(255,255,255,0.04) 100%)",
                mixBlendMode: "soft-light",
              }}
            />
          )}
        </div>
      </div>
      </div>
    </motion.div>
  );
}

