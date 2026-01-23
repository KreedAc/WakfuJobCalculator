import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Hammer, Sprout, Package } from 'lucide-react';
import { type Language } from '../../constants/translations';

interface BeginnersGuideProfessionsProps {
  language: Language;
}

export function BeginnersGuideProfessions({ language }: BeginnersGuideProfessionsProps) {
  const content = {
    en: {
      title: 'Beginner\'s Guide to Wakfu Professions',
      description: 'Complete guide for starting your crafting journey in Wakfu. Learn about professions, harvesting, and crafting basics.',
      backToGuides: 'Back to Guides',
      lastUpdated: 'Last Updated: January 23, 2026',
      sections: [
        {
          title: 'Understanding the Profession System',
          icon: BookOpen,
          content: [
            'Wakfu features a comprehensive profession system that allows players to gather resources and craft items. Unlike many MMORPGs, Wakfu\'s economy is primarily player-driven, making professions essential for character progression.',
            'Each character can learn multiple professions simultaneously. There are two main categories: harvesting professions and crafting professions. Harvesting professions allow you to gather raw materials from the world, while crafting professions let you transform those materials into useful items.',
            'Professions level from 1 to 200, with each level unlocking new recipes and gathering opportunities. The XP required increases significantly at higher levels, but our calculator can help you plan your progression efficiently.'
          ]
        },
        {
          title: 'Harvesting Professions',
          icon: Sprout,
          content: [
            'Harvesting professions are your gateway to gathering raw materials. These are fundamental to the Wakfu economy and essential for crafting.',
            'There are multiple harvesting professions available, each focusing on different types of resources. Some harvest plants and herbs, others mine ores, cut trees, or gather from creatures.',
            'To begin harvesting, find resource nodes in the world. Your harvesting level determines which resources you can gather. Lower-level resources are found in starting zones, while rare and valuable resources require high-level harvesting skills and appear in dangerous areas.',
            'Pro tip: Resource nodes respawn over time, and their locations are consistent. Learning popular farming routes can significantly speed up your resource gathering. Always carry tools appropriate to your harvesting profession when exploring.'
          ]
        },
        {
          title: 'Crafting Professions',
          icon: Hammer,
          content: [
            'Crafting professions transform raw materials into equipment, consumables, and other valuable items. Each crafting profession specializes in creating specific types of items.',
            'To craft an item, you need the appropriate recipe, required materials, and a crafting station. Crafting stations are found in most major cities and some outposts. Higher-level recipes may require rare materials or special crafting locations.',
            'When you craft an item, you gain profession XP based on the recipe\'s level and complexity. Crafting items close to your current level provides optimal XP gains. Our XP calculator helps you find the most efficient recipes for your current level.',
            'Many crafted items are essential for endgame content. Relic weapons, high-level equipment, and consumables used in dungeons all come from crafting professions. As you level up, you\'ll gain access to increasingly powerful recipes.'
          ]
        },
        {
          title: 'Choosing Your First Professions',
          icon: Package,
          content: [
            'For beginners, we recommend starting with one harvesting profession and one crafting profession that complement each other. This creates a self-sufficient cycle where you gather materials to craft items.',
            'Consider your character class and playstyle when choosing professions. If you play a melee class, armor crafting might be valuable. Mages might prefer professions that create magical items. Support classes often benefit from consumable-crafting professions.',
            'Popular beginner combinations include: Herbalist with Chef for consumable creation, Miner with Armorer for defensive equipment, or Lumberjack with Carpenter for various items. These combinations provide immediate utility and good XP progression.',
            'Don\'t worry too much about your initial choice. You can always learn additional professions later. Focus on learning the system mechanics first, then optimize as you understand the economy better.'
          ]
        },
        {
          title: 'Leveling Strategy',
          content: [
            'Efficient leveling requires planning. Use our profession calculator to identify which recipes provide the best XP per material invested. Often, the most efficient path isn\'t obvious without calculations.',
            'At lower levels, craft items you can actually use or sell. This provides value beyond just XP. As you reach mid-levels, focus purely on XP efficiency, even if it means crafting items with little market value.',
            'Resource management becomes critical around level 100. Higher-level recipes require significant material investments. Consider the market prices when deciding which path to take. Sometimes buying materials is more time-efficient than gathering.',
            'Join a guild with a workshop. Guild workshops often provide bonuses to crafting speed or success rates. Additionally, experienced guild members can offer advice and sometimes share resources.'
          ]
        },
        {
          title: 'Common Beginner Mistakes',
          content: [
            'Mistake 1: Spreading too thin. While you can learn all professions, trying to level multiple crafting professions simultaneously will slow your progress significantly. Focus on 1-2 professions initially.',
            'Mistake 2: Ignoring the market. Check marketplace prices before crafting large quantities. Sometimes gathering and selling raw materials is more profitable than crafting.',
            'Mistake 3: Not using the calculator. Wakfu\'s XP curves are non-linear. What seems efficient might actually waste resources. Our calculator eliminates guesswork.',
            'Mistake 4: Neglecting harvesting professions. Even if you plan to buy materials, having a harvesting profession provides passive income while playing normally.',
            'Mistake 5: Rushing to endgame crafts. Each level range teaches important lessons about resource management and market dynamics. Take time to understand the economy.'
          ]
        },
        {
          title: 'Next Steps',
          content: [
            'Now that you understand the basics, visit our XP Calculator to plan your profession leveling path. Input your current level and target level to see exactly which recipes to craft.',
            'Explore our Items Craft Guide to browse available recipes and plan your material requirements. Understanding what you\'ll need helps you gather efficiently.',
            'Check the Sublimations page to understand endgame character optimization. Many powerful sublimations require crafted items, making professions essential for competitive play.',
            'Remember: Wakfu\'s profession system rewards patience and planning. Use our tools to make informed decisions, and you\'ll progress efficiently while building a profitable crafting empire.'
          ]
        }
      ]
    },
    fr: {
      title: 'Guide du Débutant : Les Métiers Wakfu',
      description: 'Guide complet pour débuter votre aventure de craft dans Wakfu. Apprenez les métiers, la récolte et les bases du craft.',
      backToGuides: 'Retour aux Guides',
      lastUpdated: 'Dernière mise à jour : 23 janvier 2026',
      sections: [
        {
          title: 'Comprendre le Système de Métiers',
          icon: BookOpen,
          content: [
            'Wakfu propose un système de métiers complet qui permet aux joueurs de récolter des ressources et de créer des objets. Contrairement à beaucoup de MMORPG, l\'économie de Wakfu est principalement gérée par les joueurs, rendant les métiers essentiels pour la progression.',
            'Chaque personnage peut apprendre plusieurs métiers simultanément. Il existe deux catégories principales : les métiers de récolte et les métiers de craft. Les métiers de récolte vous permettent de rassembler des matériaux bruts dans le monde, tandis que les métiers de craft vous permettent de transformer ces matériaux en objets utiles.',
            'Les métiers montent du niveau 1 à 200, chaque niveau débloquant de nouvelles recettes et opportunités de récolte. L\'XP requise augmente significativement aux niveaux supérieurs, mais notre calculateur peut vous aider à planifier votre progression efficacement.'
          ]
        },
        {
          title: 'Métiers de Récolte',
          icon: Sprout,
          content: [
            'Les métiers de récolte sont votre porte d\'entrée pour rassembler des matériaux bruts. Ils sont fondamentaux pour l\'économie de Wakfu et essentiels pour le craft.',
            'Il existe plusieurs métiers de récolte disponibles, chacun se concentrant sur différents types de ressources. Certains récoltent des plantes et herbes, d\'autres minent des minerais, coupent des arbres ou récoltent sur des créatures.',
            'Pour commencer à récolter, trouvez des nœuds de ressources dans le monde. Votre niveau de récolte détermine quelles ressources vous pouvez rassembler. Les ressources de bas niveau se trouvent dans les zones de départ, tandis que les ressources rares nécessitent des compétences de récolte élevées.',
            'Astuce : Les nœuds de ressources réapparaissent avec le temps et leurs emplacements sont cohérents. Apprendre les routes de farm populaires peut considérablement accélérer votre collecte de ressources.'
          ]
        },
        {
          title: 'Métiers de Craft',
          icon: Hammer,
          content: [
            'Les métiers de craft transforment les matériaux bruts en équipement, consommables et autres objets précieux. Chaque métier de craft se spécialise dans la création de types d\'objets spécifiques.',
            'Pour créer un objet, vous avez besoin de la recette appropriée, des matériaux requis et d\'un poste de craft. Les postes de craft se trouvent dans la plupart des grandes villes et certains avant-postes.',
            'Lorsque vous craftez un objet, vous gagnez de l\'XP de métier basée sur le niveau et la complexité de la recette. Créer des objets proches de votre niveau actuel fournit des gains d\'XP optimaux.',
            'De nombreux objets craftés sont essentiels pour le contenu endgame. Les armes reliques, l\'équipement de haut niveau et les consommables utilisés dans les donjons proviennent tous des métiers de craft.'
          ]
        },
        {
          title: 'Choisir Vos Premiers Métiers',
          icon: Package,
          content: [
            'Pour les débutants, nous recommandons de commencer avec un métier de récolte et un métier de craft qui se complètent. Cela crée un cycle autosuffisant où vous récoltez des matériaux pour créer des objets.',
            'Considérez votre classe de personnage et votre style de jeu lors du choix des métiers. Si vous jouez une classe de mêlée, le craft d\'armure peut être précieux. Les mages pourraient préférer des métiers créant des objets magiques.',
            'Combinaisons populaires pour débutants : Herboriste avec Cuisinier pour la création de consommables, Mineur avec Armurier pour l\'équipement défensif, ou Bûcheron avec Menuisier pour divers objets.',
            'Ne vous inquiétez pas trop de votre choix initial. Vous pouvez toujours apprendre des métiers supplémentaires plus tard. Concentrez-vous d\'abord sur l\'apprentissage des mécaniques du système.'
          ]
        },
        {
          title: 'Stratégie de Montée de Niveau',
          content: [
            'Une montée efficace nécessite de la planification. Utilisez notre calculateur de métiers pour identifier quelles recettes fournissent la meilleure XP par matériau investi.',
            'Aux niveaux inférieurs, craftez des objets que vous pouvez réellement utiliser ou vendre. Cela fournit de la valeur au-delà de la simple XP. Aux niveaux moyens, concentrez-vous purement sur l\'efficacité XP.',
            'La gestion des ressources devient critique autour du niveau 100. Les recettes de haut niveau nécessitent des investissements matériels significatifs. Considérez les prix du marché lors de la décision du chemin à prendre.',
            'Rejoignez une guilde avec un atelier. Les ateliers de guilde fournissent souvent des bonus à la vitesse de craft ou aux taux de réussite.'
          ]
        },
        {
          title: 'Erreurs Courantes des Débutants',
          content: [
            'Erreur 1 : Se disperser. Bien que vous puissiez apprendre tous les métiers, essayer de monter plusieurs métiers de craft simultanément ralentira significativement votre progression.',
            'Erreur 2 : Ignorer le marché. Vérifiez les prix du marché avant de crafter de grandes quantités. Parfois, récolter et vendre des matériaux bruts est plus rentable.',
            'Erreur 3 : Ne pas utiliser le calculateur. Les courbes d\'XP de Wakfu sont non linéaires. Ce qui semble efficace peut en fait gaspiller des ressources.',
            'Erreur 4 : Négliger les métiers de récolte. Même si vous prévoyez d\'acheter des matériaux, avoir un métier de récolte fournit un revenu passif.',
            'Erreur 5 : Se précipiter vers le craft endgame. Chaque plage de niveau enseigne des leçons importantes sur la gestion des ressources et la dynamique du marché.'
          ]
        },
        {
          title: 'Prochaines Étapes',
          content: [
            'Maintenant que vous comprenez les bases, visitez notre Calculateur XP pour planifier votre chemin de montée de métier.',
            'Explorez notre Guide de Craft d\'Objets pour parcourir les recettes disponibles et planifier vos besoins en matériaux.',
            'Consultez la page Sublimations pour comprendre l\'optimisation de personnage endgame. De nombreuses sublimations puissantes nécessitent des objets craftés.',
            'Rappelez-vous : Le système de métiers de Wakfu récompense la patience et la planification. Utilisez nos outils pour prendre des décisions éclairées.'
          ]
        }
      ]
    },
    es: {
      title: 'Guía para Principiantes: Profesiones de Wakfu',
      description: 'Guía completa para comenzar tu aventura de crafteo en Wakfu. Aprende sobre profesiones, recolección y conceptos básicos de crafting.',
      backToGuides: 'Volver a Guías',
      lastUpdated: 'Última actualización: 23 de enero de 2026',
      sections: [
        {
          title: 'Entendiendo el Sistema de Profesiones',
          icon: BookOpen,
          content: [
            'Wakfu cuenta con un sistema de profesiones completo que permite a los jugadores recolectar recursos y crear objetos. A diferencia de muchos MMORPG, la economía de Wakfu está principalmente impulsada por jugadores, haciendo las profesiones esenciales para la progresión.',
            'Cada personaje puede aprender múltiples profesiones simultáneamente. Hay dos categorías principales: profesiones de recolección y profesiones de crafteo. Las profesiones de recolección te permiten reunir materiales en bruto del mundo, mientras que las profesiones de crafteo te permiten transformar esos materiales en objetos útiles.',
            'Las profesiones suben del nivel 1 al 200, con cada nivel desbloqueando nuevas recetas y oportunidades de recolección. La XP requerida aumenta significativamente en niveles superiores, pero nuestra calculadora puede ayudarte a planificar tu progresión eficientemente.'
          ]
        },
        {
          title: 'Profesiones de Recolección',
          icon: Sprout,
          content: [
            'Las profesiones de recolección son tu puerta de entrada para reunir materiales en bruto. Son fundamentales para la economía de Wakfu y esenciales para el crafteo.',
            'Hay múltiples profesiones de recolección disponibles, cada una enfocándose en diferentes tipos de recursos. Algunas cosechan plantas y hierbas, otras minan minerales, talan árboles o recolectan de criaturas.',
            'Para comenzar a recolectar, encuentra nodos de recursos en el mundo. Tu nivel de recolección determina qué recursos puedes reunir. Los recursos de bajo nivel se encuentran en zonas iniciales, mientras que los recursos raros requieren habilidades de recolección de alto nivel.',
            'Consejo: Los nodos de recursos reaparecen con el tiempo y sus ubicaciones son consistentes. Aprender rutas de farmeo populares puede acelerar significativamente tu recolección de recursos.'
          ]
        },
        {
          title: 'Profesiones de Crafteo',
          icon: Hammer,
          content: [
            'Las profesiones de crafteo transforman materiales en bruto en equipo, consumibles y otros objetos valiosos. Cada profesión de crafteo se especializa en crear tipos específicos de objetos.',
            'Para craftear un objeto, necesitas la receta apropiada, materiales requeridos y una estación de crafteo. Las estaciones de crafteo se encuentran en la mayoría de las ciudades principales y algunos puestos avanzados.',
            'Cuando crafteas un objeto, ganas XP de profesión basada en el nivel y complejidad de la receta. Craftear objetos cercanos a tu nivel actual proporciona ganancias óptimas de XP.',
            'Muchos objetos crafteados son esenciales para el contenido endgame. Armas reliquia, equipo de alto nivel y consumibles usados en mazmorras provienen todos de profesiones de crafteo.'
          ]
        },
        {
          title: 'Eligiendo Tus Primeras Profesiones',
          icon: Package,
          content: [
            'Para principiantes, recomendamos comenzar con una profesión de recolección y una profesión de crafteo que se complementen. Esto crea un ciclo autosuficiente donde recolectas materiales para crear objetos.',
            'Considera tu clase de personaje y estilo de juego al elegir profesiones. Si juegas una clase de combate cuerpo a cuerpo, el crafteo de armadura puede ser valioso. Los magos podrían preferir profesiones que crean objetos mágicos.',
            'Combinaciones populares para principiantes: Herborista con Cocinero para creación de consumibles, Minero con Armero para equipo defensivo, o Leñador con Carpintero para varios objetos.',
            'No te preocupes demasiado por tu elección inicial. Siempre puedes aprender profesiones adicionales más tarde. Enfócate primero en aprender las mecánicas del sistema.'
          ]
        },
        {
          title: 'Estrategia de Nivelación',
          content: [
            'La nivelación eficiente requiere planificación. Usa nuestra calculadora de profesiones para identificar qué recetas proporcionan la mejor XP por material invertido.',
            'En niveles bajos, craftea objetos que puedas usar o vender. Esto proporciona valor más allá de solo XP. En niveles medios, enfócate puramente en eficiencia de XP.',
            'La gestión de recursos se vuelve crítica alrededor del nivel 100. Las recetas de alto nivel requieren inversiones significativas de materiales. Considera los precios del mercado al decidir qué camino tomar.',
            'Únete a un gremio con un taller. Los talleres de gremio a menudo proporcionan bonificaciones a la velocidad de crafteo o tasas de éxito.'
          ]
        },
        {
          title: 'Errores Comunes de Principiantes',
          content: [
            'Error 1: Dispersarse demasiado. Aunque puedes aprender todas las profesiones, intentar subir múltiples profesiones de crafteo simultáneamente ralentizará significativamente tu progreso.',
            'Error 2: Ignorar el mercado. Verifica los precios del mercado antes de craftear grandes cantidades. A veces recolectar y vender materiales en bruto es más rentable.',
            'Error 3: No usar la calculadora. Las curvas de XP de Wakfu son no lineales. Lo que parece eficiente podría desperdiciar recursos.',
            'Error 4: Descuidar profesiones de recolección. Incluso si planeas comprar materiales, tener una profesión de recolección proporciona ingresos pasivos.',
            'Error 5: Apresurarse hacia crafteo endgame. Cada rango de nivel enseña lecciones importantes sobre gestión de recursos y dinámicas del mercado.'
          ]
        },
        {
          title: 'Próximos Pasos',
          content: [
            'Ahora que entiendes los conceptos básicos, visita nuestra Calculadora XP para planificar tu camino de nivelación de profesión.',
            'Explora nuestra Guía de Crafteo de Objetos para explorar recetas disponibles y planificar tus requisitos de materiales.',
            'Consulta la página de Sublimaciones para entender la optimización de personaje endgame. Muchas sublimaciones poderosas requieren objetos crafteados.',
            'Recuerda: El sistema de profesiones de Wakfu recompensa la paciencia y la planificación. Usa nuestras herramientas para tomar decisiones informadas.'
          ]
        }
      ]
    },
    pt: {
      title: 'Guia para Iniciantes: Profissões do Wakfu',
      description: 'Guia completo para iniciar sua jornada de crafting no Wakfu. Aprenda sobre profissões, coleta e conceitos básicos de crafting.',
      backToGuides: 'Voltar aos Guias',
      lastUpdated: 'Última atualização: 23 de janeiro de 2026',
      sections: [
        {
          title: 'Entendendo o Sistema de Profissões',
          icon: BookOpen,
          content: [
            'Wakfu apresenta um sistema de profissões abrangente que permite aos jogadores coletar recursos e criar itens. Diferente de muitos MMORPGs, a economia do Wakfu é principalmente impulsionada por jogadores, tornando as profissões essenciais para a progressão.',
            'Cada personagem pode aprender múltiplas profissões simultaneamente. Existem duas categorias principais: profissões de coleta e profissões de crafting. Profissões de coleta permitem reunir materiais brutos do mundo, enquanto profissões de crafting permitem transformar esses materiais em itens úteis.',
            'Profissões sobem do nível 1 a 200, com cada nível desbloqueando novas receitas e oportunidades de coleta. A XP requerida aumenta significativamente em níveis superiores, mas nossa calculadora pode ajudá-lo a planejar sua progressão eficientemente.'
          ]
        },
        {
          title: 'Profissões de Coleta',
          icon: Sprout,
          content: [
            'Profissões de coleta são sua porta de entrada para reunir materiais brutos. São fundamentais para a economia do Wakfu e essenciais para o crafting.',
            'Existem múltiplas profissões de coleta disponíveis, cada uma focando em diferentes tipos de recursos. Algumas colhem plantas e ervas, outras mineram minérios, cortam árvores ou coletam de criaturas.',
            'Para começar a coletar, encontre nós de recursos no mundo. Seu nível de coleta determina quais recursos você pode reunir. Recursos de baixo nível são encontrados em zonas iniciais, enquanto recursos raros requerem habilidades de coleta de alto nível.',
            'Dica: Nós de recursos reaparecem com o tempo e suas localizações são consistentes. Aprender rotas de farm populares pode acelerar significativamente sua coleta de recursos.'
          ]
        },
        {
          title: 'Profissões de Crafting',
          icon: Hammer,
          content: [
            'Profissões de crafting transformam materiais brutos em equipamento, consumíveis e outros itens valiosos. Cada profissão de crafting se especializa em criar tipos específicos de itens.',
            'Para criar um item, você precisa da receita apropriada, materiais requeridos e uma estação de crafting. Estações de crafting são encontradas na maioria das grandes cidades e alguns postos avançados.',
            'Quando você cria um item, você ganha XP de profissão baseada no nível e complexidade da receita. Criar itens próximos ao seu nível atual fornece ganhos ótimos de XP.',
            'Muitos itens criados são essenciais para o conteúdo endgame. Armas relíquia, equipamento de alto nível e consumíveis usados em masmorras todos vêm de profissões de crafting.'
          ]
        },
        {
          title: 'Escolhendo Suas Primeiras Profissões',
          icon: Package,
          content: [
            'Para iniciantes, recomendamos começar com uma profissão de coleta e uma profissão de crafting que se complementam. Isso cria um ciclo autossuficiente onde você coleta materiais para criar itens.',
            'Considere sua classe de personagem e estilo de jogo ao escolher profissões. Se você joga uma classe corpo a corpo, crafting de armadura pode ser valioso. Magos podem preferir profissões que criam itens mágicos.',
            'Combinações populares para iniciantes: Herborista com Cozinheiro para criação de consumíveis, Minerador com Armeiro para equipamento defensivo, ou Lenhador com Carpinteiro para vários itens.',
            'Não se preocupe muito com sua escolha inicial. Você sempre pode aprender profissões adicionais mais tarde. Foque primeiro em aprender as mecânicas do sistema.'
          ]
        },
        {
          title: 'Estratégia de Nivelamento',
          content: [
            'Nivelamento eficiente requer planejamento. Use nossa calculadora de profissões para identificar quais receitas fornecem a melhor XP por material investido.',
            'Em níveis baixos, crie itens que você possa usar ou vender. Isso fornece valor além de apenas XP. Em níveis médios, foque puramente em eficiência de XP.',
            'Gestão de recursos se torna crítica em torno do nível 100. Receitas de alto nível requerem investimentos significativos de materiais. Considere os preços do mercado ao decidir qual caminho tomar.',
            'Junte-se a uma guilda com uma oficina. Oficinas de guilda frequentemente fornecem bônus para velocidade de crafting ou taxas de sucesso.'
          ]
        },
        {
          title: 'Erros Comuns de Iniciantes',
          content: [
            'Erro 1: Se dispersar demais. Embora você possa aprender todas as profissões, tentar subir múltiplas profissões de crafting simultaneamente vai desacelerar significativamente seu progresso.',
            'Erro 2: Ignorar o mercado. Verifique preços do mercado antes de criar grandes quantidades. Às vezes coletar e vender materiais brutos é mais lucrativo.',
            'Erro 3: Não usar a calculadora. As curvas de XP do Wakfu são não lineares. O que parece eficiente pode desperdiçar recursos.',
            'Erro 4: Negligenciar profissões de coleta. Mesmo se você planeja comprar materiais, ter uma profissão de coleta fornece renda passiva.',
            'Erro 5: Se apressar para crafting endgame. Cada faixa de nível ensina lições importantes sobre gestão de recursos e dinâmicas de mercado.'
          ]
        },
        {
          title: 'Próximos Passos',
          content: [
            'Agora que você entende o básico, visite nossa Calculadora XP para planejar seu caminho de nivelamento de profissão.',
            'Explore nosso Guia de Crafting de Itens para navegar pelas receitas disponíveis e planejar seus requisitos de materiais.',
            'Confira a página de Sublimações para entender a otimização de personagem endgame. Muitas sublimações poderosas requerem itens criados.',
            'Lembre-se: O sistema de profissões do Wakfu recompensa paciência e planejamento. Use nossas ferramentas para tomar decisões informadas.'
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
        <meta name="keywords" content="Wakfu professions guide, Wakfu crafting, Wakfu harvesting, Wakfu beginners, Wakfu jobs, profession leveling" />
      </Helmet>

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{pageContent.backToGuides}</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-emerald-300 mb-2">
            {pageContent.title}
          </h1>
          <p className="text-emerald-100/60 text-sm mb-8">{pageContent.lastUpdated}</p>

          <div className="space-y-10">
            {pageContent.sections.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  {IconComponent && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-emerald-300" />
                      </div>
                      <h2 className="text-2xl font-bold text-emerald-200">
                        {section.title}
                      </h2>
                    </div>
                  )}
                  {!IconComponent && (
                    <h2 className="text-2xl font-bold text-emerald-200 mb-4">
                      {section.title}
                    </h2>
                  )}

                  <div className="space-y-4">
                    {section.content.map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-emerald-100/80 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <p className="text-center text-emerald-200/90">
              Ready to start planning your profession journey? Use our{' '}
              <Link to="/" className="text-emerald-300 font-bold hover:underline">
                XP Calculator
              </Link>{' '}
              to find the most efficient leveling path!
            </p>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}
