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
