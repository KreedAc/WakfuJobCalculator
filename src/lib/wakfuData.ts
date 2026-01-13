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
  gfxId?: number | null;
  rarity?: number | null;
  source?: string;
};

export type WakfuData = {
  items: CompactItem[];
  recipes: CompactRecipe[];
  itemsById: Map<number, CompactItem>;
  recipesByResultId: Map<number, CompactRecipe[]>;
};

let _cache: WakfuData | null = null;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return (await res.json()) as T;
}

export async function loadWakfuData(): Promise<WakfuData> {
  if (_cache) return _cache;

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

  _cache = { items, recipes, itemsById, recipesByResultId };
  return _cache;
}

/**
 * ✅ URL icona:
 * - provider ankama: usa gfxId se presente, altrimenti id
 * - fallback wakassets: usa id
 */
export function getItemIconUrl(
  itemOrId: CompactItem | number,
  provider: "ankama" | "wakassets" = "ankama"
): string {
  const id = typeof itemOrId === "number" ? itemOrId : itemOrId.id;
  const gfxId = typeof itemOrId === "number" ? null : itemOrId.gfxId ?? null;

  if (provider === "ankama") {
    const key = gfxId && gfxId > 0 ? gfxId : id;
    // questa è la path che ti sta funzionando ora
    return `https://static.ankama.com/wakfu/portal/game/item/115/${key}.png`;
  }

  // community fallback (non perfetto ma utile)
  return `https://vertylo.github.io/wakassets/items/${id}.png`;
}

/**
 * Badge rarity: mapping “ragionevole” + fallback.
 * Se vuoi lo rendiamo 100% preciso dopo aver visto i valori nel tuo dataset.
 */
export function getRarityMeta(
  rarity?: number | null
): { label: string; className: string; ringClass: string } {
  const r = typeof rarity === "number" ? rarity : null;

  if (r === null) {
    return {
      label: "Unknown",
      className: "bg-white/10 text-white/70 border-white/15",
      ringClass: "ring-1 ring-white/20",
    };
  }

  switch (r) {
    case 0:
      return { label: "Common", className: "bg-white/10 text-white/80 border-white/15", ringClass: "ring-1 ring-white/25" };
    case 1:
      return { label: "Uncommon", className: "bg-emerald-500/15 text-emerald-100 border-emerald-300/25", ringClass: "ring-1 ring-emerald-300/35" };
    case 2:
      return { label: "Rare", className: "bg-sky-500/15 text-sky-100 border-sky-300/25", ringClass: "ring-1 ring-sky-300/35" };
    case 3:
      return { label: "Mythic", className: "bg-violet-500/15 text-violet-100 border-violet-300/25", ringClass: "ring-1 ring-violet-300/35" };
    case 4:
      return { label: "Legendary", className: "bg-amber-500/15 text-amber-100 border-amber-300/25", ringClass: "ring-1 ring-amber-300/35" };
    case 5:
      return { label: "Relic", className: "bg-orange-500/15 text-orange-100 border-orange-300/25", ringClass: "ring-1 ring-orange-300/35" };
    case 6:
      return { label: "Epic", className: "bg-fuchsia-500/15 text-fuchsia-100 border-fuchsia-300/25", ringClass: "ring-1 ring-fuchsia-300/35" };
    default:
      return {
        label: `Rarity ${r}`,
        className: "bg-white/10 text-white/70 border-white/15",
        ringClass: "ring-1 ring-white/20",
      };
  }
}
