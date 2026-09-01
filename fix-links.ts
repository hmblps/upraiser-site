import fs from "fs";

// 1. liveContent.ts
let liveContent = fs.readFileSync("src/data/liveContent.ts", "utf-8");
liveContent = liveContent.replace(/{ label: "The Expedition", href: "\/expedition" },/g, "");
fs.writeFileSync("src/data/liveContent.ts", liveContent);

// 2. pageMeta.ts
let pageMeta = fs.readFileSync("src/data/pageMeta.ts", "utf-8");
const expMetaRegex = /\s*"\(\/expedition\)":\s*\{[\s\S]*?\},/;
// Just replace /expedition key entirely
pageMeta = pageMeta.replace(/\s*"\/expedition":\s*\{[\s\S]*?\},/, "");
fs.writeFileSync("src/data/pageMeta.ts", pageMeta);

// 3. routePreloader.ts
let preloader = fs.readFileSync("src/lib/routePreloader.ts", "utf-8");
preloader = preloader.replace(/if \(base === "\/expedition"\) \{[\s\S]*?\}/, "");
fs.writeFileSync("src/lib/routePreloader.ts", preloader);
