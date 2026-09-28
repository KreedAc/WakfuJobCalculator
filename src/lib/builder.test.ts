import { describe, expect, it } from 'vitest';
import {
  emptyBuild, equipItem, unequipSlot, isSlotBlocked, computeTotals,
  encodeBuild, decodeBuild, slotsForType, baseStats,
  statDiff, sortValue, itemStatMap, craftableRows,
  type EquipmentData, type EquipmentItem,
} from './builder';
import { formatCraftItems, parseCraftItems } from './craftLink';

const item = (id: number, type: number, stats: number[][]): EquipmentItem =>
  ({ id, name: `item${id}`, type, lvl: 200, rarity: 3, gfx: null, stats });

const belt = item(1, 133, [[41, 1], [20, 555], [173, 50], [875, 5], [1068, 188, 3], [80, 50]]);
const bow = item(2, 117, [[31, 1], [20, 353]]);             // two-handed
const shield = item(3, 189, [[20, 431], [875, 15]]);
const ring = item(4, 103, [[20, 100], [82, 20]]);
const helm = item(5, 134, [[20, 300], [173, 10], [122, 40]]);

const data: EquipmentData = {
  version: 'test',
  items: [belt, bow, shield, ring, helm],
  byId: new Map([belt, bow, shield, ring, helm].map((i) => [i.id, i])),
};

describe('slots', () => {
  it('maps item types to slots, rings to both ring slots', () => {
    expect(slotsForType(133)).toEqual(['BELT']);
    expect(slotsForType(103)).toEqual(['RING_1', 'RING_2']);
    expect(slotsForType(999)).toEqual([]);
  });
  it('refuses an item in the wrong slot', () => {
    const b = equipItem(emptyBuild(200), belt, 'HEAD');
    expect(b.slots.HEAD).toBeUndefined();
  });
  it('two-handed weapons clear and block the second hand', () => {
    let b = equipItem(emptyBuild(200), shield, 'SECOND_WEAPON');
    b = equipItem(b, bow, 'FIRST_WEAPON');
    expect(b.slots.SECOND_WEAPON).toBeUndefined();
    expect(isSlotBlocked(b, 'SECOND_WEAPON', data)).toBe(true);
    expect(isSlotBlocked(unequipSlot(b, 'FIRST_WEAPON'), 'SECOND_WEAPON', data)).toBe(false);
  });
});

describe('computeTotals', () => {
  it('starts from level base stats', () => {
    expect(computeTotals(emptyBuild(200), data).totals).toMatchObject(baseStats(200));
    expect(baseStats(200).hp).toBe(2050);
  });
  it('adds item stats on top of the base', () => {
    const t = computeTotals(equipItem(emptyBuild(200), belt, 'BELT'), data);
    expect(t.totals.hp).toBe(2050 + 555);
    expect(t.totals.mp).toBe(4);
    expect(t.totals.lock).toBe(50);
    expect(t.totals.block).toBe(5);
    expect(t.totals.elemRes).toBe(50);
    expect(t.variable).toEqual([{ key: 'elemMasteryN', value: 188, count: 3 }]);
  });
  it('flags identical rings', () => {
    let b = equipItem(emptyBuild(200), ring, 'RING_1');
    expect(computeTotals(b, data).duplicateRings).toBe(false);
    b = equipItem(b, ring, 'RING_2');
    expect(computeTotals(b, data).duplicateRings).toBe(true);
  });
});

describe('build URL encoding', () => {
  it('round-trips a build', () => {
    let b = equipItem(emptyBuild(215), belt, 'BELT');
    b = equipItem(b, bow, 'FIRST_WEAPON');
    b = equipItem(b, ring, 'RING_2');
    const decoded = decodeBuild(encodeBuild(b));
    expect(decoded).not.toBeNull();
    expect(decoded!.level).toBe(215);
    expect(decoded!.slots).toEqual(b.slots);
  });
  it('produces URL-safe output', () => {
    expect(encodeBuild(emptyBuild())).toMatch(/^[A-Za-z0-9_-]+$/);
  });
  it('rejects malformed or out-of-range input', () => {
    expect(decodeBuild('not-a-build')).toBeNull();
    expect(decodeBuild(btoa(JSON.stringify([2, 200])))).toBeNull();
    expect(decodeBuild(btoa(JSON.stringify([1, 999])))).toBeNull();
  });
});

describe('item comparison', () => {
  it('diffs a candidate against the equipped item, in display order', () => {
    expect(statDiff(helm, belt)).toEqual([
      ['hp', -255], ['mp', -1], ['fireMastery', 40], ['elemMasteryN:3', -188], ['block', -5], ['lock', -40], ['elemRes', -50],
    ]);
  });
  it('lists every stat as a gain when the slot is empty', () => {
    expect(statDiff(ring, undefined)).toEqual([['hp', 100], ['fireRes', 20]]);
  });
  it('sorts elemental mastery with the N-elements bonus folded in', () => {
    expect(sortValue(belt, 'elemMastery')).toBe(188);
    expect(sortValue(helm, 'hp')).toBe(300);
    expect(sortValue(helm, 'level')).toBe(200);
  });
  it('keeps "N elements" bonuses with different counts apart', () => {
    const two = item(9, 134, [[1068, 100, 2], [1068, 50, 3]]);
    expect(itemStatMap(two)).toEqual({ 'elemMasteryN:2': 100, 'elemMasteryN:3': 50 });
  });
});

describe('craft guide link', () => {
  const craftRing = { ...ring, craft: 1 as const };
  const craftData: EquipmentData = { ...data, byId: new Map([...data.byId, [4, craftRing]]) };
  it('lists craftable items once, with identical rings counted twice', () => {
    let b = equipItem(emptyBuild(200), craftRing, 'RING_1');
    b = equipItem(b, craftRing, 'RING_2');
    b = equipItem(b, helm, 'HEAD');
    expect(craftableRows(b, craftData)).toEqual([{ itemId: 4, qty: 2 }]);
  });
  it('round-trips the ?items= format and ignores junk', () => {
    const rows = [{ itemId: 12464, qty: 1 }, { itemId: 8047, qty: 2 }];
    expect(formatCraftItems(rows)).toBe('12464,8047x2');
    expect(parseCraftItems('12464,8047x2')).toEqual(rows);
    expect(parseCraftItems('abc,0,5x0,7,7')).toEqual([{ itemId: 5, qty: 1 }, { itemId: 7, qty: 2 }]);
    expect(parseCraftItems(null)).toEqual([]);
  });
});
