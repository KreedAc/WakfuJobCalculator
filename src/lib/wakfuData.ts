// src/lib/wakfuData.ts
export type CompactItem = {
  id: number;
  name: string;
  description?: string | null;
  gfxId?: number | null;
  rarity?: number | null; // 1..7 (o null)
  source?: string;
};

export type CompactRecipe = {
  id: number;
  resultItemId: number;
  resultQty: number;
  ingredients: { itemId: number; qty: number }[];
};

export type WakfuData = {
  items: CompactItem[];
  recipes: CompactRecipe[];
  itemsById: Map<number, CompactItem>;
  recipesByResultId: Map<number, CompactRecipe[]>;
};

let cache: WakfuData | null = null;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} while fetching ${url}`);
  }
  return res.json() as Promise<T>;
}

export async function loadWakfuData(): Promise<WakfuData> {
  if (cache) return cache;

  const [items, recipes] = await Promise.all([
    fetchJson<CompactItem[]>("/data/items.compact.json"),
    fetchJson<CompactRecipe[]>("/data/recipes.compact.json"),
  ]);

  const itemsById = new Map<number, CompactItem>();
  for (const it of items) itemsById.set(it.id, it);

  const recipesByResultId = new Map<number, CompactRecipe[]>();
  for (const r of recipes) {
    const arr = recipesByResultId.get(r.resultItemId) ?? [];
    arr.push(r);
    recipesByResultId.set(r.resultItemId, arr);
  }

  cache = { items, recipes, itemsById, recipesByResultId };
  return cache;
}

/**
 * Icon URL
 * NOTA: per Wakfu spesso il PNG esiste con gfxId (non con id).
 * Quindi noi passiamo qui un NUMBER che può essere id oppure gfxId.
 */
export function getItemIconUrl(idOrGfxId: number, provider: "ankama" | "wakassets" = "ankama") {
  if (provider === "ankama") {
    return `https://static.ankama.com/wakfu/portal/game/item/115/${idOrGfxId}.png`;
  }
  return `https://vertylo.github.io/wakassets/items/${idOrGfxId}.png`;
}