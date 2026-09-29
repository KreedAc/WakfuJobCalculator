// Search result title and description of the main pages, in every language.
// Written around what players actually search for ("wakfu craft calculator",
// "calculateur métier wakfu", "wakfu sublimation list"…); page headings stay
// in the page copy files.
import type { Language } from '../constants/translations';

export type SeoPage = 'home' | 'xp' | 'craft' | 'sublimations' | 'combat' | 'treasures';

export const SEO: Record<Language, Record<SeoPage, { title: string; description: string }>> = {
  en: {
    home: {
      title: 'Wakfu Job Calculator – Free Wakfu Profession & Craft Tools',
      description: 'Every Wakfu tool in one place: profession XP calculator, craft calculator with shopping list, sublimations list, combat calculator and treasure hunts. Free, in 4 languages.',
    },
    xp: {
      title: 'Wakfu XP Calculator – Crafts Needed per Profession Level',
      description: 'Free Wakfu profession XP calculator: pick your job (Armorer, Baker, Chef, Tailor…), the level range and your XP per craft to see how many crafts and resources you need to level up.',
    },
    craft: {
      title: 'Wakfu Craft Calculator – Recipes & Shopping List',
      description: 'Wakfu crafting calculator: search 5,000+ craftable items, see the full recipe tree and get one shopping list with every resource for all the items you want to craft.',
    },
    sublimations: {
      title: 'Wakfu Sublimations List – All Effects & Socket Colors',
      description: "Complete list of Wakfu sublimations with their effects per level, rarity, socket colors and where to get them. Filter by category (Epic, Relic…) or by your item's sockets.",
    },
    combat: {
      title: 'Wakfu Damage Calculator – Combat Formulas',
      description: 'Wakfu combat calculator: damage, heals, armor, resistances, effective HP, lock and Force of Will, with the real game formulas.',
    },
    treasures: {
      title: 'Wakfu Treasure Hunts – Locations, Coordinates & Rewards',
      description: 'Every Wakfu treasure hunt achievement with zone, map coordinates, required artifacts and rewards (XP, kamas, items). Tick the ones you found: your progress is saved.',
    },
  },
  fr: {
    home: {
      title: 'Wakfu Job Calculator – Outils gratuits métiers et craft Wakfu',
      description: "Tous les outils Wakfu au même endroit : calculateur d'XP des métiers, calculateur de craft avec liste de courses, liste des sublimations, calculateur de combat et chasses au trésor. Gratuit.",
    },
    xp: {
      title: 'Calculateur métier Wakfu – Crafts nécessaires par niveau',
      description: "Calculateur d'XP des métiers Wakfu gratuit : choisissez votre métier (Armurier, Boulanger, Cuisinier, Tailleur…), la tranche de niveaux et l'XP par craft pour savoir combien de crafts et de ressources il vous faut.",
    },
    craft: {
      title: 'Calculateur de craft Wakfu – Recettes et liste de courses',
      description: "Calculateur de craft Wakfu : cherchez parmi plus de 5 000 objets craftables, voyez l'arbre complet des recettes et obtenez une liste de courses avec toutes les ressources.",
    },
    sublimations: {
      title: 'Sublimations Wakfu – Liste complète, effets et châsses',
      description: 'Liste complète des sublimations Wakfu : effets par niveau, rareté, couleurs des châsses et où les obtenir. Filtrez par catégorie (Épique, Relique…) ou par les châsses de votre objet.',
    },
    combat: {
      title: 'Calculateur de dégâts Wakfu – Formules de combat',
      description: 'Calculateur de combat Wakfu : dégâts, soins, armure, résistances, PV effectifs, tacle et volonté, avec les vraies formules du jeu.',
    },
    treasures: {
      title: 'Chasses au trésor Wakfu – Positions, coordonnées et récompenses',
      description: 'Tous les succès de chasse au trésor de Wakfu avec zone, coordonnées, artefacts nécessaires et récompenses (XP, kamas, objets). Cochez ceux trouvés : votre progression est sauvegardée.',
    },
  },
  es: {
    home: {
      title: 'Wakfu Job Calculator – Herramientas de oficios y crafteo',
      description: 'Todas las herramientas de Wakfu en un solo lugar: calculadora de XP de oficios, calculadora de crafteo con lista de compras, lista de sublimaciones, calculadora de combate y tesoros. Gratis.',
    },
    xp: {
      title: 'Calculadora de oficios Wakfu – Crafteos por nivel',
      description: 'Calculadora de XP de oficios de Wakfu gratis: elige tu oficio (Armero, Panadero, Cocinero, Sastre…), el rango de niveles y tu XP por crafteo para saber cuántos crafteos y recursos necesitas.',
    },
    craft: {
      title: 'Calculadora de crafteo Wakfu – Recetas y lista de compras',
      description: 'Calculadora de crafteo de Wakfu: busca entre más de 5000 objetos fabricables, mira el árbol completo de recetas y obtén una lista de compras con todos los recursos.',
    },
    sublimations: {
      title: 'Sublimaciones Wakfu – Lista completa, efectos y engarces',
      description: 'Lista completa de sublimaciones de Wakfu: efectos por nivel, rareza, colores de los engarces y dónde conseguirlas. Filtra por categoría (Épica, Reliquia…) o por los engarces de tu objeto.',
    },
    combat: {
      title: 'Calculadora de daño Wakfu – Fórmulas de combate',
      description: 'Calculadora de combate de Wakfu: daño, curas, armadura, resistencias, PdV efectivos, placaje y voluntad, con las fórmulas reales del juego.',
    },
    treasures: {
      title: 'Tesoros de Wakfu – Ubicaciones, coordenadas y recompensas',
      description: 'Todos los logros de búsqueda del tesoro de Wakfu con zona, coordenadas, artefactos necesarios y recompensas (XP, kamas, objetos). Marca los que encontraste: tu progreso se guarda.',
    },
  },
  pt: {
    home: {
      title: 'Wakfu Job Calculator – Ferramentas de profissões e craft',
      description: 'Todas as ferramentas de Wakfu em um só lugar: calculadora de XP de profissões, calculadora de craft com lista de compras, lista de sublimações, calculadora de combate e tesouros. Grátis.',
    },
    xp: {
      title: 'Calculadora de profissões Wakfu – Crafts por nível',
      description: 'Calculadora de XP de profissões do Wakfu grátis: escolha sua profissão (Armeiro, Padeiro, Chef, Alfaiate…), a faixa de níveis e seu XP por craft para saber quantos crafts e recursos você precisa.',
    },
    craft: {
      title: 'Calculadora de craft Wakfu – Receitas e lista de compras',
      description: 'Calculadora de craft do Wakfu: busque entre mais de 5.000 itens fabricáveis, veja a árvore completa de receitas e obtenha uma lista de compras com todos os recursos.',
    },
    sublimations: {
      title: 'Sublimações Wakfu – Lista completa, efeitos e engastes',
      description: 'Lista completa de sublimações do Wakfu: efeitos por nível, raridade, cores dos engastes e onde conseguir. Filtre por categoria (Épica, Relíquia…) ou pelos engastes do seu item.',
    },
    combat: {
      title: 'Calculadora de dano Wakfu – Fórmulas de combate',
      description: 'Calculadora de combate do Wakfu: dano, curas, armadura, resistências, PV efetivos, bloqueio e força de vontade, com as fórmulas reais do jogo.',
    },
    treasures: {
      title: 'Tesouros de Wakfu – Locais, coordenadas e recompensas',
      description: 'Todas as conquistas de caça ao tesouro do Wakfu com zona, coordenadas, artefatos necessários e recompensas (XP, kamas, itens). Marque os que encontrou: seu progresso é salvo.',
    },
  },
};
