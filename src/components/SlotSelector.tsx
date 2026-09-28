import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { LocalImage } from './LocalImage';

interface SlotSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  optionLabels?: Partial<Record<'Any' | 'G' | 'B' | 'R' | 'J', string>>;
}

const SLOT_OPTIONS = [
  { value: 'Any', label: 'Empty', icon: null },
  { value: 'G', label: 'Green', icon: '/data/icons/green_slot.png' },
  { value: 'B', label: 'Blue', icon: '/data/icons/blue_slot.png' },
  { value: 'R', label: 'Red', icon: '/data/icons/red_slot.png' },
  { value: 'J', label: 'White', icon: '/data/icons/yellow_slot.png' },
];

/** Socket color picker with the game's socket icons. */
export function SlotSelector({ value, onChange, label, optionLabels }: SlotSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options = SLOT_OPTIONS.map((opt) => ({
    ...opt,
    label: optionLabels?.[opt.value as 'Any' | 'G' | 'B' | 'R' | 'J'] ?? opt.label,
  }));
  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const icon = (opt: (typeof options)[number]) =>
    opt.icon ? <LocalImage src={opt.icon} alt="" className="w-5 h-5 object-contain" />
      : <span className="w-5 h-5 grid place-items-center rounded-full border border-dashed border-line-strong text-subtle text-[10px]">∅</span>;

  return (
    <div ref={ref} className="relative lg:w-40">
      <span className="block text-xs font-medium text-subtle mb-1">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${selected?.label}`}
        className="input h-10 flex items-center gap-2 text-sm text-left"
      >
        {selected && icon(selected)}
        <span className="truncate">{selected?.label}</span>
        <ChevronDown className={`w-4 h-4 ml-auto text-subtle transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul role="listbox" aria-label={label} className="absolute z-30 mt-1.5 w-full min-w-[150px] card shadow-pop p-1.5">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={value === opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors
                  ${value === opt.value ? 'bg-primary/10 text-fg' : 'text-muted hover:bg-surface2 hover:text-fg'}`}
              >
                {icon(opt)}
                {opt.label}
                {value === opt.value && <Check className="w-4 h-4 ml-auto text-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
