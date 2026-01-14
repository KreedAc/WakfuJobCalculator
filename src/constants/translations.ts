export const FLAGS = {
  en: '🇬🇧',
  fr: '🇫🇷',
  es: '🇪🇸'
} as const;

export type Language = keyof typeof FLAGS;

export const TRANSLATIONS = {
  en: {
    title: 'Wakfu Crafting XP Calculator',
    subtitle: 'Select your profession, choose a level range, and enter the EXP per crafted item.',
    selectProfession: 'Select Profession',
    selectRange: 'Select Level Range',
    recipe: 'Recipe',
    expPerItem: 'EXP per Crafted Item',
    expPlaceholder: 'e.g. 150',
    calculate: 'Calculate Required Crafts',
    resultsFor: 'Results for',
    firstResource: 'Collect the first resource quantity:',
    secondResource: 'Collect the second resource quantity:',
    craftsNeeded: 'Crafts Needed',
    xpDiff: 'XP Difference',
    alert: 'Please fill all fields and select a profession and level range.',
    recipeName: 'Recipe Name',
    createdBy: 'Created by',
    langLabel: 'Language',
    navCalc: 'XP Calculator',
    navSubli: 'Sublimations',
    navItemsCraft: 'Items Craft Guide'
  },
  fr: {
    title: 'Calculateur d\'XP d\'Artisanat Wakfu',
    subtitle: 'Choisissez votre métier, une tranche de niveaux, puis saisissez l\'XP par objet fabriqué.',
    selectProfession: 'Sélectionner un métier',
    selectRange: 'Sélectionner une tranche de niveaux',
    recipe: 'Recette',
    expPerItem: 'XP par objet fabriqué',
    expPlaceholder: 'ex. 150',
    calculate: 'Calculer le nombre de fabrications',
    resultsFor: 'Résultats pour',
    firstResource: 'Quantité du premier matériau à collecter :',
    secondResource: 'Quantité du deuxième matériau à collecter :',
    craftsNeeded: 'Fabrications nécessaires',
    xpDiff: 'Différence d\'XP',
    alert: 'Veuillez remplir tous les champs et sélectionner un métier et une tranche de niveaux.',
    recipeName: 'Nom de la recette',
    createdBy: 'Créé par',
    langLabel: 'Langue',
    navCalc: 'Calculateur XP',
    navSubli: 'Sublimations',
    navItemsCraft: 'Guide de Craft d\'Objets'
  },
  es: {
    title: 'Calculadora de XP de Artesanía de Wakfu',
    subtitle: 'Elige tu profesión, un rango de niveles e introduce la XP por objeto creado.',
    selectProfession: 'Seleccionar profesión',
    selectRange: 'Seleccionar rango de niveles',
    recipe: 'Receta',
    expPerItem: 'XP por objeto creado',
    expPlaceholder: 'p. ej., 150',
    calculate: 'Calcular creaciones necesarias',
    resultsFor: 'Resultados para',
    firstResource: 'Cantidad del primer recurso a recolectar:',
    secondResource: 'Cantidad del segundo recurso a recolectar:',
    craftsNeeded: 'Creaciones necesarias',
    xpDiff: 'Diferencia de XP',
    alert: 'Por favor, completa todos los campos y selecciona una profesión y un rango de niveles.',
    recipeName: 'Nombre de la receta',
    createdBy: 'Creado por',
    langLabel: 'Idioma',
    navCalc: 'Calculadora XP',
    navSubli: 'Sublimaciones',
    navItemsCraft: 'Guía de Craft de Objetos'
  }
} as const;
