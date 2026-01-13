// src/lib/wakfuData.ts
export type CompactItem = {
  id: number;
  name: string;
  description?: string | null;
  gfxId?: number | null; // IMPORTANT: serve per icone corrette
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

let _cache: WakfuData | null = null;

export async function loadWakfuData(): Promise<WakfuData> {
  if (_cache) return _cache;

  const [items, recipes] = await Promise.all([
    fetch("/data/items.compact.json").then((r) => r.json()) as Promise<CompactItem[]>,
    fetch("/data/recipes.compact.json").then((r) => r.json()) as Promise<CompactRecipe[]>,
  ]);

  const itemsById = new Map<number, CompactItem>();
  for (const it of items) itemsById.set(it.id, it);

  const recipesByResultId = new Map<number, CompactRecipe[]>();
  for (const rec of recipes) {
    const arr = recipesByResultId.get(rec.resultItemId) ?? [];
    arr.push(rec);
    recipesByResultId.set(rec.resultItemId, arr);
  }

  _cache = { items, recipes, itemsById, recipesByResultId };
  return _cache;
}

/**
 * URL icona.
 * Nota: l’URL Ankama usa (quasi sempre) gfxId / iconId, NON itemId.
 * Se gfxId non c’è, facciamo fallback su itemId ma può risultare sbagliato.
 */
export function getItemIconUrl(
  itemId: number,
  provider: "ankama" | "wakassets" = "ankama",
  gfxId?: number | null,
  size: 115 | 64 = 115
) {
  if (provider === "ankama") {
    const id = (gfxId && gfxId > 0 ? gfxId : itemId);
    return `https://static.ankama.com/wakfu/portal/game/item/${size}/${id}.png`;
  }

  // Fallback community pack (spesso basato su itemId)
  return `https://vertylo.github.io/wakassets/items/${itemId}.png`;
}
