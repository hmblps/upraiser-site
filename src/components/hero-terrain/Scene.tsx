import { Suspense, useCallback, useLayoutEffect, type MutableRefObject } from "react";
import { useThree } from "@react-three/fiber";
import { Everest } from "../Everest";
import { Atmosphere, HorizonGlow, SunRig } from "./Atmosphere";
import { AscentBird } from "./AscentBird";
import { AscentHalo } from "./AscentHalo";
import { AscentRoute } from "./AscentRoute";
import { BrandHazeSky } from "./BrandHazeSky";
import { FloatingVoyager } from "./FloatingVoyager";
import { HeroCamera } from "./HeroCamera";
import { NightStars } from "./NightStars";
import { ScrollBeams } from "./ScrollBeams";
import { StudioRimLight } from "./StudioRimLight";
import { MistSheets } from "./MistSheets";
import { SeaOfClouds } from "./SeaOfClouds";
import type { AscentPath, ScrollState, ThemeMode } from "./shared";

/** Hide the canvas until the mountain has compiled — not merely parsed. */
function FirstFrameGate({ onReady }: { onReady: () => void }) {
  const { gl, scene, camera } = useThree();

  useLayoutEffect(() => {
    let cancelled = false;
    try {
      gl.compile(scene, camera);
    } catch {
      /* compile is best-effort — still wait for draws */
    }
    let frames = 0;
    let raf = 0;
    const tick = () => {
      frames += 1;
      if (frames < 3) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (!cancelled) onReady();
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [gl, scene, camera, onReady]);

  return null;
}

export function Scene({
  theme,
  scrollRef,
  path,
  onModelReady,
  voyager = false,
  lite = false,
}: {
  theme: ThemeMode;
  scrollRef: MutableRefObject<ScrollState>;
  path: AscentPath;
  onModelReady: () => void;
  voyager?: boolean;
  lite?: boolean;
}) {
  const isLight = theme === "light";
  const handleReady = useCallback(() => {
    onModelReady();
  }, [onModelReady]);

  return (
    <>
      <Atmosphere theme={theme} fogProfile={lite ? "expedition" : "home"} />
      <HorizonGlow theme={theme} />
      <SunRig theme={theme} />
      {isLight && !lite ? <ScrollBeams /> : null}
      {isLight ? <StudioRimLight /> : null}
      {isLight && !lite ? <AscentHalo /> : null}
      <HeroCamera scrollRef={scrollRef} path={path} />
      {isLight ? <BrandHazeSky lite={lite} /> : <NightStars />}
      <Suspense fallback={null}>
        <Everest theme={theme} castShadow={isLight} receiveShadow={isLight} />
        {!lite && !isLight && voyager ? <FloatingVoyager /> : null}

        <FirstFrameGate key={theme} onReady={handleReady} />
        {lite ? <AscentRoute /> : null}
      </Suspense>
      {isLight ? <SeaOfClouds theme={theme} lite={lite} /> : null}
      {isLight ? <MistSheets lite={lite} /> : null}
      {isLight && !lite ? <AscentBird /> : null}
    </>
  );
}
