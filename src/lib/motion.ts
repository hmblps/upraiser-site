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
  margin: "0px 0px -10% 0px" as const,
  amount: 0.2 as const,
};

/** 
 * Emil Kowalski micro-interactions 
 * Spread these onto interactive motion.button / motion.a elements
 */
export const microBounce = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.95 },
  transition: SPRING,
};

export const cardBounce = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: SPRING_SOFT,
};
