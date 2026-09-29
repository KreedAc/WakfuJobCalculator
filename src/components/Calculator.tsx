import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Croissant, ChefHat, Wrench, Gem, Backpack, Scissors, Swords, Scroll, Share2, RotateCcw, ChevronUp, ShoppingCart,
  type LucideIcon,
} from 'lucide-react';
import type { Language } from '../constants/translations';
import { PROFESSION_IDS, PROFESSION_NAMES, PROFESSION_RECIPES, type ProfessionId } from '../constants/professions';
import { LEVEL_RANGES } from '../constants/levelRanges';
import { LEVELING_RECIPE_IDS } from '../constants/levelingRecipes';
import { craftsNeeded, resourcesPerCraft } from '../lib/xpCalculator';
import { loadWakfuData } from '../lib/wakfuData';
import { ItemImage } from './ItemImage';
import { XP_T } from '../content/xpCalculator';
import { PageHeader } from './ui/PageHeader';

const PROFESSION_ICONS: Record<ProfessionId, LucideIcon> = {
  Armorer: Shield,
  Baker: Croissant,
  Chef: ChefHat,
  Handyman: Wrench,
  Jeweler: Gem,
  'Leather Dealer': Backpack,
  Tailor: Scissors,
  'Weapons Master': Swords,
};

/** "140 - 150" → "140–150" for display, "140-150" in URLs */
const rangeLabel = (r: string) => r.replace(/\s*-\s*/, '–');
const rangeKey = (r: string) => r.replace(/\s*-\s*/, '-');
const rangeBounds = (r: string) => r.split('-').map((n) => parseInt(n, 10));

interface Ingredient { itemId: number; qty: number; name?: string; gfxId?: number | null }

interface Props {
  language: Language;
  title: string;
  subtitle: string;
}

export function Calculator({ language, title, subtitle }: Props) {
  const x = XP_T[language];
  const [profession, setProfession] = useState<ProfessionId | ''>('');
  const [range, setRange] = useState('');
  const [xp, setXp] = useState('');
  const [toast, setToast] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);

  // keep the URL shareable (declared first: skipped until the link below has been read)
  useEffect(() => {
    if (!hydrated.current) return;
    const p = new URLSearchParams();
    if (profession) p.set('profession', profession);
    if (range) p.set('range', rangeKey(range));
    if (Number(xp) > 0) p.set('xp', xp);
    const search = p.toString() ? `?${p}` : '';
    if (search !== window.location.search) {
      window.history.replaceState(window.history.state, '', window.location.pathname + search);
    }
  }, [profession, range, xp]);

  // read a shared link (?profession=Armorer&range=140-150&xp=150) once, after hydration
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const prof = p.get('profession');
    if (prof && (PROFESSION_IDS as readonly string[]).includes(prof)) setProfession(prof as ProfessionId);
    const r = LEVEL_RANGES.find((l) => rangeKey(l.range) === p.get('range'));
    if (r) setRange(r.range);
    const v = p.get('xp');
    if (v && Number(v) > 0) setXp(v);
    hydrated.current = true;
  }, []);

  const level = LEVEL_RANGES.find((r) => r.range === range);
  const recipeItemId = level && profession ? LEVELING_RECIPE_IDS[profession][LEVEL_RANGES.indexOf(level)] : undefined;

  // real ingredients of the leveling recipe (some items have alternative recipes)
  const [recipes, setRecipes] = useState<Ingredient[][] | null>(null);
  const [alt, setAlt] = useState(0);
  const [recipeName, setRecipeName] = useState<string | null>(null);
  useEffect(() => {
    setRecipes(null);
    setRecipeName(null);
    setAlt(0);
    if (!recipeItemId) return;
    let cancelled = false;
    loadWakfuData(language)
      .then((d) => {
        if (cancelled) return;
        setRecipeName(d.itemsById.get(recipeItemId)?.name ?? null);
        setRecipes((d.recipesByResultId.get(recipeItemId) ?? []).map((r) => r.ingredients.map((i) => {
          const it = d.itemsById.get(i.itemId);
          return { ...i, name: it?.name, gfxId: it?.gfxId };
        })));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [recipeItemId, language]);
  const ingredients = recipes?.[alt] ?? null;
  const recipe = level && profession
    ? recipeName ?? `${level.recipe[language]} ${PROFESSION_RECIPES[language][profession]}`
    : null;
  const expPerCraft = parseFloat(xp);

  const result = useMemo(() => {
    if (!level || !profession || !(expPerCraft > 0)) return null;
    const crafts = craftsNeeded(level.expDiff, expPerCraft);
    const per = resourcesPerCraft(profession);
    return {
      crafts, per, resources: crafts * per, expDiff: level.expDiff,
      craftGuide: recipeItemId ? `/items-craft-guide?items=${recipeItemId}x${crafts}` : null,
    };
  }, [level, profession, expPerCraft, recipeItemId]);

  const fmt = (n: number) => n.toLocaleString(language);
  const [from, to] = level ? rangeBounds(rangeKey(level.range)) : [0, 0];

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, url }); return; } catch { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      setToast(x.linkCopied);
      setTimeout(() => setToast(''), 2000);
    } catch { /* clipboard unavailable */ }
  };
  const reset = () => { setProfession(''); setRange(''); setXp(''); };

  const step = (n: number, label: string) => (
    <div className="flex items-center gap-2.5 mb-3 font-semibold text-[14.5px]">
      <span className="w-6 h-6 rounded-full grid place-items-center text-xs font-bold bg-primary/10 text-primary">{n}</span>
      {label}
    </div>
  );

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={<>
          <button type="button" className="btn" onClick={share} disabled={!result}><Share2 className="w-4 h-4" /> {x.share}</button>
          <button type="button" className="btn" onClick={reset}><RotateCcw className="w-4 h-4" /> {x.reset}</button>
        </>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="card p-5 md:p-6 space-y-7">
          <section>
            {step(1, x.stepProfession)}
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5" role="radiogroup" aria-label={x.stepProfession}>
              {PROFESSION_IDS.map((p) => {
                const Icon = PROFESSION_ICONS[p];
                const on = p === profession;
                return (
                  <button
                    key={p}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setProfession(p)}
                    className={`flex flex-col items-center justify-center gap-1.5 min-h-[72px] px-1 py-2.5 rounded-xl border text-[11.5px] sm:text-[12.5px] font-medium leading-tight text-center transition-colors
                      ${on ? 'border-primary bg-primary/10 text-fg ring-2 ring-primary/20' : 'border-line bg-bg2 text-muted hover:text-fg hover:border-line-strong'}`}
                  >
                    <Icon className={`w-[22px] h-[22px] ${on ? 'text-primary' : ''}`} />
                    {PROFESSION_NAMES[language][p]}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            {step(2, x.stepRange)}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2" role="radiogroup" aria-label={x.stepRange}>
              {LEVEL_RANGES.map((r) => {
                const on = r.range === range;
                return (
                  <button
                    key={r.range}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setRange(r.range)}
                    className={`h-10 rounded-lg border font-mono text-[13px] font-semibold transition-colors
                      ${on ? 'border-primary bg-primary/10 text-fg' : 'border-line bg-bg2 text-muted hover:text-fg hover:border-line-strong'}`}
                  >
                    {rangeLabel(r.range)}
                  </button>
                );
              })}
            </div>
            {recipe && (
              <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                <Scroll className="w-4 h-4 text-primary shrink-0" />
                {x.recipe}: <strong className="text-fg font-semibold">{recipe}</strong>
              </p>
            )}
          </section>

          <section className="max-w-xs">
            {step(3, x.stepXp)}
            <label htmlFor="xp-per-craft" className="sr-only">{x.stepXp}</label>
            <div className="relative">
              <input
                id="xp-per-craft"
                type="number"
                inputMode="numeric"
                min={1}
                value={xp}
                onChange={(e) => setXp(e.target.value)}
                placeholder="150"
                className="input font-mono pr-12"
              />
              <span className="absolute inset-y-0 right-3.5 flex items-center text-xs font-semibold text-subtle pointer-events-none">XP</span>
            </div>
            <p className="help">{x.xpHelp}</p>
          </section>
        </div>

        <div ref={resultRef} className="card p-5 md:p-6 lg:sticky lg:top-24 space-y-5 scroll-mt-24" aria-live="polite">
          <div className="flex items-center justify-between">
            <span className="caps-label">{x.crafts}</span>
            {result && <span className="flex items-center gap-1.5 text-xs font-semibold text-success"><span className="w-1.5 h-1.5 rounded-full bg-success" />{x.live}</span>}
          </div>
          {result ? (
            <>
              <div className="font-display font-extrabold text-accent text-5xl leading-none tracking-tight">
                {fmt(result.crafts)}<span className="text-base font-semibold text-muted tracking-normal ml-2">{x.craftsUnit}</span>
              </div>
              <div>
                <div className="h-2.5 rounded-full bg-gradient-to-r from-primary to-accent" />
                <div className="flex justify-between mt-1.5 text-xs text-muted font-medium">
                  <span>{x.level} {from}</span><span className="font-mono">{fmt(result.expDiff)} XP</span><span>{x.level} {to}</span>
                </div>
              </div>
              {recipes && recipes.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label={x.alternatives}>
                  <span className="text-xs text-muted font-medium mr-1">{x.alternatives}</span>
                  {recipes.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={i === alt}
                      onClick={() => setAlt(i)}
                      className={`chip ${i === alt ? 'chip-active' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
              {ingredients ? (
                <ul className="space-y-2">
                  {ingredients.map((ing) => (
                    <li key={ing.itemId} className="card-inset p-2.5 flex items-center gap-3">
                      <ItemImage gfx={ing.gfxId} itemId={ing.itemId} size={36} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-fg truncate">{ing.name ?? `#${ing.itemId}`}</div>
                        <div className="text-xs text-subtle">{x.perCraft(ing.qty)}</div>
                      </div>
                      <div className="font-mono font-bold text-lg text-fg shrink-0">{fmt(result.crafts * ing.qty)}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {[x.resource1, x.resource2].map((label) => (
                    <div key={label} className="card-inset p-3">
                      <div className="font-mono font-bold text-lg text-fg">{fmt(result.resources)}</div>
                      <div className="text-xs text-muted font-medium">{label}</div>
                      <div className="text-xs text-subtle">{x.perCraft(result.per)}</div>
                    </div>
                  ))}
                </div>
              )}
              {recipe && <p className="text-sm text-muted flex items-center gap-2"><Scroll className="w-4 h-4 text-primary" /> {recipe}</p>}
              {result.craftGuide && (
                <div>
                  <Link to={result.craftGuide} className="btn btn-primary w-full">
                    <ShoppingCart className="w-4 h-4" /> {x.shoppingList}
                  </Link>
                  <p className="help">{x.shoppingListHelp}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted leading-relaxed">{x.empty}</p>
          )}
        </div>
      </div>

      {/* phones: the result stays visible above the tab bar */}
      {result && (
        <button
          type="button"
          onClick={() => resultRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="lg:hidden fixed left-3 right-3 bottom-[76px] z-20 card shadow-pop flex items-center gap-3 px-4 py-3 text-left"
        >
          <span className="font-display font-extrabold text-2xl text-accent">{fmt(result.crafts)}</span>
          <span className="text-xs text-muted leading-tight">
            <strong className="text-fg">{x.craftsUnit}</strong> → {x.level} {to}<br />
            {ingredients ? ingredients.map((i) => fmt(result.crafts * i.qty)).join(' + ') : `${fmt(result.resources)} × 2`}
          </span>
          <span className="ml-auto icon-btn w-9 h-9"><ChevronUp className="w-4 h-4" /></span>
        </button>
      )}

      {toast && (
        <div role="status" className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 card shadow-pop px-4 py-2 text-sm font-semibold">
          {toast}
        </div>
      )}
    </div>
  );
}
