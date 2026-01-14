// scripts/build-wakfu-data.mjs
import { promises as fsp } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

const OUT_DIR = path.resolve("public/data");

function pickText(v) {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object") return v.en ?? v.fr ?? v.es ?? v.pt ?? Object.values(v)[0] ?? null;
  return null;
}

function pickId(o) {
  return (
    o?.id ??
    o?.definition?.id ??
    o?.definitionId ??
    o?.itemId ??
    o?.itemDefinitionId ??
    o?.resourceId ??
    o?.resourceDefinitionId ??
    null
  );
}

function pickTitle(o) {
  return (
    pickText(o?.title) ??
    pickText(o?.name) ??
    pickText(o?.definition?.title) ??
    pickText(o?.definition?.name) ??
    null
  );
}

function pickDescription(o) {
  return pickText(o?.description) ?? pickText(o?.definition?.description) ?? null;
}

// ✅ gfxId robusto: spesso sta in graphicParameters.gfxId
function pickGfxId(obj) {
  const o = obj ?? {};
  const d = o.definition ?? o;

  const gp =
    d?.graphicParameters ??
    d?.item?.graphicParameters ??
    d?.definition?.item?.graphicParameters ??
    null;

  const candidates = [
    gp?.gfxId,
    gp?.iconGfxId,
    gp?.iconId,
    gp?.smallIconId,
    gp?.bigIconId,

    d?.iconGfxId,
    d?.iconId,
    d?.smallIconId,
    d?.bigIconId,
    d?.itemGfxId,
    d?.gfxId,
    d?.baseGfxId,
    d?.graphicId,
    d?.imageId,

    d?.collectGfxId,
    o?.collectGfxId,
  ];

  for (const v of candidates) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

// ✅ rarity robusta: items.json ha baseParameters.rarity
function pickRarity(obj) {
  const o = obj ?? {};
  const d = o.definition ?? o;

  const candidates = [
    d?.rarity,
    d?.rarityId,
    d?.quality,
    d?.properties?.rarity,
    d?.baseParameters?.rarity,
    d?.item?.rarity,
    d?.item?.baseParameters?.rarity,
    o?.rarity,
  ];

  for (const v of candidates) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

async function fetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}\n${text.slice(0, 200)}`);
  return JSON.parse(text);
}

/**
 * Stream parse JSON array huge: extract top-level objects "{...}" and JSON.parse.
 * Filter by neededSet
 */
async function streamCompactItems(url, neededSet, sourceLabel) {
  const res = await fetch(url);
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} for ${url}\n${t.slice(0, 200)}`);
  }

  const stream = Readable.fromWeb(res.body);
  stream.setEncoding("utf8");

  let inString = false,
    escape = false,
    depth = 0;
  let buf = "";
  const out = [];
  let parsed = 0;
  let matched = 0;

  function flushObject(s) {
    parsed++;
    let obj;
    try {
      obj = JSON.parse(s);
    } catch {
      return;
    }

    const id = Number(pickId(obj));
    if (!id || !neededSet.has(id)) return;

    const title = pickTitle(obj);
    const description = pickDescription(obj);
    const gfxId = pickGfxId(obj);
    const rarity = pickRarity(obj);

    out.push({
      id,
      name: title ?? `#${id}`,
      description: description ?? null,
      gfxId: gfxId != null ? Number(gfxId) : null,
      rarity: rarity != null ? Number(rarity) : null,
      source: sourceLabel,
    });
    matched++;
  }

  function onChar(ch) {
    if (depth === 0) {
      if (ch === "{") {
        depth = 1;
        buf = "{";
      }
      return;
    }

    buf += ch;

    if (inString) {
      if (escape) {
        escape = false;
        return;
      }
      if (ch === "\\") {
        escape = true;
        return;
      }
      if (ch === '"') {
        inString = false;
        return;
      }
      return;
    } else {
      if (ch === '"') {
        inString = true;
        return;
      }
      if (ch === "{") {
        depth += 1;
        return;
      }
      if (ch === "}") {
        depth -= 1;
        if (depth === 0) {
          flushObject(buf);
          buf = "";
        }
      }
    }
  }

  for await (const chunk of stream) {
    for (let i = 0; i < chunk.length; i++) onChar(chunk[i]);
  }

  return { out, parsed, matched };
}

async function main() {
  await fsp.mkdir(OUT_DIR, { recursive: true });

  const cfg = await fetchJson("https://wakfu.cdn.ankama.com/gamedata/config.json");
  const version = cfg.version;
  if (!version) throw new Error("No version in config.json");

  const base = `https://wakfu.cdn.ankama.com/gamedata/${version}`;
  console.log("Wakfu version:", version);

  console.log("Downloading recipes.json ...");
  const recipesRaw = await fetchJson(`${base}/recipes.json`);

  console.log("Downloading recipeIngredients.json ...");
  const recipeIngRaw = await fetchJson(`${base}/recipeIngredients.json`);

  console.log("Downloading recipeResults.json ...");
  const recipeResRaw = await fetchJson(`${base}/recipeResults.json`);

  // ingredients by recipeId
  const ingByRecipe = new Map();
  for (const row of recipeIngRaw) {
    const recipeId = row?.recipeId ?? row?.definition?.recipeId ?? row?.recipeDefinitionId;
    const itemId = row?.itemId ?? row?.definition?.itemId ?? row?.ingredientId;
    const qty = row?.quantity ?? row?.qty ?? row?.definition?.quantity;
    if (!recipeId || !itemId || !qty) continue;

    const rid = Number(recipeId);
    const arr = ingByRecipe.get(rid) ?? [];
    arr.push({ itemId: Number(itemId), qty: Number(qty) });
    ingByRecipe.set(rid, arr);
  }

  // results by recipeId (first one)
  const resByRecipe = new Map();
  for (const row of recipeResRaw) {
    const recipeId = row?.recipeId ?? row?.definition?.recipeId ?? row?.recipeDefinitionId;
    const itemId =
      row?.productedItemId ??
      row?.productedItemDefinitionId ??
      row?.itemId ??
      row?.definition?.itemId ??
      row?.resultItemId;
    const qty =
      row?.productedItemQuantity ??
      row?.quantity ??
      row?.qty ??
      row?.definition?.quantity ??
      row?.resultQty ??
      1;

    if (!recipeId || !itemId) continue;

    const rid = Number(recipeId);
    if (!resByRecipe.has(rid)) {
      resByRecipe.set(rid, { resultItemId: Number(itemId), resultQty: Number(qty) || 1 });
    }
  }

  // build recipes.compact + needed ids
  const neededItemIds = new Set();
  const recipesCompact = [];

  for (const r of recipesRaw) {
    const id = pickId(r);
    if (!id) continue;

    const rid = Number(id);
    const res = resByRecipe.get(rid);
    if (!res) continue;

    const ingredients = ingByRecipe.get(rid) ?? [];
    recipesCompact.push({
      id: rid,
      resultItemId: res.resultItemId,
      resultQty: res.resultQty,
      ingredients,
    });

    neededItemIds.add(res.resultItemId);
    for (const ing of ingredients) neededItemIds.add(ing.itemId);
  }

  await fsp.writeFile(path.join(OUT_DIR, "recipes.compact.json"), JSON.stringify(recipesCompact));
  await fsp.writeFile(path.join(OUT_DIR, "needed_item_ids.json"), JSON.stringify([...neededItemIds]));
  await fsp.writeFile(
    path.join(OUT_DIR, "wakfu_version.json"),
    JSON.stringify({ version, generatedAt: new Date().toISOString() }, null, 2)
  );

  console.log("recipes.compact:", recipesCompact.length);
  console.log("needed item ids:", neededItemIds.size);

  // Sources on CDN
  const sources = ["items", "jobsItems", "resources", "collectibleResources"];

  const itemById = new Map(); // id -> best record

  const score = (x) =>
    (x ? (x.name && !String(x.name).startsWith("#") ? 2 : 0) + (x.gfxId ? 1 : 0) + (x.rarity ? 1 : 0) : 0);

  for (const s of sources) {
    const url = `${base}/${s}.json`;
    console.log(`Streaming ${s}.json and filtering ...`);

    const { out, parsed, matched } = await streamCompactItems(url, neededItemIds, s);
    console.log(`${s}: parsed=${parsed} matched=${matched}`);

    for (const it of out) {
      const prev = itemById.get(it.id);
      if (!prev || score(it) > score(prev)) itemById.set(it.id, it);
    }
  }

  const itemsCompact = [...itemById.values()].sort((a, b) => a.id - b.id);
  const missing = [...neededItemIds].filter((id) => !itemById.has(id));
  const placeholders = itemsCompact.filter((x) => String(x.name || "").startsWith("#")).length;

  await fsp.writeFile(path.join(OUT_DIR, "items.compact.json"), JSON.stringify(itemsCompact));
  await fsp.writeFile(path.join(OUT_DIR, "missing_item_ids.json"), JSON.stringify(missing));

  console.log("items.compact:", itemsCompact.length);
  console.log("missing item ids:", missing.length);
  console.log("placeholder names (#id):", placeholders);
  console.log("DONE ✅");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
