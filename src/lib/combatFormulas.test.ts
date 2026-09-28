import { describe, expect, it } from 'vitest';
import {
  damage, heal, armor, effectiveMasteries, effectiveHp, flatToPercent, percentToFlat,
  forceOfWill, lockLoss, totalHp, positionMultiplier, type DamageInput,
} from './combatFormulas';

const baseDamage: DamageInput = {
  base: 100, masteries: 0, position: 'facing', damageInflicted: 0,
  resistance: 0, fixed: 0, barrier: 0, block: 1,
};

describe('damage', () => {
  it('returns the spell base with no modifiers', () => {
    expect(damage(baseDamage)).toBe(100);
  });
  it('applies masteries as +1% per point', () => {
    expect(damage({ ...baseDamage, masteries: 100 })).toBe(200);
  });
  it('applies position multipliers', () => {
    expect(positionMultiplier('side')).toBe(1.1);
    expect(damage({ ...baseDamage, masteries: 100, position: 'rear' })).toBe(250);
  });
  it('caps resistance at 90%', () => {
    expect(damage({ ...baseDamage, resistance: 50 })).toBe(50);
    expect(damage({ ...baseDamage, resistance: 150 })).toBe(10);
  });
  it('adds fixed damage, subtracts barrier, then applies block', () => {
    expect(damage({ ...baseDamage, fixed: 20, barrier: 10, block: 0.8 })).toBe(88);
  });
  it('never goes below zero', () => {
    expect(damage({ ...baseDamage, barrier: 1000 })).toBe(0);
  });
});

describe('heal', () => {
  it('multiplies masteries and heal bonuses', () => {
    expect(heal({ base: 100, masteries: 100, healsPerformed: 10, healsReceived: 10,
      healResistance: 0, incurable: 0 })).toBe(240);
  });
  it('applies incurable', () => {
    expect(heal({ base: 100, masteries: 100, healsPerformed: 10, healsReceived: 10,
      healResistance: 0, incurable: 50 })).toBe(120);
  });
});

describe('armor', () => {
  it('counts armor given only when cast on an ally', () => {
    const i = { base: 100, crit: true, armorGiven: 20, armorReceived: 10 };
    expect(armor({ ...i, onAlly: true })).toBeCloseTo(162.5);
    expect(armor({ ...i, onAlly: false })).toBeCloseTo(137.5);
  });
});

describe('effectiveMasteries', () => {
  it('equals raw masteries with no damage inflicted', () => {
    expect(effectiveMasteries(3000, 0, 0, 0, 0).em).toBeCloseTo(3000);
  });
  it('folds % damage inflicted into masteries', () => {
    // (1 + 30) × (1 + 0.2) × 100 − 100 = 3620
    expect(effectiveMasteries(3000, 0, 20, 0, 0).em).toBeCloseTo(3620);
  });
  it('averages normal and critical by crit chance', () => {
    const r = effectiveMasteries(3000, 200, 0, 0, 25);
    expect(r.emcrit).toBeCloseTo(3300 * 1.25 - 100);
    expect(r.avg).toBeCloseTo(r.em + (r.emcrit - r.em) * 0.25);
  });
});

describe('effectiveHp', () => {
  it('scales HP by resistance and block', () => {
    expect(effectiveHp(1000, 0, 0, false)).toBeCloseTo(1000);
    expect(effectiveHp(1000, 50, 0, false)).toBeCloseTo(2000);
    expect(effectiveHp(1000, 0, 100, false)).toBeCloseTo(1250);
  });
  it('gives Blocking Expert a stronger block', () => {
    expect(effectiveHp(1000, 0, 100, true)).toBeGreaterThan(effectiveHp(1000, 0, 100, false));
  });
});

describe('resistance conversion', () => {
  it('converts flat to percent', () => {
    expect(flatToPercent(0)).toBe(0);
    expect(flatToPercent(100)).toBe(20);
    expect(flatToPercent(100000)).toBe(90);
  });
  it('percentToFlat gives the minimum flat to reach the percent', () => {
    for (const p of [10, 20, 30, 50, 70, 85, 90]) {
      const flat = percentToFlat(p);
      expect(flatToPercent(flat)).toBeGreaterThanOrEqual(p);
      expect(flatToPercent(flat - 2)).toBeLessThan(p);
    }
  });
});

describe('forceOfWill', () => {
  it('computes guaranteed removal and extra chance', () => {
    expect(forceOfWill(2, 100, 0)).toMatchObject({ factor: 2, effective: 2, guaranteed: 2 });
    const r = forceOfWill(3, 0, 50);
    expect(r.factor).toBeCloseTo(0.5);
    expect(r.guaranteed).toBe(0);
    expect(r.extraChance).toBeCloseTo(75);
  });
});

describe('lockLoss', () => {
  it('weights the strongest locker first', () => {
    expect(lockLoss([0, 200, 0, 0], 100, 0).combined).toBe(200);
    expect(lockLoss([200, 100], 100, 0).combined).toBe(250);
  });
  it('splits losses between MP and AP', () => {
    expect(lockLoss([200], 100, 0)).toMatchObject({ mpLoss: 4, apLoss: 3 });
    expect(lockLoss([100], 100, 0)).toMatchObject({ mpLoss: 2, apLoss: 2 });
    expect(lockLoss([0], 0, 0)).toMatchObject({ mpLoss: 2, apLoss: 2 });
  });
  it('reduces losses when lockers show their back', () => {
    expect(lockLoss([200], 100, 2).mpLoss).toBeLessThan(lockLoss([200], 100, 0).mpLoss + 1);
  });
});

describe('totalHp', () => {
  it('adds level base and flat, then % bonus', () => {
    expect(totalHp(230, 10000, 20)).toBeCloseTo((50 + 2300 + 10000) * 1.2);
  });
});
