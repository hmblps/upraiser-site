import fs from "fs";
let content = fs.readFileSync("src/styles/expedition.css", "utf-8");

// Remove the media query wrapper around expedition-fold
content = content.replace(
`@media (min-width: 768px) {
  .expedition-fold.scroll-scene--fold {
    min-height: 950vh;
  }
}`,
`.expedition-fold.scroll-scene--fold {
  min-height: 950vh;
}`
);

fs.writeFileSync("src/styles/expedition.css", content);
