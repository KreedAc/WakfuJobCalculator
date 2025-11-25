import React, { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import data from "./sublimations.json";
import "./sublimation.css";

// Types that match your JSON structure
interface RuneValue {
  base: number | null;
  increment: number | null;
  placeholder?: string;
}

interface Rune {
  name: string;
  colors: string[];
  description: string;
  rarity: string[];
  effect: string;
  maxLevel: number;
  minLevel: number;
  step: number;
  obtenation: {
    name: string;
    localIcon?: string;
  };
  category: string;
  values?: RuneValue[];
}

const runes: Rune[] = data as Rune[];
const BG_URL = '424478.jpg';

const CATEGORY_ALL = "all";

function computeDescription(rune: Rune, level: number): string {
  let desc = rune.description;

  if (rune.values && rune.values.length > 0) {
    for (const v of rune.values) {
      if (v.base == null || v.increment == null || !v.placeholder) continue;
      const steps = Math.floor((level - rune.minLevel) / rune.step);
      const value = v.base + v.increment * steps;
      const regex = new RegExp(`\[${v.placeholder}\]`, "g");
      desc = desc.replace(regex, String(value));
    }
  }

  return desc;
}

function levelOptionsFor(rune: Rune): number[] {
  const values: number[] = [];
  for (let lvl = rune.minLevel; lvl <= rune.maxLevel; lvl += rune.step) {
    values.push(lvl);
  }
  return values;
}

export function SublimationPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(CATEGORY_ALL);
  const [levels, setLevels] = useState<Record<string, number>>({});

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of runes) set.add(r.category);
    return [CATEGORY_ALL, ...Array.from(set).sort()];
  }, []);

  const filteredRunes = useMemo(() => {
    const term = search.trim().toLowerCase();

    return runes.filter((r) => {
      if (category !== CATEGORY_ALL && r.category !== category) return False

      if (!term) return true;

      const haystack = `${r.name} ${r.description} ${r.obtenation?.name ?? ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [search, category]);

  function handleLevelChange(rune: Rune, level: number) {
    setLevels((prev) => ({ ...prev, [rune.name]: level }));
  }

  return (
    
    <div className="sublimation-page"
      style={{
          backgroundImage: `url(${BG_URL})`}}>
      <div className="sublimation-header">
        <div className="sublimation-title">
          <div>
            <h2 style={{height : 70}}></h2>
            <p></p>
          </div>
        </div>

        <div className="sublimation-controls">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, description or obtenation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="category-filter" id="categoryFilter">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={
                  "category-tab" + (c === category ? " active" : "")
                }
              >
                {c === CATEGORY_ALL ? "All Categories" : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="runes-grid" id="runesContainer">
        {filteredRunes.length === 0 && (
          <div className="no-results">
            <h3>No sublimation matches your search criteria</h3>
            <p>Try changing filters or clearing the search box.</p>
          </div>
        )}

        {filteredRunes.map((rune) => {
          const currentLevel = levels[rune.name] ?? rune.minLevel;
          const desc = computeDescription(rune, currentLevel);
          const levelsList = levelOptionsFor(rune);
          const isFixedLevel = levelsList.length === 1;
          const isRelic = rune.colors.includes("Relic");
          const isEpic = rune.colors.includes("Epic");

          return (
            <article key={rune.name} className="rune-card">
              <header className="rune-header">
                <div className="rune-name-container">
                  <h3
                    className={
                      "rune-name" + (isRelic ? " relic-name" : isEpic ? " epic-name" : "")
                    }
                  >
                    {rune.name}
                  </h3>
                  {!isRelic && !isEpic && (
                    <div className="rune-level">Lvl. {currentLevel}</div>
                  )}
                </div>

                <div className="rune-colors">
                  {rune.colors.map((c) => (
                    <span key={c} className="color-pill" title={c}>
                      {c}
                    </span>
                  ))}
                </div>
              </header>

              <div className="divider" />

              <div className="rune-meta">
                <div className="obtenation">
                  <span className="obtenation-name">{rune.obtenation?.name}</span>
                </div>
                <div className="rarity">
                  {rune.rarity.map((r) => (
                    <span key={r} className="rarity-pill">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <p className="rune-description">{desc}</p>

              {rune.effect && (
                <p className="rune-effect">{rune.effect}</p>
              )}

              {!isRelic && !isEpic && levelsList.length > 0 && (
                <div className="level-controls">
                  <input
                    type="range"
                    min={rune.minLevel}
                    max={rune.maxLevel}
                    step={rune.step}
                    value={currentLevel}
                    onChange={(e) =>
                      handleLevelChange(rune, Number.parseInt(e.target.value, 10))
                    }
                    className={
                      "level-slider" + (isFixedLevel ? " fixed-level" : "")
                    }
                  />
                  <div className="level-display">{currentLevel}</div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
