import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const avatarPath = path.join(rootDir, "public", "team", "oleksii.jpg");
const alexImgPath = path.join(rootDir, "public", "team", "alex.jpg");

if (!fs.existsSync(avatarPath)) {
  console.error("Avatar image not found at:", avatarPath);
  process.exit(1);
}

// Keep alex.jpg in sync
fs.copyFileSync(avatarPath, alexImgPath);

const imgBuf = fs.readFileSync(avatarPath);
const rawBase64 = imgBuf.toString("base64");

// Apple vCard standard line folding: 74 chars + \r\n and leading space
const chunks = rawBase64.match(/.{1,74}/g) || [];
const folded = chunks.join("\r\n ");

// 1. Remove NOTE block completely so Create New Contact fits on the 1st screen without scroll
// 2. Pack TG @homeboylebz into ORG so it displays neatly beneath the name in small gray font
// 3. Keep strictly 3 cards: mobile, email, work connect url
const lines = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "PRODID:-//Apple Inc.//macOS 27.0.1//EN",
  "N:Ostroukhov;Oleksii;;;",
  "FN:Oleksii Ostroukhov",
  "ORG:UPRAISER Agency LLP · TG @homeboylebz",
  "TITLE:Founder & Lead · Direct Mobile UA & OEM Infra",
  "TEL;TYPE=CELL,VOICE,PREF:+40724787390",
  "EMAIL;TYPE=WORK,INTERNET:alex@upraiser.co.uk",
  "URL;TYPE=WORK:https://upraiser.co.uk/connect",
  `PHOTO;ENCODING=b;TYPE=JPEG:${folded}`,
  "END:VCARD",
];

const vcfContent = lines.join("\r\n") + "\r\n";

const targets = ["Oleksii_Upraiser.vcf", "contact.vcf", "alex-upraiser.vcf"];

for (const target of targets) {
  const targetPath = path.join(rootDir, "public", target);
  fs.writeFileSync(targetPath, vcfContent, "utf8");
  console.log(`✓ Wrote static ${target} (${vcfContent.length} bytes)`);
}
