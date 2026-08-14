import { SlideTabs } from "./SlideTabs";
import { ROUTES_LANE_TABS, type RoutesLaneId } from "../hooks/useRoutesLane";

type RoutesLaneSwitcherProps = {
  lane: RoutesLaneId;
  onLaneChange: (lane: RoutesLaneId) => void;
  layoutId: string;
};

export function RoutesLaneSwitcher({ lane, onLaneChange, layoutId }: RoutesLaneSwitcherProps) {
  return (
    <SlideTabs
      items={[...ROUTES_LANE_TABS]}
      activeId={lane}
      onChange={(id) => onLaneChange(id === "oem-ctv" ? "oem-ctv" : "app-growth")}
      layoutId={layoutId}
      className="format-lane-tabs"
    />
  );
}
