import { useState, useEffect, useMemo } from 'react';
import { Search, AlertCircle, X, SearchX } from 'lucide-react';
import { FALLBACK_SUBLIMATIONS, type Sublimation } from '../data/fallbackSublimations';
import { processDescription, initializeRuneLevels, matchesEquipmentSlots, type Slot } from '../utils/sublimationUtils';
import { LocalImage } from './LocalImage';
import { SlotSelector } from './SlotSelector';
import { PageHeader } from './ui/PageHeader';

interface SublimationsProps {
  translations: Record<string, string>;
  language?: string;
}

// Canonical category values live in the data in English; labels are translated
// at display time. 'Stat gains' is a data-side duplicate of 'Stats Increase'.
const CATEGORY_NORMALIZE: Record<string, string> = { 'Stat gains': 'Stats Increase' };
const normalizeCategory = (c: string) => CATEGORY_NORMALIZE[c] ?? c;

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  en: {
    Offensive: 'Offensive',
    Defensive: 'Defensive',
    Support: 'Support',
    'Stats Increase': 'Stats Increase',
    Utility: 'Utility',
    Epic: 'Epic',
    Relic: 'Relic',
  },
  fr: {
    Offensive: 'Offensive',
    Defensive: 'Défensive',
    Support: 'Soutien',
    'Stats Increase': 'Caractéristiques',
    Utility: 'Utilitaire',
    Epic: 'Épique',
    Relic: 'Relique',
  },
  es: {
    Offensive: 'Ofensiva',
    Defensive: 'Defensiva',
    Support: 'Apoyo',
    'Stats Increase': 'Características',
    Utility: 'Utilidad',
    Epic: 'Épica',
    Relic: 'Reliquia',
  },
  pt: {
    Offensive: 'Ofensiva',
    Defensive: 'Defensiva',
    Support: 'Suporte',
    'Stats Increase': 'Características',
    Utility: 'Utilidade',
    Epic: 'Épica',
    Relic: 'Relíquia',
  },
};

const CATEGORY_PARAM: Record<string, string> = {
  offensive: 'Offensive', defensive: 'Defensive', support: 'Support', stats: 'Stats Increase',
  utility: 'Utility', epic: 'Epic', relic: 'Relic',
};

const SOCKET_ICONS: Record<'R' | 'G' | 'B', string> = { R: 'red_slot.png', G: 'green_slot.png', B: 'blue_slot.png' };
const RARITY_ICONS: Record<string, string> = { Rare: 'rare_icon.png', Mythic: 'mythic_icon.png', Legendary: 'legendary_icon.png' };

export function Sublimations({ translations: t, language = 'en' }: SublimationsProps) {
  const [runes, setRunes] = useState<Sublimation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // Canonical filter value: 'All', a data category, or the special 'Epic'/'Relic'.
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [runeLevels, setRuneLevels] = useState<Record<string, number>>({});
  const [dataSource, setDataSource] = useState<'loading' | 'json' | 'fallback' | 'error'>('loading');
  const [slotFilters, setSlotFilters] = useState<[Slot, Slot, Slot, Slot]>(['Any', 'Any', 'Any', 'Any']);

  useEffect(() => {
    let cancelled = false;

    async function tryLoad(url: string): Promise<Sublimation[] | null> {
      try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        return Array.isArray(data) && data.length > 0 ? data : null;
      } catch {
        return null;
      }
    }

    async function fetchData() {
      setLoading(true);
      // Localized file first, then English.
      const sources = [
        `/data/sublimations.${language}.json`,
        '/data/sublimations.en.json',
      ];
      for (const url of sources) {
        const data = await tryLoad(url);
        if (cancelled) return;
        if (data) {
          setRunes(data);
          setRuneLevels(initializeRuneLevels(data));
          setDataSource('json');
          setLoading(false);
          return;
        }
      }
      if (cancelled) return;
      setRunes(FALLBACK_SUBLIMATIONS);
      setRuneLevels(initializeRuneLevels(FALLBACK_SUBLIMATIONS));
      setDataSource('fallback');
      setLoading(false);
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [language]);

  // links from the search palette and Home: ?q=Influence, ?category=epic
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const q = p.get('q');
    if (q) setSearchTerm(q);
    const cat = p.get('category')?.toLowerCase();
    const canonical = CATEGORY_PARAM[cat ?? ''];
    if (canonical) setSelectedCategory(canonical);
  }, []);

  const categories = useMemo(() => {
    if (!runes.length) return [];
    const cats = new Set(runes.map(r => normalizeCategory(r.category)).filter(Boolean));
    return ['All', ...Array.from(cats).sort(), 'Epic', 'Relic'];
  }, [runes]);

  const categoryLabel = (cat: string) =>
    cat === 'All' ? t.allCategories : (CATEGORY_LABELS[language]?.[cat] ?? cat);

  const handleLevelChange = (runeName: string, newLevel: number) => {
    setRuneLevels(prev => ({ ...prev, [runeName]: newLevel }));
  };

  const filteredRunes = useMemo(() => {
    return runes.filter(rune => {
      if (!rune.name) return false;
      const nameMatch = rune.name.toLowerCase().includes(searchTerm.toLowerCase());
      const descMatch = rune.description && rune.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSearch = nameMatch || descMatch;
      const matchesCategory =
        selectedCategory === 'All' ? true :
        selectedCategory === 'Epic' ? rune.colors.includes('Epic') :
        selectedCategory === 'Relic' ? rune.colors.includes('Relic') :
        normalizeCategory(rune.category) === selectedCategory;

      // Epic/Relic runes have no slot pattern — slot filters don't apply to them.
      const matchesSlots = (selectedCategory === 'Epic' || selectedCategory === 'Relic')
        ? true
        : matchesEquipmentSlots(slotFilters, rune);

      return matchesSearch && matchesCategory && matchesSlots;
    });
  }, [runes, searchTerm, selectedCategory, slotFilters]);

  const header = (
    <PageHeader
      title={t.sublimationsLibrary}
      subtitle={t.sublimationsSubtitle}
    />
  );

  if (loading) {
    // Also what the prerenderer captures: keep the page heading here.
    return (
      <div>
        {header}
        <div className="flex flex-col items-center justify-center py-16 text-muted">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p>{t.loadingSublimations}</p>
        </div>
      </div>
    );
  }

  const clearAll = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSlotFilters(['Any', 'Any', 'Any', 'Any']);
  };

  return (
    <div>
      {header}

      <div className="card p-4 md:p-5 mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle pointer-events-none" />
            <input
              type="search"
              placeholder={t.searchByNameOrDesc}
              aria-label={t.searchByNameOrDesc}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 pr-10"
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm('')} aria-label="Clear" className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-subtle hover:text-fg">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted shrink-0">
            <span><strong className="text-fg font-semibold">{filteredRunes.length}</strong> {t.items}</span>
            {dataSource === 'fallback' && (
              <span className="badge text-warning"><AlertCircle className="w-3 h-3" /> {t.usingBackupData}</span>
            )}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1" role="group" aria-label="Categories">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              aria-pressed={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className={`chip shrink-0 ${selectedCategory === cat ? 'chip-active' : ''}
                ${cat === 'Epic' ? 'text-rarity-epic' : ''} ${cat === 'Relic' ? 'text-rarity-relic' : ''}`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-line">
          <div className="text-[13px] font-semibold text-muted mb-2">{t.filterBySlots}</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap gap-2 lg:items-end">
            {[0, 1, 2, 3].map(idx => (
              <SlotSelector
                key={idx}
                label={`${t.slot} ${idx + 1}`}
                value={slotFilters[idx]}
                optionLabels={{ Any: t.slotEmpty, G: t.slotGreen, B: t.slotBlue, R: t.slotRed, J: t.slotWhite }}
                onChange={(newValue) => {
                  const next = [...slotFilters] as [Slot, Slot, Slot, Slot];
                  next[idx] = newValue as Slot;
                  setSlotFilters(next);
                }}
              />
            ))}
            {slotFilters.some(s => s !== 'Any') && (
              <button type="button" onClick={() => setSlotFilters(['Any', 'Any', 'Any', 'Any'])} className="btn btn-ghost btn-sm col-span-2 sm:col-span-4 lg:col-span-1 h-10">
                <X className="w-4 h-4" /> {t.clearSlotFilters}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredRunes.map(rune => {
          const isSpecial = rune.colors.includes('Epic') || rune.colors.includes('Relic');
          const currentLevel = runeLevels[rune.name] || rune.minLevel || 1;
          const nameClass = rune.colors.includes('Relic') ? 'text-rarity-relic' : rune.colors.includes('Epic') ? 'text-rarity-epic' : 'text-fg';

          return (
            <article key={rune.name} className="card p-4 flex flex-col gap-3">
              <header className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className={`font-display font-bold text-base leading-snug ${nameClass}`}>{rune.name}</h2>
                  {!isSpecial && <span className="text-xs text-subtle font-medium">{t.lvl} {currentLevel}</span>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {rune.colors.map((color, idx) =>
                    ['R', 'G', 'B'].includes(color) ? (
                      <LocalImage
                        key={idx}
                        src={`/data/icons/${SOCKET_ICONS[color as 'R' | 'G' | 'B']}`}
                        alt={color}
                        fallbackText={color}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <span key={idx} className={`badge border-transparent ${color === 'Epic' ? 'bg-rarity-epic/15 text-rarity-epic' : 'bg-rarity-relic/15 text-rarity-relic'}`}>
                        {CATEGORY_LABELS[language]?.[color] ?? color}
                      </span>
                    )
                  )}
                </div>
              </header>

              <p className="text-[14px] text-muted leading-relaxed flex-1">{processDescription(rune, currentLevel)}</p>

              <div className="flex items-center gap-2 text-xs text-subtle">
                {rune.obtenation?.name && (
                  <>
                    <LocalImage src={rune.obtenation.localIcon} alt="" className="w-6 h-6 rounded bg-surface2 shrink-0" />
                    <span className="truncate" title={rune.obtenation.name}>{rune.obtenation.name}</span>
                  </>
                )}
                <span className="ml-auto flex gap-1 shrink-0">
                  {rune.rarity?.filter((r) => RARITY_ICONS[r]).map((r) => (
                    <LocalImage key={r} src={`/data/icons/${RARITY_ICONS[r]}`} alt={r} className="w-5 h-5 object-contain" />
                  ))}
                </span>
              </div>

              {!isSpecial && (
                <div className="flex items-center gap-3 pt-3 border-t border-line">
                  <input
                    type="range"
                    aria-label={`${t.lvl} ${rune.name}`}
                    className="flex-1 accent-[rgb(var(--primary))]"
                    min={rune.minLevel || 1}
                    max={rune.maxLevel || 6}
                    step={rune.step || 1}
                    value={currentLevel}
                    onChange={(e) => handleLevelChange(rune.name, parseInt(e.target.value))}
                  />
                  <span className="w-8 h-8 rounded-lg grid place-items-center bg-primary/10 text-primary font-mono font-bold text-sm">{currentLevel}</span>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {filteredRunes.length === 0 && (
        <div className="card flex flex-col items-center justify-center text-center py-16 px-6">
          <SearchX className="w-10 h-10 text-subtle mb-3" />
          <p className="font-semibold text-fg">{t.noSublimationsFound}</p>
          <p className="text-sm text-muted mt-1">{t.tryAdjustingFilters}</p>
          <button type="button" onClick={clearAll} className="btn mt-4">{t.clearAllFilters}</button>
        </div>
      )}
    </div>
  );
}
