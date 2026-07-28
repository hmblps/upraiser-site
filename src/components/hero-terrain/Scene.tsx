import { Suspense, useEffect, type MutableRefObject } from "react";
import { Everest } from "../Everest";
import { Atmosphere, HorizonGlow, SunRig } from "./Atmosphere";
import { AscentBird } from "./AscentBird";
import { AscentHalo } from "./AscentHalo";
import { BrandHazeSky } from "./BrandHazeSky";
import { HeroCamera } from "./HeroCamera";
import { NightStars } from "./NightStars";
import { ScrollBeams } from "./ScrollBeams";
import { StudioRimLight } from "./StudioRimLight";
import type { AscentPath, ScrollState, ThemeMode } from "./shared";

function SceneReady({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

export function Scene({
  theme,
  scrollRef,
  path,
  onModelReady,
}: {
  theme: ThemeMode;
  scrollRef: MutableRefObject<ScrollState>;
  path: AscentPath;
  onModelReady: () => void;
}) {
  const isLight = theme === "light";

  return (
    <>
      <Atmosphere theme={theme} />
      <HorizonGlow theme={theme} />
      <SunRig theme={theme} />
      {isLight ? <ScrollBeams /> : null}
      {isLight ? <StudioRimLight /> : null}
      {isLight ? <AscentHalo /> : null}
      <HeroCamera scrollRef={scrollRef} path={path} />
      {isLight ? <BrandHazeSky /> : <NightStars />}
      <Suspense fallback={null}>
        <Everest theme={theme} castShadow={false} receiveShadow={false} />
        <SceneReady onReady={onModelReady} />
      </Suspense>
      {isLight ? <AscentBird /> : null}
    </>
  );
}
