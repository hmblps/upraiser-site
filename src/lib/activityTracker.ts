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

export function getOrInitHubSession(): HubSessionState {
  if (typeof window === "undefined") {
    return { visitorId: "srv", visitCount: 1, firstVisitTime: Date.now(), lastVisitTime: Date.now() };
  }
  try {
    const raw = localStorage.getItem(HUB_SESSION_KEY);
    const now = Date.now();
    if (raw) {
      const parsed: HubSessionState = JSON.parse(raw);
      // Count a new distinct visit session if at least 90 seconds elapsed since last recorded activity
      if (now - (parsed.lastVisitTime || 0) > 90 * 1000) {
        parsed.visitCount = (parsed.visitCount || 1) + 1;
        parsed.lastVisitTime = now;
        localStorage.setItem(HUB_SESSION_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
    const newSession: HubSessionState = {
      visitorId: "hub_" + Math.random().toString(36).substring(2, 9),
      visitCount: 1,
      firstVisitTime: now,
      lastVisitTime: now,
    };
    localStorage.setItem(HUB_SESSION_KEY, JSON.stringify(newSession));
    return newSession;
  } catch {
    return { visitorId: "hub_local", visitCount: 1, firstVisitTime: Date.now(), lastVisitTime: Date.now() };
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

  const body = JSON.stringify(payload);

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
      ...metadata,
    },
  });
}
