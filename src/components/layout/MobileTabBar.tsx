import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Grid2x2, X, ArrowUpRight, Globe } from 'lucide-react';
import { RESOURCES, RESOURCES_T } from '../../content/resources';
import { ALL_NAV, HOME, NAV_GROUPS, isActive, type NavItem } from '../../lib/navigation';
import { SHELL } from '../../content/shell';
import { FLAGS, LANGUAGE_NAMES, type Language } from '../../constants/translations';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  path: string;
  language: Language;
  onLanguageChange: (l: Language) => void;
}

const TAB_IDS = ['home', 'xp', 'subli', 'craft'] as const;

export function MobileTabBar({ path, language, onLanguageChange }: Props) {
  const s = SHELL[language];
  const [open, setOpen] = useState(false);
  const tabs = TAB_IDS.map((id) => ALL_NAV.find((n) => n.id === id)!);
  const inTabs = tabs.some((t) => isActive(t, path));

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open]);

  const tabClass = (on: boolean) =>
    `flex flex-col items-center gap-1 pt-1.5 pb-1 text-[10.5px] font-semibold transition-colors ${on ? 'text-primary' : 'text-subtle hover:text-muted'}`;

  const tile = (item: NavItem) => {
    const Icon = item.icon;
    const on = isActive(item, path);
    return (
      <Link
        key={item.id}
        to={item.path}
        aria-current={on ? 'page' : undefined}
        className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-semibold transition-colors
          ${on ? 'border-primary bg-primary/10 text-fg' : 'border-line bg-bg2 text-muted hover:text-fg'}`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${on ? 'text-primary' : ''}`} />
        <span className="truncate">{s.nav[item.id]}</span>
        {item.wip && <span className="badge ml-auto">{s.soon}</span>}
      </Link>
    );
  };

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-bg2 border-t border-line grid grid-cols-5 px-1 pb-safe" aria-label={s.menu}>
        {tabs.map((item) => {
          const Icon = item.icon;
          const on = isActive(item, path);
          return (
            <Link key={item.id} to={item.path} aria-current={on ? 'page' : undefined} className={tabClass(on)}>
              <Icon className="w-[22px] h-[22px]" />
              {s.tabs[item.id as (typeof TAB_IDS)[number]]}
            </Link>
          );
        })}
        <button type="button" onClick={() => setOpen(true)} aria-expanded={open} className={tabClass(open || !inTabs)}>
          <Grid2x2 className="w-[22px] h-[22px]" />
          {s.tabs.more}
        </button>
      </nav>

      {open && createPortal(
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label={s.menu}>
          <button type="button" aria-label={s.close} onClick={() => setOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface border-t border-line rounded-t-3xl shadow-pop max-h-[88vh] overflow-y-auto px-4 pt-3 pb-8">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line-strong" />
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-bold text-lg">{s.menu}</span>
              <button type="button" onClick={() => setOpen(false)} className="icon-btn" aria-label={s.close}><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 gap-2 mb-5">{tile(HOME)}</div>
            {NAV_GROUPS.map((g) => (
              <div key={g.id} className="mb-5">
                <div className="caps-label mb-2">{s.groups[g.id]}</div>
                <div className="grid grid-cols-2 gap-2">{g.items.map(tile)}</div>
              </div>
            ))}
            <div className="mb-5">
              <div className="caps-label mb-2">{RESOURCES_T[language].title}</div>
              <div className="grid grid-cols-2 gap-2">
                {RESOURCES.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-line bg-bg2 text-sm font-semibold text-muted hover:text-fg transition-colors"
                  >
                    <Globe className="w-5 h-5 shrink-0" />
                    <span className="truncate">{r.name}</span>
                    <ArrowUpRight className="w-4 h-4 ml-auto text-subtle" />
                  </a>
                ))}
              </div>
            </div>
            <div className="caps-label mb-2">{s.language}</div>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {(Object.keys(LANGUAGE_NAMES) as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onLanguageChange(l)}
                  aria-pressed={l === language}
                  className={`chip h-10 justify-center ${l === language ? 'chip-active' : ''}`}
                >
                  <span>{FLAGS[l]}</span> {LANGUAGE_NAMES[l]}
                </button>
              ))}
            </div>
            <ThemeToggle labels={s.theme} withLabel className="w-full" />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
