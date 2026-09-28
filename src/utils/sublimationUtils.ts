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

/** A slot filter chosen by the user: 'Any' leaves the slot empty, 'J' is a white (joker) socket. */
export type Slot = 'Any' | 'R' | 'G' | 'B' | 'J';
type RuneSlot = 'R' | 'G' | 'B' | 'J';

const isRuneSlot = (c: string): c is RuneSlot =>
  c === 'R' || c === 'G' || c === 'B' || c === 'J';

// Epic/Relic markers in rune.colors are not sockets: keep only the 3-color pattern.
const getRuneSlots = (rune: Sublimation): RuneSlot[] =>
  (rune.colors ?? []).filter(isRuneSlot).slice(0, 3);

const slotMatches = (equip: Slot, rune: RuneSlot) => {
  if (equip === 'Any') return false; // empty socket
  if (equip === 'J') return true;    // white socket accepts any color
  if (rune === 'J') return true;     // white pattern slot accepts any color
  return equip === rune;
};

// A 4-socket item can host a 3-color pattern on sockets 1-2-3 or 2-3-4.
const COMBOS: [number, number, number][] = [
  [0, 1, 2],
  [1, 2, 3],
];

/** Whether a sublimation fits the user's 4 equipment sockets (no filter set → always true). */
export function matchesEquipmentSlots(equipSlots: [Slot, Slot, Slot, Slot], rune: Sublimation): boolean {
  if (equipSlots.every((s) => s === 'Any')) return true;
  const rs = getRuneSlots(rune);
  if (rs.length !== 3) return false;
  return COMBOS.some(([a, b, c]) =>
    slotMatches(equipSlots[a], rs[0]) &&
    slotMatches(equipSlots[b], rs[1]) &&
    slotMatches(equipSlots[c], rs[2])
  );
}
