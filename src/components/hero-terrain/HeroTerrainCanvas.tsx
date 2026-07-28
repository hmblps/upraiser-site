import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { useTheme } from "../../context/ThemeContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { DRACO_PATH, MODEL_URL, MODEL_URL_LIGHT } from "../../lib/heroModel";
import { Scene } from "./Scene";
import { HERO_ASCENT_DEFAULTS, type ScrollState } from "./shared";

export { HERO_ASCENT_DEFAULTS } from "./shared";

type HeroTerrainCanvasProps = {
  className?: string;
};

/** Brand-warm Everest — dark wire / light photo maps + drone ascent. */
export function HeroTerrainCanvas({ className }: HeroTerrainCanvasProps) {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const scrollRef = useRef<ScrollState>({ pointerX: 0, pointerY: 0 });
  const shellRef = useRef<HTMLDivElement>(null);
  const path = HERO_ASCENT_DEFAULTS;
  const [inView, setInView] = useState(true);
  const [modelReady, setModelReady] = useState(false);
  const handleModelReady = useCallback(() => setModelReady(true), []);

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const onMove = (event: PointerEvent) => {
      if (!inView) return;
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      scrollRef.current.pointerX = Math.max(-1, Math.min(1, nx));
      scrollRef.current.pointerY = Math.max(-1, Math.min(1, ny));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, inView]);

  useEffect(() => {
    if (reduced) return;
    void useGLTF.preload(MODEL_URL, DRACO_PATH);
    void useGLTF.preload(MODEL_URL_LIGHT, DRACO_PATH);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const shell = shellRef.current;
    if (!shell) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "12% 0px", threshold: 0 },
    );
    io.observe(shell);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) return null;

  const [cx, cy, cz] = path.startPos;
  const isLight = theme === "light";

  return (
    <div
      ref={shellRef}
      className={`${className ?? ""} hero-terrain-fade${modelReady ? " is-ready" : ""}`}
      aria-hidden
    >
      <Canvas
        key={theme}
        className="hero-terrain-canvas"
        dpr={isLight ? [1, 1.75] : 1}
        frameloop={inView ? "always" : "never"}
        gl={{
          antialias: isLight,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{ position: [cx, cy, cz], fov: path.startFov, near: 0.5, far: 900 }}
        style={{ width: "100%", height: "100%", display: "block", background: isLight ? "#ffffff" : "#050504" }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = isLight ? 1.0 : 1;
          gl.outputColorSpace = SRGBColorSpace;
          if (isLight) gl.setClearColor(0xffffff, 1);
          else gl.setClearColor(0x050504, 1);
        }}
      >
        <Scene theme={theme} scrollRef={scrollRef} path={path} onModelReady={handleModelReady} />
      </Canvas>
    </div>
  );
}
