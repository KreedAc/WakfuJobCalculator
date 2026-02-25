import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

type Lang = 'en' | 'fr' | 'es' | 'pt';

type Treasure = {
  achievement: string;
  zone: string;
  coords: { x: number; y: number };
  artifacts: string[];
  rewards: string;
};

const STORAGE_KEY = 'wakfu-treasures-completed';

type TreasuresI18n = {
  _meta?: any;
  locations?: Record<string, Record<Lang, string>>;
  artifacts?: Record<string, Record<Lang, string>>;
  achievements?: Record<string, Record<Lang, string>>;
};

const UI = {
  en: {
    title: 'Treasures',
    subtitle: 'Treasure hunt achievements, locations and required artifacts.',
    searchPlaceholder: 'Search achievement, location, reward…',
    columns: {
      achievement: 'Achievement',
      location: 'Location',
      coords: 'Coords',
      artifacts: 'Artifacts',
      rewards: 'Rewards',
    },
    empty: 'No treasures found.',
    counts: (shown: number, total: number) => `Showing ${shown} / ${total}`,
  },
  fr: {
    title: 'Trésors',
    subtitle: 'Succès de chasse au trésor, emplacements et artefacts requis.',
    searchPlaceholder: 'Rechercher succès, lieu, récompense…',
    columns: {
      achievement: 'Succès',
      location: 'Lieu',
      coords: 'Coord.',
      artifacts: 'Artefacts',
      rewards: 'Récompenses',
    },
    empty: 'Aucun trésor trouvé.',
    counts: (shown: number, total: number) => `Affichage ${shown} / ${total}`,
  },
  es: {
    title: 'Tesoros',
    subtitle: 'Logros de búsqueda del tesoro, ubicaciones y artefactos necesarios.',
    searchPlaceholder: 'Buscar logro, lugar, recompensa…',
    columns: {
      achievement: 'Logro',
      location: 'Lugar',
      coords: 'Coord.',
      artifacts: 'Artefactos',
      rewards: 'Recompensas',
    },
    empty: 'No se encontraron tesoros.',
    counts: (shown: number, total: number) => `Mostrando ${shown} / ${total}`,
  },
  pt: {
    title: 'Tesouros',
    subtitle: 'Conquistas de caça ao tesouro, locais e artefatos necessários.',
    searchPlaceholder: 'Pesquisar conquista, local, recompensa…',
    columns: {
      achievement: 'Conquista',
      location: 'Local',
      coords: 'Coord.',
      artifacts: 'Artefatos',
      rewards: 'Recompensas',
    },
    empty: 'Nenhum tesouro encontrado.',
    counts: (shown: number, total: number) => `Exibindo ${shown} / ${total}`,
  },
} satisfies Record<Lang, any>;

function formatCoords(c: { x: number; y: number }) {
  return `${c.x}, ${c.y}`;
}

export default function TreasuresPage({ language }: { language: Lang }) {
  const t = UI[language];

  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [i18n, setI18n] = useState<TreasuresI18n | null>(null);
  const [query, setQuery] = useState('');
  const [completedTreasures, setCompletedTreasures] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [treasuresRes, i18nRes] = await Promise.allSettled([
        fetch('/data/treasures.json'),
        fetch('/data/treasures.i18n.json'),
      ]);

      if (!cancelled) {
        if (treasuresRes.status === 'fulfilled' && treasuresRes.value.ok) {
          const data = await treasuresRes.value.json();
          setTreasures(Array.isArray(data) ? data : []);
        } else {
          setTreasures([]);
        }

        if (i18nRes.status === 'fulfilled' && i18nRes.value.ok) {
          const data = await i18nRes.value.json();
          setI18n(data || null);
        } else {
          setI18n(null);
        }
      }
    }

    load().catch(() => {
      if (!cancelled) {
        setTreasures([]);
        setI18n(null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const translateLocation = (zone: string) => {
    const hit = i18n?.locations?.[zone]?.[language];
    return hit || zone;
  };

  const translateArtifact = (name: string) => {
    const hit = i18n?.artifacts?.[name]?.[language];
    return hit || name;
  };

  const translateAchievement = (name: string) => {
    const hit = i18n?.achievements?.[name]?.[language];
    return hit || name;
  };

  const toggleTreasure = (achievement: string) => {
    setCompletedTreasures((prev) => {
      const next = new Set(prev);
      if (next.has(achievement)) {
        next.delete(achievement);
      } else {
        next.add(achievement);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return treasures;

    return treasures.filter((tr) => {
      const haystack = [
        tr.achievement,
        translateAchievement(tr.achievement),
        tr.zone,
        translateLocation(tr.zone),
        tr.rewards,
        ...(tr.artifacts || []),
        ...(tr.artifacts || []).map(translateArtifact),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [treasures, query, i18n, language]);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="backdrop-blur-xl bg-gray-900/60 border border-white/10 shadow-xl rounded-3xl p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">{t.title}</h1>
            <p className="mt-1 text-emerald-100/70">{t.subtitle}</p>
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-emerald-100/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-xl border border-white/10 bg-black/20 py-2 pl-9 pr-3 text-sm text-white shadow-sm outline-none ring-0 focus:border-emerald-400/40"
              />
            </div>

            <div className="text-sm text-emerald-100/70">
              {t.counts(filtered.length, treasures.length)}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 shadow-sm">
            <table className="w-full min-w-[900px] table-auto">
              <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-emerald-100/70 w-16">
                  ✓
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-100/70">
                  {t.columns.achievement}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-100/70">
                  {t.columns.location}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-100/70">
                  {t.columns.coords}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-100/70">
                  {t.columns.artifacts}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-100/70">
                  {t.columns.rewards}
                </th>
              </tr>
              </thead>

              <tbody>
              {filtered.map((tr, idx) => (
                <tr
                  key={`${tr.achievement}-${idx}`}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={completedTreasures.has(tr.achievement)}
                      onChange={() => toggleTreasure(tr.achievement)}
                      className="h-4 w-4 cursor-pointer rounded border-white/20 bg-black/20 text-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-0"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-white">
                    {translateAchievement(tr.achievement)}
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-100/80">
                    {translateLocation(tr.zone)}
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-100/80">
                    {formatCoords(tr.coords)}
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-100/80">
                    {(tr.artifacts || []).length ? (
                      <div className="flex flex-wrap gap-2">
                        {tr.artifacts.map((a) => (
                          <span
                            key={a}
                            className="rounded-full bg-white/10 px-2 py-1 text-xs text-emerald-100/80 border border-white/10"
                          >
                            {translateArtifact(a)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-emerald-100/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-100/80">
                    {tr.rewards || <span className="text-emerald-100/40">—</span>}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-emerald-100/70">
                    {t.empty}
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
