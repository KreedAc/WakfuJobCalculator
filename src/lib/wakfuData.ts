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

export type ProfessionId =
  | 'Armorer'
  | 'Baker'
  | 'Chef'
  | 'Handyman'
  | 'Jeweler'
  | 'Leather Dealer'
  | 'Tailor'
  | 'Weapons Master';

const RECIPE_COMPONENT_KEYWORDS: Record<ProfessionId, string[]> = {
  'Weapons Master': ['handle', 'manche', 'mango', 'cabo'],
  'Handyman': ['bracket', 'equerre', 'escuadrita', 'esquadro'],
  'Baker': ['oil', 'huile', 'aceite', 'óleo'],
  'Chef': ['spice', 'epice', 'especia', 'especiaria'],
  'Armorer': ['plate', 'plaque', 'placa'],
  'Jeweler': ['gem', 'gemme', 'gema'],
  'Leather Dealer': ['leather', 'cuir', 'cuero', 'couro'],
  'Tailor': ['fiber', 'fibre', 'fibra']
};

export function getProfessionFromRecipe(recipe: CompactRecipe, itemsById: Map<number, CompactItem>): ProfessionId | null {
  for (const ing of recipe.ingredients) {
    const item = itemsById.get(ing.itemId);
    if (!item) continue;

    const nameLower = item.name.toLowerCase();

    for (const [profession, keywords] of Object.entries(RECIPE_COMPONENT_KEYWORDS)) {
      if (keywords.some(kw => nameLower.includes(kw))) {
        return profession as ProfessionId;
      }
    }
  }
  return null;
}

export type WakfuData = {
  items: CompactItem[];
  recipes: CompactRecipe[];
  itemsById: Map<number, CompactItem>;
  recipesByResultId: Map<number, CompactRecipe[]>;
};

const DATA_BASE = "/data";

export async function loadWakfuData(language: string = "en"): Promise<WakfuData> {
  const [items, recipes] = await Promise.all([
    fetch(`${DATA_BASE}/items.compact.${language}.json`, { cache: "no-store" }).then((r) => r.json()) as Promise<CompactItem[]>,
    fetch(`${DATA_BASE}/recipes.compact.json`, { cache: "no-store" }).then((r) => r.json()) as Promise<CompactRecipe[]>,
  ]);

  const itemsById = new Map<number, CompactItem>();
  for (const it of items) itemsById.set(it.id, it);

  const recipesByResultId = new Map<number, CompactRecipe[]>();
  for (const r of recipes) {
    const arr = recipesByResultId.get(r.resultItemId) ?? [];
    arr.push(r);
    recipesByResultId.set(r.resultItemId, arr);
  }

  // stable order (optional)
  for (const [k, v] of recipesByResultId) {
    v.sort((a, b) => a.id - b.id);
    recipesByResultId.set(k, v);
  }

  return { items, recipes, itemsById, recipesByResultId };
}

export function getItemIconUrl(gfxOrId: number, provider: "ankama" | "wakassets" = "ankama"): string {
  // IMPORTANT: Ankama spesso funziona solo con gfxId, non con itemId.
  if (provider === "ankama") {
    return `https://static.ankama.com/wakfu/portal/game/item/115/${gfxOrId}.png`;
  }
  return `https://vertylo.github.io/wakassets/items/${gfxOrId}.png`;
}
