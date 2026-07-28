import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "upraiser-theme";
const SEEN_KEY = "upraiser-modes-seen";

const THEME_COLORS: Record<Theme, string> = {
  dark: "#050504",
  light: "#f2ebe0",
};

type SeenModes = { light: boolean; dark: boolean };

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  /** True once the visitor has opened both growth (light) and infrastructure (dark). */
  dualStoryReady: boolean;
} | null>(null);

function syncThemeColor(theme: Theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  syncThemeColor(theme);
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
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored === "light" || stored === "dark" ? stored : "dark";
  });

  const [seen, setSeen] = useState<SeenModes>(() => readSeen(theme));

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    setSeen((prev) => {
      if (prev[theme]) return prev;
      const next = { ...prev, [theme]: true };
      writeSeen(next);
      return next;
    });
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const dualStoryReady = useMemo(() => seen.light && seen.dark, [seen.light, seen.dark]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, dualStoryReady }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
