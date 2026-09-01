import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./styles/andy-kowalski.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { preloadHeroTerrain } from "./lib/heroBoot.ts";

if (typeof document !== "undefined") {
  // OS Detection for Typography fixes
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) {
    document.documentElement.dataset.os = "windows";
  } else if (ua.includes("mac")) {
    document.documentElement.dataset.os = "mac";
  }

  const theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  preloadHeroTerrain(theme);
}

// Tall sticky hero — prevent browser restoring mid-ascent on refresh.
if (typeof history !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
