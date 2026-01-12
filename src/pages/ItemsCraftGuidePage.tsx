import { useEffect, useMemo, useState } from "react";
import { loadWakfuData, getItemIconUrl, type CompactItem, type CompactRecipe } from "../lib/wakfuData";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function ItemsCraftGuidePage() {
  const [query, setQuery] = useState("");
  const [itemsCraftable, setItemsCraftable] = useState<CompactItem[]>([]);
  const [itemsById, setItemsById] = useState<Map<number, CompactItem>>(new Map());
  const [recipesByResultId, setRecipesByResultId] = useState<Map<number, CompactRecipe[]>>(new Map());
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    loadWakfuData()
      .then((d) => {
        // itemsById resta completo (serve per i nomi degli ingredienti)
        setItemsById(d.itemsById);
        setRecipesByResultId(d.recipesByResultId);

        // la ricerca mostra SOLO item craftabili (che hanno almeno una ricetta come risultato)
        const craftable = d.items.filter((it) => d.craftableResultIds.has(it.id));
        setItemsCraftable(craftable);
      })
      .finally(() => setLoading(false));
  }, []);

  const itemsWithNorm = useMemo(() => {
    return itemsCraftable.map((it) => ({ ...it, _norm: norm(it.name) }));
  }, [itemsCraftable]);

  const results = useMemo(() => {
    const q = norm(query);
    if (!q) return [];
    return itemsWithNorm.filter((it) => it._norm.includes(q)).slice(0, 30);
  }, [itemsWithNorm, query]);

  useEffect(() => {
    if (!query) {
      setSelectedId(null);
      return;
    }
    if (results.length > 0) setSelectedId(results[0].id);
    else setSelectedId(null);
  }, [query, results]);

  const selected: CompactItem | null = selectedId ? itemsById.get(selectedId) ?? null : null;

  // ricette che PRODUCONO questo item (essendo craftabile, almeno una dovrebbe esserci)
  const craftRecipes = selected ? recipesByResultId.get(selected.id) ?? [] : [];

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-emerald-300">Items Craft Guide</h1>
        <div className="text-xs text-emerald-200/50">
          craftable items: {itemsCraftable.length} • {loading ? "loading..." : "ready"}
        </div>
      </div>

      <div className="mt-4 flex gap-3 items-center">
        <input
          className="w-full rounded-xl bg-black/30 border border-emerald-300/20 px-4 py-3 outline-none focus:border-emerald-300/50"
          placeholder={loading ? "Loading data..." : "Search craftable item name (e.g. Gobball Belt)"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
      </div>

      {!query && <p className="mt-4 text-emerald-200/70">Type a craftable item name to see its recipe.</p>}

      {query && results.length === 0 && !loading && (
        <p className="mt-4 text-emerald-200/70">No craftable items found for this search.</p>
      )}

      {results.length > 0 && (
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {/* results */}
          <div className="rounded-2xl border border-emerald-300/15 bg-black/30 p-3">
            <div className="text-sm text-emerald-200/70 mb-2">Results ({results.length})</div>
            <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
              {results.map((it) => {
                const isSel = it.id === selectedId;
                return (
                  <button
                    key={it.id}
                    onClick={() => setSelectedId(it.id)}
                    className={[
                      "w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 border transition",
                      isSel ? "bg-emerald-500/10 border-emerald-300/30" : "bg-black/20 border-emerald-300/10 hover:border-emerald-300/25",
                    ].join(" ")}
                  >
                    <ItemIcon itemId={it.id} size={34} />
                    <div className="flex-1">
                      <div className="text-emerald-100 text-sm font-medium">{it.name}</div>
                      <div className="text-emerald-200/50 text-xs">ID: {it.id}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* detail */}
          {selected && (
            <div className="rounded-2xl border border-emerald-300/15 bg-black/30 p-4">
              <div className="flex items-start gap-4">
                <ItemIcon itemId={selected.id} />
                <div className="flex-1">
                  <div className="text-xl font-semibold text-emerald-200">{selected.name}</div>
                  {selected.description && (
                    <div className="text-sm text-emerald-200/70 mt-1 whitespace-pre-line">{selected.description}</div>
                  )}
                  <div className="text-xs text-emerald-200/40 mt-2">ID: {selected.id}</div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-emerald-300 mb-3">
                  Crafting recipe{craftRecipes.length === 1 ? "" : "s"} ({craftRecipes.length})
                </h2>

                {craftRecipes.length === 0 ? (
                  <p className="text-emerald-200/70">No recipe found (unexpected for craftable item).</p>
                ) : (
                  <div className="space-y-3">
                    {craftRecipes.map((r) => (
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
      )}
    </div>
  );
}

function ItemIcon({ itemId, size = 44 }: { itemId: number; size?: number }) {
  const [src, setSrc] = useState(getItemIconUrl(itemId, "ankama"));
  const [triedFallback, setTriedFallback] = useState(false);

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      className="rounded-xl bg-black/30 border border-emerald-300/10 object-contain"
      onError={() => {
        if (!triedFallback) {
          setTriedFallback(true);
          setSrc(getItemIconUrl(itemId, "wakassets"));
        }
      }}
      loading="lazy"
    />
  );
}
