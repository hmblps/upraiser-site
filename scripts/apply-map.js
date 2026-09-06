import puppeteer from 'puppeteer';
import fs from 'fs';

const code = `
import { useEffect, useRef, useState, Suspense, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { SRGBColorSpace, LinearFilter, VideoTexture, TextureLoader, Texture, Object3D, Box3, Vector3 } from "three";
import { useSpring, useMotionValue } from "framer-motion";
import { ACESFilmicToneMapping } from "three";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../lib/cn";
import type { SiteMode } from "../../data/liveContent";
import type { ReactPointerEvent } from "@react-three/fiber";

const MODEL_PATH = "/channels/oem/tv.glb";
const DRACO_PATH = "/draco/gltf/";
const TV_SCREEN_STILL = "/channels/oem/tv-screen-still.jpg";
const TV_SCREEN_VIDEO = "/channels/oem/tv-screen-scrub.mp4";

const HIDDEN_NODE_NAMES = new Set([
  "EnvironmentAmbientLight",
]);

const REST_X = 0;
const REST_Y = 0;

function hasCtvScreen(formatId?: string) {
  return formatId === "ctv-spot" || formatId === "ctv-video";
}

function getTargetHeight() {
  if (typeof window === "undefined") return 1.7;
  const aspect = window.innerWidth / window.innerHeight;
  return Math.min(1.7, 1.5 * aspect);
}

function computeTransform(scene: Object3D) {
  scene.updateMatrixWorld(true);
  const box = new Box3().setFromObject(scene, true);
  if (box.isEmpty()) return { scale: 0.022 * (getTargetHeight() / 1.7), cx: 99.25, cy: -69.52, cz: -2.13 };
  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);
  const scale = getTargetHeight() / Math.max(size.y, 0.001);
  return { scale, cx: center.x, cy: center.y, cz: center.z };
}

type Tv3DProps = { mode: SiteMode; formatId?: string; className?: string };

function TvMesh({ rotX, rotY, formatId, inView, onReady }: { rotX: any; rotY: any; formatId?: string; inView: boolean; onReady?: () => void }) {
  const outerRef = useRef<any>(null);
  const { scene, materials } = useGLTF(MODEL_PATH, DRACO_PATH) as any;
  const showScreen = hasCtvScreen(formatId);
  const modeRef = useRef<"still" | "video">("still");
  const [screenMap, setScreenMap] = useState<Texture | null>(null);

  const [xf] = useState(() => computeTransform(scene));

  const { video, videoTex } = useMemo(() => {
    const v = document.createElement("video");
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("muted", "true");
    v.preload = "auto";
    const t = new VideoTexture(v);
    t.colorSpace = SRGBColorSpace;
    t.minFilter = LinearFilter;
    t.magFilter = LinearFilter;
    t.generateMipmaps = false;
    return { video: v, videoTex: t };
  }, []);

  useEffect(() => {
    scene.traverse((obj: any) => {
      if (HIDDEN_NODE_NAMES.has(obj.name)) obj.visible = false;
    });
    onReady?.();
  }, [scene, onReady]);

  useEffect(() => {
    if (!showScreen) {
      setScreenMap(null);
      video.pause();
      return;
    }
    let cancelled = false;
    const loader = new TextureLoader();
    loader.load(TV_SCREEN_STILL, (tex) => {
      if (cancelled) { tex.dispose(); return; }
      tex.colorSpace = SRGBColorSpace;
      tex.minFilter = LinearFilter;
      tex.magFilter = LinearFilter;
      tex.needsUpdate = true;
      modeRef.current = "still";
      setScreenMap((prev) => {
        if (prev && prev !== videoTex) prev.dispose();
        return tex;
      });
    });
    return () => { cancelled = true; };
  }, [showScreen, video]);

  useEffect(() => {
    if (!showScreen || !inView) { video.pause(); return; }
    let promoted = false;
    const promote = () => {
      if (promoted || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      promoted = true;
      modeRef.current = "video";
      setScreenMap((prev) => {
        if (prev && prev !== videoTex) prev.dispose();
        return videoTex;
      });
      void video.play().catch(() => { modeRef.current = "still"; });
    };
    video.src = TV_SCREEN_VIDEO;
    video.addEventListener("loadeddata", promote);
    video.addEventListener("canplay", promote);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) promote();
    else video.load();
    return () => {
      video.removeEventListener("loadeddata", promote);
      video.removeEventListener("canplay", promote);
      video.pause();
    };
  }, [showScreen, inView, video, videoTex]);

  // APPLY MAP DIRECTLY TO MATERIAL INSTEAD OF PLANE
  useEffect(() => {
    if (materials.Custom && screenMap) {
      materials.Custom.map = screenMap;
      materials.Custom.emissiveMap = screenMap;
      materials.Custom.emissive = { r: 1, g: 1, b: 1 };
      materials.Custom.needsUpdate = true;
    }
    if (materials.Custom_1 && screenMap) {
      materials.Custom_1.map = screenMap;
      materials.Custom_1.emissiveMap = screenMap;
      materials.Custom_1.emissive = { r: 1, g: 1, b: 1 };
      materials.Custom_1.needsUpdate = true;
    }
  }, [materials, screenMap]);

  useFrame((state) => {
    if (!outerRef.current) return;
    const t = state.clock.elapsedTime;
    outerRef.current.rotation.x = rotX.get() + Math.sin(t * 0.8) * 0.02;
    outerRef.current.rotation.y = rotY.get() + Math.cos(t * 0.6) * 0.03;
    outerRef.current.position.y = Math.sin(t * 1.2) * 0.03;
    if (modeRef.current === "video") videoTex.needsUpdate = true;
  });

  return (
    <group ref={outerRef} rotation={[0.06, 0, 0]}>
      <group scale={xf.scale} rotation={[0, Math.PI, 0]}>
        <group position={[-xf.cx, -xf.cy, -xf.cz]}>
          <primitive object={scene} dispose={null} />
        </group>
      </group>
    </group>
  );
}
`;
// Wait, we need the rest of Tv3D
