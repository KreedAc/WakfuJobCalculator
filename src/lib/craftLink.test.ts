import { describe, expect, it } from 'vitest';
import { formatCraftItems, parseCraftItems } from './craftLink';

describe('craft guide link format', () => {
  it('round-trips the ?items= format and ignores junk', () => {
    const rows = [{ itemId: 12464, qty: 1 }, { itemId: 8047, qty: 2 }];
    expect(formatCraftItems(rows)).toBe('12464,8047x2');
    expect(parseCraftItems('12464,8047x2')).toEqual(rows);
    expect(parseCraftItems('abc,0,5x0,7,7')).toEqual([{ itemId: 5, qty: 1 }, { itemId: 7, qty: 2 }]);
    expect(parseCraftItems(null)).toEqual([]);
  });
});

describe('leveling recipes', () => {
  it('has one recipe per level range and profession, and large quantities survive the link', async () => {
    const { LEVELING_RECIPE_IDS } = await import('../constants/levelingRecipes');
    const { LEVEL_RANGES } = await import('../constants/levelRanges');
    const ids = Object.values(LEVELING_RECIPE_IDS).flat();
    for (const list of Object.values(LEVELING_RECIPE_IDS)) expect(list).toHaveLength(LEVEL_RANGES.length);
    expect(new Set(ids).size).toBe(ids.length);
    expect(parseCraftItems('21075x1450')).toEqual([{ itemId: 21075, qty: 1450 }]);
  });
});
