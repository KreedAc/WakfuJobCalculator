import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Clock, Plus, Wrench, Bug, Sparkles } from 'lucide-react';
import { TRANSLATIONS, type Language } from '../constants/translations';

interface ChangelogPageProps {
  language: Language;
}

type ChangeType = 'feature' | 'improvement' | 'fix' | 'update';

interface Change {
  type: ChangeType;
  text: string;
}

interface ChangelogEntry {
  version: string;
  date: string;
  changes: Change[];
}

export function ChangelogPage({ language }: ChangelogPageProps) {
  const t = TRANSLATIONS[language];

  const pageContent = {
    en: {
      title: 'Changelog',
      description: 'Track all updates, improvements and new features',
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
      typeLabels: {
        feature: 'Novo recurso',
        improvement: 'Melhoria',
        fix: 'Correção de bug',
        update: 'Atualização'
      }
    }
  };

  const changelog: ChangelogEntry[] = [
    {
      version: '2.0.0',
      date: '2026-01-21',
      changes: [
        { type: 'feature', text: language === 'en' ? 'Added About and Changelog pages' :
          language === 'fr' ? 'Ajout des pages À propos et Journal des modifications' :
          language === 'es' ? 'Agregadas páginas Acerca de y Registro de cambios' :
          'Adicionadas páginas Sobre e Registro de alterações' },
        { type: 'improvement', text: language === 'en' ? 'Enhanced footer navigation' :
          language === 'fr' ? 'Navigation du pied de page améliorée' :
          language === 'es' ? 'Navegación del pie de página mejorada' :
          'Navegação do rodapé aprimorada' }
      ]
    },
    {
      version: '1.5.0',
      date: '2026-01-15',
      changes: [
        { type: 'feature', text: language === 'en' ? 'Added Items Craft Guide' :
          language === 'fr' ? 'Ajout du Guide de Craft d\'Objets' :
          language === 'es' ? 'Agregada Guía de Crafteo de Objetos' :
          'Adicionado Guia de Crafting de Itens' },
        { type: 'improvement', text: language === 'en' ? 'Improved sublimations filtering system' :
          language === 'fr' ? 'Amélioration du système de filtrage des sublimations' :
          language === 'es' ? 'Mejora del sistema de filtrado de sublimaciones' :
          'Melhoria no sistema de filtragem de sublimações' }
      ]
    },
    {
      version: '1.0.0',
      date: '2025-11-10',
      changes: [
        { type: 'feature', text: language === 'en' ? 'Initial release with XP Calculator' :
          language === 'fr' ? 'Version initiale avec Calculateur XP' :
          language === 'es' ? 'Lanzamiento inicial con Calculadora XP' :
          'Lançamento inicial com Calculadora XP' },
        { type: 'feature', text: language === 'en' ? 'Sublimations database' :
          language === 'fr' ? 'Base de données de sublimations' :
          language === 'es' ? 'Base de datos de sublimaciones' :
          'Banco de dados de sublimações' },
        { type: 'feature', text: language === 'en' ? 'Multi-language support (EN, FR, ES, PT)' :
          language === 'fr' ? 'Support multilingue (EN, FR, ES, PT)' :
          language === 'es' ? 'Soporte multiidioma (EN, FR, ES, PT)' :
          'Suporte multilíngue (EN, FR, ES, PT)' }
      ]
    }
  ];

  const content = pageContent[language];

  const getChangeIcon = (type: ChangeType) => {
    switch (type) {
      case 'feature':
        return <Plus className="w-4 h-4" />;
      case 'improvement':
        return <Sparkles className="w-4 h-4" />;
      case 'fix':
        return <Bug className="w-4 h-4" />;
      case 'update':
        return <Wrench className="w-4 h-4" />;
    }
  };

  const getChangeColor = (type: ChangeType) => {
    switch (type) {
      case 'feature':
        return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300';
      case 'improvement':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      case 'fix':
        return 'bg-amber-500/20 border-amber-500/30 text-amber-300';
      case 'update':
        return 'bg-purple-500/20 border-purple-500/30 text-purple-300';
    }
  };

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
            {changelog.map((entry, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                      <span className="text-emerald-300 font-bold text-lg">
                        v{entry.version}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-100/60 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{entry.date}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {entry.changes.map((change, changeIdx) => (
                    <div
                      key={changeIdx}
                      className="flex items-start gap-3 group"
                    >
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${getChangeColor(change.type)}`}>
                        {getChangeIcon(change.type)}
                      </div>
                      <div className="flex-1">
                        <div className={`text-xs font-semibold mb-1 ${getChangeColor(change.type).split(' ')[2]}`}>
                          {content.typeLabels[change.type]}
                        </div>
                        <p className="text-emerald-100/80 leading-relaxed">
                          {change.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
            <p className="text-emerald-200/80 text-sm">
              {language === 'en' ? 'More updates coming soon!' :
               language === 'fr' ? 'Plus de mises à jour bientôt!' :
               language === 'es' ? 'Más actualizaciones próximamente!' :
               'Mais atualizações em breve!'}
            </p>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}
