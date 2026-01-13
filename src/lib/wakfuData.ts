export type CompactItem = {
  id: number;
  name: string;
  description: string | null;
  gfxId: number | null;
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

let _cache: Promise<WakfuData> | null = null;

export async function loadWakfuData(): Promise<WakfuData> {
  if (_cache) return _cache;

  _cache = (async () => {
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

    return { items, recipes, itemsById, recipesByResultId };
  })();

  return _cache;
}

/**
 * Costruisce URL icona.
 * IMPORTANTISSIMO: per Ankama devi usare gfxId (non itemId).
 */
export function getItemIconUrl(
  itemOrId: number | CompactItem,
  provider: "ankama" | "wakassets" = "ankama"
) {
  const id = typeof itemOrId === "number" ? itemOrId : itemOrId.id;
  const gfxId = typeof itemOrId === "number" ? null : itemOrId.gfxId;

  if (provider === "wakassets") {
    // fallback community (non sempre completo)
    return `https://vertylo.github.io/wakassets/items/${id}.png`;
  }

  // Ankama: usa gfxId se esiste
  // Path tipico usato dal portale Wakfu: /wakfu/portal/game/item/115/<gfxId>.png
  // 115 = size folder che spesso funziona bene.
  if (gfxId && gfxId > 0) {
    return `https://static.ankama.com/wakfu/portal/game/item/115/${gfxId}.png`;
  }

  // fallback estremo (se gfxId manca)
  return `https://static.ankama.com/wakfu/portal/game/item/115/${id}.png`;
}
