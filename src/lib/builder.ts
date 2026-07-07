// Core engine for the equipment builder: data loading, stat aggregation,
// build serialization (URL sharing) and local saves. UI-free by design.

import {
  STAT_ACTIONS,
  TYPE_TO_SLOT,
  TWO_HANDED_TYPES,
  SLOT_ORDER,
  type SlotKey,
} from '../constants/equipmentStats';

// ─── Data ────────────────────────────────────────────────────────────────────

export interface EquipmentItem {
  id: number;
  name: string;
  type: number;
  lvl: number;
  rarity: number;
  gfx: number | null;
  /** [actionId, value] or [actionId, value, elementCount] */
  stats: number[][];
}

export interface EquipmentData {
  version: string;
  items: EquipmentItem[];
  byId: Map<number, EquipmentItem>;
}

export async function loadEquipmentData(language: string): Promise<EquipmentData> {
  const tryFetch = async (lang: string) => {
    const res = await fetch(`/data/equipment.compact.${lang}.json`);
    if (!res.ok) throw new Error(`equipment data ${lang}: HTTP ${res.status}`);
    return res.json();
  };
  const raw = await tryFetch(language).catch(() => tryFetch('en'));
  const byId = new Map<number, EquipmentItem>();
  for (const it of raw.items) byId.set(it.id, it);
  return { version: raw.version, items: raw.items, byId };
}

/** Which slots can host an item of the given type. */
export function slotsForType(type: number): SlotKey[] {
  if (type === 103) return ['RING_1', 'RING_2'];
  const slot = TYPE_TO_SLOT[type];
  return slot ? [slot] : [];
}

export function isTwoHanded(item: EquipmentItem): boolean {
  return TWO_HANDED_TYPES.has(item.type);
}

// ─── Build state ─────────────────────────────────────────────────────────────

export interface Build {
  level: number;
  /** slot → equipped item id */
  slots: Partial<Record<SlotKey, number>>;
}

export const MAX_LEVEL = 245;

export function emptyBuild(level = MAX_LEVEL): Build {
  return { level, slots: {} };
}

/**
 * Equip an item, enforcing slot rules. Returns the new build.
 * - two-handed weapons clear the second hand
 * - equipping a second hand while a two-handed weapon is present clears it
 */
export function equipItem(build: Build, item: EquipmentItem, slot: SlotKey): Build {
  const allowed = slotsForType(item.type);
  if (!allowed.includes(slot)) return build;
  const slots = { ...build.slots, [slot]: item.id };
  if (slot === 'FIRST_WEAPON' && isTwoHanded(item)) delete slots.SECOND_WEAPON;
  return { ...build, slots };
}

export function unequipSlot(build: Build, slot: SlotKey): Build {
  const slots = { ...build.slots };
  delete slots[slot];
  return { ...build, slots };
}

/** SECOND_WEAPON is blocked while a two-handed weapon is equipped. */
export function isSlotBlocked(build: Build, slot: SlotKey, data: EquipmentData): boolean {
  if (slot !== 'SECOND_WEAPON') return false;
  const weaponId = build.slots.FIRST_WEAPON;
  if (!weaponId) return false;
  const weapon = data.byId.get(weaponId);
  return !!weapon && isTwoHanded(weapon);
}

// ─── Stat aggregation ────────────────────────────────────────────────────────

export interface StatTotals {
  /** stat key → total value (see STAT_ACTIONS) */
  totals: Record<string, number>;
  /** "mastery of N elements" style bonuses, kept as separate lines */
  variable: { key: 'elemMasteryN' | 'elemResN'; value: number; count: number }[];
  /** duplicate-ring warning */
  duplicateRings: boolean;
}

/** Character base stats at a given level (before equipment). */
export function baseStats(level: number): Record<string, number> {
  return {
    hp: 50 + 10 * level,
    ap: 6,
    mp: 3,
    wp: 6,
    critHit: 3,
  };
}

export function computeTotals(build: Build, data: EquipmentData): StatTotals {
  const totals: Record<string, number> = { ...baseStats(build.level) };
  const variable: StatTotals['variable'] = [];

  for (const slot of SLOT_ORDER) {
    const id = build.slots[slot];
    if (!id) continue;
    const item = data.byId.get(id);
    if (!item) continue;
    for (const s of item.stats) {
      const [actionId, value, count] = s;
      const meta = STAT_ACTIONS[actionId];
      if (!meta) continue;
      if (meta.key === 'elemMasteryN' || meta.key === 'elemResN') {
        variable.push({ key: meta.key, value, count: count ?? 1 });
      } else {
        totals[meta.key] = (totals[meta.key] ?? 0) + value;
      }
    }
  }

  const r1 = build.slots.RING_1;
  const r2 = build.slots.RING_2;
  return {
    totals,
    variable,
    duplicateRings: !!r1 && r1 === r2,
  };
}

// ─── Build serialization (URL sharing) ───────────────────────────────────────
// Format: v1 = [1, level, ...itemIds in SLOT_ORDER (0 = empty)],
// JSON → base64url. Compact (~50 chars) and forward-extensible.

export function encodeBuild(build: Build): string {
  const arr = [1, build.level, ...SLOT_ORDER.map((s) => build.slots[s] ?? 0)];
  const json = JSON.stringify(arr);
  return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeBuild(encoded: string): Build | null {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const arr = JSON.parse(atob(b64));
    if (!Array.isArray(arr) || arr[0] !== 1) return null;
    const level = Number(arr[1]);
    if (!Number.isFinite(level) || level < 1 || level > MAX_LEVEL) return null;
    const slots: Build['slots'] = {};
    SLOT_ORDER.forEach((slot, i) => {
      const id = Number(arr[2 + i]);
      if (id > 0) slots[slot] = id;
    });
    return { level, slots };
  } catch {
    return null;
  }
}

// ─── Local saves ─────────────────────────────────────────────────────────────

const SAVES_KEY = 'wakfu-builds';

export interface SavedBuild {
  name: string;
  build: Build;
  updatedAt: number;
}

export function listSavedBuilds(): SavedBuild[] {
  try {
    const raw = localStorage.getItem(SAVES_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveBuild(name: string, build: Build): SavedBuild[] {
  const saves = listSavedBuilds().filter((s) => s.name !== name);
  saves.unshift({ name, build, updatedAt: Date.now() });
  try {
    localStorage.setItem(SAVES_KEY, JSON.stringify(saves.slice(0, 50)));
  } catch {
    // storage full/unavailable — keep the in-memory list anyway
  }
  return saves;
}

export function deleteBuild(name: string): SavedBuild[] {
  const saves = listSavedBuilds().filter((s) => s.name !== name);
  try {
    localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
  } catch {
    // ignore
  }
  return saves;
}
