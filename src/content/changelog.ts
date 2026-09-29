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
    version: '3.2.1',
    date: '2026-09-29',
    changes: [
      { type: 'improvement', text: {
        en: 'XP Calculator: shows the real resources of the leveling recipe with their pictures, and the alternative recipes',
        fr: 'Calculateur XP : affiche les vraies ressources de la recette avec leurs images, et les recettes alternatives',
        es: 'Calculadora XP: muestra los recursos reales de la receta con sus imágenes y las recetas alternativas',
        pt: 'Calculadora XP: mostra os recursos reais da receita com suas imagens e as receitas alternativas' } },
      { type: 'improvement', text: {
        en: 'Game Updates: brand new sublimations are listed as soon as the game adds them',
        fr: 'Mises à jour du jeu : les toutes nouvelles sublimations sont listées dès que le jeu les ajoute',
        es: 'Actualizaciones del juego: las sublimaciones totalmente nuevas aparecen en cuanto el juego las añade',
        pt: 'Atualizações do jogo: sublimações totalmente novas aparecem assim que o jogo as adiciona' } },
    ]
  },
  {
    version: '3.2.0',
    date: '2026-09-29',
    changes: [
      { type: 'feature', text: {
        en: 'New Game Updates page: new craftable items, resources, recipe changes and sublimations at each Wakfu update',
        fr: 'Nouvelle page Mises à jour du jeu : nouveaux objets craftables, ressources, recettes modifiées et sublimations à chaque mise à jour de Wakfu',
        es: 'Nueva página Actualizaciones del juego: nuevos objetos fabricables, recursos, recetas modificadas y sublimaciones en cada actualización de Wakfu',
        pt: 'Nova página Atualizações do jogo: novos itens fabricáveis, recursos, receitas alteradas e sublimações a cada atualização do Wakfu' } },
      { type: 'feature', text: {
        en: 'XP Calculator: open the shopping list of the leveling recipe, with the number of crafts already set',
        fr: 'Calculateur XP : ouvrez la liste de courses de la recette pour monter, avec le nombre de crafts déjà indiqué',
        es: 'Calculadora XP: abre la lista de compras de la receta para subir, con el número de crafteos ya indicado',
        pt: 'Calculadora XP: abra a lista de compras da receita para upar, com o número de crafts já definido' } },
      { type: 'improvement', text: {
        en: 'Craft Guide: "Share list" button to send your selection to a friend',
        fr: 'Guide de craft : bouton « Partager la liste » pour envoyer votre sélection à un ami',
        es: 'Guía de crafteo: botón «Compartir lista» para enviar tu selección a un amigo',
        pt: 'Guia de craft: botão "Compartilhar lista" para enviar sua seleção a um amigo' } },
    ]
  },
  {
    version: '3.1.0',
    date: '2026-09-29',
    changes: [
      { type: 'feature', text: {
        en: 'Visitor counter on the Home page and in the footer (no cookies)',
        fr: "Compteur de visiteurs sur l'accueil et en bas de page (sans cookies)",
        es: 'Contador de visitantes en la página de inicio y en el pie de página (sin cookies)',
        pt: 'Contador de visitantes na página inicial e no rodapé (sem cookies)' } },
      { type: 'improvement', text: {
        en: 'More compact layout on computers: each tool fits in one screen and uses the full width',
        fr: "Mise en page plus compacte sur ordinateur : chaque outil tient sur un écran et utilise toute la largeur",
        es: 'Diseño más compacto en el ordenador: cada herramienta cabe en una pantalla y usa todo el ancho',
        pt: 'Layout mais compacto no computador: cada ferramenta cabe em uma tela e usa toda a largura' } },
    ]
  },
  {
    version: '3.0.0',
    date: '2026-09-28',
    changes: [
      { type: 'feature', text: {
        en: 'Brand new design: side menu on computers, bottom tab bar on phones, and a light theme',
        fr: 'Tout nouveau design : menu latéral sur ordinateur, barre d\'onglets en bas sur téléphone et thème clair',
        es: 'Diseño totalmente nuevo: menú lateral en el ordenador, barra de pestañas abajo en el móvil y tema claro',
        pt: 'Design totalmente novo: menu lateral no computador, barra de abas embaixo no celular e tema claro' } },
      { type: 'feature', text: {
        en: 'Search everything with Ctrl+K: tools, professions, sublimations and craftable items',
        fr: 'Recherchez tout avec Ctrl+K : outils, métiers, sublimations et objets craftables',
        es: 'Busca todo con Ctrl+K: herramientas, oficios, sublimaciones y objetos fabricables',
        pt: 'Busque tudo com Ctrl+K: ferramentas, profissões, sublimações e itens fabricáveis' } },
      { type: 'improvement', text: {
        en: 'XP Calculator: results update as you type, professions as icons, shareable link',
        fr: 'Calculateur XP : résultats en direct, métiers en icônes, lien partageable',
        es: 'Calculadora XP: resultados en directo, oficios con iconos, enlace para compartir',
        pt: 'Calculadora XP: resultados ao vivo, profissões com ícones, link para compartilhar' } },
      { type: 'improvement', text: {
        en: 'New Home page with all tools and the latest changes; Treasures show your progress',
        fr: 'Nouvelle page d\'accueil avec tous les outils et les nouveautés ; les Trésors affichent votre progression',
        es: 'Nueva página de inicio con todas las herramientas y novedades; los Tesoros muestran tu progreso',
        pt: 'Nova página inicial com todas as ferramentas e novidades; os Tesouros mostram seu progresso' } },
    ]
  },
  {
    version: '2.5.0',
    date: '2026-09-28',
    changes: [
      { type: 'update', text: {
        en: 'Game data updated to version 1.93',
        fr: 'Données du jeu mises à jour vers la version 1.93',
        es: 'Datos del juego actualizados a la versión 1.93',
        pt: 'Dados do jogo atualizados para a versão 1.93' } },
    ]
  },
  {
    version: '2.4.0',
    date: '2026-09-28',
    changes: [
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
