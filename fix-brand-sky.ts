import fs from "fs";
let content = fs.readFileSync("src/components/hero-terrain/BrandHazeSky.tsx", "utf-8");

content = content.replace(
  "#include <fog_pars_vertex>\n          #include <fog_pars_fragment>\n          varying vec3 vWorldPos;",
  "#include <fog_pars_vertex>\n          varying vec3 vWorldPos;"
);
content = content.replace(
  "uniform vec3 uZenith;",
  "#include <fog_pars_fragment>\n          uniform vec3 uZenith;"
);

fs.writeFileSync("src/components/hero-terrain/BrandHazeSky.tsx", content);
