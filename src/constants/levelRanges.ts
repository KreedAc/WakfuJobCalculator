import type { Language } from './translations';

export interface LevelRange {
  range: string;
  expDiff: number;
  recipe: Record<Language, string>;
}

export const LEVEL_RANGES: LevelRange[] = [
  { range: '2 - 10', expDiff: 7500, recipe: { en: 'Coarse', fr: 'Grossière', es: 'Tosca' } },
  { range: '10 - 20', expDiff: 22500, recipe: { en: 'Basic', fr: 'Rudimentaire', es: 'Rudimentaria' } },
  { range: '20 - 30', expDiff: 37500, recipe: { en: 'Imperfect', fr: 'Imparfait', es: 'Imperfecta' } },
  { range: '30 - 40', expDiff: 52500, recipe: { en: 'Fragile', fr: 'Fragile', es: 'Frágil' } },
  { range: '40 - 50', expDiff: 67500, recipe: { en: 'Rustic', fr: 'Rustique', es: 'Rústica' } },
  { range: '50 - 60', expDiff: 82500, recipe: { en: 'Raw', fr: 'Brut', es: 'Bruta' } },
  { range: '60 - 70', expDiff: 97500, recipe: { en: 'Solid', fr: 'Solide', es: 'Sólida' } },
  { range: '70 - 80', expDiff: 112500, recipe: { en: 'Durable', fr: 'Durable', es: 'Duradera' } },
  { range: '80 - 90', expDiff: 127500, recipe: { en: 'Refined', fr: 'Raffiné', es: 'Refinada' } },
  { range: '90 - 100', expDiff: 142500, recipe: { en: 'Precious', fr: 'Précieux', es: 'Preciosa' } },
  { range: '100 - 110', expDiff: 157500, recipe: { en: 'Exquisite', fr: 'Exquis', es: 'Exquisita' } },
  { range: '110 - 120', expDiff: 172500, recipe: { en: 'Mystical', fr: 'Mystique', es: 'Mistica' } },
  { range: '120 - 130', expDiff: 187500, recipe: { en: 'Eternal', fr: 'Eternel', es: 'Eterna' } },
  { range: '130 - 140', expDiff: 202500, recipe: { en: 'Divine', fr: 'Divin', es: 'Divina' } },
  { range: '140 - 150', expDiff: 217500, recipe: { en: 'Infernal', fr: 'Infernal', es: 'Infernal' } },
  { range: '150 - 160', expDiff: 232500, recipe: { en: 'Ancestral', fr: 'Ancestral', es: 'Ancestral' } }
];
