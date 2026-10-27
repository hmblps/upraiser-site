/**
 * UPRAISER Lead Activity & Engagement Telemetry Tracker
 * 
 * Non-blocking client-side tracker measuring real active engagement time,
 * 10s heartbeats, return visits, media deck reads, and vCard downloads.
 */

export interface HubSessionState {
  visitorId: string;
  clickId: string; // Equated to visitorId token or explicit URL parameter ?click_id / ?cid / ?token
  visitCount: number;
  firstVisitTime: number;
  lastVisitTime: number;
  lastActiveTime?: number;
  savedName?: string;
  savedContact?: string;
  firstTrafficSource?: string;
  currentTrafficSource?: string;
  isInApp?: boolean;
}

export const IDLE_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes threshold for distinct return visit

export type ActivityEventType =
  | "return_visit"
  | "deck_view"
  | "slide_view"
  | "deck_download"
  | "proof_click"
  | "contact_click"
  | "channel_click"
  | "lead_submit"
  | "page_scroll"
  | "vcf_download"
  | "heartbeat"
  | "session_end";

export interface ActivityBeaconPayload {
  visitorId: string;
  clickId?: string;
  leadName?: string;
  leadContact?: string;
  eventType: ActivityEventType;
  durationSeconds?: number;
  metadata?: Record<string, any>;
  sessionState?: string;
}

export const HUB_SESSION_KEY = "upraiser_hub_session_v1";
export const OWNER_STORAGE_KEY = "upraiser_owner_ignore";
export const OWNER_COOKIE_NAME = "upraiser_owner";

const KNOWN_OWNER_VISITOR_IDS = new Set([
  "hub_20261024_1818_qdzq",
  "hub_20261026_2200_tep8",
  "hub_20261026_2049_2zbv",
]);

export function setOwnerDeviceMode(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (enabled) {
      localStorage.setItem(OWNER_STORAGE_KEY, "1");
      document.cookie = `${OWNER_COOKIE_NAME}=1; path=/; max-age=315360000; SameSite=Lax`;
    } else {
      localStorage.removeItem(OWNER_STORAGE_KEY);
      document.cookie = `${OWNER_COOKIE_NAME}=0; path=/; max-age=0; SameSite=Lax`;
    }
  } catch {}
}

export function isOwnerEmailOrContact(contact?: string): boolean {
  if (!contact) return false;
  const clean = contact.trim().toLowerCase();
  return (
    clean.endsWith("@upraiser.co.uk") ||
    clean === "homeboylebz" ||
    clean === "@homeboylebz"
  );
}

export function checkAndSyncOwnerMode(session?: Partial<HubSessionState>): boolean {
  if (typeof window === "undefined") return false;
  try {
    const url = new URL(window.location.href);
    const ownerParam = url.searchParams.get("owner") || url.searchParams.get("me");
    if (ownerParam === "0") {
      setOwnerDeviceMode(false);
      url.searchParams.delete("owner");
      url.searchParams.delete("me");
      const cleanQuery = url.searchParams.toString();
      window.history.replaceState({}, "", url.pathname + (cleanQuery ? `?${cleanQuery}` : ""));
      return false;
    }
    if (ownerParam === "1" || url.searchParams.get("ignore") === "1") {
      setOwnerDeviceMode(true);
      url.searchParams.delete("owner");
      url.searchParams.delete("me");
      url.searchParams.delete("ignore");
      const cleanQuery = url.searchParams.toString();
      window.history.replaceState({}, "", url.pathname + (cleanQuery ? `?${cleanQuery}` : ""));
      return true;
    }

    const hasCookie = typeof document !== "undefined" && /(?:^|;\s*)upraiser_owner=1(?:;|$)/.test(document.cookie || "");
    const hasStorage = localStorage.getItem(OWNER_STORAGE_KEY) === "1";
    const isKnownOwnerSession =
      Boolean(session?.visitorId && KNOWN_OWNER_VISITOR_IDS.has(session.visitorId)) ||
      isOwnerEmailOrContact(session?.savedContact);

    if (hasCookie || hasStorage || isKnownOwnerSession) {
      // Ensure both cookie and localStorage stay synchronized for 10 years across all routes and /api/proof clicks
      setOwnerDeviceMode(true);
      return true;
    }
  } catch {}
  return false;
}

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

/**
 * Generate a human-readable timestamped visitor token:
 * Format: hub_YYYYMMDD_HHMM_xxxx (e.g. hub_20261024_1745_9a2f)
 * Embeds year, month, day, hour and minute directly into the ID
 * so operators instantly know when the lead scanned or first arrived.
 */
export function generateTimestampedVisitorId(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const salt = Math.random().toString(36).substring(2, 6);
  return `hub_${yyyy}${mm}${dd}_${hh}${min}_${salt}`;
}

export function getOrInitHubSession(): HubSessionState {
  if (typeof window === "undefined") {
    return {
      visitorId: "srv",
      clickId: "srv",
      visitCount: 1,
      firstVisitTime: Date.now(),
      lastVisitTime: Date.now(),
      firstTrafficSource: "Server",
      currentTrafficSource: "Server",
      isInApp: false,
    };
  }
  try {
    // Inspect URL for external click_id, clickid, cid, or token (ad campaign / conference badge)
    let urlClickId: string | undefined;
    try {
      const url = new URL(window.location.href);
      urlClickId =
        url.searchParams.get("click_id") ||
        url.searchParams.get("clickid") ||
        url.searchParams.get("cid") ||
        url.searchParams.get("token") ||
        undefined;
    } catch {}

    // Check if operator or tester requested a fresh session via ?reset=1 or ?fresh=1
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get("reset") === "1" || url.searchParams.get("fresh") === "1") {
        localStorage.removeItem(HUB_SESSION_KEY);
        url.searchParams.delete("reset");
        url.searchParams.delete("fresh");
        const cleanQuery = url.searchParams.toString();
        window.history.replaceState({}, "", url.pathname + (cleanQuery ? `?${cleanQuery}` : ""));
      }
    } catch {}

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
      if (!parsed.lastActiveTime) {
        parsed.lastActiveTime = parsed.lastVisitTime || now;
      }

      // If visitorId is missing or corrupt, generate a readable timestamped ID
      if (!parsed.visitorId || !parsed.visitorId.startsWith("hub_") || parsed.visitorId === "hub_local") {
        parsed.visitorId = generateTimestampedVisitorId(new Date(parsed.firstVisitTime || now));
      }

      // Equate token to click_id (or capture explicit click_id from campaign URL)
      if (urlClickId) {
        parsed.clickId = urlClickId;
      } else if (!parsed.clickId) {
        parsed.clickId = parsed.visitorId;
      }

      localStorage.setItem(HUB_SESSION_KEY, JSON.stringify(parsed));
      checkAndSyncOwnerMode(parsed);
      return parsed;
    }

    const genToken = generateTimestampedVisitorId(new Date(now));
    const activeClickId = urlClickId || genToken;

    const newSession: HubSessionState = {
      visitorId: genToken,
      clickId: activeClickId,
      visitCount: 1,
      firstVisitTime: now,
      lastVisitTime: now,
      lastActiveTime: now,
      firstTrafficSource: detected.source,
      currentTrafficSource: detected.source,
      isInApp: detected.isInApp,
    };
    localStorage.setItem(HUB_SESSION_KEY, JSON.stringify(newSession));
    checkAndSyncOwnerMode(newSession);
    return newSession;
  } catch {
    const fallbackDetected = detectSmartTrafficSource();
    const fallbackToken = generateTimestampedVisitorId();
    return {
      visitorId: fallbackToken,
      clickId: fallbackToken,
      visitCount: 1,
      firstVisitTime: Date.now(),
      lastVisitTime: Date.now(),
      lastActiveTime: Date.now(),
      firstTrafficSource: fallbackDetected.source,
      currentTrafficSource: fallbackDetected.source,
      isInApp: fallbackDetected.isInApp,
    };
  }
}

/**
 * Persist timestamp of latest user activity (click, scroll, keystroke)
 */
export function recordSessionActivity(timestamp: number = Date.now()): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(HUB_SESSION_KEY);
    if (raw) {
      const parsed: HubSessionState = JSON.parse(raw);
      parsed.lastActiveTime = timestamp;
      localStorage.setItem(HUB_SESSION_KEY, JSON.stringify(parsed));
    }
  } catch {}
}

/**
 * Increment visit count on verified interactive return visit (after >= 30 min idle)
 */
export function incrementSessionVisit(timestamp: number = Date.now()): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = localStorage.getItem(HUB_SESSION_KEY);
    if (raw) {
      const parsed: HubSessionState = JSON.parse(raw);
      parsed.visitCount = (parsed.visitCount || 1) + 1;
      parsed.lastVisitTime = timestamp;
      parsed.lastActiveTime = timestamp;
      localStorage.setItem(HUB_SESSION_KEY, JSON.stringify(parsed));
      return parsed.visitCount;
    }
  } catch {}
  return 1;
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
      checkAndSyncOwnerMode(parsed);
    }
  } catch {}
}

/**
 * Dispatch beacon safely without blocking the main rendering loop
 */
export function sendActivityBeacon(payload: ActivityBeaconPayload) {
  if (typeof window === "undefined") return;

  const session = getOrInitHubSession();
  // Suppress all telemetry beacons from Alex's own devices (Mac / iPhone, anywhere in the world)
  if (
    checkAndSyncOwnerMode(session) ||
    isOwnerEmailOrContact(payload.leadContact)
  ) {
    setOwnerDeviceMode(true);
    return;
  }
  const effectiveClickId = payload.clickId || session.clickId || payload.visitorId;
  const enrichedPayload: ActivityBeaconPayload = {
    ...payload,
    clickId: effectiveClickId,
    metadata: {
      click_id: effectiveClickId,
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
 * Supports explicit name & contact overrides for immediate identity stitching
 */
export function trackLeadAction(
  eventType: ActivityEventType,
  durationSeconds = 0,
  metadata: Record<string, any> = {},
  overrideName?: string,
  overrideContact?: string
) {
  const session = getOrInitHubSession();

  // If explicit identity is provided, ensure session in localStorage is synchronized immediately
  if (overrideName && (!session.savedName || session.savedName !== overrideName)) {
    updateHubContact(overrideName, overrideContact || session.savedContact || "");
  }

  const resolvedName = overrideName || session.savedName;
  const resolvedContact = overrideContact || session.savedContact;

  sendActivityBeacon({
    visitorId: session.visitorId,
    clickId: session.clickId || session.visitorId,
    leadName: resolvedName,
    leadContact: resolvedContact,
    eventType,
    durationSeconds,
    sessionState: session.visitCount > 1 ? `Repeat Visit #${session.visitCount}` : "First Visit",
    metadata: {
      url: typeof window !== "undefined" ? window.location.pathname : "",
      visitCount: session.visitCount,
      click_id: session.clickId || session.visitorId,
      traffic_source: session.currentTrafficSource || session.firstTrafficSource || "Direct / Clean Entry",
      first_traffic_source: session.firstTrafficSource || "Direct / Clean Entry",
      is_in_app: Boolean(session.isInApp),
      raw_referrer: typeof document !== "undefined" ? document.referrer || "" : "",
      ...metadata,
    },
  });
}
