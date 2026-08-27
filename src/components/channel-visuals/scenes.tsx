import { motion } from "framer-motion";
import type { SolutionsChannelId } from "../../data/solutionsChannels";
import { DeviceFrame } from "./DeviceFrame";
import type { DeviceKind } from "./DeviceFrame";

const SPRING = { type: "spring" as const, stiffness: 220, damping: 22 };

function OemBootScene() {
  const trail = ["Factory ROM", "First boot", "SDK ping", "MMP postback"];
  return (
    <div className="cv-scene cv-scene--oem">
      <div className="cv-oem-boot">
        <span className="cv-oem-boot__ring">
          <span className="cv-oem-boot__ring-fill" />
        </span>
        <p className="cv-oem-boot__title">System ready</p>
        <p className="cv-oem-boot__sub">Pre-install lane active</p>
      </div>
      <div className="cv-oem-trail-wrap">
        <span className="cv-oem-trail__progress" aria-hidden />
        <ol className="cv-oem-trail">
          {trail.map((step, i) => (
            <li key={step} className="cv-oem-trail__step" style={{ ["--cv-trail-i" as string]: i }}>
              <span className="cv-oem-trail__dot" />
              <span className="cv-oem-trail__label">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function PerformanceScene() {
  const bars = [32, 48, 64, 80, 94];
  return (
    <div className="cv-scene cv-scene--performance">
      <div className="cv-funnel">
        {["Install", "Register", "FTD"].map((label, i) => (
          <motion.div
            key={label}
            className="cv-funnel__stage"
            style={{ width: `${100 - i * 22}%`, ["--cv-funnel-i" as string]: i }}
            initial={{ opacity: 0, scaleX: 0.85 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ ...SPRING, delay: 0.08 + i * 0.07 }}
          >
            <span>{label}</span>
          </motion.div>
        ))}
      </div>
      <div className="cv-mini-chart">
        <p className="cv-mini-chart__label">Verified events</p>
        <div className="cv-mini-chart__bars">
          {bars.map((h, i) => (
            <span key={i} className="cv-mini-chart__bar" style={{ ["--cv-bar-h" as string]: `${h}%`, ["--cv-bar-i" as string]: i }} />
          ))}
        </div>
      </div>
    </div>
  );
}



const DEVICE_BY_CHANNEL: Record<SolutionsChannelId, DeviceKind | "ctv"> = {
  programmatic: "phone",
  oem: "phone",
  performance: "phone",
};

function SceneContent({ channelId }: { channelId: SolutionsChannelId }) {
  switch (channelId) {
    case "oem":
      return <OemBootScene />;
    case "performance":
      return <PerformanceScene />;
    case "programmatic":
      return null;
    default:
      return null;
  }
}

export function ChannelVisualScene({ channelId }: { channelId: SolutionsChannelId }) {
  if (channelId === "programmatic") {
    return null;
  }

  const kind = DEVICE_BY_CHANNEL[channelId] as DeviceKind;

  return (
    <DeviceFrame kind={kind} label={`${channelId} channel visual`}>
      <SceneContent channelId={channelId} />
    </DeviceFrame>
  );
}
