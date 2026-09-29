import { Link } from 'react-router-dom';
import { ArrowUpRight, Globe } from 'lucide-react';
import { RESOURCES, RESOURCES_T } from '../../content/resources';
import { HOME, NAV_GROUPS, isActive } from '../../lib/navigation';
import { GAME_VERSION } from '../../lib/gameVersion';
import { SHELL } from '../../content/shell';
import type { Language } from '../../constants/translations';
import { NavLinkItem } from './NavLinkItem';
import { LanguageMenu } from './LanguageMenu';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  path: string;
  language: Language;
  onLanguageChange: (l: Language) => void;
}

export function Brand({ small }: { small?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 min-w-0 rounded-lg">
      <img src="/android-chrome-192x192.png" alt="" width={small ? 30 : 34} height={small ? 30 : 34} className="rounded-[10px] shrink-0" />
      <span className="min-w-0">
        <span className={`block font-display font-bold leading-tight ${small ? 'text-[15px] truncate' : 'text-[15px]'}`}>Wakfu Job Calculator</span>
        {!small && <span className="block text-[11.5px] font-medium text-subtle">Wakfu tools · v{GAME_VERSION}</span>}
      </span>
    </Link>
  );
}

export function Sidebar({ path, language, onLanguageChange }: Props) {
  const s = SHELL[language];
  const item = (i: typeof HOME) => (
    <NavLinkItem key={i.id} item={i} label={s.nav[i.id]} active={isActive(i, path)} soon={s.soon} newBadge={s.newBadge} />
  );
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 flex-col gap-6 bg-bg2 border-r border-line px-3.5 py-5 overflow-y-auto">
      <div className="px-1.5"><Brand /></div>
      <nav className="flex flex-col gap-6" aria-label={s.menu}>
        <div className="flex flex-col gap-0.5">{item(HOME)}</div>
        {NAV_GROUPS.map((g) => (
          <div key={g.id} className="flex flex-col gap-0.5">
            <div className="caps-label px-2.5 pb-1.5">{s.groups[g.id]}</div>
            {g.items.map(item)}
          </div>
        ))}
        <div className="flex flex-col gap-0.5">
          <div className="caps-label px-2.5 pb-1.5">{RESOURCES_T[language].title}</div>
          {RESOURCES.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              title={r.desc[language]}
              className="group flex items-center gap-3 px-2.5 py-2 rounded-lg text-[14.5px] font-medium text-muted hover:text-fg hover:bg-surface2 transition-colors"
            >
              <Globe className="w-[18px] h-[18px] shrink-0" />
              <span className="truncate">{r.name}</span>
              <ArrowUpRight className="w-4 h-4 ml-auto text-subtle group-hover:text-primary" />
            </a>
          ))}
        </div>
      </nav>
      <div className="mt-auto flex gap-2">
        <LanguageMenu language={language} onChange={onLanguageChange} label={s.language} up className="flex-1" />
        <ThemeToggle labels={s.theme} />
      </div>
    </aside>
  );
}
