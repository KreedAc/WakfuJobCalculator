import fs from "node:fs";
import { Readable } from "node:stream";

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", Accept: "*/*" },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}\n${text.slice(0, 200)}`);
  return JSON.parse(text);
}

function asArray(x) {
  if (Array.isArray(x)) return x;
  if (Array.isArray(x?.data)) return x.data;
  if (Array.isArray(x?.entries)) return x.entries;
  if (Array.isArray(x?.elements)) return x.elements;
  return [];
}

// ---- recipes pickers (dal tuo sample funzionano) ----
function pickRecipeId(r) {
  return Number(r?.id ?? r?.recipeId ?? r?.definition?.id ?? r?.definitionId ?? 0) || 0;
}

function pickRowRecipeId(row) {
  return Number(row?.recipeId ?? row?.recipeDefinitionId ?? row?.definition?.recipeId ?? 0) || 0;
}

function pickIngItemId(row) {
  return Number(row?.itemId ?? row?.ingredientId ?? row?.definition?.itemId ?? 0) || 0;
}

function pickQty(row) {
  const v =
    row?.productedItemQuantity ??
    row?.definition?.productedItemQuantity ??
    row?.quantity ??
    row?.qty ??
    row?.definition?.quantity ??
    row?.resultQty ??
    1;
  return Number(v) || 0;
}

function pickResItemId(row) {
  return Number(
    row?.productedItemId ??
      row?.definition?.productedItemId ??
      row?.resultItemId ??
      row?.definition?.resultItemId ??
      row?.itemId ??
      row?.definition?.itemId ??
      0
  ) || 0;
}

// ---- items pickers (qui sta il problema: li rendiamo super robusti) ----
function pickItemId(obj) {
  // prova una lista ampia di percorsi tipici
  const candidates = [
    obj?.id,
    obj?.itemId,
    obj?.definitionId,
    obj?.definition?.id,
    obj?.definition?.itemId,
    obj?.definition?.definitionId,
    obj?.definition?.baseParameters?.id,
    obj?.definition?.baseParameters?.definitionId,
    obj?.definition?.item?.id,
  ];

  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
}

function pickItemNameId(obj) {
  const candidates = [
    obj?.nameId,
    obj?.definition?.nameId,
    obj?.titleId,
    obj?.definition?.titleId,
  ];
  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

function pickItemLevel(obj) {
  const candidates = [
    obj?.level,
    obj?.itemLevel,
    obj?.definition?.level,
    obj?.definition?.itemLevel,
  ];
  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return undefined;
}

function pickText(v) {
  if (typeof v === "string") return v;

  // alcuni dump usano oggetti tipo { text: "..." } o { value: "..." }
  if (v && typeof v === "object") {
    if (typeof v.text === "string") return v.text;
    if (typeof v.value === "string") return v.value;

    // a volte { en: "...", fr: "..." } o simili
    if (typeof v.en === "string") return v.en;
    if (typeof v.fr === "string") return v.fr;
    if (typeof v.it === "string") return v.it;

    // come fallback: prendi la prima stringa che trovi nell’oggetto
    for (const k of Object.keys(v)) {
      if (typeof v[k] === "string") return v[k];
    }
  }

  return null;
}


// Streaming parser: estrae ogni oggetto { ... } dell’array items.json
async function streamItemsAndFilter(url, neededSet) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", Accept: "*/*" },
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} for ${url}\n${t.slice(0, 200)}`);
  }

  const stream = Readable.fromWeb(res.body);
  stream.setEncoding("utf8");

  let inStr = false, esc = false, depth = 0;
  let buf = "";

  const out = [];
  let parsed = 0;
  let matched = 0;
  let debugPrinted = 0;
  const firstIds = [];

  function flushObject(s) {
    let obj;
    try {
      obj = JSON.parse(s);
    } catch {
      return;
    }

    parsed++;

    const id = pickItemId(obj);
    if (firstIds.length < 20) firstIds.push(id);

    // stampa solo i primissimi oggetti (per capire struttura)
    if (debugPrinted < 2) {
      debugPrinted++;
      console.log("DEBUG item keys:", Object.keys(obj));
      console.log("DEBUG id candidates -> picked:", id);
      console.log("DEBUG nameId:", pickItemNameId(obj), "level:", pickItemLevel(obj));
      // non stampo l’oggetto intero (può essere enorme)
    }

    if (!id || !neededSet.has(id)) return;

    matched++;
    
    const t = pickText(obj?.title);
const d = pickText(obj?.description);

out.push({
  id,
  name: t ?? ("#" + id),
  description: d,
  level: lvl,
});

  function onChar(ch) {
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
          flushObject(buf);
          buf = "";
        }
      }
    }
  }

  let processed = 0;
  for await (const chunk of stream) {
    for (let i = 0; i < chunk.length; i++) onChar(chunk[i]);
    processed += chunk.length;
    if (processed > 50_000_000) { processed = 0; process.stdout.write("."); }
  }
  process.stdout.write("\n");

  console.log("DEBUG parsed objects:", parsed);
  console.log("DEBUG matched objects:", matched);
  console.log("DEBUG first 20 picked ids:", firstIds);

  return out;
}

async function main() {
  ensureDir("public/data");

  const cfg = await fetchJson("https://wakfu.cdn.ankama.com/gamedata/config.json");
  const version = cfg.version;
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
    const rid = pickRowRecipeId(row);
    const itemId = pickIngItemId(row);
    const qty = pickQty(row);
    if (!rid || !itemId || !qty) continue;
    const arr = ingByRecipe.get(rid) ?? [];
    arr.push({ itemId, qty });
    ingByRecipe.set(rid, arr);
  }

  const resByRecipe = new Map();
  for (const row of resRaw) {
    const rid = pickRowRecipeId(row);
    const itemId = pickResItemId(row);
    const qty = pickQty(row) || 1;
    if (!rid || !itemId) continue;
    if (!resByRecipe.has(rid)) resByRecipe.set(rid, { resultItemId: itemId, resultQty: qty });
  }

  const neededItemIds = new Set();
  const recipesCompact = [];

  for (const r of recipesRaw) {
    const rid = pickRecipeId(r);
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

  fs.writeFileSync("public/data/recipes.compact.json", JSON.stringify(recipesCompact));
  fs.writeFileSync("public/data/needed_item_ids.json", JSON.stringify([...neededItemIds]));
  fs.writeFileSync("public/data/wakfu_version.json", JSON.stringify({ version, generatedAt: new Date().toISOString() }, null, 2));

  console.log("recipes.compact:", recipesCompact.length);
  console.log("needed item ids:", neededItemIds.size);

  console.log("Streaming items.json and filtering ...");
  const itemsCompact = await streamItemsAndFilter(`${base}/items.json`, neededItemIds);

  fs.writeFileSync("public/data/items.compact.json", JSON.stringify(itemsCompact));
  console.log("\nitems.compact:", itemsCompact.length);
  console.log("DONE ✅");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
