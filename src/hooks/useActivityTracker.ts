import { useEffect, useRef, useCallback } from "react";
import {
  getOrInitHubSession,
  sendActivityBeacon,
  trackLeadAction,
  recordSessionActivity,
  incrementSessionVisit,
  IDLE_THRESHOLD_MS,
  type ActivityEventType,
} from "../lib/activityTracker";

const HEARTBEAT_INTERVAL_MS = 10 * 1000; // 10s ping
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 min idle pauses duration ticker

export function useActivityTracker(
  pageContext: string = "connect",
  getExtraMetadata?: () => Record<string, any>
) {
  const activeSecondsRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const lastTickTimeRef = useRef<number>(Date.now());
  const lastUserActionTimeRef = useRef<number>(Date.now());
  const maxScrollDepthRef = useRef<number>(0);
  const scrollMilestonesHitRef = useRef<Set<number>>(new Set());
  const pendingReturnVisitRef = useRef<boolean>(false);
  const returnVisitFiredRef = useRef<boolean>(false);
  const initialIdleMsRef = useRef<number>(0);
  const extraMetaRef = useRef(getExtraMetadata);
  extraMetaRef.current = getExtraMetadata;

  const getSession = useCallback(() => {
    return getOrInitHubSession();
  }, []);

  const flushHeartbeat = useCallback(
    (eventType: ActivityEventType = "heartbeat") => {
      const session = getSession();
      sendActivityBeacon({
        visitorId: session.visitorId,
        clickId: session.clickId || session.visitorId,
        leadName: session.savedName,
        leadContact: session.savedContact,
        eventType,
        durationSeconds: activeSecondsRef.current,
        sessionState: session.visitCount > 1 ? `Repeat Visit #${session.visitCount}` : "First Visit",
        metadata: {
          page: pageContext,
          url: typeof window !== "undefined" ? window.location.pathname : "",
          visitCount: session.visitCount,
          maxScrollDepth: maxScrollDepthRef.current,
          ...(extraMetaRef.current ? extraMetaRef.current() : {}),
        },
      });
    },
    [pageContext, getSession]
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const session = getSession();
    const now = Date.now();
    const lastActive = session.lastActiveTime || session.lastVisitTime || session.firstVisitTime;
    const idleDuration = now - lastActive;
    initialIdleMsRef.current = idleDuration;

    // 1. Double Condition for Return Visit:
    // If the visitor was tracked before and has been idle for >= 30 minutes,
    // arm the Interaction Gate. Do NOT fire return_visit immediately!
    if (session.visitCount >= 1 && idleDuration >= IDLE_THRESHOLD_MS) {
      pendingReturnVisitRef.current = true;
      returnVisitFiredRef.current = false;
    } else {
      pendingReturnVisitRef.current = false;
      returnVisitFiredRef.current = false;
    }

    // 2. Interaction Gate Handler:
    // Only fires return_visit when the user performs a real action (click, scroll, mousemove, touch, keydown)
    // while the tab is actively visible.
    let lastStorageSync = now;
    const handleUserInteraction = (event: Event) => {
      const currentNow = Date.now();
      lastUserActionTimeRef.current = currentNow;

      // Throttle localStorage updates to once every 10 seconds
      if (currentNow - lastStorageSync > 10 * 1000) {
        lastStorageSync = currentNow;
        recordSessionActivity(currentNow);
      }

      // Check double condition gate
      if (
        pendingReturnVisitRef.current &&
        !returnVisitFiredRef.current &&
        document.visibilityState === "visible"
      ) {
        pendingReturnVisitRef.current = false;
        returnVisitFiredRef.current = true;

        const updatedCount = incrementSessionVisit(currentNow);
        const currentSession = getSession();

        sendActivityBeacon({
          visitorId: currentSession.visitorId,
          clickId: currentSession.clickId || currentSession.visitorId,
          leadName: currentSession.savedName,
          leadContact: currentSession.savedContact,
          eventType: "return_visit",
          durationSeconds: activeSecondsRef.current,
          sessionState: `Repeat Visit #${updatedCount}`,
          metadata: {
            page: pageContext,
            visitCount: updatedCount,
            idleMinutes: Math.round(initialIdleMsRef.current / 60000),
            triggerAction: event.type,
            firstSeen: currentSession.firstVisitTime,
            trafficSource: currentSession.currentTrafficSource,
            url: window.location.pathname,
            ...(extraMetaRef.current ? extraMetaRef.current() : {}),
          },
        });
      }
    };

    // 3. Active duration ticker (runs every second, only accumulates when tab is visible AND active)
    const ticker = setInterval(() => {
      const currentNow = Date.now();
      const deltaSec = Math.round((currentNow - lastTickTimeRef.current) / 1000);
      lastTickTimeRef.current = currentNow;

      const isUserEngaged = currentNow - lastUserActionTimeRef.current <= INACTIVITY_TIMEOUT_MS;

      if (isVisibleRef.current && isUserEngaged && deltaSec > 0 && deltaSec < 5) {
        activeSecondsRef.current += deltaSec;
      }
    }, 1000);

    // 4. Periodic 10-second heartbeat beacon (only sent if actively visible and engaged)
    const heartbeatTimer = setInterval(() => {
      const currentNow = Date.now();
      const isUserEngaged = currentNow - lastUserActionTimeRef.current <= INACTIVITY_TIMEOUT_MS;

      if (isVisibleRef.current && isUserEngaged) {
        flushHeartbeat("heartbeat");
      }
    }, HEARTBEAT_INTERVAL_MS);

    // 5. Scroll depth tracker
    const handleScroll = (event: Event) => {
      handleUserInteraction(event);

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const depth = Math.min(100, Math.round((scrollTop / scrollHeight) * 100));
        if (depth > maxScrollDepthRef.current) {
          maxScrollDepthRef.current = depth;
        }

        // Milestone alerts for 50% and 85% scroll depth
        for (const milestone of [50, 85]) {
          if (depth >= milestone && !scrollMilestonesHitRef.current.has(milestone)) {
            scrollMilestonesHitRef.current.add(milestone);
            sendActivityBeacon({
              visitorId: session.visitorId,
              clickId: session.clickId || session.visitorId,
              leadName: session.savedName,
              leadContact: session.savedContact,
              eventType: "page_scroll",
              durationSeconds: activeSecondsRef.current,
              sessionState: session.visitCount > 1 ? `Repeat Visit #${session.visitCount}` : "First Visit",
              metadata: {
                page: pageContext,
                scrollDepth: milestone,
              },
            });
          }
        }
      }
    };

    // 6. Visibility change handler (pauses/resumes active time and flushes when hiding)
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === "visible";
      isVisibleRef.current = visible;
      lastTickTimeRef.current = Date.now();

      if (!visible) {
        recordSessionActivity(Date.now());
        flushHeartbeat("session_end");
      } else {
        // Tab restored to foreground: if idle in background for >= 30 min, re-arm Interaction Gate
        const backgroundIdleMs = Date.now() - lastUserActionTimeRef.current;
        if (backgroundIdleMs >= IDLE_THRESHOLD_MS) {
          pendingReturnVisitRef.current = true;
          returnVisitFiredRef.current = false;
          initialIdleMsRef.current = backgroundIdleMs;
        }
      }
    };

    const handleBeforeUnload = () => {
      recordSessionActivity(Date.now());
      flushHeartbeat("session_end");
    };

    // Attach interaction listeners to window (passive for 60fps scrolling & touches)
    const interactionEvents = ["click", "mousemove", "touchstart", "keydown"] as const;
    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserInteraction, { passive: true });
    });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(ticker);
      clearInterval(heartbeatTimer);
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserInteraction);
      });
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      recordSessionActivity(Date.now());
      flushHeartbeat("session_end");
    };
  }, [pageContext, flushHeartbeat, getSession]);

  return {
    trackAction: trackLeadAction,
    getActiveSeconds: () => activeSecondsRef.current,
  };
}
