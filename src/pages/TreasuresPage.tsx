import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, MapPin, Check } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { HowItWorks } from '../components/HowItWorks';
import { PageSeo } from '../components/PageSeo';
import { SEO } from '../content/seo';
import type { Language } from '../constants/translations';
import { treasuresContent } from '../content/treasures';
import { loadData, peekData } from '../lib/pageData';

type Treasure = {
  achievement: string;
  zone: string;
  coords: { x: number; y: number };
  artifacts: string[];
  rewards: string;
};

const STORAGE_KEY = 'wakfu-treasures-completed';
const DATA_FILE = 'treasures.json';
const I18N_FILE = 'treasures.i18n.json';

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

  // Data already loaded when the page is prerendered or hydrated (see lib/pageData),
  // so the static HTML lists every treasure.
  const [treasures, setTreasures] = useState<Treasure[]>(() => peekData<Treasure[]>(DATA_FILE) ?? []);
  const [i18n, setI18n] = useState<TreasuresI18n | null>(() => peekData<TreasuresI18n>(I18N_FILE) ?? null);
  const [query, setQuery] = useState('');
  const [hideDone, setHideDone] = useState(false);
  // saved progress is read after hydration: the prerendered HTML has none
  const [completedTreasures, setCompletedTreasures] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCompletedTreasures(new Set(JSON.parse(saved)));
    } catch {
      // storage unavailable
    }
  }, []);

  useEffect(() => {
    if (peekData(DATA_FILE) && peekData(I18N_FILE)) return;
    let cancelled = false;
    Promise.allSettled([loadData<Treasure[]>(DATA_FILE), loadData<TreasuresI18n>(I18N_FILE)]).then(([data, tr]) => {
      if (cancelled) return;
      setTreasures(data.status === 'fulfilled' && Array.isArray(data.value) ? data.value : []);
      setI18n(tr.status === 'fulfilled' ? tr.value || null : null);
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
    const visible = hideDone ? treasures.filter((tr) => !completedTreasures.has(tr.achievement)) : treasures;
    if (!q) return visible;

    return visible.filter((tr) => {
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
  }, [treasures, query, translate, hideDone, completedTreasures]);

  const done = treasures.filter((tr) => completedTreasures.has(tr.achievement)).length;
  const pct = treasures.length ? Math.round((done / treasures.length) * 100) : 0;

  const checkbox = (tr: Treasure) => {
    const on = completedTreasures.has(tr.achievement);
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={on}
        aria-label={`${t.found}: ${translateAchievement(tr.achievement)}`}
        onClick={() => toggleTreasure(tr.achievement)}
        className={`w-6 h-6 rounded-lg border-2 grid place-items-center shrink-0 transition-colors
          ${on ? 'bg-success border-success text-bg' : 'border-line-strong hover:border-primary'}`}
      >
        {on && <Check className="w-4 h-4" strokeWidth={3} />}
      </button>
    );
  };

  const artifacts = (tr: Treasure) =>
    (tr.artifacts || []).length ? (
      <div className="flex flex-wrap gap-1.5">
        {tr.artifacts.map((a) => <span key={a} className="badge badge-primary">{translateArtifact(a)}</span>)}
      </div>
    ) : <span className="text-subtle">—</span>;

  return (
    <div>
      <PageSeo {...SEO[language].treasures} path="/treasures" />
      <PageHeader title={t.title} subtitle={t.subtitle} />

      <div className="card p-4 md:p-5 mb-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="input pl-10"
            />
          </div>
          <button type="button" aria-pressed={hideDone} onClick={() => setHideDone((v) => !v)} className={`chip h-11 px-4 ${hideDone ? 'chip-active' : ''}`}>
            {t.hideDone}
          </button>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold text-fg">{t.progress(done, treasures.length)}</span>
            <span className="text-subtle">{t.counts(filtered.length, treasures.length)}</span>
          </div>
          <div className="h-2 rounded-full bg-surface2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card py-14 text-center text-muted">{t.empty}</div>
      ) : (
        <>
          {/* desktop: table */}
          <div className="hidden md:block card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg2 border-b border-line">
                <tr>
                  <th className="w-14 px-4 py-3" />
                  <th className="text-left px-4 py-3 caps-label">{t.columns.achievement}</th>
                  <th className="text-left px-4 py-3 caps-label">{t.columns.location}</th>
                  <th className="text-left px-4 py-3 caps-label">{t.columns.coords}</th>
                  <th className="text-left px-4 py-3 caps-label">{t.columns.artifacts}</th>
                  <th className="text-left px-4 py-3 caps-label">{t.columns.rewards}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tr, idx) => {
                  const on = completedTreasures.has(tr.achievement);
                  return (
                    <tr key={`${tr.achievement}-${idx}`} className={`border-t border-line first:border-0 hover:bg-surface2/60 transition-colors ${on ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3">{checkbox(tr)}</td>
                      <td className="px-4 py-3 font-semibold text-fg first-letter:uppercase">{translateAchievement(tr.achievement)}</td>
                      <td className="px-4 py-3 text-muted first-letter:uppercase">{translateLocation(tr.zone)}</td>
                      <td className="px-4 py-3 font-mono text-muted whitespace-nowrap">{formatCoords(tr.coords)}</td>
                      <td className="px-4 py-3">{artifacts(tr)}</td>
                      <td className="px-4 py-3 text-muted">{tr.rewards || <span className="text-subtle">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* phones: cards */}
          <ul className="md:hidden space-y-3">
            {filtered.map((tr, idx) => {
              const on = completedTreasures.has(tr.achievement);
              return (
                <li key={`${tr.achievement}-${idx}`} className={`card p-4 ${on ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-3">
                    {checkbox(tr)}
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="font-semibold text-fg leading-snug first-letter:uppercase">{translateAchievement(tr.achievement)}</div>
                      <div className="flex items-center gap-1.5 text-sm text-muted">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span className="truncate first-letter:uppercase">{translateLocation(tr.zone)}</span>
                        <span className="font-mono text-subtle shrink-0">· {formatCoords(tr.coords)}</span>
                      </div>
                      {artifacts(tr)}
                      {tr.rewards && <div className="text-sm text-muted">{tr.rewards}</div>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <HowItWorks title={t.howItWorksTitle} text={t.howItWorks} className="mt-8" />
    </div>
  );
}
