import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCaseById, caseStudies, type CaseStudy } from "../data/cases";

const CaseDetailModal = lazy(() =>
  import("../components/CaseDetailModal").then((m) => ({ default: m.CaseDetailModal })),
);

type CaseModalContextValue = {
  openCase: (id: string) => void;
  closeCase: () => void;
  activeId: string | null;
};

const CaseModalContext = createContext<CaseModalContextValue | null>(null);

function caseIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/cases\/([^/]+)\/?$/);
  return match?.[1] ?? null;
}

export function CaseModalProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(() =>
    typeof window !== "undefined" ? caseIdFromPath(window.location.pathname) : null,
  );
  const [panelItem, setPanelItem] = useState<CaseStudy | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const openingRef = useRef<string | null>(null);
  const item: CaseStudy | null = activeId ? (getCaseById(activeId) ?? null) : null;

  // Keep modal in sync with deep links / back-forward, without clobbering an in-flight open.
  useEffect(() => {
    const fromUrl = caseIdFromPath(pathname);
    if (fromUrl && getCaseById(fromUrl)) {
      openingRef.current = null;
      setActiveId(fromUrl);
      return;
    }

    if (openingRef.current) return;

    if (pathname === "/cases" || pathname === "/cases/" || !pathname.startsWith("/cases")) {
      setActiveId(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (item) setPanelItem(item);
  }, [item]);

  const openCase = useCallback(
    (id: string) => {
      if (!getCaseById(id)) return;
      openingRef.current = id;
      setActiveId(id);
      if (pathname !== `/cases/${id}`) {
        navigate(`/cases/${id}`, { replace: pathname.startsWith("/cases") });
      } else {
        openingRef.current = null;
      }
    },
    [navigate, pathname],
  );

  const closeCase = useCallback(() => {
    openingRef.current = null;
    setActiveId(null);
    if (caseIdFromPath(pathname)) {
      // Use native history.replaceState instead of navigate() so ScrollToTop
      // is NOT triggered — the user stays exactly where they scrolled.
      window.history.replaceState(null, "", "/");
    }
  }, [pathname]);

  const navigateCase = useCallback(
    (direction: -1 | 1) => {
      if (!item) return;
      const idx = caseStudies.findIndex((c) => c.id === item.id);
      if (idx === -1) return;
      const nextIdx = (idx + direction + caseStudies.length) % caseStudies.length;
      openCase(caseStudies[nextIdx].id);
    },
    [item, openCase],
  );

  const value = useMemo(
    () => ({ openCase, closeCase, activeId }),
    [openCase, closeCase, activeId],
  );

  return (
    <CaseModalContext.Provider value={value}>
      {children}
      {panelItem ? (
        <Suspense fallback={null}>
          <CaseDetailModal
            item={panelItem}
            open={Boolean(item)}
            onClose={closeCase}
            onNavigate={navigateCase}
            onExitComplete={() => setPanelItem(null)}
          />
        </Suspense>
      ) : null}
    </CaseModalContext.Provider>
  );
}

export function useCaseModal() {
  const ctx = useContext(CaseModalContext);
  if (!ctx) throw new Error("useCaseModal must be used within CaseModalProvider");
  return ctx;
}
