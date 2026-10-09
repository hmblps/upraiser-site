import { useEffect } from "react";
import { useMode } from "../components/SectionHeader";
import { ModeContentTransition } from "../components/motion/ModeContentTransition";
import { CreativeStudioVideo } from "../components/CreativeStudioVideo";
import { useEnvironment } from "../lib/environmentState";

export function CraftPage() {
  const { mode } = useMode();
  const setSnowEnabled = useEnvironment((s) => s.setSnowEnabled);

  useEffect(() => {
    setSnowEnabled(false);
    return () => setSnowEnabled(true);
  }, [setSnowEnabled]);

  return (
    <main className="site-main">
      <ModeContentTransition mode={mode}>
        {mode === "growth" ? (
          <CreativeStudioVideo videoSrc="/creative/light-loop.mp4" theme="light" />
        ) : (
          <CreativeStudioVideo videoSrc="/creative/dark-loop.mp4" theme="dark" />
        )}
      </ModeContentTransition>
    </main>
  );
}
