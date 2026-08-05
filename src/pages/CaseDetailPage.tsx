import { Navigate, useParams } from "react-router-dom";
import { getCaseById } from "../data/cases";

/**
 * Deep link `/cases/:slug` — CaseModalProvider syncs the modal from the URL.
 * This route keeps the archive mounted via the parent Outlet.
 */
export function CaseDetailPage() {
  const { slug = "" } = useParams();
  const item = getCaseById(slug);

  if (!item) return <Navigate to="/cases" replace />;

  return null;
}
