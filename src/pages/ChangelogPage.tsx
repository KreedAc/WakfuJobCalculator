import { PageSeo } from '../components/PageSeo';
import { Clock, Plus, Wrench, Bug, Sparkles } from 'lucide-react';
import { type Language } from '../constants/translations';
import { changelog, changelogContent, type ChangeType } from '../content/changelog';

interface ChangelogPageProps {
  language: Language;
}

export function ChangelogPage({ language }: ChangelogPageProps) {
  const content = changelogContent[language];

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
    <>
      <PageSeo title={content.title} description={content.description} path="/changelog" />

      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <h1 className="page-title mb-4">
            {content.title}
          </h1>
          <p className="text-emerald-100/70 text-center text-lg mb-12">
            {content.description}
          </p>

          <div className="space-y-8">
            {changelog.map((entry) => (
              <div
                key={entry.version}
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
                          {change.text[language]}
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
              {content.comingSoon}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
