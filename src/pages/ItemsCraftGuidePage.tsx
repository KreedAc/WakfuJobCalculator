import { useEffect, useMemo, useState } from "react";
import { loadWakfuData, getItemIconUrl, type CompactItem, type CompactRecipe } from "../lib/wakfuData";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

type ShoppingRow = { itemId: number; qty: number };

export function ItemsCraftGuidePage() {
  const [query, setQuery] = useState("");
  const [itemsCraftable, setItemsCraftable] = useState<CompactItem[]>([]);
  const [itemsById, setItemsById] = useState<Map<number, CompactItem>>(new Map());
  const [recipesByResultId, setRecipesByResultId] = useState<Map<number, CompactRecipe[]>>(new Map());
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // espansioni e scelta ricetta per ogni nodo (se più ricette)
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [recipeChoice, setRecipeChoice] = useState<Map<number, number>>(new Map()); // itemId -> index ricetta

  useEffect(() => {
    loadWakfuData()
      .then((d) => {
        setItemsById(d.itemsById);
        setRecipesByResultId(d.recipesByResultId);

        // ricerca solo craftabili
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
      setExpanded(new Set());
      setRecipeChoice(new Map());
      return;
    }
    if (results.length > 0) {
      const first = results[0].id;
      setSelectedId(first);
      setExpanded(new Set([first]));
      setRecipeChoice(new Map());
    } else {
      setSelectedId(null);
      setExpanded(new Set());
      setRecipeChoice(new Map());
    }
  }, [query, results]);

  const selected: CompactItem | null = selectedId ? itemsById.get(selectedId) ?? null : null;

  const toggleExpanded = (itemId: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const cycleRecipe = (itemId: number) => {
    setRecipeChoice((prev) => {
      const next = new Map(prev);
      const list = recipesByResultId.get(itemId) ?? [];
      if (list.length <= 1) return next;
      const cur = next.get(itemId) ?? 0;
      next.set(itemId, (cur + 1) % list.length);
      return next;
    });
  };

  const isCraftable = (itemId: number) => (recipesByResultId.get(itemId)?.length ?? 0) > 0;

  // ---------- SHOPPING LIST ----------
  const shoppingList: ShoppingRow[] = useMemo(() => {
    if (!selectedId) return [];

    const acc = new Map<number, number>();

    const add = (itemId: number, qty: number) => {
      acc.set(itemId, (acc.get(itemId) ?? 0) + qty);
    };

    const getChosenRecipe = (itemId: number): CompactRecipe | null => {
      const list = recipesByResultId.get(itemId) ?? [];
      if (list.length === 0) return null;
      const idx = recipeChoice.get(itemId) ?? 0;
      return list[Math.min(idx, list.length - 1)] ?? null;
    };

    // DFS: se un ingrediente è craftabile MA non è espanso => lo metto in lista (lo "compro")
    // se è espanso => lo "crafto" e scendo nei suoi ingredienti
    const visit = (itemId: number, multiplier: number, visited: Set<number>) => {
      const recipe = getChosenRecipe(itemId);
      if (!recipe) {
        // se non ha ricetta lo consideriamo "da comprare"
        add(itemId, multiplier);
        return;
      }

      // se l'item è craftabile ma NON è espanso e NON è il root, lo mettiamo in lista come “da comprare”
      // (per il root non ha senso: lo stai craftando per definizione)
      const isRoot = itemId === selectedId;
      if (!isRoot && !expanded.has(itemId)) {
        add(itemId, multiplier);
        return;
      }

      // evita loop
      if (visited.has(itemId)) return;

      const nextVisited = new Set(visited);
      nextVisited.add(itemId);

      // scendi sugli ingredienti
      for (const ing of recipe.ingredients) {
        const qty = ing.qty * multiplier;

        if (isCraftable(ing.itemId)) {
          // craftabile: decido in base a expanded
          if (expanded.has(ing.itemId)) {
            visit(ing.itemId, qty, nextVisited);
          } else {
            add(ing.itemId, qty);
          }
        } else {
          // non craftabile: sempre in lista
          add(ing.itemId, qty);
        }
      }
    };

    visit(selectedId, 1, new Set());

    return [...acc.entries()]
      .map(([itemId, qty]) => ({ itemId, qty }))
      .sort((a, b) => {
        const an = itemsById.get(a.itemId)?.name ?? "";
        const bn = itemsById.get(b.itemId)?.name ?? "";
        return an.localeCompare(bn);
      });
  }, [selectedId, recipesByResultId, recipeChoice, expanded, itemsById]);

  const copyShoppingList = async () => {
    const lines = shoppingList.map((r) => {
      const name = itemsById.get(r.itemId)?.name ?? `#${r.itemId}`;
      return `${r.qty}x ${name}`;
    });
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("Shopping list copied ✅");
    } catch {
      alert("Copy failed ❌");
    }
  };

  // ---------- UI ----------
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-emerald-300">Items Craft Guide</h1>
        <div className="text-xs text-emerald-200/50">
          craftable items: {itemsCraftable.length} • {loading ? "loading..." : "ready"}
        </div>
      </div>

      <div className="mt-4 flex gap-3 items-center">
        <input
          className="w-full rounded-xl bg-black/30 border border-emerald-300/20 px-4 py-3 outline-none focus:border-emerald-300/50"
          placeholder={loading ? "Loading data..." : "Search craftable item name (e.g. Gobball Amulet)"}
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
        <div className="mt-4 grid lg:grid-cols-3 gap-4">
          {/* results */}
          <div className="rounded-2xl border border-emerald-300/15 bg-black/30 p-3">
            <div className="text-sm text-emerald-200/70 mb-2">Results ({results.length})</div>
            <div className="space-y-2 max-h-[560px] overflow-auto pr-1">
              {results.map((it) => {
                const isSel = it.id === selectedId;
                return (
                  <button
                    key={it.id}
                    onClick={() => {
                      setSelectedId(it.id);
                      setExpanded(new Set([it.id]));
                      setRecipeChoice(new Map());
                    }}
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

          {/* detail + tree */}
          {selected && (
            <div className="rounded-2xl border border-emerald-300/15 bg-black/30 p-4 lg:col-span-1">
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
                <h2 className="text-lg font-semibold text-emerald-300 mb-3">Recipe tree</h2>

                <RecipeNode
                  root
                  itemId={selected.id}
                  depth={0}
                  itemsById={itemsById}
                  recipesByResultId={recipesByResultId}
                  expanded={expanded}
                  recipeChoice={recipeChoice}
                  onToggle={toggleExpanded}
                  onCycleRecipe={cycleRecipe}
                  isCraftable={(id) => (recipesByResultId.get(id)?.length ?? 0) > 0}
                  visited={new Set<number>()}
                />
              </div>
            </div>
          )}

          {/* shopping list */}
          <div className="rounded-2xl border border-emerald-300/15 bg-black/30 p-4 lg:col-span-1">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-emerald-300">Shopping list</h2>
              <button
                onClick={copyShoppingList}
                disabled={shoppingList.length === 0}
                className="text-xs px-3 py-2 rounded-lg border border-emerald-300/15 bg-black/20 hover:border-emerald-300/30 disabled:opacity-40"
              >
                Copy
              </button>
            </div>

            <div className="text-xs text-emerald-200/60 mt-1">
              Tip: expand an ingredient to “craft it”, otherwise it stays in the list.
            </div>

            {shoppingList.length === 0 ? (
              <div className="mt-4 text-emerald-200/70 text-sm">
                {selected ? "Nothing to buy (or no selection)." : "Select an item first."}
              </div>
            ) : (
              <div className="mt-4 space-y-2 max-h-[560px] overflow-auto pr-1">
                {shoppingList.map((row) => {
                  const it = itemsById.get(row.itemId);
                  const label = it?.name ?? `#${row.itemId}`;
                  return (
                    <div
                      key={row.itemId}
                      className="flex items-center gap-3 rounded-xl border border-emerald-300/10 bg-black/20 px-3 py-2"
                    >
                      <ItemIcon itemId={row.itemId} size={32} />
                      <div className="flex-1">
                        <div className="text-emerald-100 text-sm">{label}</div>
                        <div className="text-emerald-200/50 text-xs">ID: {row.itemId}</div>
                      </div>
                      <div className="text-emerald-200 font-semibold">x{row.qty}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RecipeNode(props: {
  root?: boolean;
  itemId: number;
  depth: number;
  itemsById: Map<number, CompactItem>;
  recipesByResultId: Map<number, CompactRecipe[]>;
  expanded: Set<number>;
  recipeChoice: Map<number, number>;
  onToggle: (itemId: number) => void;
  onCycleRecipe: (itemId: number) => void;
  isCraftable: (itemId: number) => boolean;
  visited: Set<number>;
}) {
  const {
    root,
    itemId,
    depth,
    itemsById,
    recipesByResultId,
    expanded,
    recipeChoice,
    onToggle,
    onCycleRecipe,
    isCraftable,
    visited,
  } = props;

  const item = itemsById.get(itemId);
  const name = item?.name ?? `#${itemId}`;
  const desc = item?.description ?? null;

  const recipes = recipesByResultId.get(itemId) ?? [];
  const recipeIndex = recipeChoice.get(itemId) ?? 0;
  const recipe = recipes[recipeIndex] ?? null;

  const isOpen = expanded.has(itemId);
  const canExpand = recipes.length > 0;

  const cycleDetected = visited.has(itemId);
  const padLeft = depth * 14;

  return (
    <div style={{ marginLeft: padLeft }} className="relative">
      <div className="rounded-xl border border-emerald-300/10 bg-black/20 px-3 py-3">
        <div className="flex items-start gap-3">
          <ItemIcon itemId={itemId} size={34} />

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-emerald-100 text-sm font-semibold">{name}</div>
              <div className="text-emerald-200/40 text-xs">#{itemId}</div>

              {canExpand && (
                <span className="text-[11px] px-2 py-0.5 rounded-full border border-emerald-300/15 text-emerald-200/70">
                  craftable
                </span>
              )}
            </div>

            {root && desc && (
              <div className="text-xs text-emerald-200/60 mt-1 whitespace-pre-line">{desc}</div>
            )}
          </div>

          {canExpand && (
            <div className="flex items-center gap-2">
              {recipes.length > 1 && (
                <button
                  onClick={() => onCycleRecipe(itemId)}
                  className="text-xs px-2 py-1 rounded-lg border border-emerald-300/15 bg-black/20 hover:border-emerald-300/30"
                  title="Switch recipe"
                >
                  recipe {recipeIndex + 1}/{recipes.length}
                </button>
              )}

              <button
                onClick={() => onToggle(itemId)}
                className="text-xs px-2 py-1 rounded-lg border border-emerald-300/15 bg-black/20 hover:border-emerald-300/30"
              >
                {isOpen ? "Collapse" : "Expand"}
              </button>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="mt-3">
            {!recipe && <div className="text-emerald-200/70 text-sm">No recipe available.</div>}

            {cycleDetected && <div className="text-amber-200/80 text-sm">⚠️ Cycle detected: stopping here.</div>}

            {recipe && !cycleDetected && (
              <>
                <div className="text-xs text-emerald-200/60 mb-2">
                  Recipe #{recipe.id} • Output x{recipe.resultQty}
                </div>

                <div className="space-y-2">
                  {recipe.ingredients.map((ing, idx) => {
                    const ingItem = itemsById.get(ing.itemId);
                    const ingName = ingItem?.name ?? `#${ing.itemId}`;
                    const ingCraftable = isCraftable(ing.itemId);

                    return (
                      <div
                        key={`${ing.itemId}-${idx}`}
                        className="rounded-lg border border-emerald-300/10 bg-black/20 px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <ItemIcon itemId={ing.itemId} size={30} />
                          <div className="flex-1">
                            <div className="text-emerald-100 text-sm">{ingName}</div>
                            <div className="text-emerald-200/50 text-xs">ID: {ing.itemId}</div>
                          </div>
                          <div className="text-emerald-200 font-semibold">x{ing.qty}</div>

                          {ingCraftable && (
                            <button
                              onClick={() => onToggle(ing.itemId)}
                              className="text-xs px-2 py-1 rounded-lg border border-emerald-300/15 bg-black/20 hover:border-emerald-300/30"
                            >
                              {expanded.has(ing.itemId) ? "Hide" : "Show"}
                            </button>
                          )}
                        </div>

                        {ingCraftable && expanded.has(ing.itemId) && (
                          <div className="mt-2">
                            <RecipeNode
                              itemId={ing.itemId}
                              depth={depth + 1}
                              itemsById={itemsById}
                              recipesByResultId={recipesByResultId}
                              expanded={expanded}
                              recipeChoice={recipeChoice}
                              onToggle={onToggle}
                              onCycleRecipe={onCycleRecipe}
                              isCraftable={isCraftable}
                              visited={new Set([...visited, itemId])}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {!root && depth > 0 && <div className="h-3" />}
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
