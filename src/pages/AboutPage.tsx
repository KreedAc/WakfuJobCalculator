import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Info, Heart, Code, Users } from 'lucide-react';
import { TRANSLATIONS, type Language } from '../constants/translations';

interface AboutPageProps {
  language: Language;
}

export function AboutPage({ language }: AboutPageProps) {
  const t = TRANSLATIONS[language];

  const aboutContent = {
    en: {
      title: 'About Wakfu Job Calculator',
      description: 'Your complete toolkit for Wakfu crafting and character optimization',
      sections: [
        {
          icon: Info,
          title: 'What is this?',
          content: 'Wakfu Job Calculator is a comprehensive web application designed to help Wakfu players plan their crafting professions, optimize their sublimations, and discover crafting recipes. Built by players, for players.'
        },
        {
          icon: Code,
          title: 'Features',
          items: [
            'XP Calculator for all professions with detailed level progression',
            'Sublimations database with advanced filtering and search',
            'Items Craft Guide with recipe exploration',
            'Multi-language support (EN, FR, ES, PT)',
            'Regular updates with game patches'
          ]
        },
        {
          icon: Users,
          title: 'Community',
          content: 'This project is maintained by passionate Wakfu players. We are not affiliated with Ankama. All game content and trademarks belong to Ankama.'
        },
        {
          icon: Heart,
          title: 'Credits',
          content: 'Created with love by KreedAc and LadyKreedAc. Special thanks to the Wakfu community for their support and feedback.'
        }
      ]
    },
    fr: {
      title: 'À propos de Wakfu Job Calculator',
      description: 'Votre boîte à outils complète pour le crafting et l\'optimisation de personnage dans Wakfu',
      sections: [
        {
          icon: Info,
          title: 'Qu\'est-ce que c\'est?',
          content: 'Wakfu Job Calculator est une application web complète conçue pour aider les joueurs de Wakfu à planifier leurs métiers de craft, optimiser leurs sublimations et découvrir des recettes. Créé par des joueurs, pour les joueurs.'
        },
        {
          icon: Code,
          title: 'Fonctionnalités',
          items: [
            'Calculateur XP pour tous les métiers avec progression détaillée',
            'Base de données de sublimations avec filtrage avancé',
            'Guide de craft d\'objets avec exploration de recettes',
            'Support multilingue (EN, FR, ES, PT)',
            'Mises à jour régulières avec les patchs du jeu'
          ]
        },
        {
          icon: Users,
          title: 'Communauté',
          content: 'Ce projet est maintenu par des joueurs passionnés de Wakfu. Nous ne sommes pas affiliés à Ankama. Tout le contenu du jeu et les marques appartiennent à Ankama.'
        },
        {
          icon: Heart,
          title: 'Crédits',
          content: 'Créé avec amour par KreedAc et LadyKreedAc. Merci spécial à la communauté Wakfu pour leur soutien et leurs retours.'
        }
      ]
    },
    es: {
      title: 'Acerca de Wakfu Job Calculator',
      description: 'Tu conjunto completo de herramientas para crafting y optimización de personajes en Wakfu',
      sections: [
        {
          icon: Info,
          title: '¿Qué es esto?',
          content: 'Wakfu Job Calculator es una aplicación web completa diseñada para ayudar a los jugadores de Wakfu a planificar sus profesiones de crafting, optimizar sus sublimaciones y descubrir recetas. Creado por jugadores, para jugadores.'
        },
        {
          icon: Code,
          title: 'Características',
          items: [
            'Calculadora XP para todas las profesiones con progresión detallada',
            'Base de datos de sublimaciones con filtrado avanzado',
            'Guía de crafteo de objetos con exploración de recetas',
            'Soporte multiidioma (EN, FR, ES, PT)',
            'Actualizaciones regulares con parches del juego'
          ]
        },
        {
          icon: Users,
          title: 'Comunidad',
          content: 'Este proyecto es mantenido por jugadores apasionados de Wakfu. No estamos afiliados con Ankama. Todo el contenido del juego y marcas pertenecen a Ankama.'
        },
        {
          icon: Heart,
          title: 'Créditos',
          content: 'Creado con amor por KreedAc y LadyKreedAc. Agradecimiento especial a la comunidad de Wakfu por su apoyo y feedback.'
        }
      ]
    },
    pt: {
      title: 'Sobre o Wakfu Job Calculator',
      description: 'Seu kit completo para crafting e otimização de personagens no Wakfu',
      sections: [
        {
          icon: Info,
          title: 'O que é isto?',
          content: 'Wakfu Job Calculator é uma aplicação web completa projetada para ajudar jogadores de Wakfu a planejar suas profissões de crafting, otimizar suas sublimações e descobrir receitas. Criado por jogadores, para jogadores.'
        },
        {
          icon: Code,
          title: 'Recursos',
          items: [
            'Calculadora XP para todas as profissões com progressão detalhada',
            'Banco de dados de sublimações com filtragem avançada',
            'Guia de crafting de itens com exploração de receitas',
            'Suporte multilíngue (EN, FR, ES, PT)',
            'Atualizações regulares com patches do jogo'
          ]
        },
        {
          icon: Users,
          title: 'Comunidade',
          content: 'Este projeto é mantido por jogadores apaixonados de Wakfu. Não somos afiliados à Ankama. Todo conteúdo do jogo e marcas pertencem à Ankama.'
        },
        {
          icon: Heart,
          title: 'Créditos',
          content: 'Criado com amor por KreedAc e LadyKreedAc. Agradecimento especial à comunidade Wakfu pelo apoio e feedback.'
        }
      ]
    }
  };

  const content = aboutContent[language];

  return (
    <HelmetProvider>
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
      </Helmet>

      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-300 mb-4 text-center">
            {content.title}
          </h1>
          <p className="text-emerald-100/70 text-center text-lg mb-12">
            {content.description}
          </p>

          <div className="space-y-8">
            {content.sections.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-emerald-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-200">
                      {section.title}
                    </h2>
                  </div>

                  {section.content && (
                    <p className="text-emerald-100/80 leading-relaxed">
                      {section.content}
                    </p>
                  )}

                  {section.items && (
                    <ul className="space-y-2 mt-4">
                      {section.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-2 text-emerald-100/80"
                        >
                          <span className="text-emerald-400 mt-1.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <p className="text-center text-emerald-200/80 text-sm leading-relaxed">
              <strong className="text-emerald-300">Disclaimer:</strong> WAKFU is an MMORPG published by Ankama.
              This is an unofficial fan-made website with no connection to Ankama.
              All game content, artwork, and trademarks are property of Ankama.
            </p>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}
