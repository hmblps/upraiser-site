import { useEffect, useRef, useState } from "react";

type SectionAmbienceProps = {
  tone?: "soft" | "warm" | "cool";
  className?: string;
};

export function SectionAmbience({ tone = "soft", className = "" }: SectionAmbienceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "20% 0px",
      threshold: 0.01,
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`section-ambience section-ambience--${tone} ${className}`.trim()} aria-hidden>
      {visible ? (
        <>
          <div className="section-ambience-orb section-ambience-orb--a" />
          <div className="section-ambience-orb section-ambience-orb--b" />
        </>
      ) : null}
    </div>
  );
}
