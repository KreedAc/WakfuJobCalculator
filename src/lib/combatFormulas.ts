// Pure combat formulas used by the Combat Calculator.
// Kept free of React so they can be unit-tested.

export type Position = 'facing' | 'side' | 'rear';

export const RESISTANCE_CAP = 90;

export function positionMultiplier(pos: Position): number {
  return pos === 'rear' ? 1.25 : pos === 'side' ? 1.1 : 1;
}

export interface DamageInput {
  base: number;
  masteries: number;
  position: Position;
  damageInflicted: number;
  resistance: number;
  fixed: number;
  barrier: number;
  /** 1 = not blocked, 0.8 = blocked, 0.68 = blocked with Blocking Expert */
  block: number;
}

export function damage(i: DamageInput): number {
  const raw =
    i.base * (1 + i.masteries / 100) * positionMultiplier(i.position) *
    (1 + i.damageInflicted / 100) * (1 - Math.min(i.resistance, RESISTANCE_CAP) / 100);
  return Math.max(0, Math.round((raw + i.fixed - i.barrier) * i.block));
}

export interface HealInput {
  base: number;
  masteries: number;
  healsPerformed: number;
  healsReceived: number;
  healResistance: number;
  incurable: number;
}

export function heal(i: HealInput): number {
  return Math.max(0, Math.round(
    i.base * (1 + i.masteries / 100) * (1 + (i.healsPerformed + i.healsReceived) / 100) *
    (1 - i.healResistance / 100) * (1 - i.incurable / 100)
  ));
}

export interface ArmorInput {
  base: number;
  crit: boolean;
  onAlly: boolean;
  armorGiven: number;
  armorReceived: number;
}

export function armor(i: ArmorInput): number {
  return i.base * (i.crit ? 1.25 : 1) * (1 + ((i.onAlly ? i.armorGiven : 0) + i.armorReceived) / 100);
}

export interface EffectiveMasteries { em: number; emcrit: number; avg: number }

/**
 * Effective masteries: folds % damage inflicted and crit into one number.
 * EM = (1 + M/100)(1 + DI/100) × 100 − 100, so with 0% DI it equals the masteries.
 */
export function effectiveMasteries(
  masteries: number, critMastery: number, di: number, critDi: number,
  critChance: number, stasis = 100,
): EffectiveMasteries {
  const s = stasis / 100;
  const em = ((masteries + 100) * (di + 100) * s / 100) - 100;
  const emcrit = (((masteries + critMastery + 100) * (di + critDi + 100) * s / 100) * 1.25) - 100;
  return { em, emcrit, avg: em + (emcrit - em) * (critChance / 100) };
}

/** Effective HP: HP scaled by % resistance and block (Blocking Expert blocks 32% instead of 20%). */
export function effectiveHp(hp: number, resistance: number, block: number, blockingExpert: boolean): number {
  const blockCoef = blockingExpert ? 0.68 : 0.8;
  const d = (100 - Math.min(resistance, RESISTANCE_CAP)) * (100 - (1 - blockCoef) * Math.min(block, 100));
  return d <= 0 ? Infinity : (hp * 10000) / d;
}

/** Flat resistance → % resistance (capped at 90%). */
export function flatToPercent(flat: number): number {
  // epsilon guards against float error flooring exact values (100 flat → 19.999… → 20%)
  return Math.min(Math.floor((1 - Math.pow(0.8, flat / 100)) * 1000 + 1e-9) / 10, RESISTANCE_CAP);
}

/** % resistance → minimum flat resistance needed. */
export function percentToFlat(percent: number): number {
  if (percent <= 0) return 0;
  const p = Math.min(percent, RESISTANCE_CAP);
  return Math.ceil(100 * Math.log(1 - p / 100) / Math.log(0.8));
}

export interface ForceOfWill { factor: number; effective: number; guaranteed: number; extraChance: number }

export function forceOfWill(baseRemoval: number, casterFow: number, targetFow: number): ForceOfWill {
  const factor = Math.max(0, Math.min(2, (1 + casterFow / 100) - targetFow / 100));
  const effective = baseRemoval * 0.5 * factor;
  const guaranteed = Math.floor(effective);
  return { factor, effective, guaranteed, extraChance: (effective - guaranteed) * 100 };
}

export interface LockResult { combined: number; x: number; mpLoss: number; apLoss: number }

/** MP/AP loss on dodge; lockers weighted 1, 1/2, 1/3, 1/4 by strength. orientation: 0 facing, 1 side, 2 back. */
export function lockLoss(lockers: number[], dodge: number, orientation: number): LockResult {
  const l = [...lockers, 0, 0, 0, 0].slice(0, 4).sort((a, b) => b - a);
  const combined = l[0] + l[1] / 2 + l[2] / 3 + l[3] / 4;
  const lc = Math.max(0, combined);
  const dc = Math.max(0, dodge);
  const x = lc + dc === 0 ? 0 : (7 / 3) * (lc - dc) / (lc + dc);
  const y = Math.floor((x + 1) * 4 - orientation);
  return {
    combined,
    x,
    mpLoss: Math.max(0, Math.min(4, Math.ceil(y / 2))),
    apLoss: Math.max(0, Math.min(4, Math.floor(y / 2))),
  };
}

export function totalHp(level: number, flat: number, percent: number): number {
  return (50 + level * 10 + flat) * (1 + percent / 100);
}
