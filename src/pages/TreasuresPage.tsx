import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { HowItWorks } from '../components/HowItWorks';
import { PageSeo } from '../components/PageSeo';
import type { Language } from '../constants/translations';
import { treasuresContent } from '../content/treasures';

type Treasure = {
  achievement: string;
  zone: string;
  coords: { x: number; y: number };
  artifacts: string[];
  rewards: string;
};

const STORAGE_KEY = 'wakfu-treasures-completed';

type TreasuresI18n = {
  _meta?: unknown;
  locations?: Record<string, Record<Language, string>>;
  artifacts?: Record<string, Record<Language, string>>;
  achievements?: Record<string, Record<Language, string>>;
};

function formatCoords(c: { x: number; y: number }) {
  return `${c.x}, ${c.y}`;
}

export default function TreasuresPage({ language }: { language: Language }) {
  const t = treasuresContent[language];

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

  // i18n tables map the English name to each language; fall back to English.
  const translate = useCallback(
    (table: 'locations' | 'artifacts' | 'achievements', name: string) =>
      i18n?.[table]?.[name]?.[language] || name,
    [i18n, language],
  );
  const translateLocation = (zone: string) => translate('locations', zone);
  const translateArtifact = (name: string) => translate('artifacts', name);
  const translateAchievement = (name: string) => translate('achievements', name);

  const toggleTreasure = (achievement: string) => {
    setCompletedTreasures((prev) => {
      const next = new Set(prev);
      if (next.has(achievement)) {
        next.delete(achievement);
      } else {
        next.add(achievement);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // storage unavailable (private mode): progress is kept for this visit only
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return treasures;

    return treasures.filter((tr) => {
      const haystack = [
        tr.achievement,
        translate('achievements', tr.achievement),
        tr.zone,
        translate('locations', tr.zone),
        tr.rewards,
        ...(tr.artifacts || []),
        ...(tr.artifacts || []).map((a) => translate('artifacts', a)),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [treasures, query, translate]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center animate-in fade-in duration-500">
      <PageSeo title={t.title} description={t.subtitle} path="/treasures" />
      <h1 className="page-title mb-4">
        {t.title}
      </h1>
      <p className="text-emerald-100/90 mb-6 text-center max-w-2xl text-lg leading-relaxed drop-shadow-md">
        {t.subtitle}
      </p>

      <div className="w-full">
        <div className="backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 md:p-8" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 text-sm text-white shadow-sm outline-none ring-0 focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div className="text-sm text-emerald-300 font-medium">
              {t.counts(filtered.length, treasures.length)}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 shadow-lg">
            <table className="w-full min-w-[900px] table-auto">
              <thead className="bg-black/40 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-emerald-300 w-16">
                  ✓
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {t.columns.achievement}
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {t.columns.location}
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {t.columns.coords}
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {t.columns.artifacts}
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {t.columns.rewards}
                </th>
              </tr>
              </thead>

              <tbody>
              {filtered.map((tr, idx) => (
                <tr
                  key={`${tr.achievement}-${idx}`}
                  className="border-t border-white/10 hover:bg-emerald-500/5 transition-colors duration-150"
                >
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={completedTreasures.has(tr.achievement)}
                      onChange={() => toggleTreasure(tr.achievement)}
                      className="h-5 w-5 cursor-pointer rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-0"
                    />
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-emerald-50">
                    {translateAchievement(tr.achievement)}
                  </td>
                  <td className="px-4 py-4 text-sm text-emerald-100/90">
                    {translateLocation(tr.zone)}
                  </td>
                  <td className="px-4 py-4 text-sm text-emerald-100/80">
                    {formatCoords(tr.coords)}
                  </td>
                  <td className="px-4 py-4 text-sm text-emerald-100/90">
                    {(tr.artifacts || []).length ? (
                      <div className="flex flex-wrap gap-2">
                        {tr.artifacts.map((a) => (
                          <span
                            key={a}
                            className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-100 border border-emerald-500/30 font-medium"
                          >
                            {translateArtifact(a)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-emerald-100/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-emerald-100/90">
                    {tr.rewards || <span className="text-emerald-100/40">—</span>}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-base text-emerald-100/70">
                    {t.empty}
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <HowItWorks title={t.howItWorksTitle} text={t.howItWorks} className="mt-10 w-full" />
    </div>
  );
}
