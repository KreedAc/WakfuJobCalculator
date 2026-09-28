// Page copy for TreasuresPage in every supported language.
// Kept out of the component so text edits never touch layout code.
import type { Language } from '../constants/translations';

export const treasuresContent = {
  en: {
    title: 'Treasures',
    subtitle: 'Treasure hunt achievements, locations and required artifacts.',
    searchPlaceholder: 'Search achievement, location, reward…',
    columns: {
      achievement: 'Achievement',
      location: 'Location',
      coords: 'Coords',
      artifacts: 'Artifacts',
      rewards: 'Rewards',
    },
    empty: 'No treasures found.',
    counts: (shown: number, total: number) => `Showing ${shown} / ${total}`,
    howItWorksTitle: 'How the Treasures Tool Works',
    howItWorks: 'The Treasures database tracks all treasure hunt achievements in Wakfu, providing a centralized location to plan and monitor your treasure hunting progress. Each treasure entry includes the achievement name, the specific zone where it is located, exact coordinates to help you navigate to the treasure location, the artifacts required to unlock the treasure, and the rewards you will receive. The search function allows you to quickly find treasures by achievement name, location, artifact names, or rewards. The checkbox system lets you mark treasures as completed, with your progress saved locally in your browser so you can track which treasures you have already found across multiple sessions. This is particularly useful for completionists who want to collect all treasure achievements in the game. The coordinate system uses Wakfu standard map coordinates, making it easy to navigate using in-game maps. All treasure data, including locations and artifact requirements, is compiled from the Wakfu game files and community resources, ensuring accuracy and completeness for your treasure hunting adventures.',
  },
  fr: {
    title: 'Trésors',
    subtitle: 'Succès de chasse au trésor, emplacements et artefacts requis.',
    searchPlaceholder: 'Rechercher succès, lieu, récompense…',
    columns: {
      achievement: 'Succès',
      location: 'Lieu',
      coords: 'Coord.',
      artifacts: 'Artefacts',
      rewards: 'Récompenses',
    },
    empty: 'Aucun trésor trouvé.',
    counts: (shown: number, total: number) => `Affichage ${shown} / ${total}`,
    howItWorksTitle: 'Comment fonctionne l\'outil des trésors',
    howItWorks: 'La base de données des Trésors suit tous les succès de chasse au trésor dans Wakfu, fournissant un emplacement centralisé pour planifier et surveiller votre progression de chasse au trésor. Chaque entrée de trésor comprend le nom du succès, la zone spécifique où il se trouve, des coordonnées exactes pour vous aider à naviguer vers l\'emplacement du trésor, les artefacts requis pour déverrouiller le trésor, et les récompenses que vous recevrez. La fonction de recherche vous permet de trouver rapidement des trésors par nom de succès, emplacement, noms d\'artefacts ou récompenses. Le système de cases à cocher vous permet de marquer les trésors comme complétés, avec votre progression sauvegardée localement dans votre navigateur afin que vous puissiez suivre quels trésors vous avez déjà trouvés lors de plusieurs sessions. Ceci est particulièrement utile pour les complétionnistes qui souhaitent collecter tous les succès de trésors dans le jeu. Le système de coordonnées utilise les coordonnées de carte standard de Wakfu, facilitant la navigation à l\'aide des cartes en jeu. Toutes les données de trésors, y compris les emplacements et les exigences d\'artefacts, sont compilées à partir des fichiers du jeu Wakfu et des ressources communautaires, garantissant exactitude et exhaustivité pour vos aventures de chasse au trésor.',
  },
  es: {
    title: 'Tesoros',
    subtitle: 'Logros de búsqueda del tesoro, ubicaciones y artefactos necesarios.',
    searchPlaceholder: 'Buscar logro, lugar, recompensa…',
    columns: {
      achievement: 'Logro',
      location: 'Lugar',
      coords: 'Coord.',
      artifacts: 'Artefactos',
      rewards: 'Recompensas',
    },
    empty: 'No se encontraron tesoros.',
    counts: (shown: number, total: number) => `Mostrando ${shown} / ${total}`,
    howItWorksTitle: 'Cómo funciona la herramienta de tesoros',
    howItWorks: 'La base de datos de Tesoros rastrea todos los logros de búsqueda del tesoro en Wakfu, proporcionando una ubicación centralizada para planificar y monitorear tu progreso de búsqueda del tesoro. Cada entrada de tesoro incluye el nombre del logro, la zona específica donde se encuentra, coordenadas exactas para ayudarte a navegar a la ubicación del tesoro, los artefactos requeridos para desbloquear el tesoro y las recompensas que recibirás. La función de búsqueda te permite encontrar rápidamente tesoros por nombre de logro, ubicación, nombres de artefactos o recompensas. El sistema de casillas de verificación te permite marcar tesoros como completados, con tu progreso guardado localmente en tu navegador para que puedas rastrear qué tesoros ya has encontrado a través de múltiples sesiones. Esto es particularmente útil para completistas que quieren recolectar todos los logros de tesoros en el juego. El sistema de coordenadas usa coordenadas de mapa estándar de Wakfu, facilitando la navegación usando mapas en el juego. Todos los datos de tesoros, incluidas ubicaciones y requisitos de artefactos, están compilados de los archivos del juego Wakfu y recursos de la comunidad, garantizando precisión y exhaustividad para tus aventuras de búsqueda del tesoro.',
  },
  pt: {
    title: 'Tesouros',
    subtitle: 'Conquistas de caça ao tesouro, locais e artefatos necessários.',
    searchPlaceholder: 'Pesquisar conquista, local, recompensa…',
    columns: {
      achievement: 'Conquista',
      location: 'Local',
      coords: 'Coord.',
      artifacts: 'Artefatos',
      rewards: 'Recompensas',
    },
    empty: 'Nenhum tesouro encontrado.',
    counts: (shown: number, total: number) => `Exibindo ${shown} / ${total}`,
    howItWorksTitle: 'Como funciona a ferramenta de tesouros',
    howItWorks: 'O banco de dados de Tesouros rastreia todas as conquistas de caça ao tesouro no Wakfu, fornecendo um local centralizado para planejar e monitorar seu progresso de caça ao tesouro. Cada entrada de tesouro inclui o nome da conquista, a zona específica onde está localizada, coordenadas exatas para ajudá-lo a navegar até o local do tesouro, os artefatos necessários para desbloquear o tesouro e as recompensas que você receberá. A função de pesquisa permite que você encontre rapidamente tesouros por nome de conquista, local, nomes de artefatos ou recompensas. O sistema de caixas de seleção permite que você marque tesouros como concluídos, com seu progresso salvo localmente em seu navegador para que você possa rastrear quais tesouros você já encontrou em várias sessões. Isso é particularmente útil para completistas que desejam coletar todas as conquistas de tesouros no jogo. O sistema de coordenadas usa coordenadas de mapa padrão do Wakfu, facilitando a navegação usando mapas no jogo. Todos os dados de tesouros, incluindo locais e requisitos de artefatos, são compilados dos arquivos do jogo Wakfu e recursos da comunidade, garantindo precisão e completude para suas aventuras de caça ao tesouro.',
  },
} satisfies Record<Language, unknown>;
