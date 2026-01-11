
import fs2 from "node:fs";
import { promises as fsp } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

function pickId(obj){ return obj?.id ?? obj?.definition?.id ?? obj?.definitionId ?? null; }
function pickName(obj){ return obj?.name ?? obj?.title ?? obj?.definition?.name ?? obj?.definition?.title ?? null; }
function pickLevel(obj){ return obj?.level ?? obj?.definition?.level ?? obj?.definition?.itemLevel ?? undefined; }

async function fetchJson(url){
  const res = await fetch(url);
  const text = await res.text();
  if(!res.ok) throw new Error("HTTP "+res.status+" for "+url+"
"+text.slice(0,200));
  try { return JSON.parse(text); }
  catch { throw new Error("Non-JSON response from "+url+"
"+text.slice(0,200)); }
}

async function streamItemsAndFilter(url, neededSet){
  const res = await fetch(url);
  if(!res.ok){
    const t = await res.text().catch(()=> "");
    throw new Error("HTTP "+res.status+" for "+url+"
"+t.slice(0,200));
  }

  const stream = Readable.fromWeb(res.body);

  let inString=false, escape=false;
  let depth=0;
  let buf="";

  const out = [];

  function onChar(ch){
    if(depth===0){
      if(ch==="{"){
        depth=1; buf="{";
        return;
      }
      return;
    }

    buf += ch;

    if(inString){
      if(escape){ escape=false; return; }
      if(ch==="\"){ escape=true; return; }
      if(ch==="\""){ inString=false; return; }
      return;
    } else {
      if(ch==="\""){ inString=true; return; }
      if(ch==="{"){ depth++; return; }
      if(ch==="}"){
        depth--;
        if(depth===0){
          // oggetto completo
          try{
            const obj = JSON.parse(buf);
            const id = Number(pickId(obj));
            if(id && neededSet.has(id)){
              const name = pickName(obj);
              if(name){
                const lvl = pickLevel(obj);
                out.push({ id, name: String(name), level: (typeof lvl==="number"? lvl : undefined) });
              }
            }
          }catch{}
          buf="";
        }
      }
    }
  }

  for await (const chunk of stream){
    const s = chunk.toString("utf8");
    for(let i=0;i<s.length;i++) onChar(s[i]);
  }

  return out;
}

async function main(){
  await fsp.mkdir("public/data", { recursive:true });

  const cfg = await fetchJson("https://wakfu.cdn.ankama.com/gamedata/config.json");
  const version = cfg.version;
  if(!version) throw new Error("No version in config.json");
  console.log("Wakfu version:", version);

  const base = "https://wakfu.cdn.ankama.com/gamedata/" + version;

  // Questi tre sono relativamente più piccoli
  console.log("Downloading recipes...");
  const recipesRaw = await fetchJson(base + "/recipes.json");
  console.log("Downloading recipeIngredients...");
  const recipeIngRaw = await fetchJson(base + "/recipeIngredients.json");
  console.log("Downloading recipeResults...");
  const recipeResRaw = await fetchJson(base + "/recipeResults.json");

  // Index ingredienti per recipeId
  const ingByRecipe = new Map();
  for(const row of recipeIngRaw){
    const recipeId = row?.recipeId ?? row?.definition?.recipeId ?? row?.recipeDefinitionId;
    const itemId = row?.itemId ?? row?.definition?.itemId ?? row?.ingredientId;
    const qty = row?.quantity ?? row?.qty ?? row?.definition?.quantity;
    if(!recipeId || !itemId || !qty) continue;
    const rid = Number(recipeId);
    const arr = ingByRecipe.get(rid) ?? [];
    arr.push({ itemId: Number(itemId), qty: Number(qty) });
    ingByRecipe.set(rid, arr);
  }

  // Index risultati per recipeId (MVP: prima occorrenza)
  const resByRecipe = new Map();
  for(const row of recipeResRaw){
    const recipeId = row?.recipeId ?? row?.definition?.recipeId ?? row?.recipeDefinitionId;
    const itemId = row?.itemId ?? row?.definition?.itemId ?? row?.resultItemId;
    const qty = row?.quantity ?? row?.qty ?? row?.definition?.quantity ?? row?.resultQty ?? 1;
    if(!recipeId || !itemId) continue;
    const rid = Number(recipeId);
    if(!resByRecipe.has(rid)){
      resByRecipe.set(rid, { resultItemId: Number(itemId), resultQty: Number(qty) || 1 });
    }
  }

  // Costruisci recipes.compact e set di itemId necessari
  const neededItemIds = new Set();
  const recipesCompact = [];

  for(const r of recipesRaw){
    const id = pickId(r);
    if(!id) continue;
    const rid = Number(id);
    const res = resByRecipe.get(rid);
    if(!res) continue;
    const ingredients = ingByRecipe.get(rid) ?? [];

    recipesCompact.push({
      id: rid,
      resultItemId: res.resultItemId,
      resultQty: res.resultQty,
      ingredients
    });

    neededItemIds.add(res.resultItemId);
    for(const ing of ingredients) neededItemIds.add(ing.itemId);
  }

  await fsp.writeFile("public/data/recipes.compact.json", JSON.stringify(recipesCompact));
  console.log("Wrote public/data/recipes.compact.json ->", recipesCompact.length, "recipes");
  console.log("Need item IDs:", neededItemIds.size);

  // Ora scarica items.json (enorme) e filtra in streaming
  console.log("Streaming items.json and filtering...");
  const itemsCompact = await streamItemsAndFilter(base + "/items.json", neededItemIds);

  await fsp.writeFile("public/data/items.compact.json", JSON.stringify(itemsCompact));
  await fsp.writeFile("public/data/wakfu_version.json", JSON.stringify({ version, generatedAt: new Date().toISOString() }, null, 2));

  console.log("Wrote public/data/items.compact.json ->", itemsCompact.length, "items");
  console.log("Wrote public/data/wakfu_version.json");
  console.log("DONE");
}

main().catch(e=>{ console.error(e); process.exit(1); });
