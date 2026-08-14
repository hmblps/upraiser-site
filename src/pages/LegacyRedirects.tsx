import { Navigate, useSearchParams } from "react-router-dom";

const PILLAR_TO_CHANNEL: Record<string, string> = {
  oem: "oem",
  media: "programmatic",
  performance: "performance",
  programmatic: "programmatic",
  social: "social",
  "paid-social": "social",
  creators: "influencer",
  influencer: "influencer",
  ctv: "ctv",
  premium: "native",
  retargeting: "retargeting",
  rewarded: "rewarded",
};

/** Legacy /expertise URLs → home Routes section. */
export function RedirectExpertiseToSolutions() {
  const [params] = useSearchParams();
  const next = new URLSearchParams();
  const channel = params.get("channel");
  const pillar = params.get("pillar");

  if (channel) {
    next.set("channel", channel);
  } else if (pillar && PILLAR_TO_CHANNEL[pillar]) {
    next.set("channel", PILLAR_TO_CHANNEL[pillar]!);
  }

  const qs = next.toString();
  return <Navigate to={qs ? `/?${qs}#routes` : "/#routes"} replace />;
}

export function RedirectMeasurementToExpertise() {
  return <Navigate to="/#routes" replace />;
}
