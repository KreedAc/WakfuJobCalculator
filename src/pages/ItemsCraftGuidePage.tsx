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

  // quando cambi query: mostra risultati e resetta selezione
  useEffect(() => {
    setHideResults(false);
    setSelectedId(null);
    setExpanded(new Set());
    setRecipeChoice(new Map());
  }, [query]);

  const isCraftable = (id: number) => (recipesByResultId.get(id)?.length ?? 0) > 0;

  const itemsCraftable = useMemo(() => {
    // Mostra SOLO item craftabili (cioè presenti come result in almeno una recipe)
    const craftableIds = new Set<number>([...recipesByResultId.keys()]);
    return items
      .filter((it) => craftableIds.has(it.id))
      .map((it) => ({ ...it, _norm: norm(it.name) })) as (CompactItem & { _norm: string })[];
  }, [items, recipesByResultId]);

  const results = useMemo(() => {
    const q = norm(query);
    if (!q) return [];
    return itemsCraftable
      .filter((it) => it._norm.includes(q))
      .slice(0, 30)
      .map(({ _norm, ...it }) => it);
  }, [itemsCraftable, query]);

  const selected: CompactItem | null = useMemo(() => {
    if (!selectedId) return null;
    return itemsById.get(selectedId) ?? null;
  }, [selectedId, itemsById]);

  // se non è stato scelto nulla, ma ci sono risultati, puoi volere “auto-select”
  // (lasciato DISABILITATO per evitare che nasconda i risultati da solo)
  // useEffect(() => {
  //   if (!selectedId && results.length > 0) {
  //     setSelectedId(results[0].id);
  //     setExpanded(new Set([results[0].id]));
  //   }
  // }, [results, selectedId]);

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

  // Shopping list: somma solo gli ingredienti "leaf" NON espansi (opp
