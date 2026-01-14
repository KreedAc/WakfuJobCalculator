// src/pages/ItemsCraftGuidePage.tsx
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

type CraftEntry = {
  itemId: number;
  qty: number;
};

export function ItemsCraftGuidePage() {
  const [loading, setLoading] = useState(true);

  const [items, setItems] = useState<CompactItem[]>([]);
  const [itemsById, setItemsById] = useState<Map<number, CompactItem>>(new Map());
  const [recipesByResultId, setRecipesByResultId] = useState<Map<number, CompactRecipe[]>>(new Map());

  // UI
  const [query, setQuery] = useState("");

  // Multi-select crafts
  const [crafts, setCrafts] = useState<CraftEntry[]>([]);
  const [activeCraftId, setActiveCraftId] = useState<number | null>(null);

  // Tree controls (globali)
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

  // SOLO craftabili nella ricerca
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

  const activeCraft = useMemo(() => {
    if (!activeCraftId) return null;
    const entry = crafts.find((c) => c.itemId === activeCraftId) ?? null;
    if (!entry) return null;
    const item = itemsById.get(entry.itemId) ?? null;
    return item ? { item, qty: entry.qty } : null;
  }, [activeCraftId, crafts, itemsById]);

  const addCraft = (itemId: number) => {
    setCrafts((prev) => {
      const i = prev.findIndex((c) => c.itemId === itemId);
      if (i !== -1) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...prev, { itemId, qty: 1 }];
    });
    setActiveCraftId(itemId);
    // apri root (almeno il nodo principale)
    setExpanded((prev) => new Set(prev).add(itemId));
  };

  const removeCraft = (itemId: number) => {
    setCrafts((prev) => prev.filter((c) => c.itemId !== itemId));
    setActiveCraftId((prev) => {
      if (prev !== itemId) return prev;
      // se rimuovo l'attivo, scegli il primo rimasto
      const rest = crafts.filter((c) => c.itemId !== itemId);
      return rest[0]?.itemId ?? null;
    });
  };

  const setCraftQty = (itemId: number, qty: number) => {
    const safe = Number.isFinite(qty) ? Math.max(1, Math.floor(qty)) : 1;
    setCrafts((prev) => prev.map((c) => (c.itemId === itemId ? { ...c, qty: safe } : c)));
  };

  const incCraftQty = (itemId: number, delta: number) => {
    setCrafts((prev) =>
      prev.map((c) => {
        if (c.itemId !== itemId) return c;
        return { ...c, qty: Math.max(1, c.qty + delta) };
      })
    );
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

  // Shopping list AGGREGATA: somma i leaf NON espansi (o non craftabili) per tutti i craft selezionati
  const shoppingList: ShoppingRow[] = useMemo(() => {
    if (crafts.length === 0) return [];

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

    for (const craft of crafts) {
      const rootId = craft.itemId;
      const rootRecs = recipesByResultId.get(rootId) ?? [];
      if (rootRecs.length === 0) continue;

      const idx = recipeChoice.get(rootId) ?? 0;
      const rootRecipe = rootRecs[Math.min(idx, rootRecs.length - 1)];

      // root “virtualmente espanso”: moltiplica tutto per qty del craft
      for (const ing of rootRecipe.ingredients) {
        walk(ing.itemId, ing.qty * craft.qty);
      }
    }

    return [...acc.entries()]
      .map(([itemId, qty]) => ({ itemId, qty }))
      .sort((a, b) => {
        const na = itemsById.get(a.itemId)?.name ?? "";
        const nb = itemsById.get(b.itemId)?.name ?? "";
        return na.localeCompare(nb);
      });
  }, [crafts, expanded, recipeChoice, recipesByResultId, itemsById]);

  const copyShoppingList = async () => {
    const lines = shoppingList.map((r) => {
      const it = itemsById.get(r.itemId);
      const name = it?.name ?? `#${r.itemId}`;
      const rar = rarityInfo(it?.rarity);
      return `${name} [${rar.label}] x${r.qty}`;
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

      {/* Results */}
      {query && results.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-2xl rounded-2xl border border-emerald-300/15 bg-black/10 backdrop-blur-md p-3">
            <div className="text-sm text-emerald-200/80 mb-2">Results ({results.length})</div>

            <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
              {results.map((it) => (
                <button
                  key={it.id}
                  onClick={() => addCraft(it.id)}
                  className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 border border-emerald-300/10 bg-black/10 hover:border-emerald-300/25 transition"
                >
                  <ItemIcon itemId={it.id} itemsById={itemsById} size={34} />
                  <div className="flex-1 min-w-0">
                    <div className="text-emerald-100 text-sm font-medium truncate">{it.name}</div>
                    <RarityUnderName item={it} />
                    <div className="text-emerald-200/55 text-xs">ID: {it.id}</div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-lg border border-emerald-300/20 bg-black/10">
                    Add
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs text-emerald-200/60">
              Click an item to add it to your selected crafts (multi-select).
            </div>
          </div>
        </div>
      )}

      {/* Panels */}
      {crafts.length > 0 && (
        <div className="mt-6 grid lg:grid-cols-12 gap-4">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-4">
            {/* Selected crafts */}
            <div className="rounded-2xl border border-emerald-300/15 bg-black/10 backdrop-blur-md p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-emerald-300">Selected crafts</h2>
                <button
                  onClick={() => {
                    setCrafts([]);
                    setActiveCraftId(null);
                  }}
                  className="text-xs px-3 py-2 rounded-lg border border-emerald-300/20 bg-black/10 hover:border-emerald-300/35"
                >
                  Clear
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {crafts.map((c) => {
                  const it = itemsById.get(c.itemId);
                  const name = it?.name ?? `#${c.itemId}`;
                  const active = c.itemId === activeCraftId;

                  return (
                    <div
                      key={c.itemId}
                      className={[
                        "flex items-center gap-3 rounded-xl px-3 py-2 border",
                        active
                          ? "border-emerald-300/30 bg-black/15"
                          : "border-emerald-300/10 bg-black/10",
                      ].join(" ")}
                    >
                      <button
                        onClick={() => setActiveCraftId(c.itemId)}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left"
                        title="Open details"
                      >
                        <ItemIcon itemId={c.itemId} itemsById={itemsById} size={34} />
                        <div className="min-w-0">
                          <div className="text-emerald-100 text-sm font-medium truncate">{name}</div>
                          <RarityUnderName item={it ?? { id: c.itemId, name }} />
                          <div className="text-emerald-200/55 text-xs">ID: {c.itemId}</div>
                        </div>
                      </button>

                      {/* qty controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => incCraftQty(c.itemId, -1)}
                          className="w-8 h-8 rounded-lg border border-emerald-300/20 bg-black/10 hover:border-emerald-300/35"
                        >
                          −
                        </button>
                        <input
                          value={c.qty}
                          onChange={(e) => setCraftQty(c.itemId, Number(e.target.value))}
                          className="w-14 text-center rounded-lg border border-emerald-300/20 bg-black/10 px-2 py-1 outline-none"
                        />
                        <button
                          onClick={() => incCraftQty(c.itemId, +1)}
                          className="w-8 h-8 rounded-lg border border-emerald-300/20 bg-black/10 hover:border-emerald-300/35"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeCraft(c.itemId)}
                        className="text-xs px-2 py-2 rounded-lg border border-emerald-300/20 bg-black/10 hover:border-emerald-300/35"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active craft details */}
            {activeCraft && (
              <div className="rounded-2xl border border-emerald-300/15 bg-black/10 backdrop-blur-md p-4">
                <div className="flex items-start gap-4">
                  <ItemIcon itemId={activeCraft.item.id} itemsById={itemsById} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-semibold text-emerald-200 truncate">
                      {activeCraft.item.name}
                    </div>
                    <RarityUnderName item={activeCraft.item} />
                    <div className="text-xs text-emerald-200/50 mt-1">
                      ID: {activeCraft.item.id} • Craft qty: x{activeCraft.qty}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-emerald-300 mb-3">
                    What you need (expand craftable components)
                  </h2>

                  <RecipeNode
                    root
                    itemId={activeCraft.item.id}
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
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-emerald-300/15 bg-black/10 backdrop-blur-md p-4 h-full">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-emerald-300">Shopping list (total)</h2>
                <button
                  onClick={copyShoppingList}
                  disabled={shoppingList.length === 0}
                  className="text-xs px-3 py-2 rounded-lg border border-emerald-300/20 bg-black/10 hover:border-emerald-300/35 disabled:opacity-40"
                >
                  Copy
                </button>
              </div>

              <div className="text-xs text-emerald-200/70 mt-1">
                This list is aggregated for all selected crafts, with their quantities.
              </div>

              {shoppingList.length === 0 ? (
                <div className="mt-4 text-emerald-200/80 text-sm">Nothing to buy.</div>
              ) : (
                <div className="mt-4 space-y-2 max-h-[720px] overflow-auto pr-1">
                  {shoppingList.map((row) => {
                    const it = itemsById.get(row.itemId);
                    const label = it?.name ?? `#${row.itemId}`;
                    return (
                      <div
                        key={row.itemId}
                        className="flex items-center gap-3 rounded-xl border border-emerald-300/10 bg-black/10 px-3 py-2"
                      >
                        <ItemIcon itemId={row.itemId} itemsById={itemsById} size={32} />
                        <div className="flex-1 min-w-0">
                          <div className="text-emerald-100 text-sm truncate">{label}</div>
                          <RarityUnderName item={it ?? { id: row.itemId, name: label }} />
                          <div className="text-emerald-200/55 text-xs">ID: {row.itemId}</div>
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

      {crafts.length === 0 && !loading && (
        <p className="mt-6 text-center text-emerald-200/80">
          Add one or more craftable items from the results to build your shopping list.
        </p>
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
    isCraftable,
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
      {!root && (
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
            <RarityUnderName item={item ?? { id: itemId, name }} />
            <div className="text-emerald-200/55 text-xs">
              ID: {itemId} {craftable ? "• craftable" : "• not craftable"}
              {loop ? " • loop" : ""}
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

      {root && (
        <div className="rounded-xl border border-emerald-300/10 bg-black/10 px-3 py-2">
          <div className="flex items-center gap-3">
            <ItemIcon itemId={itemId} itemsById={itemsById} size={32} />
            <div className="flex-1 min-w-0">
              <div className="text-emerald-100 text-sm font-medium truncate">{name}</div>
              <RarityUnderName item={item ?? { id: itemId, name }} />
              <div className="text-emerald-200/60 text-xs">
                Root item • ID: {itemId} • {craftable ? "craftable" : "not craftable"}
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

      {isOpen && craftable && recipe && !loop && (
        <div className="space-y-2">
          {recipe.ingredients.map((ing, idx) => {
            const ingItem = itemsById.get(ing.itemId);
            const ingName = ingItem?.name ?? `#${ing.itemId}`;
            const ingCraftable = isCraftable(ing.itemId);

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
                    <RarityUnderName item={ingItem ?? { id: ing.itemId, name: ingName }} />
                    <div className="text-emerald-200/55 text-xs">
                      ID: {ing.itemId} {ingCraftable ? "• craftable" : "• not craftable"}
                    </div>
                  </div>

                  <div className="text-emerald-200 font-semibold">x{ing.qty}</div>
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
                      isCraftable={isCraftable}
                      visited={nextVisited}
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

function RarityUnderName({ item }: { item: CompactItem }) {
  const info = rarityInfo(item.rarity ?? null);
  return (
    <div className="mt-1">
      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] ${info.cls}`}>
        {info.label}
      </span>
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
      className="rounded-xl bg-black/10 backdrop-blur-md border border-emerald-300/15"
      onError={() => setSrc(getItemIconUrl(item ?? itemId, "wakassets"))}
      loading="lazy"
    />
  );
}
