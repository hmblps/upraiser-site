import { useEffect, useRef, useCallback } from "react";
import {
  getOrInitHubSession,
  sendActivityBeacon,
  trackLeadAction,
  type ActivityEventType,
} from "../lib/activityTracker";

const HEARTBEAT_INTERVAL_MS = 10 * 1000; // 10s ping

export function useActivityTracker(
  pageContext: string = "connect",
  getExtraMetadata?: () => Record<string, any>
) {
  const activeSecondsRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const lastTickTimeRef = useRef<number>(Date.now());
  const maxScrollDepthRef = useRef<number>(0);
  const scrollMilestonesHitRef = useRef<Set<number>>(new Set());
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

    // 1. If returning visitor, fire immediate return_visit signal
    if (session.visitCount > 1) {
      sendActivityBeacon({
        visitorId: session.visitorId,
        leadName: session.savedName,
        leadContact: session.savedContact,
        eventType: "return_visit",
        durationSeconds: 0,
        sessionState: `Repeat Visit #${session.visitCount}`,
        metadata: {
          page: pageContext,
          visitCount: session.visitCount,
          firstSeen: session.firstVisitTime,
        },
      });
    }

    // 2. Active duration ticker (runs every second, only accumulates when tab is visible)
    const ticker = setInterval(() => {
      const now = Date.now();
      const deltaSec = Math.round((now - lastTickTimeRef.current) / 1000);
      lastTickTimeRef.current = now;

      if (isVisibleRef.current && deltaSec > 0 && deltaSec < 5) {
        activeSecondsRef.current += deltaSec;
      }
    }, 1000);

    // 3. Periodic 10-second heartbeat beacon
    const heartbeatTimer = setInterval(() => {
      if (isVisibleRef.current) {
        flushHeartbeat("heartbeat");
      }
    }, HEARTBEAT_INTERVAL_MS);

    // 4. Scroll depth tracker
    const handleScroll = () => {
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

    // 5. Visibility change handler (pauses/resumes active time and flushes when hiding)
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === "visible";
      isVisibleRef.current = visible;
      lastTickTimeRef.current = Date.now();

      if (!visible) {
        flushHeartbeat("session_end");
      }
    };

    const handleBeforeUnload = () => {
      flushHeartbeat("session_end");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(ticker);
      clearInterval(heartbeatTimer);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      flushHeartbeat("session_end");
    };
  }, [pageContext, flushHeartbeat, getSession]);

  return {
    trackAction: trackLeadAction,
    getActiveSeconds: () => activeSecondsRef.current,
  };
}
