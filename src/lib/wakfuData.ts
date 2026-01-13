// src/lib/wakfuData.ts
export type CompactIngredient = { itemId: number; qty: number };

export type CompactRecipe = {
  id: number;
  resultItemId: number;
  resultQty: number;
  ingredients: CompactIngredient[];
};

export type CompactItem = {
  id: number;
  name: string;
  description?: string | null;
  gfxId?: number | null; // <-- IMPORTANTISSIMO: è quello da usare per le icone
  source?: string;
};

export type WakfuData = {
  items: CompactItem[];
  recipes: CompactRecipe[];
  itemsById: Map<number, CompactItem>;
  recipesByResultId: Map<number, CompactRecipe[]>;
};

let _cache: Promise<WakfuData> | null = null;

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return (await r.json()) as T;
}

export function loadWakfuData(): Promise<WakfuData> {
  if (_cache) return _cache;

  _cache = (async () => {
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

    return { items, recipes, itemsById, recipesByResultId };
  })();

  return _cache;
}

/**
 * Ritorna un URL icona.
 * NOTA: per wakassets l'ID è "gfxId" (se presente), non l'itemId.
 * Repo wakassets: https://vertylo.github.io/wakassets/{folder}/{ID}.png  :contentReference[oaicite:1]{index=1}
 */
export function getItemIconUrl(
  itemOrId: CompactItem | number,
  provider: "wakassets" | "ankama" = "wakassets"
) {
  const id = typeof itemOrId === "number" ? itemOrId : itemOrId.id;
  const gfxId =
    typeof itemOrId === "number"
      ? null
      : itemOrId.gfxId != null
        ? Number(itemOrId.gfxId)
        : null;

  // Per le icone: se abbiamo gfxId usiamo quello, altrimenti fallback su itemId
  const iconId = gfxId && Number.isFinite(gfxId) && gfxId > 0 ? gfxId : id;

  if (provider === "wakassets") {
    return `https://vertylo.github.io/wakassets/items/${iconId}.png`;
  }

  // Fallback alternativo (spesso non affidabile / può dare 403)
  return `https://static.ankama.com/wakfu/portal/game/item/115/${iconId}.png`;
}
