// scripts/generate-og-images.mjs
//
// Renders the 1200×630 social preview images in public/og/ with a headless
// browser. Run manually when titles change (needs Playwright + Chromium):
//   node scripts/generate-og-images.mjs
// The images are committed, so the site build does not depend on a browser.

import { mkdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const OUT = path.resolve("public/og");
const EXECUTABLE = process.env.CHROMIUM_PATH; // optional

// Same fonts, colors and icons (lucide) as the site's design system.
const FONT = (file) => `data:font/woff2;base64,${readFileSync(path.resolve("public/fonts", file)).toString("base64")}`;

function icon(name) {
  const src = readFileSync(path.resolve(`node_modules/lucide-react/dist/esm/icons/${name}.js`), "utf8");
  const nodes = new Function(`return ${src.slice(src.indexOf("[", src.indexOf("createLucideIcon(")), src.lastIndexOf("]);") + 1)}`)();
  const inner = nodes
    .map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== "key").map(([k, v]) => `${k}="${v}"`).join(" ")}/>`)
    .join("");
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

const IMAGES = [
  { file: "xp-calculator", icon: "hammer", accent: true, title: "Profession XP Calculator", subtitle: "How many crafts to reach your next level" },
  { file: "builder", icon: "shirt", title: "Equipment Builder", subtitle: "Plan your gear · total stats · share by link" },
  { file: "sublimations", icon: "scroll", title: "Sublimations Library", subtitle: "Every sublimation, effect and socket pattern" },
  { file: "items-craft-guide", icon: "wrench", title: "Items Craft Guide", subtitle: "Recipe trees and shopping lists" },
  { file: "combat-calc", icon: "swords", title: "Combat Calculator", subtitle: "Damage · heals · armor · EHP · lock" },
  { file: "treasures", icon: "map", title: "Treasures", subtitle: "Treasure hunt achievements tracker" },
  { file: "guides", icon: "book-open", title: "Wakfu Guides", subtitle: "Professions, sublimations and more" },
  { file: "default", icon: "sparkles", accent: true, title: "Every Wakfu tool,<br>in one place", subtitle: "XP calculator · sublimations · craft guide · combat" },
];

const html = ({ icon: iconName, accent, title, subtitle }) => `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Sora; font-weight: 600 800; src: url(${FONT("sora-latin.woff2")}) format("woff2"); }
  @font-face { font-family: Inter; font-weight: 400 700; src: url(${FONT("inter-latin.woff2")}) format("woff2"); }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; font-family: Inter, sans-serif; background: #0A0F1E; color: #EAF0FF;
    display: flex; flex-direction: column; justify-content: center; padding: 80px 90px; position: relative; overflow: hidden; }
  .glow { position: absolute; right: -160px; top: -200px; width: 640px; height: 640px; border-radius: 50%;
    background: radial-gradient(circle, rgba(56,211,242,.22), transparent 65%); }
  .icon { width: 104px; height: 104px; border-radius: 28px; display: grid; place-items: center; margin-bottom: 36px;
    background: ${accent ? "rgba(255,122,69,.15)" : "rgba(56,211,242,.12)"}; color: ${accent ? "#FF7A45" : "#38D3F2"}; }
  .icon svg { width: 56px; height: 56px; }
  h1 { font-family: Sora, sans-serif; font-size: 76px; line-height: 1.05; font-weight: 800; letter-spacing: -.02em; max-width: 1000px; }
  p { font-size: 34px; margin-top: 22px; color: #A3AED0; }
  .brand { position: absolute; left: 90px; bottom: 58px; font-size: 26px; font-weight: 600; color: #38D3F2; }
  .bar { position: absolute; left: 0; bottom: 0; width: 100%; height: 10px; background: linear-gradient(90deg, #38D3F2, #FF7A45); }
</style></head><body>
  <div class="glow"></div>
  <div class="icon">${icon(iconName)}</div>
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
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, `${img.file}.jpg`), type: "jpeg", quality: 88 });
  console.log(`og/${img.file}.jpg`);
}
await browser.close();
