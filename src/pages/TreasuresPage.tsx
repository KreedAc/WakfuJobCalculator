import { useEffect, useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

type Lang = 'en' | 'fr' | 'es' | 'pt';

type Treasure = {
  achievement: string;
  zone: string;
  coords: { x: number; y: number };
  artifacts: string[];
  rewards: string;
};

const STORAGE_KEY = 'wakfu-treasures-completed';

type TreasuresI18n = {
  _meta?: any;
  locations?: Record<string, Record<Lang, string>>;
  artifacts?: Record<string, Record<Lang, string>>;
  achievements?: Record<string, Record<Lang, string>>;
};

const UI = {
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
} satisfies Record<Lang, any>;

function formatCoords(c: { x: number; y: number }) {
  return `${c.x}, ${c.y}`;
}

export default function TreasuresPage({ language }: { language: Lang }) {
  const t = UI[language];

  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [i18n, setI18n] = useState<TreasuresI18n | null>(null);
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedTreasures, setCompletedTreasures] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [treasuresRes, i18nRes] = await Promise.allSettled([
        fetch('/data/treasures.json'),
        fetch('/data/treasures.i18n.json'),
      ]);

      if (!cancelled) {
        if (treasuresRes.status === 'fulfilled' && treasuresRes.value.ok) {
          const data = await treasuresRes.value.json();
          setTreasures(Array.isArray(data) ? data : []);
        } else {
          setTreasures([]);
        }

        if (i18nRes.status === 'fulfilled' && i18nRes.value.ok) {
          const data = await i18nRes.value.json();
          setI18n(data || null);
        } else {
          setI18n(null);
        }
      }
    }

    load().catch(() => {
      if (!cancelled) {
        setTreasures([]);
        setI18n(null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const translateLocation = (zone: string) => {
    const hit = i18n?.locations?.[zone]?.[language];
    return hit || zone;
  };

  const translateArtifact = (name: string) => {
    const hit = i18n?.artifacts?.[name]?.[language];
    return hit || name;
  };

  const translateAchievement = (name: string) => {
    const hit = i18n?.achievements?.[name]?.[language];
    return hit || name;
  };

  const toggleTreasure = (achievement: string) => {
    setCompletedTreasures((prev) => {
      const next = new Set(prev);
      if (next.has(achievement)) {
        next.delete(achievement);
      } else {
        next.add(achievement);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return treasures;

    return treasures.filter((tr) => {
      const haystack = [
        tr.achievement,
        translateAchievement(tr.achievement),
        tr.zone,
        translateLocation(tr.zone),
        tr.rewards,
        ...(tr.artifacts || []),
        ...(tr.artifacts || []).map(translateArtifact),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [treasures, query, i18n, language]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center animate-in fade-in duration-500">
      <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-200">
        {t.title}
      </h1>
      <p className="text-emerald-100/90 mb-6 text-center max-w-2xl text-lg leading-relaxed drop-shadow-md">
        {t.subtitle}
      </p>

      {/* How it works section */}
      <div className="mb-10 w-full">
        <div className="backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-white/5 transition-colors duration-200"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-300">
              {UI[language].howItWorksTitle || 'How It Works'}
            </h2>
            {isExpanded ? (
              <ChevronUp className="h-6 w-6 text-emerald-300 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-6 w-6 text-emerald-300 flex-shrink-0" />
            )}
          </button>

          {isExpanded && (
            <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-emerald-100/90 leading-relaxed text-base">
                {UI[language].howItWorks || ''}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full">
        <div className="backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 md:p-8" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 text-sm text-white shadow-sm outline-none ring-0 focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div className="text-sm text-emerald-300 font-medium">
              {t.counts(filtered.length, treasures.length)}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 shadow-lg">
            <table className="w-full min-w-[900px] table-auto">
              <thead className="bg-black/40 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-emerald-300 w-16">
                  ✓
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {t.columns.achievement}
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {t.columns.location}
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {t.columns.coords}
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {t.columns.artifacts}
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {t.columns.rewards}
                </th>
              </tr>
              </thead>

              <tbody>
              {filtered.map((tr, idx) => (
                <tr
                  key={`${tr.achievement}-${idx}`}
                  className="border-t border-white/10 hover:bg-emerald-500/5 transition-colors duration-150"
                >
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={completedTreasures.has(tr.achievement)}
                      onChange={() => toggleTreasure(tr.achievement)}
                      className="h-5 w-5 cursor-pointer rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-0"
                    />
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-emerald-50">
                    {translateAchievement(tr.achievement)}
                  </td>
                  <td className="px-4 py-4 text-sm text-emerald-100/90">
                    {translateLocation(tr.zone)}
                  </td>
                  <td className="px-4 py-4 text-sm text-emerald-100/80">
                    {formatCoords(tr.coords)}
                  </td>
                  <td className="px-4 py-4 text-sm text-emerald-100/90">
                    {(tr.artifacts || []).length ? (
                      <div className="flex flex-wrap gap-2">
                        {tr.artifacts.map((a) => (
                          <span
                            key={a}
                            className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-100 border border-emerald-500/30 font-medium"
                          >
                            {translateArtifact(a)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-emerald-100/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-emerald-100/90">
                    {tr.rewards || <span className="text-emerald-100/40">—</span>}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-base text-emerald-100/70">
                    {t.empty}
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
