// scripts/generate-og-images.mjs
//
// Renders the 1200×630 social preview images in public/og/ with a headless
// browser. Run manually when titles change (needs Playwright + Chromium):
//   node scripts/generate-og-images.mjs
// The images are committed, so the site build does not depend on a browser.

import { mkdir } from "node:fs/promises";
import path from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const OUT = path.resolve("public/og");
const EXECUTABLE = process.env.CHROMIUM_PATH; // optional

const IMAGES = [
  { file: "xp-calculator", icon: "⚒️", title: "Profession XP Calculator", subtitle: "How many crafts to reach your next level" },
  { file: "builder", icon: "🛡️", title: "Equipment Builder", subtitle: "Plan your gear · total stats · share by link" },
  { file: "sublimations", icon: "📜", title: "Sublimations Library", subtitle: "Every sublimation, effect and slot pattern" },
  { file: "items-craft-guide", icon: "🔨", title: "Items Craft Guide", subtitle: "Recipe trees and shopping lists" },
  { file: "combat-calc", icon: "⚔️", title: "Combat Calculator", subtitle: "Damage · heals · armor · EHP · lock" },
  { file: "treasures", icon: "🗺️", title: "Treasures", subtitle: "Treasure hunt achievements tracker" },
  { file: "guides", icon: "📖", title: "Wakfu Guides", subtitle: "Professions, sublimations and more" },
  { file: "default", icon: "✨", title: "Wakfu Job Calculator", subtitle: "Free tools for Wakfu players" },
];

const html = ({ icon, title, subtitle }) => `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; font-family: 'DejaVu Sans', system-ui, sans-serif;
    background: radial-gradient(ellipse at 20% 0%, #064e3b 0%, #0f172a 55%, #020617 100%);
    color: #ecfdf5; display: flex; flex-direction: column; justify-content: center; padding: 80px 90px; position: relative; }
  .ring { position: absolute; right: -120px; top: -120px; width: 520px; height: 520px; border-radius: 50%;
    border: 2px solid rgba(110,231,183,.18); box-shadow: 0 0 120px rgba(16,185,129,.18) inset; }
  .icon { font-size: 96px; margin-bottom: 28px; }
  h1 { font-size: 78px; line-height: 1.05; font-weight: 800;
    background: linear-gradient(90deg, #a7f3d0, #ccfbf1, #a7f3d0); -webkit-background-clip: text; color: transparent; }
  p { font-size: 36px; margin-top: 22px; color: rgba(209,250,229,.8); }
  .brand { position: absolute; left: 90px; bottom: 56px; font-size: 26px; color: #6ee7b7; letter-spacing: .04em; }
  .bar { position: absolute; left: 0; bottom: 0; width: 100%; height: 10px; background: linear-gradient(90deg, #059669, #14b8a6); }
</style></head><body>
  <div class="ring"></div>
  <div class="icon">${icon}</div>
  <h1>${title}</h1>
  <p>${subtitle}</p>
  <div class="brand">wakfujobcalculator.com</div>
  <div class="bar"></div>
</body></html>`;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch(EXECUTABLE ? { executablePath: EXECUTABLE } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const img of IMAGES) {
  await page.setContent(html(img));
  await page.screenshot({ path: path.join(OUT, `${img.file}.jpg`), type: "jpeg", quality: 88 });
  console.log(`og/${img.file}.jpg`);
}
await browser.close();
