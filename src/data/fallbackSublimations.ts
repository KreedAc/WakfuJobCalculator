export interface SublimationValue {
  base: number;
  increment: number;
  placeholder: string;
}

export interface Sublimation {
  name: string;
  colors: string[];
  description: string;
  rarity: string[];
  effect: string;
  maxLevel: number;
  minLevel: number;
  step: number;
  obtenation: {
    name: string;
    localIcon: string;
  };
  category: string;
  values: SublimationValue[];
}

export const FALLBACK_SUBLIMATIONS: Sublimation[] = [
  {
    name: "Influence",
    colors: ["G", "B", "G"],
    description: "[X]% Critical Hit",
    rarity: ["Rare", "Mythic", "Legendary"],
    effect: "Per additional level: +3% Critical hit",
    maxLevel: 6,
    minLevel: 1,
    step: 1,
    obtenation: { name: "Runic Mimic", localIcon: "./icons/runic.png" },
    category: "Offensive",
    values: [{ base: 3, increment: 3, placeholder: "X" }]
  },
  {
    name: "Save",
    colors: ["B", "R", "R"],
    description: "At end of turn: Unused AP are carried over to the next turn Max [X] AP",
    rarity: ["Mythic"],
    effect: "Per additional 2 levels: +1 AP max",
    maxLevel: 6,
    minLevel: 2,
    step: 2,
    obtenation: { name: "Or'Hodruin Dungeon", localIcon: "./icons/sorhon.png" },
    category: "Stats Increase",
    values: [{ base: 1, increment: 1, placeholder: "X" }]
  }
];
