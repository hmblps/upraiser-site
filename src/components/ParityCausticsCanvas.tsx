import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle, Vec2 } from "ogl";
import type { MotionValue } from "framer-motion";

type ParityCausticsCanvasProps = {
  /** Scroll progress of the Promise fold — slightly speeds the drift while moving */
  progress?: MotionValue<number>;
};

const VERT = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

/**
 * Digital-sea caustic web — nested sine domain warp (not milky fbm).
 * Loop unrolled: GLSL ES 1.0 (WebGL1) rejects `for (float i …)`.
 */
const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);

    // Horizontal water perspective
    vec2 uv = vUv * 8.0;
    uv.x *= aspect * 0.85;
    uv.y *= 0.3;
    float time = uTime * 0.6;

    // Nested sine warp (unrolled) → intersecting caustic web
    vec2 p = uv;
    vec2 newp;

    newp = p;
    newp.x += 0.6 * sin(1.0 * p.y + time + 0.3);
    newp.y += 0.6 * cos(1.0 * p.x + time + 0.3);
    p = newp;

    newp = p;
    newp.x += 0.3 * sin(2.0 * p.y + time + 0.3);
    newp.y += 0.3 * cos(2.0 * p.x + time + 0.3);
    p = newp;

    newp = p;
    newp.x += 0.2 * sin(3.0 * p.y + time + 0.3);
    newp.y += 0.2 * cos(3.0 * p.x + time + 0.3);
    p = newp;

    // Sharp neon filaments on pure black
    float caustics = pow(abs(sin(p.x + p.y)), 4.0) * 2.5;
    caustics += 0.35 * pow(abs(sin(p.x * 1.7 - p.y)), 5.0) * 2.0;
    caustics *= uIntensity;

    caustics *= smoothstep(0.0, 0.04, vUv.x) * smoothstep(1.0, 0.96, vUv.x);
    caustics *= smoothstep(1.0, 0.1, vUv.y);
    caustics = clamp(caustics, 0.0, 1.0);

    gl_FragColor = vec4(vec3(caustics), 1.0);
  }
`;

/**
 * Tiny OGL fullscreen-triangle caustics for the Parity lake.
 * Pauses offscreen; DPR capped; blends via CSS color-dodge over scanlined bars.
 */
export function ParityCausticsCanvas({ progress }: ParityCausticsCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let disposed = false;
    let visible = false;
    let ready = false;
    let raf = 0;
    let lastProgress = progress?.get() ?? 0;
    let scrollBoost = 0;

    // Kill default 300×150 placeholder box before first real resize
    canvas.width = 1;
    canvas.height = 1;
    canvas.style.opacity = "0";

    const renderer = new Renderer({
      canvas,
      dpr: Math.min(1.5, window.devicePixelRatio || 1),
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    const geometry = new Triangle(gl);
    let program: Program;
    try {
      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 1.0 },
          uResolution: { value: new Vec2(1, 1) },
        },
        transparent: false,
        depthTest: false,
        depthWrite: false,
      });
    } catch (err) {
      console.warn("[ParityCaustics] shader compile failed", err);
      return;
    }

    // ogl leaves attributeLocations undefined if link failed
    if (!program.attributeLocations) {
      console.warn("[ParityCaustics] program invalid — skipping canvas");
      return;
    }

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w < 2 || h < 2) return;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value.set(w, h);
      if (!ready) {
        ready = true;
        canvas.style.opacity = "1";
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        const next = Boolean(entry?.isIntersecting);
        if (next && !visible) {
          visible = true;
          if (!raf) raf = requestAnimationFrame(tick);
        } else if (!next) {
          visible = false;
        }
      },
      { rootMargin: "48px", threshold: 0.02 },
    );
    io.observe(wrap);

    const unsubProgress = progress?.on("change", (v) => {
      if (Math.abs(v - lastProgress) > 0.001) {
        scrollBoost = Math.min(1, scrollBoost + 0.35);
        lastProgress = v;
      }
    });

    const start = performance.now();

    const tick = (now: number) => {
      if (disposed) return;
      raf = 0;
      if (!visible || !ready) {
        if (visible && !ready) raf = requestAnimationFrame(tick);
        return;
      }

      scrollBoost += (0 - scrollBoost) * 0.04;
      const speed = 0.55 + scrollBoost * 0.9;
      program.uniforms.uTime.value = ((now - start) / 1000) * speed;
      try {
        renderer.render({ scene: mesh });
      } catch {
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    visible = true;
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      unsubProgress?.();
      try {
        const ext = gl.getExtension("WEBGL_lose_context");
        ext?.loseContext();
      } catch {
        /* ignore */
      }
    };
  }, [progress]);

  return (
    <div ref={wrapRef} className="parity-water__caustics" aria-hidden>
      <canvas ref={canvasRef} className="parity-water__caustics-canvas" />
    </div>
  );
}
