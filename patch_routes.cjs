const fs = require("fs");
const file = "src/hooks/useRoutesLane.tsx";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /const formats = \[[\s\S]*?\];/,
  `const formats = [
    AD_FORMATS.find((f) => f.id === "banner")!,
    AD_FORMATS.find((f) => f.id === "native")!,
    AD_FORMATS.find((f) => f.id === "interstitial")!,
    AD_FORMATS.find((f) => f.id === "rich")!,
    AD_FORMATS.find((f) => f.id === "video")!,
    OEM_CTV_FORMATS.find((f) => f.id === "pre-install")!,
    OEM_CTV_FORMATS.find((f) => f.id === "oem-store")!,
    OEM_CTV_FORMATS.find((f) => f.id === "system-ui")!,
    OEM_CTV_FORMATS.find((f) => f.id === "ctv-spot")!,
    OEM_CTV_FORMATS.find((f) => f.id === "ctv-video")!,
  ];`
);

fs.writeFileSync(file, code);
