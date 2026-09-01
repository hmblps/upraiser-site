import fs from "fs";

let liveContent = fs.readFileSync("src/data/liveContent.ts", "utf-8");

liveContent = liveContent.replace(
  /export const navLinks: NavLink\[\] = \[[\s\S]*?\];/,
  `export const navLinks: NavLink[] = [
  { label: "The Agency", href: "/" },
  { label: "The Channels", href: "/channels" },
  { label: "Creative Studio", href: "/craft", underConstruction: true },
];`
);

fs.writeFileSync("src/data/liveContent.ts", liveContent);
