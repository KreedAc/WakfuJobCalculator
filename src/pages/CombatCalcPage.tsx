import { useId, useState } from 'react';
import {
  Swords, HeartPulse, ShieldPlus, Scale, Shield, Percent, Zap, Link2, Droplet, Sword, type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import type { Language } from '../constants/translations';
import { PageSeo } from '../components/PageSeo';
import {
  damage, heal, armor, effectiveMasteries, effectiveHp, flatToPercent, percentToFlat,
  forceOfWill, lockLoss, totalHp, type Position,
} from '../lib/combatFormulas';
import {
  COMBAT_CALC_T,
  COMBAT_TAB_IDS,
  type CombatCalcT,
  type CombatTabId,
} from '../constants/combatCalcTranslations';

// ─── Small reusable UI ───────────────────────────────────────────────────────

const TAB_ICONS: Record<CombatTabId, LucideIcon> = {
  damage: Swords, heal: HeartPulse, armor: ShieldPlus, build: Scale, tank: Shield,
  resistance: Percent, fow: Zap, lock: Link2, hp: Droplet, em: Sword,
};

/** "?" hint: opens on hover (mouse) and on tap (touch), closes on blur. */
function Tip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={text}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        // touch taps also fire synthetic hover events: only mice open on hover
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOpen(true); }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') setOpen(false); }}
        className="w-[18px] h-[18px] rounded-full bg-primary/15 text-primary text-[10px] font-bold grid place-items-center cursor-help"
      >
        ?
      </button>
      {open && (
        <span role="tooltip" className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 max-w-[70vw] card shadow-pop p-2.5 text-xs text-muted leading-snug z-50 pointer-events-none font-normal whitespace-normal">
          {text}
        </span>
      )}
    </span>
  );
}

function Num({ label, value, onChange, min, max, placeholder, tip }: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; placeholder?: string; tip?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 mb-1.5 min-h-[18px]">
        <label htmlFor={id} className="text-[13px] font-semibold text-muted">{label}</label>
        {tip && <Tip text={tip} />}
      </div>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={value || ''}
        min={min}
        max={max}
        placeholder={placeholder ?? '0'}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="input font-mono h-10"
      />
    </div>
  );
}

function Sel({ label, value, onChange, options }: {
  label: string; value: number; onChange: (v: number) => void;
  options: { label: string; value: number }[];
}) {
  const id = useId();
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-[13px] font-semibold text-muted mb-1.5 min-h-[18px]">{label}</label>
      <select id={id} value={value} onChange={e => onChange(parseFloat(e.target.value))} className="input h-10 text-sm">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-4 h-4 accent-[rgb(var(--primary))]" />
      {label}
    </label>
  );
}

/** Result tile; the first result of a calculator is the highlighted one. */
function ResBox({ label, value, main }: { label: string; value: string; main?: boolean }) {
  return (
    <div className={`rounded-xl border p-3.5 ${main ? 'border-accent/40 bg-accent/10' : 'border-line bg-bg2'}`}>
      <div className="text-xs font-medium text-subtle mb-1">{label}</div>
      <div className={`font-display text-2xl font-bold tracking-tight ${main ? 'text-accent' : 'text-fg'}`}>{value}</div>
    </div>
  );
}

function SecLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-3">
      <span className="caps-label whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-line" />
    </div>
  );
}

function RadioPos({ pos, setPos, t }: { pos: Position; setPos: (p: Position) => void; t: CombatCalcT }) {
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup">
      {([['facing', t.posFacing], ['side', t.posSide], ['rear', t.posRear]] as const).map(([v, label]) => (
        <button key={v} type="button" role="radio" aria-checked={pos === v} onClick={() => setPos(v)}
          className={`h-10 rounded-xl border text-sm font-semibold transition-colors
            ${pos === v ? 'border-primary bg-primary/10 text-fg' : 'border-line bg-bg2 text-muted hover:text-fg'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function fmt(n: number) { return isFinite(n) ? Math.round(n).toLocaleString() : '—'; }
function fmtD(n: number, d = 1) { return isFinite(n) ? n.toFixed(d) : '—'; }
function winCls(a: number, b: number) {
  return { a: a > b ? 'text-success font-bold' : 'text-subtle', b: b > a ? 'text-success font-bold' : 'text-subtle' };
}

// ─── Main page component ─────────────────────────────────────────────────────
interface CombatCalcPageProps { language: Language; }

export function CombatCalcPage({ language }: CombatCalcPageProps) {
  const ct = COMBAT_CALC_T[language];
  const [tab, setTab] = useState<CombatTabId>('damage');

  // ── Damage ──
  const [dBase,setDBase]=useState(100); const [dElem,setDElem]=useState(0); const [dRange,setDRange]=useState(0);
  const [dBerserk,setDBerserk]=useState(0); const [dRear,setDRear]=useState(0); const [dCrit,setDCrit]=useState(0);
  const [dDI,setDDI]=useState(0); const [dRes,setDRes]=useState(0); const [dFixed,setDFixed]=useState(0);
  const [dBlock,setDBlock]=useState(1); const [dBarrier,setDBarrier]=useState(0);
  const [dPos,setDPos]=useState<Position>('facing'); const [dIsCrit,setDIsCrit]=useState(false); const [dIsBerserk,setDIsBerserk]=useState(false);
  const mastNorm = dElem+dRange+(dIsBerserk?dBerserk:0)+(dPos==='rear'?dRear:0);
  const mastCrit = mastNorm+dCrit;
  const calcDmg=(b:number,m:number)=>damage({base:b,masteries:m,position:dPos,damageInflicted:dDI,resistance:dRes,fixed:dFixed,barrier:dBarrier,block:dBlock});
  const normalDmg=calcDmg(dBase,mastNorm); const critDmg=calcDmg(dBase*1.25,mastCrit);

  // ── Heal ──
  const [hBase,setHBase]=useState(100); const [hElem,setHElem]=useState(0); const [hRange,setHRange]=useState(0);
  const [hHeal,setHHeal]=useState(0); const [hBerserk,setHBerserk]=useState(0); const [hCrit,setHCrit]=useState(0);
  const [hHP,setHHP]=useState(0); const [hHR,setHHR]=useState(0); const [hHealRes,setHHealRes]=useState(0); const [hIncur,setHIncur]=useState(0);
  const [hIsCrit,setHIsCrit]=useState(false); const [hIsBerserk,setHIsBerserk]=useState(false);
  const hMastNorm=hElem+hRange+hHeal+(hIsBerserk?hBerserk:0); const hMastCrit=hMastNorm+hCrit;
  const calcHeal=(b:number,m:number)=>heal({base:b,masteries:m,healsPerformed:hHP,healsReceived:hHR,healResistance:hHealRes,incurable:hIncur});
  const normalHeal=calcHeal(hBase,hMastNorm); const critHeal=calcHeal(hBase*1.25,hMastCrit);

  // ── Armor ──
  const [arBase,setArBase]=useState(100); const [arGiven,setArGiven]=useState(0); const [arReceived,setArReceived]=useState(0);
  const [arCrumbly,setArCrumbly]=useState(0); const [arMaxHP,setArMaxHP]=useState(0);
  const [arIsCrit,setArIsCrit]=useState(false); const [arOnAlly,setArOnAlly]=useState(false);
  const armorVal=armor({base:arBase,crit:arIsCrit,onAlly:arOnAlly,armorGiven:arGiven,armorReceived:arReceived});
  const armorCrumb=armorVal*(1-arCrumbly/100); const armorCap=arMaxHP>0?arMaxHP*0.5:null;

  // ── Build compare ──
  const [baElem,setBaElem]=useState(3000); const [baRange,setBaRange]=useState(0); const [baCrit,setBaCrit]=useState(0);
  const [baDI,setBaDI]=useState(0); const [baCH,setBaCH]=useState(20); const [baCritDI,setBaCritDI]=useState(0);
  const [bbElem,setBbElem]=useState(2500); const [bbRange,setBbRange]=useState(0); const [bbCrit,setBbCrit]=useState(300);
  const [bbDI,setBbDI]=useState(20); const [bbCH,setBbCH]=useState(40); const [bbCritDI,setBbCritDI]=useState(0);
  const emA=effectiveMasteries(baElem+baRange,baCrit,baDI,baCritDI,baCH);
  const emB=effectiveMasteries(bbElem+bbRange,bbCrit,bbDI,bbCritDI,bbCH);

  // ── Tankiness ──
  const [taHP,setTaHP]=useState(30000); const [taRes,setTaRes]=useState(60); const [taBlock,setTaBlock]=useState(30); const [taExpert,setTaExpert]=useState(false);
  const [tbHP,setTbHP]=useState(40000); const [tbRes,setTbRes]=useState(50); const [tbBlock,setTbBlock]=useState(10); const [tbExpert,setTbExpert]=useState(false);
  const ehpA=effectiveHp(taHP,taRes,taBlock,taExpert); const ehpB=effectiveHp(tbHP,tbRes,tbBlock,tbExpert);

  // ── Resistance ──
  const [rFlat,setRFlat]=useState(200); const [rPerc,setRPerc]=useState(50);
  const resTable=[10,20,30,40,50,55,60,65,70,75,80,85,90];

  // ── FoW ──
  const [fowBase,setFowBase]=useState(2); const [fowCaster,setFowCaster]=useState(100); const [fowTarget,setFowTarget]=useState(0);
  const fow=forceOfWill(fowBase,fowCaster,fowTarget);
  const ff=fow.factor; const fowEff=fow.effective; const fowFloor=fow.guaranteed; const fowChance=fow.extraChance.toFixed(1);

  // ── Lock ──
  const [lkLA,setLkLA]=useState(200); const [lkLB,setLkLB]=useState(0); const [lkLC,setLkLC]=useState(0); const [lkLD,setLkLD]=useState(0);
  const [lkDodge,setLkDodge]=useState(100); const [lkOrient,setLkOrient]=useState(0);
  const lock=lockLoss([lkLA,lkLB,lkLC,lkLD],lkDodge,lkOrient);
  const L=lock.combined; const X=lock.x; const mpLoss=lock.mpLoss; const apLoss=lock.apLoss;

  // ── HP ──
  const [hpLevel,setHpLevel]=useState(230); const [hpFlat,setHpFlat]=useState(10000); const [hpPerc,setHpPerc]=useState(20);
  const [ehpHP,setEhpHP]=useState(30000); const [ehpRes,setEhpRes]=useState(60); const [ehpBlock,setEhpBlock]=useState(20); const [ehpExpert,setEhpExpert]=useState(false);
  const totalHP=totalHp(hpLevel,hpFlat,hpPerc);
  const ehpVal=effectiveHp(ehpHP,ehpRes,ehpBlock,ehpExpert);

  // ── EM ──
  const [emMast,setEmMast]=useState(3000); const [emCritMast,setEmCritMast]=useState(200); const [emDI,setEmDI]=useState(0);
  const [emCritDI,setEmCritDI]=useState(0); const [emCH,setEmCH]=useState(25); const [emStasis,setEmStasis]=useState(100);
  const emRes=effectiveMasteries(emMast,emCritMast,emDI,emCritDI,emCH,emStasis);
  const emNorm=emRes.em; const emCrit2=emRes.emcrit; const emAvg=emRes.avg;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      <PageSeo title={ct.pageTitle} description={ct.pageSubtitle} path="/combat-calc" />
      <PageHeader
        title={ct.pageTitle}
        subtitle={<>{ct.pageSubtitle}<span className="block mt-1 text-xs italic text-subtle">{ct.credit}</span></>}
      />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap mb-5" role="tablist">
        {COMBAT_TAB_IDS.map(id => {
          const Icon = TAB_ICONS[id];
          return (
            <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={`chip shrink-0 h-9 ${tab === id ? 'chip-active' : ''}`}
            >
              <Icon className={`w-4 h-4 ${tab === id ? 'text-primary' : ''}`} /> {ct.tabs[id]}
            </button>
          );
        })}
      </div>

      <div>

        {/* ══ DAMAGE ══ */}
        {tab==='damage' && (
          <div className="card p-5 md:p-6 space-y-4">
            <h2 className="section-title pb-3 border-b border-line">{ct.damageTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.spellBaseValue} value={dBase} onChange={setDBase} min={0} tip={ct.tipSpellBase} />
              <Num label={ct.elementalMastery} value={dElem} onChange={setDElem} />
              <Num label={ct.meleeDistanceMastery} value={dRange} onChange={setDRange} tip={ct.tipMeleeDistance} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.berserkMastery} value={dBerserk} onChange={setDBerserk} tip={ct.tipBerserk} />
              {dPos==='rear' && <Num label={ct.rearMastery} value={dRear} onChange={setDRear} tip={ct.tipRear} />}
              <Num label={ct.criticalMastery} value={dCrit} onChange={setDCrit} tip={ct.tipCritMastery} />
            </div>
            <SecLabel>{ct.bonusesConditions}</SecLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.dmgInflictedPct} value={dDI} onChange={setDDI} />
              <Num label={ct.enemyResistance} value={dRes} onChange={setDRes} min={0} max={90} tip={ct.tipEnemyResistance} />
              <Num label={ct.fixedDamageBonus} value={dFixed} onChange={setDFixed} tip={ct.tipFixedDamage} />
            </div>
            <SecLabel>{ct.positionVsTarget}</SecLabel>
            <RadioPos pos={dPos} setPos={setDPos} t={ct} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Sel label={ct.block} value={dBlock} onChange={setDBlock} options={[{label:ct.blockNotBlocked,value:1},{label:ct.blockBlocked,value:0.8},{label:ct.blockExpert,value:0.68}]} />
              <Num label={ct.barrier} value={dBarrier} onChange={setDBarrier} min={0} tip={ct.tipBarrier} />
            </div>
            <div className="flex gap-4 flex-wrap pt-1">
              <Check label={ct.criticalHit} checked={dIsCrit} onChange={setDIsCrit} />
              <Check label={ct.casterBelowHalfHp} checked={dIsBerserk} onChange={setDIsBerserk} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 lg:sticky lg:bottom-0 lg:z-10 lg:bg-surface lg:-mx-6 lg:px-6 lg:pb-5 lg:pt-4 lg:border-t lg:border-line lg:rounded-b-2xl">
              <ResBox main label={ct.finalDamage} value={fmt(dIsCrit?critDmg:normalDmg)} />
              <ResBox label={ct.normalHit} value={fmt(normalDmg)} />
              <ResBox label={ct.criticalHit} value={fmt(critDmg)} />
              <ResBox label={ct.sumOfMasteries} value={fmt(dIsCrit?mastCrit:mastNorm)} />
            </div>
          </div>
        )}

        {/* ══ HEAL ══ */}
        {tab==='heal' && (
          <div className="card p-5 md:p-6 space-y-4">
            <h2 className="section-title pb-3 border-b border-line">{ct.healTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.spellBaseValue} value={hBase} onChange={setHBase} min={0} />
              <Num label={ct.elementalMastery} value={hElem} onChange={setHElem} />
              <Num label={ct.meleeDistanceMastery} value={hRange} onChange={setHRange} tip={ct.tipMeleeDistance} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.healingMastery} value={hHeal} onChange={setHHeal} tip={ct.tipHealingMastery} />
              <Num label={ct.berserkMastery} value={hBerserk} onChange={setHBerserk} />
              <Num label={ct.criticalMastery} value={hCrit} onChange={setHCrit} />
            </div>
            <SecLabel>{ct.healBonusesResistances}</SecLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.healsPerformed} value={hHP} onChange={setHHP} tip={ct.tipHealsPerformed} />
              <Num label={ct.healsReceived} value={hHR} onChange={setHHR} tip={ct.tipHealsReceived} />
              <Num label={ct.healResistance} value={hHealRes} onChange={setHHealRes} min={0} tip={ct.tipHealResistance} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Num label={ct.incurable} value={hIncur} onChange={setHIncur} min={0} max={100} tip={ct.tipIncurable} />
            </div>
            <div className="flex gap-4 flex-wrap pt-1">
              <Check label={ct.criticalHit} checked={hIsCrit} onChange={setHIsCrit} />
              <Check label={ct.casterBelowHalfHp} checked={hIsBerserk} onChange={setHIsBerserk} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 lg:sticky lg:bottom-0 lg:z-10 lg:bg-surface lg:-mx-6 lg:px-6 lg:pb-5 lg:pt-4 lg:border-t lg:border-line lg:rounded-b-2xl">
              <ResBox main label={ct.finalHeal} value={fmt(hIsCrit?critHeal:normalHeal)} />
              <ResBox label={ct.normalHeal} value={fmt(normalHeal)} />
              <ResBox label={ct.criticalHeal} value={fmt(critHeal)} />
              <ResBox label={ct.sumOfMasteries} value={fmt(hIsCrit?hMastCrit:hMastNorm)} />
            </div>
          </div>
        )}

        {/* ══ ARMOR ══ */}
        {tab==='armor' && (
          <div className="card p-5 md:p-6 space-y-4">
            <h2 className="section-title pb-3 border-b border-line">{ct.armorTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.spellBaseValue} value={arBase} onChange={setArBase} min={0} />
              <Num label={ct.armorGiven} value={arGiven} onChange={setArGiven} tip={ct.tipArmorGiven} />
              <Num label={ct.armorReceived} value={arReceived} onChange={setArReceived} tip={ct.tipArmorReceived} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Num label={ct.crumbly} value={arCrumbly} onChange={setArCrumbly} min={0} max={100} tip={ct.tipCrumbly} />
              <Num label={ct.targetMaxHp} value={arMaxHP} onChange={setArMaxHP} min={0} placeholder={ct.skipCapPlaceholder} tip={ct.tipTargetMaxHp} />
            </div>
            <div className="flex gap-4 flex-wrap pt-1">
              <Check label={ct.critX125} checked={arIsCrit} onChange={setArIsCrit} />
              <Check label={ct.castingOnAlly} checked={arOnAlly} onChange={setArOnAlly} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 lg:sticky lg:bottom-0 lg:z-10 lg:bg-surface lg:-mx-6 lg:px-6 lg:pb-5 lg:pt-4 lg:border-t lg:border-line lg:rounded-b-2xl">
              <ResBox main label={ct.armorGenerated} value={fmt(armorVal)} />
              <ResBox label={ct.afterCrumbly} value={fmt(armorCrumb)} />
              <ResBox label={ct.hpCap} value={armorCap!==null?fmt(armorCap):'N/A'} />
            </div>
          </div>
        )}

        {/* ══ BUILD ══ */}
        {tab==='build' && (
          <div className="card p-5 md:p-6 space-y-4">
            <h2 className="section-title pb-3 border-b border-line">{ct.buildTitle}</h2>
            <p className="text-sm text-muted">{ct.buildNote}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SecLabel><span className="text-primary">{ct.buildA}</span></SecLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Num label={ct.elementalMastery} value={baElem} onChange={setBaElem} />
                  <Num label={ct.meleeDistShort} value={baRange} onChange={setBaRange} />
                  <Num label={ct.criticalMastery} value={baCrit} onChange={setBaCrit} />
                  <Num label={ct.dmgInflictedPct} value={baDI} onChange={setBaDI} />
                  <Num label={ct.critHitChancePct} value={baCH} onChange={setBaCH} min={0} max={100} />
                  <Num label={ct.critDiBonus} value={baCritDI} onChange={setBaCritDI} />
                </div>
              </div>
              <div>
                <SecLabel><span className="text-accent">{ct.buildB}</span></SecLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Num label={ct.elementalMastery} value={bbElem} onChange={setBbElem} />
                  <Num label={ct.meleeDistShort} value={bbRange} onChange={setBbRange} />
                  <Num label={ct.criticalMastery} value={bbCrit} onChange={setBbCrit} />
                  <Num label={ct.dmgInflictedPct} value={bbDI} onChange={setBbDI} />
                  <Num label={ct.critHitChancePct} value={bbCH} onChange={setBbCH} min={0} max={100} />
                  <Num label={ct.critDiBonus} value={bbCritDI} onChange={setBbCritDI} />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-line overflow-hidden mt-2">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-line bg-bg2">{[ct.metric,ct.buildA,ct.buildB].map(h=><th key={h} className="text-left px-4 py-2.5 caps-label">{h}</th>)}</tr></thead>
                <tbody>
                  {[[ct.emNormal,fmtD(emA.em),fmtD(emB.em)],[ct.emCrit,fmtD(emA.emcrit),fmtD(emB.emcrit)],[ct.emAverage,fmtD(emA.avg),fmtD(emB.avg)]].map(([l,a,b])=>{
                    const w=winCls(parseFloat(a),parseFloat(b));
                    return <tr key={l} className="border-b border-line last:border-0"><td className="px-4 py-2 text-muted">{l}</td><td className={`px-4 py-2 ${w.a}`}>{a}</td><td className={`px-4 py-2 ${w.b}`}>{b}</td></tr>;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ TANK ══ */}
        {tab==='tank' && (
          <div className="card p-5 md:p-6 space-y-4">
            <h2 className="section-title pb-3 border-b border-line">{ct.tankTitle}</h2>
            <p className="text-sm text-muted">{ct.tankNote}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SecLabel><span className="text-primary">{ct.buildA}</span></SecLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Num label={ct.totalHp} value={taHP} onChange={setTaHP} />
                  <Num label={ct.resistancePct} value={taRes} onChange={setTaRes} min={0} max={90} tip={ct.tipUseResTab} />
                  <Num label={ct.blockChancePct} value={taBlock} onChange={setTaBlock} min={0} max={100} />
                </div>
                <div className="mt-2"><Check label={ct.blockingExpert} checked={taExpert} onChange={setTaExpert} /></div>
              </div>
              <div>
                <SecLabel><span className="text-accent">{ct.buildB}</span></SecLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Num label={ct.totalHp} value={tbHP} onChange={setTbHP} />
                  <Num label={ct.resistancePct} value={tbRes} onChange={setTbRes} min={0} max={90} />
                  <Num label={ct.blockChancePct} value={tbBlock} onChange={setTbBlock} min={0} max={100} />
                </div>
                <div className="mt-2"><Check label={ct.blockingExpert} checked={tbExpert} onChange={setTbExpert} /></div>
              </div>
            </div>
            <div className="rounded-xl border border-line overflow-hidden mt-2">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-line bg-bg2">{[ct.metric,ct.buildA,ct.buildB].map(h=><th key={h} className="text-left px-4 py-2.5 caps-label">{h}</th>)}</tr></thead>
                <tbody>
                  {[[ct.totalHp,fmt(taHP),fmt(tbHP)],[ct.resistancePct,`${taRes}%`,`${tbRes}%`],[ct.blockPct,`${taBlock}%`,`${tbBlock}%`],[ct.blockingExpert,taExpert?ct.yes:ct.no,tbExpert?ct.yes:ct.no]].map(([l,a,b])=>(
                    <tr key={l} className="border-b border-line"><td className="px-4 py-2 text-muted">{l}</td><td className="px-4 py-2 text-muted">{a}</td><td className={'px-4 py-2 text-muted'}>{b}</td></tr>
                  ))}
                  <tr>{(()=>{const w=winCls(ehpA,ehpB);return(<><td className="px-4 py-2 text-muted">{ct.ehpStar}</td><td className={`px-4 py-2 ${w.a}`}>{fmt(ehpA)}</td><td className={`px-4 py-2 ${w.b}`}>{fmt(ehpB)}</td></>);})()}</tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ RESISTANCE ══ */}
        {tab==='resistance' && (
          <div className="card p-5 md:p-6 space-y-4">
            <h2 className="section-title pb-3 border-b border-line">{ct.resTitle}</h2>
            <SecLabel>{ct.flatToPct}</SecLabel>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex-1 min-w-[140px]"><Num label={ct.flatResistance} value={rFlat} onChange={setRFlat} /></div>
              <span className="text-xl text-subtle pb-3">→</span>
              <ResBox main label={ct.resistancePct} value={fmtD(flatToPercent(rFlat),1)+'%'} />
            </div>
            <SecLabel>{ct.pctToFlat}</SecLabel>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex-1 min-w-[140px]"><Num label={ct.resRange} value={rPerc} onChange={setRPerc} min={0} max={90} /></div>
              <span className="text-xl text-subtle pb-3">→</span>
              <ResBox main label={ct.flatResistance} value={fmt(percentToFlat(rPerc))} />
            </div>
            <SecLabel>{ct.referenceTable}</SecLabel>
            <div className="rounded-xl border border-line overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-line bg-bg2"><th className="text-left px-4 py-2.5 caps-label">{ct.resistancePct}</th><th className="text-left px-4 py-2.5 caps-label">{ct.flatNeeded}</th></tr></thead>
                <tbody>{resTable.map(p=><tr key={p} className="border-b border-line last:border-0"><td className="px-4 py-2 text-muted">{p}%</td><td className="px-4 py-2 text-muted">{fmt(percentToFlat(p))}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ FOW ══ */}
        {tab==='fow' && (
          <div className="card p-5 md:p-6 space-y-4">
            <h2 className="section-title pb-3 border-b border-line">{ct.fowTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.baseRemovalValue} value={fowBase} onChange={setFowBase} min={0} tip={ct.tipBaseRemoval} />
              <Num label={ct.casterFow} value={fowCaster} onChange={setFowCaster} tip={ct.tipCasterFow} />
              <Num label={ct.targetFow} value={fowTarget} onChange={setFowTarget} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 lg:sticky lg:bottom-0 lg:z-10 lg:bg-surface lg:-mx-6 lg:px-6 lg:pb-5 lg:pt-4 lg:border-t lg:border-line lg:rounded-b-2xl">
              <ResBox label={ct.fowFactor} value={fmtD(ff,3)} />
              <ResBox main label={ct.effectiveRemoval} value={fmtD(fowEff,3)} />
              <ResBox label={ct.guaranteedRemove} value={String(fowFloor)} />
              <ResBox label={ct.chanceRemovePlusOne} value={fowChance+'%'} />
            </div>
          </div>
        )}

        {/* ══ LOCK ══ */}
        {tab==='lock' && (
          <div className="card p-5 md:p-6 space-y-4">
            <h2 className="section-title pb-3 border-b border-line">{ct.lockTitle}</h2>
            <p className="text-sm text-muted">{ct.lockNote}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.lockerALock} value={lkLA} onChange={setLkLA} min={0} tip={ct.tipLockerA} />
              <Num label={ct.lockerBLock} value={lkLB} onChange={setLkLB} min={0} tip={ct.tipLockerB} />
              <Num label={ct.lockerCLock} value={lkLC} onChange={setLkLC} min={0} tip={ct.tipLockerC} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.lockerDLock} value={lkLD} onChange={setLkLD} min={0} tip={ct.tipLockerD} />
              <Num label={ct.targetDodge} value={lkDodge} onChange={setLkDodge} min={0} />
              <Sel label={ct.lockerOrientation} value={lkOrient} onChange={setLkOrient} options={[{label:ct.orientFacing,value:0},{label:ct.orientSide,value:1},{label:ct.orientBack,value:2}]} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 lg:sticky lg:bottom-0 lg:z-10 lg:bg-surface lg:-mx-6 lg:px-6 lg:pb-5 lg:pt-4 lg:border-t lg:border-line lg:rounded-b-2xl">
              <ResBox label={ct.combinedLock} value={fmtD(L,1)} />
              <ResBox label={ct.xValue} value={fmtD(X,3)} />
              <ResBox main label={ct.mpLoss} value={String(mpLoss)} />
              <ResBox label={ct.apLoss} value={String(apLoss)} />
            </div>
          </div>
        )}

        {/* ══ HP/EHP ══ */}
        {tab==='hp' && (
          <div className="card p-5 md:p-6 space-y-4">
            <h2 className="section-title pb-3 border-b border-line">{ct.hpTitle}</h2>
            <SecLabel>{ct.totalHpFromStats}</SecLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.characterLevel} value={hpLevel} onChange={setHpLevel} min={1} />
              <Num label={ct.flatHpBonus} value={hpFlat} onChange={setHpFlat} />
              <Num label={ct.pctHpBonus} value={hpPerc} onChange={setHpPerc} />
            </div>
            <ResBox main label={ct.totalHp} value={fmt(totalHP)} />
            <SecLabel>{ct.effectiveHp}</SecLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.totalHp} value={ehpHP} onChange={setEhpHP} />
              <Num label={ct.resRange} value={ehpRes} onChange={setEhpRes} min={0} max={90} />
              <Num label={ct.blockChancePct} value={ehpBlock} onChange={setEhpBlock} min={0} max={100} />
            </div>
            <Check label={ct.blockingExpert} checked={ehpExpert} onChange={setEhpExpert} />
            <ResBox main label={ct.effectiveHp} value={fmt(ehpVal)} />
          </div>
        )}

        {/* ══ EM ══ */}
        {tab==='em' && (
          <div className="card p-5 md:p-6 space-y-4">
            <h2 className="section-title pb-3 border-b border-line">{ct.emTitle}</h2>
            <p className="text-sm text-muted">{ct.emNote}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.sumRelevantMasteries} value={emMast} onChange={setEmMast} tip={ct.tipSumMasteries} />
              <Num label={ct.criticalMastery} value={emCritMast} onChange={setEmCritMast} />
              <Num label={ct.dmgInflictedNonCrit} value={emDI} onChange={setEmDI} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.critDmgInflicted} value={emCritDI} onChange={setEmCritDI} tip={ct.tipCritDmgInflicted} />
              <Num label={ct.critHitChancePct} value={emCH} onChange={setEmCH} min={0} max={100} />
              <Num label={ct.stasisDmgBonus} value={emStasis} onChange={setEmStasis} min={100} tip={ct.tipStasis} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 lg:sticky lg:bottom-0 lg:z-10 lg:bg-surface lg:-mx-6 lg:px-6 lg:pb-5 lg:pt-4 lg:border-t lg:border-line lg:rounded-b-2xl">
              <ResBox label={ct.emNormal} value={fmtD(emNorm)} />
              <ResBox label={ct.emCrit} value={fmtD(emCrit2)} />
              <ResBox main label={ct.emAverage} value={fmtD(emAvg)} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
