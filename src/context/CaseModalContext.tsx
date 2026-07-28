import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCaseById, type CaseStudy } from "../data/cases";

const CaseDetailModal = lazy(() =>
  import("../components/CaseDetailModal").then((m) => ({ default: m.CaseDetailModal })),
);

type CaseModalContextValue = {
  openCase: (id: string) => void;
  closeCase: () => void;
  activeId: string | null;
};

const CaseModalContext = createContext<CaseModalContextValue | null>(null);

function isCasesRoute(pathname: string) {
  return pathname === "/cases" || pathname.startsWith("/cases/");
}

export function CaseModalProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panelItem, setPanelItem] = useState<CaseStudy | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const item: CaseStudy | null = activeId ? (getCaseById(activeId) ?? null) : null;

  useEffect(() => {
    if (item) setPanelItem(item);
  }, [item]);

  const openCase = useCallback(
    (id: string) => {
      if (!getCaseById(id)) return;
      setActiveId(id);
      // Shareable URL only while browsing the cases archive.
      if (isCasesRoute(pathname) && pathname !== `/cases/${id}`) {
        navigate(`/cases/${id}`, { replace: true });
      }
    },
    [navigate, pathname],
  );

  const closeCase = useCallback(() => {
    setActiveId(null);
    if (pathname.startsWith("/cases/") && pathname !== "/cases") {
      navigate("/cases", { replace: true });
    }
  }, [navigate, pathname]);

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
