import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { HeroTerrainCanvas } from "../components/hero-terrain/HeroTerrainCanvas";
import { EXPEDITION_ASCENT } from "../components/hero-terrain/shared";

type Shot = "home" | "expedition";
type ThemeName = "dark" | "light";

const BATCH: { shot: Shot; theme: ThemeName }[] = [
  { shot: "home", theme: "dark" },
  { shot: "home", theme: "light" },
  { shot: "expedition", theme: "dark" },
  { shot: "expedition", theme: "light" },
];

/**
 * Isolated Everest dump — no Lenis, no HUD. Dev only.
 * /dev/hero-capture?batch=1
 * /dev/hero-capture?shot=home&theme=dark&frames=150
 */
export function HeroCapturePage() {
  const [params] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const batch = params.get("batch") === "1";
  const frames = Math.max(2, Math.min(300, Number(params.get("frames") ?? 150) || 150));
  const jobs = useMemo(() => {
    if (batch) return BATCH;
    const shot = params.get("shot") === "expedition" ? "expedition" : "home";
    const jobTheme = params.get("theme") === "light" ? "light" : "dark";
    return [{ shot, theme: jobTheme }] as const;
  }, [batch, params]);

  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState("Booting canvas…");
  const current = jobs[index];

  useEffect(() => {
    if (!current) return;
    if (theme !== current.theme) toggleTheme();
  }, [current, theme, toggleTheme]);

  if (!current) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-black font-mono text-sm text-white">
        All sequences written to /captures
      </div>
    );
  }

  const themeReady = theme === current.theme;

  return (
    <div className="relative h-[100dvh] w-[100dvw] overflow-hidden bg-[#050504]">
      {themeReady ? (
        <HeroTerrainCanvas
          key={`${current.shot}-${current.theme}`}
          className="hero-terrain-root h-full w-full"
          variant={current.shot}
          path={current.shot === "expedition" ? EXPEDITION_ASCENT : undefined}
          capture={{
            shot: current.shot,
            theme: current.theme,
            frames,
            onStatus: setStatus,
            onDone: () => setIndex((n) => n + 1),
          }}
        />
      ) : null}
      <p className="pointer-events-none absolute bottom-4 left-4 z-10 font-mono text-xs text-white/80">
        {status}
      </p>
    </div>
  );
}
