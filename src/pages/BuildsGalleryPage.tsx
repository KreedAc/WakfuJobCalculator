import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Flag, Search, ExternalLink } from 'lucide-react';
import { PageSeo } from '../components/PageSeo';
import { ItemIcon } from '../components/ItemIcon';
import { BuilderTabs } from '../components/BuilderTabs';
import { PageHeader } from '../components/ui/PageHeader';
import { loadEquipmentData, decodeBuild, computeTotals, type EquipmentData } from '../lib/builder';
import {
  listBuilds, getBuild, likeBuild, reportBuild, likedBuilds, rememberLike,
  type PublicBuild, type BuildQuery,
} from '../lib/buildsApi';
import { SLOT_ORDER } from '../constants/equipmentStats';
import { BUILD_GALLERY_T, CLASS_NAMES, LEVEL_BRACKETS, type BuildGalleryT } from '../content/buildGallery';
import type { Language } from '../constants/translations';

function relativeDate(ts: number, language: Language) {
  const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });
  const diff = (ts - Date.now()) / 1000;
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [unit, secs] of steps) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return rtf.format(0, 'minute');
}

interface CardProps {
  build: PublicBuild;
  data: EquipmentData | null;
  language: Language;
  t: BuildGalleryT;
  liked: boolean;
  highlighted?: boolean;
  onLike: (b: PublicBuild) => void;
  onReport: (b: PublicBuild) => void;
}

function BuildCard({ build, data, language, t, liked, highlighted, onLike, onReport }: CardProps) {
  const decoded = useMemo(() => decodeBuild(build.code), [build.code]);
  const items = useMemo(() => {
    if (!decoded || !data) return [];
    return SLOT_ORDER.map((s) => decoded.slots[s]).filter((id): id is number => !!id)
      .map((id) => data.byId.get(id)).filter((it) => !!it);
  }, [decoded, data]);
  const totals = useMemo(() => (decoded && data ? computeTotals(decoded, data).totals : null), [decoded, data]);
  const cls = CLASS_NAMES[language][build.class];

  return (
    <article className={`card rounded-2xl p-4 flex flex-col gap-3 border ${highlighted ? 'border-line' : 'border-transparent'}`}>
      <header className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <span>{t.level} {build.level}</span>
            {cls && <span className="px-2 py-0.5 rounded-full bg-primary/15 border border-line normal-case tracking-normal">{cls}</span>}
          </div>
          <h2 className="text-base font-bold text-fg break-words mt-1">{build.name}</h2>
          <p className="text-xs text-subtle">
            {t.by(build.author || t.anonymous)} · {relativeDate(build.created_at, language)}
          </p>
        </div>
        <button
          onClick={() => onLike(build)}
          disabled={liked}
          aria-label={t.like}
          aria-pressed={liked}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm font-semibold border transition-all shrink-0
            ${liked ? 'text-accent border-accent/40 bg-accent/10' : 'text-muted border-line hover:text-accent hover:border-accent/40'}`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} /> {build.likes}
        </button>
      </header>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {items.map((it, i) => <ItemIcon key={`${it.id}-${i}`} item={it} size={30} />)}
        </div>
      )}

      {totals && (
        <p className="font-mono text-xs text-muted">
          {totals.hp} PV · {totals.ap} PA · {totals.mp} PM · {totals.wp} PW · {totals.critHit ?? 0}% CC
        </p>
      )}

      {build.description && (
        <p className="text-sm text-muted whitespace-pre-line break-words line-clamp-4">{build.description}</p>
      )}

      <footer className="mt-auto flex items-center gap-2 pt-1">
        <Link
          to={{ pathname: '/builder', hash: `b=${build.code}` }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-accent hover:bg-accent-strong text-on-accent"
        >
          <ExternalLink className="w-4 h-4" /> {t.open}
        </Link>
        <button
          onClick={() => onReport(build)}
          title={t.report}
          aria-label={t.report}
          className="ml-auto p-2 text-subtle hover:text-danger transition-colors"
        >
          <Flag className="w-4 h-4" />
        </button>
      </footer>
    </article>
  );
}

export function BuildsGalleryPage({ language }: { language: Language }) {
  const t = BUILD_GALLERY_T[language];
  const [data, setData] = useState<EquipmentData | null>(null);
  const [query, setQuery] = useState<Omit<BuildQuery, 'page'>>({ sort: 'new', class: -1, min: 0, max: 0, q: '' });
  const [search, setSearch] = useState('');
  const [builds, setBuilds] = useState<PublicBuild[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [featured, setFeatured] = useState<PublicBuild | null>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState('');
  const requestId = useRef(0);

  useEffect(() => { setLiked(likedBuilds()); }, []);

  useEffect(() => {
    let cancelled = false;
    loadEquipmentData(language).then((d) => { if (!cancelled) setData(d); }).catch(() => {});
    return () => { cancelled = true; };
  }, [language]);

  // a shared link (/builds?id=xxxx) shows that build above the list
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) getBuild(id).then(setFeatured).catch(() => {});
  }, []);

  // debounce the search box
  useEffect(() => {
    const timer = setTimeout(() => setQuery((q) => (q.q === search ? q : { ...q, q: search })), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback((pageToLoad: number) => {
    const id = ++requestId.current;
    setStatus('loading');
    listBuilds({ ...query, page: pageToLoad })
      .then((res) => {
        if (id !== requestId.current) return;
        setBuilds((prev) => (pageToLoad === 0 ? res.builds : [...prev, ...res.builds]));
        setHasMore(res.hasMore);
        setPage(pageToLoad);
        setStatus('ready');
      })
      .catch(() => { if (id === requestId.current) setStatus('error'); });
  }, [query]);

  useEffect(() => { load(0); }, [load]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const onLike = (b: PublicBuild) => {
    if (liked.has(b.id)) return;
    setLiked((prev) => new Set(prev).add(b.id));
    rememberLike(b.id);
    likeBuild(b.id)
      .then(({ likes }) => {
        const update = (x: PublicBuild) => (x.id === b.id ? { ...x, likes } : x);
        setBuilds((prev) => prev.map(update));
        setFeatured((f) => (f ? update(f) : f));
      })
      .catch(() => {});
  };

  const onReport = (b: PublicBuild) => {
    if (!window.confirm(t.reportConfirm)) return;
    reportBuild(b.id).then(() => showToast(t.reported)).catch(() => {});
  };

  const filtered = query.class >= 0 || query.min > 0 || query.q.trim() !== '';
  const bracketValue = query.min ? `${query.min}-${query.max}` : '';
  const selectClass = 'card-inset px-3 py-2.5 rounded-xl text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/25';
  const cardProps = { data, language, t, onLike, onReport };

  return (
    <div>
      <PageSeo title={t.title} description={t.subtitle} path="/builds" />
      <PageHeader title={t.title} subtitle={t.subtitle} actions={<BuilderTabs current="gallery" labels={{ builder: t.tabBuilder, gallery: t.tabGallery }} />} />

      {featured && (
        <section className="mb-6" aria-label={t.shared}>
          <div className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-2">{t.shared}</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <BuildCard build={featured} liked={liked.has(featured.id)} highlighted {...cardProps} />
          </div>
        </section>
      )}

      <div className="card rounded-2xl p-3 mb-5 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} aria-label={t.search}
            className="card-inset w-full pl-9 pr-3 py-2.5 rounded-xl text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>
        <select
          value={query.class} aria-label={t.allClasses}
          onChange={(e) => setQuery((q) => ({ ...q, class: Number(e.target.value) }))}
          className={selectClass}
        >
          <option value={-1}>{t.allClasses}</option>
          {CLASS_NAMES[language].map((name, i) => ({ name, i }))
            .sort((a, b) => a.name.localeCompare(b.name, language))
            .map(({ name, i }) => <option key={i} value={i}>{name}</option>)}
        </select>
        <select
          value={bracketValue} aria-label={t.allLevels}
          onChange={(e) => {
            const [min, max] = e.target.value ? e.target.value.split('-').map(Number) : [0, 0];
            setQuery((q) => ({ ...q, min, max }));
          }}
          className={selectClass}
        >
          <option value="">{t.allLevels}</option>
          {LEVEL_BRACKETS.map(([min, max]) => <option key={min} value={`${min}-${max}`}>{min}–{max}</option>)}
        </select>
        <div className="flex rounded-xl overflow-hidden border border-line" role="group">
          {(['new', 'top'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setQuery((q) => ({ ...q, sort: s }))}
              aria-pressed={query.sort === s}
              className={`px-3 py-2.5 text-sm font-semibold transition-colors ${query.sort === s ? 'bg-primary/25 text-fg' : 'text-subtle hover:text-fg'}`}
            >
              {s === 'new' ? t.sortNew : t.sortTop}
            </button>
          ))}
        </div>
      </div>

      {status === 'error' && builds.length === 0 && (
        <p className="text-center text-muted py-12">{t.unavailable}</p>
      )}
      {status === 'ready' && builds.length === 0 && (
        filtered ? (
          <p className="text-center text-muted py-12">{t.noMatch}</p>
        ) : (
          <p className="text-center text-muted py-12">
            {t.empty} <Link to="/builder" className="underline text-primary">{t.tabBuilder}</Link>
          </p>
        )
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {builds.map((b) => <BuildCard key={b.id} build={b} liked={liked.has(b.id)} {...cardProps} />)}
      </div>

      {status === 'loading' && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-line border-t-primary rounded-full animate-spin" />
        </div>
      )}
      {status === 'ready' && hasMore && (
        <div className="flex justify-center mt-6">
          <button onClick={() => load(page + 1)} className="px-5 py-2.5 rounded-xl card-inset border border-line text-fg font-semibold text-sm hover:border-line">
            {t.loadMore}
          </button>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-[110] card shadow-pop px-5 py-2.5 rounded-full text-sm text-fg border border-line">
          {toast}
        </div>
      )}
    </div>
  );
}
