import type { Language } from './translations';

// ─── Stat metadata ───────────────────────────────────────────────────────────
// actionId → stat, derived from the official actions.json (see
// scripts/probe-equipment-data.mjs). Values in equipment.compact are
// [actionId, value] pairs; losses arrive already negated on the gain id.

export type StatGroup = 'general' | 'combat' | 'secondary' | 'resistance';

export interface StatMeta {
  /** stable key used in totals */
  key: string;
  group: StatGroup;
  /** true when the value is a percentage */
  percent?: boolean;
  labels: Record<Language, string>;
}

export const STAT_ACTIONS: Record<number, StatMeta> = {
  20:  { key: 'hp',            group: 'general',   labels: { en: 'HP',                  fr: 'PV',                        es: 'PdV',                      pt: 'PV' } },
  31:  { key: 'ap',            group: 'general',   labels: { en: 'AP',                  fr: 'PA',                        es: 'PA',                       pt: 'PA' } },
  41:  { key: 'mp',            group: 'general',   labels: { en: 'MP',                  fr: 'PM',                        es: 'PM',                       pt: 'PM' } },
  191: { key: 'wp',            group: 'general',   labels: { en: 'WP',                  fr: 'PW',                        es: 'PW',                       pt: 'PW' } },
  193: { key: 'wp',            group: 'general',   labels: { en: 'WP',                  fr: 'PW',                        es: 'PW',                       pt: 'PW' } },
  160: { key: 'range',         group: 'general',   labels: { en: 'Range',               fr: 'Portée',                    es: 'Alcance',                  pt: 'Alcance' } },

  120: { key: 'elemMastery',   group: 'combat',    labels: { en: 'Elemental Mastery',   fr: 'Maîtrise élémentaire',      es: 'Dominio elemental',        pt: 'Domínio elemental' } },
  122: { key: 'fireMastery',   group: 'combat',    labels: { en: 'Fire Mastery',        fr: 'Maîtrise Feu',              es: 'Dominio de fuego',         pt: 'Domínio de fogo' } },
  123: { key: 'earthMastery',  group: 'combat',    labels: { en: 'Earth Mastery',       fr: 'Maîtrise Terre',            es: 'Dominio de tierra',        pt: 'Domínio de terra' } },
  124: { key: 'waterMastery',  group: 'combat',    labels: { en: 'Water Mastery',       fr: 'Maîtrise Eau',              es: 'Dominio de agua',          pt: 'Domínio de água' } },
  125: { key: 'airMastery',    group: 'combat',    labels: { en: 'Air Mastery',         fr: 'Maîtrise Air',              es: 'Dominio de aire',          pt: 'Domínio de ar' } },
  1068:{ key: 'elemMasteryN',  group: 'combat',    labels: { en: 'Mastery of {n} elements', fr: 'Maîtrise de {n} éléments', es: 'Dominio de {n} elementos', pt: 'Domínio de {n} elementos' } },
  1052:{ key: 'meleeMastery',  group: 'combat',    labels: { en: 'Melee Mastery',       fr: 'Maîtrise Mêlée',            es: 'Dominio cuerpo a cuerpo',  pt: 'Domínio corpo a corpo' } },
  1053:{ key: 'distMastery',   group: 'combat',    labels: { en: 'Distance Mastery',    fr: 'Maîtrise Distance',         es: 'Dominio de distancia',     pt: 'Domínio de distância' } },
  1055:{ key: 'berserkMastery',group: 'combat',    labels: { en: 'Berserk Mastery',     fr: 'Maîtrise Berserk',          es: 'Dominio berserker',        pt: 'Domínio berserk' } },
  180: { key: 'rearMastery',   group: 'combat',    labels: { en: 'Rear Mastery',        fr: 'Maîtrise Dos',              es: 'Dominio de espalda',       pt: 'Domínio nas costas' } },
  26:  { key: 'healMastery',   group: 'combat',    labels: { en: 'Healing Mastery',     fr: 'Maîtrise Soin',             es: 'Dominio de sanación',      pt: 'Domínio de cura' } },
  149: { key: 'critMastery',   group: 'combat',    labels: { en: 'Critical Mastery',    fr: 'Maîtrise Critique',         es: 'Dominio crítico',          pt: 'Domínio crítico' } },
  150: { key: 'critHit',       group: 'combat',    percent: true, labels: { en: 'Critical Hit',    fr: 'Coup Critique',    es: 'Golpe crítico',   pt: 'Golpe crítico' } },
  875: { key: 'block',         group: 'combat',    percent: true, labels: { en: 'Block',           fr: 'Parade',           es: 'Anticipación',    pt: 'Bloqueio' } },

  171: { key: 'initiative',    group: 'secondary', labels: { en: 'Initiative',          fr: 'Initiative',                es: 'Iniciativa',               pt: 'Iniciativa' } },
  173: { key: 'lock',          group: 'secondary', labels: { en: 'Lock',                fr: 'Tacle',                     es: 'Placaje',                  pt: 'Placagem' } },
  175: { key: 'dodge',         group: 'secondary', labels: { en: 'Dodge',               fr: 'Esquive',                   es: 'Esquiva',                  pt: 'Esquiva' } },
  177: { key: 'fow',           group: 'secondary', labels: { en: 'Force of Will',       fr: 'Volonté',                   es: 'Voluntad',                 pt: 'Vontade' } },
  166: { key: 'wisdom',        group: 'secondary', labels: { en: 'Wisdom',              fr: 'Sagesse',                   es: 'Sabiduría',                pt: 'Sabedoria' } },
  162: { key: 'prospecting',   group: 'secondary', labels: { en: 'Prospecting',         fr: 'Prospection',               es: 'Prospección',              pt: 'Prospecção' } },

  80:  { key: 'elemRes',       group: 'resistance', labels: { en: 'Elemental Resistance', fr: 'Résistance élémentaire',  es: 'Resistencia elemental',    pt: 'Resistência elemental' } },
  82:  { key: 'fireRes',       group: 'resistance', labels: { en: 'Fire Resistance',    fr: 'Résistance Feu',            es: 'Resistencia al fuego',     pt: 'Resistência a fogo' } },
  83:  { key: 'waterRes',      group: 'resistance', labels: { en: 'Water Resistance',   fr: 'Résistance Eau',            es: 'Resistencia al agua',      pt: 'Resistência a água' } },
  84:  { key: 'earthRes',      group: 'resistance', labels: { en: 'Earth Resistance',   fr: 'Résistance Terre',          es: 'Resistencia a la tierra',  pt: 'Resistência a terra' } },
  85:  { key: 'airRes',        group: 'resistance', labels: { en: 'Air Resistance',     fr: 'Résistance Air',            es: 'Resistencia al aire',      pt: 'Resistência a ar' } },
  1069:{ key: 'elemResN',      group: 'resistance', labels: { en: 'Resistance to {n} elements', fr: 'Résistance à {n} éléments', es: 'Resistencia a {n} elementos', pt: 'Resistência a {n} elementos' } },
  71:  { key: 'rearRes',       group: 'resistance', labels: { en: 'Rear Resistance',    fr: 'Résistance Dos',            es: 'Resistencia por la espalda', pt: 'Resistência pelas costas' } },
  988: { key: 'critRes',       group: 'resistance', labels: { en: 'Critical Resistance', fr: 'Résistance Critique',      es: 'Resistencia crítica',      pt: 'Resistência crítica' } },
};

// ─── Equipment slots ─────────────────────────────────────────────────────────
// Item types → builder slots, from equipmentItemTypes.json. Two-handed weapon
// types disable the second-weapon slot.

export type SlotKey =
  | 'HEAD' | 'NECK' | 'CHEST' | 'BACK' | 'SHOULDERS' | 'BELT' | 'LEGS'
  | 'RING_1' | 'RING_2' | 'FIRST_WEAPON' | 'SECOND_WEAPON'
  | 'ACCESSORY' | 'PET' | 'MOUNT';

/** Display order — matches the in-game paper doll reading order. */
export const SLOT_ORDER: SlotKey[] = [
  'HEAD', 'NECK', 'SHOULDERS', 'CHEST', 'BACK', 'BELT', 'LEGS',
  'RING_1', 'RING_2', 'FIRST_WEAPON', 'SECOND_WEAPON', 'ACCESSORY', 'PET', 'MOUNT',
];

export const SLOT_LABELS: Record<SlotKey, Record<Language, string>> = {
  HEAD:          { en: 'Helmet',      fr: 'Casque',        es: 'Casco',         pt: 'Capacete' },
  NECK:          { en: 'Amulet',      fr: 'Amulette',      es: 'Amuleto',       pt: 'Amuleto' },
  SHOULDERS:     { en: 'Epaulettes',  fr: 'Épaulettes',    es: 'Hombreras',     pt: 'Ombreiras' },
  CHEST:         { en: 'Breastplate', fr: 'Plastron',      es: 'Coraza',        pt: 'Peitoral' },
  BACK:          { en: 'Cloak',       fr: 'Cape',          es: 'Capa',          pt: 'Capa' },
  BELT:          { en: 'Belt',        fr: 'Ceinture',      es: 'Cinturón',      pt: 'Cinto' },
  LEGS:          { en: 'Boots',       fr: 'Bottes',        es: 'Botas',         pt: 'Botas' },
  RING_1:        { en: 'Ring 1',      fr: 'Anneau 1',      es: 'Anillo 1',      pt: 'Anel 1' },
  RING_2:        { en: 'Ring 2',      fr: 'Anneau 2',      es: 'Anillo 2',      pt: 'Anel 2' },
  FIRST_WEAPON:  { en: 'Weapon',      fr: 'Arme',          es: 'Arma',          pt: 'Arma' },
  SECOND_WEAPON: { en: 'Second hand', fr: 'Seconde main',  es: 'Segunda mano',  pt: 'Segunda mão' },
  ACCESSORY:     { en: 'Emblem',      fr: 'Emblème',       es: 'Emblema',       pt: 'Emblema' },
  PET:           { en: 'Pet',         fr: 'Familier',      es: 'Mascota',       pt: 'Mascote' },
  MOUNT:         { en: 'Mount',       fr: 'Monture',       es: 'Montura',       pt: 'Montaria' },
};

/** itemTypeId → slot the item goes into (rings handled separately). */
export const TYPE_TO_SLOT: Record<number, SlotKey> = {
  134: 'HEAD', 120: 'NECK', 138: 'SHOULDERS', 136: 'CHEST', 132: 'BACK',
  133: 'BELT', 119: 'LEGS',
  103: 'RING_1', // or RING_2 — the UI decides which ring slot
  101: 'FIRST_WEAPON', 108: 'FIRST_WEAPON', 110: 'FIRST_WEAPON', 111: 'FIRST_WEAPON',
  113: 'FIRST_WEAPON', 114: 'FIRST_WEAPON', 115: 'FIRST_WEAPON', 117: 'FIRST_WEAPON',
  219: 'FIRST_WEAPON', 223: 'FIRST_WEAPON', 253: 'FIRST_WEAPON', 254: 'FIRST_WEAPON',
  518: 'FIRST_WEAPON', 519: 'FIRST_WEAPON',
  112: 'SECOND_WEAPON', 189: 'SECOND_WEAPON', 520: 'SECOND_WEAPON',
  480: 'ACCESSORY', 537: 'ACCESSORY', 646: 'ACCESSORY',
  582: 'PET', 849: 'PET', 611: 'MOUNT',
};

/** Weapon types that occupy both hands (disable SECOND_WEAPON). */
export const TWO_HANDED_TYPES = new Set([101, 111, 114, 117, 223, 253, 519]);

/** Weapon type display names (for search filters / item cards). */
export const WEAPON_TYPE_LABELS: Record<number, Record<Language, string>> = {
  101: { en: 'Axe (2H)',    fr: 'Hache (2M)',    es: 'Hacha (2M)',    pt: 'Machado (2M)' },
  108: { en: 'Wand (1H)',   fr: 'Baguette (1M)', es: 'Varita (1M)',   pt: 'Varinha (1M)' },
  110: { en: 'Sword (1H)',  fr: 'Épée (1M)',     es: 'Espada (1M)',   pt: 'Espada (1M)' },
  111: { en: 'Shovel (2H)', fr: 'Pelle (2M)',    es: 'Pala (2M)',     pt: 'Pá (2M)' },
  112: { en: 'Dagger',      fr: 'Dague',         es: 'Daga',          pt: 'Adaga' },
  113: { en: 'Staff (1H)',  fr: 'Bâton (1M)',    es: 'Bastón (1M)',   pt: 'Bastão (1M)' },
  114: { en: 'Hammer (2H)', fr: 'Marteau (2M)',  es: 'Martillo (2M)', pt: 'Martelo (2M)' },
  115: { en: 'Needle (1H)', fr: 'Aiguille (1M)', es: 'Aguja (1M)',    pt: 'Agulha (1M)' },
  117: { en: 'Bow (2H)',    fr: 'Arc (2M)',      es: 'Arco (2M)',     pt: 'Arco (2M)' },
  189: { en: 'Shield',      fr: 'Bouclier',      es: 'Escudo',        pt: 'Escudo' },
  219: { en: 'Fist',        fr: 'Poing',         es: 'Puño',          pt: 'Punho' },
  223: { en: 'Sword (2H)',  fr: 'Épée (2M)',     es: 'Espada (2M)',   pt: 'Espada (2M)' },
  253: { en: 'Staff (2H)',  fr: 'Bâton (2M)',    es: 'Bastón (2M)',   pt: 'Bastão (2M)' },
  254: { en: 'Cards (1H)',  fr: 'Cartes (1M)',   es: 'Cartas (1M)',   pt: 'Cartas (1M)' },
};

/** Rarity id → display info (same scale used by the Items Craft Guide). */
export const RARITY_INFO: Record<number, { labels: Record<Language, string>; className: string }> = {
  1: { labels: { en: 'Unusual',   fr: 'Inhabituel', es: 'Inusual',    pt: 'Incomum' },    className: 'text-zinc-300' },
  2: { labels: { en: 'Rare',      fr: 'Rare',       es: 'Raro',       pt: 'Raro' },       className: 'text-emerald-300' },
  3: { labels: { en: 'Mythical',  fr: 'Mythique',   es: 'Mítico',     pt: 'Mítico' },     className: 'text-orange-300' },
  4: { labels: { en: 'Legendary', fr: 'Légendaire', es: 'Legendario', pt: 'Lendário' },   className: 'text-yellow-300' },
  5: { labels: { en: 'Relic',     fr: 'Relique',    es: 'Reliquia',   pt: 'Relíquia' },   className: 'text-violet-300' },
  6: { labels: { en: 'Souvenir',  fr: 'Souvenir',   es: 'Recuerdo',   pt: 'Suvenir' },    className: 'text-sky-300' },
  7: { labels: { en: 'Epic',      fr: 'Épique',     es: 'Épico',      pt: 'Épico' },      className: 'text-pink-300' },
};
