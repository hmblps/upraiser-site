import { useCallback, useEffect, useLayoutEffect, useRef, useState , useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import { Navigation } from "lucide-react";
import { createPortal } from "react-dom";
import { useTheme } from "../../context/ThemeContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useHardwareTier } from "../../hooks/useHardwareTier";
import { DRACO_PATH, MODEL_URL, MODEL_URL_LIGHT, SNOW_COLOR_URL, SNOW_NORMAL_URL, SNOW_ROUGH_URL } from "../../lib/heroModel";
import { markHeroReady } from "../../lib/scrollPreload";
import { CaptureDriver } from "./CaptureDriver";
import { HeroVideoFallback } from "./HeroVideoFallback";
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

  useLayoutEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;
    gl.outputColorSpace = SRGBColorSpace;
    gl.setClearColor(isLight ? 0xffffff : 0x050504, 1);
  }, [gl, isLight]);

  return null;
}

/** 
 * Waits for the browser to actually paint the WebGL canvas before signaling ready.
 * This prevents the CSS loading spinner from disappearing during the synchronous 1-second GPU upload freeze.
 */
function GpuUnlocker({ onUnlock }: { onUnlock: () => void }) {
  useEffect(() => {
    let frame1: number;
    let frame2: number;
    frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        onUnlock();
      });
    });
    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [onUnlock]);
  return null;
}

/** Brand-warm Everest — dark wire / light photo maps + drone ascent. */
export function HeroTerrainCanvas({
  className,
  path = HERO_ASCENT_DEFAULTS,
  variant = "home",
  capture,
}: HeroTerrainCanvasProps) {
  const { theme: ctxTheme } = useTheme();
  const theme = capture?.theme ?? ctxTheme;
  const reduced = useReducedMotion();
  const tier = useHardwareTier();
  const scrollRef = useRef<ScrollState>({ pointerX: 0, pointerY: 0 });
  const shellRef = useRef<HTMLDivElement>(null);
  const lite = variant === "expedition";
  const capturing = Boolean(capture);
  const [inView, setInView] = useState(true);
  const [modelReady, setModelReady] = useState(false);
  const [gpuReady, setGpuReady] = useState(false);
  const [drawnTheme, setDrawnTheme] = useState<ThemeMode | null>(null);
  /** If Draco/GLB hang, do not keep the compass overlay forever. */
  const [bootStuck, setBootStuck] = useState(false);
  const handleModelReady = useCallback(() => {
    setModelReady(true);
    setDrawnTheme(theme);
    setBootStuck(false);
  }, [theme]);
  const showTerrain = capturing || (gpuReady && drawnTheme === theme);
  const shouldFallback = (reduced || tier === 'lite') && !capturing;

  useEffect(() => {
    setBootStuck(false);
    if (capturing || shouldFallback) return;
    const t = window.setTimeout(() => setBootStuck(true), 4000);
    return () => window.clearTimeout(t);
  }, [theme, capturing, shouldFallback]);

  useEffect(() => {
    if (lite || modelReady || shouldFallback) markHeroReady();
  }, [modelReady, shouldFallback, lite]);

  useEffect(() => {
    if (capturing || shouldFallback) return;
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
    if (shouldFallback) return;
    const active = theme === "light" ? MODEL_URL_LIGHT : MODEL_URL;
    void useGLTF.preload(active, DRACO_PATH);
    if (theme === "light") {
      void useTexture.preload([SNOW_COLOR_URL, SNOW_NORMAL_URL, SNOW_ROUGH_URL]);
    }
  }, [shouldFallback, theme]);

  useEffect(() => {
    if (shouldFallback || !modelReady) return;
    const alternate = theme === "light" ? MODEL_URL : MODEL_URL_LIGHT;
    const t = window.setTimeout(() => {
      void useGLTF.preload(alternate, DRACO_PATH);
    }, 8000);
    return () => window.clearTimeout(t);
  }, [shouldFallback, theme, modelReady]);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => {
    if (capturing || shouldFallback) return;
    setInView(v < (typeof window !== "undefined" ? window.innerHeight * 2.2 : 2000));
  });

  if (shouldFallback) return <HeroVideoFallback variant={variant} />;

  const [cx, cy, cz] = path.startPos;
  const cameraConfig = useMemo(() => ({
    position: [cx, cy, cz] as [number, number, number],
    fov: path.startFov,
    near: 0.5,
    far: 900
  }), [cx, cy, cz, path.startFov]);

  const isLight = theme === "light";

  return (
    <>
      {/* Loading overlay while shaders compile (crucial for mobile) */}
      {!capturing && !bootStuck && typeof document !== "undefined" ? createPortal(
        <AnimatePresence>
          {!showTerrain ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none backdrop-blur-xl bg-bg/20"
            >
              <div className="flex flex flex-col items-center gap-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  className="relative flex items-center justify-center w-16 h-16 md:w-32 md:h-32 rounded-full border border-border/30 bg-bg-elevated/40 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                >
                  <div className="absolute top-1 md:top-3 text-[8px] md:text-xs font-mono font-bold text-fg/60 tracking-tighter">N</div>
                  <div className="absolute right-1 md:right-3 text-[8px] md:text-xs font-mono font-bold text-fg/60 tracking-tighter">E</div>
                  <div className="absolute bottom-1 md:bottom-3 text-[8px] md:text-xs font-mono font-bold text-fg/60 tracking-tighter">S</div>
                  <div className="absolute left-1 md:left-3 text-[8px] md:text-xs font-mono font-bold text-fg/60 tracking-tighter">W</div>
                  <div className="animate-spin" style={{ animationDuration: "2s", animationTimingFunction: "linear", willChange: "transform" }}>
                    <Navigation className="h-6 w-6 md:h-12 md:w-12 text-accent" strokeWidth={2} />
                  </div>
                </motion.div>
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-fg/70 animate-pulse">Rendering Terrain</span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body
      ) : null}

      <motion.div
        ref={shellRef}
        className={`${className ?? ""} hero-terrain-fade${showTerrain ? " is-ready" : ""}`}
      initial={false}
      animate={{ opacity: showTerrain ? 1 : 0 }}
      transition={
        capturing
          ? { duration: 0 }
          : { duration: 0.4, ease: "easeOut" }
      }
      aria-hidden
    >
      {/* One Canvas for both themes — remounting was the dirty/late mountain flash. */}
      <Canvas
        className="hero-terrain-canvas"
        shadows
        dpr={capturing ? 2 : [1, 1.5]}
        frameloop={capturing || inView ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: capturing,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={cameraConfig}
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
          voyager
          lite={lite}
        />
        {modelReady ? <GpuUnlocker onUnlock={() => setGpuReady(true)} /> : null}
        {capture ? <CaptureDriver job={capture} modelReady={modelReady} /> : null}
      </Canvas>
    </motion.div>
    </>
  );
}
