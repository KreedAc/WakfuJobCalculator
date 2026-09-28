import { ChevronRight, Search } from 'lucide-react';
import { locate } from '../../lib/navigation';
import { SHELL } from '../../content/shell';
import type { Language } from '../../constants/translations';
import { Brand } from './Sidebar';
import { LanguageMenu } from './LanguageMenu';
import { openSearch } from './searchEvents';

interface Props {
  path: string;
  language: Language;
  onLanguageChange: (l: Language) => void;
}

export function Topbar({ path, language, onLanguageChange }: Props) {
  const s = SHELL[language];
  const here = locate(path);
  return (
    <header className="sticky top-0 z-20 h-16 flex items-center gap-3 px-4 md:px-8 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="lg:hidden min-w-0 flex-1"><Brand small /></div>
      <nav aria-label="Breadcrumb" className="hidden lg:flex items-center gap-2 text-[13.5px] text-subtle min-w-0">
        {here?.group && (<><span>{s.groups[here.group]}</span><ChevronRight className="w-3.5 h-3.5" /></>)}
        {here && <span className="font-semibold text-fg truncate">{s.nav[here.item.id]}</span>}
      </nav>
      <button
        type="button"
        onClick={() => openSearch()}
        className="hidden md:flex ml-auto items-center gap-2.5 w-[380px] h-10 px-3.5 rounded-xl border border-line bg-surface text-subtle text-sm hover:border-line-strong transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="truncate">{s.searchPlaceholder}</span>
        <span className="kbd ml-auto">Ctrl K</span>
      </button>
      <div className="flex md:hidden items-center gap-2 ml-auto">
        <button type="button" onClick={() => openSearch()} className="icon-btn" aria-label={s.searchShort}>
          <Search className="w-[18px] h-[18px]" />
        </button>
        <LanguageMenu language={language} onChange={onLanguageChange} label={s.language} compact />
      </div>
    </header>
  );
}
