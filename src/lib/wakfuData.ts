export type CompactItem = {
  id: number;
  name: string;
  description?: string | null;
  gfxId?: number | null;
  rarity?: number | null;
  source?: string | null;
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

export function rarityInfo(rarity: number | null | undefined): { label: string; cls: string } {
  // mapping che mi hai dato:
  // 1 = Unusual (grigio), 2 = Rare (verde), 3 = Mythical (arancione), 4 = Legendary (giallo)
  switch (rarity) {
    case 1:
      return { label: "Unusual", cls: "border-slate-300/30 text-slate-100/90 bg-slate-400/10" };
    case 2:
      return { label: "Rare", cls: "border-emerald-300/30 text-emerald-100/90 bg-emerald-400/10" };
    case 3:
      return { label: "Mythical", cls: "border-orange-300/30 text-orange-100/90 bg-orange-400/10" };
    case 4:
      return { label: "Legendary", cls: "border-yellow-300/30 text-yellow-100/90 bg-yellow-400/10" };
    default:
      return { label: "Common", cls: "border-white/15 text-emerald-50/80 bg-white/5" };
  }
}

export function getItemIconUrl(
  itemOrId: CompactItem | number,
  provider: "ankama" | "wakassets" = "ankama"
): string {
  const id = typeof itemOrId === "number" ? itemOrId : itemOrId.id;
  const gfx = typeof itemOrId === "number" ? null : itemOrId.gfxId ?? null;

  // IMPORTANTISSIMO: dai tuoi test:
  // - id spesso dà 403/404
  // - gfxId funziona (200)
  const key = gfx && gfx > 0 ? gfx : id;

  if (provider === "ankama") {
    return `https://static.ankama.com/wakfu/portal/game/item/115/${key}.png`;
  }
  return `https://vertylo.github.io/wakassets/items/${key}.png`;
}

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
