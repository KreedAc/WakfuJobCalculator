import { promises as fsp } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

const OUT_DIR = path.resolve("public/data");

// ---------- helpers ----------
function pickText(v) {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object") {
    // prefer EN, poi FR/ES/PT, poi il primo valore
    return v.en ?? v.fr ?? v.es ?? v.pt ?? Object.values(v)[0] ?? null;
  }
  return null;
}

function pickId(obj) {
  // molti file hanno forme diverse
  const o = obj ?? {};
  const d = o.definition ?? {};

  // caso IMPORTANTISSIMO per items.json: definition.item.id
  const defItem = d.item ?? d?.itemDefinition ?? null;

  return (
    o.id ??
    o.definitionId ??
    o.itemId ??
    o.itemDefinitionId ??
    o.resourceId ??
    o.resourceDefinitionId ??
    d.id ??
    defItem?.id ??
    defItem?.definitionId ??
    null
  );
}

function pickRarity(obj) {
  const o = obj ?? {};
  const d = o.definition ?? o;

  // dove può vivere la rarity (dipende dal file)
  const candidates = [
    d?.rarity,
    d?.rarityId,
    d?.item?.rarity,
    d?.item?.rarityId,
    d?.properties?.rarity,
    d?.properties?.rarityId,
  ];

  for (const v of candidates) {
    if (v == null) continue;
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim()) return v.trim();
  }

  return null;
}

function pickTitle(obj) {
  const o = obj ?? {};
  const d = o.definition ?? {};
  const defItem = d.item ?? null;

  return (
    pickText(o.title) ??
    pickText(o.name) ??
    pickText(o.itemTitle) ??
    pickText(d.title) ??
    pickText(d.name) ??
    pickText(defItem?.title) ??
    pickText(defItem?.name) ??
    null
  );
}

function pickDescription(obj) {
  const o = obj ?? {};
  const d = o.definition ?? {};
  const defItem = d.item ?? null;

  return (
    pickText(o.description) ??
    pickText(d.description) ??
    pickText(defItem?.description) ??
    null
  );
}

function pickGfxId(obj) {
  const o = obj ?? {};
  const def = o.definition ?? null;

  // Nei file Ankama spesso l'icona sta qui:
  // items.json: definition.item.graphicParameters
  const gp =
    def?.item?.graphicParameters ??
    def?.graphicParameters ??
    o?.graphicParameters ??
    null;

  // Alcuni dataset usano campi alternativi (resources / collectibleResources / jobsItems)
  const candidates = [
    // standard più comune
    gp?.iconGfxId,
    gp?.gfxId,
    gp?.iconId,
    gp?.smallIconId,
    gp?.bigIconId,
    gp?.itemGfxId,
    gp?.imageId,

    // varianti più “piatte”
    def?.iconGfxId,
    def?.gfxId,
    def?.iconId,
    def?.smallIconId,
    def?.bigIconId,
    def?.itemGfxId,
    def?.baseGfxId,
    def?.graphicId,
    def?.imageId,

    o?.iconGfxId,
    o?.gfxId,
    o?.iconId,
    o?.smallIconId,
    o?.bigIconId,
    o?.itemGfxId,
    o?.baseGfxId,
    o?.graphicId,
    o?.imageId,

    // collectibleResources
    def?.collectGfxId,
    o?.collectGfxId,
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
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response from ${url}\n${text.slice(0, 200)}`);
  }
}

/**
 * Stream parse di un JSON array enorme: estrae oggetti top-level { ... }.
 * Filtra per neededSet e ritorna compact items.
 */
async function streamCompactItems(url, neededSet, sourceLabel) {
  const res = await fetch(url);
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} for ${url}\n${t.slice(0, 200)}`);
  }

  const stream = Readable.fromWeb(res.body);
  stream.setEncoding("utf8");

  let inString = false, escape = false, depth = 0;
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
  rarity,                 // ✅ AGGIUNTO
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

// ---------- main ----------
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

  // ingredienti per recipeId
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

  // risultato per recipeId (prendi il primo)
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

  // IMPORTANTISSIMO:
  // 1) prima items.json (testi quasi sempre migliori)
  // 2) poi fallback
  const sources = ["items", "jobsItems", "resources", "collectibleResources"];

  const itemById = new Map(); // id -> best record

  const score = (x) => {
    if (!x) return 0;
    const hasRealName = x.name && !x.name.startsWith("#");
    return (hasRealName ? 10 : 0) + (x.description ? 2 : 0) + (x.gfxId ? 1 : 0);
  };

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

  await fsp.writeFile(path.join(OUT_DIR, "items.compact.json"), JSON.stringify(itemsCompact));
  await fsp.writeFile(path.join(OUT_DIR, "missing_item_ids.json"), JSON.stringify(missing));

  // mini report utile
  const placeholder = itemsCompact.filter((x) => x.name?.startsWith("#")).length;

  console.log("items.compact:", itemsCompact.length);
  console.log("missing item ids:", missing.length);
  console.log("placeholder names (#id):", placeholder);
  console.log("DONE ✅");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
