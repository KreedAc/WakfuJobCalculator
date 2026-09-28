// Page copy and release history for the Changelog page, in every supported language.
// Kept out of the component so text edits never touch layout code.
import type { Language } from '../constants/translations';

export type ChangeType = 'feature' | 'improvement' | 'fix' | 'update';

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: { type: ChangeType; text: Record<Language, string> }[];
}

export const changelogContent = {
  en: {
    title: 'Changelog',
    description: 'Track all updates, improvements and new features',
    comingSoon: 'More updates coming soon!',
    typeLabels: {
      feature: 'New Feature',
      improvement: 'Improvement',
      fix: 'Bug Fix',
      update: 'Update'
    }
  },
  fr: {
    title: 'Journal des modifications',
    description: 'Suivez toutes les mises à jour, améliorations et nouvelles fonctionnalités',
    comingSoon: 'Plus de mises à jour bientôt !',
    typeLabels: {
      feature: 'Nouvelle fonctionnalité',
      improvement: 'Amélioration',
      fix: 'Correction de bug',
      update: 'Mise à jour'
    }
  },
  es: {
    title: 'Registro de cambios',
    description: 'Sigue todas las actualizaciones, mejoras y nuevas características',
    comingSoon: '¡Más actualizaciones próximamente!',
    typeLabels: {
      feature: 'Nueva característica',
      improvement: 'Mejora',
      fix: 'Corrección de error',
      update: 'Actualización'
    }
  },
  pt: {
    title: 'Registro de alterações',
    description: 'Acompanhe todas as atualizações, melhorias e novos recursos',
    comingSoon: 'Mais atualizações em breve!',
    typeLabels: {
      feature: 'Novo recurso',
      improvement: 'Melhoria',
      fix: 'Correção de bug',
      update: 'Atualização'
    }
  }
};

export const changelog: ChangelogEntry[] = [
  {
    version: '2.4.0',
    date: '2026-09-28',
    changes: [
      { type: 'feature', text: {
        en: 'Builder: compare each item with the one you have equipped and sort by any stat',
        fr: "Créateur : comparez chaque objet avec celui équipé et triez par n'importe quelle stat",
        es: 'Creador: compara cada objeto con el equipado y ordena por cualquier estadística',
        pt: 'Criador: compare cada item com o equipado e ordene por qualquer estatística' } },
      { type: 'feature', text: {
        en: 'Builder: open the crafting list of your build in the Items Craft Guide, and share crafting lists with a link',
        fr: "Créateur : ouvrez la liste de craft de votre build dans le Guide de craft, et partagez vos listes par lien",
        es: 'Creador: abre la lista de crafteo de tu build en la Guía de crafteo y comparte listas con un enlace',
        pt: 'Criador: abra a lista de crafting da sua build no Guia de crafting e compartilhe listas com um link' } },
      { type: 'improvement', text: {
        en: 'New navigation on phones, with a full-screen menu',
        fr: 'Nouvelle navigation sur téléphone, avec un menu plein écran',
        es: 'Nueva navegación en el móvil, con un menú a pantalla completa',
        pt: 'Nova navegação no celular, com um menu em tela cheia' } },
      { type: 'feature', text: {
        en: 'The site can be installed as an app and works offline after a first visit',
        fr: "Le site peut être installé comme une application et fonctionne hors ligne après une première visite",
        es: 'El sitio se puede instalar como una aplicación y funciona sin conexión tras una primera visita',
        pt: 'O site pode ser instalado como um aplicativo e funciona offline após a primeira visita' } },
      { type: 'improvement', text: {
        en: 'Unified design across all pages and faster first page load',
        fr: 'Design unifié sur toutes les pages et premier chargement plus rapide',
        es: 'Diseño unificado en todas las páginas y primera carga más rápida',
        pt: 'Design unificado em todas as páginas e primeiro carregamento mais rápido' } },
      { type: 'fix', text: {
        en: 'Combat Calculator: Effective Masteries were off by a factor of 100',
        fr: 'Calculateur de combat : les Maîtrises effectives étaient fausses d\'un facteur 100',
        es: 'Calculadora de combate: los Dominios efectivos estaban desfasados por un factor de 100',
        pt: 'Calculadora de combate: os Domínios efetivos estavam errados por um fator de 100' } },
      { type: 'fix', text: {
        en: 'Combat Calculator: exact resistance values were rounded down (100 flat showed 19.9% instead of 20%)',
        fr: 'Calculateur de combat : les résistances exactes étaient arrondies à l\'inférieur (100 fixe affichait 19,9 % au lieu de 20 %)',
        es: 'Calculadora de combate: las resistencias exactas se redondeaban hacia abajo (100 fija mostraba 19,9 % en lugar de 20 %)',
        pt: 'Calculadora de combate: resistências exatas eram arredondadas para baixo (100 fixa mostrava 19,9% em vez de 20%)' } },
    ]
  },
  {
    version: '2.3.0',
    date: '2026-07-07',
    changes: [
      { type: 'feature', text: {
        en: 'Equipment Builder: over 7,900 official items, total stats, share your build with a link',
        fr: "Créateur d'équipement : plus de 7 900 objets officiels, stats totales, partage du build par lien",
        es: 'Creador de equipamiento: más de 7.900 objetos oficiales, estadísticas totales, comparte tu build con un enlace',
        pt: 'Criador de equipamento: mais de 7.900 itens oficiais, estatísticas totais, compartilhe sua build com um link' } },
      { type: 'feature', text: {
        en: 'Save your builds on your device',
        fr: 'Sauvegardez vos builds sur votre appareil',
        es: 'Guarda tus builds en tu dispositivo',
        pt: 'Salve suas builds no seu dispositivo' } },
    ]
  },
  {
    version: '2.2.0',
    date: '2026-07-04',
    changes: [
      { type: 'improvement', text: {
        en: 'Sublimations now show official names and translated effects in every language',
        fr: 'Les sublimations affichent désormais les noms officiels et les effets traduits dans chaque langue',
        es: 'Las sublimaciones muestran ahora los nombres oficiales y los efectos traducidos en todos los idiomas',
        pt: 'As sublimações agora mostram os nomes oficiais e os efeitos traduzidos em todos os idiomas' } },
      { type: 'feature', text: {
        en: 'Epic and Relic filters on the Sublimations page',
        fr: 'Filtres Épique et Relique sur la page des sublimations',
        es: 'Filtros Épica y Reliquia en la página de sublimaciones',
        pt: 'Filtros Épica e Relíquia na página de sublimações' } },
      { type: 'improvement', text: {
        en: 'Combat Calculator available in all four languages',
        fr: 'Calculateur de combat disponible dans les quatre langues',
        es: 'Calculadora de combate disponible en los cuatro idiomas',
        pt: 'Calculadora de combate disponível nos quatro idiomas' } },
      { type: 'improvement', text: {
        en: 'Your language choice is remembered',
        fr: 'Votre choix de langue est mémorisé',
        es: 'Se recuerda tu elección de idioma',
        pt: 'Sua escolha de idioma é lembrada' } },
      { type: 'update', text: {
        en: 'Game data now updates automatically every month',
        fr: 'Les données du jeu se mettent désormais à jour automatiquement chaque mois',
        es: 'Los datos del juego se actualizan ahora automáticamente cada mes',
        pt: 'Os dados do jogo agora são atualizados automaticamente todo mês' } },
    ]
  },
  {
    version: '2.1.0',
    date: '2026-02-25',
    changes: [
      { type: 'feature', text: {
        en: 'Added Treasures page with hunt locations, coordinates, artifacts and rewards',
        fr: 'Ajout de la page Trésors avec emplacements, coordonnées, artefacts et récompenses',
        es: 'Agregada página de Tesoros con ubicaciones, coordenadas, artefactos y recompensas',
        pt: 'Adicionada página de Tesouros com locais, coordenadas, artefatos e recompensas' } },
      { type: 'feature', text: {
        en: 'Added checkboxes to track completed treasures with persistent storage',
        fr: 'Ajout de cases à cocher pour suivre les trésors complétés avec stockage persistant',
        es: 'Agregadas casillas para rastrear tesoros completados con almacenamiento persistente',
        pt: 'Adicionadas caixas de seleção para rastrear tesouros completados com armazenamento persistente' } },
      { type: 'improvement', text: {
        en: 'Multi-language support for treasure locations, artifacts and achievements',
        fr: 'Support multilingue pour les emplacements, artefacts et succès de trésors',
        es: 'Soporte multiidioma para ubicaciones, artefactos y logros de tesoros',
        pt: 'Suporte multilíngue para locais, artefatos e conquistas de tesouros' } },
    ]
  },
  {
    version: '2.0.0',
    date: '2026-01-21',
    changes: [
      { type: 'feature', text: {
        en: 'Added About and Changelog pages',
        fr: 'Ajout des pages À propos et Journal des modifications',
        es: 'Agregadas páginas Acerca de y Registro de cambios',
        pt: 'Adicionadas páginas Sobre e Registro de alterações' } },
      { type: 'improvement', text: {
        en: 'Enhanced footer navigation',
        fr: 'Navigation du pied de page améliorée',
        es: 'Navegación del pie de página mejorada',
        pt: 'Navegação do rodapé aprimorada' } },
    ]
  },
  {
    version: '1.5.0',
    date: '2026-01-15',
    changes: [
      { type: 'feature', text: {
        en: 'Added Items Craft Guide',
        fr: 'Ajout du Guide de Craft d\'Objets',
        es: 'Agregada Guía de Crafteo de Objetos',
        pt: 'Adicionado Guia de Crafting de Itens' } },
      { type: 'improvement', text: {
        en: 'Improved sublimations filtering system',
        fr: 'Amélioration du système de filtrage des sublimations',
        es: 'Mejora del sistema de filtrado de sublimaciones',
        pt: 'Melhoria no sistema de filtragem de sublimações' } },
    ]
  },
  {
    version: '1.0.0',
    date: '2025-11-10',
    changes: [
      { type: 'feature', text: {
        en: 'Initial release with XP Calculator',
        fr: 'Version initiale avec Calculateur XP',
        es: 'Lanzamiento inicial con Calculadora XP',
        pt: 'Lançamento inicial com Calculadora XP' } },
      { type: 'feature', text: {
        en: 'Sublimations database',
        fr: 'Base de données de sublimations',
        es: 'Base de datos de sublimaciones',
        pt: 'Banco de dados de sublimações' } },
      { type: 'feature', text: {
        en: 'Multi-language support (EN, FR, ES, PT)',
        fr: 'Support multilingue (EN, FR, ES, PT)',
        es: 'Soporte multiidioma (EN, FR, ES, PT)',
        pt: 'Suporte multilíngue (EN, FR, ES, PT)' } },
    ]
  },
];
