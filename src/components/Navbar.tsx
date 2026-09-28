import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Hammer, Scroll, Wrench, Map, Swords, Shirt, BookOpen, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TRANSLATIONS, Language } from '../constants/translations';

type T = (typeof TRANSLATIONS)[Language];
type Icon = React.ComponentType<{ className?: string }>;

interface NavItem { to: string; icon: Icon; label: (t: T) => string }

const NAV_ITEMS: NavItem[] = [
  { to: '/', icon: Hammer, label: (t) => t.navCalc },
  { to: '/builder', icon: Shirt, label: (t) => t.navBuilder },
  { to: '/sublimations', icon: Scroll, label: (t) => t.navSubli },
  { to: '/items-craft-guide', icon: Wrench, label: (t) => t.navItemsCraft },
  { to: '/combat-calc', icon: Swords, label: (t) => t.navCombatCalc },
  { to: '/treasures', icon: Map, label: (t) => t.navTreasures },
  { to: '/guides', icon: BookOpen, label: (t) => t.navGuidesLabel },
];

const isActive = (to: string, path: string) =>
  to === '/' ? path === '/' : path === to || path.startsWith(`${to}/`);

interface NavbarProps {
  currentPath: string;
  t: T;
}

/** Tablet/desktop: pill bar (icons only below xl, icons + labels from xl). */
export function Navbar({ currentPath, t }: NavbarProps) {
  return (
    <nav className="glass hidden md:flex items-center gap-1 rounded-2xl px-2 py-1.5" aria-label="Main">
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
        const active = isActive(to, currentPath);
        return (
          <Link
            key={to}
            to={to}
            title={label(t)}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              active
                ? 'glass-soft text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'text-emerald-100/80 hover:text-emerald-200 hover:bg-emerald-500/10'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="hidden xl:inline whitespace-nowrap">{label(t)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Phone: menu button opening a full-screen sheet with every destination. */
export function MobileNav({ currentPath, t }: NavbarProps) {
  const [open, setOpen] = useState(false);

  // close after navigating, and lock page scroll while the sheet is open
  useEffect(() => { setOpen(false); }, [currentPath]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden flex items-center gap-3 min-w-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menu"
        aria-expanded={open}
        className="glass flex items-center justify-center w-11 h-11 rounded-xl text-emerald-200 shrink-0"
      >
        <Menu className="w-6 h-6" />
      </button>
      <Link to="/" className="font-bold text-emerald-100 truncate">Wakfu Job Calculator</Link>

      {open && createPortal(
        <div className="md:hidden fixed inset-0 z-[120] bg-slate-950/95 backdrop-blur-md flex flex-col" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <span className="font-bold text-lg text-emerald-100">Wakfu Job Calculator</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="w-11 h-11 flex items-center justify-center rounded-xl text-emerald-200/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-2" aria-label="Main">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
              const active = isActive(to, currentPath);
              return (
                <Link
                  key={to}
                  to={to}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-semibold border transition-colors ${
                    active
                      ? 'glass-soft border-emerald-500/50 text-emerald-300'
                      : 'border-emerald-500/10 text-emerald-100/90 hover:border-emerald-500/30'
                  }`}
                >
                  <Icon className="w-5 h-5 text-emerald-400 shrink-0" />
                  {label(t)}
                </Link>
              );
            })}
          </nav>
        </div>,
        document.body,
      )}
    </div>
  );
}
