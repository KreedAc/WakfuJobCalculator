import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Search, Share2, X, Trash2, Save, FolderOpen, Ban, Hammer, Upload } from 'lucide-react';
import { PageSeo } from '../components/PageSeo';
import { ItemIcon } from '../components/ItemIcon';
import { BuilderTabs } from '../components/BuilderTabs';
import { PageHeader } from '../components/ui/PageHeader';
import { flatToPercent } from '../lib/combatFormulas';
import { craftGuideUrl } from '../lib/craftLink';
import { publishBuild, ApiError, savedAuthor, saveAuthor } from '../lib/buildsApi';
import { BUILD_GALLERY_T, CLASS_NAMES } from '../content/buildGallery';
import {
  loadEquipmentData, emptyBuild, equipItem, unequipSlot, isSlotBlocked,
  computeTotals, encodeBuild, decodeBuild, slotsForType, listSavedBuilds,
  saveBuild, deleteBuild, statDiff, sortValue, craftableRows, MAX_LEVEL, SORT_KEYS,
  type Build, type SortKey, type EquipmentData, type EquipmentItem, type SavedBuild,
} from '../lib/builder';
import {
  STAT_ACTIONS, SLOT_ORDER, SLOT_LABELS, WEAPON_TYPE_LABELS, RARITY_INFO,
  type SlotKey,
} from '../constants/equipmentStats';
import { BUILDER_T } from '../constants/builderTranslations';
import type { Language } from '../constants/translations';

function statLine(actionId: number, value: number, lang: Language, count?: number) {
  const meta = STAT_ACTIONS[actionId];
  if (!meta) return null;
  const label = meta.labels[lang].replace('{n}', String(count ?? ''));
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}${meta.percent ? '%' : ''} ${label}`;
}

// stat key (as used by itemStatMap) → an action id carrying its label
const KEY_TO_ACTION = new Map<string, number>();
for (const [id, meta] of Object.entries(STAT_ACTIONS)) {
  if (!KEY_TO_ACTION.has(meta.key)) KEY_TO_ACTION.set(meta.key, Number(id));
}

/** Label for a stat key; "elemMasteryN:3" → "Mastery of 3 elements". */
function keyLabel(key: string, lang: Language): string {
  const [base, n] = key.split(':');
  const meta = STAT_ACTIONS[KEY_TO_ACTION.get(base) ?? -1];
  return meta ? meta.labels[lang].replace('{n}', n ?? '') : base;
}

function DiffChips({ diff, lang }: { diff: [string, number][]; lang: Language }) {
  return (
    <span className="flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] leading-snug">
      {diff.map(([key, d]) => {
        const pct = STAT_ACTIONS[KEY_TO_ACTION.get(key.split(':')[0]) ?? -1]?.percent ? '%' : '';
        return (
          <span key={key} className={d > 0 ? 'text-primary' : 'text-danger'}>
            {d > 0 ? '+' : '−'}{Math.abs(d)}{pct} {keyLabel(key, lang)}
          </span>
        );
      })}
    </span>
  );
}

interface BuilderPageProps { language: Language; }

export function BuilderPage({ language }: BuilderPageProps) {
  const t = BUILDER_T[language];
  const g = BUILD_GALLERY_T[language];
  const [data, setData] = useState<EquipmentData | null>(null);
  const [build, setBuild] = useState<Build>(() => {
    if (typeof window === 'undefined') return emptyBuild(230); // prerender
    const m = window.location.hash.match(/#?b=([A-Za-z0-9_-]+)/);
    return (m && decodeBuild(m[1])) || emptyBuild(230);
  });
  const [activeSlot, setActiveSlot] = useState<SlotKey | null>(null);
  const [query, setQuery] = useState('');
  const [minLvl, setMinLvl] = useState(0);
  const [maxLvl, setMaxLvl] = useState(MAX_LEVEL);
  const [sortKey, setSortKey] = useState<SortKey>('level');
  const [statsOpen, setStatsOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [saves, setSaves] = useState<SavedBuild[]>(() => listSavedBuilds());
  const [saveName, setSaveName] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const [publishOpen, setPublishOpen] = useState(false);
  const [pub, setPub] = useState({ name: '', author: '', cls: -1, description: '' });
  const [pubState, setPubState] = useState<{ status: 'idle' | 'sending' | 'done' | 'error'; message?: string; id?: string }>({ status: 'idle' });

  useEffect(() => {
    let cancelled = false;
    loadEquipmentData(language).then((d) => { if (!cancelled) setData(d); });
    return () => { cancelled = true; };
  }, [language]);

  // keep the build shareable: mirror it into the URL hash
  useEffect(() => {
    const encoded = encodeBuild(build);
    window.history.replaceState(window.history.state, '', `#b=${encoded}`);
  }, [build]);

  const totals = useMemo(
    () => (data ? computeTotals(build, data) : null),
    [build, data]
  );

  const pickerItems = useMemo(() => {
    if (!data || !activeSlot) return [];
    const q = query.trim().toLowerCase();
    return data.items.filter((it) => {
      if (!slotsForType(it.type).includes(activeSlot)) return false;
      if (it.lvl < minLvl || it.lvl > maxLvl) return false;
      if (q && !it.name.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) =>
      (sortKey === 'level' ? 0 : sortValue(b, sortKey) - sortValue(a, sortKey)) || b.lvl - a.lvl || b.rarity - a.rarity);
  }, [data, activeSlot, query, minLvl, maxLvl, sortKey]);

  const equippedInActive = activeSlot && data ? data.byId.get(build.slots[activeSlot] ?? -1) : undefined;
  const craftRows = useMemo(() => (data ? craftableRows(build, data) : []), [build, data]);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };

  const share = async () => {
    const url = `${window.location.origin}/builder#b=${encodeBuild(build)}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Wakfu build', url }); return; } catch { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast(t.linkCopied);
    } catch { /* clipboard unavailable */ }
  };

  const hasItems = Object.values(build.slots).some(Boolean);

  const openPublish = () => {
    setPub((p) => ({ ...p, author: p.author || savedAuthor(), name: p.name || saveName }));
    setPubState({ status: 'idle' });
    setPublishOpen(true);
  };

  const submitPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pub.name.trim().length < 3 || pubState.status === 'sending') return;
    setPubState({ status: 'sending' });
    saveAuthor(pub.author.trim());
    try {
      const { id } = await publishBuild({
        code: encodeBuild(build), name: pub.name, author: pub.author, description: pub.description, class: pub.cls,
      });
      setPubState({ status: 'done', id });
    } catch (err) {
      setPubState({ status: 'error', message: err instanceof ApiError && err.status === 429 ? g.tooMany : g.publishError });
    }
  };

  const doEquip = (item: EquipmentItem) => {
    if (!activeSlot) return;
    setBuild((b) => equipItem(b, item, activeSlot));
    setActiveSlot(null);
    setQuery('');
  };

  const statRow = (label: string, value: number, opts?: { percent?: boolean; resHint?: boolean }) => (
    <div key={label} className="flex items-center justify-between py-1 border-b border-line last:border-0">
      <span className="text-muted text-sm">{label}</span>
      <span className="font-mono text-sm text-fg">
        {value}{opts?.percent ? '%' : ''}
        {opts?.resHint && value !== 0 && (
          <span className="text-primary ml-1.5 text-xs">{t.resPercentHint(flatToPercent(value).toFixed(1))}</span>
        )}
      </span>
    </div>
  );

  const renderStats = () => {
    if (!totals) return null;
    const tt = totals.totals;
    const elem = (k: string) => (tt.elemMastery ?? 0) + (tt[k] ?? 0);
    const res = (k: string) => (tt.elemRes ?? 0) + (tt[k] ?? 0);
    const nz = (v: number) => v !== 0;
    return (
      <div className="space-y-4">
        {totals.duplicateRings && (
          <div className="text-warning text-xs bg-warning/10 border border-warning/30 rounded-lg px-3 py-2">
            ⚠️ {t.duplicateRings}
          </div>
        )}
        <div>
          <div className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1">{t.statsGeneral}</div>
          {statRow('PV', tt.hp ?? 0)}
          {statRow('PA', tt.ap ?? 0)}
          {statRow('PM', tt.mp ?? 0)}
          {statRow('PW', tt.wp ?? 0)}
          {nz(tt.range ?? 0) && statRow(STAT_ACTIONS[160].labels[language], tt.range)}
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1">{t.statsCombat}</div>
          {['fireMastery', 'waterMastery', 'earthMastery', 'airMastery'].map((k, i) =>
            nz(elem(k)) ? statRow(STAT_ACTIONS[[122, 124, 123, 125][i]].labels[language], elem(k)) : null
          )}
          {totals.variable.filter((v) => v.key === 'elemMasteryN').map((v, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-line">
              <span className="text-muted text-sm">{STAT_ACTIONS[1068].labels[language].replace('{n}', String(v.count))}</span>
              <span className="font-mono text-sm text-fg">+{v.value}</span>
            </div>
          ))}
          {nz(tt.meleeMastery ?? 0) && statRow(STAT_ACTIONS[1052].labels[language], tt.meleeMastery)}
          {nz(tt.distMastery ?? 0) && statRow(STAT_ACTIONS[1053].labels[language], tt.distMastery)}
          {nz(tt.berserkMastery ?? 0) && statRow(STAT_ACTIONS[1055].labels[language], tt.berserkMastery)}
          {nz(tt.rearMastery ?? 0) && statRow(STAT_ACTIONS[180].labels[language], tt.rearMastery)}
          {nz(tt.healMastery ?? 0) && statRow(STAT_ACTIONS[26].labels[language], tt.healMastery)}
          {nz(tt.critMastery ?? 0) && statRow(STAT_ACTIONS[149].labels[language], tt.critMastery)}
          {statRow(STAT_ACTIONS[150].labels[language], tt.critHit ?? 0, { percent: true })}
          {nz(tt.block ?? 0) && statRow(STAT_ACTIONS[875].labels[language], tt.block, { percent: true })}
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1">{t.statsSecondary}</div>
          {([['lock', 173], ['dodge', 175], ['initiative', 171], ['fow', 177], ['wisdom', 166], ['prospecting', 162]] as const).map(([k, a]) =>
            nz(tt[k] ?? 0) ? statRow(STAT_ACTIONS[a].labels[language], tt[k]) : null
          )}
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1">{t.statsResistance}</div>
          {['fireRes', 'waterRes', 'earthRes', 'airRes'].map((k, i) =>
            nz(res(k)) ? statRow(STAT_ACTIONS[[82, 83, 84, 85][i]].labels[language], res(k), { resHint: true }) : null
          )}
          {totals.variable.filter((v) => v.key === 'elemResN').map((v, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-line">
              <span className="text-muted text-sm">{STAT_ACTIONS[1069].labels[language].replace('{n}', String(v.count))}</span>
              <span className="font-mono text-sm text-fg">+{v.value}</span>
            </div>
          ))}
          {nz(tt.rearRes ?? 0) && statRow(STAT_ACTIONS[71].labels[language], tt.rearRes)}
          {nz(tt.critRes ?? 0) && statRow(STAT_ACTIONS[988].labels[language], tt.critRes)}
        </div>
      </div>
    );
  };

  if (!data) {
    // Also what the prerenderer captures: keep the SEO tags and page header here.
    return (
      <div>
        <PageSeo title={t.pageTitle} description={t.pageSubtitle} path="/builder" />
        <PageHeader title={t.pageTitle} subtitle={t.pageSubtitle} actions={<BuilderTabs current="builder" labels={{ builder: g.tabBuilder, gallery: g.tabGallery }} />} />
        <div className="flex flex-col items-center py-16 text-primary">
          <div className="w-8 h-8 border-2 border-line border-t-primary rounded-full animate-spin mb-3" />
          {t.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 lg:pb-0">
      <PageSeo title={t.pageTitle} description={t.pageSubtitle} path="/builder" />
      <PageHeader title={t.pageTitle} subtitle={t.pageSubtitle} actions={<BuilderTabs current="builder" labels={{ builder: g.tabBuilder, gallery: g.tabGallery }} />} />

      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-6 lg:items-start">
        {/* ── left column: level, slots, saves ── */}
        <div className="space-y-4">
          <div className="card rounded-2xl p-4 flex items-center gap-3 flex-wrap">
            <label className="text-xs font-medium text-primary uppercase tracking-wide">{t.level}</label>
            <input
              type="number" min={1} max={MAX_LEVEL} value={build.level}
              onChange={(e) => setBuild((b) => ({ ...b, level: Math.max(1, Math.min(MAX_LEVEL, parseInt(e.target.value) || 1)) }))}
              className="card-inset px-3 py-2 rounded-xl text-fg text-sm w-24 focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
            <button
              onClick={share}
              className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-accent hover:bg-accent-strong text-on-accent shadow-lg transition-all"
            >
              <Share2 className="w-4 h-4" /> {t.share}
            </button>
            <button
              onClick={openPublish}
              disabled={!hasItems}
              title={hasItems ? g.publishTitle : g.emptyBuild}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm card-inset border border-line text-primary hover:border-line transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" /> {g.publish}
            </button>
            {craftRows.length > 0 && (
              <Link
                to={craftGuideUrl(craftRows)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm card-inset border border-line text-primary hover:border-line transition-all"
              >
                <Hammer className="w-4 h-4" /> {t.craftList(craftRows.reduce((n, r) => n + r.qty, 0))}
              </Link>
            )}
          </div>

          <div className="card rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2">
            {SLOT_ORDER.map((slot) => {
              const itemId = build.slots[slot];
              const item = itemId ? data.byId.get(itemId) : undefined;
              const blocked = isSlotBlocked(build, slot, data);
              return (
                <button
                  key={slot}
                  disabled={blocked}
                  onClick={() => { setActiveSlot(slot); setMaxLvl(build.level); setMinLvl(Math.max(0, build.level - 35)); }}
                  className={`card-inset rounded-xl p-2.5 flex items-center gap-2.5 text-left min-h-[64px] transition-all border
                    ${blocked ? 'opacity-40 cursor-not-allowed border-transparent' : item ? 'border-line hover:border-line' : 'border-transparent hover:border-line'}`}
                >
                  {blocked ? (
                    <Ban className="w-8 h-8 text-subtle shrink-0" />
                  ) : item ? (
                    <ItemIcon item={item} size={40} />
                  ) : (
                    <span className="w-10 h-10 rounded bg-surface2 border border-dashed border-line shrink-0" />
                  )}
                  <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-wide text-primary font-semibold">{SLOT_LABELS[slot][language]}</span>
                    <span className={`block text-xs truncate ${item ? RARITY_INFO[item.rarity]?.className ?? 'text-fg' : 'text-subtle'}`}>
                      {blocked ? t.blockedSlot : item ? item.name : t.emptySlot}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* saves */}
          <div className="card rounded-2xl p-4">
            <div className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-2 flex items-center gap-2">
              <FolderOpen className="w-3.5 h-3.5" /> {t.myBuilds}
            </div>
            <div className="flex gap-2 mb-3">
              <input
                value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder={t.buildName}
                className="card-inset px-3 py-2 rounded-xl text-fg text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
              <button
                onClick={() => { if (saveName.trim()) { setSaves(saveBuild(saveName.trim(), build)); showToast('✓'); } }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold card-inset border border-line text-primary hover:border-line"
              >
                <Save className="w-4 h-4" /> {t.save}
              </button>
            </div>
            {saves.map((s) => (
              <div key={s.name} className="flex items-center gap-2 py-1.5 border-b border-line last:border-0">
                <span className="text-sm text-muted truncate flex-1">{s.name}</span>
                <button onClick={() => { setBuild(s.build); setSaveName(s.name); }} className="text-xs text-primary hover:text-primary font-semibold px-2 py-1">{t.load}</button>
                <button onClick={() => setSaves(deleteBuild(s.name))} className="text-subtle hover:text-danger p-1"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* ── desktop stats column ── */}
        <div className="hidden lg:block card rounded-2xl p-5 sticky top-24">
          <div className="text-sm font-bold text-fg mb-3">{t.stats}</div>
          {renderStats()}
        </div>
      </div>

      {/* ── mobile sticky stats bar ── */}
      <div className="lg:hidden fixed bottom-[76px] left-3 right-3 z-20">
        <button
          onClick={() => setStatsOpen(true)}
          className="w-full card shadow-pop px-4 py-3 flex items-center justify-between text-sm"
        >
          <span className="font-semibold text-primary">{t.stats} ▲</span>
          <span className="font-mono text-muted">
            {totals ? `${totals.totals.hp} PV · ${totals.totals.ap} PA · ${totals.totals.mp} PM` : ''}
          </span>
        </button>
      </div>
      {statsOpen && createPortal(
        <div className="lg:hidden fixed inset-0 z-[100] bg-bg/95 backdrop-blur-md overflow-y-auto">
          <div className="max-w-lg mx-auto p-5 pb-16">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-fg">{t.stats}</span>
              <button onClick={() => setStatsOpen(false)} className="p-2 text-muted hover:text-fg"><X className="w-6 h-6" /></button>
            </div>
            {renderStats()}
          </div>
        </div>,
        document.body
      )}

      {/* ── item picker (full-screen sheet on mobile, modal on desktop) ── */}
      {activeSlot && createPortal(
        <div className="fixed inset-0 z-[100] bg-bg/90 backdrop-blur-md flex lg:items-center lg:justify-center">
          <div className="w-full h-full lg:h-[80vh] lg:max-w-2xl lg:rounded-3xl card shadow-pop flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-line">
              <span className="font-bold text-fg">{SLOT_LABELS[activeSlot][language]}</span>
              <div className="flex items-center gap-2">
                {equippedInActive && (
                  <button
                    onClick={() => { setBuild((b) => unequipSlot(b, activeSlot)); setActiveSlot(null); }}
                    className="text-xs font-semibold text-danger hover:text-danger px-3 py-1.5 rounded-lg border border-danger/30"
                  >
                    {t.unequip}
                  </button>
                )}
                <button onClick={() => { setActiveSlot(null); setQuery(''); }} className="p-2 text-muted hover:text-fg"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="px-4 py-3 flex gap-2 items-center border-b border-line">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                <input
                  autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPlaceholder}
                  className="card-inset w-full pl-9 pr-3 py-2.5 rounded-xl text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>
              <input
                type="number" value={minLvl} min={0} max={MAX_LEVEL} title={t.minLevel} aria-label={t.minLevel}
                onChange={(e) => setMinLvl(parseInt(e.target.value) || 0)}
                className="card-inset w-16 px-2 py-2.5 rounded-xl text-fg text-sm text-center focus:outline-none"
              />
              <input
                type="number" value={maxLvl} min={0} max={MAX_LEVEL} title={t.maxLevel} aria-label={t.maxLevel}
                onChange={(e) => setMaxLvl(parseInt(e.target.value) || MAX_LEVEL)}
                className="card-inset w-16 px-2 py-2.5 rounded-xl text-fg text-sm text-center focus:outline-none"
              />
            </div>
            <div className="px-4 py-2 flex items-center gap-2 border-b border-line text-xs">
              <label htmlFor="builder-sort" className="text-primary font-medium shrink-0">{t.sortBy}</label>
              <select
                id="builder-sort" value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="card-inset px-2 py-1.5 rounded-lg text-fg text-xs min-w-0 flex-1 sm:flex-none focus:outline-none focus:ring-2 focus:ring-primary/25"
              >
                <option value="level">{t.level}</option>
                {SORT_KEYS.map((k) => <option key={k} value={k}>{keyLabel(k, language)}</option>)}
              </select>
              {equippedInActive && (
                <span className="ml-auto text-primary truncate">± {t.vsEquipped}</span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2">
              <div className="text-[11px] text-primary px-1 pb-1">{t.showingOf(Math.min(pickerItems.length, 60), pickerItems.length)}</div>
              {pickerItems.length === 0 && <div className="text-center text-subtle py-10">{t.noResults}</div>}
              {pickerItems.slice(0, 60).map((it) => (
                <button
                  key={it.id}
                  onClick={() => doEquip(it)}
                  className={`w-full card-inset rounded-xl p-3 mb-2 flex gap-3 text-left border transition-all hover:border-line
                    ${it.id === equippedInActive?.id ? 'border-line' : 'border-transparent'}`}
                >
                  <ItemIcon item={it} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className={`text-sm font-semibold truncate ${RARITY_INFO[it.rarity]?.className ?? 'text-fg'}`}>{it.name}</span>
                      <span className="text-[11px] text-primary shrink-0">
                        {t.level} {it.lvl}{WEAPON_TYPE_LABELS[it.type] ? ` · ${WEAPON_TYPE_LABELS[it.type][language]}` : ''}
                      </span>
                      {it.id === equippedInActive?.id && <span className="text-[10px] text-primary shrink-0">✓ {t.equipped}</span>}
                      {it.craft && (
                        <span title={t.craftable} className="shrink-0 self-center">
                          <Hammer className="w-3 h-3 text-primary" aria-label={t.craftable} />
                        </span>
                      )}
                    </span>
                    {equippedInActive && it.id !== equippedInActive.id ? (
                      <DiffChips diff={statDiff(it, equippedInActive)} lang={language} />
                    ) : (
                      <span className="block text-xs text-subtle truncate">
                        {it.stats.map(([a, v, c]) => statLine(a, v, language, c)).filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {publishOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-bg/90 backdrop-blur-md flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="publish-title">
          <div className="w-full sm:max-w-md card shadow-pop rounded-t-3xl sm:rounded-3xl p-5 max-h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 id="publish-title" className="font-bold text-lg text-fg">{g.publishTitle}</h2>
              <button onClick={() => setPublishOpen(false)} aria-label={g.cancel} className="p-2 text-muted hover:text-fg"><X className="w-5 h-5" /></button>
            </div>
            {pubState.status === 'done' ? (
              <div className="text-center py-4 space-y-4">
                <p className="text-fg font-semibold">✓ {g.published}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link
                    to={`/builds?id=${pubState.id}`}
                    className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-accent hover:bg-accent-strong text-on-accent"
                  >
                    {g.viewInGallery}
                  </Link>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(`${window.location.origin}/builds?id=${pubState.id}`)
                        .then(() => showToast(t.linkCopied)).catch(() => {});
                    }}
                    className="px-4 py-2.5 rounded-xl font-semibold text-sm card-inset border border-line text-primary"
                  >
                    {g.copyLink}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submitPublish} className="space-y-3">
                <p className="text-sm text-muted">{g.publishIntro}</p>
                <label className="block">
                  <span className="text-xs font-medium text-primary">{g.name}</span>
                  <input
                    required minLength={3} maxLength={60} autoFocus value={pub.name} placeholder={g.namePlaceholder}
                    onChange={(e) => setPub({ ...pub, name: e.target.value })}
                    className="card-inset w-full px-3 py-2.5 rounded-xl text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 mt-1"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="text-xs font-medium text-primary">{g.className}</span>
                    <select value={pub.cls} onChange={(e) => setPub({ ...pub, cls: Number(e.target.value) })} className="card-inset w-full px-3 py-2.5 rounded-xl text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 mt-1">
                      <option value={-1}>{g.noClass}</option>
                      {CLASS_NAMES[language].map((name, i) => ({ name, i }))
                        .sort((a, b) => a.name.localeCompare(b.name, language))
                        .map(({ name, i }) => <option key={i} value={i}>{name}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-primary">{g.author}</span>
                    <input maxLength={30} value={pub.author} onChange={(e) => setPub({ ...pub, author: e.target.value })} className="card-inset w-full px-3 py-2.5 rounded-xl text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 mt-1" />
                  </label>
                </div>
                <label className="block">
                  <span className="text-xs font-medium text-primary">{g.description}</span>
                  <textarea
                    maxLength={500} rows={4} value={pub.description} placeholder={g.descriptionPlaceholder}
                    onChange={(e) => setPub({ ...pub, description: e.target.value })}
                    className="card-inset w-full px-3 py-2.5 rounded-xl text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 mt-1 resize-none"
                  />
                </label>
                <p className="text-[11px] text-subtle">{g.rules}</p>
                {pubState.status === 'error' && <p role="alert" className="text-sm text-danger">{pubState.message}</p>}
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setPublishOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-muted hover:text-fg">{g.cancel}</button>
                  <button
                    type="submit" disabled={pubState.status === 'sending' || pub.name.trim().length < 3}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-accent hover:bg-accent-strong text-on-accent disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" /> {g.submit}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}

      {toast && createPortal(
        <div className="fixed bottom-40 lg:bottom-8 left-1/2 -translate-x-1/2 z-[110] card shadow-pop px-5 py-2.5 rounded-full text-sm text-fg border border-line">
          {toast}
        </div>,
        document.body
      )}
    </div>
  );
}
