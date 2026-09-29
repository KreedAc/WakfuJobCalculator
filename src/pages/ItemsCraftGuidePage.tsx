// src/pages/ItemsCraftGuidePage.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Minus, Plus, Copy, Check, ChevronRight, ChevronDown, Repeat, ShoppingCart, PackageSearch } from "lucide-react";
import { HowItWorks } from "../components/HowItWorks";
import { ItemImage } from "../components/ItemImage";
import { PageHeader } from "../components/ui/PageHeader";
import {
  loadWakfuData,
  type CompactItem,
  type CompactRecipe,
} from "../lib/wakfuData";
import { PageSeo } from "../components/PageSeo";
import { TRANSLATIONS, type Language } from "../constants/translations";
import { formatCraftItems, parseCraftItems } from "../lib/craftLink";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

type ShoppingRow = { itemId: number; qty: number };
type SelectedRow = { itemId: number; qty: number };

type TranslationType = typeof TRANSLATIONS[Language];

type RarityInfo = { label: string; className: string };
function rarityInfo(r: number | null | undefined, t: TranslationType): RarityInfo | null {
  switch (r ?? null) {
    case 1:
      return { label: t.unusual, className: "text-muted" };
    case 2:
      return { label: t.rare, className: "text-rarity-rare" };
    case 3:
      return { label: t.mythical, className: "text-rarity-mythic" };
    case 4:
      return { label: t.legendary, className: "text-rarity-legendary" };
    case 5:
      return { label: t.relic, className: "text-rarity-relic" };
    case 6:
      return { label: t.souvenir, className: "text-rarity-souvenir" };
    case 7:
      return { label: t.epic, className: "text-rarity-epic" };
    default:
      return null;
  }
}

export function ItemsCraftGuidePage({ language }: { language: Language }) {
  const t = TRANSLATIONS[language];
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

  // Checked items in shopping list
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    setLoading(true);
    loadWakfuData(language)
      .then((d) => {
        setItems(d.items);
        setItemsById(d.itemsById);
        setRecipesByResultId(d.recipesByResultId);
      })
      .finally(() => setLoading(false));
  }, [language]);

  // Items passed in the URL (?items=id,idx2 — e.g. from the search palette) are added
  // once the data is loaded; afterwards the URL mirrors the list so it can be shared.
  const urlImported = useRef(false);
  useEffect(() => {
    if (urlImported.current || recipesByResultId.size === 0) return;
    urlImported.current = true;
    const rows = parseCraftItems(new URLSearchParams(window.location.search).get("items"))
      .filter((r) => recipesByResultId.has(r.itemId));
    if (rows.length === 0) return;
    setSelected(rows);
    setExpandedByRoot(new Map(rows.map((r) => [r.itemId, new Set<number>()])));
    setRecipeChoiceByRoot(new Map(rows.map((r) => [r.itemId, new Map<number, number>()])));
    setActiveItemId(rows[0].itemId);
  }, [recipesByResultId]);

  useEffect(() => {
    if (!urlImported.current) return;
    const search = selected.length ? `?items=${formatCraftItems(selected)}` : "";
    if (search !== window.location.search) {
      window.history.replaceState(window.history.state, "", window.location.pathname + search + window.location.hash);
    }
  }, [selected]);

  const isCraftable = useCallback((id: number) => (recipesByResultId.get(id)?.length ?? 0) > 0, [recipesByResultId]);

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
      .slice(0, 30);
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

  const getExpanded = useCallback(
    (rootId: number) => expandedByRoot.get(rootId) ?? new Set<number>(),
    [expandedByRoot],
  );
  const getRecipeChoice = useCallback(
    (rootId: number) => recipeChoiceByRoot.get(rootId) ?? new Map<number, number>(),
    [recipeChoiceByRoot],
  );

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
    setCheckedItems(new Set());
  };

  const toggleCheckedItem = (itemId: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
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

  const setQtyDirect = (itemId: number, value: number) => {
    setSelected((prev) => {
      const idx = prev.findIndex((x) => x.itemId === itemId);
      if (idx < 0) return prev;
      const next = [...prev];
      const q = Math.max(1, Math.floor(value));
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
  }, [selected, recipesByResultId, itemsById, getExpanded, getRecipeChoice, isCraftable]);

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
  const [copied, setCopied] = useState(false);
  const copyAndConfirm = async () => {
    await copyShoppingList();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const rarityLine = (it: CompactItem | undefined, extra?: string) => {
    const r = rarityInfo(it?.rarity, t);
    return (
      <div className="text-xs mt-0.5 truncate">
        <span className={r?.className ?? "text-subtle"}>{r?.label ?? "—"}</span>
        {extra && <span className="text-subtle"> · {extra}</span>}
      </div>
    );
  };
  const fmt = (n: number) => n.toLocaleString(language);

  return (
    <div>
      <PageSeo title={t.itemsCraftTitle} description={t.itemsCraftHowItWorks.slice(0, 155)} path="/items-craft-guide" />
      <PageHeader
        title={t.itemsCraftTitle}
        subtitle={loading ? `${t.loading}…` : `${t.craftableItems}: ${fmt(craftableItems.length)} · ${t.recipes}: ${fmt(recipesByResultId.size)}`}
      />

      <div className="card p-4 md:p-5 mb-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle pointer-events-none" />
          <input
            type="search"
            className="input pl-10"
            placeholder={loading ? t.loadingData : t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
        </div>

        {showResults && (
          <div className="mt-3">
            <div className="caps-label mb-2">{t.results} ({results.length})</div>
            {results.length === 0 ? (
              <p className="text-sm text-muted py-2">{t.noCraftableFound}</p>
            ) : (
              <ul className="max-h-[320px] overflow-auto -mx-1 px-1 space-y-1">
                {results.map((it) => (
                  <li key={it.id}>
                    <button
                      type="button"
                      onClick={() => addItem(it.id)}
                      className="w-full text-left flex items-center gap-3 rounded-xl px-2.5 py-2 hover:bg-surface2 transition-colors"
                    >
                      <ItemIcon itemId={it.id} itemsById={itemsById} size={36} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-fg truncate">{it.name}</div>
                        {rarityLine(it)}
                      </div>
                      <span className="btn btn-sm shrink-0"><Plus className="w-3.5 h-3.5" /> {t.add}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="help">{t.addTip}</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-line">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="text-[13px] font-semibold text-muted">{t.selectedItems} ({selected.length})</div>
            {selected.length > 0 && (
              <button type="button" onClick={clearAll} className="btn btn-ghost btn-sm"><X className="w-3.5 h-3.5" /> {t.clearAll}</button>
            )}
          </div>
          {selected.length === 0 ? (
            <p className="text-sm text-subtle">{t.addOneOrMore}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selected.map((s) => {
                const it = itemsById.get(s.itemId);
                const isActive = s.itemId === activeItemId;
                return (
                  <div
                    key={s.itemId}
                    className={`flex items-center gap-2 rounded-xl border pl-1.5 pr-1 py-1 transition-colors
                      ${isActive ? "border-primary bg-primary/10" : "border-line bg-bg2"}`}
                  >
                    <button type="button" onClick={() => setActiveItemId(s.itemId)} className="flex items-center gap-2 text-left min-w-0" title={t.showRecipe}>
                      <ItemIcon itemId={s.itemId} itemsById={itemsById} size={28} />
                      <span className="text-[13px] font-semibold text-fg truncate max-w-[160px]">{it?.name ?? `#${s.itemId}`}</span>
                    </button>
                    <div className="flex items-center">
                      <button type="button" onClick={() => setQty(s.itemId, -1)} className="w-7 h-7 grid place-items-center rounded-lg text-muted hover:text-fg hover:bg-surface2" aria-label={t.decrease}>
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={s.qty}
                        aria-label={it?.name}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val > 0) setQtyDirect(s.itemId, val);
                        }}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (isNaN(val) || val < 1) setQtyDirect(s.itemId, 1);
                        }}
                        className="w-10 h-7 text-center font-mono text-[13px] font-semibold bg-transparent text-fg rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button type="button" onClick={() => setQty(s.itemId, +1)} className="w-7 h-7 grid place-items-center rounded-lg text-muted hover:text-fg hover:bg-surface2" aria-label={t.increase}>
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => removeItem(s.itemId)} className="w-7 h-7 grid place-items-center rounded-lg text-subtle hover:text-danger hover:bg-surface2" aria-label={t.remove}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {activeItem ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <section className="card p-4 md:p-5">
            <div className="flex items-center gap-3 mb-5">
              <ItemIcon itemId={activeItem.id} itemsById={itemsById} size={48} />
              <div className="min-w-0">
                <h2 className="font-display text-xl font-bold text-fg truncate">{activeItem.name}</h2>
                {rarityLine(activeItem)}
              </div>
            </div>
            <h3 className="caps-label mb-3">{t.whatYouNeed}</h3>
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
              t={t}
            />
          </section>

          <aside className="card p-4 md:p-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-3">
              <h2 className="section-title flex items-center gap-2"><ShoppingCart className="w-[18px] h-[18px] text-accent" /> {t.shoppingList}</h2>
              <button type="button" onClick={copyAndConfirm} disabled={shoppingList.length === 0} className="btn btn-sm">
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />} {t.copy}
              </button>
            </div>
            <p className="help mt-1">{t.shoppingListHint}</p>

            {shoppingList.length === 0 ? (
              <p className="mt-4 text-sm text-muted">{t.nothingToBuy}</p>
            ) : (
              <ul className="mt-4 space-y-1 max-h-[65vh] overflow-auto -mx-1 px-1">
                {shoppingList.map((row) => {
                  const it = itemsById.get(row.itemId);
                  const isChecked = checkedItems.has(row.itemId);
                  return (
                    <li key={row.itemId}>
                      <label className={`flex items-center gap-3 rounded-xl px-2 py-2 cursor-pointer hover:bg-surface2 transition ${isChecked ? "opacity-50" : ""}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCheckedItem(row.itemId)}
                          className="w-[18px] h-[18px] shrink-0 accent-[rgb(var(--primary))] cursor-pointer"
                        />
                        <ItemIcon itemId={row.itemId} itemsById={itemsById} size={32} />
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium text-fg truncate ${isChecked ? "line-through" : ""}`}>{it?.name ?? `#${row.itemId}`}</div>
                          {rarityLine(it)}
                        </div>
                        <span className={`font-mono font-bold text-sm text-fg ${isChecked ? "line-through" : ""}`}>×{fmt(row.qty)}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
        </div>
      ) : (
        !loading && (
          <div className="card flex flex-col items-center text-center py-14 px-6">
            <PackageSearch className="w-10 h-10 text-subtle mb-3" />
            <p className="text-muted max-w-md">{t.addOneOrMore}</p>
          </div>
        )
      )}

      <HowItWorks title={t.itemsCraftHowItWorksTitle} text={t.itemsCraftHowItWorks} className="mt-8" />
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
  t: TranslationType;
}) {
  const { root, itemId, itemsById, recipesByResultId, expanded, recipeChoice, onToggle, onCycleRecipe, isCraftable, visited, t } = props;

  const recipes = recipesByResultId.get(itemId) ?? [];
  const craftable = recipes.length > 0;
  const loop = visited.has(itemId);
  const nextVisited = new Set(visited);
  nextVisited.add(itemId);

  const chosenIdx = recipeChoice.get(itemId) ?? 0;
  const recipe = craftable ? recipes[Math.min(chosenIdx, recipes.length - 1)] : null;

  const recipeSwitch = craftable && recipes.length > 1 && (
    <button type="button" onClick={() => onCycleRecipe(itemId)} className="btn btn-sm shrink-0" title={t.switchRecipe}>
      <Repeat className="w-3.5 h-3.5" /> {t.recipeNum} {chosenIdx + 1}/{recipes.length}
    </button>
  );

  if (!craftable || !recipe || loop) {
    return loop ? <p className="text-xs text-warning">{t.loop}</p> : null;
  }

  return (
    <div className={root ? "" : "mt-1.5 ml-4 pl-3 border-l-2 border-line"}>
      {root && recipes.length > 1 && <div className="flex justify-end mb-2">{recipeSwitch}</div>}
      {!root && recipes.length > 1 && <div className="flex justify-end mb-1.5">{recipeSwitch}</div>}
      <ul className="space-y-1.5">
        {recipe.ingredients.map((ing, idx) => {
          const ingItem = itemsById.get(ing.itemId);
          const ingCraftable = isCraftable(ing.itemId);
          const open = expanded.has(ing.itemId);
          const r = rarityInfo(ingItem?.rarity, t);
          return (
            <li key={`${itemId}-${ing.itemId}-${idx}`}>
              <div className="flex items-center gap-3 rounded-xl border border-line bg-bg2 px-2.5 py-2">
                {ingCraftable ? (
                  <button
                    type="button"
                    onClick={() => onToggle(ing.itemId)}
                    aria-expanded={open}
                    className="w-7 h-7 grid place-items-center rounded-lg border border-line bg-surface text-muted hover:text-fg shrink-0"
                    title={open ? t.collapseIngredient : t.expandIngredient}
                  >
                    {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                ) : (
                  <span className="w-7 shrink-0" />
                )}
                <ItemIcon itemId={ing.itemId} itemsById={itemsById} size={30} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-fg truncate">{ingItem?.name ?? `#${ing.itemId}`}</div>
                  <div className="text-xs mt-0.5 truncate">
                    <span className={r?.className ?? "text-subtle"}>{r?.label ?? "—"}</span>
                    <span className="text-subtle"> · {ingCraftable ? t.craftable : t.notCraftable}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm text-fg shrink-0">×{ing.qty}</span>
              </div>
              {ingCraftable && open && (
                <RecipeNode {...props} root={false} itemId={ing.itemId} depth={props.depth + 1} visited={nextVisited} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ItemIcon({ itemId, size = 44, itemsById }: { itemId: number; size?: number; itemsById?: Map<number, CompactItem> }) {
  return <ItemImage gfx={itemsById?.get(itemId)?.gfxId} itemId={itemId} size={size} />;
}
