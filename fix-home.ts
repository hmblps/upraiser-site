import fs from "fs";

let homeContent = fs.readFileSync("src/pages/HomePage.tsx", "utf-8");

homeContent = homeContent.replace(
  'import { RoutesPreviewSection } from "../components/solutions/RoutesPreviewSection";',
  'import { ChannelsCtaSection } from "../components/solutions/ChannelsCtaSection";'
);
homeContent = homeContent.replace(
  '<RoutesPreviewSection />',
  '<ChannelsCtaSection />'
);

fs.writeFileSync("src/pages/HomePage.tsx", homeContent);
