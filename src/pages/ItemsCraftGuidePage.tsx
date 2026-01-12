import { useEffect, useMemo, useState } from "react";
import { loadWakfuData, type CompactItem, type CompactRecipe, type WakfuData } from "../lib/wakfuData";

function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export default function ItemsCraftGuidePage() {
  const [data, setData] = useState<WakfuData | null>(null);
  const [q, setQ] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    loadWakfuData()
      .then((d) => {
        if (!mounted) return;
        setData(d);
      })
      .catch((e) => {
        console.error(e);
        alert("Errore nel caricamento dei dati Wakfu (controlla /public/data).");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const results: CompactItem[] = useMemo(() => {
    if (!data) return [];
    const query = norm(q.trim());
    if (!query) return [];
    // limit per performance
    const out: CompactItem[] = [];
    for (const it of data.items) {
      if (norm(it.name).includes(query)) out.push(it);
      if (out.length >= 30) break;
    }
    return out;
  }, [data, q]);

  const selectedItem = useMemo(() => {
    if (!data || selectedItemId == null) return null;
    return data.itemById.get(selectedItemId) ?? null;
  }, [data, selectedItemId]);

  const recipesForSelected: CompactRecipe[] = useMemo(() => {
    if (!data || selectedItemId == null) return [];
    return data.recipesByResultItemId.get(selectedItemId) ?? [];
  }, [data, selectedItemId]);

  const getItemName = (id: number) => data?.itemById.get(id)?.name ?? `#${id}`;

  if (!data) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6">
        <div className="text-emerald-200/80">Caricamento dati...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-emerald-200">Items Craft Guide</h1>
        <p className="text-emerald-200/70">
          Cerca un item e vedi le ricette che lo producono (dati da Wakfu CDN).
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSelectedItemId(null);
          }}
          placeholder="Cerca item (es. Gobball Amulet)..."
          className="w-full rounded-xl bg-slate-900/60 border border-emerald-400/20 px-4 py-3 text-emerald-100 placeholder:text-emerald-200/40 outline-none focus:border-emerald-400/50"
        />

        {q.trim() && (
          <div className="rounded-xl border border-emerald-400/10 bg-slate-900/40 p-2">
            {results.length === 0 ? (
              <div className="p-3 text-emerald-200/60">Nessun risultato.</div>
            ) : (
              <ul className="divide-y divide-emerald-400/10">
                {results.map((it) => (
                  <li key={it.id}>
                    <button
                      onClick={() => setSelectedItemId(it.id)}
                      className="w-full text-left p-3 hover:bg-emerald-400/5 rounded-lg"
                    >
                      <div className="text-emerald-100 font-medium">{it.name}</div>
                      <div className="text-emerald-200/50 text-sm">ID: {it.id}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {selectedItem && (
        <section className="rounded-2xl border border-emerald-400/15 bg-slate-900/40 p-5 space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-emerald-100">{selectedItem.name}</h2>
            <div className="text-emerald-200/60 text-sm">Item ID: {selectedItem.id}</div>
            {selectedItem.description ? (
              <p className="text-emerald-200/70 mt-2">{selectedItem.description}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-emerald-200">
              Ricette che producono questo item ({recipesForSelected.length})
            </h3>

            {recipesForSelected.length === 0 ? (
              <div className="text-emerald-200/60">Nessuna ricetta trovata per questo item.</div>
            ) : (
              <div className="space-y-3">
                {recipesForSelected.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-emerald-400/10 bg-slate-950/30 p-4"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="text-emerald-100 font-medium">
                        Recipe #{r.id}
                      </div>
                      <div className="text-emerald-200/60 text-sm">
                        Output: {getItemName(r.resultItemId)} × {r.resultQty}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="text-emerald-200/70 text-sm mb-2">Ingredienti</div>
                      <ul className="space-y-1">
                        {r.ingredients.map((ing, idx) => (
                          <li key={idx} className="flex items-center justify-between gap-3">
                            <span className="text-emerald-100">
                              {getItemName(ing.itemId)}
                              <span className="text-emerald-200/50 text-xs"> (#{ing.itemId})</span>
                            </span>
                            <span className="text-emerald-200/70">× {ing.qty}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
