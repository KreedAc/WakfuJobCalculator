import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Flag, Search, ExternalLink } from 'lucide-react';
import { PageSeo } from '../components/PageSeo';
import { ItemIcon } from '../components/ItemIcon';
import { BuilderTabs } from '../components/BuilderTabs';
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
    <article className={`glass rounded-2xl p-4 flex flex-col gap-3 border ${highlighted ? 'border-emerald-400/60' : 'border-transparent'}`}>
      <header className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-400/80">
            <span>{t.level} {build.level}</span>
            {cls && <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 normal-case tracking-normal">{cls}</span>}
          </div>
          <h2 className="text-base font-bold text-emerald-50 break-words mt-1">{build.name}</h2>
          <p className="text-xs text-emerald-200/60">
            {t.by(build.author || t.anonymous)} · {relativeDate(build.created_at, language)}
          </p>
        </div>
        <button
          onClick={() => onLike(build)}
          disabled={liked}
          aria-label={t.like}
          aria-pressed={liked}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm font-semibold border transition-all shrink-0
            ${liked ? 'text-pink-300 border-pink-400/40 bg-pink-500/10' : 'text-emerald-200/70 border-white/10 hover:text-pink-300 hover:border-pink-400/40'}`}
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
        <p className="font-mono text-xs text-emerald-100/80">
          {totals.hp} PV · {totals.ap} PA · {totals.mp} PM · {totals.wp} PW · {totals.critHit ?? 0}% CC
        </p>
      )}

      {build.description && (
        <p className="text-sm text-emerald-100/75 whitespace-pre-line break-words line-clamp-4">{build.description}</p>
      )}

      <footer className="mt-auto flex items-center gap-2 pt-1">
        <Link
          to={{ pathname: '/builder', hash: `b=${build.code}` }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
        >
          <ExternalLink className="w-4 h-4" /> {t.open}
        </Link>
        <button
          onClick={() => onReport(build)}
          title={t.report}
          aria-label={t.report}
          className="ml-auto p-2 text-emerald-200/35 hover:text-red-300 transition-colors"
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
  const selectClass = 'glass-soft px-3 py-2.5 rounded-xl text-emerald-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40';
  const cardProps = { data, language, t, onLike, onReport };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 animate-in fade-in duration-500">
      <PageSeo title={t.title} description={t.subtitle} path="/builds" />
      <h1 className="page-title mb-2">{t.title}</h1>
      <p className="text-emerald-100/80 mb-6 text-center max-w-2xl mx-auto text-base drop-shadow-md">{t.subtitle}</p>
      <BuilderTabs current="gallery" labels={{ builder: t.tabBuilder, gallery: t.tabGallery }} />

      {featured && (
        <section className="mb-6" aria-label={t.shared}>
          <div className="text-[11px] uppercase tracking-widest text-emerald-400/60 font-semibold mb-2">{t.shared}</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <BuildCard build={featured} liked={liked.has(featured.id)} highlighted {...cardProps} />
          </div>
        </section>
      )}

      <div className="glass rounded-2xl p-3 mb-5 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} aria-label={t.search}
            className="glass-soft w-full pl-9 pr-3 py-2.5 rounded-xl text-emerald-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
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
        <div className="flex rounded-xl overflow-hidden border border-white/10" role="group">
          {(['new', 'top'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setQuery((q) => ({ ...q, sort: s }))}
              aria-pressed={query.sort === s}
              className={`px-3 py-2.5 text-sm font-semibold transition-colors ${query.sort === s ? 'bg-emerald-500/25 text-emerald-100' : 'text-emerald-200/60 hover:text-emerald-200'}`}
            >
              {s === 'new' ? t.sortNew : t.sortTop}
            </button>
          ))}
        </div>
      </div>

      {status === 'error' && builds.length === 0 && (
        <p className="text-center text-emerald-200/70 py-12">{t.unavailable}</p>
      )}
      {status === 'ready' && builds.length === 0 && (
        filtered ? (
          <p className="text-center text-emerald-200/70 py-12">{t.noMatch}</p>
        ) : (
          <p className="text-center text-emerald-200/70 py-12">
            {t.empty} <Link to="/builder" className="underline text-emerald-300">{t.tabBuilder}</Link>
          </p>
        )
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {builds.map((b) => <BuildCard key={b.id} build={b} liked={liked.has(b.id)} {...cardProps} />)}
      </div>

      {status === 'loading' && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      )}
      {status === 'ready' && hasMore && (
        <div className="flex justify-center mt-6">
          <button onClick={() => load(page + 1)} className="px-5 py-2.5 rounded-xl glass-soft border border-emerald-500/30 text-emerald-200 font-semibold text-sm hover:border-emerald-400/60">
            {t.loadMore}
          </button>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] glass-strong px-5 py-2.5 rounded-full text-sm text-emerald-200 border border-emerald-500/40">
          {toast}
        </div>
      )}
    </div>
  );
}
