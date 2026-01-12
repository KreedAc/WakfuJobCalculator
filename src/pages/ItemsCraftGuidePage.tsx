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

export function ItemsCraftGuidePage() {
  const [loading, setLoading] = useState(true);

  const [items, setItems] = useState<CompactItem[]>([]);
  const [itemsById, setItemsById] = useState<Map<number, CompactItem>>(new Map());
  const [recipesByResultId, setRecipesByResultId] = useState<Map<number, CompactRecipe[]>>(new Map());

  // UI state
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hideResults, setHideResults] = useState(false);

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

  const itemsCraftable = useMemo(() => {
    // Mostra SOLO item craftabili (cioè presenti come result in almeno una recipe)
    const craftableIds = new Set<number>([...recipesByResultId.keys()]);
    const craftable = items.filter((it) => craftableIds.has(it.id));
    // utile per ricerca
    return craftable.map((it) => ({ ...it, _norm: norm(it.name) })) as (CompactItem & { _norm: string })[];
  }, [items, recipesByResultId]);

  const results = useMemo(() => {
    const q = norm(query);
    if (!q) return [];
    return itemsCraftable
      .filter((it) => it._norm.includes(q))
      .slice(0, 30)
      .map(({ _norm, ...it }) => it); // rimuovi campo interno
  }, [itemsCraftable, query]);

  const selected: CompactItem | null = useMemo(() => {
    if (!selectedId) return results[0] ?? null;
    return itemsById.get(selectedId) ?? results[0] ?? null;
  }, [selectedId, results, itemsById]);

  useEffect(() => {
    // se non c'è selectedId e ci sono risultati, seleziona il primo automaticamente
    if (!selectedId && results.length > 0) {
      const first = results[0];
      setSelectedId(first.id);
      setExpanded(new Set([first.id]));
      setRecipeChoice(new Map());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results.length]);

  const isCraftable = (id: number) => (recipesByResultId.get(id)?.length ?? 0) > 0;

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
      const nextIdx = (curr + 1) % list.length;
      next.set(itemId, nextIdx);
      return next;
    });
  };

  // Build shopping list: somma solo gli ingredienti "leaf" NON espansi (oppure non craftabili)
  const shoppingList: ShoppingRow[] = useMemo(() => {
    if (!selected) return [];

    const acc = new Map<number, number>();
    const visited = new Set<number>();

    const add = (itemId: number, qty: number) => {
      acc.set(itemId, (acc.get(itemId) ?? 0) + qty);
    };

    const walk = (itemId: number, qtyMul: number) => {
      // evita loop strani
      const key = itemId;
      if (visited.has(key)) {
        add(itemId, qtyMul);
        return;
      }
      visited.add(key);

      const craftable = isCraftable(itemId);
      const isOpen = expanded.has(itemId);

      // se non craftabile oppure non espanso => va in lista spesa
      if (!craftable || !isOpen) {
        add(itemId, qtyMul);
        visited.delete(key);
        return;
      }

      const recs = recipesByResultId.get(itemId) ?? [];
      if (recs.length === 0) {
        add(itemId, qtyMul);
        visited.delete(key);
        return;
      }

      const idx = recipeChoice.get(itemId) ?? 0;
      const recipe = recs[Math.min(idx, recs.length - 1)];

      for (const ing of recipe.ingredients) {
        walk(ing.itemId, qtyMul * ing.qty);
      }

      visited.delete(key);
    };

    // per il selected item, NON lo aggiungiamo come “da comprare”: espandiamo sempre la sua ricetta (se esiste)
    const rootId = selected.id;
    const rootRecs = recipesByResultId.get(rootId) ?? [];
    if (rootRecs.length === 0) return [];

    // il root lo consideriamo come “open” virtualmente
    const idx = recipeChoice.get(rootId) ?? 0;
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
      return `${name} x${r.qty} (ID: ${r.itemId})`;
    });
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback: niente
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-emerald-300">Items Craft Guide</h1>
        <div className="text-xs text-emerald-200/70">
          craftable items: {itemsCraftable.length} • recipes: {recipesByResultId.size} •{" "}
          {loading ? "loading..." : "ready"}
        </div>
      </div>

      {/* Search (centered) */}
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

      {!query && (
        <p className="mt-4 text-center text-emerald-200/80">
          Type a craftable item name to see its recipe tree.
        </p>
      )}

      {query && results.length === 0 && !loading && (
        <p className="mt-4 text-center text-emerald-200/80">
          No craftable items found for this search.
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-6 grid lg:grid-cols-12 gap-4">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-4">
            {/* Results */}
            <div className="rounded-2xl glass p-3">
              <div className="text-sm text-emerald-200/80 mb-2">Results ({results.length})</div>

              <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
                {results.map((it) => {
                  const isSel = it.id === (selected?.id ?? null);
                  return (
                    <button
                      key={it.id}
                      onClick={() => {
  setSelectedId(it.id);
  setExpanded(new Set([it.id])); // apri root
  setRecipeChoice(new Map());
  setHideResults(true); // ✅ nascondi lista
}}
                      
                      className={[
                        "w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 border transition",
                        isSel ? "glass-strong" : "glass-soft hover:border-emerald-300/25",
                      ].join(" ")}
                    >
                      <ItemIcon itemId={it.id} size={34} />
                      <div className="flex-1">
                        <div className="text-emerald-100 text-sm font-medium">{it.name}</div>
                        <div className="text-emerald-200/55 text-xs">ID: {it.id}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected + Tree */}
            {selected && (
              <div className="rounded-2xl glass p-4">
                <div className="flex items-start gap-4">
                  <ItemIcon itemId={selected.id} />
                  <div className="flex-1">
                    <div className="text-xl font-semibold text-emerald-200">{selected.name}</div>
                    {selected.description && (
  <div className="text-sm text-emerald-200/80 mt-1 whitespace-pre-line">
    {selected.description}
  </div>
)}
                    <div className="text-xs text-emerald-200/55 mt-2">ID: {selected.id}</div>
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
                    isCraftable={isCraftable}
                    visited={new Set<number>()}
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Shopping list */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl glass p-4 h-full">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-emerald-300">Shopping list</h2>
                <button
                  onClick={copyShoppingList}
                  disabled={shoppingList.length === 0}
                  className="text-xs px-3 py-2 rounded-lg border border-emerald-300/20 bg-black/10 backdrop-blur-md hover:border-emerald-300/35 disabled:opacity-40"
                >
                  Copy
                </button>
              </div>

              <div className="text-xs text-emerald-200/70 mt-1">
                Expand an ingredient to “craft it”; otherwise it stays here.
              </div>

              {shoppingList.length === 0 ? (
                <div className="mt-4 text-emerald-200/80 text-sm">
                  {selected ? "Nothing to buy (or no selection)." : "Select an item first."}
                </div>
              ) : (
                <div className="mt-4 space-y-2 max-h-[720px] overflow-auto pr-1">
                  {shoppingList.map((row) => {
                    const it = itemsById.get(row.itemId);
                    const label = it?.name ?? `#${row.itemId}`;
                    return (
                      <div
                        key={row.itemId}
                        className="flex items-center gap-3 rounded-xl glass-soft px-3 py-2"
                      >
                        <ItemIcon itemId={row.itemId} size={32} />
                        <div className="flex-1">
                          <div className="text-emerald-100 text-sm">{label}</div>
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

  // prevenzione loop
  const loop = visited.has(itemId);
  const nextVisited = new Set(visited);
  nextVisited.add(itemId);

  const isOpen = root ? true : expanded.has(itemId); // root sempre aperto
  const chosenIdx = recipeChoice.get(itemId) ?? 0;
  const recipe = craftable ? recipes[Math.min(chosenIdx, recipes.length - 1)] : null;

  return (
    <div className="space-y-2">
      {!root && (
        <div
          className={[
            "flex items-center gap-3 rounded-xl px-3 py-2 border",
            "glass-soft",
          ].join(" ")}
          style={{ marginLeft: depth * 16 }}
        >
          <button
            onClick={() => onToggle(itemId)}
            className="text-xs px-2 py-1 rounded-lg border border-emerald-300/20 bg-black/10 backdrop-blur-md hover:border-emerald-300/35"
            title={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? "−" : "+"}
          </button>

          <ItemIcon itemId={itemId} size={28} />

          <div className="flex-1 min-w-0">
            <div className="text-emerald-100 text-sm truncate">{name}</div>
            <div className="text-emerald-200/55 text-xs">
              ID: {itemId} {craftable ? "• craftable" : "• not craftable"}
              {loop ? " • loop" : ""}
            </div>
          </div>

          {craftable && recipes.length > 1 && (
            <button
              onClick={() => onCycleRecipe(itemId)}
              className="text-xs px-2 py-1 rounded-lg border border-emerald-300/20 bg-black/10 backdrop-blur-md hover:border-emerald-300/35"
              title="Switch recipe (if multiple)"
            >
              Recipe {chosenIdx + 1}/{recipes.length}
            </button>
          )}
        </div>
      )}

      {root && (
        <div className="rounded-xl glass-soft px-3 py-2">
          <div className="flex items-center gap-3">
            <ItemIcon itemId={itemId} size={32} />
            <div className="flex-1">
              <div className="text-emerald-100 text-sm font-medium">{name}</div>
              <div className="text-emerald-200/60 text-xs">
                Root item • ID: {itemId} • {craftable ? "craftable" : "not craftable"}
              </div>
            </div>

            {craftable && recipes.length > 1 && (
              <button
                onClick={() => onCycleRecipe(itemId)}
                className="text-xs px-2 py-1 rounded-lg border border-emerald-300/20 bg-black/10 backdrop-blur-md hover:border-emerald-300/35"
                title="Switch recipe (if multiple)"
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

            return (
              <div
                key={`${itemId}-${ing.itemId}-${idx}`}
                className="rounded-xl glass-soft px-3 py-2"
                style={{ marginLeft: (depth + 1) * 16 }}
              >
                <div className="flex items-center gap-3">
                  {ingCraftable ? (
                    <button
                      onClick={() => onToggle(ing.itemId)}
                      className="text-xs px-2 py-1 rounded-lg border border-emerald-300/20 bg-black/10 backdrop-blur-md hover:border-emerald-300/35"
                      title={expanded.has(ing.itemId) ? "Collapse ingredient" : "Expand ingredient"}
                    >
                      {expanded.has(ing.itemId) ? "−" : "+"}
                    </button>
                  ) : (
                    <div className="w-[34px]" />
                  )}

                  <ItemIcon itemId={ing.itemId} size={28} />

                  <div className="flex-1 min-w-0">
                    <div className="text-emerald-100 text-sm truncate">{ingName}</div>
                    <div className="text-emerald-200/55 text-xs">
                      ID: {ing.itemId} {ingCraftable ? "• craftable" : "• not craftable"}
                    </div>
                  </div>

                  <div className="text-emerald-200 font-semibold">x{ing.qty}</div>
                </div>

                {/* nested node */}
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

function ItemIcon({ itemId, size = 44 }: { itemId: number; size?: number }) {
  const [src, setSrc] = useState(getItemIconUrl(itemId, "ankama"));

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      className="rounded-xl bg-black/10 backdrop-blur-md border border-emerald-300/15"
      onError={() => {
        // fallback
        if (src.includes("static.ankama.com")) setSrc(getItemIconUrl(itemId, "wakassets"));
      }}
      loading="lazy"
    />
  );
}
