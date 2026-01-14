// src/pages/ItemsCraftGuidePage.tsx
import { useEffect, useMemo, useState } from "react";
import {
  loadWakfuData,
  getItemIconUrl,
  type CompactItem,
  type CompactRecipe,
} from "../lib/wakfuData";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

type ShoppingRow = { itemId: number; qty: number };
type SelectedRow = { itemId: number; qty: number };

type RarityInfo = { label: string; className: string };
function rarityInfo(r: number | null | undefined): RarityInfo | null {
  // 1 Unusual (grigio)
  // 2 Rare (verde)
  // 3 Mythical (arancione)
  // 4 Legendary (giallo)
  // 5 Relic (viola)
  // 6 Souvenir (azzurro)
  // 7 Epic (fucsia/rosa)
  switch (r ?? null) {
    case 1:
      return { label: "Unusual", className: "text-zinc-300/90" };
    case 2:
      return { label: "Rare", className: "text-emerald-300" };
    case 3:
      return { label: "Mythical", className: "text-orange-300" };
    case 4:
      return { label: "Legendary", className: "text-yellow-300" };
    case 5:
      return { label: "Relic", className: "text-violet-300" };
    case 6:
      return { label: "Souvenir", className: "text-sky-300" };
    case 7:
      return { label: "Epic", className: "text-pink-300" };
    default:
      return null;
  }
}

export function ItemsCraftGuidePage() {
  const [loading, setLoading] = useState(true);

  const [items, setItems] = useState<CompactItem[]>([]);
  const [itemsById, setItemsById] = useState<Map<number, CompactItem>>(new Map());
  const [recipesByResultId, setRecipesByResultId] = useState<Map<number, CompactRecipe[]>>(new Map());

  // UI
  const [query, setQuery] = useState("");

  // Multi-select
  const [selected, setSelected] = useState<SelectedRow[]>([]);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);

  // Per-root tree controls
  const [expandedByRoot, setExpandedByRoot] = useState<Map<number, Set<number>>>(new Map());
  const [recipeChoiceByRoot, setRecipeChoiceByRoot] = useState<Map<number, Map<number, number>>>(new Map());

  useEffect(() => {
    loadWakfuData()
      .then((d) => {
        setItems(d.items);
        setItemsById(d.itemsById);
        setRecipesByResultId(d.recipesByResultId);
      })
      .finally(() => setLoading(false));
  }, []);

  const isCraftable = (id: number) => (recipesByResultId.get(id)?.length ?? 0) > 0;

  // Search only craftables
  const craftableItems = useMemo(() => {
    const craftableIds = new Set<number>([...recipesByResultId.keys()]);
    return items
      .filter((it) => craftableIds.has(it.id))
      .map((it) => ({ ...it, _norm: norm(it.name) })) as (CompactItem & { _norm: string })[];
  }, [items, recipesByResultId]);

  const results = useMemo(() => {
    const q = norm(query);
    if (!q) return [];
    return craftableItems
      .filter((it) => it._norm.includes(q))
      .slice(0, 30)
      .map(({ _norm, ...it }) => it);
  }, [craftableItems, query]);

  const activeItem: CompactItem | null = useMemo(() => {
    if (!activeItemId) return null;
    return itemsById.get(activeItemId) ?? null;
  }, [activeItemId, itemsById]);

  const ensureRootState = (rootId: number) => {
    setExpandedByRoot((prev) => {
      if (prev.has(rootId)) return prev;
      const next = new Map(prev);
      next.set(rootId, new Set<number>());
      return next;
    });

    setRecipeChoiceByRoot((prev) => {
      if (prev.has(rootId)) return prev;
      const next = new Map(prev);
      next.set(rootId, new Map<number, number>());
      return next;
    });
  };

  const getExpanded = (rootId: number) => expandedByRoot.get(rootId) ?? new Set<number>();
  const getRecipeChoice = (rootId: number) => recipeChoiceByRoot.get(rootId) ?? new Map<number, number>();

  const addItem = (itemId: number) => {
    ensureRootState(itemId);

    setSelected((prev) => {
      const idx = prev.findIndex((x) => x.itemId === itemId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { itemId, qty: 1 }];
    });

    setActiveItemId(itemId);
    setQuery(""); // hide results immediately
  };

  const removeItem = (itemId: number) => {
    setSelected((prev) => prev.filter((x) => x.itemId !== itemId));

    setExpandedByRoot((prev) => {
      const next = new Map(prev);
      next.delete(itemId);
      return next;
    });

    setRecipeChoiceByRoot((prev) => {
      const next = new Map(prev);
      next.delete(itemId);
      return next;
    });

    setActiveItemId((curr) => {
      if (curr !== itemId) return curr;
      const remaining = selected.filter((x) => x.itemId !== itemId);
      return remaining[0]?.itemId ?? null;
    });
  };

  const clearAll = () => {
    setSelected([]);
    setActiveItemId(null);
    setExpandedByRoot(new Map());
    setRecipeChoiceByRoot(new Map());
  };

  const setQty = (itemId: number, delta: number) => {
    setSelected((prev) => {
      const idx = prev.findIndex((x) => x.itemId === itemId);
      if (idx < 0) return prev;
      const next = [...prev];
      const q = Math.max(1, next[idx].qty + delta);
      next[idx] = { ...next[idx], qty: q };
      return next;
    });
  };

  const toggleExpanded = (rootId: number, itemId: number) => {
    setExpandedByRoot((prev) => {
      const next = new Map(prev);
      const set = new Set(next.get(rootId) ?? []);
      if (set.has(itemId)) set.delete(itemId);
      else set.add(itemId);
      next.set(rootId, set);
      return next;
    });
  };

  const cycleRecipe = (rootId: number, itemId: number) => {
    setRecipeChoiceByRoot((prev) => {
      const next = new Map(prev);
      const map = new Map(next.get(rootId) ?? []);
      const list = recipesByResultId.get(itemId) ?? [];
      if (list.length <= 1) return prev;

      const curr = map.get(itemId) ?? 0;
      map.set(itemId, (curr + 1) % list.length);

      next.set(rootId, map);
      return next;
    });
  };

  // Shopping list aggregated for ALL selected items (with quantity)
  const shoppingList: ShoppingRow[] = useMemo(() => {
    if (selected.length === 0) return [];

    const acc = new Map<number, number>();

    const add = (itemId: number, qty: number) => {
      acc.set(itemId, (acc.get(itemId) ?? 0) + qty);
    };

    const walk = (rootId: number, itemId: number, qtyMul: number, visited: Set<number>) => {
      if (visited.has(itemId)) {
        add(itemId, qtyMul);
        return;
      }
      visited.add(itemId);

      const craftable = isCraftable(itemId);
      const expanded = getExpanded(rootId).has(itemId);

      // leaf if not craftable or not expanded
      if (!craftable || !expanded) {
        add(itemId, qtyMul);
        visited.delete(itemId);
        return;
      }

      const recs = recipesByResultId.get(itemId) ?? [];
      if (recs.length === 0) {
        add(itemId, qtyMul);
        visited.delete(itemId);
        return;
      }

      const choice = getRecipeChoice(rootId).get(itemId) ?? 0;
      const recipe = recs[Math.min(choice, recs.length - 1)];

      for (const ing of recipe.ingredients) {
        walk(rootId, ing.itemId, qtyMul * ing.qty, visited);
      }

      visited.delete(itemId);
    };

    for (const sel of selected) {
      const rootId = sel.itemId;
      const rootQty = sel.qty;

      const rootRecs = recipesByResultId.get(rootId) ?? [];
      if (rootRecs.length === 0) continue;

      const rootChoice = getRecipeChoice(rootId).get(rootId) ?? 0;
      const rootRecipe = rootRecs[Math.min(rootChoice, rootRecs.length - 1)];

      const visited = new Set<number>();
      for (const ing of rootRecipe.ingredients) {
        walk(rootId, ing.itemId, ing.qty * rootQty, visited);
      }
    }

    return [...acc.entries()]
      .map(([itemId, qty]) => ({ itemId, qty }))
      .sort((a, b) => {
        const na = itemsById.get(a.itemId)?.name ?? "";
        const nb = itemsById.get(b.itemId)?.name ?? "";
        return na.localeCompare(nb);
      });
  }, [selected, expandedByRoot, recipeChoiceByRoot, recipesByResultId, itemsById]);

  const copyShoppingList = async () => {
    const lines = shoppingList.map((r) => {
      const it = itemsById.get(r.itemId);
      const name = it?.name ?? `#${r.itemId}`;
      return `${name} x${r.qty}`;
    });

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
    } catch {
      // ignore
    }
  };

  const showResults = query.trim().length > 0 && !loading;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-emerald-300">Items Craft Guide</h1>
        <div className="text-xs text-emerald-200/70">
          craftable items: {craftableItems.length} • recipes: {recipesByResultId.size} •{" "}
          {loading ? "loading..." : "ready"}
        </div>
      </div>

      {/* Search centered */}
      <div className="mt-5 flex justify-center">
        <div className="w-full max-w-2xl">
          <input
            className="w-full rounded-xl bg-black/10 border border-emerald-300/25 backdrop-blur-md px-4 py-3 outline-none focus:border-emerald-300/60"
            placeholder={loading ? "Loading data..." : "Search craftable item name (e.g. Gobball Amulet)"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {/* Selected items bar */}
      <div className="mt-4">
        <div className="rounded-2xl border border-emerald-300/15 bg-black/10 backdrop-blur-md p-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-emerald-200/80">Selected items ({selected.length})</div>

            <button
              onClick={clearAll}
              disabled={selected.length === 0}
              className="text-xs px-3 py-2 rounded-lg border border-emerald-300/20 bg-black/10 hover:border-emerald-300/35 disabled:opacity-40"
            >
              Clear all
            </button>
          </div>

          {selected.length === 0 ? (
            <div className="text-xs text-emerald-200/60 mt-2">
              Add one or more items from the search results.
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.map((s) => {
                const it = itemsById.get(s.itemId);
                const name = it?.name ?? `#${s.itemId}`;
                const rInfo = rarityInfo(it?.rarity);
                const isActive = s.itemId === activeItemId;

                return (
                  <div
                    key={s.itemId}
                    className={[
                      "flex items-center gap-2 rounded-xl border px-2 py-2 bg-black/10",
                      isActive ? "border-emerald-300/35" : "border-emerald-300/15",
                    ].join(" ")}
                  >
                    <button
                      onClick={() => setActiveItemId(s.itemId)}
                      className="flex items-center gap-2 text-left"
                      title="Show recipe on the left"
                    >
                      <ItemIcon itemId={s.itemId} itemsById={itemsById} size={28} />
                      <div className="min-w-0">
                        <div className="text-emerald-100 text-xs font-medium truncate max-w-[180px]">
                          {name}
                        </div>
                        <div className={`text-[11px] ${rInfo?.className ?? "text-emerald-200/40"}`}>
                          {rInfo?.label ?? "—"}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 ml-1">
                      <button
                        onClick={() => setQty(s.itemId, -1)}
                        className="w-7 h-7 rounded-lg border border-emerald-300/15 bg-black/10 hover:border-emerald-300/30"
                        title="Decrease"
                      >
                        −
                      </button>
                      <div className="text-emerald-200 text-xs font-semibold w-8 text-center">{s.qty}</div>
                      <button
                        onClick={() => setQty(s.itemId, +1)}
                        className="w-7 h-7 rounded-lg border border-emerald-300/15 bg-black/10 hover:border-emerald-300/30"
                        title="Increase"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(s.itemId)}
                      className="ml-1 w-7 h-7 rounded-lg border border-emerald-300/15 bg-black/10 hover:border-emerald-300/30"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="mt-4 flex justify-center">
          <div className="w-full max-w-2xl rounded-2xl border border-emerald-300/15 bg-black/10 backdrop-blur-md p-3">
            <div className="text-sm text-emerald-200/80 mb-2">Results ({results.length})</div>

            {results.length === 0 ? (
              <div className="text-sm text-emerald-200/70">No craftable items found.</div>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
                {results.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => addItem(it.id)}
                    className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 border border-emerald-300/10 bg-black/10 hover:border-emerald-300/25 transition"
                  >
                    <ItemIcon itemId={it.id} itemsById={itemsById} size={34} />
                    <div className="flex-1 min-w-0">
                      <div className="text-emerald-100 text-sm font-medium truncate">{it.name}</div>
                      <div
                        className={`text-xs mt-0.5 ${
                          rarityInfo(it.rarity)?.className ?? "text-emerald-200/40"
                        }`}
                      >
                        {rarityInfo(it.rarity)?.label ?? "—"}
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-lg border border-emerald-300/20 bg-black/10">
                      Add
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-3 text-xs text-emerald-200/60">
              Tip: click “Add” to add the item (if already selected, quantity +1).
            </div>
          </div>
        </div>
      )}

      {/* Panels */}
      {activeItem && (
        <div className="mt-6 grid lg:grid-cols-12 gap-4">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-emerald-300/15 bg-black/10 backdrop-blur-md p-4">
              <div className="flex items-start gap-4">
                <ItemIcon itemId={activeItem.id} itemsById={itemsById} />
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-semibold text-emerald-200 truncate">{activeItem.name}</div>
                  {rarityInfo(activeItem.rarity) ? (
                    <div className={`text-sm mt-0.5 ${rarityInfo(activeItem.rarity)!.className}`}>
                      {rarityInfo(activeItem.rarity)!.label}
                    </div>
                  ) : (
                    <div className="text-sm mt-0.5 text-emerald-200/40">—</div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-emerald-300 mb-3">
                  What you need (expand craftable components)
                </h2>

                <RecipeNode
                  rootId={activeItem.id}
                  root
                  itemId={activeItem.id}
                  depth={0}
                  itemsById={itemsById}
                  recipesByResultId={recipesByResultId}
                  expanded={getExpanded(activeItem.id)}
                  recipeChoice={getRecipeChoice(activeItem.id)}
                  onToggle={(id) => toggleExpanded(activeItem.id, id)}
                  onCycleRecipe={(id) => cycleRecipe(activeItem.id, id)}
                  isCraftable={isCraftable}
                  visited={new Set<number>()}
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-emerald-300/15 bg-black/10 backdrop-blur-md p-4 h-full">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-emerald-300">Shopping list</h2>
                <button
                  onClick={copyShoppingList}
                  disabled={shoppingList.length === 0}
                  className="text-xs px-3 py-2 rounded-lg border border-emerald-300/20 bg-black/10 hover:border-emerald-300/35 disabled:opacity-40"
                >
                  Copy
                </button>
              </div>

              <div className="text-xs text-emerald-200/70 mt-1">
                Aggregated for all selected items (with quantities). Expanding a craftable ingredient replaces it with
                sub-ingredients.
              </div>

              {shoppingList.length === 0 ? (
                <div className="mt-4 text-emerald-200/80 text-sm">Nothing to buy.</div>
              ) : (
                <div className="mt-4 space-y-2 max-h-[720px] overflow-auto pr-1">
                  {shoppingList.map((row) => {
                    const it = itemsById.get(row.itemId);
                    const name = it?.name ?? `#${row.itemId}`;
                    const rInfo = rarityInfo(it?.rarity);

                    return (
                      <div
                        key={row.itemId}
                        className="flex items-center gap-3 rounded-xl border border-emerald-300/10 bg-black/10 px-3 py-2"
                      >
                        <ItemIcon itemId={row.itemId} itemsById={itemsById} size={32} />
                        <div className="flex-1 min-w-0">
                          <div className="text-emerald-100 text-sm truncate">{name}</div>
                          <div className={`text-xs mt-0.5 ${rInfo?.className ?? "text-emerald-200/40"}`}>
                            {rInfo?.label ?? "—"}
                          </div>
                        </div>
                        <div className="text-emerald-200 font-semibold">x{row.qty}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RecipeNode(props: {
  rootId: number;
  root?: boolean;
  itemId: number;
  depth: number;
  itemsById: Map<number, CompactItem>;
  recipesByResultId: Map<number, CompactRecipe[]>;
  expanded: Set<number>;
  recipeChoice: Map<number, number>;
  onToggle: (id: number) => void;
  onCycleRecipe: (id: number) => void;
  isCraftable: (id: number) => boolean;
  visited: Set<number>;
  // ✅ NEW: when true, don't render the "self" row/header (used to avoid duplicates when nested under ingredient row)
  hideSelfRow?: boolean;
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
    hideSelfRow,
  } = props;

  const item = itemsById.get(itemId);
  const name = item?.name ?? `#${itemId}`;
  const rInfo = rarityInfo(item?.rarity);

  const recipes = recipesByResultId.get(itemId) ?? [];
  const craftable = recipes.length > 0;

  const loop = visited.has(itemId);
  const nextVisited = new Set(visited);
  nextVisited.add(itemId);

  // ✅ If we're nested under an ingredient row, that row already implies "open"
  const isOpen = root ? true : hideSelfRow ? true : expanded.has(itemId);

  const chosenIdx = recipeChoice.get(itemId) ?? 0;
  const recipe = craftable ? recipes[Math.min(chosenIdx, recipes.length - 1)] : null;

  return (
    <div className="space-y-2">
      {/* non-root header row (skip if hideSelfRow) */}
      {!root && !hideSelfRow && (
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-2 border border-emerald-300/10 bg-black/10"
          style={{ marginLeft: depth * 16 }}
        >
          <button
            onClick={() => onToggle(itemId)}
            className="text-xs px-2 py-1 rounded-lg border border-emerald-300/20 bg-black/10 hover:border-emerald-300/35"
            title={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? "−" : "+"}
          </button>

          <ItemIcon itemId={itemId} itemsById={itemsById} size={28} />

          <div className="flex-1 min-w-0">
            <div className="text-emerald-100 text-sm truncate">{name}</div>
            <div className={`text-xs mt-0.5 ${rInfo?.className ?? "text-emerald-200/40"}`}>
              {rInfo?.label ?? "—"}{" "}
              <span className="text-emerald-200/40">
                • {craftable ? "craftable" : "not craftable"}
                {loop ? " • loop" : ""}
              </span>
            </div>
          </div>

          {craftable && recipes.length > 1 && (
            <button
              onClick={() => onCycleRecipe(itemId)}
              className="text-xs px-2 py-1 rounded-lg border border-emerald-300/20 bg-black/10 hover:border-emerald-300/35"
              title="Switch recipe"
            >
              Recipe {chosenIdx + 1}/{recipes.length}
            </button>
          )}
        </div>
      )}

      {/* root card */}
      {root && (
        <div className="rounded-xl border border-emerald-300/10 bg-black/10 px-3 py-2">
          <div className="flex items-center gap-3">
            <ItemIcon itemId={itemId} itemsById={itemsById} size={32} />
            <div className="flex-1 min-w-0">
              <div className="text-emerald-100 text-sm font-medium truncate">{name}</div>
              <div className={`text-xs mt-0.5 ${rInfo?.className ?? "text-emerald-200/40"}`}>
                {rInfo?.label ?? "—"}{" "}
                <span className="text-emerald-200/40">
                  • root • {craftable ? "craftable" : "not craftable"}
                </span>
              </div>
            </div>

            {craftable && recipes.length > 1 && (
              <button
                onClick={() => onCycleRecipe(itemId)}
                className="text-xs px-2 py-1 rounded-lg border border-emerald-300/20 bg-black/10 hover:border-emerald-300/35"
                title="Switch recipe"
              >
                Recipe {chosenIdx + 1}/{recipes.length}
              </button>
            )}
          </div>
        </div>
      )}

      {/* children */}
      {isOpen && craftable && recipe && !loop && (
        <div className="space-y-2">
          {recipe.ingredients.map((ing, idx) => {
            const ingItem = itemsById.get(ing.itemId);
            const ingName = ingItem?.name ?? `#${ing.itemId}`;
            const ingCraftable = isCraftable(ing.itemId);
            const ingR = rarityInfo(ingItem?.rarity);

            return (
              <div
                key={`${itemId}-${ing.itemId}-${idx}`}
                className="rounded-xl border border-emerald-300/10 bg-black/10 px-3 py-2"
                style={{ marginLeft: (depth + 1) * 16 }}
              >
                <div className="flex items-center gap-3">
                  {ingCraftable ? (
                    <button
                      onClick={() => onToggle(ing.itemId)}
                      className="text-xs px-2 py-1 rounded-lg border border-emerald-300/20 bg-black/10 hover:border-emerald-300/35"
                      title={expanded.has(ing.itemId) ? "Collapse ingredient" : "Expand ingredient"}
                    >
                      {expanded.has(ing.itemId) ? "−" : "+"}
                    </button>
                  ) : (
                    <div className="w-[34px]" />
                  )}

                  <ItemIcon itemId={ing.itemId} itemsById={itemsById} size={28} />

                  <div className="flex-1 min-w-0">
                    <div className="text-emerald-100 text-sm truncate">{ingName}</div>
                    <div className={`text-xs mt-0.5 ${ingR?.className ?? "text-emerald-200/40"}`}>
                      {ingR?.label ?? "—"}{" "}
                      <span className="text-emerald-200/40">
                        • {ingCraftable ? "craftable" : "not craftable"}
                      </span>
                    </div>
                  </div>

                  <div className="text-emerald-200 font-semibold">x{ing.qty}</div>
                </div>

                {/* ✅ nested children WITHOUT repeating the header row */}
                {ingCraftable && expanded.has(ing.itemId) && (
                  <div className="mt-2">
                    <RecipeNode
                      rootId={props.rootId}
                      itemId={ing.itemId}
                      depth={depth + 1} // keep indentation consistent
                      itemsById={itemsById}
                      recipesByResultId={recipesByResultId}
                      expanded={expanded}
                      recipeChoice={recipeChoice}
                      onToggle={onToggle}
                      onCycleRecipe={onCycleRecipe}
                      isCraftable={isCraftable}
                      visited={nextVisited}
                      hideSelfRow
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ItemIcon({
  itemId,
  size = 44,
  itemsById,
}: {
  itemId: number;
  size?: number;
  itemsById?: Map<number, CompactItem>;
}) {
  const item = itemsById?.get(itemId);
  const gfx = item?.gfxId ?? itemId;

  const [src, setSrc] = useState(getItemIconUrl(gfx, "ankama"));

  useEffect(() => {
    const it = itemsById?.get(itemId);
    const g = it?.gfxId ?? itemId;
    setSrc(getItemIconUrl(g, "ankama"));
  }, [itemId, itemsById]);

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      className="rounded-xl bg-black/10 backdrop-blur-md border border-emerald-300/15"
      onError={() => {
        const it = itemsById?.get(itemId);
        const g = it?.gfxId ?? itemId;
        if (src.includes("static.ankama.com")) setSrc(getItemIconUrl(g, "wakassets"));
      }}
      loading="lazy"
    />
  );
}