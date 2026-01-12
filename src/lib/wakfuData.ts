export type CompactItem = {
  id: number;
  name: string;
  description: string | null;
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

function dataUrl(path: string) {
  // Vite: BASE_URL è "/" in dev, ma può essere "/qualcosa/" in preview/deploy
  const base = import.meta.env.BASE_URL ?? "/";
  // base finisce con "/" (di solito), quindi concateniamo senza problemi
  return `${base}data/${path}`;
}

async function fetchJsonSafe<T>(url: string): Promise<T> {
  const r = await fetch(url, { cache: "no-store" });
  const text = await r.text();

  if (!r.ok) {
    throw new Error(`HTTP ${r.status} for ${url}\n${text.slice(0, 200)}`);
  }

  // Se per errore torna HTML (tipo index.html), lo intercettiamo
  const trimmed = text.trim();
  const looksLikeJson = trimmed.startsWith("[") || trimmed.startsWith("{");
  if (!looksLikeJson) {
    throw new Error(
      `Non-JSON response from ${url}\nFirst chars: ${trimmed.slice(0, 80)}`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch (e) {
    throw new Error(`JSON parse error for ${url}\n${text.slice(0, 200)}`);
  }
}

export function loadWakfuData(): Promise<WakfuData> {
  if (_cache) return _cache;

  // cache-busting leggero per evitare preview che serve file vecchi
  const bust = Date.now();

  const itemsUrl = `${dataUrl("items.compact.json")}?v=${bust}`;
  const recipesUrl = `${dataUrl("recipes.compact.json")}?v=${bust}`;

  _cache = (async () => {
    const [items, recipes] = await Promise.all([
      fetchJsonSafe<CompactItem[]>(itemsUrl),
      fetchJsonSafe<CompactRecipe[]>(recipesUrl),
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

export function getItemIconUrl(
  itemId: number,
  variant: "ankama" | "wakassets" = "ankama"
) {
  if (variant === "ankama") {
    return `https://static.ankama.com/wakfu/portal/game/item/115/${itemId}.png`;
  }
  return `https://vertylo.github.io/wakassets/items/${itemId}.png`;
}
