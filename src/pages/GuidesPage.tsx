import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';
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
