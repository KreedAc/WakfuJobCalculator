import { useState, useEffect, useMemo } from 'react';
import { Scroll, Search, AlertCircle, X, Filter } from 'lucide-react';
import { FALLBACK_SUBLIMATIONS, type Sublimation } from '../data/fallbackSublimations';
import { processDescription, initializeRuneLevels } from '../utils/sublimationUtils';
import { LocalImage } from './LocalImage';
import './Sublimations.css';

export function Sublimations() {
  const [runes, setRunes] = useState<Sublimation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [runeLevels, setRuneLevels] = useState<Record<string, number>>({});
  const [dataSource, setDataSource] = useState<'loading' | 'json' | 'fallback' | 'error'>('loading');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('sublimations.json');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setRunes(data);
            setRuneLevels(initializeRuneLevels(data));
            setDataSource('json');
            setLoading(false);
            return;
          }
        }
        throw new Error("JSON file not found or empty");
      } catch (err) {
        console.warn("Could not load sublimations.json, using fallback data:", err);
        setRunes(FALLBACK_SUBLIMATIONS);
        setRuneLevels(initializeRuneLevels(FALLBACK_SUBLIMATIONS));
        setDataSource('fallback');
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const categories = useMemo(() => {
    if (!runes.length) return [];
    const cats = new Set(runes.map(r => r.category).filter(Boolean));
    return ['All Categories', ...Array.from(cats).sort()];
  }, [runes]);

  const handleLevelChange = (runeName: string, newLevel: number) => {
    setRuneLevels(prev => ({
      ...prev,
      [runeName]: newLevel
    }));
  };

  const filteredRunes = useMemo(() => {
    return runes.filter(rune => {
      if (!rune.name) return false;
      const nameMatch = rune.name.toLowerCase().includes(searchTerm.toLowerCase());
      const descMatch = rune.description && rune.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSearch = nameMatch || descMatch;
      const matchesCategory = selectedCategory === 'All Categories' || rune.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [runes, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-emerald-400">
        <div className="animate-spin mb-4">
          <Scroll size={32} />
        </div>
        <p>Loading Sublimations...</p>
      </div>
    );
  }

  return (
    <div className="sublimation-container animate-in fade-in duration-500">
      <div className="controls">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Scroll className="text-emerald-400" />
            Sublimations Library (Work in Progress)
            <span className="text-sm font-normal text-slate-400 ml-2 bg-slate-800 px-2 py-1 rounded-md">
              {filteredRunes.length} items
            </span>
          </h2>
          {dataSource === 'fallback' && (
            <div className="text-amber-400 text-xs flex items-center gap-1 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-500/30">
              <AlertCircle size={12} /> using backup data (JSON missing)
            </div>
          )}
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-icon-btn">
            <Search size={18} />
          </button>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-12 text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="category-filter">
        {categories.map(cat => (
          <div
            key={cat}
            className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      <div className="runes-grid">
        {filteredRunes.map(rune => {
          const isSpecial = rune.colors.includes('Epic') || rune.colors.includes('Relic');
          const currentLevel = runeLevels[rune.name] || rune.minLevel || 1;
          const nameClass = rune.colors.includes('Relic') ? 'relic-name' : (rune.colors.includes('Epic') ? 'epic-name' : '');

          return (
            <div key={rune.name} className="rune-card">
              <div className="card-content">
                <div className="rune-header">
                  <div className="flex-1">
                    <div className={`rune-name ${nameClass}`}>{rune.name}</div>
                    {!isSpecial && <span className="rune-level-badge">Lvl. {currentLevel}</span>}
                  </div>
                  <div className="rune-colors">
                    {rune.colors.map((color, idx) => {
                      if (['R', 'G', 'B'].includes(color)) {
                        const iconMap = { R: 'red_slot.png', G: 'green_slot.png', B: 'blue_slot.png' };
                        return (
                          <div key={idx} className="color-slot" title={`${color} Slot`}>
                            <LocalImage src={`./icons/${iconMap[color as 'R' | 'G' | 'B']}`} alt={color} fallbackText={color} />
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className={`special-badge ${color.toLowerCase()}`}>
                          {color}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rune-meta">
                  <div className="obtenation">
                    {rune.obtenation && rune.obtenation.name && (
                      <>
                        <LocalImage
                          src={rune.obtenation.localIcon}
                          alt=""
                          className="w-7 h-7 rounded bg-slate-700"
                        />
                        <span className="truncate max-w-[140px]" title={rune.obtenation.name}>
                          {rune.obtenation.name}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {rune.rarity && rune.rarity.map((r, idx) => {
                      const iconMap = { Rare: 'rare_icon.png', Mythic: 'mythic_icon.png', Legendary: 'legendary_icon.png' };
                      if (['Rare', 'Mythic', 'Legendary'].includes(r)) {
                        return (
                          <LocalImage
                            key={idx}
                            src={`./icons/${iconMap[r as keyof typeof iconMap]}`}
                            alt={r}
                            className="w-6 h-6 object-contain drop-shadow-md"
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                <div className="rune-description">
                  {processDescription(rune, currentLevel)}
                </div>

                {!isSpecial && (
                  <div className="level-controls">
                    <input
                      type="range"
                      className="level-slider"
                      min={rune.minLevel || 1}
                      max={rune.maxLevel || 6}
                      step={rune.step || 1}
                      value={currentLevel}
                      onChange={(e) => handleLevelChange(rune.name, parseInt(e.target.value))}
                    />
                    <div className="level-display">{currentLevel}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!loading && filteredRunes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-900/50 rounded-xl border border-slate-800">
          <Filter size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">No sublimations found</p>
          <p className="text-sm">Try adjusting your search or category filter.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('All Categories'); }}
            className="mt-4 text-emerald-400 hover:underline text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
