import { describe, expect, it } from 'vitest';
import { craftsNeeded, resourcesPerCraft } from './xpCalculator';
import { processDescription, initializeRuneLevels, matchesEquipmentSlots } from '../utils/sublimationUtils';
import type { Sublimation } from '../data/fallbackSublimations';

describe('XP calculator', () => {
  it('rounds crafts up', () => {
    expect(craftsNeeded(1000, 150)).toBe(7);
    expect(craftsNeeded(900, 150)).toBe(6);
  });
  it('guards against zero XP per craft', () => {
    expect(craftsNeeded(1000, 0)).toBe(0);
  });
  it('uses 4 resources for Leather Dealer, 5 otherwise', () => {
    expect(resourcesPerCraft('Leather Dealer')).toBe(4);
    expect(resourcesPerCraft('Armorer' as never)).toBe(5);
  });
});

describe('sublimation descriptions', () => {
  const rune = {
    name: 'Influence', description: '[X]% Critical Hit, [Y] Lock',
    values: [
      { base: 3, increment: 3, placeholder: 'X' },
      { base: 10, increment: 5, placeholder: 'Y' },
    ],
    minLevel: 1, maxLevel: 6, step: 1,
  } as unknown as Sublimation;

  it('fills placeholders at the minimum level', () => {
    expect(processDescription(rune, 1)).toBe('3% Critical Hit, 10 Lock');
  });
  it('scales placeholders with the level', () => {
    expect(processDescription(rune, 3)).toBe('9% Critical Hit, 20 Lock');
  });
  it('initializes every rune at its minimum level', () => {
    expect(initializeRuneLevels([rune])).toEqual({ Influence: 1 });
  });
});

describe('sublimation socket filter', () => {
  const rgb = { name: 'x', colors: ['R', 'G', 'B'] } as unknown as Sublimation;
  const withJoker = { name: 'y', colors: ['R', 'J', 'B'] } as unknown as Sublimation;
  const epic = { name: 'z', colors: ['Epic'] } as unknown as Sublimation;

  it('accepts everything when no socket is set', () => {
    expect(matchesEquipmentSlots(['Any', 'Any', 'Any', 'Any'], epic)).toBe(true);
  });
  it('matches the pattern on sockets 1-2-3 or 2-3-4', () => {
    expect(matchesEquipmentSlots(['R', 'G', 'B', 'Any'], rgb)).toBe(true);
    expect(matchesEquipmentSlots(['Any', 'R', 'G', 'B'], rgb)).toBe(true);
    expect(matchesEquipmentSlots(['R', 'B', 'G', 'Any'], rgb)).toBe(false);
  });
  it('treats white as a joker on either side', () => {
    expect(matchesEquipmentSlots(['R', 'J', 'B', 'Any'], rgb)).toBe(true);
    expect(matchesEquipmentSlots(['R', 'G', 'B', 'Any'], withJoker)).toBe(true);
  });
  it('never matches runes without a 3-color pattern', () => {
    expect(matchesEquipmentSlots(['R', 'G', 'B', 'R'], epic)).toBe(false);
  });
});
