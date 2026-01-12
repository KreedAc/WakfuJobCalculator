import { useEffect, useMemo, useState } from "react";
import {
  loadWakfuData,
  getItemIconUrl,
  type CompactItem,
  type CompactRecipe,
} from "../lib/wakfuData";

function norm(s: string) {
  return s.toLowerCase().trim();
}

export function ItemsCraftGuidePage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CompactItem[]>([]);
  const [itemsById, setItemsById] = useState<Map<number, CompactItem>>(new Map());
  const [recipesByResultId, setRecipesByResultId] = useState<Map<number, CompactRecipe[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    loadWakfuData()
      .then((d) => {
        setItems(d.items);
        setItemsById(d.itemsById);
        setRecipesByResultId(d.recipesByResultId);
      })
      .catch((e) => {
        setError(e?.message ? String(e.message) : String(e));
      })
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const q = norm(query);
    if (!q) return [];
    return items.filter((it) => norm(it.name).includes(q)).slice(0, 30);
  }, [items, query]);

  const selected = results[0] ?? null;
  const recipes = selected ? recipesByResultId.get(selected.id) ?? [] : [];

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-emerald-300 mb-2">Items Craft Guide</h1>

      {/* DEBUG BAR: ti dice subito se ha caricato i JSON */}
      <div className="mb-4 text-xs text-emerald-200/60">
        <span className="mr-3">items: {items.length}</span>
        <span className="mr-3">recipes: {Array.from(recipesByResultId.values()).reduce((a, b) => a + b.length, 0)}</span>
        <span>{loading ? "loading…" : "ready"}</span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-900/20 p-3">
          <div className="text-red-200 font-semibold mb-1">Data load error</div>
          <pre className="text-red-200/80 text-xs whitespace-pre-wrap">{error}</pre>
          <div className="text-red-200/60 text-xs mt-2">
            Controlla che esistano: <code className="opacity-90">public/data/items.compact.json</code> e{" "}
            <code className="opacity-90">public/data/recipes.compact.json</code> (e che siano accessibili da browser come{" "}
            <code className="opacity-90">/data/items.compact.json</code>).
          </div>
        </div>
      )}

      <div className="flex gap-3 items-center mb-6">
        <input
          className="w-full rounded-xl bg-black/30 border border-emerald-300/20 px-4 py-3 outline-none focus:border-emerald-300/50"
          placeholder={loading ? "Loading data..." : "Search item name (e.g. Gobball Amulet)"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
      </div>

      {!query && !error && (
        <p className="text-emerald-200/70">Type an item name to see its crafting recipe.</p>
      )}

      {query && results.length === 0 && !loading && !error && (
        <p className="text-emerald-200/70">No items found.</p>
      )}

      {selected && !error && (
        <div className="rounded-2xl border border-emerald-300/15 bg-black/30 p-4">
          <div className="flex items-start gap-4">
            <ItemIconLink itemId={selected.id} />
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
                            <ItemIconLink itemId={ing.itemId} size={34} />

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

/**
 * Opzione A: niente <img>.
 * Badge con link per aprire l'icona in una nuova tab.
 */
function ItemIconLink({ itemId, size = 44 }: { itemId: number; size?: number }) {
  const ankama = getItemIconUrl(itemId, "ankama");
  const wakassets = getItemIconUrl(itemId, "wakassets");

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-xl bg-black/30 border border-emerald-300/10 flex items-center justify-center"
      title={`Open icon:\nAnkama: ${ankama}\nWakassets: ${wakassets}`}
    >
      <div className="flex flex-col items-center justify-center leading-none">
        <a
          href={ankama}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] text-emerald-200/70 hover:text-emerald-200"
        >
          Ank
        </a>
        <a
          href={wakassets}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] text-emerald-200/70 hover:text-emerald-200"
        >
          Wk
        </a>
      </div>
    </div>
  );
}
