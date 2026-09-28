import type { ProfessionId } from '../constants/professions';

/** Crafts needed to cover an XP gap, rounding up to a whole craft. */
export function craftsNeeded(expDiff: number, expPerCraft: number): number {
  if (expPerCraft <= 0) return 0;
  return Math.ceil(expDiff / expPerCraft);
}

/** Each craft of the leveling recipe takes 5 of each resource (4 for Leather Dealer). */
export function resourcesPerCraft(profession: ProfessionId): number {
  return profession === 'Leather Dealer' ? 4 : 5;
}
