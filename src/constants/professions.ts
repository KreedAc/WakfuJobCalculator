import type { Language } from './translations';

export const PROFESSION_IDS = [
  'Armorer',
  'Baker',
  'Chef',
  'Handyman',
  'Jeweler',
  'Leather Dealer',
  'Tailor',
  'Weapons Master'
] as const;

export type ProfessionId = typeof PROFESSION_IDS[number];

export const PROFESSION_NAMES: Record<Language, Record<ProfessionId, string>> = {
  en: {
    'Armorer': 'Armorer',
    'Baker': 'Baker',
    'Chef': 'Chef',
    'Handyman': 'Handyman',
    'Jeweler': 'Jeweler',
    'Leather Dealer': 'Leather Dealer',
    'Tailor': 'Tailor',
    'Weapons Master': 'Weapons Master'
  },
  fr: {
    'Armorer': 'Armurier',
    'Baker': 'Boulanger',
    'Chef': 'Cuisinier',
    'Handyman': 'Bricoleur',
    'Jeweler': 'Bijoutier',
    'Leather Dealer': 'Maroquinier',
    'Tailor': 'Tailleur',
    'Weapons Master': "Maître d'armes"
  },
  es: {
    'Armorer': 'Armero',
    'Baker': 'Panadero',
    'Chef': 'Cocinero',
    'Handyman': 'Ebanista',
    'Jeweler': 'Joyero',
    'Leather Dealer': 'Peletero',
    'Tailor': 'Sastre',
    'Weapons Master': 'Maestro de armas'
  }
};

export const PROFESSION_RECIPES: Record<Language, Record<ProfessionId, string>> = {
  en: {
    'Weapons Master': 'Handle',
    'Handyman': 'Bracket',
    'Baker': 'Oil',
    'Chef': 'Spice',
    'Armorer': 'Plate',
    'Jeweler': 'Gem',
    'Leather Dealer': 'Leather',
    'Tailor': 'Fiber'
  },
  fr: {
    'Weapons Master': 'Manche',
    'Handyman': 'Equerre',
    'Baker': 'Huile',
    'Chef': 'Epice',
    'Armorer': 'Plaque',
    'Jeweler': 'Gemme',
    'Leather Dealer': 'Cuir',
    'Tailor': 'Fibre'
  },
  es: {
    'Weapons Master': 'Mango',
    'Handyman': 'Escuadrita',
    'Baker': 'Aceite',
    'Chef': 'Especia',
    'Armorer': 'Placa',
    'Jeweler': 'Gema',
    'Leather Dealer': 'Cuero',
    'Tailor': 'Fibra'
  }
};
