// Copy for the app shell (sidebar, top bar, tab bar, search, footer) and the
// Home page, in every supported language.
import type { Language } from '../constants/translations';

export type NavId = 'home' | 'xp' | 'craft' | 'subli' | 'combat' | 'treasures' | 'guides';
export type NavGroupId = 'crafting' | 'equipment' | 'explore';

interface ShellCopy {
  nav: Record<NavId, string>;
  tabs: Record<'home' | 'xp' | 'subli' | 'craft' | 'more', string>;
  groups: Record<NavGroupId, string>;
  soon: string;
  newBadge: string;
  menu: string;
  close: string;
  searchPlaceholder: string;
  searchShort: string;
  searchHint: string;
  searchEmpty: string;
  searchLoading: string;
  searchGroups: { tools: string; professions: string; sublimations: string; items: string };
  theme: { light: string; dark: string; toggle: string };
  language: string;
  footer: {
    disclaimer: string;
    about: string;
    changelog: string;
    contact: string;
    privacy: string;
    terms: string;
    cookies: string;
    legal: string;
    madeBy: string;
    visitors: (n: string) => string;
    today: (n: string) => string;
  };
  home: {
    title: string;
    description: string;
    eyebrow: (version: string) => string;
    heroTitle: string;
    heroText: string;
    heroSearch: string;
    hints: { label: string; to: string }[];
    whatsNew: string;
    allChanges: string;
    tools: string;
    usedAgo: (when: string) => string;
    toolText: Record<Exclude<NavId, 'home'>, { desc: string; meta: string }>;
  };
}

const en: ShellCopy = {
  nav: {
    home: 'Home', xp: 'XP Calculator', craft: 'Craft Guide', subli: 'Sublimations',
    combat: 'Combat Calculator', treasures: 'Treasures', guides: 'Guides',
  },
  tabs: { home: 'Home', xp: 'XP', subli: 'Sublis', craft: 'Craft', more: 'More' },
  groups: { crafting: 'Crafting', equipment: 'Equipment & combat', explore: 'Explore' },
  soon: 'Soon',
  newBadge: 'New',
  menu: 'Menu',
  close: 'Close',
  searchPlaceholder: 'Search items, sublimations, professions…',
  searchShort: 'Search',
  searchHint: 'Type at least 2 letters. ↑↓ to move, Enter to open.',
  searchEmpty: 'No results.',
  searchLoading: 'Loading items…',
  searchGroups: { tools: 'Tools', professions: 'Professions', sublimations: 'Sublimations', items: 'Craftable items' },
  theme: { light: 'Light theme', dark: 'Dark theme', toggle: 'Switch theme' },
  language: 'Language',
  footer: {
    disclaimer: 'WAKFU is an MMORPG published by Ankama. Wakfu Job Calculator is an unofficial fan site with no connection to Ankama.',
    about: 'About', changelog: 'Changelog', contact: 'Contact',
    privacy: 'Privacy', terms: 'Terms', cookies: 'Cookies', legal: 'Disclaimer',
    madeBy: 'Made by KreedAc and LadyKreedAc',
    visitors: (n) => `${n} visitors`,
    today: (n) => `${n} today`,
  },
  home: {
    title: 'Free Wakfu Tools',
    description: 'Every Wakfu tool in one place: profession XP calculator, sublimations, item craft guide, combat calculator and treasures. Free, in 4 languages.',
    eyebrow: (v) => `Game data updated to ${v}`,
    heroTitle: 'Every Wakfu tool,\nin one place.',
    heroText: 'Plan your crafts, find sublimations and optimise your fights. Free, fast, in 4 languages.',
    heroSearch: 'Try “Armorer”, or any item or sublimation name',
    hints: [
      { label: 'Armorer XP', to: '/xp-calculator?profession=Armorer' },
      { label: 'Epic sublimations', to: '/sublimations?category=epic' },
      { label: 'Damage formula', to: '/combat-calc' },
    ],
    whatsNew: 'What’s new',
    allChanges: 'All changes',
    tools: 'Tools',
    usedAgo: (w) => `Used ${w}`,
    toolText: {
      xp: { desc: 'How many crafts you need to reach your target profession level.', meta: '8 professions' },
      craft: { desc: 'Full recipe tree and a shopping list for any craftable item.', meta: '5,400+ recipes' },
      subli: { desc: 'Every sublimation with its effects, filtered by socket colors.', meta: 'Official data' },
      combat: { desc: 'Damage, heals, armor and resistances, with the real formulas.', meta: '10 calculators' },
      treasures: { desc: 'Hunt locations, artifacts and rewards, with your progress saved.', meta: 'Tracks progress' },
      guides: { desc: 'Beginner professions guide and the complete sublimations guide.', meta: '2 guides' },
    },
  },
};

const fr: ShellCopy = {
  nav: {
    home: 'Accueil', xp: 'Calculateur XP', craft: 'Guide de craft', subli: 'Sublimations',
    combat: 'Calculateur de combat', treasures: 'Trésors', guides: 'Guides',
  },
  tabs: { home: 'Accueil', xp: 'XP', subli: 'Sublis', craft: 'Craft', more: 'Plus' },
  groups: { crafting: 'Artisanat', equipment: 'Équipement & combat', explore: 'Explorer' },
  soon: 'Bientôt',
  newBadge: 'Nouveau',
  menu: 'Menu',
  close: 'Fermer',
  searchPlaceholder: 'Rechercher objets, sublimations, métiers…',
  searchShort: 'Rechercher',
  searchHint: 'Tapez au moins 2 lettres. ↑↓ pour naviguer, Entrée pour ouvrir.',
  searchEmpty: 'Aucun résultat.',
  searchLoading: 'Chargement des objets…',
  searchGroups: { tools: 'Outils', professions: 'Métiers', sublimations: 'Sublimations', items: 'Objets craftables' },
  theme: { light: 'Thème clair', dark: 'Thème sombre', toggle: 'Changer de thème' },
  language: 'Langue',
  footer: {
    disclaimer: "WAKFU est un MMORPG édité par Ankama. Wakfu Job Calculator est un site de fans non officiel, sans lien avec Ankama.",
    about: 'À propos', changelog: 'Nouveautés', contact: 'Contact',
    privacy: 'Confidentialité', terms: 'Conditions', cookies: 'Cookies', legal: 'Avertissement',
    madeBy: 'Créé par KreedAc et LadyKreedAc',
    visitors: (n) => `${n} visiteurs`,
    today: (n) => `${n} aujourd'hui`,
  },
  home: {
    title: 'Outils Wakfu gratuits',
    description: "Tous les outils Wakfu au même endroit : calculateur d'XP des métiers, sublimations, guide de craft, calculateur de combat et trésors. Gratuit, en 4 langues.",
    eyebrow: (v) => `Données du jeu à jour : ${v}`,
    heroTitle: 'Tous les outils Wakfu,\nau même endroit.',
    heroText: 'Planifiez vos crafts, trouvez vos sublimations et optimisez vos combats. Gratuit, rapide, en 4 langues.',
    heroSearch: "Essayez « Armurier », ou un nom d'objet ou de sublimation",
    hints: [
      { label: 'XP Armurier', to: '/xp-calculator?profession=Armorer' },
      { label: 'Sublimations épiques', to: '/sublimations?category=epic' },
      { label: 'Formule des dégâts', to: '/combat-calc' },
    ],
    whatsNew: 'Nouveautés',
    allChanges: 'Tout voir',
    tools: 'Outils',
    usedAgo: (w) => `Utilisé ${w}`,
    toolText: {
      xp: { desc: "Combien de crafts pour atteindre le niveau de métier visé.", meta: '8 métiers' },
      craft: { desc: "L'arbre complet des recettes et une liste de courses pour chaque objet.", meta: '5 400+ recettes' },
      subli: { desc: 'Toutes les sublimations et leurs effets, filtrées par couleur de châsse.', meta: 'Données officielles' },
      combat: { desc: 'Dégâts, soins, armure et résistances, avec les vraies formules.', meta: '10 calculateurs' },
      treasures: { desc: 'Emplacements, artefacts et récompenses, avec votre progression.', meta: 'Suit la progression' },
      guides: { desc: 'Guide des métiers pour débutants et guide complet des sublimations.', meta: '2 guides' },
    },
  },
};

const es: ShellCopy = {
  nav: {
    home: 'Inicio', xp: 'Calculadora XP', craft: 'Guía de crafteo', subli: 'Sublimaciones',
    combat: 'Calculadora de combate', treasures: 'Tesoros', guides: 'Guías',
  },
  tabs: { home: 'Inicio', xp: 'XP', subli: 'Sublis', craft: 'Craft', more: 'Más' },
  groups: { crafting: 'Artesanía', equipment: 'Equipo y combate', explore: 'Explorar' },
  soon: 'Pronto',
  newBadge: 'Nuevo',
  menu: 'Menú',
  close: 'Cerrar',
  searchPlaceholder: 'Buscar objetos, sublimaciones, oficios…',
  searchShort: 'Buscar',
  searchHint: 'Escribe al menos 2 letras. ↑↓ para moverte, Intro para abrir.',
  searchEmpty: 'Sin resultados.',
  searchLoading: 'Cargando objetos…',
  searchGroups: { tools: 'Herramientas', professions: 'Oficios', sublimations: 'Sublimaciones', items: 'Objetos fabricables' },
  theme: { light: 'Tema claro', dark: 'Tema oscuro', toggle: 'Cambiar tema' },
  language: 'Idioma',
  footer: {
    disclaimer: 'WAKFU es un MMORPG publicado por Ankama. Wakfu Job Calculator es un sitio de fans no oficial, sin relación con Ankama.',
    about: 'Acerca de', changelog: 'Novedades', contact: 'Contacto',
    privacy: 'Privacidad', terms: 'Términos', cookies: 'Cookies', legal: 'Aviso legal',
    madeBy: 'Creado por KreedAc y LadyKreedAc',
    visitors: (n) => `${n} visitantes`,
    today: (n) => `${n} hoy`,
  },
  home: {
    title: 'Herramientas gratis para Wakfu',
    description: 'Todas las herramientas de Wakfu en un solo lugar: calculadora de XP de oficios, sublimaciones, guía de crafteo, calculadora de combate y tesoros. Gratis, en 4 idiomas.',
    eyebrow: (v) => `Datos del juego actualizados: ${v}`,
    heroTitle: 'Todas las herramientas de Wakfu,\nen un solo lugar.',
    heroText: 'Planifica tus crafteos, encuentra sublimaciones y optimiza tus combates. Gratis, rápido, en 4 idiomas.',
    heroSearch: 'Prueba «Armero», o el nombre de un objeto o sublimación',
    hints: [
      { label: 'XP Armero', to: '/xp-calculator?profession=Armorer' },
      { label: 'Sublimaciones épicas', to: '/sublimations?category=epic' },
      { label: 'Fórmula de daño', to: '/combat-calc' },
    ],
    whatsNew: 'Novedades',
    allChanges: 'Ver todo',
    tools: 'Herramientas',
    usedAgo: (w) => `Usada ${w}`,
    toolText: {
      xp: { desc: 'Cuántos crafteos necesitas para llegar al nivel de oficio que buscas.', meta: '8 oficios' },
      craft: { desc: 'El árbol completo de recetas y una lista de compra para cada objeto.', meta: '5.400+ recetas' },
      subli: { desc: 'Todas las sublimaciones con sus efectos, filtradas por color de engarce.', meta: 'Datos oficiales' },
      combat: { desc: 'Daño, curas, armadura y resistencias, con las fórmulas reales.', meta: '10 calculadoras' },
      treasures: { desc: 'Ubicaciones, artefactos y recompensas, con tu progreso guardado.', meta: 'Guarda el progreso' },
      guides: { desc: 'Guía de oficios para principiantes y guía completa de sublimaciones.', meta: '2 guías' },
    },
  },
};

const pt: ShellCopy = {
  nav: {
    home: 'Início', xp: 'Calculadora XP', craft: 'Guia de crafting', subli: 'Sublimações',
    combat: 'Calculadora de combate', treasures: 'Tesouros', guides: 'Guias',
  },
  tabs: { home: 'Início', xp: 'XP', subli: 'Sublis', craft: 'Craft', more: 'Mais' },
  groups: { crafting: 'Artesanato', equipment: 'Equipamento e combate', explore: 'Explorar' },
  soon: 'Em breve',
  newBadge: 'Novo',
  menu: 'Menu',
  close: 'Fechar',
  searchPlaceholder: 'Buscar itens, sublimações, profissões…',
  searchShort: 'Buscar',
  searchHint: 'Digite pelo menos 2 letras. ↑↓ para navegar, Enter para abrir.',
  searchEmpty: 'Nenhum resultado.',
  searchLoading: 'Carregando itens…',
  searchGroups: { tools: 'Ferramentas', professions: 'Profissões', sublimations: 'Sublimações', items: 'Itens fabricáveis' },
  theme: { light: 'Tema claro', dark: 'Tema escuro', toggle: 'Mudar tema' },
  language: 'Idioma',
  footer: {
    disclaimer: 'WAKFU é um MMORPG publicado pela Ankama. Wakfu Job Calculator é um site de fãs não oficial, sem relação com a Ankama.',
    about: 'Sobre', changelog: 'Novidades', contact: 'Contato',
    privacy: 'Privacidade', terms: 'Termos', cookies: 'Cookies', legal: 'Aviso legal',
    madeBy: 'Criado por KreedAc e LadyKreedAc',
    visitors: (n) => `${n} visitantes`,
    today: (n) => `${n} hoje`,
  },
  home: {
    title: 'Ferramentas grátis para Wakfu',
    description: 'Todas as ferramentas de Wakfu em um só lugar: calculadora de XP de profissões, sublimações, guia de crafting, calculadora de combate e tesouros. Grátis, em 4 idiomas.',
    eyebrow: (v) => `Dados do jogo atualizados: ${v}`,
    heroTitle: 'Todas as ferramentas de Wakfu,\nem um só lugar.',
    heroText: 'Planeje seus crafts, encontre sublimações e otimize seus combates. Grátis, rápido, em 4 idiomas.',
    heroSearch: 'Experimente “Armeiro”, ou o nome de um item ou sublimação',
    hints: [
      { label: 'XP Armeiro', to: '/xp-calculator?profession=Armorer' },
      { label: 'Sublimações épicas', to: '/sublimations?category=epic' },
      { label: 'Fórmula de dano', to: '/combat-calc' },
    ],
    whatsNew: 'Novidades',
    allChanges: 'Ver tudo',
    tools: 'Ferramentas',
    usedAgo: (w) => `Usada ${w}`,
    toolText: {
      xp: { desc: 'Quantos crafts você precisa para chegar ao nível de profissão desejado.', meta: '8 profissões' },
      craft: { desc: 'A árvore completa de receitas e uma lista de compras para cada item.', meta: '5.400+ receitas' },
      subli: { desc: 'Todas as sublimações com seus efeitos, filtradas pela cor dos engastes.', meta: 'Dados oficiais' },
      combat: { desc: 'Dano, curas, armadura e resistências, com as fórmulas reais.', meta: '10 calculadoras' },
      treasures: { desc: 'Locais, artefatos e recompensas, com seu progresso salvo.', meta: 'Salva o progresso' },
      guides: { desc: 'Guia de profissões para iniciantes e guia completo de sublimações.', meta: '2 guias' },
    },
  },
};

export const SHELL: Record<Language, ShellCopy> = { en, fr, es, pt };
