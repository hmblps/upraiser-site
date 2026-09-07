import puppeteer from "puppeteer";

const url = process.argv[2];
const doneNeedle = process.argv[3];
const width = Number(process.argv[4] || 1920);
const height = Number(process.argv[5] || 1080);

if (!url || !doneNeedle) {
  console.error("usage: node scripts/capture-home-dark.js <url> <done-needle> [w] [h]");
  process.exit(1);
}

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 0,
  args: [
    "--ignore-gpu-blocklist",
    "--enable-webgl",
    "--use-gl=angle",
    "--use-angle=metal",
    `--window-size=${width},${height}`,
  ],
});

const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 1 });
page.setDefaultTimeout(0);

let done = false;
page.on("console", (msg) => {
  const text = msg.text();
  console.log(text);
  if (text.includes(doneNeedle)) done = true;
});
page.on("pageerror", (err) => console.error("PAGEERROR", err.message));

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });

const started = Date.now();
while (!done && Date.now() - started < 12 * 60 * 1000) {
  await new Promise((r) => setTimeout(r, 1000));
}

await browser.close();
if (!done) {
  console.error("timed out waiting for", doneNeedle);
  process.exit(1);
}
console.log("OK", doneNeedle);
