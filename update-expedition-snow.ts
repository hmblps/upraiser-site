import fs from "fs";
let content = fs.readFileSync("src/components/ExpeditionCrewFold.tsx", "utf-8");

// Add useEffect to tie progress to global snow opacity
const logicToInject = `  const flyRef = useRef(0);
  useMotionValueEvent(progress, "change", (p) => {
    flyRef.current = p;
    // Fade out global blizzard as we ascend above clouds
    // Start fading at p=0.1, fully gone by p=0.5
    const snowOpacity = 1 - Math.min(1, Math.max(0, (p - 0.1) / 0.4));
    document.documentElement.style.setProperty("--global-snow-opacity", snowOpacity.toString());
  });
  
  // Cleanup snow opacity on unmount
  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty("--global-snow-opacity");
    };
  }, []);`;

content = content.replace(/  const flyRef = useRef\(0\);\n  useMotionValueEvent\(progress, "change", \(p\) => \{\n    flyRef.current = p;\n  \}\);/, logicToInject);

// Make sure useEffect is imported
if (!content.includes("useEffect")) {
  content = content.replace("useRef", "useRef, useEffect");
}

fs.writeFileSync("src/components/ExpeditionCrewFold.tsx", content);
