import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type DeviceKind = "phone" | "phone-tall" | "laptop" | "desktop";

type DeviceFrameProps = {
  kind: DeviceKind;
  className?: string;
  children: ReactNode;
  label?: string;
};

export function DeviceFrame({ kind, className, children, label }: DeviceFrameProps) {
  return (
    <div
      className={cn("cv-device", `cv-device--${kind}`, className)}
      data-device={kind}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    >
      <div className="cv-device__shell">
        {kind === "laptop" ? <div className="cv-device__camera" /> : null}
        <div
          className={cn(
            "cv-device__screen",
            kind === "phone-tall" && "cv-device__screen--tall",
            kind === "desktop" && "cv-device__screen--wide",
          )}
        >
          {children}
        </div>
        {kind === "laptop" ? <div className="cv-device__base" /> : null}
      </div>
    </div>
  );
}
