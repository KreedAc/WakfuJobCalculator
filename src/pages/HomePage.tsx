import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Megaphone, Clock, ArrowRight } from 'lucide-react';
import { PageSeo } from '../components/PageSeo';
import { openSearch } from '../components/layout/searchEvents';
import { NAV_GROUPS } from '../lib/navigation';
import { GAME_VERSION } from '../lib/gameVersion';
import { BUILDER_WIP } from '../lib/featureFlags';
import { lastVisits, relativeDay } from '../lib/recent';
import { SHELL } from '../content/shell';
import { changelog } from '../content/changelog';
import type { Language } from '../constants/translations';

const TOOLS = NAV_GROUPS.flatMap((g) => g.items).filter((i) => i.id !== 'builder');

export function HomePage({ language }: { language: Language }) {
  const s = SHELL[language];
  const h = s.home;
  const [visits, setVisits] = useState<Record<string, number>>({});
  useEffect(() => setVisits(lastVisits()), []);

  // latest changes, without the ones about unreleased features
  const news = changelog
    .flatMap((entry) => entry.changes)
    .filter((c) => !(BUILDER_WIP && /builder|builds/i.test(c.text.en)))
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <PageSeo title={h.title} description={h.description} path="/" />

      <section className="grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        <div className="card relative overflow-hidden p-6 md:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
          <span className="eyebrow mb-4"><Sparkles className="w-3.5 h-3.5" /> {h.eyebrow(GAME_VERSION)}</span>
          <h1 className="font-display text-[28px] md:text-[36px] font-bold leading-[1.15] tracking-tight whitespace-pre-line mb-3">
            {h.heroTitle}
          </h1>
          <p className="text-muted max-w-xl mb-6">{h.heroText}</p>
          <button
            type="button"
            onClick={() => openSearch()}
            className="w-full max-w-xl flex items-center gap-3 h-14 px-4 rounded-2xl border border-line-strong bg-bg text-subtle text-left hover:border-primary transition-colors"
          >
            <Search className="w-5 h-5 shrink-0" />
            <span className="truncate">{h.heroSearch}</span>
            <span className="kbd ml-auto hidden md:inline">Ctrl K</span>
          </button>
          <div className="flex flex-wrap gap-2 mt-3">
            {h.hints.map((hint) => (
              <Link key={hint.to} to={hint.to} className="chip">{hint.label}</Link>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2 text-base">
              <Megaphone className="w-4 h-4 text-primary" /> {h.whatsNew}
            </h2>
            <Link to="/changelog" className="link text-[13px]">{h.allChanges}</Link>
          </div>
          <ul className="space-y-3.5">
            {news.map((c, i) => (
              <li key={i} className="flex gap-3 text-[14px] text-muted leading-snug">
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${c.type === 'feature' ? 'bg-accent' : 'bg-primary'}`} />
                {c.text[language]}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="section-title mb-4">{h.tools}</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            const text = h.toolText[tool.id as keyof typeof h.toolText];
            const last = visits[tool.path];
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="card group p-5 flex flex-col gap-2.5 transition-colors hover:border-line-strong hover:bg-surface2"
              >
                <span className={`w-10 h-10 rounded-xl grid place-items-center ${i === 0 ? 'bg-accent/15 text-accent' : 'bg-primary/10 text-primary'}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="font-display font-bold text-base text-fg flex items-center gap-2">
                  {s.nav[tool.id]}
                  <ArrowRight className="w-4 h-4 text-subtle opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </span>
                <span className="text-[14px] text-muted leading-snug">{text.desc}</span>
                <span className="mt-auto pt-1 flex items-center gap-1.5 text-xs text-subtle">
                  {last ? (<><Clock className="w-3.5 h-3.5" /> {h.usedAgo(relativeDay(last, language))}</>) : text.meta}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
