import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getCaseById } from "../data/cases";
import { useCaseModal } from "../context/CaseModalContext";

/**
 * Deep link `/cases/:slug` — opens the shared modal and keeps the slug in the URL
 * until the visitor closes the brief.
 */
export function CaseDetailPage() {
  const { slug = "" } = useParams();
  const { openCase, activeId } = useCaseModal();
  const item = getCaseById(slug);

  useEffect(() => {
    if (!item) return;
    openCase(item.id);
  }, [item, openCase]);

  if (!item && !activeId) return <Navigate to="/cases" replace />;

  return null;
}
