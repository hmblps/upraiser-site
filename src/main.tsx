import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./styles/andy-kowalski.css";
import "./i18n";
import "./lib/domTranslate";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { preloadHeroTerrain } from "./lib/heroBoot.ts";

if (typeof document !== "undefined") {
  const isWinPort = window.location.port === "5174";
  const urlParams = new URLSearchParams(window.location.search);
  const osOverride = urlParams.get("os");
  if (osOverride) {
    if (osOverride === "windows" || osOverride === "mac") {
      try { sessionStorage.setItem("upraiser-os", osOverride); } catch (e) {}
    } else if (osOverride === "reset") {
      try { sessionStorage.removeItem("upraiser-os"); } catch (e) {}
    }
  }
  const activeOs = osOverride || (function() { try { return sessionStorage.getItem("upraiser-os"); } catch (e) { return null; } })();
  if (activeOs === "windows" || activeOs === "mac") {
    document.documentElement.dataset.os = activeOs;
  } else if (isWinPort) {
    document.documentElement.dataset.os = "windows";
  } else {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("win")) {
      document.documentElement.dataset.os = "windows";
    } else if (ua.includes("mac")) {
      document.documentElement.dataset.os = "mac";
    }
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
    <HelmetProvider>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
