// scripts/build-sublimations-data.mjs
import { promises as fsp } from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve("public/data");
const SUPPORTED_LANGUAGES = ["en", "fr", "es", "pt"];

function pickText(v, lang = null) {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object") {
    if (lang && v[lang]) return v[lang];
    return v.en ?? v.fr ?? v.es ?? v.pt ?? Object.values(v)[0] ?? null;
  }
  return null;
}

async function fetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}\n${text.slice(0, 200)}`);
  return JSON.parse(text);
}

function processEffect(effectDesc, lang = null) {
  if (!effectDesc) return null;

  const text = pickText(effectDesc, lang);
  if (!text) return null;

  // Remove HTML tags and clean up
  return text.replace(/<[^>]*>/g, '').trim();
}

function mapRarityId(rarityId) {
  const rarityMap = {
    1: 'Rare',
    2: 'Mythic',
    3: 'Legendary'
  };
  return rarityMap[rarityId] || 'Rare';
}

function extractSubColor(subColor) {
  // subColor è un array di numeri (0-3) che rappresentano i colori
  // 0 = Red, 1 = Green, 2 = Blue, 3 = Yellow/Jolly
  const colorMap = {
    0: 'R',
    1: 'G',
    2: 'B',
    3: 'J'
  };

  if (!Array.isArray(subColor)) return [];
  return subColor.map(c => colorMap[c] || 'G').slice(0, 3);
}

function findIconPath(sublimation, monsterFamiliesMap, itemsMap) {
  // Try to find icon from drop location
  if (sublimation.definition?.dropLocations && sublimation.definition.dropLocations.length > 0) {
    const dropLoc = sublimation.definition.dropLocations[0];

    // Check if it's from a monster family
    if (dropLoc.monsterFamilyId) {
      const family = monsterFamiliesMap.get(dropLoc.monsterFamilyId);
      if (family?.iconName) {
        return `/data/icons/${family.iconName}.png`;
      }
    }

    // Check if it's from an item/resource
    if (dropLoc.itemId) {
      const item = itemsMap.get(dropLoc.itemId);
      if (item?.iconName) {
        return `/data/icons/${item.iconName}.png`;
      }
    }
  }

  // Default icons based on rarity
  const rarityId = sublimation.definition?.rarity || sublimation.rarity || 1;
  if (rarityId === 3) return '/data/icons/legendary_icon.png';
  if (rarityId === 2) return '/data/icons/mythic_icon.png';
  return '/data/icons/rare_icon.png';
}

async function main() {
  await fsp.mkdir(OUT_DIR, { recursive: true });

  console.log("Fetching Wakfu version...");
  const cfg = await fetchJson("https://wakfu.cdn.ankama.com/gamedata/config.json");
  const version = cfg.version;
  if (!version) throw new Error("No version in config.json");

  const base = `https://wakfu.cdn.ankama.com/gamedata/${version}`;
  console.log("Wakfu version:", version);

  // Download equipmentItemTypes to map sublimation IDs
  console.log("Downloading equipmentItemTypes.json ...");
  const equipmentTypes = await fetchJson(`${base}/equipmentItemTypes.json`);

  // Find sublimation slots type
  const sublimationSlots = equipmentTypes.find(et =>
    et.definition?.equipmentPositions?.includes(1024) || // sublimation slot
    et.id === 582 // known sublimation type ID
  );

  console.log("Downloading items.json for sublimations...");
  const itemsRaw = await fetchJson(`${base}/items.json`);

  // Filter sublimation items (usually have sublimation in their equipment category or specific item type)
  const sublimationItems = itemsRaw.filter(item => {
    const def = item.definition || item;
    const itemTypeId = def.item?.type?.id || def.itemTypeId || def.typeId;
    // Sublimations usually have itemTypeId 582 or similar
    return itemTypeId === 582 || itemTypeId === 611 || itemTypeId === 646;
  });

  console.log(`Found ${sublimationItems.length} sublimation items`);

  // Download states.json for sublimation effects
  console.log("Downloading states.json ...");
  const statesRaw = await fetchJson(`${base}/states.json`);
  const statesMap = new Map(statesRaw.map(s => [s.definition?.id || s.id, s]));

  // Download actions.json for effect descriptions
  console.log("Downloading actions.json ...");
  const actionsRaw = await fetchJson(`${base}/actions.json`);
  const actionsMap = new Map(actionsRaw.map(a => [a.definition?.id || a.id, a]));

  console.log("\n========== Processing sublimations for each language ==========");

  for (const lang of SUPPORTED_LANGUAGES) {
    console.log(`\nProcessing language: ${lang.toUpperCase()}`);

    const sublimations = [];

    for (const item of sublimationItems) {
      const def = item.definition || item;
      const id = def.id || item.id;
      const title = pickText(def.title, lang) || pickText(item.title, lang);
      const description = pickText(def.description, lang) || pickText(item.description, lang);

      if (!title) continue;

      // Extract sublimation properties
      const useEffects = def.useEffects || item.useEffects || [];
      const equipEffects = def.equipEffects || item.equipEffects || [];

      // Get sublimation-specific properties
      const sublimationParams = def.sublimationParameters || item.sublimationParameters || {};
      const subColor = extractSubColor(sublimationParams.slotColorPattern || [1, 2, 1]); // default GBG

      // Extract rarity
      const rarityId = def.item?.baseParameters?.rarity || def.baseParameters?.rarity || 1;
      const rarities = rarityId === 3 ? ['Rare', 'Mythic', 'Legendary'] :
                      rarityId === 2 ? ['Rare', 'Mythic'] :
                      ['Rare'];

      // Extract level info
      const minLevel = sublimationParams.minLevel || def.level?.min || 1;
      const maxLevel = sublimationParams.maxLevel || def.level?.max || 6;

      // Parse description to find effect values
      let processedDesc = description || '';
      const values = [];

      // Find placeholders like [X], [Y], [Z] in description
      const placeholders = processedDesc.match(/\[([A-Z])\]/g) || [];
      for (const ph of placeholders) {
        values.push({
          base: 0, // Will need to be calculated from effects
          increment: 0,
          placeholder: ph.replace(/[\[\]]/g, '')
        });
      }

      // Determine category based on effects or description
      let category = 'General';
      const descLower = (description || '').toLowerCase();
      if (descLower.includes('damage') || descLower.includes('critical')) category = 'Offensive';
      else if (descLower.includes('resist') || descLower.includes('armor') || descLower.includes('hp')) category = 'Defensive';
      else if (descLower.includes('ap') || descLower.includes('mp') || descLower.includes('wp')) category = 'Stats Increase';
      else if (descLower.includes('control') || descLower.includes('summon')) category = 'Summoning';

      sublimations.push({
        id,
        name: title,
        colors: subColor.length > 0 ? subColor : ['G', 'B', 'G'],
        description: processedDesc,
        rarity: rarities,
        effect: '', // Will be extracted from level-up effects
        maxLevel,
        minLevel,
        step: 1,
        obtenation: {
          name: 'Unknown', // Would need monster/dungeon data
          localIcon: '/data/icons/rare_icon.png'
        },
        category,
        values: values.length > 0 ? values : [{ base: 0, increment: 0, placeholder: 'X' }]
      });
    }

    // Write sublimations file
    const outPath = path.join(OUT_DIR, `sublimations.${lang}.json`);
    await fsp.writeFile(outPath, JSON.stringify(sublimations, null, 2));
    console.log(`Written ${sublimations.length} sublimations to sublimations.${lang}.json`);
  }

  console.log("\n✅ DONE - All sublimation languages generated!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
