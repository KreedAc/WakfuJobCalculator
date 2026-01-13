// src/lib/wakfuData.ts
export type CompactItem = {
  id: number;
  name: string;
  description?: string | null;

  // usato per le icone: se presente, va preferito all'id
  gfxId?: number | null;

  // rarità numerica wakfu
  rarity?: number | null;

  // debug/origine (items, jobsItems, etc.)
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
  if (!res.ok) throw new Error(`Failed fetch ${url}: HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export async function loadWakfuData(): Promise<WakfuData> {
  // Vite serve /public come root
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

/**
 * Icone:
 * - static.ankama.com: per molti item funziona SOLO usando gfxId (l'id spesso dà 403)
 * - wakassets: funziona spesso anche lì con gfxId
 */
export function getItemIconUrl(
  itemOrId: CompactItem | number,
  provider: "ankama" | "wakassets" = "ankama"
): string {
  const it = typeof itemOrId === "number" ? null : itemOrId;
  const id = typeof itemOrId === "number" ? itemOrId : itemOrId.id;

  // IMPORTANTISSIMO: preferisci gfxId quando presente
  const key = it?.gfxId ?? id;

  if (provider === "ankama") {
    return `https://static.ankama.com/wakfu/portal/game/item/115/${key}.png`;
  }

  // wakassets
  return `https://vertylo.github.io/wakassets/items/${key}.png`;
}

export function rarityInfo(
  rarity: number | null | undefined
): { label: string; cls: string } {
  switch (rarity) {
    case 1:
      return {
        label: "Unusual",
        cls: "border-slate-300/30 text-slate-100/90 bg-slate-400/10",
      };
    case 2:
      return {
        label: "Rare",
        cls: "border-emerald-300/30 text-emerald-100/90 bg-emerald-400/10",
      };
    case 3:
      return {
        label: "Mythical",
        cls: "border-orange-300/30 text-orange-100/90 bg-orange-400/10",
      };
    case 4:
      return {
        label: "Legendary",
        cls: "border-yellow-300/30 text-yellow-100/90 bg-yellow-400/10",
      };
    case 5:
      return {
        label: "Relic",
        cls: "border-violet-300/30 text-violet-100/90 bg-violet-400/10",
      };
    case 6:
      return {
        label: "Souvenir",
        cls: "border-sky-300/30 text-sky-100/90 bg-sky-400/10",
      };
    case 7:
      return {
        label: "Epic",
        cls: "border-fuchsia-300/30 text-fuchsia-100/90 bg-fuchsia-400/10",
      };
    default:
      return {
        label: `Rarity ${rarity ?? "?"}`,
        cls: "border-white/15 text-emerald-50/80 bg-white/5",
      };
  }
}