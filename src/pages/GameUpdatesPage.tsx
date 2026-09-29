import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Package, Repeat, Scroll, Newspaper, type LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { PageSeo } from '../components/PageSeo';
import { HowItWorks } from '../components/HowItWorks';
import { ItemImage } from '../components/ItemImage';
import { loadWakfuData, type CompactItem } from '../lib/wakfuData';
import { TRANSLATIONS, type Language } from '../constants/translations';
import { GAME_UPDATES_T } from '../content/gameUpdates';

/** One entry of public/data/patch-diff.json (see scripts/build-patch-diff.mjs). */
interface Patch {
  from: string;
  to: string;
  date: string;
  newCraftable: number[];
  newItems: number[];
  /** [ingredient id, old qty, new qty]; 0 means added or removed */
  changedRecipes: { item: number; changes: [number, number, number][] }[];
  newSublimations: Record<Language, string>[];
  /** official sublimations the site doesn't describe yet */
  pendingSublimations?: ({ id: number } & Record<Language, string>)[];
  /** names of ingredients that are no longer in the data */
  names?: Record<string, Partial<Record<Language, string>>>;
}

const RARITY_CLASS: Record<number, string> = {
  2: 'text-rarity-rare', 3: 'text-rarity-mythic', 4: 'text-rarity-legendary',
  5: 'text-rarity-relic', 6: 'text-rarity-souvenir', 7: 'text-rarity-epic',
};
const LIMITS = { craftable: 12, items: 12, recipes: 6 };
const shortVersion = (v: string) => v.split('.').slice(0, 2).join('.');
const craftLink = (id: number) => `/items-craft-guide?items=${id}`;

export function GameUpdatesPage({ language }: { language: Language }) {
  const g = GAME_UPDATES_T[language];
  const t = TRANSLATIONS[language];
  const [patches, setPatches] = useState<Patch[] | null>(null);
  const [itemsById, setItemsById] = useState<Map<number, CompactItem>>(new Map());
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    fetch('/data/patch-diff.json')
      .then((r) => r.json())
      .then((d: { patches?: Patch[] }) => { if (!cancelled) setPatches(d.patches ?? []); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadWakfuData(language)
      .then((d) => { if (!cancelled) setItemsById(d.itemsById); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [language]);

  const rarityLabels: Record<number, string> = {
    1: t.unusual, 2: t.rare, 3: t.mythical, 4: t.legendary, 5: t.relic, 6: t.souvenir, 7: t.epic,
  };
  const nameOf = (id: number, patch: Patch) =>
    itemsById.get(id)?.name ?? patch.names?.[id]?.[language] ?? patch.names?.[id]?.en ?? `#${id}`;
  const fmtDate = (d: string) =>
    new Date(`${d}T12:00:00Z`).toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' });

  // lists longer than their limit get a "show all" toggle
  const limited = <T,>(key: string, list: T[], limit: number) =>
    expanded.has(key) ? list : list.slice(0, limit);
  const toggle = (key: string, total: number, limit: number) => total > limit && (
    <button
      type="button"
      className="btn btn-ghost btn-sm mt-3"
      onClick={() => setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key); else next.add(key);
        return next;
      })}
    >
      {expanded.has(key) ? g.showLess : g.showAll(total)}
    </button>
  );

  const section = (icon: LucideIcon, title: string, count: number, body: ReactNode) => {
    const Icon = icon;
    return (
      <section className="pt-5 border-t border-line first:border-t-0 first:pt-0">
        <h3 className="flex items-center gap-2 font-semibold text-[15px] text-fg mb-3">
          <Icon className="w-4 h-4 text-primary" /> {title}
          <span className="badge">{count}</span>
        </h3>
        {count === 0 ? <p className="text-sm text-subtle">{g.noneThisUpdate}</p> : body}
      </section>
    );
  };

  const itemTile = (id: number, patch: Patch) => {
    const it = itemsById.get(id);
    return (
      <li key={id}>
        <Link
          to={craftLink(id)}
          title={g.openInCraftGuide}
          className="flex items-center gap-3 rounded-xl border border-line bg-bg2 px-2.5 py-2 hover:border-line-strong hover:bg-surface2 transition-colors"
        >
          <ItemImage gfx={it?.gfxId} itemId={id} size={36} />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-fg truncate">{nameOf(id, patch)}</span>
            {it?.rarity ? (
              <span className={`block text-xs truncate ${RARITY_CLASS[it.rarity] ?? 'text-subtle'}`}>{rarityLabels[it.rarity]}</span>
            ) : null}
          </span>
        </Link>
      </li>
    );
  };

  const resourceChip = (id: number, patch: Patch) => {
    const it = itemsById.get(id);
    return (
      <li key={id} className="flex items-center gap-2 rounded-xl border border-line bg-bg2 pl-1.5 pr-3 py-1.5">
        <ItemImage gfx={it?.gfxId} itemId={id} size={28} />
        <span className="text-[13px] font-medium text-fg">{nameOf(id, patch)}</span>
      </li>
    );
  };

  const recipeRow = (r: Patch['changedRecipes'][number], patch: Patch) => {
    const it = itemsById.get(r.item);
    return (
      <li key={r.item} className="card-inset p-3 flex gap-3">
        <ItemImage gfx={it?.gfxId} itemId={r.item} size={36} />
        <div className="min-w-0 flex-1">
          <Link to={craftLink(r.item)} className="block text-sm font-semibold text-fg hover:text-primary truncate" title={g.openInCraftGuide}>
            {nameOf(r.item, patch)}
          </Link>
          <ul className="mt-1.5 space-y-1">
            {r.changes.map(([id, before, after]) => (
              <li key={id} className="flex items-baseline gap-2 text-[13px]">
                <span className={`font-mono font-semibold shrink-0 ${before === 0 ? 'text-success' : after === 0 ? 'text-danger' : 'text-muted'}`}>
                  {before === 0 ? `+ ×${after}` : after === 0 ? `− ×${before}` : `×${before} → ×${after}`}
                </span>
                <span className={`truncate ${after === 0 ? 'text-subtle line-through' : 'text-fg'}`}>{nameOf(id, patch)}</span>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  };

  return (
    <div>
      <PageSeo title={g.seoTitle} description={g.description} path="/game-updates" />
      <PageHeader title={g.title} subtitle={g.subtitle} />

      {failed ? (
        <p className="card p-6 text-sm text-muted">{g.error}</p>
      ) : patches === null ? (
        <p className="card p-6 text-sm text-muted">{g.loading}</p>
      ) : patches.length === 0 ? (
        <div className="card flex flex-col items-center text-center py-14 px-6">
          <Newspaper className="w-10 h-10 text-subtle mb-3" />
          <p className="text-muted">{g.empty}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {patches.map((patch, i) => {
            const k = patch.to;
            return (
              <article key={k} className="card p-5 md:p-6">
                <header className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-5">
                  <h2 className="section-title">{g.version(shortVersion(patch.to))}</h2>
                  {i === 0 && <span className="badge badge-accent">{g.latest}</span>}
                  <span className="w-full text-sm text-subtle font-mono">{g.fromTo(patch.from, patch.to, fmtDate(patch.date))}</span>
                </header>

                <div className="space-y-5">
                  {section(Hammer, g.newCraftable, patch.newCraftable.length, <>
                    <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                      {limited(`${k}:c`, patch.newCraftable, LIMITS.craftable).map((id) => itemTile(id, patch))}
                    </ul>
                    {toggle(`${k}:c`, patch.newCraftable.length, LIMITS.craftable)}
                  </>)}

                  {section(Package, g.newItems, patch.newItems.length, <>
                    <ul className="flex flex-wrap gap-2">
                      {limited(`${k}:i`, patch.newItems, LIMITS.items).map((id) => resourceChip(id, patch))}
                    </ul>
                    {toggle(`${k}:i`, patch.newItems.length, LIMITS.items)}
                  </>)}

                  {section(Repeat, g.changedRecipes, patch.changedRecipes.length, <>
                    <ul className="grid gap-2 lg:grid-cols-2">
                      {limited(`${k}:r`, patch.changedRecipes, LIMITS.recipes).map((r) => recipeRow(r, patch))}
                    </ul>
                    {toggle(`${k}:r`, patch.changedRecipes.length, LIMITS.recipes)}
                  </>)}

                  {section(Scroll, g.newSublimations, patch.newSublimations.length + (patch.pendingSublimations?.length ?? 0), (
                    <ul className="flex flex-wrap gap-2">
                      {patch.newSublimations.map((s) => {
                        const name = s[language] ?? s.en;
                        return (
                          <li key={s.en}>
                            <Link to={`/sublimations?q=${encodeURIComponent(name)}`} className="chip">{name}</Link>
                          </li>
                        );
                      })}
                      {patch.pendingSublimations?.map((s) => (
                        <li key={s.en} className="chip cursor-default" title={g.detailsSoon}>
                          {s[language] ?? s.en}
                          <span className="text-[11px] text-subtle">· {g.detailsSoon}</span>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <HowItWorks title={g.howTitle} text={g.howText} className="mt-8" />
    </div>
  );
}
