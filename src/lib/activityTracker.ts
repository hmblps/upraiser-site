/**
 * UPRAISER Lead Activity & Engagement Telemetry Tracker
 * 
 * Non-blocking client-side tracker measuring real active engagement time,
 * 10s heartbeats, return visits, media deck reads, and vCard downloads.
 */

export interface HubSessionState {
  visitorId: string;
  visitCount: number;
  firstVisitTime: number;
  lastVisitTime: number;
  savedName?: string;
  savedContact?: string;
  firstTrafficSource?: string;
  currentTrafficSource?: string;
  isInApp?: boolean;
}

export type ActivityEventType =
  | "return_visit"
  | "deck_view"
  | "page_scroll"
  | "vcf_download"
  | "heartbeat"
  | "session_end";

export interface ActivityBeaconPayload {
  visitorId: string;
  leadName?: string;
  leadContact?: string;
  eventType: ActivityEventType;
  durationSeconds?: number;
  metadata?: Record<string, any>;
  sessionState?: string;
}

export const HUB_SESSION_KEY = "upraiser_hub_session_v1";

export interface SmartTrafficSource {
  source: string;
  category: "social" | "messenger" | "search" | "external" | "direct";
  rawReferrer: string;
  isInApp: boolean;
}

/**
 * Smart Referrer & In-App Browser Detector
 * Detects origin channels (LinkedIn, Telegram, WhatsApp, Teams, X, Google)
 * even on clean URLs without UTM tags.
 */
export function detectSmartTrafficSource(): SmartTrafficSource {
  if (typeof window === "undefined") {
    return {
      source: "Direct / Clean URL",
      category: "direct",
      rawReferrer: "",
      isInApp: false,
    };
  }

  const referrer = typeof document !== "undefined" ? document.referrer || "" : "";
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  const uaLower = ua.toLowerCase();

  // 1. Auxiliary UTM check (if user arrived via link with parameters)
  try {
    const url = new URL(window.location.href);
    const utmSource = url.searchParams.get("utm_source") || url.searchParams.get("ref");
    const utmMedium = url.searchParams.get("utm_medium");
    if (utmSource) {
      return {
        source: `Campaign: ${utmSource}${utmMedium ? ` / ${utmMedium}` : ""}`,
        category: "external",
        rawReferrer: referrer,
        isInApp: false,
      };
    }
  } catch {}

  // 2. Document Referrer Inspection (External Domain Detection)
  if (referrer) {
    try {
      const refUrl = new URL(referrer);
      const host = refUrl.hostname.toLowerCase();
      const currentHost = window.location.hostname.toLowerCase();

      // Skip self-referrals within upraiser.co.uk
      if (host !== currentHost && !host.endsWith("upraiser.co.uk")) {
        if (host.includes("linkedin.com") || host.includes("lnkd.in")) {
          return {
            source: "LinkedIn (Referrer)",
            category: "social",
            rawReferrer: referrer,
            isInApp: host.includes("mobile") || host.includes("touch"),
          };
        }
        if (host.includes("t.me") || host.includes("telegram.org")) {
          return {
            source: "Telegram (Web Referrer)",
            category: "messenger",
            rawReferrer: referrer,
            isInApp: true,
          };
        }
        if (host.includes("whatsapp.com") || host.includes("wa.me")) {
          return {
            source: "WhatsApp (Web Referrer)",
            category: "messenger",
            rawReferrer: referrer,
            isInApp: true,
          };
        }
        if (host.includes("twitter.com") || host.includes("x.com") || host.includes("t.co")) {
          return {
            source: "X / Twitter (Referrer)",
            category: "social",
            rawReferrer: referrer,
            isInApp: false,
          };
        }
        if (host.includes("facebook.com") || host.includes("fb.com") || host.includes("instagram.com")) {
          return {
            source: host.includes("instagram") ? "Instagram (Referrer)" : "Facebook (Referrer)",
            category: "social",
            rawReferrer: referrer,
            isInApp: false,
          };
        }
        if (host.includes("google.")) {
          return {
            source: "Google Search (Organic)",
            category: "search",
            rawReferrer: referrer,
            isInApp: false,
          };
        }
        if (host.includes("bing.") || host.includes("yahoo.")) {
          return {
            source: host.includes("bing") ? "Bing Search" : "Yahoo Search",
            category: "search",
            rawReferrer: referrer,
            isInApp: false,
          };
        }
        if (host.includes("teams.microsoft.com")) {
          return {
            source: "MS Teams (Referrer)",
            category: "messenger",
            rawReferrer: referrer,
            isInApp: true,
          };
        }
        if (host.includes("slack.com")) {
          return {
            source: "Slack (Referrer)",
            category: "messenger",
            rawReferrer: referrer,
            isInApp: true,
          };
        }
        if (host.includes("reddit.com")) {
          return {
            source: "Reddit (Referrer)",
            category: "social",
            rawReferrer: referrer,
            isInApp: false,
          };
        }
        return {
          source: `External Web: ${host.replace(/^www\./, "")}`,
          category: "external",
          rawReferrer: referrer,
          isInApp: false,
        };
      }
    } catch {}
  }

  // 3. User-Agent In-App & Messenger Analysis (for clean links shared in chats)
  // Messengers typically strip document.referrer, but leave recognizable UA strings
  if (
    ua.includes("Telegram") ||
    uaLower.includes("telegrambot") ||
    uaLower.includes("telegram-ios") ||
    uaLower.includes("telegramandroid")
  ) {
    return {
      source: "Telegram (In-App Browser)",
      category: "messenger",
      rawReferrer: "",
      isInApp: true,
    };
  }

  if (ua.includes("WhatsApp") || uaLower.includes("whatsapp")) {
    return {
      source: "WhatsApp (In-App Browser)",
      category: "messenger",
      rawReferrer: "",
      isInApp: true,
    };
  }

  if (ua.includes("LinkedInApp") || uaLower.includes("linkedin")) {
    return {
      source: "LinkedIn (In-App Browser)",
      category: "social",
      rawReferrer: "",
      isInApp: true,
    };
  }

  if (ua.includes("Teams") || uaLower.includes("msteams")) {
    return {
      source: "MS Teams (In-App Browser)",
      category: "messenger",
      rawReferrer: "",
      isInApp: true,
    };
  }

  if (ua.includes("Twitter") || uaLower.includes("twitterandroid")) {
    return {
      source: "X / Twitter (In-App Browser)",
      category: "social",
      rawReferrer: "",
      isInApp: true,
    };
  }

  if (ua.includes("FBAN") || ua.includes("FBAV") || ua.includes("Instagram")) {
    return {
      source: ua.includes("Instagram") ? "Instagram (In-App Browser)" : "Facebook (In-App Browser)",
      category: "social",
      rawReferrer: "",
      isInApp: true,
    };
  }

  if (ua.includes("Slack") || uaLower.includes("slack")) {
    return {
      source: "Slack (In-App Browser)",
      category: "messenger",
      rawReferrer: "",
      isInApp: true,
    };
  }

  // Generic Mobile In-App WebView Detection
  const isIos = /iPhone|iPod|iPad/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  if (isIos) {
    const isIosWebView =
      !/(CriOS|FxiOS|EdgiOS)/.test(ua) &&
      !/Version\/.*Safari/.test(ua) &&
      /AppleWebKit/.test(ua);
    if (isIosWebView) {
      return {
        source: "iOS In-App WebView (Chat/Mail)",
        category: "messenger",
        rawReferrer: "",
        isInApp: true,
      };
    }
  }

  if (isAndroid) {
    const isAndroidWebView =
      /\bwv\b/.test(ua) || /Version\/[0-9.]+.*Chrome/.test(ua);
    if (isAndroidWebView) {
      return {
        source: "Android In-App WebView (Chat/Mail)",
        category: "messenger",
        rawReferrer: "",
        isInApp: true,
      };
    }
  }

  // 4. Standard Mobile / Desktop Browsers (Clean Entry)
  if (isIos && /Safari/.test(ua)) {
    return {
      source: "Direct / Mobile Safari",
      category: "direct",
      rawReferrer: "",
      isInApp: false,
    };
  }

  if (isAndroid) {
    if (/SamsungBrowser/i.test(ua)) {
      return {
        source: "Direct / Samsung Internet",
        category: "direct",
        rawReferrer: "",
        isInApp: false,
      };
    }
    return {
      source: "Direct / Mobile Chrome",
      category: "direct",
      rawReferrer: "",
      isInApp: false,
    };
  }

  return {
    source: "Direct / Clean URL Entry",
    category: "direct",
    rawReferrer: "",
    isInApp: false,
  };
}

export function getOrInitHubSession(): HubSessionState {
  if (typeof window === "undefined") {
    return {
      visitorId: "srv",
      visitCount: 1,
      firstVisitTime: Date.now(),
      lastVisitTime: Date.now(),
      firstTrafficSource: "Server",
      currentTrafficSource: "Server",
      isInApp: false,
    };
  }
  try {
    const raw = localStorage.getItem(HUB_SESSION_KEY);
    const now = Date.now();
    const detected = detectSmartTrafficSource();

    if (raw) {
      const parsed: HubSessionState = JSON.parse(raw);

      // Backfill first traffic source if missing from previous version
      if (!parsed.firstTrafficSource) {
        parsed.firstTrafficSource = detected.source;
      }
      parsed.currentTrafficSource = detected.source;
      parsed.isInApp = detected.isInApp;

      // Count a new distinct visit session if at least 90 seconds elapsed since last activity
      if (now - (parsed.lastVisitTime || 0) > 90 * 1000) {
        parsed.visitCount = (parsed.visitCount || 1) + 1;
        parsed.lastVisitTime = now;
      }
      localStorage.setItem(HUB_SESSION_KEY, JSON.stringify(parsed));
      return parsed;
    }

    const newSession: HubSessionState = {
      visitorId: "hub_" + Math.random().toString(36).substring(2, 9),
      visitCount: 1,
      firstVisitTime: now,
      lastVisitTime: now,
      firstTrafficSource: detected.source,
      currentTrafficSource: detected.source,
      isInApp: detected.isInApp,
    };
    localStorage.setItem(HUB_SESSION_KEY, JSON.stringify(newSession));
    return newSession;
  } catch {
    const fallbackDetected = detectSmartTrafficSource();
    return {
      visitorId: "hub_local",
      visitCount: 1,
      firstVisitTime: Date.now(),
      lastVisitTime: Date.now(),
      firstTrafficSource: fallbackDetected.source,
      currentTrafficSource: fallbackDetected.source,
      isInApp: fallbackDetected.isInApp,
    };
  }
}

export function updateHubContact(name: string, contact: string) {
  try {
    const raw = localStorage.getItem(HUB_SESSION_KEY);
    if (raw) {
      const parsed: HubSessionState = JSON.parse(raw);
      parsed.savedName = name;
      parsed.savedContact = contact;
      parsed.lastVisitTime = Date.now();
      localStorage.setItem(HUB_SESSION_KEY, JSON.stringify(parsed));
    }
  } catch {}
}

/**
 * Dispatch beacon safely without blocking the main rendering loop
 */
export function sendActivityBeacon(payload: ActivityBeaconPayload) {
  if (typeof window === "undefined") return;

  const session = getOrInitHubSession();
  const enrichedPayload: ActivityBeaconPayload = {
    ...payload,
    metadata: {
      traffic_source: session.currentTrafficSource || session.firstTrafficSource || "Direct / Clean Entry",
      first_traffic_source: session.firstTrafficSource || "Direct / Clean Entry",
      is_in_app: Boolean(session.isInApp),
      raw_referrer: typeof document !== "undefined" ? document.referrer || "" : "",
      ...payload.metadata,
    },
  };

  const body = JSON.stringify(enrichedPayload);

  // 1. Try navigator.sendBeacon (preferred for unload/background resilience)
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([body], { type: "application/json" });
      const queued = navigator.sendBeacon("/api/activity", blob);
      if (queued) return;
    } catch {}
  }

  // 2. Fetch with keepalive fallback
  if (typeof fetch !== "undefined") {
    try {
      fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body,
      }).catch(() => {});
    } catch {}
  }
}

/**
 * Manual helper to track high-value actions (vCard download, deck open)
 */
export function trackLeadAction(eventType: ActivityEventType, durationSeconds = 0, metadata: Record<string, any> = {}) {
  const session = getOrInitHubSession();
  sendActivityBeacon({
    visitorId: session.visitorId,
    leadName: session.savedName,
    leadContact: session.savedContact,
    eventType,
    durationSeconds,
    sessionState: session.visitCount > 1 ? `Repeat Visit #${session.visitCount}` : "First Visit",
    metadata: {
      url: typeof window !== "undefined" ? window.location.pathname : "",
      visitCount: session.visitCount,
      traffic_source: session.currentTrafficSource || session.firstTrafficSource || "Direct / Clean Entry",
      first_traffic_source: session.firstTrafficSource || "Direct / Clean Entry",
      is_in_app: Boolean(session.isInApp),
      raw_referrer: typeof document !== "undefined" ? document.referrer || "" : "",
      ...metadata,
    },
  });
}
