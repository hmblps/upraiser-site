import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, Environment, useGLTF, useTexture } from "@react-three/drei";
import { useMotionValue, useSpring } from "framer-motion";
import {
  ACESFilmicToneMapping,
  CanvasTexture,
  SRGBColorSpace,
  Texture,
  VideoTexture,
  type Group,
} from "three";
import type { SiteMode } from "../../data/liveContent";
import { cn } from "../../lib/cn";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { DRACO_PATH } from "../../lib/heroModel";
import { FORMAT_STILL, FORMAT_VIDEO } from "../../data/deviceScreens";
import {
  isAnimatedTabletGlass,
  paintGlassAnim,
  paintStill,
  type GlassAnimId,
} from "../../lib/tabletGlassAnim";
import { DeviceLoadStage } from "../solutions/DeviceLoadStage";

import { Model as TabletModel } from "./Tablet3DModel";

const REST_Y = 0.06;
const REST_X = -0.03;

const TABLET_SCREEN_VIDEO = FORMAT_VIDEO;
const TABLET_SCREEN_STILL = FORMAT_STILL;

type Tablet3DProps = {
  mode: SiteMode;
  formatId?: string;
  className?: string;
  /** Freeze the canvas (keep last frame) while another device is in front. */
  active?: boolean;
  flat?: boolean;
};

function configureMap(tex: Texture) {
  tex.colorSpace = SRGBColorSpace;
  tex.flipY = true; // PlaneGeometry UVs expect flipY true for TextureLoader PNGs
  tex.needsUpdate = true;
}

/** R3F can boot at 300×150 under absolute/opacity wrappers — force the slot box. */
function ForceCanvasSize({ w, h, onSized }: { w: number; h: number; onSized?: () => void }) {
  const { gl, setSize, invalidate } = useThree();
  useLayoutEffect(() => {
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 1.5);
    gl.setPixelRatio(dpr);
    gl.setSize(w, h, false);
    setSize(w, h);
    invalidate();
    onSized?.();
  }, [gl, w, h, setSize, invalidate, onSized]);
  return null;
}

function TabletMesh({
  rotX,
  rotY,
  formatId,
  playing,
  onReady,
  flat = false,
}: {
  rotX: { get: () => number };
  rotY: { get: () => number };
  mode: SiteMode;
  formatId?: string;
  playing: boolean;
  onReady?: () => void;
  flat?: boolean;
}) {
  const group = useRef<Group>(null);
  const modeRef = useRef<"still" | "video" | "anim">("still");
  const playingRef = useRef(playing);
  playingRef.current = playing;
  const reduced = useReducedMotion();
  const isTabletFormat = formatId === "pre-install" || formatId === "oem-store" || formatId === "system-ui";
  const safeFormatId = isTabletFormat ? formatId : "pre-install";
  const stillSrc = TABLET_SCREEN_STILL[safeFormatId!];
  const stillTex = useTexture(stillSrc || TABLET_SCREEN_STILL["pre-install"]!);

  const [screenMap, setScreenMap] = useState<Texture>(stillTex);

  useMemo(() => {
    configureMap(stillTex);
  }, [stillTex]);
  const animRef = useRef<{
    canvas: HTMLCanvasElement;
    tex: CanvasTexture;
    img: HTMLImageElement;
    t0: number;
    id: GlassAnimId;
  } | null>(null);

  const { video, videoTex } = useMemo(() => {
    const v = document.createElement("video");
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.preload = "auto";
    const t = new VideoTexture(v);
    configureMap(t);
    t.flipY = true;
    return { video: v, videoTex: t };
  }, []);

  useEffect(() => {
    return () => {
      videoTex.dispose();
      video.pause();
      video.src = "";
      video.removeAttribute("src");
      video.load();
    };
  }, [video, videoTex]);

  // Chassis is enough to reveal (Phone/TV pattern). Never gate on screenMap —
  // StrictMode cancels the old rAF+readySent guard and left the CSS chassis stuck.
  useLayoutEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    if (!formatId) return;

    const isTabletFormat = formatId === "pre-install" || formatId === "oem-store" || formatId === "system-ui";
    const safeFormatId = isTabletFormat ? formatId : "pre-install";
    const src = TABLET_SCREEN_VIDEO[safeFormatId];

    let cancelled = false;
    let ownedTex: Texture | null = null;

    animRef.current = null;

    const commitMap = (tex: Texture, mode: "still" | "video" | "anim") => {
      if (cancelled) {
        if (tex !== videoTex) tex.dispose();
        return;
      }
      modeRef.current = mode;
      setScreenMap((prev) => {
        if (prev && prev !== tex && prev !== videoTex) prev.dispose();
        return tex;
      });
    };

    // OEM glass — paint into canvas first, then wrap CanvasTexture (avoids 300×150 blank).
    if (stillSrc && isAnimatedTabletGlass(formatId)) {
      const canvas = document.createElement("canvas");
      const img = new Image();
      img.decoding = "async";
      const apply = () => {
        if (cancelled) return;
        paintStill(canvas, img);
        const tex = new CanvasTexture(canvas);
        configureMap(tex);
        ownedTex = tex;
        animRef.current = {
          canvas,
          tex,
          img,
          t0: performance.now(),
          id: formatId,
        };
        commitMap(tex, "anim");
      };
      img.onload = apply;
      img.onerror = () => { /* keep previous map */ };
      img.src = stillSrc;
      if (img.complete && img.naturalWidth > 0) {
        img.onload = null;
        apply();
      }
      return () => {
        cancelled = true;
        animRef.current = null;
        // owned tex disposed on next commitMap / unmount via setScreenMap swap
        if (ownedTex && ownedTex !== videoTex) {
          /* leave live map until replaced */
        }
      };
    }

    if (stillSrc) {
      if (modeRef.current !== "video") commitMap(stillTex, "still");
    }

    if (!src) {
      return () => {
        cancelled = true;
      };
    }

    const promote = () => {
      if (cancelled || !playingRef.current) return;
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      configureMap(videoTex);
      commitMap(videoTex, "video");
      void video.play().catch(() => { /* autoplay blocked */ });
    };

    video.loop = true;
    video.src = src;
    video.addEventListener("loadeddata", promote);
    video.addEventListener("canplay", promote);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) promote();
    else video.load();

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", promote);
      video.removeEventListener("canplay", promote);
      video.pause();
      video.removeAttribute("src");
      video.load();
      if (modeRef.current === "video") modeRef.current = "still";
    };
  }, [formatId, video, videoTex]);

  useEffect(() => {
    if (!playing) {
      video.pause();
      return;
    }
    if (modeRef.current === "video") void video.play().catch(() => { /* autoplay blocked */ });
  }, [playing, video]);

  useFrame(() => {
    if (!group.current) return;

    const anim = animRef.current;
    if (anim && modeRef.current === "anim" && playingRef.current) {
      paintGlassAnim(
        anim.id,
        anim.canvas,
        anim.img,
        (performance.now() - anim.t0) / 1000,
        reduced,
      );
      anim.tex.needsUpdate = true;
    }

    if (flat) {
      group.current.rotation.x = 0;
      group.current.rotation.y = 0;
      group.current.position.y = 0;
      if (modeRef.current === "video") videoTex.needsUpdate = true;
      return;
    }

    const t = performance.now() / 1000;
    const floatRotX = Math.sin(t * 0.8) * 0.03;
    const floatRotY = Math.cos(t * 0.6) * 0.04;
    const floatPosY = Math.sin(t * 1.2) * 0.04;

    group.current.rotation.x = rotX.get() + floatRotX;
    group.current.rotation.y = rotY.get() + floatRotY;
    group.current.position.y = floatPosY;

    if (modeRef.current === "video") {
      videoTex.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <Center>
        <group rotation={flat ? [0, 0, 0] : [0.08, 0, 0]}>
          <group rotation={[Math.PI / 2, 0, 0]} scale={6.2}>
            <TabletModel screenMap={screenMap} contentScaleX={formatId === "system-ui" ? 0.90 : 1} />
          </group>
        </group>
      </Center>
    </group>
  );
}

function TabletScene({
  rotX,
  rotY,
  isDark,
  formatId,
  playing,
  onMeshReady,
  flat = false,
}: {
  rotX: { get: () => number };
  rotY: { get: () => number };
  isDark: boolean;
  formatId?: string;
  playing: boolean;
  onMeshReady?: () => void;
  flat?: boolean;
}) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.6 : 0.75} />
      <directionalLight position={[2.5, 4, 3]} intensity={isDark ? 1.7 : 1.95} castShadow />
      <directionalLight position={[-2.5, 2, -1]} intensity={0.5} color={isDark ? "#ffb070" : "#8eb0e8"} />
      <spotLight position={[0, 5, 3]} angle={0.4} penumbra={0.7} intensity={1.0} />

      <Suspense fallback={null}>
        <TabletMesh
          rotX={rotX}
          rotY={rotY}
          mode={isDark ? "infrastructure" : "growth"}
          formatId={formatId}
          playing={playing}
          onReady={onMeshReady}
          flat={flat}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={isDark ? 0.7 : 0.85} frames={1} />
      </Suspense>
    </>
  );
}

function WarmupRenderer({ meshReady }: { meshReady: boolean }) {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    if (meshReady) {
      gl.render(scene, camera);
    }
  }, [meshReady, gl, scene, camera]);
  return null;
}

export function Tablet3D({ mode, formatId, className, active = true, flat = false }: Tablet3DProps) {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const rotY = useMotionValue(flat ? 0 : REST_Y);
  const rotX = useMotionValue(flat ? 0 : REST_X);
  const springY = useSpring(rotY, { stiffness: 260, damping: 30, mass: 0.7 });
  const springX = useSpring(rotX, { stiffness: 260, damping: 30, mass: 0.7 });

  const [isDragging, setIsDragging] = useState(false);
  const [inView, setInView] = useState(true);
  const [meshReady, setMeshReady] = useState(false);
  const [slotBox, setSlotBox] = useState<{ w: number; h: number } | null>(null);

  const isDark = mode !== "growth";

  const markMeshReady = useCallback(() => setMeshReady(true), []);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const check = () => {
      const { width, height } = node.getBoundingClientRect();
      if (width >= 64 && height >= 64) {
        setSlotBox({ w: Math.round(width), h: Math.round(height) });
      }
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  // Do not flip meshReady off on format change — glass swaps under the hood.

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => setInView(e!.isIntersecting), {
      rootMargin: "10% 0px",
      threshold: 0,
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (reduced || flat) return;
    dragging.current = true;
    setIsDragging(true);
    last.current = { x: e.clientX, y: e.clientY };
    stageRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    rotY.set(Math.max(-0.45, Math.min(0.45, rotY.get() + dx * 0.006)));
    rotX.set(Math.max(-0.15, Math.min(0.15, rotX.get() - dy * 0.004)));
  };

  const endDrag = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    try { stageRef.current?.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    rotY.set(REST_Y + (rotY.get() - REST_Y) * 0.35);
    rotX.set(REST_X + (rotX.get() - REST_X) * 0.35);
  };

  return (
    <div
      ref={stageRef}
      className={cn(
        "relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="img"
      aria-label="Interactive iPad mockup — drag to rotate"
      data-dragging={isDragging ? "true" : "false"}
    >
      <DeviceLoadStage
        ready={meshReady}
        placeholder={null}
        instant
      >
        {slotBox ? (
        <Canvas className="tablet-glb-canvas"
          dpr={[1, 1.5]}
          frameloop={reduced ? "never" : active ? "always" : "demand"}
          resize={{ debounce: 0, offsetSize: true }}
          gl={{
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
            stencil: false,
          }}
          camera={{ position: [0, 0.15, flat ? 3.15 : 3.48], fov: 28, near: 0.1, far: 80 }}
          style={{
            width: slotBox.w,
            height: slotBox.h,
            display: "block",
            background: "transparent",
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            gl.outputColorSpace = SRGBColorSpace;
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ForceCanvasSize w={slotBox.w} h={slotBox.h} onSized={markMeshReady} />
          <TabletScene
            isDark={isDark}
            rotX={springX}
            rotY={springY}
            formatId={formatId}
            playing={active && !reduced && inView}
            onMeshReady={markMeshReady}
            flat={flat}
          />
          <WarmupRenderer meshReady={meshReady} />
        </Canvas>
        ) : null}
      </DeviceLoadStage>
    </div>
  );
}

useGLTF.preload("/channels/oem/tablet.glb", DRACO_PATH);
