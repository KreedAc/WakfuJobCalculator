export type CompactItem = {
  id: number;
  name: string;
  description?: string | null;
  level?: number;
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
  itemById: Map<number, CompactItem>;
  recipesByResultItemId: Map<number, CompactRecipe[]>;
};

export async function loadWakfuData(): Promise<WakfuData> {
  const [items, recipes] = await Promise.all([
    fetch("/data/items.compact.json").then((r) => {
      if (!r.ok) throw new Error("items.compact.json not found");
      return r.json() as Promise<CompactItem[]>;
    }),
    fetch("/data/recipes.compact.json").then((r) => {
      if (!r.ok) throw new Error("recipes.compact.json not found");
      return r.json() as Promise<CompactRecipe[]>;
    }),
  ]);

  const itemById = new Map<number, CompactItem>();
  for (const it of items) itemById.set(it.id, it);

  const recipesByResultItemId = new Map<number, CompactRecipe[]>();
  for (const rec of recipes) {
    const arr = recipesByResultItemId.get(rec.resultItemId) ?? [];
    arr.push(rec);
    recipesByResultItemId.set(rec.resultItemId, arr);
  }

  return { items, recipes, itemById, recipesByResultItemId };
}
