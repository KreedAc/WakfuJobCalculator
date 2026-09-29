// Extra copy for the redesigned XP Calculator, in every supported language.
// (Titles and "how it works" text stay in constants/translations.ts.)
import type { Language } from '../constants/translations';

const en = {
  stepProfession: 'Choose your profession',
  stepRange: 'Choose the level range',
  stepXp: 'XP per craft',
  xpHelp: 'Shown in the recipe tooltip in game.',
  recipe: 'Leveling recipe',
  crafts: 'Crafts needed',
  craftsUnit: 'crafts',
  live: 'Live',
  empty: 'Choose a profession, a level range and your XP per craft: the result appears here.',
  resource1: 'Resource 1',
  resource2: 'Resource 2',
  perCraft: (n: number) => `${n} per craft`,
  xpToGain: 'XP to gain',
  level: 'Lvl',
  share: 'Share',
  reset: 'Reset',
  linkCopied: 'Link copied!',
  seeResult: 'Details',
  shoppingList: 'Shopping list for these crafts',
  shoppingListHelp: 'Opens the recipe in the Craft Guide with every ingredient you need to farm.',
};

export type XpCopy = typeof en;

const fr: XpCopy = {
  stepProfession: 'Choisissez votre métier',
  stepRange: 'Choisissez la tranche de niveaux',
  stepXp: 'XP par craft',
  xpHelp: "Indiquée dans l'infobulle de la recette en jeu.",
  recipe: 'Recette pour monter',
  crafts: 'Crafts nécessaires',
  craftsUnit: 'crafts',
  live: 'En direct',
  empty: 'Choisissez un métier, une tranche de niveaux et votre XP par craft : le résultat apparaît ici.',
  resource1: 'Ressource 1',
  resource2: 'Ressource 2',
  perCraft: (n) => `${n} par craft`,
  xpToGain: 'XP à gagner',
  level: 'Niv.',
  share: 'Partager',
  reset: 'Réinitialiser',
  linkCopied: 'Lien copié !',
  seeResult: 'Détails',
  shoppingList: 'Liste de courses pour ces crafts',
  shoppingListHelp: 'Ouvre la recette dans le Guide de craft avec tous les ingrédients à récolter.',
};

const es: XpCopy = {
  stepProfession: 'Elige tu oficio',
  stepRange: 'Elige el rango de niveles',
  stepXp: 'XP por crafteo',
  xpHelp: 'Aparece en la descripción de la receta en el juego.',
  recipe: 'Receta para subir',
  crafts: 'Crafteos necesarios',
  craftsUnit: 'crafteos',
  live: 'En directo',
  empty: 'Elige un oficio, un rango de niveles y tu XP por crafteo: el resultado aparece aquí.',
  resource1: 'Recurso 1',
  resource2: 'Recurso 2',
  perCraft: (n) => `${n} por crafteo`,
  xpToGain: 'XP a ganar',
  level: 'Nv.',
  share: 'Compartir',
  reset: 'Reiniciar',
  linkCopied: '¡Enlace copiado!',
  seeResult: 'Detalles',
  shoppingList: 'Lista de compras para estos crafteos',
  shoppingListHelp: 'Abre la receta en la Guía de crafteo con todos los ingredientes que necesitas recolectar.',
};

const pt: XpCopy = {
  stepProfession: 'Escolha sua profissão',
  stepRange: 'Escolha a faixa de níveis',
  stepXp: 'XP por craft',
  xpHelp: 'Aparece na descrição da receita no jogo.',
  recipe: 'Receita para upar',
  crafts: 'Crafts necessários',
  craftsUnit: 'crafts',
  live: 'Ao vivo',
  empty: 'Escolha uma profissão, uma faixa de níveis e seu XP por craft: o resultado aparece aqui.',
  resource1: 'Recurso 1',
  resource2: 'Recurso 2',
  perCraft: (n) => `${n} por craft`,
  xpToGain: 'XP a ganhar',
  level: 'Nv.',
  share: 'Compartilhar',
  reset: 'Redefinir',
  linkCopied: 'Link copiado!',
  seeResult: 'Detalhes',
  shoppingList: 'Lista de compras para esses crafts',
  shoppingListHelp: 'Abre a receita no Guia de craft com todos os ingredientes que você precisa coletar.',
};

export const XP_T: Record<Language, XpCopy> = { en, fr, es, pt };
