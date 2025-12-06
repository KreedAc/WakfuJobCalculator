import type { Sublimation } from '../data/fallbackSublimations';

export function processDescription(rune: Sublimation, currentLevel: number): string {
  if (!rune || !rune.description) return "Description unavailable";

  let description = rune.description;

  if (rune.values && Array.isArray(rune.values)) {
    rune.values.forEach(value => {
      if (value.placeholder && typeof value.placeholder === 'string') {
        const minLevel = rune.minLevel || 1;
        const step = rune.step || 1;
        const steps = Math.floor((currentLevel - minLevel) / step);

        const base = value.base || 0;
        const increment = value.increment || 0;
        const calculatedValue = base + (increment * steps);

        const placeholder = value.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\[${placeholder}\\]`, 'g');
        description = description.replace(regex, String(calculatedValue));
      }
    });
  }
  return description;
}

export function initializeRuneLevels(runes: Sublimation[]): Record<string, number> {
  const levels: Record<string, number> = {};
  runes.forEach(rune => {
    levels[rune.name] = rune.minLevel || 1;
  });
  return levels;
}
