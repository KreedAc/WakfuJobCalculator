import { useEffect, useMemo, useState } from "react";
import {
  loadWakfuData,
  getItemIconUrl,
  type CompactItem,
  type CompactRecipe,
} from "../lib/wakfuData";

function norm(s: unknown) {
  const str = String(s ?? "");
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function lower(s: unknown) {
  return String(s ?? "").toLowerCase().trim();
}

export function ItemsCraftGuidePage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CompactItem[]>([]);
  const [itemsById, setItemsById] = useState<Map<number, CompactItem>>(new Map());
  const [recipesByResultId, setRecipesByResultId] = useState<Map<number, CompactRecipe[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    loadWakfuData()
      .then((d) => {
        setItems(d.items);
        setItemsById(d.itemsById);
        setRecipesByResultId(d.recipesByResultId);
      })
      .catch((e) => setError(e?.message ? String(e.message) : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const qRaw = query.trim();
  const qLower = lower(qRaw);
  const qNorm = norm(qRaw);

  const { mergedResults, debugCounts } = useMemo(() => {
    if (!qRaw) {
      return {
        mergedResults: [] as CompactItem[],
        debugCounts: { simple: 0, normalized: 0, byId: 0 },
      };
    }

    // match per ID (se l'input è numerico)
    const byId =
      /^\d+$/.test(qRaw) ? (itemsById.get(Number(qRaw)) ? [itemsById.get(Number(qRaw))!] : []) : [];

    let simple = 0;
    let normalized = 0;

    const res: CompactItem[] = [];

    for (const it of items) {
      const nameRaw = it?.name;
      const nameLower = lower(nameRaw);
      const nameNorm = norm(nameRaw);

      const hitSimple = qLower && nameLower.includes(qLower);
      const hitNorm = qNorm && nameNorm.includes(qNorm);

      if (hitSimple) simple++;
      if (hitNorm) normalized++;

      // aggiungiamo ai risultati se matcha uno dei due
      if (hitSimple || hitNorm) res.push(it);

      // taglio per performance
      if (res.length >= 80) break;
    }

    const uniq = new Map<number, CompactItem>();
    for (const x of byId) uniq.set(x.id, x);
    for (const x of res) uniq.set(x.id, x);

    return {
      mergedResults: Array.from(uniq.values()).slice(0, 50),
      debugCounts: { simple, normalized, byId: byId.length },
    };
  }, [items, itemsById, qRaw, qLower, qNorm]);

  const effectiveSelectedId = selectedId ?? (mergedResults[0]?.id ?? null);
  const selected = effectiveSelectedId != null ? itemsById.get(effectiveSelectedId) ?? null : null;
  const recipes = selected ? recipesByResultId.get(selected.id) ?? [] : [];

  const sample = useMemo(() => {
    return items.slice(0, 5).map((x) => ({
      id: x.id,
      name: String(x.name ?? ""),
      nameNorm: norm(x.name),
    }));
  }, [items]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-emerald-300 mb-2">Items Craft Guide</h1>

      <div className="mb-4 text-xs text-emerald-200/60">
        <span className="mr-3">items: {items.length}</span>
        <span className="mr-3">
          recipes: {Array.from(recipesByResultId.values()).reduce((a, b) => a + b.length, 0)}
        </span>
        <span>{loading ? "loading…" : "ready"}</span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-900/20 p-3">
          <div className="text-red-200 font-semibold mb-1">Data load error</div>
          <pre className="text-red-200/80 text-xs whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {/* DEBUG BOX (temporalmente) */}
      {!error && !loading && (
        <div className="mb-4 rounded-xl border border-emerald-300/15 bg-black/25 p-3 text-xs text-emerald-200/70">
          <div className="font-semibold text-emerald-200 mb-2">Debug</div>
          <div>query raw: <span className="text-emerald-100">{JSON.stringify(qRaw)}</span></div>
          <div>query lower: <span className="text-emerald-100">{JSON.stringify(qLower)}</span></div>
          <div>query norm: <span className="text-emerald-100">{JSON.stringify(qNorm)}</span></div>
          <div className="mt-2">
            matches (simple): <span className="text-emerald-100">{debugCounts.simple}</span>{" "}
            • (normalized): <span className="text-emerald-100">{debugCounts.normalized}</span>{" "}
            • (byId): <span className="text-emerald-100">{debugCounts.byId}</span>
          </div>
          <div className="mt-2">first items sample:</div>
          <pre className="mt-1 whitespace-pre-wrap text-emerald-200/70">
            {JSON.stringify(sample, null, 2)}
          </pre>
        </div>
      )}

      <div className="flex gap-3 items-center mb-4">
        <input
          className="w-full rounded-xl bg-black/30 border border-emerald-300/20 px-4 py-3 outline-none focus:border-emerald-300/50"
          placeholder={loading ? "Loading data..." : "Search item name or ID (try: Apiwood / Gobball / 2021)"}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedId(null);
          }}
          disabled={loading}
        />
      </div>

      {qRaw && mergedResults.length === 0 && !loading && !error && (
        <p className="text-emerald-200/70">No items found.</p>
      )}

      {!error && qRaw && mergedResults.length > 0 && (
        <div className="grid lg:grid-cols-[360px_1fr] gap-4 mt-4">
          {/* risultati */}
          <div className="rounded-2xl border border-emerald-300/15 bg-black/30 p-3">
            <div className="text-sm text-emerald-200/70 mb-2">
              Results ({mergedResults.length})
            </div>

            <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
              {mergedResults.map((it) => {
                const active = it.id === effectiveSelectedId;
                return (
                  <button
                    key={it.id}
                    onClick={() => setSelectedId(it.id)}
                    className={[
                      "w-full text-left rounded-xl border px-3 py-2 flex items-center gap-3",
                      active
                        ? "bg-emerald-900/30 border-emerald-300/30"
                        : "bg-black/20 border-emerald-300/10 hover:border-emerald-300/20",
                    ].join(" ")}
                  >
                    <ItemIcon itemId={it.id} size={32} />
                    <div className="flex-1">
                      <div className="text-emerald-100 text-sm">{String(it.name ?? "")}</div>
                      <div className="text-emerald-200/50 text-xs">ID: {it.id}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* dettaglio */}
          {selected && (
            <div className="rounded-2xl border border-emerald-300/15 bg-black/30 p-4">
              <div className="flex items-start gap-4">
                <ItemIcon itemId={selected.id} />
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

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      className="rounded-xl bg-black/30 border border-emerald-300/10 object-contain"
      onError={() => {
        if (src.includes("static.ankama.com")) setSrc(getItemIconUrl(itemId, "wakassets"));
      }}
      loading="lazy"
    />
  );
}
