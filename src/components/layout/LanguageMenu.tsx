import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { FLAGS, LANGUAGE_NAMES, type Language } from '../../constants/translations';

const ORDER: Language[] = ['en', 'fr', 'es', 'pt'];

interface Props {
  language: Language;
  onChange: (lang: Language) => void;
  label: string;
  /** open the list above the button (sidebar bottom) */
  up?: boolean;
  /** flag only (mobile top bar) */
  compact?: boolean;
  className?: string;
}

export function LanguageMenu({ language, onChange, label, up, compact, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${LANGUAGE_NAMES[language]}`}
        className={compact ? 'icon-btn text-lg' : 'btn w-full justify-start font-medium'}
      >
        <span className="text-base leading-none">{FLAGS[language]}</span>
        {!compact && <><span>{LANGUAGE_NAMES[language]}</span><ChevronDown className="w-4 h-4 ml-auto text-subtle" /></>}
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className={`absolute z-50 w-48 card shadow-pop p-1.5 ${up ? 'bottom-full mb-2 left-0' : 'top-full mt-2 right-0'}`}
        >
          {ORDER.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === language}
                onClick={() => { onChange(l); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${l === language ? 'bg-primary/10 text-fg' : 'text-muted hover:bg-surface2 hover:text-fg'}`}
              >
                <span className="text-base">{FLAGS[l]}</span>
                {LANGUAGE_NAMES[l]}
                {l === language && <Check className="w-4 h-4 ml-auto text-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
