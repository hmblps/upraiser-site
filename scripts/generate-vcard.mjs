import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const imgPath = path.join(rootDir, "public", "team", "oleksii.jpg");
const alexImgPath = path.join(rootDir, "public", "team", "alex.jpg");

if (!fs.existsSync(imgPath)) {
  console.error("Avatar image not found at:", imgPath);
  process.exit(1);
}

// Keep alex.jpg in sync with oleksii.jpg
fs.copyFileSync(imgPath, alexImgPath);

const imgBuf = fs.readFileSync(imgPath);
const b64 = imgBuf.toString("base64");

// 75-character RFC-2426 compliant line folding
const prefix = "PHOTO;ENCODING=b;TYPE=JPEG:";
const firstChunkLen = 75 - prefix.length;
const lines = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "PRODID:-//Apple Inc.//macOS 27.0.1//EN",
  "N:Ostroukhov;Oleksii;;;",
  "FN:Oleksii · Upraiser",
  "ORG:UPRAISER Agency LLP",
  "TITLE:Founder & Lead · Direct Mobile UA & OEM Infra",
  "TEL;TYPE=CELL,VOICE,PREF:+40724787390",
  "EMAIL;TYPE=WORK,INTERNET:alex@upraiser.co.uk",
  "URL;TYPE=WORK:https://upraiser.co.uk/connect",
  "NOTE:Direct Operator Desk (Mobile UA\\, Traffic\\, Lenovo OEM\\, Fraud Filtration). London · Since 2017. Telegram: @homeboylebz",
  prefix + b64.slice(0, firstChunkLen),
];

let pos = firstChunkLen;
while (pos < b64.length) {
  lines.push(" " + b64.slice(pos, pos + 74));
  pos += 74;
}
lines.push("END:VCARD");

// Strict RFC CRLF line endings
const vcfContent = lines.join("\r\n") + "\r\n";

const targets = ["Oleksii_Upraiser.vcf", "contact.vcf", "alex-upraiser.vcf"];

for (const target of targets) {
  const targetPath = path.join(rootDir, "public", target);
  fs.writeFileSync(targetPath, vcfContent, "utf8");
  console.log(`✓ Wrote ${target} (${vcfContent.length} bytes)`);
}
