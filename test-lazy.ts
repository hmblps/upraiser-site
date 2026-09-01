import fs from "fs";
let lazy = fs.readFileSync("src/layouts/SiteLayout.tsx", "utf-8");
lazy = lazy.replace(
  'const mounted = show && heroOk;',
  'const mounted = show && heroOk; console.log("LazySection", id, "show:", show, "heroOk:", heroOk, "mounted:", mounted);'
);
fs.writeFileSync("src/layouts/SiteLayout.tsx", lazy);
