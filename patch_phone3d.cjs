const fs = require("fs");
const file = "src/components/solutions/Phone3D.tsx";
let code = fs.readFileSync(file, "utf8");

code = code.replace(
  /banner:\s*"\/channels\/programmatic-feed\/formats\/banner.mp4",/,
  `// banner:       "/channels/programmatic-feed/formats/banner.mp4",`
);

code = code.replace(
  /native:\s*"\/channels\/programmatic-feed\/formats\/native.mp4",/,
  `// native:       "/channels/programmatic-feed/formats/native.mp4",`
);

code = code.replace(
  /interstitial:\s*"\/channels\/programmatic-feed\/formats\/interstitial.mp4",/,
  `// interstitial: "/channels/programmatic-feed/formats/interstitial.mp4",`
);

fs.writeFileSync(file, code);
