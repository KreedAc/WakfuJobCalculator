import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BookOpen, Hammer, Sparkles, TrendingUp, Lightbulb, Target } from 'lucide-react';
import { type Language } from '../constants/translations';

interface GuidesPageProps {
  language: Language;
}

export function GuidesPage({ language }: GuidesPageProps) {
  const content = {
    en: {
      title: 'Wakfu Guides & Resources',
      description: 'Comprehensive guides to help you master Wakfu crafting, professions, and character optimization',
      intro: 'Welcome to our collection of in-depth guides for Wakfu! Whether you\'re a beginner learning the ropes or an experienced player looking to optimize your builds, these guides will help you make the most of your Wakfu experience.',
      guides: [
        {
          icon: BookOpen,
          title: 'Beginner\'s Guide to Wakfu Professions',
          slug: 'beginners-guide-professions',
          description: 'Everything you need to know about choosing and starting your first professions in Wakfu. Learn about harvesting, crafting, and the profession system.',
          topics: ['Profession basics', 'Which professions to choose', 'Starting tips', 'Common mistakes to avoid'],
          readTime: '10 min read'
        },
        {
          icon: Sparkles,
          title: 'Complete Sublimations Guide',
          slug: 'complete-sublimations-guide',
          description: 'Master the sublimation system! Understand rarity tiers, slot types, and how to build optimal sublimation setups for your character class.',
          topics: ['Sublimation mechanics', 'Slot types explained', 'Best sublimations by class', 'Epic and Legendary priorities'],
          readTime: '15 min read'
        },
        {
          icon: Hammer,
          title: 'Crafting Optimization Guide',
          slug: 'crafting-optimization',
          description: 'Learn how to level your crafting professions efficiently, manage resources, and maximize your profit from crafted items.',
          topics: ['Resource management', 'Efficient leveling paths', 'Crafting for profit', 'Workshop strategies'],
          readTime: '12 min read'
        },
        {
          icon: TrendingUp,
          title: 'How to Level Professions Fast',
          slug: 'fast-profession-leveling',
          description: 'Discover the fastest methods to level all professions from 1 to 200. Includes XP tables, optimal recipes, and resource gathering tips.',
          topics: ['XP optimization', 'Best recipes per level', 'Resource farming locations', 'Time-saving techniques'],
          readTime: '8 min read'
        },
        {
          icon: Lightbulb,
          title: 'Understanding Wakfu Rarity System',
          slug: 'rarity-system-explained',
          description: 'Deep dive into Wakfu\'s item and sublimation rarity system. Learn how to identify valuable items and understand drop rates.',
          topics: ['Common to Mythic explained', 'Drop rate mechanics', 'Farming strategies', 'Relic weapons overview'],
          readTime: '7 min read'
        },
        {
          icon: Target,
          title: 'Best Sublimation Builds by Role',
          slug: 'sublimation-builds-by-role',
          description: 'Optimize your character with role-specific sublimation recommendations. Covers DPS, tank, and support builds.',
          topics: ['DPS sublimation setups', 'Tank survivability builds', 'Support and healing builds', 'PvP vs PvE considerations'],
          readTime: '14 min read'
        }
      ]
    },
    fr: {
      title: 'Guides & Ressources Wakfu',
      description: 'Guides complets pour vous aider à maîtriser le craft, les métiers et l\'optimisation de personnage dans Wakfu',
      intro: 'Bienvenue dans notre collection de guides approfondis pour Wakfu ! Que vous soyez débutant ou joueur expérimenté cherchant à optimiser vos builds, ces guides vous aideront à tirer le meilleur parti de votre expérience Wakfu.',
      guides: [
        {
          icon: BookOpen,
          title: 'Guide du Débutant : Les Métiers Wakfu',
          slug: 'beginners-guide-professions',
          description: 'Tout ce que vous devez savoir sur le choix et le démarrage de vos premiers métiers dans Wakfu. Apprenez la récolte, le craft et le système de métiers.',
          topics: ['Bases des métiers', 'Quels métiers choisir', 'Conseils de départ', 'Erreurs courantes à éviter'],
          readTime: '10 min de lecture'
        },
        {
          icon: Sparkles,
          title: 'Guide Complet des Sublimations',
          slug: 'complete-sublimations-guide',
          description: 'Maîtrisez le système de sublimation ! Comprenez les niveaux de rareté, les types d\'emplacements et comment construire des configurations optimales pour votre classe.',
          topics: ['Mécaniques de sublimation', 'Types d\'emplacements expliqués', 'Meilleures sublimations par classe', 'Priorités Épiques et Légendaires'],
          readTime: '15 min de lecture'
        },
        {
          icon: Hammer,
          title: 'Guide d\'Optimisation du Craft',
          slug: 'crafting-optimization',
          description: 'Apprenez à monter efficacement vos métiers de craft, gérer les ressources et maximiser vos profits avec les objets craftés.',
          topics: ['Gestion des ressources', 'Chemins de montée efficaces', 'Craft pour le profit', 'Stratégies d\'atelier'],
          readTime: '12 min de lecture'
        },
        {
          icon: TrendingUp,
          title: 'Monter les Métiers Rapidement',
          slug: 'fast-profession-leveling',
          description: 'Découvrez les méthodes les plus rapides pour monter tous les métiers de 1 à 200. Inclut tables XP, recettes optimales et conseils de récolte.',
          topics: ['Optimisation XP', 'Meilleures recettes par niveau', 'Emplacements de farm', 'Techniques de gain de temps'],
          readTime: '8 min de lecture'
        },
        {
          icon: Lightbulb,
          title: 'Comprendre le Système de Rareté',
          slug: 'rarity-system-explained',
          description: 'Plongée dans le système de rareté des objets et sublimations de Wakfu. Apprenez à identifier les objets précieux et comprendre les taux de drop.',
          topics: ['Commun à Mythique expliqué', 'Mécaniques de taux de drop', 'Stratégies de farming', 'Aperçu des armes Reliques'],
          readTime: '7 min de lecture'
        },
        {
          icon: Target,
          title: 'Meilleurs Builds de Sublimations par Rôle',
          slug: 'sublimation-builds-by-role',
          description: 'Optimisez votre personnage avec des recommandations de sublimations par rôle. Couvre les builds DPS, tank et support.',
          topics: ['Configurations DPS', 'Builds de survie tank', 'Builds support et soin', 'Considérations PvP vs PvE'],
          readTime: '14 min de lecture'
        }
      ]
    },
    es: {
      title: 'Guías y Recursos de Wakfu',
      description: 'Guías completas para ayudarte a dominar el crafteo, profesiones y optimización de personajes en Wakfu',
      intro: '¡Bienvenido a nuestra colección de guías detalladas para Wakfu! Ya seas un principiante aprendiendo o un jugador experimentado buscando optimizar tus builds, estas guías te ayudarán a aprovechar al máximo tu experiencia en Wakfu.',
      guides: [
        {
          icon: BookOpen,
          title: 'Guía para Principiantes: Profesiones de Wakfu',
          slug: 'beginners-guide-professions',
          description: 'Todo lo que necesitas saber sobre elegir e iniciar tus primeras profesiones en Wakfu. Aprende sobre recolección, crafteo y el sistema de profesiones.',
          topics: ['Conceptos básicos de profesiones', 'Qué profesiones elegir', 'Consejos iniciales', 'Errores comunes a evitar'],
          readTime: '10 min de lectura'
        },
        {
          icon: Sparkles,
          title: 'Guía Completa de Sublimaciones',
          slug: 'complete-sublimations-guide',
          description: '¡Domina el sistema de sublimación! Entiende los niveles de rareza, tipos de ranura y cómo construir configuraciones óptimas para tu clase.',
          topics: ['Mecánicas de sublimación', 'Tipos de ranura explicados', 'Mejores sublimaciones por clase', 'Prioridades Épicas y Legendarias'],
          readTime: '15 min de lectura'
        },
        {
          icon: Hammer,
          title: 'Guía de Optimización de Crafteo',
          slug: 'crafting-optimization',
          description: 'Aprende a subir tus profesiones de crafteo eficientemente, gestionar recursos y maximizar tu beneficio con objetos crafteados.',
          topics: ['Gestión de recursos', 'Rutas de nivelación eficientes', 'Crafteo para ganancia', 'Estrategias de taller'],
          readTime: '12 min de lectura'
        },
        {
          icon: TrendingUp,
          title: 'Cómo Subir Profesiones Rápido',
          slug: 'fast-profession-leveling',
          description: 'Descubre los métodos más rápidos para subir todas las profesiones de 1 a 200. Incluye tablas de XP, recetas óptimas y consejos de recolección.',
          topics: ['Optimización de XP', 'Mejores recetas por nivel', 'Ubicaciones de farmeo', 'Técnicas de ahorro de tiempo'],
          readTime: '8 min de lectura'
        },
        {
          icon: Lightbulb,
          title: 'Entendiendo el Sistema de Rareza',
          slug: 'rarity-system-explained',
          description: 'Inmersión profunda en el sistema de rareza de objetos y sublimaciones de Wakfu. Aprende a identificar objetos valiosos y entender tasas de drop.',
          topics: ['Común a Mítico explicado', 'Mecánicas de tasa de drop', 'Estrategias de farmeo', 'Resumen de armas Reliquia'],
          readTime: '7 min de lectura'
        },
        {
          icon: Target,
          title: 'Mejores Builds de Sublimación por Rol',
          slug: 'sublimation-builds-by-role',
          description: 'Optimiza tu personaje con recomendaciones de sublimación específicas por rol. Cubre builds DPS, tank y support.',
          topics: ['Configuraciones DPS', 'Builds de supervivencia tank', 'Builds de apoyo y curación', 'Consideraciones PvP vs PvE'],
          readTime: '14 min de lectura'
        }
      ]
    },
    pt: {
      title: 'Guias e Recursos de Wakfu',
      description: 'Guias completos para ajudá-lo a dominar o crafting, profissões e otimização de personagens no Wakfu',
      intro: 'Bem-vindo à nossa coleção de guias detalhados para Wakfu! Seja você um iniciante aprendendo ou um jogador experiente buscando otimizar seus builds, estes guias ajudarão você a aproveitar ao máximo sua experiência em Wakfu.',
      guides: [
        {
          icon: BookOpen,
          title: 'Guia para Iniciantes: Profissões do Wakfu',
          slug: 'beginners-guide-professions',
          description: 'Tudo que você precisa saber sobre escolher e iniciar suas primeiras profissões no Wakfu. Aprenda sobre coleta, crafting e o sistema de profissões.',
          topics: ['Básico de profissões', 'Quais profissões escolher', 'Dicas iniciais', 'Erros comuns a evitar'],
          readTime: '10 min de leitura'
        },
        {
          icon: Sparkles,
          title: 'Guia Completo de Sublimações',
          slug: 'complete-sublimations-guide',
          description: 'Domine o sistema de sublimação! Entenda os níveis de raridade, tipos de slot e como construir configurações ótimas para sua classe.',
          topics: ['Mecânicas de sublimação', 'Tipos de slot explicados', 'Melhores sublimações por classe', 'Prioridades Épicas e Lendárias'],
          readTime: '15 min de leitura'
        },
        {
          icon: Hammer,
          title: 'Guia de Otimização de Crafting',
          slug: 'crafting-optimization',
          description: 'Aprenda a subir suas profissões de crafting eficientemente, gerenciar recursos e maximizar seu lucro com itens craftados.',
          topics: ['Gestão de recursos', 'Caminhos de nivelamento eficientes', 'Crafting para lucro', 'Estratégias de oficina'],
          readTime: '12 min de leitura'
        },
        {
          icon: TrendingUp,
          title: 'Como Subir Profissões Rapidamente',
          slug: 'fast-profession-leveling',
          description: 'Descubra os métodos mais rápidos para subir todas as profissões de 1 a 200. Inclui tabelas de XP, receitas ótimas e dicas de coleta.',
          topics: ['Otimização de XP', 'Melhores receitas por nível', 'Locais de farm', 'Técnicas de economia de tempo'],
          readTime: '8 min de leitura'
        },
        {
          icon: Lightbulb,
          title: 'Entendendo o Sistema de Raridade',
          slug: 'rarity-system-explained',
          description: 'Mergulhe profundo no sistema de raridade de itens e sublimações do Wakfu. Aprenda a identificar itens valiosos e entender taxas de drop.',
          topics: ['Comum a Mítico explicado', 'Mecânicas de taxa de drop', 'Estratégias de farming', 'Visão geral de armas Relíquia'],
          readTime: '7 min de leitura'
        },
        {
          icon: Target,
          title: 'Melhores Builds de Sublimação por Função',
          slug: 'sublimation-builds-by-role',
          description: 'Otimize seu personagem com recomendações de sublimação específicas por função. Cobre builds DPS, tank e suporte.',
          topics: ['Configurações DPS', 'Builds de sobrevivência tank', 'Builds de suporte e cura', 'Considerações PvP vs PvE'],
          readTime: '14 min de leitura'
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
        <meta name="keywords" content="Wakfu guides, Wakfu professions, Wakfu sublimations, Wakfu crafting, Wakfu tips, Wakfu tutorial" />
      </Helmet>

      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-4 text-center">
            {pageContent.title}
          </h1>
          <p className="text-cyan-100/70 text-center text-lg mb-8">
            {pageContent.description}
          </p>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6 mb-12">
            <p className="text-cyan-100/90 leading-relaxed">
              {pageContent.intro}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {pageContent.guides.map((guide, idx) => {
              const IconComponent = guide.icon;
              return (
                <Link
                  key={idx}
                  to={`/guides/${guide.slug}`}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-cyan-300" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-cyan-200 mb-2 group-hover:text-cyan-300 transition-colors">
                        {guide.title}
                      </h2>
                      <span className="text-cyan-400/60 text-xs font-medium">
                        {guide.readTime}
                      </span>
                    </div>
                  </div>

                  <p className="text-cyan-100/70 text-sm leading-relaxed mb-4">
                    {guide.description}
                  </p>

                  <div className="space-y-1">
                    {guide.topics.map((topic, topicIdx) => (
                      <div
                        key={topicIdx}
                        className="flex items-center gap-2 text-cyan-100/60 text-xs"
                      >
                        <span className="text-cyan-400">•</span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}
