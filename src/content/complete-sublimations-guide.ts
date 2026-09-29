// Page copy for CompleteSublimationsGuide in every supported language.
// Kept out of the component so text edits never touch layout code.
// Numbers (233 sublimations, 32 Epic, 47 Relic…) match public/data/sublimations.en.json.
import { Sparkles, Palette, Layers, Crown, MapPin, Search, type LucideIcon } from 'lucide-react';

interface GuideSection {
  title: string;
  icon?: LucideIcon;
  content: string[];
}

interface GuideContent {
  title: string;
  description: string;
  backToGuides: string;
  lastUpdated: string;
  sections: GuideSection[];
  cta: { before: string; link: string; after: string };
}

const en: GuideContent = {
  title: 'Complete Sublimations Guide',
  description: 'How Wakfu sublimations work: socket color patterns, Rare/Mythic/Legendary levels, Epic and Relic sublimations, and where to get them.',
  backToGuides: 'Back to Guides',
  lastUpdated: 'Last updated: September 29, 2026',
  sections: [
    {
      title: 'What are sublimations?',
      icon: Sparkles,
      content: [
        'A sublimation is a scroll you apply to a piece of equipment. Once applied, it gives your character an extra effect: a flat bonus (Critical Hit, Force of Will, resistances…) or a conditional one ("at start of combat, if…", "when the state bearer suffers damage in melee…").',
        'Each item carries one sublimation. They are one of the main ways to shape a build at every level, not only at endgame: the same stuff with different sublimations can play very differently.',
        'The site lists 233 sublimations: 154 regular ones, 32 Epic and 47 Relic.',
      ],
    },
    {
      title: 'Socket colors: where a sublimation fits',
      icon: Palette,
      content: [
        'Equipment has up to 4 sockets, each one red, green or blue. A white socket counts as any color.',
        'Every regular sublimation has a pattern of 3 colors, for example Blue – Red – Red. To apply it, the item must have those colors in that order on three consecutive sockets: sockets 1-2-3 or 2-3-4.',
        'Example: an item with the sockets Green – Blue – Red – Red can take a Blue – Red – Red sublimation (sockets 2-3-4), but not a Red – Red – Blue one.',
        'On the Sublimations page, set the colors of your item\'s four sockets in "Filter by Slots" and only the sublimations that fit are shown.',
      ],
    },
    {
      title: 'Rarity and levels',
      icon: Layers,
      content: [
        'Most sublimations exist as three scrolls: I (Rare, green scroll), II (Mythic, orange scroll) and III (Legendary, yellow scroll). They are worth 1, 2 and 3 levels of the same sublimation.',
        'The same sublimation applied to several items adds up its levels, up to its maximum level (2, 3, 4 or 6 depending on the sublimation). For example, Crimson Influence gives 5% Critical Hit per level: two Legendary scrolls (3 + 3) reach level 6, for 30%.',
        'Some sublimations only exist as Mythic (II): their level goes up 2 at a time. Fire and Flame is one of them (levels 2, 4 and 6).',
        'Each card on the Sublimations page has a level slider that shows the effect at every level, so you can see what one more scroll brings before you farm it.',
      ],
    },
    {
      title: 'Epic and Relic sublimations',
      icon: Crown,
      content: [
        'Epic and Relic sublimations have no color pattern and a single level. Epic sublimations are applied to your Epic item and Relic sublimations to your Relic item; since you can only wear one of each, you use at most one Epic and one Relic sublimation at a time.',
        'Their effects are usually much stronger and often define the whole build, so they are the first thing to choose. Use the Epic and Relic filters on the Sublimations page to compare them.',
        'They come from the Adventure, Balance, Companionship, Speed and Ultimate Stones.',
      ],
    },
    {
      title: 'Where to get them',
      icon: MapPin,
      content: [
        'Most regular sublimations drop in dungeons (94 of them) and rifts (40). A few need dungeon steles, and others come from the Runic Mimic, Nox, bosses such as Ignemikhal, or are crafted.',
        'Every card on the Sublimations page shows its source with the boss or place icon, so you know where to farm before you start.',
      ],
    },
    {
      title: 'Choosing your sublimations',
      icon: Search,
      content: [
        'Start from your role with the category filters: Offensive, Defensive, Support, Stats Increase and Utility.',
        'Read the condition. Many effects only work if you meet it ("if Critical Hits are <= 20", "while the bearer has Armor", "if HP are above 90%"): a strong sublimation is useless if your build never triggers it.',
        'Check your sockets first. It is often easier to pick among the sublimations that fit the items you already have than to rebuild your stuff around one pattern.',
        'Prefer sublimations you can stack: a sublimation that goes up to level 6 is worth more when you can apply it to two or three items.',
      ],
    },
  ],
  cta: { before: 'Open the ', link: 'Sublimations page', after: ' to search every sublimation by name or effect and filter it by your sockets.' },
};

const fr: GuideContent = {
  title: 'Guide complet des sublimations',
  description: 'Comment marchent les sublimations de Wakfu : couleurs des châsses, niveaux Rare/Mythique/Légendaire, sublimations épiques et reliques, et où les obtenir.',
  backToGuides: 'Retour aux guides',
  lastUpdated: 'Dernière mise à jour : 29 septembre 2026',
  sections: [
    {
      title: 'Que sont les sublimations ?',
      icon: Sparkles,
      content: [
        "Une sublimation est un parchemin que l'on applique sur une pièce d'équipement. Une fois appliquée, elle donne un effet supplémentaire à votre personnage : un bonus fixe (Coup Critique, Volonté, résistances…) ou un effet conditionnel (« en début de combat, si… », « quand le porteur subit des dégâts en mêlée… »).",
        "Chaque objet porte une seule sublimation. C'est l'un des principaux moyens de façonner un build à tous les niveaux, pas seulement en fin de jeu : le même stuff avec d'autres sublimations peut se jouer de façon très différente.",
        'Le site recense 233 sublimations : 154 normales, 32 épiques et 47 reliques.',
      ],
    },
    {
      title: 'Couleurs des châsses : où va une sublimation',
      icon: Palette,
      content: [
        "Un équipement a jusqu'à 4 châsses, chacune rouge, verte ou bleue. Une châsse blanche compte comme n'importe quelle couleur.",
        "Chaque sublimation normale a un motif de 3 couleurs, par exemple Bleu – Rouge – Rouge. Pour l'appliquer, l'objet doit avoir ces couleurs dans cet ordre sur trois châsses consécutives : châsses 1-2-3 ou 2-3-4.",
        "Exemple : un objet avec les châsses Vert – Bleu – Rouge – Rouge accepte une sublimation Bleu – Rouge – Rouge (châsses 2-3-4), mais pas une Rouge – Rouge – Bleu.",
        'Sur la page Sublimations, indiquez les couleurs des quatre châsses de votre objet dans « Filtrer par Slots » : seules les sublimations compatibles restent affichées.',
      ],
    },
    {
      title: 'Rareté et niveaux',
      icon: Layers,
      content: [
        'La plupart des sublimations existent en trois parchemins : I (Rare, parchemin vert), II (Mythique, parchemin orange) et III (Légendaire, parchemin jaune). Ils valent 1, 2 et 3 niveaux de la même sublimation.',
        "La même sublimation appliquée sur plusieurs objets additionne ses niveaux, jusqu'à son niveau maximum (2, 3, 4 ou 6 selon la sublimation). Par exemple, Influence pourpre donne 5% de Coup Critique par niveau : deux parchemins Légendaires (3 + 3) atteignent le niveau 6, soit 30%.",
        "Certaines sublimations n'existent qu'en Mythique (II) : leur niveau augmente de 2 en 2. C'est le cas de Tout feu tout flamme (niveaux 2, 4 et 6).",
        "Chaque carte de la page Sublimations a un curseur de niveau qui montre l'effet à chaque niveau : vous voyez ce qu'apporte un parchemin de plus avant de le farmer.",
      ],
    },
    {
      title: 'Sublimations épiques et reliques',
      icon: Crown,
      content: [
        "Les sublimations épiques et reliques n'ont pas de motif de couleurs et un seul niveau. Les épiques s'appliquent sur votre objet épique et les reliques sur votre objet relique ; comme on ne peut porter qu'un de chaque, on utilise au plus une sublimation épique et une relique à la fois.",
        "Leurs effets sont en général bien plus forts et définissent souvent tout le build : c'est la première chose à choisir. Utilisez les filtres Épique et Relique de la page Sublimations pour les comparer.",
        "Elles s'obtiennent avec les pierres spéciales : pierres d'aventure, d'équilibre, de compagnonnage, de rapidité et ultime.",
      ],
    },
    {
      title: 'Où les obtenir',
      icon: MapPin,
      content: [
        "La plupart des sublimations normales se droppent en donjon (94) et en faille (40). Quelques-unes demandent des stèles de donjon, d'autres viennent de la Mimique runique, de Nox, de boss comme Ignemikhal, ou se craftent.",
        "Chaque carte de la page Sublimations indique sa provenance avec l'icône du boss ou du lieu : vous savez où farmer avant de commencer.",
      ],
    },
    {
      title: 'Choisir ses sublimations',
      icon: Search,
      content: [
        'Partez de votre rôle avec les filtres de catégorie : Offensive, Défensive, Soutien, Caractéristiques et Utilitaire.',
        "Lisez la condition. Beaucoup d'effets ne marchent que si on la remplit (« si les Coups Critiques sont <= 20 », « tant que le porteur a de l'Armure », « si les PV sont au-dessus de 90% ») : une sublimation puissante ne sert à rien si votre build ne la déclenche jamais.",
        "Regardez d'abord vos châsses. Il est souvent plus simple de choisir parmi les sublimations qui vont sur vos objets actuels que de refaire tout le stuff autour d'un motif.",
        "Privilégiez les sublimations cumulables : une sublimation qui monte jusqu'au niveau 6 vaut plus quand vous pouvez l'appliquer sur deux ou trois objets.",
      ],
    },
  ],
  cta: { before: 'Ouvrez la ', link: 'page Sublimations', after: ' pour chercher chaque sublimation par nom ou par effet et la filtrer selon vos châsses.' },
};

const es: GuideContent = {
  title: 'Guía completa de sublimaciones',
  description: 'Cómo funcionan las sublimaciones de Wakfu: colores de los engarces, niveles Rara/Mítica/Legendaria, sublimaciones épicas y reliquias, y dónde conseguirlas.',
  backToGuides: 'Volver a las guías',
  lastUpdated: 'Última actualización: 29 de septiembre de 2026',
  sections: [
    {
      title: '¿Qué son las sublimaciones?',
      icon: Sparkles,
      content: [
        'Una sublimación es un pergamino que se aplica a una pieza de equipo. Una vez aplicada, da a tu personaje un efecto extra: un bonus fijo (Golpe crítico, voluntad, resistencias…) o un efecto con condición («al principio del combate, si…», «cuando el portador sufre daños cuerpo a cuerpo…»).',
        'Cada objeto lleva una sola sublimación. Son una de las principales formas de definir una build a cualquier nivel, no solo al final del juego: el mismo equipo con otras sublimaciones puede jugarse de forma muy distinta.',
        'El sitio recoge 233 sublimaciones: 154 normales, 32 épicas y 47 reliquias.',
      ],
    },
    {
      title: 'Colores de los engarces: dónde va una sublimación',
      icon: Palette,
      content: [
        'Un equipo tiene hasta 4 engarces, cada uno rojo, verde o azul. Un engarce blanco cuenta como cualquier color.',
        'Cada sublimación normal tiene un patrón de 3 colores, por ejemplo Azul – Rojo – Rojo. Para aplicarla, el objeto debe tener esos colores en ese orden en tres engarces seguidos: engarces 1-2-3 o 2-3-4.',
        'Ejemplo: un objeto con los engarces Verde – Azul – Rojo – Rojo acepta una sublimación Azul – Rojo – Rojo (engarces 2-3-4), pero no una Rojo – Rojo – Azul.',
        'En la página de Sublimaciones, indica los colores de los cuatro engarces de tu objeto en «Filtrar por Slots» y solo verás las sublimaciones que encajan.',
      ],
    },
    {
      title: 'Rareza y niveles',
      icon: Layers,
      content: [
        'La mayoría de las sublimaciones existen en tres pergaminos: I (Rara, pergamino verde), II (Mítica, pergamino naranja) y III (Legendaria, pergamino amarillo). Valen 1, 2 y 3 niveles de la misma sublimación.',
        'La misma sublimación aplicada en varios objetos suma sus niveles, hasta su nivel máximo (2, 3, 4 o 6 según la sublimación). Por ejemplo, Influencia Púrpura da un 5% de Golpe crítico por nivel: dos pergaminos Legendarios (3 + 3) llegan al nivel 6, un 30%.',
        'Algunas sublimaciones solo existen como Míticas (II): su nivel sube de 2 en 2. Es el caso de Puro Fuego (niveles 2, 4 y 6).',
        'Cada tarjeta de la página de Sublimaciones tiene un control de nivel que muestra el efecto en cada nivel: ves lo que aporta un pergamino más antes de farmearlo.',
      ],
    },
    {
      title: 'Sublimaciones épicas y reliquias',
      icon: Crown,
      content: [
        'Las sublimaciones épicas y reliquias no tienen patrón de colores y tienen un solo nivel. Las épicas se aplican a tu objeto épico y las reliquias a tu objeto reliquia; como solo puedes llevar uno de cada, usas como máximo una sublimación épica y una reliquia a la vez.',
        'Sus efectos suelen ser mucho más fuertes y a menudo definen toda la build: son lo primero que hay que elegir. Usa los filtros Épica y Reliquia de la página de Sublimaciones para compararlas.',
        'Se consiguen con las piedras especiales: piedras de aventura, de equilibrio, de compañerismo, de rapidez y definitiva.',
      ],
    },
    {
      title: 'Dónde conseguirlas',
      icon: MapPin,
      content: [
        'La mayoría de las sublimaciones normales caen en mazmorras (94) y en fisuras (40). Algunas necesitan estelas de mazmorra y otras vienen del Mímico rúnico, de Nox, de jefes como Ignemikhal, o se fabrican.',
        'Cada tarjeta de la página de Sublimaciones muestra su origen con el icono del jefe o del lugar: sabes dónde farmear antes de empezar.',
      ],
    },
    {
      title: 'Elegir tus sublimaciones',
      icon: Search,
      content: [
        'Empieza por tu rol con los filtros de categoría: Ofensiva, Defensiva, Apoyo, Características y Utilidad.',
        'Lee la condición. Muchos efectos solo funcionan si la cumples («si los Golpes críticos son <= 20», «mientras el portador tenga Armadura», «si los PdV están por encima del 90%»): una sublimación potente no sirve de nada si tu build nunca la activa.',
        'Mira primero tus engarces. Suele ser más fácil elegir entre las sublimaciones que encajan en tus objetos actuales que rehacer todo el equipo alrededor de un patrón.',
        'Prioriza las sublimaciones acumulables: una sublimación que sube hasta el nivel 6 vale más cuando puedes aplicarla en dos o tres objetos.',
      ],
    },
  ],
  cta: { before: 'Abre la ', link: 'página de Sublimaciones', after: ' para buscar cada sublimación por nombre o efecto y filtrarla según tus engarces.' },
};

const pt: GuideContent = {
  title: 'Guia completo de sublimações',
  description: 'Como funcionam as sublimações do Wakfu: cores dos engastes, níveis Rara/Mítica/Lendária, sublimações épicas e relíquias, e onde conseguir.',
  backToGuides: 'Voltar aos guias',
  lastUpdated: 'Última atualização: 29 de setembro de 2026',
  sections: [
    {
      title: 'O que são sublimações?',
      icon: Sparkles,
      content: [
        'Uma sublimação é um pergaminho que você aplica em uma peça de equipamento. Depois de aplicada, ela dá um efeito extra ao seu personagem: um bônus fixo (Golpe crítico, vontade, resistências…) ou um efeito com condição ("no início do combate, se…", "quando o portador sofre danos corpo a corpo…").',
        'Cada item carrega uma única sublimação. Elas são uma das principais formas de definir uma build em qualquer nível, não só no fim de jogo: o mesmo equipamento com outras sublimações pode ser jogado de forma bem diferente.',
        'O site lista 233 sublimações: 154 normais, 32 épicas e 47 relíquias.',
      ],
    },
    {
      title: 'Cores dos engastes: onde vai uma sublimação',
      icon: Palette,
      content: [
        'Um equipamento tem até 4 engastes, cada um vermelho, verde ou azul. Um engaste branco conta como qualquer cor.',
        'Cada sublimação normal tem um padrão de 3 cores, por exemplo Azul – Vermelho – Vermelho. Para aplicá-la, o item precisa ter essas cores nessa ordem em três engastes seguidos: engastes 1-2-3 ou 2-3-4.',
        'Exemplo: um item com os engastes Verde – Azul – Vermelho – Vermelho aceita uma sublimação Azul – Vermelho – Vermelho (engastes 2-3-4), mas não uma Vermelho – Vermelho – Azul.',
        'Na página de Sublimações, informe as cores dos quatro engastes do seu item em "Filtrar por Slots" e só aparecem as sublimações que cabem nele.',
      ],
    },
    {
      title: 'Raridade e níveis',
      icon: Layers,
      content: [
        'A maioria das sublimações existe em três pergaminhos: I (Rara, pergaminho verde), II (Mítica, pergaminho laranja) e III (Lendária, pergaminho amarelo). Eles valem 1, 2 e 3 níveis da mesma sublimação.',
        'A mesma sublimação aplicada em vários itens soma seus níveis, até o nível máximo (2, 3, 4 ou 6, dependendo da sublimação). Por exemplo, Influência Púrpura dá 5% de Golpe crítico por nível: dois pergaminhos Lendários (3 + 3) chegam ao nível 6, ou seja 30%.',
        'Algumas sublimações só existem como Míticas (II): o nível sobe de 2 em 2. É o caso de Pegando Fogo (níveis 2, 4 e 6).',
        'Cada cartão da página de Sublimações tem um controle de nível que mostra o efeito em cada nível: você vê o que um pergaminho a mais traz antes de farmar.',
      ],
    },
    {
      title: 'Sublimações épicas e relíquias',
      icon: Crown,
      content: [
        'As sublimações épicas e relíquias não têm padrão de cores e têm um único nível. As épicas são aplicadas no seu item épico e as relíquias no seu item relíquia; como só dá para usar um de cada, você usa no máximo uma sublimação épica e uma relíquia ao mesmo tempo.',
        'Os efeitos delas costumam ser bem mais fortes e muitas vezes definem a build inteira: são a primeira coisa a escolher. Use os filtros Épica e Relíquia da página de Sublimações para compará-las.',
        'Elas são obtidas com as pedras especiais: pedras de aventura, de equilíbrio, de companheirismo, de rapidez e suprema.',
      ],
    },
    {
      title: 'Onde conseguir',
      icon: MapPin,
      content: [
        'A maioria das sublimações normais cai em masmorras (94) e em fendas (40). Algumas pedem estelas de masmorra, outras vêm do Mímico Rúnico, de Nox, de chefes como Ignemikhal, ou são fabricadas.',
        'Cada cartão da página de Sublimações mostra a origem com o ícone do chefe ou do lugar: você sabe onde farmar antes de começar.',
      ],
    },
    {
      title: 'Escolhendo suas sublimações',
      icon: Search,
      content: [
        'Comece pelo seu papel com os filtros de categoria: Ofensiva, Defensiva, Suporte, Características e Utilidade.',
        'Leia a condição. Muitos efeitos só funcionam se você cumpri-la ("se os Golpes críticos forem <= 20", "enquanto o portador tiver Armadura", "se os PV estiverem acima de 90%"): uma sublimação forte não serve para nada se a sua build nunca a ativa.',
        'Olhe primeiro os seus engastes. Costuma ser mais fácil escolher entre as sublimações que cabem nos itens que você já tem do que refazer todo o equipamento em volta de um padrão.',
        'Prefira sublimações acumuláveis: uma sublimação que vai até o nível 6 vale mais quando você pode aplicá-la em dois ou três itens.',
      ],
    },
  ],
  cta: { before: 'Abra a ', link: 'página de Sublimações', after: ' para buscar cada sublimação por nome ou efeito e filtrar pelos seus engastes.' },
};

export const sublimationsGuideContent: Record<'en' | 'fr' | 'es' | 'pt', GuideContent> = { en, fr, es, pt };
