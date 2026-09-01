import fs from "fs";
let content = fs.readFileSync("src/components/ExpeditionCrewFold.tsx", "utf-8");

content = content.replace("import { clamp, smoothstep, lerp } from \"../lib/clamp\";", "import { clamp, smoothstep } from \"../lib/clamp\";\nconst lerp = (a: number, b: number, t: number) => a + (b - a) * t;");

content = content.replace("const { crewFold, camps, facts, cta } = COMPANY_CONTENT.aboutExpedition;", "const { crewFold, camps, cta } = COMPANY_CONTENT.aboutExpedition;\nconst facts = COMPANY_CONTENT.facts;");

content = content.replace("camp: { role: string; names: string[] };", "camp: { altitude: string; title: string; text: string };");

content = content.replace(`        <p className="expedition-crew-card__role !m-0 !text-[11px]">{camp.role}</p>
      </div>
      {camp.names.map((name) => (
        <h3 key={name} className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--theme-text)] leading-none drop-shadow-md">
          {name}
        </h3>
      ))}`, `        <p className="expedition-crew-card__role !m-0 !text-[11px]">{camp.altitude}</p>
      </div>
      <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--theme-text)] leading-none drop-shadow-md">
        {camp.title}
      </h3>
      <p className="mt-3 text-lg opacity-80 max-w-sm drop-shadow-md">{camp.text}</p>`);

content = content.replace(`{facts.map((item) => (`, `{facts.map((item: any) => (`);

fs.writeFileSync("src/components/ExpeditionCrewFold.tsx", content);
