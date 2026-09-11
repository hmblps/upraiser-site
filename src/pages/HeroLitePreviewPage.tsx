import { Navigate, useSearchParams } from "react-router-dom";

/**
 * Alias for the real home JPEG fly — same 300vh scroll as Windows / `?lite=1`.
 * http://localhost:5173/dev/hero-lite
 * http://localhost:5173/dev/hero-dark
 */
export function HeroLitePreviewPage({ theme = "light" }: { theme?: "light" | "dark" }) {
  const [params] = useSearchParams();
  const next = new URLSearchParams();
  next.set("lite", "1");
  const override = params.get("theme");
  next.set("theme", override === "light" || override === "dark" ? override : theme);
  if (params.get("mobile") === "1") next.set("mobile", "1");
  return <Navigate to={{ pathname: "/", search: next.toString() }} replace />;
}
