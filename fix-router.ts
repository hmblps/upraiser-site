import fs from "fs";

let app = fs.readFileSync("src/App.tsx", "utf-8");
app = app.replace('const RouteDetailPage = lazy(() => import("./pages/RouteDetailPage").then((m) => ({ default: m.RouteDetailPage })));', 'const ChannelsPage = lazy(() => import("./pages/ChannelsPage").then((m) => ({ default: m.ChannelsPage })));');
app = app.replace('<Route path="route/:slug" element={<RouteDetailPage />} />', '<Route path="channels" element={<ChannelsPage />} />');
fs.writeFileSync("src/App.tsx", app);

let nav = fs.readFileSync("src/components/BrandAuroraNav.tsx", "utf-8");
// Let's replace whatever was in there with updated links.
// Let's first check what's in BrandAuroraNav.tsx
