export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Default interactive spring — manifesto: physics over duration/ease */
export const SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
  mass: 0.7,
};

export const SPRING_SOFT = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export const defaultTransition = SPRING_SOFT;

export const viewportOnce = {
  once: true,
  margin: "-80px" as const,
};
