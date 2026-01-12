export type CompactItem = {
  id: number;
  name: string;
  description: string | null;
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

let _cache: Promise<WakfuData> | null = null;

/**
 * Carica i JSON da /public/data/* (serviti come /data/* in Vite).
 * Aggiunge cache-busting per evitare che Bolt/Vite servano dati vecchi.
 */
export function loadWakfuData(): Promise<WakfuData> {
  if (_cache) return _cache;

  const bust = Date.now();

  _cache = (async () => {
    const [items, recipes] = await Promise.all([
      fetch(`/data/items.compact.json?v=${bust}`).then((r) => r.json()) as Promise<CompactItem[]>,
      fetch(`/data/recipes.compact.json?v=${bust}`).then((r) => r.json()) as Promise<CompactRecipe[]>,
    ]);

    const itemsById = new Map<number, CompactItem>();
    for (const it of items) itemsById.set(it.id, it);

    const recipesByResultId = new Map<number, CompactRecipe[]>();
    for (const rec of recipes) {
      const arr = recipesByResultId.get(rec.resultItemId) ?? [];
      arr.push(rec);
      recipesByResultId.set(rec.resultItemId, arr);
    }

    return { items, recipes, itemsById, recipesByResultId };
  })();

  return _cache;
}

/**
 * Link icona esterna (in Opzione A non la carichiamo in pagina, la apriamo in nuova tab).
 */
export function getItemIconUrl(itemId: number, variant: "ankama" | "wakassets" = "ankama") {
  if (variant === "ankama") {
    return `https://static.ankama.com/wakfu/portal/game/item/115/${itemId}.png`;
  }
  return `https://vertylo.github.io/wakassets/items/${itemId}.png`;
}
