import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "linkedin-banner.html");
const htmlUrl = `file://${htmlPath}`;

const outDir = path.join(__dirname, "..", "exports");
const desktopPath = path.join(
  process.env.HOME || "",
  "Desktop",
  "pablo-linkedin-banner.png"
);
const projectPath = path.join(outDir, "pablo-linkedin-banner.png");
const retinaPath = path.join(outDir, "pablo-linkedin-banner@2x.png");

fs.mkdirSync(outDir, { recursive: true });

async function shot(page, out) {
  await page.goto(htmlUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: out, type: "png" });
}

const browser = await chromium.launch();

const page = await browser.newPage({
  viewport: { width: 1584, height: 396 },
  deviceScaleFactor: 1
});
await shot(page, projectPath);
await shot(page, desktopPath);
await page.close();

const retina = await browser.newPage({
  viewport: { width: 1584, height: 396 },
  deviceScaleFactor: 2
});
await shot(retina, retinaPath);
await retina.close();

await browser.close();

console.log("Saved (1584×396):", projectPath);
console.log("Saved (1584×396):", desktopPath);
console.log("Saved (@2x):", retinaPath);
