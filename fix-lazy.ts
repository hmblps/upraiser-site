import fs from "fs";

let lazy = fs.readFileSync("src/layouts/SiteLayout.tsx", "utf-8");
lazy = lazy.replace(
  '<div ref={ref} id={mounted ? undefined : id}>',
  '<div ref={ref} id={mounted ? undefined : id} style={mounted ? undefined : { minHeight }}>'
);
fs.writeFileSync("src/layouts/SiteLayout.tsx", lazy);
