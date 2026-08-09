import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback, type ReactNode } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "upraiser-theme";
const SEEN_KEY = "upraiser-modes-seen";

/** Match hero / mobile layout breakpoint — phones & narrow tablets. */
export const MOBILE_THEME_QUERY = "(max-width: 899px)";

const THEME_COLORS: Record<Theme, string> = {
  dark: "#050504",
  light: "#ffffff",
};

type SeenModes = { light: boolean; dark: boolean };

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  /** True once the visitor has opened both growth (light) and infrastructure (dark). */
  dualStoryReady: boolean;
} | null>(null);

function isMobileViewport() {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_THEME_QUERY).matches;
}

function syncThemeColor(theme: Theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  syncThemeColor(theme);
}

function readStoredTheme(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

/** Mobile always boots light; desktop keeps stored preference (default dark). */
function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  if (isMobileViewport()) return "light";
  return readStoredTheme() ?? "dark";
}

function readSeen(current: Theme): SeenModes {
  if (typeof window === "undefined") {
    return { light: current === "light", dark: current === "dark" };
  }
  try {
    const raw = sessionStorage.getItem(SEEN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SeenModes>;
      return {
        light: Boolean(parsed.light) || current === "light",
        dark: Boolean(parsed.dark) || current === "dark",
      };
    }
  } catch {
    /* ignore */
  }
  return { light: current === "light", dark: current === "dark" };
}

function writeSeen(seen: SeenModes) {
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    /* ignore */
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme());
  const [seen, setSeen] = useState<SeenModes>(() => readSeen(theme));
  /** True after an explicit toggle — safe to persist even on mobile. */
  const userChoseRef = useRef(false);

  useEffect(() => {
    applyTheme(theme);

    // Don't overwrite a desktop dark preference just because mobile forced light on boot.
    if (!isMobileViewport() || userChoseRef.current) {
      localStorage.setItem(STORAGE_KEY, theme);
    }

    setSeen((prev) => {
      if (prev[theme]) return prev;
      const next = { ...prev, [theme]: true };
      writeSeen(next);
      return next;
    });
  }, [theme]);

  const toggleTheme = useCallback(() => {
    userChoseRef.current = true;
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const dualStoryReady = useMemo(() => seen.light && seen.dark, [seen.light, seen.dark]);

  const value = useMemo(() => ({ theme, toggleTheme, dualStoryReady }), [theme, toggleTheme, dualStoryReady]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
