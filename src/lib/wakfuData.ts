export type CompactItem = {
  id: number;
  name: string;
  description: string | null;
  gfxId?: number | null;
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
  ready: true;
};

let _cache: Promise<WakfuData> | null = null;

function baseUrl(path: string) {
  // supporta deploy anche in sottocartelle
  const base = (import.meta as any).env?.BASE_URL ?? "/";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export async function loadWakfuData(): Promise<WakfuData> {
  if (_cache) return _cache;

  _cache = (async () => {
    const [items, recipes] = await Promise.all([
      fetch(baseUrl("data/items.compact.json")).then((r) => r.json()) as Promise<CompactItem[]>,
      fetch(baseUrl("data/recipes.compact.json")).then((r) => r.json()) as Promise<CompactRecipe[]>,
    ]);

    const itemsById = new Map<number, CompactItem>();
    for (const it of items) itemsById.set(it.id, it);

    const recipesByResultId = new Map<number, CompactRecipe[]>();
    for (const r of recipes) {
      const arr = recipesByResultId.get(r.resultItemId) ?? [];
      arr.push(r);
      recipesByResultId.set(r.resultItemId, arr);
    }

    return { items, recipes, itemsById, recipesByResultId, ready: true as const };
  })();

  return _cache;
}

/**
 * URL icona item:
 * - provider "ankama": prova URL ufficiale (spesso funziona)
 * - provider "wakassets": fallback community assets
 *
 * Nota: qui usiamo l'ID item. Non serve gfxId.
 */
export function getItemIconUrl(itemId: number, provider: "ankama" | "wakassets" = "ankama") {
  if (provider === "ankama") {
    // path comune usato da molte tool community
    return `https://static.ankama.com/wakfu/portal/game/item/115/${itemId}.png`;
  }
  return `https://vertylo.github.io/wakassets/items/${itemId}.png`;
}
