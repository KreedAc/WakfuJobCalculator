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
  craftableResultIds: Set<number>;
  ready: true;
};

let _cache: Promise<WakfuData> | null = null;

function baseUrl(p: string) {
  const base = (import.meta as any).env?.BASE_URL ?? "/";
  return `${String(base).replace(/\/$/, "")}/${p.replace(/^\//, "")}`;
}

function toNum(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeItem(raw: any): CompactItem {
  return {
    id: toNum(raw?.id),
    name: String(raw?.name ?? `#${raw?.id ?? "?"}`),
    description: raw?.description == null ? null : String(raw.description),
    gfxId: raw?.gfxId == null ? null : toNum(raw.gfxId) || null,
    source: raw?.source ? String(raw.source) : undefined,
  };
}

function normalizeRecipe(raw: any): CompactRecipe {
  const ingredientsRaw = Array.isArray(raw?.ingredients) ? raw.ingredients : [];
  return {
    id: toNum(raw?.id),
    resultItemId: toNum(raw?.resultItemId),
    resultQty: toNum(raw?.resultQty) || 1,
    ingredients: ingredientsRaw
      .map((ing: any) => ({
        itemId: toNum(ing?.itemId),
        qty: toNum(ing?.qty) || 1,
      }))
      .filter((x: any) => x.itemId > 0 && x.qty > 0),
  };
}

export async function loadWakfuData(): Promise<WakfuData> {
  if (_cache) return _cache;

  _cache = (async () => {
    const [itemsRaw, recipesRaw] = await Promise.all([
      fetch(baseUrl("data/items.compact.json")).then((r) => r.json()),
      fetch(baseUrl("data/recipes.compact.json")).then((r) => r.json()),
    ]);

    const items: CompactItem[] = Array.isArray(itemsRaw)
      ? itemsRaw.map(normalizeItem).filter((x) => x.id > 0)
      : [];

    const recipes: CompactRecipe[] = Array.isArray(recipesRaw)
      ? recipesRaw.map(normalizeRecipe).filter((x) => x.id > 0)
      : [];

    const itemsById = new Map<number, CompactItem>();
    for (const it of items) itemsById.set(it.id, it);

    const recipesByResultId = new Map<number, CompactRecipe[]>();
    const craftableResultIds = new Set<number>();

    for (const r of recipes) {
      craftableResultIds.add(r.resultItemId);

      const arr = recipesByResultId.get(r.resultItemId) ?? [];
      arr.push(r);
      recipesByResultId.set(r.resultItemId, arr);
    }

    return {
      items,
      recipes,
      itemsById,
      recipesByResultId,
      craftableResultIds,
      ready: true as const,
    };
  })();

  return _cache;
}

export function getItemIconUrl(itemId: number, provider: "ankama" | "wakassets" = "ankama") {
  if (provider === "ankama") {
    return `https://static.ankama.com/wakfu/portal/game/item/115/${itemId}.png`;
  }
  return `https://vertylo.github.io/wakassets/items/${itemId}.png`;
}
