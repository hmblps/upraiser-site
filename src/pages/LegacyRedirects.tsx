import { Navigate, useSearchParams } from "react-router-dom";

/** Preserve query when legacy /solutions URLs land on /expertise. */
export function RedirectSolutionsToExpertise() {
  const [params] = useSearchParams();
  const next = new URLSearchParams(params);
  const pillar = next.get("pillar");
  if (pillar === "performance" || pillar === "creators" || pillar === "premium") {
    next.set("pillar", "media");
  } else if (pillar === "oem") {
    next.set("pillar", "oem");
  }
  const qs = next.toString();
  return <Navigate to={qs ? `/expertise?${qs}` : "/expertise"} replace />;
}

export function RedirectMeasurementToExpertise() {
  return <Navigate to="/clarity" replace />;
}
