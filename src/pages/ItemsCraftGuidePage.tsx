import { useEffect, useMemo, useState } from "react";
import { loadWakfuData, getItemIconUrl, type CompactItem, type CompactRecipe } from "../lib/wakfuData";

function norm(s: string) {
  return s.toLowerCase().trim();
}

export function ItemsCraftGuidePage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CompactItem[]>([]);
  const [itemsById, setItemsById] = useState<Map<number, CompactItem>>(new Map());
  const [recipesByResultId, setRecipesByResultId] = useState<Map<number, CompactRecipe[]>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWakfuData()
      .then(d => {
        setItems(d.items);
        setItemsById(d.itemsById);
        setRecipesByResultId(d.recipesByResultId);
      })
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const q = norm(query);
    if (!q) return [];
    return items
      .filter(it => norm(it.name).includes(q))
      .slice(0, 30);
  }, [items, query]);

  const selected = results[0] ?? null;
  const recipes = selected ? (recipesByResultId.get(selected.id) ?? []) : [];

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-emerald-300 mb-4">Items Craft Guide</h1>

      <div className="flex gap-3 items-center mb-6">
        <input
          className="w-full rounded-xl bg-black/30 border border-emerald-300/20 px-4 py-3 outline-none focus:border-emerald-300/50"
          placeholder={loading ? "Loading data..." : "Search item name (e.g. Gobball Amulet)"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
      </div>

      {!query && (
        <p className="text-emerald-200/70">Type an item name to see its crafting recipe.</p>
      )}

      {query && results.length === 0 && !loading && (
        <p className="text-emerald-200/70">No items found.</p>
      )}

      {selected && (
        <div className="rounded-2xl border border-emerald-300/15 bg-black/30 p-4">
          <div className="flex items-start gap-4">
            <ItemIcon itemId={selected.id} />
            <div className="flex-1">
              <div className="text-xl font-semibold text-emerald-200">{selected.name}</div>
              {selected.description && (
                <div className="text-sm text-emerald-200/70 mt-1 whitespace-pre-line">
                  {selected.description}
                </div>
              )}
              <div className="text-xs text-emerald-200/40 mt-2">ID: {selected.id}</div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-emerald-300 mb-3">
              Recipes producing this item ({recipes.length})
            </h2>

            {recipes.length === 0 ? (
              <p className="text-emerald-200/70">No recipe found for this result item.</p>
            ) : (
              <div className="space-y-3">
                {recipes.map((r) => (
                  <div key={r.id} className="rounded-xl border border-emerald-300/10 bg-black/20 p-3">
                    <div className="text-sm text-emerald-200/80 mb-2">
                      Recipe #{r.id} • Output: x{r.resultQty}
                    </div>

                    <div className="grid md:grid-cols-2 gap-2">
                      {r.ingredients.map((ing, idx) => {
                        const it = itemsById.get(ing.itemId);
                        const label = it?.name ?? `#${ing.itemId}`;
                        return (
                          <div
                            key={`${ing.itemId}-${idx}`}
                            className="flex items-center gap-3 rounded-lg bg-black/20 border border-emerald-300/10 px-3 py-2"
                          >
                            <ItemIcon itemId={ing.itemId} size={34} />
                            <div className="flex-1">
                              <div className="text-emerald-100 text-sm">{label}</div>
                              <div className="text-emerald-200/50 text-xs">ID: {ing.itemId}</div>
                            </div>
                            <div className="text-emerald-200 font-semibold">x{ing.qty}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ItemIcon({ itemId, size = 44 }: { itemId: number; size?: number }) {
  const [src, setSrc] = useState(getItemIconUrl(itemId, "ankama"));

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      className="rounded-xl bg-black/30 border border-emerald-300/10"
      onError={() => {
        // fallback: wakassets
        if (src.includes("static.ankama.com")) setSrc(getItemIconUrl(itemId, "wakassets"));
      }}
      loading="lazy"
    />
  );
}
