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

type RarityInfo = { label: string; className: string };
function rarityInfo(r: number | null | undefined): RarityInfo | null {
  // tua mappatura:
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

  // ricerca SOLO craftabili
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
    setExpanded(new Set([itemId])); // root aperto
    setRecipeChoice(new Map());
    // ✅ nascondi risultati subito dopo selezione
    // (lo facciamo mettendo query = nome selezionato, ma soprattutto "selectedId != null" nasconde la lista)
    const it = itemsById.get(itemId);
    if (it) setQuery(it.name);
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

  // Shopping list: leaf NON espansi (o non craftabili)
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

    // root: sempre “espanso virtualmente”
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

  // quando l’utente cambia query manualmente, riapre i risultati (deseleziona)
  const onChangeQuery = (v: string) => {
    setQuery(v);
    if (selectedId) setSelectedId(null);
    setExpanded(new Set());
    setRecipeChoice(new Map());
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
            onChange={(e) => onChangeQuery(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {!query && (
        <p className="mt-4 text-center text-emerald-200/80">
          Type a craftable item name to see components and shopping list.
        </p>
      )}

      {query && results.length === 0 && !loading && !selected && (
        <p className="mt-4 text-center text-emerald-200/80">
          No craftable items found for this search.
        </p>
      )}

      {/* RISULTATI: mostrali SOLO quando NON hai selezionato */}
      {!selected && query && results.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-2xl rounded-2xl border border-emerald-300/15 bg-black/10 backdrop-blur-md p-3">
            <div className="text-sm text-emerald-200/80 mb-2">Results ({results.length})</div>

            <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
              {results.map((it) => (
                <button
                  key={it.id}
                  onClick={() => onSelect(it.id)}
                  className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 border border-emerald-300/10 bg-black/10 hover:border-emerald-300/25 transition"
                >
                  <ItemIcon itemId={it.id} itemsById={itemsById} size={34} />
                  <div className="flex-1 min-w-0">
                    <div className="text-emerald-100 text-sm font-medium truncate">{it.name}</div>
                    {rarityInfo(it.rarity)?.label ? (
                      <div className={`text-xs mt-0.5 ${rarityInfo(it.rarity)!.className}`}>
                        {rarityInfo(it.rarity)!.label}
                      </div>
                    ) : (
                      <div className="text-xs mt-0.5 text-emerald-200/40">—</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs text-emerald-200/60">
              Tip: click an item to open the recipe tree + shopping list.
            </div>
          </div>
        </div>
      )}

      {/* DOPO SELEZIONE: mostra SOLO pannelli */}
      {selected && (
        <div className="mt-6 grid lg:grid-cols-12 gap-4">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-emerald-300/15 bg-black/10 backdrop-blur-md p-4">
              <div className="flex items-start gap-4">
                <ItemIcon itemId={selected.id} itemsById={itemsById} />
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-semibold text-emerald-200 truncate">{selected.name}</div>
                  {rarityInfo(selected.rarity) ? (
                    <div className={`text-sm mt-0.5 ${rarityInfo(selected.rarity)!.className}`}>
                      {rarityInfo(selected.rarity)!.label}
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
                If you expand a craftable ingredient, it disappears from here and is replaced by its sub-ingredients.
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
  const rInfo = rarityInfo(item?.rarity);

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
      {/* riga item (non-root) */}
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
  const gfx = item?.gfxId ?? itemId; // ✅ usa gfxId se c'è

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