import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Share2, X, Trash2, Save, FolderOpen, Ban } from 'lucide-react';
import { PageSeo } from '../components/PageSeo';
import { getItemIconUrl } from '../lib/wakfuData';
import {
  loadEquipmentData, emptyBuild, equipItem, unequipSlot, isSlotBlocked,
  computeTotals, encodeBuild, decodeBuild, slotsForType, listSavedBuilds,
  saveBuild, deleteBuild, MAX_LEVEL,
  type Build, type EquipmentData, type EquipmentItem, type SavedBuild,
} from '../lib/builder';
import {
  STAT_ACTIONS, SLOT_ORDER, SLOT_LABELS, WEAPON_TYPE_LABELS, RARITY_INFO,
  type SlotKey,
} from '../constants/equipmentStats';
import { BUILDER_T } from '../constants/builderTranslations';
import type { Language } from '../constants/translations';

const flatResToPercent = (f: number) =>
  Math.min(Math.floor((1 - Math.pow(0.8, Math.max(f, 0) / 100)) * 1000) / 10, 90);

function ItemIcon({ item, size = 40 }: { item: EquipmentItem; size?: number }) {
  const [failed, setFailed] = useState(false);
  if (!item.gfx || failed) {
    return (
      <span
        className="flex items-center justify-center rounded bg-slate-800 text-emerald-500/60 text-[10px] font-bold"
        style={{ width: size, height: size }}
      >
        {item.name.slice(0, 2)}
      </span>
    );
  }
  return (
    <img
      src={getItemIconUrl(item.gfx)}
      alt={item.name}
      width={size}
      height={size}
      loading="lazy"
      className="rounded object-contain bg-slate-800/60"
      onError={() => setFailed(true)}
    />
  );
}

function statLine(actionId: number, value: number, lang: Language, count?: number) {
  const meta = STAT_ACTIONS[actionId];
  if (!meta) return null;
  const label = meta.labels[lang].replace('{n}', String(count ?? ''));
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}${meta.percent ? '%' : ''} ${label}`;
}

interface BuilderPageProps { language: Language; }

export function BuilderPage({ language }: BuilderPageProps) {
  const t = BUILDER_T[language];
  const [data, setData] = useState<EquipmentData | null>(null);
  const [build, setBuild] = useState<Build>(() => {
    const m = window.location.hash.match(/#?b=([A-Za-z0-9_-]+)/);
    return (m && decodeBuild(m[1])) || emptyBuild(230);
  });
  const [activeSlot, setActiveSlot] = useState<SlotKey | null>(null);
  const [query, setQuery] = useState('');
  const [minLvl, setMinLvl] = useState(0);
  const [maxLvl, setMaxLvl] = useState(MAX_LEVEL);
  const [statsOpen, setStatsOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [saves, setSaves] = useState<SavedBuild[]>(() => listSavedBuilds());
  const [saveName, setSaveName] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let cancelled = false;
    loadEquipmentData(language).then((d) => { if (!cancelled) setData(d); });
    return () => { cancelled = true; };
  }, [language]);

  // keep the build shareable: mirror it into the URL hash
  useEffect(() => {
    const encoded = encodeBuild(build);
    window.history.replaceState(null, '', `#b=${encoded}`);
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
    }).sort((a, b) => b.lvl - a.lvl || b.rarity - a.rarity);
  }, [data, activeSlot, query, minLvl, maxLvl]);

  const equippedInActive = activeSlot && data ? data.byId.get(build.slots[activeSlot] ?? -1) : undefined;

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

  const doEquip = (item: EquipmentItem) => {
    if (!activeSlot) return;
    setBuild((b) => equipItem(b, item, activeSlot));
    setActiveSlot(null);
    setQuery('');
  };

  const statRow = (label: string, value: number, opts?: { percent?: boolean; resHint?: boolean }) => (
    <div key={label} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
      <span className="text-emerald-100/75 text-sm">{label}</span>
      <span className="font-mono text-sm text-emerald-50">
        {value}{opts?.percent ? '%' : ''}
        {opts?.resHint && value !== 0 && (
          <span className="text-emerald-400/60 ml-1.5 text-xs">{t.resPercentHint(flatResToPercent(value).toFixed(1))}</span>
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
          <div className="text-amber-300 text-xs bg-amber-900/30 border border-amber-500/30 rounded-lg px-3 py-2">
            ⚠️ {t.duplicateRings}
          </div>
        )}
        <div>
          <div className="text-[11px] uppercase tracking-widest text-emerald-400/60 font-semibold mb-1">{t.statsGeneral}</div>
          {statRow('PV', tt.hp ?? 0)}
          {statRow('PA', tt.ap ?? 0)}
          {statRow('PM', tt.mp ?? 0)}
          {statRow('PW', tt.wp ?? 0)}
          {nz(tt.range ?? 0) && statRow(STAT_ACTIONS[160].labels[language], tt.range)}
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-emerald-400/60 font-semibold mb-1">{t.statsCombat}</div>
          {['fireMastery', 'waterMastery', 'earthMastery', 'airMastery'].map((k, i) =>
            nz(elem(k)) ? statRow(STAT_ACTIONS[[122, 124, 123, 125][i]].labels[language], elem(k)) : null
          )}
          {totals.variable.filter((v) => v.key === 'elemMasteryN').map((v, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-emerald-100/75 text-sm">{STAT_ACTIONS[1068].labels[language].replace('{n}', String(v.count))}</span>
              <span className="font-mono text-sm text-emerald-50">+{v.value}</span>
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
          <div className="text-[11px] uppercase tracking-widest text-emerald-400/60 font-semibold mb-1">{t.statsSecondary}</div>
          {([['lock', 173], ['dodge', 175], ['initiative', 171], ['fow', 177], ['wisdom', 166], ['prospecting', 162]] as const).map(([k, a]) =>
            nz(tt[k] ?? 0) ? statRow(STAT_ACTIONS[a].labels[language], tt[k]) : null
          )}
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-emerald-400/60 font-semibold mb-1">{t.statsResistance}</div>
          {['fireRes', 'waterRes', 'earthRes', 'airRes'].map((k, i) =>
            nz(res(k)) ? statRow(STAT_ACTIONS[[82, 83, 84, 85][i]].labels[language], res(k), { resHint: true }) : null
          )}
          {totals.variable.filter((v) => v.key === 'elemResN').map((v, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-emerald-100/75 text-sm">{STAT_ACTIONS[1069].labels[language].replace('{n}', String(v.count))}</span>
              <span className="font-mono text-sm text-emerald-50">+{v.value}</span>
            </div>
          ))}
          {nz(tt.rearRes ?? 0) && statRow(STAT_ACTIONS[71].labels[language], tt.rearRes)}
          {nz(tt.critRes ?? 0) && statRow(STAT_ACTIONS[988].labels[language], tt.critRes)}
        </div>
      </div>
    );
  };

  if (!data) {
    return (
      <div className="flex flex-col items-center py-24 text-emerald-300/70">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mb-3" />
        {t.loading}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-28 lg:pb-8 animate-in fade-in duration-500">
      <PageSeo title={t.pageTitle} description={t.pageSubtitle} path="/builder" />
      <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-200">
        {t.pageTitle}
      </h1>
      <p className="text-emerald-100/80 mb-6 text-center max-w-2xl mx-auto text-base drop-shadow-md">{t.pageSubtitle}</p>

      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-6 lg:items-start">
        {/* ── left column: level, slots, saves ── */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-4 flex items-center gap-3 flex-wrap">
            <label className="text-xs font-medium text-emerald-400 uppercase tracking-wide">{t.level}</label>
            <input
              type="number" min={1} max={MAX_LEVEL} value={build.level}
              onChange={(e) => setBuild((b) => ({ ...b, level: Math.max(1, Math.min(MAX_LEVEL, parseInt(e.target.value) || 1)) }))}
              className="glass-soft px-3 py-2 rounded-xl text-emerald-50 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            <button
              onClick={share}
              className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg transition-all"
            >
              <Share2 className="w-4 h-4" /> {t.share}
            </button>
          </div>

          <div className="glass rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2">
            {SLOT_ORDER.map((slot) => {
              const itemId = build.slots[slot];
              const item = itemId ? data.byId.get(itemId) : undefined;
              const blocked = isSlotBlocked(build, slot, data);
              return (
                <button
                  key={slot}
                  disabled={blocked}
                  onClick={() => { setActiveSlot(slot); setMaxLvl(build.level); setMinLvl(Math.max(0, build.level - 35)); }}
                  className={`glass-soft rounded-xl p-2.5 flex items-center gap-2.5 text-left min-h-[64px] transition-all border
                    ${blocked ? 'opacity-40 cursor-not-allowed border-transparent' : item ? 'border-emerald-500/40 hover:border-emerald-400/70' : 'border-transparent hover:border-emerald-500/30'}`}
                >
                  {blocked ? (
                    <Ban className="w-8 h-8 text-emerald-200/30 shrink-0" />
                  ) : item ? (
                    <ItemIcon item={item} size={40} />
                  ) : (
                    <span className="w-10 h-10 rounded bg-slate-800/60 border border-dashed border-emerald-500/25 shrink-0" />
                  )}
                  <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-wide text-emerald-400/70 font-semibold">{SLOT_LABELS[slot][language]}</span>
                    <span className={`block text-xs truncate ${item ? RARITY_INFO[item.rarity]?.className ?? 'text-emerald-50' : 'text-emerald-200/40'}`}>
                      {blocked ? t.blockedSlot : item ? item.name : t.emptySlot}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* saves */}
          <div className="glass rounded-2xl p-4">
            <div className="text-[11px] uppercase tracking-widest text-emerald-400/60 font-semibold mb-2 flex items-center gap-2">
              <FolderOpen className="w-3.5 h-3.5" /> {t.myBuilds}
            </div>
            <div className="flex gap-2 mb-3">
              <input
                value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder={t.buildName}
                className="glass-soft px-3 py-2 rounded-xl text-emerald-50 text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
              <button
                onClick={() => { if (saveName.trim()) { setSaves(saveBuild(saveName.trim(), build)); showToast('✓'); } }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold glass-soft border border-emerald-500/30 text-emerald-300 hover:border-emerald-400/60"
              >
                <Save className="w-4 h-4" /> {t.save}
              </button>
            </div>
            {saves.map((s) => (
              <div key={s.name} className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
                <span className="text-sm text-emerald-100/85 truncate flex-1">{s.name}</span>
                <button onClick={() => { setBuild(s.build); setSaveName(s.name); }} className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold px-2 py-1">{t.load}</button>
                <button onClick={() => setSaves(deleteBuild(s.name))} className="text-emerald-200/40 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* ── desktop stats column ── */}
        <div className="hidden lg:block glass rounded-2xl p-5 sticky top-24">
          <div className="text-sm font-bold text-emerald-200 mb-3">{t.stats}</div>
          {renderStats()}
        </div>
      </div>

      {/* ── mobile sticky stats bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <button
          onClick={() => setStatsOpen(true)}
          className="w-full glass-strong border-t border-emerald-500/25 px-5 py-3 flex items-center justify-between text-sm"
        >
          <span className="font-semibold text-emerald-300">{t.stats} ▲</span>
          <span className="font-mono text-emerald-100/85">
            {totals ? `${totals.totals.hp} PV · ${totals.totals.ap} PA · ${totals.totals.mp} PM` : ''}
          </span>
        </button>
      </div>
      {statsOpen && createPortal(
        <div className="lg:hidden fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md overflow-y-auto">
          <div className="max-w-lg mx-auto p-5 pb-16">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-emerald-200">{t.stats}</span>
              <button onClick={() => setStatsOpen(false)} className="p-2 text-emerald-200/70 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            {renderStats()}
          </div>
        </div>,
        document.body
      )}

      {/* ── item picker (full-screen sheet on mobile, modal on desktop) ── */}
      {activeSlot && createPortal(
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex lg:items-center lg:justify-center">
          <div className="w-full h-full lg:h-[80vh] lg:max-w-2xl lg:rounded-3xl glass-strong flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-500/20">
              <span className="font-bold text-emerald-200">{SLOT_LABELS[activeSlot][language]}</span>
              <div className="flex items-center gap-2">
                {equippedInActive && (
                  <button
                    onClick={() => { setBuild((b) => unequipSlot(b, activeSlot)); setActiveSlot(null); }}
                    className="text-xs font-semibold text-red-300/90 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-400/30"
                  >
                    {t.unequip}
                  </button>
                )}
                <button onClick={() => { setActiveSlot(null); setQuery(''); }} className="p-2 text-emerald-200/70 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="px-4 py-3 flex gap-2 items-center border-b border-emerald-500/10">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
                <input
                  autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPlaceholder}
                  className="glass-soft w-full pl-9 pr-3 py-2.5 rounded-xl text-emerald-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              <input
                type="number" value={minLvl} min={0} max={MAX_LEVEL} title={t.minLevel} aria-label={t.minLevel}
                onChange={(e) => setMinLvl(parseInt(e.target.value) || 0)}
                className="glass-soft w-16 px-2 py-2.5 rounded-xl text-emerald-50 text-sm text-center focus:outline-none"
              />
              <input
                type="number" value={maxLvl} min={0} max={MAX_LEVEL} title={t.maxLevel} aria-label={t.maxLevel}
                onChange={(e) => setMaxLvl(parseInt(e.target.value) || MAX_LEVEL)}
                className="glass-soft w-16 px-2 py-2.5 rounded-xl text-emerald-50 text-sm text-center focus:outline-none"
              />
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2">
              <div className="text-[11px] text-emerald-400/60 px-1 pb-1">{t.showingOf(Math.min(pickerItems.length, 60), pickerItems.length)}</div>
              {pickerItems.length === 0 && <div className="text-center text-emerald-200/50 py-10">{t.noResults}</div>}
              {pickerItems.slice(0, 60).map((it) => (
                <button
                  key={it.id}
                  onClick={() => doEquip(it)}
                  className={`w-full glass-soft rounded-xl p-3 mb-2 flex gap-3 text-left border transition-all hover:border-emerald-400/60
                    ${it.id === equippedInActive?.id ? 'border-emerald-500/60' : 'border-transparent'}`}
                >
                  <ItemIcon item={it} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className={`text-sm font-semibold truncate ${RARITY_INFO[it.rarity]?.className ?? 'text-emerald-50'}`}>{it.name}</span>
                      <span className="text-[11px] text-emerald-400/70 shrink-0">
                        {t.level} {it.lvl}{WEAPON_TYPE_LABELS[it.type] ? ` · ${WEAPON_TYPE_LABELS[it.type][language]}` : ''}
                      </span>
                      {it.id === equippedInActive?.id && <span className="text-[10px] text-emerald-400 shrink-0">✓ {t.equipped}</span>}
                    </span>
                    <span className="block text-xs text-emerald-100/60 truncate">
                      {it.stats.map(([a, v, c]) => statLine(a, v, language, c)).filter(Boolean).join(' · ')}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {toast && createPortal(
        <div className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-[110] glass-strong px-5 py-2.5 rounded-full text-sm text-emerald-200 border border-emerald-500/40">
          {toast}
        </div>,
        document.body
      )}
    </div>
  );
}
