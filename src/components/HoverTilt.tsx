import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

const SPRING = { stiffness: 320, damping: 28, mass: 0.65 };

type HoverTiltProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  spotlight?: boolean;
  lift?: boolean;
};

export function HoverTilt({
  children,
  className = "",
  maxTilt = 7,
  spotlight = true,
  lift = true,
}: HoverTiltProps) {
  const reduced = useReducedMotion();
  const [finePointer, setFinePointer] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches,
  );
  const ref = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [maxTilt, -maxTilt]), SPRING);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-maxTilt, maxTilt]), SPRING);
  const y = useSpring(useTransform(pointerY, [0, 1], [lift ? 2 : 0, lift ? -4 : 0]), SPRING);
  const glowX = useTransform(pointerX, (value) => `${value * 100}%`);
  const glowY = useTransform(pointerY, (value) => `${value * 100}%`);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(420px circle at ${x} ${y}, color-mix(in srgb, var(--theme-accent) 18%, transparent), transparent 42%)`,
  );

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const sync = () => setFinePointer(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const interactive = !reduced && finePointer;

  if (!interactive) {
    return (
      <div className={`hover-tilt ${className}`.trim()}>
        <div className="hover-tilt-face">{children}</div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`hover-tilt hover-tilt--live ${className}`.trim()}
      style={{
        rotateX,
        rotateY,
        y,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
      }}
      onMouseMove={(event) => {
        const node = ref.current;
        if (!node) return;
        const bounds = node.getBoundingClientRect();
        if (bounds.width === 0 || bounds.height === 0) return;
        pointerX.set((event.clientX - bounds.left) / bounds.width);
        pointerY.set((event.clientY - bounds.top) / bounds.height);
      }}
      onMouseLeave={() => {
        pointerX.set(0.5);
        pointerY.set(0.5);
      }}
    >
      {spotlight ? (
        <motion.div
          className="hover-tilt-glow pointer-events-none absolute inset-0"
          style={{ background: glowBackground }}
          aria-hidden
        />
      ) : null}
      <div className="hover-tilt-face" style={{ transform: "translateZ(18px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
