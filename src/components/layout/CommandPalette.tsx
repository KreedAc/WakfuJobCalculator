import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, Hammer, Scroll, Package, CornerDownLeft, type LucideIcon } from 'lucide-react';
import { ALL_NAV } from '../../lib/navigation';
import { loadWakfuData, getItemIconUrl } from '../../lib/wakfuData';
import { PROFESSION_IDS, PROFESSION_NAMES } from '../../constants/professions';
import { SHELL } from '../../content/shell';
import type { Language } from '../../constants/translations';
import { OPEN_SEARCH_EVENT } from './searchEvents';

interface Result {
  key: string;
  group: 'tools' | 'professions' | 'sublimations' | 'items';
  label: string;
  hint?: string;
  to: string;
  icon: LucideIcon;
  gfx?: number | null;
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const GROUP_LIMIT = { tools: 4, professions: 4, sublimations: 6, items: 8 };

/** Starts-with matches first, then contains; shorter names first. */
function rank<T>(list: T[], q: string, text: (x: T) => string, limit: number): T[] {
  const scored: [number, T][] = [];
  for (const x of list) {
    const n = norm(text(x));
    const i = n.indexOf(q);
    if (i < 0) continue;
    scored.push([(i === 0 ? 0 : 1000) + n.length, x]);
  }
  return scored.sort((a, b) => a[0] - b[0]).slice(0, limit).map(([, x]) => x);
}

interface SubliEntry { name: string; category?: string }
interface ItemEntry { id: number; name: string; gfxId?: number | null; n: string }

export function CommandPalette({ language }: { language: Language }) {
  const s = SHELL[language];
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [sublis, setSublis] = useState<SubliEntry[]>([]);
  const [items, setItems] = useState<ItemEntry[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // open: Ctrl/Cmd+K, "/" outside text fields, or openSearch() from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable="true"]');
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === '/' && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = (e: Event) => {
      setQuery((e as CustomEvent<{ query?: string }>).detail?.query ?? '');
      setOpen(true);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
    };
  }, []);

  // data is only fetched the first time the palette opens
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch(`/data/sublimations.${language}.json`)
      .then((r) => r.json())
      .then((d: SubliEntry[]) => { if (!cancelled) setSublis(Array.isArray(d) ? d : []); })
      .catch(() => {});
    loadWakfuData(language)
      .then((d) => {
        if (cancelled) return;
        setItems(d.items
          .filter((it) => d.recipesByResultId.has(it.id))
          .map((it) => ({ id: it.id, name: it.name, gfxId: it.gfxId, n: norm(it.name) })));
      })
      .catch(() => { if (!cancelled) setItems([]); });
    return () => { cancelled = true; };
  }, [open, language]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => inputRef.current?.focus(), 0);
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const q = norm(query);
    const tools: Result[] = ALL_NAV.filter((n) => !n.wip)
      .map((n) => ({ key: `t-${n.id}`, group: 'tools' as const, label: s.nav[n.id], to: n.path, icon: n.icon }));
    if (q.length < 2) return tools;

    const out: Result[] = rank(tools, q, (t) => t.label, GROUP_LIMIT.tools);
    out.push(...rank([...PROFESSION_IDS], q, (p) => `${PROFESSION_NAMES[language][p]} ${p}`, GROUP_LIMIT.professions)
      .map((p) => ({
        key: `p-${p}`, group: 'professions' as const, label: PROFESSION_NAMES[language][p],
        hint: s.nav.xp, to: `/xp-calculator?profession=${encodeURIComponent(p)}`, icon: Hammer,
      })));
    out.push(...rank(sublis, q, (x) => x.name, GROUP_LIMIT.sublimations)
      .map((x) => ({
        key: `s-${x.name}`, group: 'sublimations' as const, label: x.name, hint: x.category,
        to: `/sublimations?q=${encodeURIComponent(x.name)}`, icon: Scroll,
      })));
    if (items) {
      out.push(...rank(items, q, (x) => x.n, GROUP_LIMIT.items)
        .map((x) => ({
          key: `i-${x.id}`, group: 'items' as const, label: x.name, hint: s.nav.craft,
          to: `/items-craft-guide?items=${x.id}`, icon: Package, gfx: x.gfxId,
        })));
    }
    return out;
  }, [query, s, language, sublis, items]);

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const close = useCallback(() => { setOpen(false); setQuery(''); }, []);
  const go = useCallback((r: Result) => { close(); navigate(r.to); }, [close, navigate]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(results.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter' && results[active]) { e.preventDefault(); go(results[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  };

  let lastGroup = '';
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-3 sm:p-4 sm:pt-[12vh]" role="dialog" aria-modal="true" aria-label={s.searchShort}>
      <button type="button" aria-label={s.close} onClick={close} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-xl card shadow-pop overflow-hidden flex flex-col max-h-[80vh]" onKeyDown={onKeyDown}>
        <div className="flex items-center gap-3 px-4 border-b border-line">
          <Search className="w-5 h-5 text-subtle shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={s.searchPlaceholder}
            aria-label={s.searchPlaceholder}
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${active}` : undefined}
            className="flex-1 h-14 bg-transparent text-fg text-base placeholder:text-subtle focus:outline-none"
          />
          <button type="button" onClick={close} className="kbd hover:text-fg">Esc</button>
        </div>
        <div ref={listRef} id="search-results" role="listbox" className="overflow-y-auto p-2">
          {results.map((r, i) => {
            const header = r.group !== lastGroup ? s.searchGroups[r.group] : null;
            lastGroup = r.group;
            const Icon = r.icon;
            return (
              <div key={r.key}>
                {header && <div className="caps-label px-3 pt-3 pb-1.5">{header}</div>}
                <button
                  type="button"
                  id={`sr-${i}`}
                  role="option"
                  aria-selected={i === active}
                  data-index={i}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(r)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${i === active ? 'bg-primary/10' : ''}`}
                >
                  {r.gfx ? (
                    <img src={getItemIconUrl(r.gfx)} alt="" width={28} height={28} loading="lazy" className="w-7 h-7 rounded-md bg-surface2 object-contain shrink-0" />
                  ) : (
                    <span className={`w-7 h-7 rounded-md grid place-items-center shrink-0 ${i === active ? 'bg-primary/15 text-primary' : 'bg-surface2 text-muted'}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-fg truncate">{r.label}</span>
                    {r.hint && <span className="block text-xs text-subtle truncate">{r.hint}</span>}
                  </span>
                  {i === active && <CornerDownLeft className="w-4 h-4 text-subtle shrink-0" />}
                </button>
              </div>
            );
          })}
          {norm(query).length >= 2 && results.length === 0 && items !== null && (
            <p className="px-3 py-8 text-center text-sm text-subtle">{s.searchEmpty}</p>
          )}
          {norm(query).length >= 2 && items === null && (
            <p className="px-3 py-3 text-xs text-subtle">{s.searchLoading}</p>
          )}
        </div>
        <div className="hidden sm:block px-4 py-2.5 border-t border-line text-xs text-subtle">{s.searchHint}</div>
      </div>
    </div>,
    document.body,
  );
}
