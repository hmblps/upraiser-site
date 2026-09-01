import fs from "fs";

let home = fs.readFileSync("src/pages/HomePage.tsx", "utf-8");

home = home.replace(
  '    </React.Suspense>\n    </>',
  '    </>\n    </React.Suspense>'
);
fs.writeFileSync("src/pages/HomePage.tsx", home);
