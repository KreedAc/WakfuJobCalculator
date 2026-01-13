// src/lib/wakfuData.ts
export type CompactItem = {
  id: number;
  name: string;
  description?: string | null;
  gfxId?: number | null;
  rarity?: number | null;
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

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return (await res.json()) as T;
}

export async function loadWakfuData(): Promise<WakfuData> {
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
}

export function getItemIconUrl(
  itemOrId: CompactItem | number,
  provider: "ankama" | "wakassets" = "ankama"
) {
  const id = typeof itemOrId === "number" ? itemOrId : itemOrId.id;
  const gfxId = typeof itemOrId === "number" ? null : (itemOrId.gfxId ?? null);

  // dalle tue prove: funziona con gfxId; fallback su id solo se non abbiamo altro
  const key = gfxId && Number.isFinite(gfxId) ? gfxId : id;

  if (provider === "ankama") {
    return `https://static.ankama.com/wakfu/portal/game/item/115/${key}.png`;
  }
  return `https://vertylo.github.io/wakassets/items/${key}.png`;
}

export function rarityInfo(rarity: number | null | undefined) {
  switch (rarity ?? null) {
    case 1:
      return { label: "Unusual", cls: "text-slate-200/90 bg-white/10 border-white/15" };
    case 2:
      return { label: "Rare", cls: "text-emerald-200 bg-emerald-400/10 border-emerald-300/20" };
    case 3:
      return { label: "Mythical", cls: "text-orange-200 bg-orange-400/10 border-orange-300/20" };
    case 4:
      return { label: "Legendary", cls: "text-yellow-200 bg-yellow-400/10 border-yellow-300/20" };
    default:
      return { label: "—", cls: "text-emerald-200/50 bg-black/10 border-emerald-300/10" };
  }
}
