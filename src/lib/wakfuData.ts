// src/lib/wakfuData.ts
export type CompactItem = {
  id: number;
  name: string;
  description?: string | null;
  gfxId?: number | null;
  rarity?: number | string | null;
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
  itemsById: Map<number, CompactItem>;
  recipes: CompactRecipe[];
  recipesByResultId: Map<number, CompactRecipe[]>;
};

export async function loadWakfuData(): Promise<WakfuData> {
  const [items, recipes] = await Promise.all([
    fetch("/data/items.compact.json").then((r) => r.json()) as Promise<CompactItem[]>,
    fetch("/data/recipes.compact.json").then((r) => r.json()) as Promise<CompactRecipe[]>,
  ]);

  const itemsById = new Map<number, CompactItem>();
  for (const it of items) itemsById.set(it.id, it);

  const recipesByResultId = new Map<number, CompactRecipe[]>();
  for (const r of recipes) {
    const arr = recipesByResultId.get(r.resultItemId) ?? [];
    arr.push(r);
    recipesByResultId.set(r.resultItemId, arr);
  }

  return { items, itemsById, recipes, recipesByResultId };
}

/**
 * Icon URL:
 * - "ankama": usa gfxId se presente (di solito è quello giusto per l’icona)
 * - "wakassets": fallback community per id
 */
export function getItemIconUrl(
  itemOrId: number | Pick<CompactItem, "id" | "gfxId">,
  provider: "ankama" | "wakassets" = "ankama"
) {
  const id = typeof itemOrId === "number" ? itemOrId : itemOrId.id;
  const gfxId =
    typeof itemOrId === "number"
      ? null
      : itemOrId.gfxId != null
        ? Number(itemOrId.gfxId)
        : null;

  if (provider === "wakassets") {
    return `https://vertylo.github.io/wakassets/items/${id}.png`;
  }

  // Ankama:
  // - se abbiamo gfxId, proviamo quella (molto spesso è la chiave corretta per l'icona item)
  // - altrimenti fallback sull’id
  if (gfxId && Number.isFinite(gfxId) && gfxId > 0) {
    // path "200" è quello che in genere funziona meglio con gfxId
    return `https://static.ankama.com/wakfu/portal/game/item/200/${gfxId}.png`;
  }

  return `https://static.ankama.com/wakfu/portal/game/item/115/${id}.png`;
}

/**
 * Mappa “umana” della rarità.
 * Nota: i codici numerici possono variare in base alle fonti: se non matcha, mostriamo fallback.
 */
const RARITY_ID_TO_LABEL: Record<number, string> = {
  0: "Common",
  1: "Common",
  2: "Unusual",
  3: "Rare",
  4: "Mythical",
  5: "Legendary",
  6: "Relic",
  7: "Souvenir",
  8: "Epic",
};

function titleCase(s: string) {
  return s
    .toLowerCase()
    .split(/[_\s-]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getItemRarityLabel(item?: CompactItem | null): string | null {
  if (!item) return null;
  const r = item.rarity;

  if (r == null) return null;

  if (typeof r === "number" && Number.isFinite(r)) {
    return RARITY_ID_TO_LABEL[r] ?? `Rarity ${r}`;
  }

  if (typeof r === "string" && r.trim()) {
    // es: "RARE", "MYTHICAL", ecc
    return titleCase(r.trim());
  }

  return null;
}
