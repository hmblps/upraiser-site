import { createContext, useContext, type ReactNode } from "react";

type ScrollListener = (scrollY: number) => void;

type ScrollContextValue = {
  /** Smooth scroll — for anchor links */
  scrollTo: (targetId: string, offset?: number) => void;
  /** Instant snap — for section arrow navigation */
  jumpToSection: (targetId: string) => void;
  /** Lenis-aware scroll position (falls back to window when Lenis is off) */
  registerScrollListener: (listener: ScrollListener) => () => void;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({
  children,
  scrollTo,
  jumpToSection,
  registerScrollListener,
}: {
  children: ReactNode;
  scrollTo: (targetId: string, offset?: number) => void;
  jumpToSection: (targetId: string) => void;
  registerScrollListener: (listener: ScrollListener) => () => void;
}) {
  return (
    <ScrollContext.Provider value={{ scrollTo, jumpToSection, registerScrollListener }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScroll must be used within ScrollProvider");
  return ctx;
}
