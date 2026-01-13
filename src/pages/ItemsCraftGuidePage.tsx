import { useEffect, useMemo, useState } from "react";
import {
  loadWakfuData,
  getItemIconUrl,
  rarityInfo,
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

export function ItemsCraftGuidePage() {
  const [loading, setLoading] = useState(true);

  const [items, setItems] = useState<CompactItem[]>([]);
  const [itemsById, setItemsById] = useState<Map<number, CompactItem>>(new Map());
  const [recipesByResultId, setRecipesByResultId] = useState<Map<number, CompactRecipe[]>>(new Map());

  // UI
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Tree controls
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [recipeChoice, setRecipeChoice] = useState<Map<number, number>>(new Map()); // itemId -> recipeIndex

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

  // Search only craftable items
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

  const selected: CompactItem | null = useMemo(() => {
    if (!selectedId) return null;
    return itemsById.get(selectedId) ?? null;
  }, [selectedId, itemsById]);

  const onSelect = (itemId: number) => {
    setSelectedId(itemId);
    setExpanded(new Set()); // nessun ingrediente espanso all'inizio
    setRecipeChoice(new Map());
  };

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
      const curr = next.get(itemId) ?? 0;
      next.set(itemId, (curr + 1) % list.length);
      return next;
    });
  };

  // Shopping list: leaves that are not expanded (or not craftable)
  const shoppingList: ShoppingRow[] = useMemo(() => {
    if (!selected) return [];

    const acc = new Map<number, number>();
    const visited = new Set<number>();

    const add = (itemId: number, qty: number) => {
      acc.set(itemId, (acc.get(itemId) ?? 0) + qty);
    };

    const walk = (itemId: number, qtyMul: number) => {
      if (visited.has(itemId)) {
        add(itemId, qtyMul);
        return;
      }
      visited.add(itemId);

      const craftable = isCraftable(itemId);
      const open = expanded.has(itemId);

      if (!craftable || !open) {
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

      const idx = recipeChoice.get(itemId) ?? 0;
      const recipe = recs[Math.min(idx, recs.length - 1)];

      for (const ing of recipe.ingredients) {
        walk(ing.itemId, qtyMul * ing.qty);
      }

      visited.delete(itemId);
    };

    const rootRecs = recipesByResultId.get(selected.id) ?? [];
    if (rootRecs.length === 0) return [];

    const idx = recipeChoice.get(selected.id) ?? 0;
    const rootRecipe = rootRecs[Math.min(idx, rootRecs.length - 1)];

    for (const ing of rootRecipe.ingredients) {
      walk(ing.itemId, ing.qty);
    }

    return [...acc.entries()]
      .map(([itemId, qty]) => ({ itemId, qty }))
      .sort((a, b) => {
        const na = itemsById.get(a.itemId)?.name ?? "";
        const nb = itemsById.get(b.itemId)?.name ?? "";
        return na.localeCompare(nb);
      });
  }, [selected, expanded, recipeChoice, recipesByResultId, itemsById]);

  const copyShoppingList = async () => {
    const lines = shoppingList.map((r) => {
      const name = itemsById.get(r.itemId)?.name ?? `#${r.itemId}`;
      return `${name} x${r.qty}`;
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-emerald-200">Items Craft Guide</h1>
        <div className="text-xs text-emerald-100/70">
          craftable items: {craftableItems.length} • recipes: {recipesByResultId.size} •{" "}
          {loading ? "loading..." : "ready"}
        </div>
      </div>

      {/* Search centered */}
      <div className="mt-5 flex justify-center">
        <div className="w-full max-w-2xl">
          <input
            className="w-full rounded-xl bg-white/10 border border-white/15 backdrop-blur-md px-4 py-3 outline-none focus:border-white/30 text-emerald-50 placeholder:text-emerald-100/60"
            placeholder={loading ? "Loading data..." : "Search craftable item name (e.g. Gobball Amulet)"}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedId(null); // se cambi query, torni ai risultati
            }}
            disabled={loading}
          />
        </div>
      </div>

      {!query && (
        <p className="mt-4 text-center text-emerald-50/80">
          Type a craftable item name to see components and shopping list.
        </p>
      )}

      {query && results.length === 0 && !loading && !selected && (
        <p className="mt-4 text-center text-emerald-50/80">
          No craftable items found for this search.
        </p>
      )}

      {/* Results shown only BEFORE selection */}
      {!selected && query && results.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-3">
            <div className="text-sm text-emerald-50/80 mb-2">Results ({results.length})</div>

            <div className="space-y-2 max-h-[340px] overflow-auto pr-1">
              {results.map((it) => (
                <button
                  key={it.id}
                  onClick={() => onSelect(it.id)}
                  className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 border border-white/10 bg-white/10 hover:border-white/25 transition"
                >
                  <ItemIcon itemId={it.id} size={34} itemsById={itemsById} />
                  <div className="flex-1 min-w-0">
                    <div className="text-emerald-50 text-sm font-medium truncate">{it.name}</div>
                    <div className="mt-1">
                      <RarityBadge rarity={it.rarity ?? null} />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs text-emerald-50/60">
              Tip: click an item to open the recipe + shopping list.
            </div>
          </div>
        </div>
      )}

      {/* After selection: show ONLY left recipe + right shopping */}
      {selected && (
        <div className="mt-6 grid lg:grid-cols-12 gap-4">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-4">
              <div className="flex items-start gap-4">
                <ItemIcon itemId={selected.id} itemsById={itemsById} />
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-semibold text-emerald-50 truncate">{selected.name}</div>
                  <div className="mt-1">
                    <RarityBadge rarity={selected.rarity ?? null} />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-emerald-50/90 mb-3">
                  What you need (expand craftable components)
                </h2>

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
                  isCraftable={isCraftable}
                  visited={new Set<number>()}
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-4 h-full">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-emerald-50/90">Shopping list</h2>
                <button
                  onClick={copyShoppingList}
                  disabled={shoppingList.length === 0}
                  className="text-xs px-3 py-2 rounded-lg border border-white/15 bg-white/10 hover:border-white/30 disabled:opacity-40"
                >
                  Copy
                </button>
              </div>

              <div className="text-xs text-emerald-50/70 mt-1">
                If you expand a craftable ingredient, it disappears from here and is replaced by its sub-ingredients.
              </div>

              {shoppingList.length === 0 ? (
                <div className="mt-4 text-emerald-50/80 text-sm">Nothing to buy.</div>
              ) : (
                <div className="mt-4 space-y-2 max-h-[720px] overflow-auto pr-1">
                  {shoppingList.map((row) => {
                    const it = itemsById.get(row.itemId);
                    const label = it?.name ?? `#${row.itemId}`;
                    return (
                      <div
                        key={row.itemId}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2"
                      >
                        <ItemIcon itemId={row.itemId} size={32} itemsById={itemsById} />
                        <div className="flex-1 min-w-0">
                          <div className="text-emerald-50 text-sm truncate">{label}</div>
                          <div className="mt-1">
                            <RarityBadge rarity={it?.rarity ?? null} />
                          </div>
                        </div>
                        <div className="text-emerald-50 font-semibold">x{row.qty}</div>
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
    visited,
  } = props;

  const item = itemsById.get(itemId);
  const name = item?.name ?? `#${itemId}`;

  const recipes = recipesByResultId.get(itemId) ?? [];
  const craftable = recipes.length > 0;

  const loop = visited.has(itemId);
  const nextVisited = new Set(visited);
  nextVisited.add(itemId);

  const isOpen = root ? true : expanded.has(itemId);
  const chosenIdx = recipeChoice.get(itemId) ?? 0;
  const recipe = craftable ? recipes[Math.min(chosenIdx, recipes.length - 1)] : null;

  return (
    <div className="space-y-2">
      {root && (
        <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2">
          <div className="flex items-center gap-3">
            <ItemIcon itemId={itemId} size={32} itemsById={itemsById} />
            <div className="flex-1 min-w-0">
              <div className="text-emerald-50 text-sm font-medium truncate">{name}</div>
              <div className="mt-1">
                <RarityBadge rarity={item?.rarity ?? null} />
              </div>
            </div>

            {craftable && recipes.length > 1 && (
              <button
                onClick={() => onCycleRecipe(itemId)}
                className="text-xs px-2 py-1 rounded-lg border border-white/15 bg-white/10 hover:border-white/30"
                title="Switch recipe"
              >
                Recipe {chosenIdx + 1}/{recipes.length}
              </button>
            )}
          </div>
        </div>
      )}

      {isOpen && craftable && recipe && !loop && (
        <div className="space-y-2">
          {recipe.ingredients.map((ing, idx) => {
            const ingItem = itemsById.get(ing.itemId);
            const ingName = ingItem?.name ?? `#${ing.itemId}`;
            const ingCraftable = (recipesByResultId.get(ing.itemId)?.length ?? 0) > 0;

            return (
              <div
                key={`${itemId}-${ing.itemId}-${idx}`}
                className="rounded-xl border border-white/10 bg-white/10 px-3 py-2"
                style={{ marginLeft: (depth + 1) * 16 }}
              >
                <div className="flex items-center gap-3">
                  {ingCraftable ? (
                    <button
                      onClick={() => onToggle(ing.itemId)}
                      className="text-xs px-2 py-1 rounded-lg border border-white/15 bg-white/10 hover:border-white/30"
                      title={expanded.has(ing.itemId) ? "Collapse ingredient" : "Expand ingredient"}
                    >
                      {expanded.has(ing.itemId) ? "−" : "+"}
                    </button>
                  ) : (
                    <div className="w-[34px]" />
                  )}

                  <ItemIcon itemId={ing.itemId} size={28} itemsById={itemsById} />

                  <div className="flex-1 min-w-0">
                    <div className="text-emerald-50 text-sm truncate">{ingName}</div>
                    <div className="mt-1">
                      <RarityBadge rarity={ingItem?.rarity ?? null} />
                    </div>
                  </div>

                  <div className="text-emerald-50 font-semibold">x{ing.qty}</div>
                </div>

                {ingCraftable && expanded.has(ing.itemId) && (
                  <div className="mt-2">
                    <RecipeNode
                      itemId={ing.itemId}
                      depth={depth + 2}
                      itemsById={itemsById}
                      recipesByResultId={recipesByResultId}
                      expanded={expanded}
                      recipeChoice={recipeChoice}
                      onToggle={onToggle}
                      onCycleRecipe={onCycleRecipe}
                      isCraftable={() => true}
                      visited={nextVisited}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {loop && (
        <div className="text-xs text-emerald-50/70" style={{ marginLeft: (depth + 1) * 16 }}>
          Loop detected — stopping expansion.
        </div>
      )}
    </div>
  );
}

function RarityBadge({ rarity }: { rarity: number | null | undefined }) {
  if (!rarity) return null;
  const r = rarityInfo(rarity);
  return (
    <span className={`inline-flex items-center text-[11px] px-2 py-[2px] rounded-full border ${r.cls}`}>
      {r.label}
    </span>
  );
}

function ItemIcon({
  itemId,
  size = 44,
  itemsById,
}: {
  itemId: number;
  size?: number;
  itemsById: Map<number, CompactItem>;
}) {
  const item = itemsById.get(itemId);
  const [src, setSrc] = useState(getItemIconUrl(item ?? itemId, "ankama"));

  useEffect(() => {
    setSrc(getItemIconUrl(item ?? itemId, "ankama"));
  }, [itemId, item]);

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      className="rounded-xl bg-white/5 backdrop-blur-md border border-white/15"
      onError={() => setSrc(getItemIconUrl(item ?? itemId, "wakassets"))}
      loading="lazy"
    />
  );
}
