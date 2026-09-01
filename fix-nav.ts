import fs from "fs";

let liveContent = fs.readFileSync("src/data/liveContent.ts", "utf-8");

liveContent = liveContent.replace(
  /{\s*label:\s*"The Channels",\s*href:\s*"\/channels"\s*},?\n?/g,
  ''
);

fs.writeFileSync("src/data/liveContent.ts", liveContent);
