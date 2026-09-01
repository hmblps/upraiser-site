import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import { CAPTURE_HEIGHT, CAPTURE_WIDTH, heroCapture } from "../../lib/heroCapture";

type CaptureJob = {
  shot: "home" | "expedition";
  theme: "dark" | "light";
  frames: number;
  onStatus: (line: string) => void;
  onDone: () => void;
};

function pad(n: number) {
  return String(n).padStart(4, "0");
}

function waitFrames(n: number) {
  return new Promise<void>((resolve) => {
    const step = (left: number) => {
      if (left <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(() => step(left - 1));
    };
    requestAnimationFrame(() => step(n - 1));
  });
}

function lockCaptureBuffer(
  gl: { setPixelRatio: (n: number) => void; setSize: (w: number, h: number, updateStyle?: boolean) => void },
  camera: PerspectiveCamera & { manual?: boolean },
) {
  gl.setPixelRatio(1);
  gl.setSize(CAPTURE_WIDTH, CAPTURE_HEIGHT, false);
  camera.manual = true;
  camera.aspect = CAPTURE_WIDTH / CAPTURE_HEIGHT;
  camera.updateProjectionMatrix();
}

/** Steps progress 0→1 in equal increments, dumps PNG via Vite middleware. */
export function CaptureDriver({ job, modelReady }: { job: CaptureJob; modelReady: boolean }) {
  const { gl, camera, invalidate } = useThree();
  const running = useRef(false);
  const [armed, setArmed] = useState(false);
  const cam = camera as PerspectiveCamera & { manual?: boolean };

  // R3F resize follows the tab CSS box (Cursor panel ≠ 16:9). Pin the drawing buffer.
  useFrame(() => {
    if (!heroCapture.snap) return;
    lockCaptureBuffer(gl, cam);
  }, -2);

  useEffect(() => {
    if (!modelReady) return;
    const t = window.setTimeout(() => setArmed(true), job.shot === "expedition" ? 900 : 400);
    return () => window.clearTimeout(t);
  }, [modelReady, job.shot]);

  useEffect(() => {
    if (!armed || running.current) return;
    running.current = true;
    const canvas = gl.domElement;
    const { shot, theme, frames, onStatus, onDone } = job;

    heroCapture.enabled = true;
    heroCapture.snap = true;

    void (async () => {
      onStatus(`Rendering ${shot} ${theme} · ${frames} frames · ${CAPTURE_WIDTH}×${CAPTURE_HEIGHT}`);
      lockCaptureBuffer(gl, cam);
      for (let i = 0; i < frames; i += 1) {
        heroCapture.progress = frames === 1 ? 0 : i / (frames - 1);
        lockCaptureBuffer(gl, cam);
        invalidate();
        await waitFrames(3);
        lockCaptureBuffer(gl, cam);
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((file) => resolve(file), "image/png");
        });
        if (!blob) throw new Error("canvas.toBlob returned empty");
        await fetch(`/__hero-capture?shot=${shot}&theme=${theme}&i=${pad(i)}`, {
          method: "POST",
          body: blob,
        });
        if (i % 10 === 0 || i === frames - 1) {
          onStatus(`${shot} ${theme} · ${i + 1}/${frames}`);
        }
      }
      heroCapture.enabled = false;
      heroCapture.snap = false;
      onStatus(`Done ${shot} ${theme} → captures/${shot}-${theme}/`);
      onDone();
    })().catch((err: unknown) => {
      heroCapture.enabled = false;
      heroCapture.snap = false;
      onStatus(err instanceof Error ? err.message : "Capture failed");
      onDone();
    });
  }, [armed, gl, camera, invalidate, job.shot, job.theme, job.frames]);

  return null;
}
