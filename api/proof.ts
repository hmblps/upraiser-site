/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: false,
  },
};

function escapeHtml(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface ProofItem {
  id: string;
  brand: string;
  shortLabel: string;
  report: string;
  metric: string;
  iconUrl: string;
  fileUrl: string;
  category: string;
}

const PROOF_LIST: ProofItem[] = [
  {
    id: "wsj-oct-perf",
    brand: "The Wall Street Journal",
    shortLabel: "WSJ · Oct AF",
    report: "October Performance (AF)",
    metric: "9,167 Installs · 8,369 App Opens · 1,982 Unique Purchases (21.6% CR)",
    iconUrl: "https://upraiser.co.uk/snapshots/icons/wsj.png",
    fileUrl: "https://upraiser.co.uk/snapshots/wsj-appsflyer-oct.png",
    category: "US Geo Campaigns",
  },
  {
    id: "wsj-oct-p360",
    brand: "The Wall Street Journal",
    shortLabel: "WSJ · Oct P360",
    report: "October Protect360",
    metric: "6,349+ Clean Installs · <=1% Fraud Rate across top sources",
    iconUrl: "https://upraiser.co.uk/snapshots/icons/wsj.png",
    fileUrl: "https://upraiser.co.uk/snapshots/wsj-protect360-oct.png",
    category: "US Geo Campaigns",
  },
  {
    id: "wsj",
    brand: "The Wall Street Journal",
    shortLabel: "WSJ · Sep P360",
    report: "September Protect360",
    metric: "~14,000 Clean Installs · <=1% Fraud Rate (0.13% on primary source)",
    iconUrl: "https://upraiser.co.uk/snapshots/icons/wsj.png",
    fileUrl: "https://upraiser.co.uk/snapshots/wsj-protect360.png",
    category: "US Geo Campaigns",
  },
  {
    id: "underdog",
    brand: "Underdog Fantasy",
    shortLabel: "Underdog · CRM",
    report: "Partner Dashboard",
    metric: "184 FTDs · Up to $137 Avg FTD & $441 Sum Deposit",
    iconUrl: "https://upraiser.co.uk/snapshots/icons/underdog.png",
    fileUrl: "https://upraiser.co.uk/snapshots/underdog-fantasy.png",
    category: "US Geo Campaigns",
  },
  {
    id: "marketwatch-oct-perf",
    brand: "MarketWatch",
    shortLabel: "MarketWatch · Oct AF",
    report: "October Performance (AF)",
    metric: "964 Installs · 906 Roadblock Served · 138 Unique Purchases (14.3% CR)",
    iconUrl: "https://upraiser.co.uk/snapshots/icons/marketwatch.png",
    fileUrl: "https://upraiser.co.uk/snapshots/marketwatch-appsflyer-oct.png",
    category: "US Geo Campaigns",
  },
  {
    id: "marketwatch",
    brand: "MarketWatch",
    shortLabel: "MarketWatch · Sep P360",
    report: "September Protect360",
    metric: "3,120 Clean Installs · 0.00% Fraud Rate across September 2026",
    iconUrl: "https://upraiser.co.uk/snapshots/icons/marketwatch.png",
    fileUrl: "https://upraiser.co.uk/snapshots/marketwatch-protect360.png",
    category: "US Geo Campaigns",
  },
  {
    id: "barrons",
    brand: "Barron’s (Dow Jones)",
    shortLabel: "Barron’s · P360",
    report: "Protect360 Report",
    metric: "4,909 Clean Installs · 0.00% Fraud Rate (only 4 blocked attributions)",
    iconUrl: "https://upraiser.co.uk/snapshots/icons/barrons.png",
    fileUrl: "https://upraiser.co.uk/snapshots/barrons-protect360.png?v=2",
    category: "US Geo Campaigns",
  },
  {
    id: "fetch",
    brand: "Fetch Rewards",
    shortLabel: "Fetch · AF",
    report: "AppsFlyer Performance",
    metric: "6,815 Non-Organic Installs · 8.88% Install-to-Sign-Up CR",
    iconUrl: "https://upraiser.co.uk/snapshots/icons/fetch.png",
    fileUrl: "https://upraiser.co.uk/snapshots/fetch-appsflyer.png",
    category: "US Geo Campaigns",
  },
  {
    id: "vantage",
    brand: "Vantage Trading",
    shortLabel: "Vantage · CRM",
    report: "Partner Dashboard",
    metric: "87.5% QFTD Conversion (133 QFTDs) · $122,500 Commission",
    iconUrl: "https://upraiser.co.uk/snapshots/icons/vantage.png",
    fileUrl: "https://upraiser.co.uk/snapshots/vantage-trading.png",
    category: "Tier1 & Tier2 Geo Campaigns",
  },
  {
    id: "credcol-funnel",
    brand: "Credcol (Fintech)",
    shortLabel: "Credcol · Funnel",
    report: "AppsFlyer Funnel",
    metric: "13,015 Installs · 1,953 D1 Sign-ups · 1,777 Funnel Steps",
    iconUrl: "https://upraiser.co.uk/snapshots/icons/credcol.png",
    fileUrl: "https://upraiser.co.uk/snapshots/credcol-funnel.png",
    category: "Tier1 & Tier2 Geo Campaigns",
  },
  {
    id: "credcol-audit",
    brand: "Credcol (Fintech)",
    shortLabel: "Credcol · P360",
    report: "Protect360 Audit",
    metric: "12,609 Verified Attributions · 0.00% Fraud Rate",
    iconUrl: "https://upraiser.co.uk/snapshots/icons/credcol.png",
    fileUrl: "https://upraiser.co.uk/snapshots/credcol-protect360.png",
    category: "Tier1 & Tier2 Geo Campaigns",
  },
  {
    id: "autodoc",
    brand: "Autodoc",
    shortLabel: "Autodoc · AF",
    report: "AppsFlyer Performance (Aug '26)",
    metric: "28.77% D1 Retention · 55,486 Content Views · 2,229 Add-to-Carts · 121 Purchases",
    iconUrl: "https://upraiser.co.uk/snapshots/icons/autodoc.png",
    fileUrl: "https://upraiser.co.uk/snapshots/autodoc-appsflyer.png",
    category: "Tier1 & Tier2 Geo Campaigns",
  },
];

const PROOFS: Record<
  string,
  {
    brand: string;
    report: string;
    metric: string;
    fileUrl: string;
    category: string;
    iconUrl?: string;
    isSnapshot?: boolean;
  }
> = {
  ...Object.fromEntries(
    PROOF_LIST.map((item) => [
      item.id,
      {
        brand: item.brand,
        report: item.report,
        metric: item.metric,
        fileUrl: item.fileUrl,
        category: item.category,
        iconUrl: item.iconUrl,
        isSnapshot: true,
      },
    ])
  ),
  zip: {
    brand: "Full Snapshot Archive (.zip)",
    report: "All 12 Raw Performance Dashboards",
    metric: "22 MB uncompressed ZIP bundle",
    fileUrl: "https://upraiser.co.uk/snapshots/UPRAISER_Performance_Snapshots.zip?v=3",
    category: "Archive Bundle",
    isSnapshot: false,
  },
  deck: {
    brand: "Media Deck (PDF)",
    report: "Traffic Infrastructure & OEM Preloads",
    metric: "20 Slides · Multilingual Blueprint",
    fileUrl: "https://upraiser.co.uk/Upraiser_Traffic_Infrastructure.pdf",
    category: "Media Deck",
    isSnapshot: false,
  },
};

function parseGeo(headers: Record<string, any>): string {
  const rawCity = headers["x-vercel-ip-city"];
  const city = rawCity ? decodeURIComponent(Array.isArray(rawCity) ? rawCity[0] : String(rawCity)) : "";
  const country = headers["x-vercel-ip-country"]
    ? (Array.isArray(headers["x-vercel-ip-country"]) ? headers["x-vercel-ip-country"][0] : String(headers["x-vercel-ip-country"]))
    : "";
  if (city && country) return `${city}, ${country}`;
  if (country) return country;
  if (city) return city;
  return "Unknown Location";
}

function parseDevice(ua: string): string {
  let device = "💻 Desktop";
  if (/iphone/i.test(ua)) device = "📱 iPhone";
  else if (/ipad/i.test(ua)) device = "📱 iPad";
  else if (/android/i.test(ua)) device = "📱 Android";
  else if (/macintosh|mac os x/i.test(ua)) device = "💻 Mac";
  else if (/windows/i.test(ua)) device = "💻 Windows";

  let client = "";
  const uaLower = ua.toLowerCase();
  if (/linkedinapp|linkedin/i.test(ua)) client = " (LinkedIn In-App)";
  else if (/telegram/i.test(ua)) client = " (Telegram In-App)";
  else if (/whatsapp/i.test(ua)) client = " (WhatsApp In-App)";
  else if (/instagram/i.test(ua)) client = " (Instagram In-App)";
  else if (/fbav|fban|facebook/i.test(ua)) client = " (Facebook In-App)";
  else if (/twitter|x\/|x android/i.test(ua)) client = " (X / Twitter In-App)";
  else if (/teams/i.test(ua)) client = " (Teams In-App)";
  else if (/slack/i.test(ua)) client = " (Slack In-App)";
  else if (/mail/i.test(uaLower)) client = " (Mail Client)";
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(uaLower)) client = " (Safari)";
  else if (/chrome|crios/i.test(uaLower)) client = " (Chrome)";

  return `${device}${client}`;
}

function getHardwareFamily(deviceLabel: string): string {
  if (/iphone/i.test(deviceLabel)) return "iPhone";
  if (/ipad/i.test(deviceLabel)) return "iPad";
  if (/android/i.test(deviceLabel)) return "Android";
  if (/mac/i.test(deviceLabel)) return "Mac";
  if (/windows/i.test(deviceLabel)) return "Windows";
  return "Desktop";
}

function getShortDeviceIconLabel(deviceLabel: string): string {
  const fam = getHardwareFamily(deviceLabel);
  if (fam === "iPhone") return "📱 iPhone";
  if (fam === "iPad") return "📱 iPad";
  if (fam === "Android") return "📱 Android";
  if (fam === "Mac") return "💻 Mac";
  if (fam === "Windows") return "💻 Windows";
  return "💻 Desktop";
}

function formatTimeHHMM(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Bucharest",
    }).format(date);
  } catch {
    return date.toISOString().slice(11, 16);
  }
}

const OWNER_IPS = new Set(["82.137.32.198"]);

function extractClientIp(headers: Record<string, any>): string {
  const xff = headers["x-forwarded-for"];
  if (xff) {
    const raw = Array.isArray(xff) ? xff[0] : String(xff);
    return raw.split(",")[0].trim();
  }
  const realIp = headers["x-real-ip"];
  return realIp ? String(realIp).trim() : "";
}

function isPrefetchRequest(headers: Record<string, any>): boolean {
  const secPurpose = String(headers["sec-purpose"] || headers["purpose"] || headers["x-purpose"] || "").toLowerCase();
  const moz = String(headers["x-moz"] || "").toLowerCase();
  return secPurpose.includes("prefetch") || secPurpose.includes("preview") || moz.includes("prefetch");
}

function isOwnerProofRequest(headers: Record<string, any>, lead: string): boolean {
  const cookieHeader = String(headers["cookie"] || "");
  if (/(?:^|;\s*)upraiser_owner=1(?:;|$)/.test(cookieHeader)) return true;
  const ip = extractClientIp(headers);
  if (ip && OWNER_IPS.has(ip)) return true;
  const cleanLead = (lead || "").trim().toLowerCase();
  if (cleanLead.endsWith("@upraiser.co.uk")) return true;
  return false;
}

function renderSnapshotViewerHtml(initialId: string, lead: string, isOwner: boolean): string {
  const initialIndex = Math.max(
    0,
    PROOF_LIST.findIndex((item) => item.id === initialId)
  );
  const activeItem = PROOF_LIST[initialIndex] || PROOF_LIST[0];
  const usItems = PROOF_LIST.filter((i) => i.category === "US Geo Campaigns");
  const tierItems = PROOF_LIST.filter((i) => i.category === "Tier1 & Tier2 Geo Campaigns");
  const encodedLead = lead && !isOwner ? encodeURIComponent(lead) : "";
  const deckHref = `https://upraiser.co.uk/deck${encodedLead ? `?lead=${encodedLead}` : ""}`;
  const connectHref = `https://upraiser.co.uk/connect${encodedLead ? `?lead=${encodedLead}` : ""}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
  <title>${escapeHtml(activeItem.brand)} · ${escapeHtml(activeItem.report)} | UPRAISER</title>
  <style>
    :root {
      --bg: #f1f5f9;
      --surface: #ffffff;
      --surface-soft: #f8fafc;
      --border: #e2e8f0;
      --border-strong: #cbd5e1;
      --text: #0f172a;
      --text-muted: #475569;
      --text-subtle: #64748b;
      --accent: #e63558;
      --accent-soft: #fff1f4;
      --gold: #fecf09;
    }
    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }
    html, body {
      margin: 0;
      padding: 0;
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      min-height: 100dvh;
    }
    /* Sticky Top Header */
    .topbar {
      position: sticky;
      top: 0;
      z-index: 40;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border);
      padding: calc(8px + env(safe-area-inset-top, 0px)) 16px 8px 16px;
    }
    .topbar-inner {
      max-width: 1180px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .brand-left {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      min-height: 44px;
    }
    .brand-logo {
      height: 17px;
      width: auto;
      display: block;
    }
    .counter-pill {
      display: inline-flex;
      align-items: center;
      background: var(--surface-soft);
      border: 1px solid var(--border);
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      text-transform: uppercase;
      white-space: nowrap;
    }
    .top-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-top {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 0 13px;
      border-radius: 9px;
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
      transition: transform 0.16s ease, opacity 0.16s ease;
    }
    .btn-top:active {
      transform: scale(0.97);
    }
    .btn-deck {
      background: var(--surface-soft);
      color: var(--text);
      border: 1px solid var(--border-strong);
    }
    .btn-pilot {
      background: var(--accent);
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(230, 53, 88, 0.22);
    }

    /* Main Container */
    .container {
      max-width: 1180px;
      margin: 0 auto;
      padding: 14px 14px calc(32px + env(safe-area-inset-bottom, 0px)) 14px;
    }

    /* Active Case Info Header Card */
    .case-header-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px 16px;
      box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
      margin-bottom: 12px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .case-meta-left {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex: 1 1 260px;
      min-width: 0;
    }
    .case-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      border: 1px solid var(--border);
      object-fit: cover;
      flex-shrink: 0;
      background: #ffffff;
    }
    .case-titles {
      min-width: 0;
      flex: 1;
    }
    .case-kicker {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 3px;
    }
    .case-title-row {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 6px;
    }
    .case-brand {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--text);
      margin: 0;
    }
    .case-report-badge {
      display: inline-block;
      font-size: 11.5px;
      font-weight: 600;
      color: var(--text-subtle);
      background: var(--surface-soft);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 2px 7px;
    }
    .case-metric {
      margin: 5px 0 0 0;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      line-height: 1.4;
    }
    .nav-arrows {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      justify-content: space-between;
    }
    @media (min-width: 680px) {
      .nav-arrows {
        width: auto;
        justify-content: flex-end;
      }
    }
    .btn-nav {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 44px;
      padding: 0 14px;
      background: var(--surface-soft);
      border: 1px solid var(--border-strong);
      border-radius: 10px;
      color: var(--text);
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      flex: 1;
      transition: transform 0.15s ease, opacity 0.15s ease;
    }
    @media (min-width: 680px) {
      .btn-nav {
        flex: initial;
      }
    }
    .btn-nav:active {
      transform: scale(0.97);
    }

    /* Stage Card & Zoom Toolbar */
    .stage-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 8px 28px rgba(15, 23, 42, 0.06);
      margin-bottom: 16px;
    }
    .zoom-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 8px 12px;
      background: var(--surface-soft);
      border-bottom: 1px solid var(--border);
    }
    .zoom-group {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .btn-zoom {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 0 12px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text-muted);
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.15s ease, opacity 0.15s ease;
    }
    .btn-zoom.active {
      background: var(--text);
      color: #ffffff;
      border-color: var(--text);
    }
    .btn-zoom:active {
      transform: scale(0.97);
    }
    .raw-link {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      padding: 0 10px;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--text-subtle);
      text-decoration: none;
    }
    .stage-viewport {
      position: relative;
      width: 100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      background: #0f172a;
      max-height: 78dvh;
      text-align: center;
    }
    .stage-img {
      display: block;
      margin: 0 auto;
      width: 100%;
      height: auto;
      cursor: zoom-in;
      user-select: none;
      -webkit-user-drag: none;
      transition: opacity 0.18s ease;
    }
    /* Zoom Mode 2x: Crisp readable columns with smooth horizontal pan */
    .stage-viewport.zoom-2x {
      text-align: left;
    }
    .stage-viewport.zoom-2x .stage-img {
      width: 920px;
      max-width: none;
      cursor: grab;
    }
    @media (min-width: 768px) {
      .stage-viewport.zoom-2x .stage-img {
        width: 1850px;
      }
    }
    /* Zoom Mode 3x: Deep inspection */
    .stage-viewport.zoom-3x {
      text-align: left;
    }
    .stage-viewport.zoom-3x .stage-img {
      width: 1380px;
      max-width: none;
      cursor: grab;
    }
    @media (min-width: 768px) {
      .stage-viewport.zoom-3x .stage-img {
        width: 2560px;
      }
    }
    .stage-hint {
      padding: 8px 12px;
      background: var(--surface-soft);
      border-top: 1px solid var(--border);
      font-size: 11.5px;
      font-weight: 500;
      color: var(--text-subtle);
      text-align: center;
    }

    /* All 12 Snapshots Switcher Grid */
    .switcher-section {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
      margin-bottom: 16px;
    }
    .group-block + .group-block {
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid var(--border);
    }
    .group-title {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--accent);
      margin: 0 0 10px 0;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 8px;
    }
    .snap-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-height: 48px;
      padding: 8px 10px;
      background: var(--surface-soft);
      border: 1px solid var(--border);
      border-radius: 10px;
      text-align: left;
      cursor: pointer;
      transition: transform 0.15s ease, opacity 0.15s ease;
    }
    .snap-btn:active {
      transform: scale(0.98);
    }
    .snap-btn.active {
      background: var(--accent-soft);
      border-color: var(--accent);
    }
    .snap-btn-icon {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: 1px solid var(--border);
      object-fit: cover;
      flex-shrink: 0;
      background: #ffffff;
    }
    .snap-btn-text {
      min-width: 0;
      flex: 1;
    }
    .snap-btn-brand {
      font-size: 12px;
      font-weight: 700;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .snap-btn-report {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-subtle);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Hover rules strictly wrapped for fine pointers */
    @media (hover: hover) and (pointer: fine) {
      .btn-top:hover,
      .btn-nav:hover,
      .btn-zoom:hover,
      .snap-btn:hover {
        opacity: 0.88;
      }
    }
  </style>
</head>
<body>
  <!-- Sticky Topbar -->
  <header class="topbar">
    <div class="topbar-inner">
      <a href="${connectHref}" class="brand-left">
        <img src="https://upraiser.co.uk/email-logo-2x.png" alt="UPRAISER" class="brand-logo" />
        <span class="counter-pill" id="ui-counter">${initialIndex + 1} / ${PROOF_LIST.length}</span>
      </a>
      <div class="top-actions">
        <a href="${deckHref}" class="btn-top btn-deck">Media Deck</a>
        <a href="${connectHref}" class="btn-top btn-pilot">Start Pilot ↗</a>
      </div>
    </div>
  </header>

  <main class="container">
    <!-- Active Case Header -->
    <section class="case-header-card">
      <div class="case-meta-left">
        <img id="ui-icon" src="${escapeHtml(activeItem.iconUrl)}" alt="${escapeHtml(activeItem.brand)}" class="case-icon" />
        <div class="case-titles">
          <div id="ui-kicker" class="case-kicker">${escapeHtml(activeItem.category)}</div>
          <div class="case-title-row">
            <h1 id="ui-brand" class="case-brand">${escapeHtml(activeItem.brand)}</h1>
            <span id="ui-report" class="case-report-badge">${escapeHtml(activeItem.report)}</span>
          </div>
          <p id="ui-metric" class="case-metric">${escapeHtml(activeItem.metric)}</p>
        </div>
      </div>
      <div class="nav-arrows">
        <button type="button" class="btn-nav" id="btn-prev" aria-label="Previous Snapshot">← Prev</button>
        <button type="button" class="btn-nav" id="btn-next" aria-label="Next Snapshot">Next →</button>
      </div>
    </section>

    <!-- Interactive Screenshot Stage -->
    <section class="stage-card">
      <div class="zoom-toolbar">
        <div class="zoom-group">
          <button type="button" class="btn-zoom active" data-zoom="1x" id="zoom-1x">1x Fit</button>
          <button type="button" class="btn-zoom" data-zoom="2x" id="zoom-2x">2x Table Zoom ↔</button>
          <button type="button" class="btn-zoom" data-zoom="3x" id="zoom-3x">3x Detail ↔</button>
        </div>
        <a id="ui-raw-link" href="${escapeHtml(activeItem.fileUrl)}" target="_blank" rel="noopener" class="raw-link">Original PNG ↗</a>
      </div>

      <div class="stage-viewport" id="stage-viewport">
        <img id="ui-image" src="${escapeHtml(activeItem.fileUrl)}" alt="${escapeHtml(activeItem.brand)} - ${escapeHtml(activeItem.report)}" class="stage-img" />
      </div>

      <div class="stage-hint" id="stage-hint">
        Tap screenshot or select <strong>2x Table Zoom ↔</strong> to pan across AppsFlyer &amp; Protect360 columns.
      </div>
    </section>

    <!-- All 12 Snapshots Switcher -->
    <section class="switcher-section">
      <div class="group-block">
        <h2 class="group-title">US Geo Campaigns</h2>
        <div class="cards-grid">
          ${usItems
            .map(
              (item) => `
          <button type="button" class="snap-btn${item.id === activeItem.id ? " active" : ""}" data-id="${escapeHtml(item.id)}">
            <img src="${escapeHtml(item.iconUrl)}" alt="${escapeHtml(item.brand)}" class="snap-btn-icon" />
            <div class="snap-btn-text">
              <div class="snap-btn-brand">${escapeHtml(item.brand)}</div>
              <div class="snap-btn-report">${escapeHtml(item.report)}</div>
            </div>
          </button>`
            )
            .join("")}
        </div>
      </div>

      <div class="group-block">
        <h2 class="group-title">Tier1 &amp; Tier2 Geo Campaigns</h2>
        <div class="cards-grid">
          ${tierItems
            .map(
              (item) => `
          <button type="button" class="snap-btn${item.id === activeItem.id ? " active" : ""}" data-id="${escapeHtml(item.id)}">
            <img src="${escapeHtml(item.iconUrl)}" alt="${escapeHtml(item.brand)}" class="snap-btn-icon" />
            <div class="snap-btn-text">
              <div class="snap-btn-brand">${escapeHtml(item.brand)}</div>
              <div class="snap-btn-report">${escapeHtml(item.report)}</div>
            </div>
          </button>`
            )
            .join("")}
        </div>
      </div>
    </section>
  </main>

  <script>
    (function() {
      var ITEMS = ${JSON.stringify(PROOF_LIST)};
      var LEAD = ${JSON.stringify(lead)};
      var IS_OWNER = ${JSON.stringify(isOwner)};
      var currentIndex = ${initialIndex};
      var currentZoom = "1x";
      var trackedIds = {};
      if (ITEMS[currentIndex]) {
        trackedIds[ITEMS[currentIndex].id] = true;
      }

      // Bridge lead identity to localStorage so /deck and /connect recognize the lead automatically
      if (LEAD && !IS_OWNER) {
        try {
          var rawSession = localStorage.getItem("upraiser_hub_session_v1");
          if (rawSession) {
            var parsed = JSON.parse(rawSession);
            if (!parsed.savedContact) {
              parsed.savedContact = LEAD;
              localStorage.setItem("upraiser_hub_session_v1", JSON.stringify(parsed));
            }
          } else {
            var now = Date.now();
            var d = new Date(now);
            var pad = function(n) { return String(n).padStart(2, "0"); };
            var genId = "hub_" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "_" + pad(d.getHours()) + pad(d.getMinutes()) + "_" + Math.random().toString(36).substring(2, 6);
            localStorage.setItem("upraiser_hub_session_v1", JSON.stringify({
              visitorId: genId,
              clickId: genId,
              visitCount: 1,
              firstVisitTime: now,
              lastVisitTime: now,
              lastActiveTime: now,
              savedContact: LEAD,
              firstTrafficSource: "Email Proof Viewer",
              currentTrafficSource: "Email Proof Viewer"
            }));
          }
        } catch (e) {}
      }

      var uiCounter = document.getElementById("ui-counter");
      var uiIcon = document.getElementById("ui-icon");
      var uiKicker = document.getElementById("ui-kicker");
      var uiBrand = document.getElementById("ui-brand");
      var uiReport = document.getElementById("ui-report");
      var uiMetric = document.getElementById("ui-metric");
      var uiImage = document.getElementById("ui-image");
      var uiRawLink = document.getElementById("ui-raw-link");
      var viewport = document.getElementById("stage-viewport");
      var snapBtns = Array.prototype.slice.call(document.querySelectorAll(".snap-btn"));
      var zoomBtns = Array.prototype.slice.call(document.querySelectorAll(".btn-zoom"));

      function setZoom(mode) {
        currentZoom = mode;
        viewport.classList.remove("zoom-2x", "zoom-3x");
        if (mode === "2x") viewport.classList.add("zoom-2x");
        if (mode === "3x") viewport.classList.add("zoom-3x");
        zoomBtns.forEach(function(btn) {
          btn.classList.toggle("active", btn.getAttribute("data-zoom") === mode);
        });
      }

      zoomBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
          setZoom(btn.getAttribute("data-zoom") || "1x");
        });
      });

      // Desktop drag-to-pan when zoomed + clean click to toggle 1x / 2x
      var isDragging = false;
      var didMove = false;
      var startX = 0;
      var startY = 0;
      var scrollLeftStart = 0;
      var scrollTopStart = 0;

      viewport.addEventListener("mousedown", function(e) {
        if (currentZoom === "1x") return;
        isDragging = true;
        didMove = false;
        startX = e.pageX - viewport.offsetLeft;
        startY = e.pageY - viewport.offsetTop;
        scrollLeftStart = viewport.scrollLeft;
        scrollTopStart = viewport.scrollTop;
      });

      window.addEventListener("mouseup", function() {
        isDragging = false;
      });

      viewport.addEventListener("mousemove", function(e) {
        if (!isDragging) return;
        var x = e.pageX - viewport.offsetLeft;
        var y = e.pageY - viewport.offsetTop;
        var dx = x - startX;
        var dy = y - startY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          didMove = true;
        }
        e.preventDefault();
        viewport.scrollLeft = scrollLeftStart - dx;
        viewport.scrollTop = scrollTopStart - dy;
      });

      uiImage.addEventListener("click", function() {
        if (didMove) {
          didMove = false;
          return;
        }
        if (currentZoom === "1x") {
          setZoom("2x");
        } else {
          setZoom("1x");
        }
      });

      function preloadNeighbors(idx) {
        var prev = ITEMS[(idx - 1 + ITEMS.length) % ITEMS.length];
        var next = ITEMS[(idx + 1) % ITEMS.length];
        [prev, next].forEach(function(item) {
          if (item && item.fileUrl) {
            var img = new Image();
            img.src = item.fileUrl;
          }
        });
      }

      function selectIndex(idx) {
        currentIndex = (idx + ITEMS.length) % ITEMS.length;
        var item = ITEMS[currentIndex];
        if (!item) return;

        uiCounter.textContent = (currentIndex + 1) + " / " + ITEMS.length;
        uiIcon.src = item.iconUrl;
        uiIcon.alt = item.brand;
        uiKicker.textContent = item.category;
        uiBrand.textContent = item.brand;
        uiReport.textContent = item.report;
        uiMetric.textContent = item.metric;
        uiImage.style.opacity = "0.4";
        uiImage.src = item.fileUrl;
        uiImage.alt = item.brand + " - " + item.report;
        uiRawLink.href = item.fileUrl;
        document.title = item.brand + " · " + item.report + " | UPRAISER";

        snapBtns.forEach(function(b) {
          b.classList.toggle("active", b.getAttribute("data-id") === item.id);
        });

        viewport.scrollTop = 0;
        viewport.scrollLeft = 0;

        try {
          var nextUrl = new URL(window.location.href);
          nextUrl.searchParams.set("id", item.id);
          nextUrl.searchParams.delete("app");
          window.history.replaceState({}, "", nextUrl.pathname + "?" + nextUrl.searchParams.toString());
        } catch (e) {}

        preloadNeighbors(currentIndex);

        if (!IS_OWNER && !trackedIds[item.id]) {
          trackedIds[item.id] = true;
          var trackUrl = "/api/proof?id=" + encodeURIComponent(item.id) + (LEAD ? "&lead=" + encodeURIComponent(LEAD) : "") + "&track=1";
          fetch(trackUrl, { method: "GET", keepalive: true }).catch(function() {});
        }
      }

      uiImage.addEventListener("load", function() {
        uiImage.style.opacity = "1";
      });

      document.getElementById("btn-prev").addEventListener("click", function() {
        selectIndex(currentIndex - 1);
      });
      document.getElementById("btn-next").addEventListener("click", function() {
        selectIndex(currentIndex + 1);
      });

      snapBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
          var id = btn.getAttribute("data-id");
          var foundIdx = ITEMS.findIndex(function(i) { return i.id === id; });
          if (foundIdx >= 0) {
            selectIndex(foundIdx);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      });

      window.addEventListener("keydown", function(e) {
        if (e.key === "ArrowLeft") selectIndex(currentIndex - 1);
        if (e.key === "ArrowRight") selectIndex(currentIndex + 1);
      });

      preloadNeighbors(currentIndex);
    })();
  </script>
</body>
</html>`;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "/", "https://upraiser.co.uk");
  const ownerParam = url.searchParams.get("owner") || url.searchParams.get("me");

  // Explicit 1-tap owner activation/deactivation URL: https://upraiser.co.uk/api/proof?owner=1
  if (ownerParam === "1" || ownerParam === "0") {
    const enable = ownerParam === "1";
    res.setHeader(
      "Set-Cookie",
      enable
        ? "upraiser_owner=1; Path=/; Max-Age=315360000; SameSite=Lax"
        : "upraiser_owner=0; Path=/; Max-Age=0; SameSite=Lax"
    );
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Owner Filter</title></head><body style="font-family:-apple-system,sans-serif;background:#0f172a;color:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100dvh;margin:0;padding:24px;text-align:center;"><div style="max-width:420px;background:#1e293b;border:1px solid #334155;border-radius:16px;padding:28px;"><div style="font-size:36px;margin-bottom:12px;">${
        enable ? "🛡️" : "🔔"
      }</div><h2 style="margin:0 0 10px 0;font-size:18px;">${
        enable ? "Устройство владельца привязано" : "Фильтр владельца отключён"
      }</h2><p style="margin:0;font-size:14px;line-height:1.5;color:#94a3b8;">${
        enable
          ? "Ваши собственные открытия /connect, /deck и клики по ссылкам из писем с этого браузера больше не отправляют пуши в Telegram (в том числе в роуминге и с любого Wi-Fi в Тель-Авиве)."
          : "Уведомления с этого устройства снова включены для теста."
      }</p></div></body></html>`
    );
  }

  const appId = (url.searchParams.get("app") || url.searchParams.get("id") || "").toLowerCase().trim();
  const lead = (url.searchParams.get("lead") || url.searchParams.get("email") || "").trim();
  const isRawRedirect = url.searchParams.get("raw") === "1";
  const isTrackOnly = url.searchParams.get("track") === "1";

  const proof = PROOFS[appId] || {
    brand: "Performance Portfolio",
    report: "Raw Snapshots",
    metric: "12 Dashboards",
    fileUrl: "https://upraiser.co.uk/connect",
    category: "General",
    isSnapshot: false,
  };

  // Skip logging/Telegram if this is a browser background prefetch OR Alex's own device/IP
  const ownerDetected = isOwnerProofRequest(req.headers, lead);
  if (ownerDetected) {
    res.setHeader(
      "Set-Cookie",
      "upraiser_owner=1; Path=/; Max-Age=315360000; SameSite=Lax"
    );
  }

  // Reject background browser link prefetching so it never triggers false Telegram alerts
  if (isPrefetchRequest(req.headers)) {
    res.writeHead(204, {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });
    return res.end();
  }

  if (ownerDetected) {
    if (isTrackOnly) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: true, ignored: "owner" }));
    }
    if (proof.isSnapshot && !isRawRedirect) {
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      });
      return res.end(renderSnapshotViewerHtml(appId, lead, true));
    }
    res.writeHead(302, {
      Location: proof.fileUrl,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });
    return res.end();
  }

  const geo = parseGeo(req.headers);
  const ua = (req.headers["user-agent"] as string) || "";
  const device = parseDevice(ua);

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  // Forwarding Detection & Proof Session Cooldown Lookup in Supabase (newest submission first!)
  let resolvedName = "";
  let prevGeo = "";
  let prevDevice = "";
  let isForwardedSuspect = false;
  let isSameCityScreenSwitch = false;
  let linkedVisitorId = "";
  let cooldownKey = lead ? `email_${lead.toLowerCase()}` : "email_anon";
  let existingCooldownMeta: Record<string, any> = {};

  if (supabase && lead) {
    try {
      // Fetch cooldown state first (holds the latest displayName and lead_card_message_id)
      const { data: cdByEmail } = await supabase
        .from("lead_notification_cooldowns")
        .select("metadata")
        .eq("visitor_id", cooldownKey)
        .maybeSingle();

      if (cdByEmail?.metadata && typeof cdByEmail.metadata === "object") {
        existingCooldownMeta = cdByEmail.metadata;
        if (existingCooldownMeta.displayName) {
          resolvedName = String(existingCooldownMeta.displayName);
        }
        if (existingCooldownMeta.lastGeo) {
          prevGeo = String(existingCooldownMeta.lastGeo);
        }
        if (existingCooldownMeta.lastDevice) {
          prevDevice = String(existingCooldownMeta.lastDevice);
        }
      }

      // Query lead_activity_logs ordered DESCENDING (most recent submission first)
      const { data: priorRows } = await supabase
        .from("lead_activity_logs")
        .select("visitor_id, lead_name, lead_contact, event_type, metadata, created_at")
        .ilike("lead_contact", lead)
        .order("created_at", { ascending: false })
        .limit(10);

      if (priorRows && priorRows.length > 0) {
        for (const row of priorRows) {
          if (!linkedVisitorId && row.visitor_id && row.visitor_id.startsWith("hub_")) {
            linkedVisitorId = String(row.visitor_id);
          }
          if (!resolvedName && row.lead_name && row.lead_name !== lead) {
            resolvedName = String(row.lead_name);
          }
          if (row.event_type === "form_submit") {
            if (!prevGeo && row.metadata?.geo) prevGeo = String(row.metadata.geo);
            if (!prevDevice && row.metadata?.device) prevDevice = String(row.metadata.device);
          }
        }
      }

      if (!Object.keys(existingCooldownMeta).length && linkedVisitorId) {
        const { data: cdByVisitor } = await supabase
          .from("lead_notification_cooldowns")
          .select("metadata")
          .eq("visitor_id", linkedVisitorId)
          .maybeSingle();
        if (cdByVisitor?.metadata && typeof cdByVisitor.metadata === "object") {
          existingCooldownMeta = cdByVisitor.metadata;
          if (!resolvedName && existingCooldownMeta.displayName) {
            resolvedName = String(existingCooldownMeta.displayName);
          }
        }
      }

      if (prevGeo || prevDevice) {
        const geoChanged =
          Boolean(prevGeo && geo) &&
          prevGeo !== "Unknown Location" &&
          geo !== "Unknown Location" &&
          prevGeo.toLowerCase() !== geo.toLowerCase();

        const prevFam = prevDevice ? getHardwareFamily(prevDevice) : "";
        const currFam = device ? getHardwareFamily(device) : "";
        const deviceChanged = Boolean(prevFam && currFam && prevFam !== currFam);
        const isDifferentMobileOs =
          (prevFam === "iPhone" && currFam === "Android") ||
          (prevFam === "Android" && currFam === "iPhone");

        if (geoChanged || isDifferentMobileOs) {
          isForwardedSuspect = true;
        } else if (deviceChanged) {
          isSameCityScreenSwitch = true;
        }
      }
    } catch (lookupErr) {
      console.warn("Forwarding lookup warning in proof handler:", lookupErr);
    }
  }

  // Send or Edit Telegram Proof Alert (1 compact consolidated message per 15-min window + Reply to Lead Card)
  const tgToken =
    process.env.VITE_TELEGRAM_BOT_TOKEN ||
    process.env.TELEGRAM_BOT_TOKEN ||
    "8955516402:AAFMgYQ5dJoS13RhOLrNkoPs3lplpaa4bxI";
  const tgChatId =
    process.env.VITE_TELEGRAM_CHAT_ID ||
    process.env.TELEGRAM_CHAT_ID ||
    "-1003934317948";

  if (tgToken && tgChatId) {
    try {
      const leadLabel = lead
        ? resolvedName
          ? `<b>${escapeHtml(resolvedName)}</b> (${escapeHtml(lead)})`
          : `<b>${escapeHtml(lead)}</b>`
        : "Аноним (прямая ссылка)";

      const prevProofUpdatedAt = existingCooldownMeta?.proof_updated_at
        ? new Date(existingCooldownMeta.proof_updated_at).getTime()
        : 0;
      const activeProofMessageId: number | null =
        existingCooldownMeta?.proof_message_id &&
        Date.now() - prevProofUpdatedAt < 15 * 60 * 1000
          ? Number(existingCooldownMeta.proof_message_id)
          : null;

      interface ProofHistoryItem {
        appId: string;
        brand: string;
        report: string;
        fileUrl: string;
        category: string;
        time: string;
        count: number;
      }

      let proofHistory: ProofHistoryItem[] =
        activeProofMessageId && Array.isArray(existingCooldownMeta?.proof_history)
          ? [...existingCooldownMeta.proof_history]
          : [];

      const nowHHMM = formatTimeHHMM(new Date());
      const existingIdx = proofHistory.findIndex((p) => p.appId === appId);

      if (existingIdx >= 0) {
        const existingItem = proofHistory[existingIdx];
        proofHistory[existingIdx] = {
          ...existingItem,
          fileUrl: proof.fileUrl,
          category: proof.category,
          time: nowHHMM,
          count: (existingItem.count || 1) + 1,
        };
      } else {
        proofHistory.push({
          appId,
          brand: proof.brand,
          report: proof.report,
          fileUrl: proof.fileUrl,
          category: proof.category,
          time: nowHHMM,
          count: 1,
        });
      }

      // Single clean device line (no triple repetition)
      const shortPrevDev = prevDevice ? getShortDeviceIconLabel(prevDevice) : "";
      const deviceLine = isSameCityScreenSwitch
        ? `📍 <b>Девайс:</b> ${escapeHtml(geo)} · ${escapeHtml(device)} <i>(перешел с ${escapeHtml(shortPrevDev)})</i>`
        : `📍 <b>Девайс:</b> ${escapeHtml(geo)} · ${escapeHtml(device)}`;

      const forwardingLine = isForwardedSuspect
        ? `🔥 <b>Возможно, переслал коллеге!</b> <i>(заявка была: ${escapeHtml(prevGeo || "—")} · ${escapeHtml(shortPrevDev || prevDevice || "—")})</i>`
        : null;

      // Summarize vertical interest when 2+ proofs opened
      let focusLine: string | null = null;
      if (proofHistory.length >= 2) {
        const catCounts: Record<string, number> = {};
        for (const item of proofHistory) {
          const cat = item.category || "General";
          catCounts[cat] = (catCounts[cat] || 0) + 1;
        }
        const summaryParts = Object.entries(catCounts).map(([c, n]) => `${c} (${n})`);
        focusLine = `🎯 <b>Фокус:</b> ${escapeHtml(summaryParts.join(" · "))}`;
      }

      const historyLines = proofHistory
        .map((item, idx) => {
          const isCurrent = item.appId === appId;
          const countTag = item.count > 1 ? ` <b>(×${item.count})</b>` : "";
          const currentTag = isCurrent && proofHistory.length > 1 ? ` 👈 <i>сейчас тут</i>` : "";
          const timePrefix = item.time ? `${escapeHtml(item.time)} — ` : "";
          const urlHref = item.fileUrl || proof.fileUrl;
          return `${idx + 1}. ${timePrefix}<a href="${escapeHtml(urlHref)}"><b>${escapeHtml(item.brand)}</b></a> · ${escapeHtml(item.report)}${countTag}${currentTag}`;
        })
        .join("\n");

      const headerTitle =
        proofHistory.length <= 1
          ? `🔎 <b>ОТКРЫТ ПРУФ ИЗ ПИСЬМА · 1 из 12</b>`
          : `🔎 <b>ИЗУЧАЕТ ПРУФЫ ИЗ ПИСЬМА · ${proofHistory.length} из 12</b>`;

      const tgText = [
        headerTitle,
        ``,
        `👤 <b>Лид:</b> ${leadLabel}`,
        deviceLine,
        forwardingLine,
        focusLine,
        ``,
        `📋 <b>Открытые скриншоты:</b>`,
        historyLines,
      ]
        .filter((line) => line !== null)
        .join("\n");

      let editedInPlace = false;
      let finalProofMessageId: number | null = activeProofMessageId;
      const leadCardMessageId: number | null = existingCooldownMeta?.lead_card_message_id
        ? Number(existingCooldownMeta.lead_card_message_id)
        : null;

      if (activeProofMessageId) {
        const editRes = await fetch(`https://api.telegram.org/bot${tgToken}/editMessageText`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            message_id: activeProofMessageId,
            text: tgText,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
        });
        const editJson: any = await editRes.json().catch(() => ({}));
        if (editRes.ok || String(editJson?.description || "").includes("message is not modified")) {
          editedInPlace = true;
        }
      }

      if (!editedInPlace) {
        const sendPayload: Record<string, any> = {
          chat_id: tgChatId,
          text: tgText,
          parse_mode: "HTML",
          disable_notification: false, // Loud push with vibration on 1st proof open!
          disable_web_page_preview: true,
        };

        // Reply directly to the lead's contact card in Telegram!
        if (leadCardMessageId) {
          sendPayload.reply_parameters = {
            message_id: leadCardMessageId,
            allow_sending_without_reply: true,
          };
        }

        const tgRes = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sendPayload),
        });
        const tgJson: any = await tgRes.json().catch(() => ({}));
        if (tgJson?.result?.message_id) {
          finalProofMessageId = Number(tgJson.result.message_id);
        }
      }

      if (supabase && finalProofMessageId && lead) {
        const updatedMeta = {
          ...existingCooldownMeta,
          ...(resolvedName ? { displayName: resolvedName } : {}),
          leadContact: lead,
          proof_message_id: finalProofMessageId,
          proof_updated_at: new Date().toISOString(),
          proof_history: proofHistory,
        };

        await supabase.from("lead_notification_cooldowns").upsert(
          {
            visitor_id: cooldownKey,
            last_notified_at: new Date().toISOString(),
            last_event_type: "proof_click",
            metadata: updatedMeta,
          },
          { onConflict: "visitor_id" }
        );
      }
    } catch (tgErr) {
      console.warn("Telegram alert error in proof tracking:", tgErr);
    }
  }

  // Log to Supabase if configured
  if (supabase) {
    try {
      await supabase.from("lead_activity_logs").insert([
        {
          visitor_id: lead || "email_click",
          lead_name: resolvedName || lead || null,
          lead_contact: lead || null,
          event_type: "proof_click",
          duration_seconds: 0,
          metadata: {
            appId,
            brand: proof.brand,
            report: proof.report,
            geo,
            device,
            isForwardedSuspect,
            prevGeo: prevGeo || null,
            prevDevice: prevDevice || null,
            userAgent: ua,
            ip: req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || null,
          },
        },
      ]);
    } catch {}
  }

  if (isTrackOnly) {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });
    return res.end(JSON.stringify({ ok: true }));
  }

  if (proof.isSnapshot && !isRawRedirect) {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });
    return res.end(renderSnapshotViewerHtml(appId, lead, false));
  }

  // 302 Redirect directly to the asset (.zip, .pdf, or ?raw=1)
  res.writeHead(302, {
    Location: proof.fileUrl,
    "Cache-Control": "no-cache, no-store, must-revalidate",
  });
  res.end();
}
