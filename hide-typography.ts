import fs from "fs";
let content = fs.readFileSync("src/components/ExpeditionCrewFold.tsx", "utf-8");

const injectFlag = `function ExpeditionCrewFold() {
  const DEBUG_HIDE_TYPO = true; // Temporary flag to focus purely on 3D cinematography
`;
content = content.replace("function ExpeditionCrewFold() {", injectFlag);

const wrapStart = `        <HeroFlyProgressBridge progressRef={flyRef}>
          <ExpeditionEverestSky veil={DEBUG_HIDE_TYPO ? 0 : veil} settle={settle} />
        </HeroFlyProgressBridge>
        <div 
          ref={stageRef} 
          className="expedition-fold__stage section-inner relative"
          style={{ opacity: DEBUG_HIDE_TYPO ? 0 : 1, pointerEvents: DEBUG_HIDE_TYPO ? 'none' : 'auto' }}
        >`;
content = content.replace(/        <HeroFlyProgressBridge progressRef={flyRef}>\n          <ExpeditionEverestSky veil={veil} settle={settle} \/>\n        <\/HeroFlyProgressBridge>\n        <div ref={stageRef} className="expedition-fold__stage section-inner relative">/, wrapStart);

fs.writeFileSync("src/components/ExpeditionCrewFold.tsx", content);
