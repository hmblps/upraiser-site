import fs from "fs";

let home = fs.readFileSync("src/pages/HomePage.tsx", "utf-8");

home = home.replace('<div id="audience"><Audience /></div>', '<Audience />');
home = home.replace('<div id="process"><Process /></div>', '<Process />');
home = home.replace('<div id="cases"><CaseStudies /></div>', '<CaseStudies />');
home = home.replace('<div id="promise"><PromiseSection /></div>', '<PromiseSection />');
home = home.replace('<div id="pilot"><HomePilotCta /></div>', '<HomePilotCta />');

fs.writeFileSync("src/pages/HomePage.tsx", home);
