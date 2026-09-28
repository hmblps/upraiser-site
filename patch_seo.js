import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = 'import { SEO } from "./components/SEO.tsx";\n' + app;
app = app.replace(
  /<Routes location={location} key={location.pathname}>/,
  '<SEO />\n        <Routes location={location} key={location.pathname}>'
);
fs.writeFileSync('src/App.tsx', app);
console.log("App.tsx patched");
