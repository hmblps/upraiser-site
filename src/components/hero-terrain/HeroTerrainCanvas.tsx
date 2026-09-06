import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { motion } from "framer-motion";
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import { Compass } from "lucide-react";
import { createPortal } from "react-dom";
import { useTheme } from "../../context/ThemeContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { DRACO_PATH, MODEL_URL, MODEL_URL_LIGHT, SNOW_COLOR_URL, SNOW_NORMAL_URL, SNOW_ROUGH_URL } from "../../lib/heroModel";
import { markHeroReady } from "../../lib/scrollPreload";
import { CaptureDriver } from "./CaptureDriver";
import { Scene } from "./Scene";
import { HERO_ASCENT_DEFAULTS, type AscentPath, type ScrollState, type ThemeMode } from "./shared";

export { HERO_ASCENT_DEFAULTS, EXPEDITION_ASCENT } from "./shared";

type HeroTerrainCanvasProps = {
  className?: string;
  path?: AscentPath;
  /** Expedition reuses the mesh with a different shot — skip Voyager / bird / home-ready. */
  variant?: "home" | "expedition";
  capture?: {
    shot: "home" | "expedition";
    theme: "dark" | "light";
    frames: number;
    onStatus: (line: string) => void;
    onDone: () => void;
  };
};

/** Keep one WebGL context across themes — swap clear / exposure without remount. */
function ThemeGlSync({ theme }: { theme: ThemeMode }) {
  const { gl } = useThree();
  const isLight = theme === "light";

  useEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;
    gl.outputColorSpace = SRGBColorSpace;
    gl.setClearColor(isLight ? 0xffffff : 0x050504, 1);
  }, [gl, isLight]);

  return null;
}

/** Brand-warm Everest — dark wire / light photo maps + drone ascent. */
export function HeroTerrainCanvas({
  className,
  path = HERO_ASCENT_DEFAULTS,
  variant = "home",
  capture,
}: HeroTerrainCanvasProps) {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const scrollRef = useRef<ScrollState>({ pointerX: 0, pointerY: 0 });
  const shellRef = useRef<HTMLDivElement>(null);
  const lite = variant === "expedition";
  const capturing = Boolean(capture);
  const [inView, setInView] = useState(true);
  const [modelReady, setModelReady] = useState(false);
  const handleModelReady = useCallback(() => setModelReady(true), []);

  useEffect(() => {
    setModelReady(false);
  }, [theme]);

  useEffect(() => {
    if (modelReady && !lite) markHeroReady();
  }, [modelReady, lite]);

  useEffect(() => {
    if (capturing) return;
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
  }, [reduced, inView, capturing]);

  // Active theme GLB only. Alternate theme waits until the mountain is on screen.
  useEffect(() => {
    if (reduced) return;
    const active = theme === "light" ? MODEL_URL_LIGHT : MODEL_URL;
    void useGLTF.preload(active, DRACO_PATH);
    if (theme === "light") {
      void useTexture.preload([SNOW_COLOR_URL, SNOW_NORMAL_URL, SNOW_ROUGH_URL]);
    }
  }, [reduced, theme]);

  useEffect(() => {
    if (reduced || !modelReady) return;
    const alternate = theme === "light" ? MODEL_URL : MODEL_URL_LIGHT;
    const t = window.setTimeout(() => {
      void useGLTF.preload(alternate, DRACO_PATH);
    }, 8000);
    return () => window.clearTimeout(t);
  }, [reduced, theme, modelReady]);

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

  if (reduced && !capturing) return null;

  const [cx, cy, cz] = path.startPos;
  const isLight = theme === "light";

  return (
    <>
      {/* Loading overlay while shaders compile (crucial for mobile) */}
      {!modelReady && !capturing && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none transition-opacity duration-1000 backdrop-blur-xl bg-bg/20">
          <div className="flex flex flex-col items-center gap-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="relative flex items-center justify-center w-16 h-16 rounded-full border border-border/30 bg-bg-elevated/40 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute top-1 text-[8px] font-mono font-bold text-fg/60 tracking-tighter">N</div>
              <div className="absolute right-1 text-[8px] font-mono font-bold text-fg/60 tracking-tighter">E</div>
              <div className="absolute bottom-1 text-[8px] font-mono font-bold text-fg/60 tracking-tighter">S</div>
              <div className="absolute left-1 text-[8px] font-mono font-bold text-fg/60 tracking-tighter">W</div>
              <Compass className="h-7 w-7 text-accent animate-spin" strokeWidth={1.5} style={{ animationDuration: "4s", animationTimingFunction: "linear" }} />
            </motion.div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-fg animate-pulse">Rendering Terrain</span>
          </div>
        </div>,
        document.body
      ) : null}

      <motion.div
        ref={shellRef}
        className={`${className ?? ""} hero-terrain-fade${modelReady ? " is-ready" : ""}`}
      initial={false}
      animate={{ opacity: modelReady ? 1 : 0 }}
      transition={
        capturing
          ? { duration: 0 }
          : { type: "spring", stiffness: 70, damping: 24, mass: 0.9 }
      }
      aria-hidden
    >
      {/* One Canvas for both themes — remounting was the dirty/late mountain flash. */}
      <Canvas
        className="hero-terrain-canvas"
        shadows
        dpr={capturing ? 1 : [1, 1.5]}
        frameloop={capturing || inView ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: capturing,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{ position: [cx, cy, cz], fov: path.startFov, near: 0.5, far: 900 }}
        style={{ width: "100%", height: "100%", display: "block", background: isLight ? "#ffffff" : "#050504", pointerEvents: "none" }}
        onCreated={({ gl, events }) => {
          events.disconnect?.();
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
          gl.outputColorSpace = SRGBColorSpace;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;
          if (isLight) gl.setClearColor(0xffffff, 1);
          else gl.setClearColor(0x050504, 1);
        }}
      >
        <ThemeGlSync theme={theme} />
        <Scene
          theme={theme}
          scrollRef={scrollRef}
          path={path}
          onModelReady={handleModelReady}
          voyager={!capturing}
          lite={lite}
        />
        {capture ? <CaptureDriver job={capture} modelReady={modelReady} /> : null}
      </Canvas>
    </motion.div>
    </>
  );
}
