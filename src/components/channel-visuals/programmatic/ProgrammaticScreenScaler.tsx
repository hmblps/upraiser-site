import { useEffect, useRef, useState, type ReactNode } from "react";
import { PROGRAMMATIC_SCREEN_WIDTH } from "./bannerAssets";

type ProgrammaticScreenScalerProps = {
  children: ReactNode;
  className?: string;
};

/** Scale a 390px-wide app mock to fit the phone screen slot. */
export function ProgrammaticScreenScaler({ children, className }: ProgrammaticScreenScalerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.32);

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;

    const update = () => {
      const width = node.clientWidth;
      if (width > 0) setScale(width / PROGRAMMATIC_SCREEN_WIDTH);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={className ? `cv-prog-screen-slot ${className}` : "cv-prog-screen-slot"}>
      <div
        className="cv-prog-screen-scale"
        style={{
          width: PROGRAMMATIC_SCREEN_WIDTH,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
