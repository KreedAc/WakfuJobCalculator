import { promises as fsp } from "node:fs";
import { Readable } from "node:stream";

function asArray(x) {
  return Array.isArray(x)
    ? x
    : Array.isArray(x?.data)
      ? x.data
      : Array.isArray(x?.entries)
        ? x.entries
        : Array.isArray(x?.elements)
          ? x.elements
          : [];
}

const pickRecipeId = (o) =>
  o?.id ?? o?.definition?.id ?? o?.recipeId ?? o?.definition?.recipeId ?? o?.recipeDefinitionId ?? o?.definitionId ?? null;

const pickRowRecipeId = (o) =>
  o?.recipeId ??
  o?.definition?.recipeId ??
  o?.recipeDefinitionId ??
  o?.definition?.recipeDefinitionId ??
  o?.definitionId ??
  null;

const pickIngItemId = (o) =>
  o?.itemId ?? o?.definition?.itemId ?? o?.ingredientId ?? o?.definition?.ingredientId ?? null;

const pickResItemId = (o) =>
  o?.productedItemId ??
  o?.definition?.productedItemId ??
  o?.resultItemId ??
  o?.definition?.resultItemId ??
  o?.itemId ??
  o?.definition?.itemId ??
  null;


const pickQty = (o) =>
  o?.productedItemQuantity ??
  o?.definition?.productedItemQuantity ??
  o?.quantity ??
  o?.qty ??
  o?.definition?.quantity ??
  o?.resultQty ??
  1;

const pickItemId = (o) => o?.id ?? o?.definition?.id ?? o?.definitionId ?? null;
const name = pickItemName(obj);         // spesso è null
const nameId = pickItemNameId(obj);
const lvl = pickItemLevel(obj);

// non scartare: salva sempre id + nameId
out.push({
  id,
  nameId: nameId != null ? Number(nameId) : null,
  level: typeof lvl === "number" ? lvl : undefined,
});

const pickItemNameId = (obj) =>
  obj?.nameId ??
  obj?.definition?.nameId ??
  obj?.titleId ??
  obj?.definition?.titleId ??
  null;

// deve esistere perché il tuo script lo usa.
// ritorna SEMPRE una stringa => niente più filtraggio a 0.
const pickItemName = (obj) => {
  const nid = pickItemNameId(obj);
  if (nid != null) return "#" + Number(nid);

  const id = obj?.id ?? obj?.definition?.id ?? obj?.definitionId ?? obj?.itemId;
  if (id != null) return "#" + Number(id);

  return "#unknown";
};


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

async function streamItemsAndFilter(url, neededSet) {
  const res = await fetch(url);
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} for ${url}\n${t.slice(0, 200)}`);
  }

  const stream = Readable.fromWeb(res.body);
  stream.setEncoding("utf8");

  let inStr = false, esc = false, depth = 0;
  let buf = "";
  const out = [];

  const flush = (s) => {
    try {
      const obj = JSON.parse(s);
      const id = Number(pickItemId(obj));
      if (!id || !neededSet.has(id)) return;

      const lvl = pickItemLevel(obj);
      out.push({ id, name: String(name), level: typeof lvl === "number" ? lvl : undefined });
    } catch {}
  };

  const onChar = (ch) => {
    if (depth === 0) {
      if (ch === "{") {
        depth = 1;
        buf = "{";
      }
      return;
    }

    buf += ch;

    if (inStr) {
      if (esc) { esc = false; return; }
      if (ch === "\\") { esc = true; return; }
      if (ch === '"') { inStr = false; return; }
      return;
    } else {
      if (ch === '"') { inStr = true; return; }
      if (ch === "{") { depth++; return; }
      if (ch === "}") {
        depth--;
        if (depth === 0) {
          flush(buf);
          buf = "";
        }
      }
    }
  };

  let bytes = 0;
  await new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      for (let i = 0; i < chunk.length; i++) onChar(chunk[i]);
      bytes += chunk.length;
      if (bytes > 50_000_000) { bytes = 0; process.stdout.write("."); }
    });
    stream.on("end", resolve);
    stream.on("error", reject);
  });
  process.stdout.write("\n");

  return out;
}

async function main() {
  await fsp.mkdir("public/data", { recursive: true });

  const cfg = await fetchJson("https://wakfu.cdn.ankama.com/gamedata/config.json");
  const version = cfg.version;
  if (!version) throw new Error("No version in config.json");
  console.log("Wakfu version:", version);

  const base = `https://wakfu.cdn.ankama.com/gamedata/${version}`;

  console.log("Downloading recipes.json ...");
  const recipesRaw = asArray(await fetchJson(`${base}/recipes.json`));

  console.log("Downloading recipeIngredients.json ...");
  const ingRaw = asArray(await fetchJson(`${base}/recipeIngredients.json`));

  console.log("Downloading recipeResults.json ...");
  const resRaw = asArray(await fetchJson(`${base}/recipeResults.json`));

  const ingByRecipe = new Map();
  for (const row of ingRaw) {
    const rid = Number(pickRowRecipeId(row));
    const itemId = Number(pickIngItemId(row));
    const qty = Number(pickQty(row));
    if (!rid || !itemId || !qty) continue;
    const arr = ingByRecipe.get(rid) ?? [];
    arr.push({ itemId, qty });
    ingByRecipe.set(rid, arr);
  }

  const resByRecipe = new Map();
  for (const row of resRaw) {
    const rid = Number(pickRowRecipeId(row));
    const itemId = Number(pickResItemId(row));
    const qty = Number(pickQty(row)) || 1;
    if (!rid || !itemId) continue;
    if (!resByRecipe.has(rid)) resByRecipe.set(rid, { resultItemId: itemId, resultQty: qty });
  }

  const neededItemIds = new Set();
  const recipesCompact = [];

  for (const r of recipesRaw) {
    const rid = Number(pickRecipeId(r));
    if (!rid) continue;

    const rr = resByRecipe.get(rid);
    if (!rr) continue;

    const ingredients = ingByRecipe.get(rid) ?? [];
    recipesCompact.push({
      id: rid,
      resultItemId: rr.resultItemId,
      resultQty: rr.resultQty,
      ingredients,
    });

    neededItemIds.add(rr.resultItemId);
    for (const ing of ingredients) neededItemIds.add(ing.itemId);
  }

  await fsp.writeFile("public/data/recipes.compact.json", JSON.stringify(recipesCompact));
  await fsp.writeFile("public/data/needed_item_ids.json", JSON.stringify([...neededItemIds]));
  await fsp.writeFile("public/data/wakfu_version.json", JSON.stringify({ version, generatedAt: new Date().toISOString() }, null, 2));

  console.log("recipes.compact:", recipesCompact.length);
  console.log("needed item ids:", neededItemIds.size);

  if (recipesCompact.length === 0) {
    console.log("⚠️ recipesCompact = 0. Samples for debug:");
    console.log("recipes sample:", recipesRaw[0]);
    console.log("results sample:", resRaw[0]);
    console.log("ingredients sample:", ingRaw[0]);
    return;
  }

  console.log("Streaming items.json and filtering ...");
  const itemsCompact = await streamItemsAndFilter(`${base}/items.json`, neededItemIds);

  await fsp.writeFile("public/data/items.compact.json", JSON.stringify(itemsCompact));
  console.log("items.compact:", itemsCompact.length);

  console.log("DONE ✅  Files in public/data/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
