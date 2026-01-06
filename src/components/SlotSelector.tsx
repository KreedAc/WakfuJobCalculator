import { useState } from 'react';
import { LocalImage } from './LocalImage';
import { ChevronDown } from 'lucide-react';

interface SlotSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const SLOT_OPTIONS = [
  { value: 'Any', label: 'Empty', icon: null },
  { value: 'G', icon: '/icons/green_slot.png' },
  { value: 'B', icon:'/icons/blue_slot.png' },
  { value: 'R', icon: '/icons/red_slot.png' },
  { value: 'J', icon: '/icons/yellow_slot.png' }
];

export function SlotSelector({ value, onChange, label }: SlotSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = SLOT_OPTIONS.find(opt => opt.value === value);

  return (
    <div className="slot-filter-group">
      <label className="slot-filter-label">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="slot-filter-select flex items-center gap-2 justify-between w-full"
        >
          <div className="flex items-center gap-2">
            {selectedOption?.icon ? (
              <LocalImage
                src={selectedOption.icon}
                alt={selectedOption.label}
                className="w-5 h-5 object-contain"
              />
            ) : (
              <span className="w-5 h-5 flex items-center justify-center text-slate-500 text-xs">∅</span>
            )}
            <span>{selectedOption?.label}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-50 mt-1 w-full bg-slate-800 border border-emerald-500/30 rounded-lg shadow-xl overflow-hidden">
              {SLOT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-700 transition-colors text-left ${
                    value === option.value ? 'bg-slate-700/50 text-emerald-400' : 'text-slate-200'
                  }`}
                >
                  {option.icon ? (
                    <LocalImage
                      src={option.icon}
                      alt={option.label}
                      className="w-5 h-5 object-contain"
                    />
                  ) : (
                    <span className="w-5 h-5 flex items-center justify-center text-slate-500 text-xs font-bold">∅</span>
                  )}
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
