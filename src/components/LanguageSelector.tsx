import { FLAGS, type Language } from '../constants/translations';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  menuOpen: boolean;
  onMenuToggle: () => void;
  label: string;
}

export function LanguageSelector({
  language,
  onLanguageChange,
  menuOpen,
  onMenuToggle,
  label
}: LanguageSelectorProps) {
  return (
    <div className="relative">
      <button
        id="lang-btn"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={(e) => {
          e.stopPropagation();
          onMenuToggle();
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 hover:bg-white/95 active:bg-white/80 border border-emerald-500/25 backdrop-blur shadow text-sm transition-colors text-slate-800"
      >
        <span className="text-lg">{FLAGS[language]}</span>
        <span className="hidden sm:inline font-medium">{label}</span>
      </button>
      {menuOpen && (
        <div
          id="lang-menu"
          className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden border border-emerald-500/25 bg-white/95 text-slate-800 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {(['fr', 'en', 'es', 'pt'] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => {
                onLanguageChange(lang);
              }}
              className="w-full text-left px-4 py-3 hover:bg-emerald-50 flex items-center gap-3 transition-colors border-b border-emerald-500/10 last:border-0"
            >
              <span className="text-xl">{FLAGS[lang]}</span>
              <span className="font-medium">
                {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : lang === 'es' ? 'Español' : 'Português'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
