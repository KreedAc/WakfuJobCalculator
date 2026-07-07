// scripts/build-equipment-data.mjs
//
// Generates public/data/equipment.compact.{en,fr,es,pt}.json for the builder:
// every wearable item with its localized name, slot type, level, rarity, icon
// and stat effects, extracted from the official Ankama CDN.
//
// Stat encoding: stats is an array of [actionId, value] pairs, plus
// [actionId, value, elementCount] for the "mastery/resistance in N random
// elements" actions (1068/1069). The actionId → stat-name mapping lives in
// the frontend (src/constants/equipmentStats.ts) and was derived from
// actions.json via scripts/probe-equipment-data.mjs.

import { promises as fsp } from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve("public/data");
const LANGUAGES = ["en", "fr", "es", "pt"];

// Wearable item types (from equipmentItemTypes.json). 812 (sublimations),
// 811, 647 (costumes) and other non-stat types are intentionally excluded.
const WEARABLE_TYPES = new Set([
  101, 103, 108, 110, 111, 112, 113, 114, 115, 117, // weapons + rings
  119, 120, 132, 133, 134, 136, 138, 189,           // armor pieces + shield
  219, 223, 253, 254,                                // fist, 2H sword/staff, cards
  480, 537, 646,                                     // torch, tool, emblem (ACCESSORY)
  582, 611, 849,                                     // pet, mount, lucky charm
]);

// Stat actions worth keeping: gains positive, losses encoded negative.
// value = params[0]; 1068/1069 also carry params[2] = number of elements.
const GAIN_ACTIONS = new Set([
  20, 26, 31, 41, 71, 80, 82, 83, 84, 85,
  120, 122, 123, 124, 125, 149, 150, 160, 162, 166,
  171, 173, 175, 177, 180, 191, 193, 875, 988,
  1052, 1053, 1055, 1068, 1069,
]);
// loss actionId → equivalent gain actionId (stored with negated value)
const LOSS_TO_GAIN = new Map([
  [21, 20], [56, 31], [57, 41], [90, 80], [96, 84], [97, 82], [98, 83], [100, 80],
  [130, 120], [132, 122], [161, 160], [168, 150], [172, 171], [174, 173],
  [176, 175], [181, 180], [192, 191], [876, 875],
  [1056, 149], [1059, 1052], [1060, 1053], [1061, 1055], [1062, 988], [1063, 71],
]);

function pickText(v, lang) {
  if (!v) return null;
  if (typeof v === "string") return v;
  return v[lang] ?? v.en ?? v.fr ?? Object.values(v)[0] ?? null;
}

async function fetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}\n${text.slice(0, 200)}`);
  return JSON.parse(text);
}

function extractStats(item, unhandled) {
  const stats = [];
  for (const e of item?.definition?.equipEffects ?? []) {
    const d = e?.effect?.definition;
    if (!d || !Array.isArray(d.params) || d.params.length === 0) continue;
    const value = d.params[0];
    if (GAIN_ACTIONS.has(d.actionId)) {
      if (d.actionId === 1068 || d.actionId === 1069) {
        stats.push([d.actionId, value, d.params[2] ?? 1]);
      } else {
        stats.push([d.actionId, value]);
      }
    } else if (LOSS_TO_GAIN.has(d.actionId)) {
      stats.push([LOSS_TO_GAIN.get(d.actionId), -value]);
    } else {
      unhandled.set(d.actionId, (unhandled.get(d.actionId) ?? 0) + 1);
    }
  }
  return stats;
}

async function main() {
  await fsp.mkdir(OUT_DIR, { recursive: true });

  console.log("Fetching Wakfu version...");
  const cfg = await fetchJson("https://wakfu.cdn.ankama.com/gamedata/config.json");
  const version = cfg.version;
  if (!version) throw new Error("No version in config.json");
  console.log("Wakfu version:", version);

  console.log("Downloading items.json ...");
  const itemsRaw = await fetchJson(`https://wakfu.cdn.ankama.com/gamedata/${version}/items.json`);
  console.log(`Official items: ${itemsRaw.length}`);

  const unhandled = new Map();
  const wearables = [];
  for (const it of itemsRaw) {
    const d = it?.definition?.item;
    if (!d) continue;
    const typeId = d.baseParameters?.itemTypeId;
    if (!WEARABLE_TYPES.has(typeId)) continue;
    wearables.push({ raw: it, d, typeId, stats: extractStats(it, unhandled) });
  }
  console.log(`Wearable items: ${wearables.length}`);
  if (unhandled.size) {
    console.log(
      "Unhandled equip actionIds (ignored):",
      [...unhandled.entries()].map(([a, n]) => `${a}×${n}`).join(", ")
    );
  }

  for (const lang of LANGUAGES) {
    const items = wearables
      .map(({ raw, d, typeId, stats }) => ({
        id: d.id,
        name: pickText(raw.title, lang) ?? `#${d.id}`,
        type: typeId,
        lvl: d.level ?? 0,
        rarity: d.baseParameters?.rarity ?? 0,
        gfx: d.graphicParameters?.gfxId ?? null,
        stats,
      }))
      .sort((a, b) => a.lvl - b.lvl || a.id - b.id);

    const out = { version, generatedAt: new Date().toISOString(), items };
    const outPath = path.join(OUT_DIR, `equipment.compact.${lang}.json`);
    await fsp.writeFile(outPath, JSON.stringify(out));
    const kb = Math.round((await fsp.stat(outPath)).size / 1024);
    console.log(`equipment.compact.${lang}.json: ${items.length} items, ${kb} KB`);
  }

  console.log("✅ DONE");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
