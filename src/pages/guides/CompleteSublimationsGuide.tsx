import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Shield, Zap, Star } from 'lucide-react';
import { type Language } from '../../constants/translations';

interface CompleteSublimationsGuideProps {
  language: Language;
}

export function CompleteSublimationsGuide({ language }: CompleteSublimationsGuideProps) {
  const content = {
    en: {
      title: 'Complete Sublimations Guide',
      description: 'Master Wakfu\'s sublimation system. Learn about rarity tiers, slot types, and build optimization strategies.',
      backToGuides: 'Back to Guides',
      lastUpdated: 'Last Updated: January 23, 2026',
      sections: [
        {
          title: 'What are Sublimations?',
          icon: Sparkles,
          content: [
            'Sublimations are special power-ups that significantly enhance your character\'s abilities in Wakfu. They are one of the most important aspects of endgame character optimization, often making the difference between an average and an exceptional build.',
            'Unlike equipment that can be freely changed, sublimations are slotted into dedicated positions and provide passive or active bonuses. These bonuses range from stat increases to special effects that trigger during combat.',
            'The sublimation system allows for deep customization. Two characters of the same class can play completely differently based on their sublimation choices. This guide will help you understand how to optimize your sublimation setup for maximum effectiveness.'
          ]
        },
        {
          title: 'Understanding Rarity Tiers',
          icon: Star,
          content: [
            'Sublimations come in five rarity tiers: Common (White), Rare (Green), Epic (Blue), Legendary (Orange), and Mythic (Red). Each tier represents a significant power increase and different acquisition methods.',
            'Common and Rare sublimations are relatively easy to obtain and provide basic stat bonuses. They are perfect for players just starting to build their character and provide a solid foundation.',
            'Epic sublimations are where specialization begins. These offer more substantial bonuses and sometimes unique effects. Most competitive builds incorporate several Epic sublimations strategically chosen for their specific benefits.',
            'Legendary sublimations are powerful and rare. They often provide game-changing effects and are highly sought after. A single Legendary sublimation can define an entire build strategy.',
            'Mythic sublimations are the rarest and most powerful. They provide extraordinary bonuses and are typically obtained through the most challenging content. Only a few Mythic sublimations can be equipped simultaneously due to slot restrictions.'
          ]
        },
        {
          title: 'Slot Types Explained',
          icon: Shield,
          content: [
            'Characters have multiple sublimation slots, categorized by color: White, Green, Blue, Red, Yellow, and special Relic slots. Understanding these slot types is crucial for building effective setups.',
            'White slots accept any Common sublimation. These are your foundational slots, typically filled with basic stat boosts appropriate to your class and playstyle.',
            'Green slots accept Rare sublimations. These provide more substantial bonuses than Commons and allow you to start specializing your build toward specific strengths.',
            'Blue slots are for Epic sublimations. This is where your build really starts to take shape. Choose Epics that synergize with your class abilities and overall strategy.',
            'Red and Yellow slots accept Legendary and Mythic sublimations respectively. These slots define your build\'s unique characteristics and provide your most powerful bonuses.',
            'Relic slots are special slots tied to Relic weapons. These powerful slots can accept specific high-tier sublimations and are a major reason why Relic weapons are so sought after in endgame content.'
          ]
        },
        {
          title: 'Building Your First Sublimation Setup',
          icon: Zap,
          content: [
            'For beginners, start by filling all available slots with appropriate rarity sublimations. Even Common sublimations provide valuable stat boosts. Don\'t leave slots empty!',
            'Consider your character\'s primary role. Damage dealers should prioritize offensive stats like damage increases, critical hit chance, and armor penetration. Tanks need defensive sublimations focusing on resistances, HP, and damage mitigation. Support classes benefit from healing boosts and AP/MP management.',
            'Look for sublimations that synergize with your class mechanics. Each Wakfu class has unique abilities, and certain sublimations complement specific classes better than others. For example, classes that rely on positioning benefit from movement-related sublimations.',
            'As you acquire higher-tier sublimations, don\'t simply replace lower-tier ones without consideration. Sometimes a well-chosen Rare sublimation provides more value for your specific build than a random Epic. Always evaluate based on your overall strategy.',
            'Use our Sublimations Database to filter by class, role, and rarity. You can compare different options and plan your ideal setup before investing resources in acquiring specific sublimations.'
          ]
        },
        {
          title: 'Advanced Optimization Strategies',
          content: [
            'Once you have a solid base of sublimations, optimization becomes about synergy and min-maxing. Look for combinations where sublimations amplify each other\'s effects.',
            'Consider breakpoints. Some game mechanics have thresholds where additional investment provides diminishing returns. For example, critical hit damage becomes less valuable once you\'ve reached very high critical chance. Balance your stats appropriately.',
            'PvE and PvP often require different sublimation setups. PvE content rewards sustained damage and survivability, while PvP demands burst potential and counterplay tools. Serious players maintain multiple sublimation sets for different scenarios.',
            'Legendary and Mythic sublimations often have unique mechanics that can define entire playstyles. Some provide powerful on-kill effects useful in PvE, others offer defensive triggers valuable in PvP. Choose based on your primary content focus.',
            'Don\'t neglect secondary stats. While primary offensive or defensive stats are important, secondary stats like initiative, lock, and dodge can provide significant strategic advantages that win fights.',
            'Remember that the meta evolves. Game balance patches can change sublimation effectiveness. Stay informed about community discussions and be willing to adapt your setup as the game develops.'
          ]
        },
        {
          title: 'Acquiring Sublimations',
          content: [
            'Sublimations are obtained through various methods. Common and Rare sublimations drop from regular monsters and are often tradeable on the marketplace, making them accessible to all players.',
            'Epic sublimations typically come from more challenging content like dungeons and elite monsters. They require more effort to obtain but are still reasonably accessible with consistent play.',
            'Legendary sublimations are rare drops from endgame content including high-level dungeons, world bosses, and special events. Expect to invest significant time to acquire specific Legendary sublimations.',
            'Mythic sublimations are obtained from the most challenging content in the game. Ultimate bosses, rare world spawns, and sometimes limited-time events provide these extraordinary items.',
            'The marketplace is a viable option for many sublimations. If you\'re struggling to obtain a specific sublimation through drops, consider farming currency and purchasing it instead. Time spent efficiently farming is often faster than repeatedly attempting low-probability drops.',
            'Some sublimations are crafted or obtained through profession-related systems. Check our Items Craft Guide to see if desired sublimations have crafting recipes available.'
          ]
        },
        {
          title: 'Common Mistakes to Avoid',
          content: [
            'Mistake 1: Ignoring lower-tier sublimations. Even Common sublimations provide value. Fill all your slots before worrying about perfection.',
            'Mistake 2: Chasing a single Legendary without considering the overall build. A cohesive set of Epics often outperforms one Legendary with poor synergy.',
            'Mistake 3: Copying builds without understanding them. What works for one player may not suit your playstyle or available resources. Adapt builds to your situation.',
            'Mistake 4: Neglecting to upgrade sublimations as you progress. As you level up and access new content, regularly reassess your sublimation setup.',
            'Mistake 5: Focusing purely on offensive stats. Survivability and utility sublimations often provide more overall value than pure damage increases, especially in challenging content.',
            'Mistake 6: Not experimenting. The sublimation system is designed for customization. Try different combinations, test them in combat, and find what works best for your playstyle.'
          ]
        },
        {
          title: 'Next Steps',
          content: [
            'Ready to optimize your character? Visit our Sublimations Database to explore all available sublimations. Use the filters to find options perfect for your class and playstyle.',
            'Check out our other guides for complementary information. Understanding professions and crafting helps you obtain resources for sublimation upgrades. Learning about the rarity system helps you evaluate drop chances.',
            'Join the Wakfu community to discuss builds and strategies. Experienced players often share their sublimation setups and can provide class-specific advice.',
            'Remember: sublimation optimization is an ongoing process. As you acquire new sublimations and experience different content, continue refining your setup. The perfect build evolves with your progression!'
          ]
        }
      ]
    },
    fr: {
      title: 'Guide Complet des Sublimations',
      description: 'Maîtrisez le système de sublimation de Wakfu. Apprenez les niveaux de rareté, types de slots et stratégies d\'optimisation.',
      backToGuides: 'Retour aux Guides',
      lastUpdated: 'Dernière mise à jour : 23 janvier 2026',
      sections: [
        {
          title: 'Que sont les Sublimations ?',
          icon: Sparkles,
          content: [
            'Les sublimations sont des améliorations spéciales qui renforcent significativement les capacités de votre personnage dans Wakfu. Elles sont l\'un des aspects les plus importants de l\'optimisation de personnage endgame.',
            'Contrairement à l\'équipement qui peut être librement changé, les sublimations sont insérées dans des positions dédiées et fournissent des bonus passifs ou actifs.',
            'Le système de sublimation permet une personnalisation profonde. Deux personnages de la même classe peuvent jouer complètement différemment selon leurs choix de sublimations.'
          ]
        },
        {
          title: 'Comprendre les Niveaux de Rareté',
          icon: Star,
          content: [
            'Les sublimations viennent en cinq niveaux de rareté : Commun (Blanc), Rare (Vert), Épique (Bleu), Légendaire (Orange), et Mythique (Rouge). Chaque niveau représente une augmentation de puissance significative.',
            'Les sublimations Communes et Rares sont relativement faciles à obtenir et fournissent des bonus de stats basiques. Elles sont parfaites pour les joueurs qui commencent à construire leur personnage.',
            'Les sublimations Épiques sont où la spécialisation commence. Elles offrent des bonus plus substantiels et parfois des effets uniques. La plupart des builds compétitifs incorporent plusieurs sublimations Épiques.',
            'Les sublimations Légendaires sont puissantes et rares. Elles offrent souvent des effets qui changent la donne. Une seule sublimation Légendaire peut définir une stratégie de build entière.',
            'Les sublimations Mythiques sont les plus rares et les plus puissantes. Elles fournissent des bonus extraordinaires et sont typiquement obtenues à travers le contenu le plus difficile.'
          ]
        },
        {
          title: 'Types de Slots Expliqués',
          icon: Shield,
          content: [
            'Les personnages ont plusieurs emplacements de sublimation, catégorisés par couleur : Blanc, Vert, Bleu, Rouge, Jaune, et emplacements Reliques spéciaux.',
            'Les emplacements Blancs acceptent toute sublimation Commune. Ce sont vos emplacements fondamentaux, typiquement remplis avec des augmentations de stats basiques.',
            'Les emplacements Verts acceptent les sublimations Rares. Elles fournissent des bonus plus substantiels que les Communes.',
            'Les emplacements Bleus sont pour les sublimations Épiques. C\'est là que votre build commence vraiment à prendre forme.',
            'Les emplacements Rouges et Jaunes acceptent les sublimations Légendaires et Mythiques respectivement. Ces emplacements définissent les caractéristiques uniques de votre build.',
            'Les emplacements Reliques sont des emplacements spéciaux liés aux armes Reliques. Ces emplacements puissants peuvent accepter des sublimations de haut niveau spécifiques.'
          ]
        },
        {
          title: 'Construire Votre Premier Setup de Sublimations',
          icon: Zap,
          content: [
            'Pour les débutants, commencez par remplir tous les emplacements disponibles avec des sublimations de rareté appropriée. Même les sublimations Communes fournissent de précieux bonus de stats.',
            'Considérez le rôle principal de votre personnage. Les dealers de dégâts devraient prioriser les stats offensives. Les tanks ont besoin de sublimations défensives. Les classes de support bénéficient des boosts de soin.',
            'Cherchez des sublimations qui se synchronisent avec les mécaniques de votre classe. Chaque classe Wakfu a des capacités uniques, et certaines sublimations complètent mieux des classes spécifiques.',
            'En acquérant des sublimations de niveau supérieur, ne remplacez pas simplement les sublimations de niveau inférieur sans considération. Parfois une sublimation Rare bien choisie fournit plus de valeur qu\'une Épique aléatoire.',
            'Utilisez notre Base de Données de Sublimations pour filtrer par classe, rôle et rareté. Vous pouvez comparer différentes options et planifier votre setup idéal.'
          ]
        },
        {
          title: 'Stratégies d\'Optimisation Avancées',
          content: [
            'Une fois que vous avez une base solide de sublimations, l\'optimisation devient une question de synergie et de min-maxing. Cherchez des combinaisons où les sublimations amplifient les effets les unes des autres.',
            'Considérez les seuils. Certaines mécaniques de jeu ont des paliers où l\'investissement supplémentaire fournit des rendements décroissants.',
            'Le PvE et le PvP nécessitent souvent des setups de sublimations différents. Le contenu PvE récompense les dégâts soutenus et la survivabilité, tandis que le PvP exige un potentiel de burst.',
            'Les sublimations Légendaires et Mythiques ont souvent des mécaniques uniques qui peuvent définir des styles de jeu entiers.',
            'Ne négligez pas les stats secondaires. Bien que les stats offensives ou défensives primaires soient importantes, les stats secondaires comme l\'initiative peuvent fournir des avantages stratégiques significatifs.',
            'Rappelez-vous que la méta évolue. Les patchs d\'équilibrage du jeu peuvent changer l\'efficacité des sublimations. Restez informé des discussions de la communauté.'
          ]
        },
        {
          title: 'Acquérir des Sublimations',
          content: [
            'Les sublimations sont obtenues par diverses méthodes. Les sublimations Communes et Rares tombent des monstres réguliers et sont souvent échangeables sur le marché.',
            'Les sublimations Épiques proviennent typiquement de contenu plus difficile comme les donjons et les monstres élites.',
            'Les sublimations Légendaires sont des drops rares de contenu endgame incluant des donjons de haut niveau, boss mondiaux et événements spéciaux.',
            'Les sublimations Mythiques sont obtenues du contenu le plus difficile du jeu. Boss ultimes, spawns mondiaux rares et parfois événements limités dans le temps fournissent ces objets extraordinaires.',
            'Le marché est une option viable pour de nombreuses sublimations. Si vous avez du mal à obtenir une sublimation spécifique par drops, considérez farmer de la monnaie et l\'acheter à la place.',
            'Certaines sublimations sont craftées ou obtenues via des systèmes liés aux professions. Vérifiez notre Guide de Craft d\'Objets.'
          ]
        },
        {
          title: 'Erreurs Courantes à Éviter',
          content: [
            'Erreur 1 : Ignorer les sublimations de niveau inférieur. Même les sublimations Communes fournissent de la valeur. Remplissez tous vos emplacements avant de vous soucier de la perfection.',
            'Erreur 2 : Poursuivre une seule Légendaire sans considérer le build global. Un set cohésif d\'Épiques surpasse souvent une Légendaire avec une mauvaise synergie.',
            'Erreur 3 : Copier des builds sans les comprendre. Ce qui fonctionne pour un joueur peut ne pas convenir à votre style de jeu.',
            'Erreur 4 : Négliger de mettre à niveau les sublimations au fur et à mesure de votre progression.',
            'Erreur 5 : Se concentrer purement sur les stats offensives. Les sublimations de survivabilité et d\'utilité fournissent souvent plus de valeur globale.',
            'Erreur 6 : Ne pas expérimenter. Le système de sublimation est conçu pour la personnalisation. Essayez différentes combinaisons.'
          ]
        },
        {
          title: 'Prochaines Étapes',
          content: [
            'Prêt à optimiser votre personnage ? Visitez notre Base de Données de Sublimations pour explorer toutes les sublimations disponibles.',
            'Consultez nos autres guides pour des informations complémentaires. Comprendre les professions et le craft vous aide à obtenir des ressources pour les améliorations de sublimation.',
            'Rejoignez la communauté Wakfu pour discuter des builds et stratégies. Les joueurs expérimentés partagent souvent leurs setups de sublimations.',
            'Rappelez-vous : l\'optimisation des sublimations est un processus continu. Continuez à affiner votre setup au fur et à mesure de votre progression !'
          ]
        }
      ]
    },
    es: {
      title: 'Guía Completa de Sublimaciones',
      description: 'Domina el sistema de sublimación de Wakfu. Aprende sobre niveles de rareza, tipos de ranura y estrategias de optimización.',
      backToGuides: 'Volver a Guías',
      lastUpdated: 'Última actualización: 23 de enero de 2026',
      sections: [
        {
          title: '¿Qué son las Sublimaciones?',
          icon: Sparkles,
          content: [
            'Las sublimaciones son mejoras especiales que mejoran significativamente las habilidades de tu personaje en Wakfu. Son uno de los aspectos más importantes de la optimización de personajes endgame.',
            'A diferencia del equipo que puede cambiarse libremente, las sublimaciones se insertan en posiciones dedicadas y proporcionan bonificaciones pasivas o activas.',
            'El sistema de sublimación permite una personalización profunda. Dos personajes de la misma clase pueden jugar completamente diferente según sus elecciones de sublimaciones.'
          ]
        },
        {
          title: 'Entendiendo los Niveles de Rareza',
          icon: Star,
          content: [
            'Las sublimaciones vienen en cinco niveles de rareza: Común (Blanco), Raro (Verde), Épico (Azul), Legendario (Naranja), y Mítico (Rojo). Cada nivel representa un aumento significativo de poder.',
            'Las sublimaciones Comunes y Raras son relativamente fáciles de obtener y proporcionan bonificaciones de estadísticas básicas. Son perfectas para jugadores que comienzan a construir su personaje.',
            'Las sublimaciones Épicas son donde comienza la especialización. Ofrecen bonificaciones más sustanciales y a veces efectos únicos. La mayoría de builds competitivas incorporan varias sublimaciones Épicas.',
            'Las sublimaciones Legendarias son poderosas y raras. A menudo proporcionan efectos que cambian el juego. Una sola sublimación Legendaria puede definir una estrategia de build completa.',
            'Las sublimaciones Míticas son las más raras y poderosas. Proporcionan bonificaciones extraordinarias y típicamente se obtienen del contenido más desafiante.'
          ]
        },
        {
          title: 'Tipos de Ranura Explicados',
          icon: Shield,
          content: [
            'Los personajes tienen múltiples ranuras de sublimación, categorizadas por color: Blanco, Verde, Azul, Rojo, Amarillo, y ranuras Reliquia especiales.',
            'Las ranuras Blancas aceptan cualquier sublimación Común. Estas son tus ranuras fundamentales, típicamente llenas con aumentos de estadísticas básicos.',
            'Las ranuras Verdes aceptan sublimaciones Raras. Proporcionan bonificaciones más sustanciales que las Comunes.',
            'Las ranuras Azules son para sublimaciones Épicas. Aquí es donde tu build realmente comienza a tomar forma.',
            'Las ranuras Rojas y Amarillas aceptan sublimaciones Legendarias y Míticas respectivamente. Estas ranuras definen las características únicas de tu build.',
            'Las ranuras Reliquia son ranuras especiales vinculadas a armas Reliquia. Estas ranuras poderosas pueden aceptar sublimaciones específicas de alto nivel.'
          ]
        },
        {
          title: 'Construyendo Tu Primera Configuración de Sublimación',
          icon: Zap,
          content: [
            'Para principiantes, comienza llenando todas las ranuras disponibles con sublimaciones de rareza apropiada. Incluso las sublimaciones Comunes proporcionan valiosas bonificaciones de estadísticas.',
            'Considera el rol principal de tu personaje. Los dealers de daño deben priorizar estadísticas ofensivas. Los tanks necesitan sublimaciones defensivas. Las clases de soporte se benefician de boosts de curación.',
            'Busca sublimaciones que se sincronicen con las mecánicas de tu clase. Cada clase de Wakfu tiene habilidades únicas, y ciertas sublimaciones complementan mejor clases específicas.',
            'Al adquirir sublimaciones de nivel superior, no reemplaces simplemente las de nivel inferior sin consideración. A veces una sublimación Rara bien elegida proporciona más valor que una Épica aleatoria.',
            'Usa nuestra Base de Datos de Sublimaciones para filtrar por clase, rol y rareza. Puedes comparar diferentes opciones y planificar tu configuración ideal.'
          ]
        },
        {
          title: 'Estrategias de Optimización Avanzadas',
          content: [
            'Una vez que tienes una base sólida de sublimaciones, la optimización se trata de sinergia y min-maxing. Busca combinaciones donde las sublimaciones amplifiquen los efectos de las demás.',
            'Considera los umbrales. Algunas mecánicas del juego tienen puntos donde la inversión adicional proporciona rendimientos decrecientes.',
            'PvE y PvP a menudo requieren configuraciones de sublimación diferentes. El contenido PvE recompensa el daño sostenido y la supervivencia, mientras que PvP demanda potencial de burst.',
            'Las sublimaciones Legendarias y Míticas a menudo tienen mecánicas únicas que pueden definir estilos de juego completos.',
            'No descuides las estadísticas secundarias. Aunque las estadísticas ofensivas o defensivas primarias son importantes, las estadísticas secundarias como la iniciativa pueden proporcionar ventajas estratégicas significativas.',
            'Recuerda que la meta evoluciona. Los parches de equilibrio del juego pueden cambiar la efectividad de las sublimaciones. Mantente informado sobre las discusiones de la comunidad.'
          ]
        },
        {
          title: 'Adquiriendo Sublimaciones',
          content: [
            'Las sublimaciones se obtienen a través de varios métodos. Las sublimaciones Comunes y Raras caen de monstruos regulares y a menudo son intercambiables en el mercado.',
            'Las sublimaciones Épicas típicamente provienen de contenido más desafiante como mazmorras y monstruos élite.',
            'Las sublimaciones Legendarias son drops raros de contenido endgame incluyendo mazmorras de alto nivel, jefes mundiales y eventos especiales.',
            'Las sublimaciones Míticas se obtienen del contenido más desafiante del juego. Jefes últimos, spawns mundiales raros y a veces eventos de tiempo limitado proporcionan estos objetos extraordinarios.',
            'El mercado es una opción viable para muchas sublimaciones. Si tienes dificultades para obtener una sublimación específica a través de drops, considera farmear moneda y comprarla.',
            'Algunas sublimaciones se crean o se obtienen a través de sistemas relacionados con profesiones. Verifica nuestra Guía de Crafteo de Objetos.'
          ]
        },
        {
          title: 'Errores Comunes a Evitar',
          content: [
            'Error 1: Ignorar sublimaciones de nivel inferior. Incluso las sublimaciones Comunes proporcionan valor. Llena todas tus ranuras antes de preocuparte por la perfección.',
            'Error 2: Perseguir una sola Legendaria sin considerar el build general. Un set cohesivo de Épicas a menudo supera una Legendaria con mala sinergia.',
            'Error 3: Copiar builds sin entenderlos. Lo que funciona para un jugador puede no adaptarse a tu estilo de juego.',
            'Error 4: Descuidar actualizar sublimaciones a medida que progresas.',
            'Error 5: Enfocarse puramente en estadísticas ofensivas. Las sublimaciones de supervivencia y utilidad a menudo proporcionan más valor general.',
            'Error 6: No experimentar. El sistema de sublimación está diseñado para personalización. Prueba diferentes combinaciones.'
          ]
        },
        {
          title: 'Próximos Pasos',
          content: [
            '¿Listo para optimizar tu personaje? Visita nuestra Base de Datos de Sublimaciones para explorar todas las sublimaciones disponibles.',
            'Consulta nuestras otras guías para información complementaria. Entender profesiones y crafteo te ayuda a obtener recursos para mejoras de sublimación.',
            'Únete a la comunidad de Wakfu para discutir builds y estrategias. Los jugadores experimentados a menudo comparten sus configuraciones de sublimaciones.',
            '¡Recuerda: la optimización de sublimaciones es un proceso continuo. Continúa refinando tu configuración a medida que progresas!'
          ]
        }
      ]
    },
    pt: {
      title: 'Guia Completo de Sublimações',
      description: 'Domine o sistema de sublimação do Wakfu. Aprenda sobre níveis de raridade, tipos de slot e estratégias de otimização.',
      backToGuides: 'Voltar aos Guias',
      lastUpdated: 'Última atualização: 23 de janeiro de 2026',
      sections: [
        {
          title: 'O que são Sublimações?',
          icon: Sparkles,
          content: [
            'Sublimações são melhorias especiais que aprimoram significativamente as habilidades do seu personagem no Wakfu. São um dos aspectos mais importantes da otimização de personagens endgame.',
            'Diferente de equipamento que pode ser livremente trocado, sublimações são inseridas em posições dedicadas e fornecem bônus passivos ou ativos.',
            'O sistema de sublimação permite personalização profunda. Dois personagens da mesma classe podem jogar completamente diferente com base em suas escolhas de sublimações.'
          ]
        },
        {
          title: 'Entendendo os Níveis de Raridade',
          icon: Star,
          content: [
            'Sublimações vêm em cinco níveis de raridade: Comum (Branco), Raro (Verde), Épico (Azul), Lendário (Laranja), e Mítico (Vermelho). Cada nível representa um aumento significativo de poder.',
            'Sublimações Comuns e Raras são relativamente fáceis de obter e fornecem bônus de estatísticas básicos. São perfeitas para jogadores começando a construir seu personagem.',
            'Sublimações Épicas são onde a especialização começa. Elas oferecem bônus mais substanciais e às vezes efeitos únicos. A maioria dos builds competitivos incorpora várias sublimações Épicas.',
            'Sublimações Lendárias são poderosas e raras. Frequentemente fornecem efeitos que mudam o jogo. Uma única sublimação Lendária pode definir uma estratégia de build inteira.',
            'Sublimações Míticas são as mais raras e poderosas. Fornecem bônus extraordinários e são tipicamente obtidas através do conteúdo mais desafiador.'
          ]
        },
        {
          title: 'Tipos de Slot Explicados',
          icon: Shield,
          content: [
            'Personagens têm múltiplos slots de sublimação, categorizados por cor: Branco, Verde, Azul, Vermelho, Amarelo, e slots Relíquia especiais.',
            'Slots Brancos aceitam qualquer sublimação Comum. Estes são seus slots fundamentais, tipicamente preenchidos com aumentos de estatísticas básicos.',
            'Slots Verdes aceitam sublimações Raras. Fornecem bônus mais substanciais que Comuns.',
            'Slots Azuis são para sublimações Épicas. É aqui que seu build realmente começa a tomar forma.',
            'Slots Vermelhos e Amarelos aceitam sublimações Lendárias e Míticas respectivamente. Estes slots definem as características únicas do seu build.',
            'Slots Relíquia são slots especiais vinculados a armas Relíquia. Estes slots poderosos podem aceitar sublimações específicas de alto nível.'
          ]
        },
        {
          title: 'Construindo Sua Primeira Configuração de Sublimação',
          icon: Zap,
          content: [
            'Para iniciantes, comece preenchendo todos os slots disponíveis com sublimações de raridade apropriada. Mesmo sublimações Comuns fornecem valiosos bônus de estatísticas.',
            'Considere o papel principal do seu personagem. Dealers de dano devem priorizar estatísticas ofensivas. Tanks precisam de sublimações defensivas. Classes de suporte se beneficiam de boosts de cura.',
            'Procure sublimações que se sincronizam com as mecânicas da sua classe. Cada classe Wakfu tem habilidades únicas, e certas sublimações complementam melhor classes específicas.',
            'Ao adquirir sublimações de nível superior, não simplesmente substitua as de nível inferior sem consideração. Às vezes uma sublimação Rara bem escolhida fornece mais valor que uma Épica aleatória.',
            'Use nosso Banco de Dados de Sublimações para filtrar por classe, função e raridade. Você pode comparar diferentes opções e planejar sua configuração ideal.'
          ]
        },
        {
          title: 'Estratégias de Otimização Avançadas',
          content: [
            'Uma vez que você tem uma base sólida de sublimações, a otimização se torna sobre sinergia e min-maxing. Procure combinações onde sublimações amplificam os efeitos umas das outras.',
            'Considere pontos de quebra. Algumas mecânicas do jogo têm limites onde investimento adicional fornece retornos decrescentes.',
            'PvE e PvP frequentemente requerem configurações de sublimação diferentes. Conteúdo PvE recompensa dano sustentado e sobrevivência, enquanto PvP exige potencial de burst.',
            'Sublimações Lendárias e Míticas frequentemente têm mecânicas únicas que podem definir estilos de jogo completos.',
            'Não negligencie estatísticas secundárias. Embora estatísticas ofensivas ou defensivas primárias sejam importantes, estatísticas secundárias como iniciativa podem fornecer vantagens estratégicas significativas.',
            'Lembre-se que a meta evolui. Patches de balanceamento do jogo podem mudar a efetividade das sublimações. Fique informado sobre discussões da comunidade.'
          ]
        },
        {
          title: 'Adquirindo Sublimações',
          content: [
            'Sublimações são obtidas através de vários métodos. Sublimações Comuns e Raras caem de monstros regulares e são frequentemente negociáveis no mercado.',
            'Sublimações Épicas tipicamente vêm de conteúdo mais desafiador como masmorras e monstros elite.',
            'Sublimações Lendárias são drops raros de conteúdo endgame incluindo masmorras de alto nível, chefes mundiais e eventos especiais.',
            'Sublimações Míticas são obtidas do conteúdo mais desafiador do jogo. Chefes últimos, spawns mundiais raros e às vezes eventos de tempo limitado fornecem estes itens extraordinários.',
            'O mercado é uma opção viável para muitas sublimações. Se você está tendo dificuldades para obter uma sublimação específica através de drops, considere farmear moeda e comprá-la.',
            'Algumas sublimações são criadas ou obtidas através de sistemas relacionados a profissões. Verifique nosso Guia de Crafting de Itens.'
          ]
        },
        {
          title: 'Erros Comuns a Evitar',
          content: [
            'Erro 1: Ignorar sublimações de nível inferior. Mesmo sublimações Comuns fornecem valor. Preencha todos os seus slots antes de se preocupar com perfeição.',
            'Erro 2: Perseguir uma única Lendária sem considerar o build geral. Um set coesivo de Épicas frequentemente supera uma Lendária com má sinergia.',
            'Erro 3: Copiar builds sem entendê-los. O que funciona para um jogador pode não se adequar ao seu estilo de jogo.',
            'Erro 4: Negligenciar atualizar sublimações conforme você progride.',
            'Erro 5: Focar puramente em estatísticas ofensivas. Sublimações de sobrevivência e utilidade frequentemente fornecem mais valor geral.',
            'Erro 6: Não experimentar. O sistema de sublimação é projetado para personalização. Experimente diferentes combinações.'
          ]
        },
        {
          title: 'Próximos Passos',
          content: [
            'Pronto para otimizar seu personagem? Visite nosso Banco de Dados de Sublimações para explorar todas as sublimações disponíveis.',
            'Confira nossos outros guias para informações complementares. Entender profissões e crafting ajuda você a obter recursos para melhorias de sublimação.',
            'Junte-se à comunidade Wakfu para discutir builds e estratégias. Jogadores experientes frequentemente compartilham suas configurações de sublimações.',
            'Lembre-se: otimização de sublimações é um processo contínuo. Continue refinando sua configuração conforme você progride!'
          ]
        }
      ]
    }
  };

  const pageContent = content[language];

  return (
    <HelmetProvider>
      <Helmet>
        <title>{pageContent.title} - Wakfu Job Calculator</title>
        <meta name="description" content={pageContent.description} />
        <meta name="keywords" content="Wakfu sublimations, Wakfu builds, Wakfu character optimization, sublimation guide, Wakfu endgame" />
      </Helmet>

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{pageContent.backToGuides}</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-2">
            {pageContent.title}
          </h1>
          <p className="text-cyan-100/60 text-sm mb-8">{pageContent.lastUpdated}</p>

          <div className="space-y-10">
            {pageContent.sections.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  {IconComponent && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-cyan-300" />
                      </div>
                      <h2 className="text-2xl font-bold text-cyan-200">
                        {section.title}
                      </h2>
                    </div>
                  )}
                  {!IconComponent && (
                    <h2 className="text-2xl font-bold text-cyan-200 mb-4">
                      {section.title}
                    </h2>
                  )}

                  <div className="space-y-4">
                    {section.content.map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-cyan-100/80 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
            <p className="text-center text-cyan-200/90">
              Explore our{' '}
              <Link to="/sublimations" className="text-cyan-300 font-bold hover:underline">
                Sublimations Database
              </Link>{' '}
              to find the perfect sublimations for your build!
            </p>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}
