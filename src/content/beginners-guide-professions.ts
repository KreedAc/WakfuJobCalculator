// Page copy for BeginnersGuideProfessions in every supported language.
// Kept out of the component so text edits never touch layout code.
// Numbers match the site data: constants/levelRanges.ts (XP per range) and the
// XP Calculator (5 of each resource per craft, 4 for Leather Dealer).
import { BookOpen, Hammer, Sprout, ShoppingCart, Lightbulb, type LucideIcon } from 'lucide-react';

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
  title: "Beginner's Guide to Wakfu Professions",
  description: 'How Wakfu professions work: gathering and crafting professions, how to level a crafting profession with the leveling recipes, and what changes the XP of gathering.',
  backToGuides: 'Back to Guides',
  lastUpdated: 'Last updated: September 29, 2026',
  sections: [
    {
      title: 'Two kinds of professions',
      icon: BookOpen,
      content: [
        'Wakfu has 6 gathering professions and 8 crafting professions. Gathering professions collect resources in the world: Farmer, Lumberjack, Herbalist, Miner, Trapper and Fisherman. Crafting professions turn those resources into equipment, food and other items: Armorer, Baker, Chef, Handyman, Jeweler, Leather Dealer, Tailor and Weapons Master.',
        'The two go together: the crafting recipes, including the ones used to level up, are made from gathered resources. You can gather them yourself or buy them at the market.',
      ],
    },
    {
      title: 'Leveling a crafting profession',
      icon: Hammer,
      content: [
        'Crafting professions are leveled with their leveling recipes: one per 10-level range, from Coarse (levels 2–10) up to Ancestral (150–160). Each profession has its own item: Plate for the Armorer (Coarse Plate, Precious Plate, Infernal Plate…), Fiber for the Tailor, Oil for the Baker, Spice for the Chef, Gem for the Jeweler, Leather for the Leather Dealer, Bracket for the Handyman and Handle for the Weapons Master.',
        'Each craft uses two resources: 5 of each (4 for the Leather Dealer). The XP you get per craft is shown in the recipe tooltip in game.',
        'The XP needed grows with every range: 7,500 XP from level 2 to 10, then 15,000 more for each range, up to 232,500 XP from level 150 to 160.',
        'Example: an Armorer going from 140 to 150 with 150 XP per craft needs 217,500 / 150 = 1,450 crafts of Infernal Plate, that is 7,250 of each of its two resources. The XP Calculator does this for any profession and range, and opens the full shopping list in the Craft Guide in one click.',
      ],
    },
    {
      title: 'Leveling a gathering profession',
      icon: Sprout,
      content: [
        'Gathering has no fixed formula, which is why there is no gathering calculator on this site. The XP of each harvest depends on several things:',
        'The resource level: resources well below your level give less XP. The same resource can also be found in different zones.',
        'Shiny resources: rare shiny versions of a resource give more XP.',
        "The satisfaction of the area's clan chief: the XP also depends on how satisfied the clan chief of the zone where you farm is.",
        'How many resources there are: a zone can run short. It is often better to farm a zone 5–10 levels lower where resources are plentiful, especially if you also want them for a crafting profession.',
      ],
    },
    {
      title: 'From resources to crafts',
      icon: ShoppingCart,
      content: [
        'Before a leveling session, work out what you need. In the XP Calculator, the result shows the real resources of the leveling recipe with the total amounts; "Shopping list for these crafts" opens them in the Craft Guide.',
        'The Craft Guide works for any craftable item: add one or more items with quantities and it builds a single shopping list. Expanding a craftable ingredient replaces it with its own ingredients, and you can tick each line as you collect it.',
        'Use "Share list" to send the list to a friend or your guild, for example when several of you farm for the same crafts.',
      ],
    },
    {
      title: 'Tips',
      icon: Lightbulb,
      content: [
        'Check the XP per craft in game before planning: it is the only number the calculator needs from you, and it decides how many crafts you do.',
        'Farm and craft together: leveling a gathering profession on the resources your crafting profession needs saves you both time and kamas.',
        'Compare farming and buying. For large amounts (thousands of resources at high levels), the market can be faster than farming everything yourself.',
      ],
    },
  ],
  cta: { before: 'Ready to plan your next levels? Open the ', link: 'XP Calculator', after: ' and pick your profession and range.' },
};

const fr: GuideContent = {
  title: 'Guide des métiers de Wakfu pour débutants',
  description: "Comment marchent les métiers de Wakfu : métiers de récolte et d'artisanat, comment monter un métier d'artisanat avec les recettes de montée, et ce qui change l'XP de la récolte.",
  backToGuides: 'Retour aux guides',
  lastUpdated: 'Dernière mise à jour : 29 septembre 2026',
  sections: [
    {
      title: 'Deux types de métiers',
      icon: BookOpen,
      content: [
        "Wakfu compte 6 métiers de récolte et 8 métiers d'artisanat. Les métiers de récolte ramassent les ressources dans le monde : Paysan, Bûcheron, Herboriste, Mineur, Trappeur et Pêcheur. Les métiers d'artisanat transforment ces ressources en équipements, nourriture et autres objets : Armurier, Boulanger, Cuisinier, Bricoleur, Bijoutier, Maroquinier, Tailleur et Maître d'armes.",
        "Les deux vont ensemble : les recettes d'artisanat, y compris celles qui servent à monter de niveau, se font avec des ressources récoltées. Vous pouvez les récolter vous-même ou les acheter à l'hôtel des ventes.",
      ],
    },
    {
      title: "Monter un métier d'artisanat",
      icon: Hammer,
      content: [
        "Les métiers d'artisanat se montent avec leurs recettes de montée : une par tranche de 10 niveaux, de Grossière (niveaux 2–10) à Ancestrale (150–160). Chaque métier a son objet : la Plaque pour l'Armurier (Plaque Grossière, Plaque Précieuse, Plaque Infernale…), la Fibre pour le Tailleur, l'Huile pour le Boulanger, l'Épice pour le Cuisinier, la Gemme pour le Bijoutier, le Cuir pour le Maroquinier, l'Équerre pour le Bricoleur et le Manche pour le Maître d'armes.",
        "Chaque craft utilise deux ressources : 5 de chaque (4 pour le Maroquinier). L'XP gagnée par craft est indiquée dans l'infobulle de la recette en jeu.",
        "L'XP nécessaire augmente à chaque tranche : 7 500 XP du niveau 2 au 10, puis 15 000 de plus à chaque tranche, jusqu'à 232 500 XP du niveau 150 au 160.",
        "Exemple : un Armurier qui passe de 140 à 150 avec 150 XP par craft doit faire 217 500 / 150 = 1 450 crafts de Plaque Infernale, soit 7 250 de chacune de ses deux ressources. Le Calculateur XP fait ce calcul pour chaque métier et chaque tranche, et ouvre la liste de courses complète dans le Guide de craft en un clic.",
      ],
    },
    {
      title: 'Monter un métier de récolte',
      icon: Sprout,
      content: [
        "La récolte n'a pas de formule fixe : c'est pour ça qu'il n'y a pas de calculateur de récolte sur ce site. L'XP de chaque récolte dépend de plusieurs choses :",
        "Le niveau de la ressource : les ressources bien en dessous de votre niveau donnent moins d'XP. Une même ressource se trouve aussi dans des zones différentes.",
        "Les ressources shiny : les versions shiny, plus rares, donnent plus d'XP.",
        "La satisfaction du chef de clan de la zone : l'XP dépend aussi de la satisfaction du chef de clan de la zone où vous récoltez.",
        "La quantité de ressources : une zone peut s'épuiser. Il vaut souvent mieux récolter dans une zone de 5–10 niveaux en dessous où les ressources sont nombreuses, surtout si vous en avez aussi besoin pour un métier d'artisanat.",
      ],
    },
    {
      title: 'Des ressources aux crafts',
      icon: ShoppingCart,
      content: [
        "Avant une session de montée, calculez ce qu'il vous faut. Dans le Calculateur XP, le résultat affiche les vraies ressources de la recette avec les quantités totales ; « Liste de courses pour ces crafts » les ouvre dans le Guide de craft.",
        "Le Guide de craft marche pour tout objet craftable : ajoutez un ou plusieurs objets avec leurs quantités et il crée une seule liste de courses. Développer un ingrédient craftable le remplace par ses propres ingrédients, et vous pouvez cocher chaque ligne au fur et à mesure.",
        'Utilisez « Partager la liste » pour envoyer la liste à un ami ou à votre guilde, par exemple quand plusieurs joueurs farment pour les mêmes crafts.',
      ],
    },
    {
      title: 'Conseils',
      icon: Lightbulb,
      content: [
        "Vérifiez l'XP par craft en jeu avant de planifier : c'est le seul chiffre que le calculateur vous demande, et c'est lui qui décide du nombre de crafts.",
        "Récoltez et craftez ensemble : monter un métier de récolte sur les ressources dont votre métier d'artisanat a besoin fait gagner du temps et des kamas.",
        "Comparez récolte et achat. Pour de grosses quantités (des milliers de ressources à haut niveau), l'hôtel des ventes peut être plus rapide que tout récolter vous-même.",
      ],
    },
  ],
  cta: { before: 'Prêt à planifier vos prochains niveaux ? Ouvrez le ', link: 'Calculateur XP', after: ' et choisissez votre métier et votre tranche.' },
};

const es: GuideContent = {
  title: 'Guía de oficios de Wakfu para principiantes',
  description: 'Cómo funcionan los oficios de Wakfu: oficios de recolección y de fabricación, cómo subir un oficio de fabricación con las recetas de subida y qué cambia la XP de la recolección.',
  backToGuides: 'Volver a las guías',
  lastUpdated: 'Última actualización: 29 de septiembre de 2026',
  sections: [
    {
      title: 'Dos tipos de oficios',
      icon: BookOpen,
      content: [
        'Wakfu tiene 6 oficios de recolección y 8 oficios de fabricación. Los de recolección recogen recursos por el mundo: cultivos, árboles, plantas, minerales, criaturas y peces. Los de fabricación convierten esos recursos en equipo, comida y otros objetos: Armero, Panadero, Cocinero, Ebanista, Joyero, Peletero, Sastre y Maestro de armas.',
        'Los dos van juntos: las recetas de fabricación, incluidas las que sirven para subir de nivel, se hacen con recursos recolectados. Puedes recolectarlos tú o comprarlos en el mercado.',
      ],
    },
    {
      title: 'Subir un oficio de fabricación',
      icon: Hammer,
      content: [
        'Los oficios de fabricación se suben con sus recetas de subida: una por cada rango de 10 niveles, desde tosca (niveles 2–10) hasta ancestral (150–160). Cada oficio tiene su objeto: la Placa para el Armero (Placa tosca, Placa preciosa, Placa infernal…), la Fibra para el Sastre, el Aceite para el Panadero, la Especia para el Cocinero, la Gema para el Joyero, el Cuero para el Peletero, la Escuadrita para el Ebanista y el Mango para el Maestro de armas.',
        'Cada crafteo usa dos recursos: 5 de cada uno (4 para el Peletero). La XP por crafteo aparece en la descripción de la receta en el juego.',
        'La XP necesaria crece en cada rango: 7.500 XP del nivel 2 al 10 y luego 15.000 más en cada rango, hasta 232.500 XP del nivel 150 al 160.',
        'Ejemplo: un Armero que pasa de 140 a 150 con 150 XP por crafteo necesita 217.500 / 150 = 1.450 crafteos de Placa infernal, es decir 7.250 de cada uno de sus dos recursos. La Calculadora XP hace esta cuenta para cualquier oficio y rango, y abre la lista de compras completa en la Guía de crafteo con un clic.',
      ],
    },
    {
      title: 'Subir un oficio de recolección',
      icon: Sprout,
      content: [
        'La recolección no tiene una fórmula fija: por eso no hay calculadora de recolección en este sitio. La XP de cada recolección depende de varias cosas:',
        'El nivel del recurso: los recursos muy por debajo de tu nivel dan menos XP. Además, un mismo recurso se encuentra en zonas distintas.',
        'Los recursos shiny: las versiones shiny, más raras, dan más XP.',
        'La satisfacción del jefe del clan de la zona: la XP también depende de lo satisfecho que esté el jefe del clan de la zona donde recolectas.',
        'La cantidad de recursos: una zona puede agotarse. A menudo conviene recolectar en una zona 5–10 niveles más baja donde haya muchos recursos, sobre todo si también los necesitas para un oficio de fabricación.',
      ],
    },
    {
      title: 'De los recursos a los crafteos',
      icon: ShoppingCart,
      content: [
        'Antes de una sesión de subida, calcula lo que necesitas. En la Calculadora XP, el resultado muestra los recursos reales de la receta con las cantidades totales; «Lista de compras para estos crafteos» los abre en la Guía de crafteo.',
        'La Guía de crafteo sirve para cualquier objeto fabricable: añade uno o varios objetos con sus cantidades y crea una sola lista de compras. Al desplegar un ingrediente fabricable se sustituye por sus propios ingredientes, y puedes marcar cada línea a medida que lo consigues.',
        'Usa «Compartir lista» para enviar la lista a un amigo o a tu gremio, por ejemplo cuando varios farmean para los mismos crafteos.',
      ],
    },
    {
      title: 'Consejos',
      icon: Lightbulb,
      content: [
        'Comprueba la XP por crafteo en el juego antes de planificar: es el único dato que la calculadora te pide, y decide cuántos crafteos haces.',
        'Recolecta y fabrica a la vez: subir un oficio de recolección con los recursos que necesita tu oficio de fabricación ahorra tiempo y kamas.',
        'Compara recolectar y comprar. Para cantidades grandes (miles de recursos a nivel alto), el mercado puede ser más rápido que recolectarlo todo tú.',
      ],
    },
  ],
  cta: { before: '¿Listo para planificar tus próximos niveles? Abre la ', link: 'Calculadora XP', after: ' y elige tu oficio y tu rango.' },
};

const pt: GuideContent = {
  title: 'Guia de profissões do Wakfu para iniciantes',
  description: 'Como funcionam as profissões do Wakfu: profissões de coleta e de fabricação, como upar uma profissão de fabricação com as receitas de upar e o que muda o XP da coleta.',
  backToGuides: 'Voltar aos guias',
  lastUpdated: 'Última atualização: 29 de setembro de 2026',
  sections: [
    {
      title: 'Dois tipos de profissões',
      icon: BookOpen,
      content: [
        'O Wakfu tem 6 profissões de coleta e 8 profissões de fabricação. As de coleta recolhem recursos pelo mundo: plantações, árvores, plantas, minérios, criaturas e peixes. As de fabricação transformam esses recursos em equipamentos, comida e outros itens: Armeiro, Padeiro, Chef, Faz-Tudo, Joalheiro, Coureiro, Alfaiate e Mestre de Armas.',
        'As duas andam juntas: as receitas de fabricação, incluindo as que servem para upar, são feitas com recursos coletados. Você pode coletá-los ou comprá-los no mercado.',
      ],
    },
    {
      title: 'Upando uma profissão de fabricação',
      icon: Hammer,
      content: [
        'As profissões de fabricação sobem com as receitas de upar: uma para cada faixa de 10 níveis, de Grosseira (níveis 2–10) até Ancestral (150–160). Cada profissão tem o seu item: a Placa para o Armeiro (Placa Grosseira, Placa preciosa, Placa Infernal…), a Fibra para o Alfaiate, o Óleo para o Padeiro, a Especiaria para o Chef, a Gema para o Joalheiro, o Couro para o Coureiro, o Esquadro para o Faz-Tudo e o Cabo para o Mestre de Armas.',
        'Cada craft usa dois recursos: 5 de cada (4 para o Coureiro). O XP por craft aparece na descrição da receita no jogo.',
        'O XP necessário cresce a cada faixa: 7.500 XP do nível 2 ao 10 e depois 15.000 a mais em cada faixa, até 232.500 XP do nível 150 ao 160.',
        'Exemplo: um Armeiro que vai do 140 ao 150 com 150 XP por craft precisa de 217.500 / 150 = 1.450 crafts de Placa Infernal, ou seja 7.250 de cada um dos dois recursos. A Calculadora XP faz essa conta para qualquer profissão e faixa, e abre a lista de compras completa no Guia de craft com um clique.',
      ],
    },
    {
      title: 'Upando uma profissão de coleta',
      icon: Sprout,
      content: [
        'A coleta não tem uma fórmula fixa: por isso não há calculadora de coleta neste site. O XP de cada coleta depende de várias coisas:',
        'O nível do recurso: recursos bem abaixo do seu nível dão menos XP. E o mesmo recurso aparece em zonas diferentes.',
        'Recursos shiny: as versões shiny, mais raras, dão mais XP.',
        'A satisfação do chefe do clã da área: o XP também depende de quão satisfeito está o chefe do clã da zona onde você coleta.',
        'A quantidade de recursos: uma zona pode se esgotar. Muitas vezes vale mais coletar numa zona 5–10 níveis abaixo onde há muitos recursos, principalmente se você também precisa deles para uma profissão de fabricação.',
      ],
    },
    {
      title: 'Dos recursos aos crafts',
      icon: ShoppingCart,
      content: [
        'Antes de uma sessão de upar, calcule o que você precisa. Na Calculadora XP, o resultado mostra os recursos reais da receita com as quantidades totais; "Lista de compras para esses crafts" abre tudo no Guia de craft.',
        'O Guia de craft funciona para qualquer item fabricável: adicione um ou mais itens com as quantidades e ele cria uma única lista de compras. Expandir um ingrediente fabricável o substitui pelos próprios ingredientes, e você pode marcar cada linha conforme consegue.',
        'Use "Compartilhar lista" para mandar a lista a um amigo ou à sua guilda, por exemplo quando vários jogadores farmam para os mesmos crafts.',
      ],
    },
    {
      title: 'Dicas',
      icon: Lightbulb,
      content: [
        'Confira o XP por craft no jogo antes de planejar: é o único número que a calculadora pede, e ele decide quantos crafts você faz.',
        'Colete e fabrique juntos: upar uma profissão de coleta com os recursos que a sua profissão de fabricação precisa economiza tempo e kamas.',
        'Compare coletar e comprar. Para grandes quantidades (milhares de recursos em nível alto), o mercado pode ser mais rápido do que coletar tudo sozinho.',
      ],
    },
  ],
  cta: { before: 'Pronto para planejar seus próximos níveis? Abra a ', link: 'Calculadora XP', after: ' e escolha sua profissão e faixa.' },
};

export const beginnersGuideContent: Record<'en' | 'fr' | 'es' | 'pt', GuideContent> = { en, fr, es, pt };
