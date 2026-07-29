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

function SocialFeedScene() {
  return (
    <div className="cv-scene cv-scene--social">
      <div className="cv-search-bubble">
        <span>Search intent</span>
        <span className="cv-search-bubble__signal" />
      </div>
      <div className="cv-feed">
        {[0, 1, 2].map((i) => (
          <div key={i} className="cv-feed__card" style={{ ["--cv-feed-i" as string]: i }}>
            <span className="cv-feed__thumb" />
            <span className="cv-feed__lines">
              <i />
              <i />
            </span>
          </div>
        ))}
      </div>
      <div className="cv-event-ping">
        <span className="cv-event-ping__ripple" />
        MMP event
      </div>
    </div>
  );
}

function RewardedOfferwallScene() {
  const cells = Array.from({ length: 6 }, (_, i) => i);
  return (
    <div className="cv-scene cv-scene--rewarded">
      <p className="cv-scene__kicker">Offerwall</p>
      <div className="cv-offerwall">
        {cells.map((i) => (
          <div key={i} className={i === 2 ? "cv-offerwall__cell cv-offerwall__cell--active" : "cv-offerwall__cell"}>
            {i === 2 ? (
              <>
                <span className="cv-offerwall__ring" />
                <span className="cv-offerwall__complete">Complete</span>
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function RetargetingOrbitScene() {
  const nodes = ["Trial", "Cart", "Deposit"];
  return (
    <div className="cv-scene cv-scene--orbit">
      <div className="cv-orbit__core">MMP pool</div>
      {nodes.map((node, i) => (
        <span key={node} className="cv-orbit__node" style={{ ["--cv-orbit-angle" as string]: `${i * 120}deg`, ["--cv-orbit-i" as string]: i }}>
          {node}
        </span>
      ))}
      <svg className="cv-orbit__ring" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
      </svg>
      <span className="cv-orbit__runner" aria-hidden />
    </div>
  );
}

function NativePublisherScene() {
  const pubs = ["Finance wire", "Tech daily", "Markets brief"];
  return (
    <div className="cv-scene cv-scene--native">
      {pubs.map((pub, i) => (
        <div key={pub} className={i === 1 ? "cv-publisher cv-publisher--active" : "cv-publisher"} style={{ ["--cv-pub-i" as string]: i }}>
          <span className="cv-publisher__mark" />
          <div>
            <p className="cv-publisher__name">{pub}</p>
            <p className="cv-publisher__slot">{i === 1 ? "Native unit · in-flow" : "Publisher lane"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InfluencerClipScene() {
  return (
    <div className="cv-scene cv-scene--influencer">
      <div className="cv-clip">
        <span className="cv-clip__play" />
        <span className="cv-clip__grain" />
        <span className="cv-clip__progress" />
      </div>
      <div className="cv-link-chip">Tracked link</div>
      <div className="cv-event-counter">
        <span>Install</span>
        <strong>+1</strong>
      </div>
    </div>
  );
}

function CtvSplitScene() {
  return (
    <div className="cv-ctv-wrap">
      <div className="cv-device cv-device--tv">
        <div className="cv-device__shell">
          <div className="cv-device__screen cv-device__screen--tv">
            <div className="cv-scene cv-scene--ctv-tv">
              <div className="cv-ctv-program">
                <span className="cv-ctv-program__bar" />
                <span className="cv-ctv-program__cta">Stream ad</span>
                <span className="cv-ctv-beam" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cv-device cv-device--phone cv-device--ctv-phone">
        <div className="cv-device__shell">
          <div className="cv-device__screen">
            <div className="cv-scene cv-scene--ctv-phone">
              <p>App open</p>
              <span className="cv-ctv-activate">Activated</span>
            </div>
          </div>
        </div>
      </div>
      <svg className="cv-ctv-link" viewBox="0 0 40 20" aria-hidden>
        <motion.path
          d="M 2 10 H 38"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 4"
          animate={{ strokeDashoffset: [0, -14] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}

const DEVICE_BY_CHANNEL: Record<SolutionsChannelId, DeviceKind | "ctv"> = {
  programmatic: "phone",
  oem: "laptop",
  performance: "phone",
  social: "phone",
  rewarded: "phone",
  ctv: "ctv",
  retargeting: "phone",
  native: "desktop",
  influencer: "phone-tall",
};

function SceneContent({ channelId }: { channelId: SolutionsChannelId }) {
  switch (channelId) {
    case "oem":
      return <OemBootScene />;
    case "performance":
      return <PerformanceScene />;
    case "social":
      return <SocialFeedScene />;
    case "rewarded":
      return <RewardedOfferwallScene />;
    case "ctv":
      return <CtvSplitScene />;
    case "retargeting":
      return <RetargetingOrbitScene />;
    case "native":
      return <NativePublisherScene />;
    case "influencer":
      return <InfluencerClipScene />;
    default:
      return null;
  }
}

export function ChannelVisualScene({ channelId }: { channelId: SolutionsChannelId }) {
  if (channelId === "ctv") {
    return <CtvSplitScene />;
  }

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
