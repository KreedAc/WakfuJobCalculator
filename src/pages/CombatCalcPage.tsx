import { useState } from 'react';
import type { Language } from '../constants/translations';
import { PageSeo } from '../components/PageSeo';
import {
  COMBAT_CALC_T,
  COMBAT_TAB_ICONS,
  COMBAT_TAB_IDS,
  type CombatCalcT,
  type CombatTabId,
} from '../constants/combatCalcTranslations';

// ─── Types ───────────────────────────────────────────────────────────────────
type Position = 'facing' | 'side' | 'rear';

// ─── Small reusable UI ───────────────────────────────────────────────────────
function Num({ label, value, onChange, min, max, placeholder, tip }: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; placeholder?: string; tip?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-emerald-400 uppercase tracking-wide flex items-center gap-1">
        {label}
        {tip && (
          <span className="group relative cursor-help inline-flex">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-400/70 text-[10px] font-bold flex items-center justify-center">?</span>
            <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-52 bg-slate-900/95 border border-emerald-500/25 rounded-lg p-2 text-[11px] text-emerald-200/80 leading-snug z-50 pointer-events-none normal-case tracking-normal font-normal shadow-xl whitespace-normal">
              {tip}
            </span>
          </span>
        )}
      </label>
      <input
        type="number"
        value={value || ''}
        min={min}
        max={max}
        placeholder={placeholder ?? '0'}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="glass-soft px-3 py-2 rounded-xl text-emerald-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 w-full"
      />
    </div>
  );
}

function Sel({ label, value, onChange, options }: {
  label: string; value: number; onChange: (v: number) => void;
  options: { label: string; value: number }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-emerald-400 uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="glass-soft px-3 py-2 rounded-xl text-emerald-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 w-full appearance-none bg-transparent"
      >
        {options.map(o => <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>)}
      </select>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-emerald-200/75 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="accent-emerald-400 w-4 h-4" />
      {label}
    </label>
  );
}

function ResBox({ label, value, color = 'text-emerald-300', border = 'border-emerald-500/50' }: {
  label: string; value: string; color?: string; border?: string;
}) {
  return (
    <div className={`glass-soft rounded-2xl p-4 border-l-[3px] ${border}`}>
      <div className="text-[11px] font-medium text-emerald-400/60 uppercase tracking-widest mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function SecLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 my-4">
      <span className="text-[11px] font-semibold text-emerald-500/55 uppercase tracking-widest whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-emerald-500/15" />
    </div>
  );
}

function RadioPos({ pos, setPos, t }: { pos: Position; setPos: (p: Position) => void; t: CombatCalcT }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {([['facing','🧍',t.posFacing],['side','↔️',t.posSide],['rear','🔄',t.posRear]] as const).map(([v,icon,label]) => (
        <button key={v} onClick={() => setPos(v)}
          className={`flex items-center gap-2 flex-1 min-w-[100px] px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200
            ${pos === v ? 'glass-soft border-emerald-500/55 text-emerald-300 shadow-sm shadow-emerald-500/15' : 'border-emerald-500/16 text-emerald-200/65 hover:border-emerald-500/30 hover:text-emerald-200'}`}
        >
          <span>{icon}</span><span>{label}</span>
        </button>
      ))}
    </div>
  );
}

function fmt(n: number) { return isFinite(n) ? Math.round(n).toLocaleString() : '—'; }
function fmtD(n: number, d = 1) { return isFinite(n) ? n.toFixed(d) : '—'; }
function winCls(a: number, b: number) {
  return { a: a > b ? 'text-emerald-400 font-bold' : 'text-emerald-200/40', b: b > a ? 'text-emerald-400 font-bold' : 'text-emerald-200/40' };
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
  const posMult = dPos==='rear'?1.25:dPos==='side'?1.10:1.00;
  const mastNorm = dElem+dRange+(dIsBerserk?dBerserk:0)+(dPos==='rear'?dRear:0);
  const mastCrit = mastNorm+dCrit;
  const calcDmg=(b:number,m:number)=>Math.max(0,Math.round(((b*(1+m/100)*posMult*(1+dDI/100)*(1-Math.min(dRes,90)/100))+dFixed-dBarrier)*dBlock));
  const normalDmg=calcDmg(dBase,mastNorm); const critDmg=calcDmg(dBase*1.25,mastCrit);

  // ── Heal ──
  const [hBase,setHBase]=useState(100); const [hElem,setHElem]=useState(0); const [hRange,setHRange]=useState(0);
  const [hHeal,setHHeal]=useState(0); const [hBerserk,setHBerserk]=useState(0); const [hCrit,setHCrit]=useState(0);
  const [hHP,setHHP]=useState(0); const [hHR,setHHR]=useState(0); const [hHealRes,setHHealRes]=useState(0); const [hIncur,setHIncur]=useState(0);
  const [hIsCrit,setHIsCrit]=useState(false); const [hIsBerserk,setHIsBerserk]=useState(false);
  const hMastNorm=hElem+hRange+hHeal+(hIsBerserk?hBerserk:0); const hMastCrit=hMastNorm+hCrit;
  const calcHeal=(b:number,m:number)=>Math.max(0,Math.round(b*(1+m/100)*(1+(hHP+hHR)/100)*(1-hHealRes/100)*(1-hIncur/100)));
  const normalHeal=calcHeal(hBase,hMastNorm); const critHeal=calcHeal(hBase*1.25,hMastCrit);

  // ── Armor ──
  const [arBase,setArBase]=useState(100); const [arGiven,setArGiven]=useState(0); const [arReceived,setArReceived]=useState(0);
  const [arCrumbly,setArCrumbly]=useState(0); const [arMaxHP,setArMaxHP]=useState(0);
  const [arIsCrit,setArIsCrit]=useState(false); const [arOnAlly,setArOnAlly]=useState(false);
  const armorVal=arBase*(arIsCrit?1.25:1)*(1+((arOnAlly?arGiven:0)+arReceived)/100);
  const armorCrumb=armorVal*(1-arCrumbly/100); const armorCap=arMaxHP>0?arMaxHP*0.5:null;

  // ── Build compare ──
  const [baElem,setBaElem]=useState(3000); const [baRange,setBaRange]=useState(0); const [baCrit,setBaCrit]=useState(0);
  const [baDI,setBaDI]=useState(0); const [baCH,setBaCH]=useState(20); const [baCritDI,setBaCritDI]=useState(0);
  const [bbElem,setBbElem]=useState(2500); const [bbRange,setBbRange]=useState(0); const [bbCrit,setBbCrit]=useState(300);
  const [bbDI,setBbDI]=useState(20); const [bbCH,setBbCH]=useState(40); const [bbCritDI,setBbCritDI]=useState(0);
  const emCalc=(mast:number,critM:number,di:number,cdi:number,ch:number)=>{
    const em=((mast+100)*(di+100)/10000)-100;
    const emcrit=(((mast+critM+100)*(di+cdi+100)/10000)*1.25)-100;
    return{em,emcrit,avg:em+(emcrit-em)*(ch/100)};
  };
  const emA=emCalc(baElem+baRange,baCrit,baDI,baCritDI,baCH);
  const emB=emCalc(bbElem+bbRange,bbCrit,bbDI,bbCritDI,bbCH);

  // ── Tankiness ──
  const [taHP,setTaHP]=useState(30000); const [taRes,setTaRes]=useState(60); const [taBlock,setTaBlock]=useState(30); const [taExpert,setTaExpert]=useState(false);
  const [tbHP,setTbHP]=useState(40000); const [tbRes,setTbRes]=useState(50); const [tbBlock,setTbBlock]=useState(10); const [tbExpert,setTbExpert]=useState(false);
  const ehpCalc=(hp:number,res:number,block:number,expert:boolean)=>{
    const bc=expert?0.68:0.8; const d=(100-Math.min(res,90))*(100-(1-bc)*Math.min(block,100));
    return d<=0?Infinity:(hp*10000)/d;
  };
  const ehpA=ehpCalc(taHP,taRes,taBlock,taExpert); const ehpB=ehpCalc(tbHP,tbRes,tbBlock,tbExpert);

  // ── Resistance ──
  const [rFlat,setRFlat]=useState(200); const [rPerc,setRPerc]=useState(50);
  const flatToPerc=(f:number)=>Math.min(Math.floor((1-Math.pow(0.8,f/100))*1000)/10,90);
  const percToFlat=(p:number)=>{if(p<=0)return 0;if(p>=90)return Math.ceil(100*Math.log(0.1)/Math.log(0.8));return Math.ceil(100*Math.log(1-p/100)/Math.log(0.8));};
  const resTable=[10,20,30,40,50,55,60,65,70,75,80,85,90];

  // ── FoW ──
  const [fowBase,setFowBase]=useState(2); const [fowCaster,setFowCaster]=useState(100); const [fowTarget,setFowTarget]=useState(0);
  const ff=Math.max(0,Math.min(2,(1+fowCaster/100)-(fowTarget/100)));
  const fowEff=fowBase*0.5*ff; const fowFloor=Math.floor(fowEff); const fowChance=((fowEff-fowFloor)*100).toFixed(1);

  // ── Lock ──
  const [lkLA,setLkLA]=useState(200); const [lkLB,setLkLB]=useState(0); const [lkLC,setLkLC]=useState(0); const [lkLD,setLkLD]=useState(0);
  const [lkDodge,setLkDodge]=useState(100); const [lkOrient,setLkOrient]=useState(0);
  const locks=[lkLA,lkLB,lkLC,lkLD].sort((a,b)=>b-a);
  const L=locks[0]+locks[1]/2+locks[2]/3+locks[3]/4;
  const Lc=Math.max(0,L),Dc=Math.max(0,lkDodge);
  const X=Lc+Dc===0?0:(7/3)*(Lc-Dc)/(Lc+Dc);
  const Y=Math.floor((X+1)*4-lkOrient);
  const mpLoss=Math.max(0,Math.min(4,Math.ceil(Y/2))); const apLoss=Math.max(0,Math.min(4,Math.floor(Y/2)));

  // ── HP ──
  const [hpLevel,setHpLevel]=useState(230); const [hpFlat,setHpFlat]=useState(10000); const [hpPerc,setHpPerc]=useState(20);
  const [ehpHP,setEhpHP]=useState(30000); const [ehpRes,setEhpRes]=useState(60); const [ehpBlock,setEhpBlock]=useState(20); const [ehpExpert,setEhpExpert]=useState(false);
  const totalHP=(50+hpLevel*10+hpFlat)*(1+hpPerc/100);
  const ehpVal=ehpCalc(ehpHP,ehpRes,ehpBlock,ehpExpert);

  // ── EM ──
  const [emMast,setEmMast]=useState(3000); const [emCritMast,setEmCritMast]=useState(200); const [emDI,setEmDI]=useState(0);
  const [emCritDI,setEmCritDI]=useState(0); const [emCH,setEmCH]=useState(25); const [emStasis,setEmStasis]=useState(100);
  const s=emStasis/100;
  const emNorm=((emMast+100)*(emDI+100)*s/10000)-100;
  const emCrit2=(((emMast+emCritMast+100)*(emDI+emCritDI+100)*s/10000)*1.25)-100;
  const emAvg=emNorm+(emCrit2-emNorm)*(emCH/100);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl w-full flex flex-col items-center animate-in fade-in duration-500">
      <PageSeo title={ct.pageTitle} description={ct.pageSubtitle} path="/combat-calc" />
      <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-3 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-200">
        {ct.pageTitle}
      </h1>
      <p className="text-emerald-100/80 mb-8 text-center max-w-2xl text-base leading-relaxed drop-shadow-md">
        {ct.pageSubtitle}
      </p>

      {/* Tabs */}
      <div className="glass rounded-2xl p-3 mb-5 flex flex-wrap gap-1.5 w-full">
        {COMBAT_TAB_IDS.map(id => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap
              ${tab===id ? 'glass-soft border border-emerald-500/55 text-emerald-300 shadow-sm shadow-emerald-500/10' : 'text-emerald-200/60 hover:text-emerald-200 border border-transparent hover:border-emerald-500/20'}`}
          >{COMBAT_TAB_ICONS[id]} {ct.tabs[id]}</button>
        ))}
      </div>

      <div className="w-full">

        {/* ══ DAMAGE ══ */}
        {tab==='damage' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">⚔️ {ct.damageTitle}</h2>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              <ResBox label={ct.finalDamage} value={fmt(dIsCrit?critDmg:normalDmg)} />
              <ResBox label={ct.normalHit} value={fmt(normalDmg)} color="text-blue-300" border="border-blue-400/50" />
              <ResBox label={ct.criticalHit} value={fmt(critDmg)} color="text-yellow-300" border="border-yellow-400/50" />
              <ResBox label={ct.sumOfMasteries} value={fmt(dIsCrit?mastCrit:mastNorm)} color="text-emerald-100/80" border="border-emerald-500/30" />
            </div>
          </div>
        )}

        {/* ══ HEAL ══ */}
        {tab==='heal' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">❤️ {ct.healTitle}</h2>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              <ResBox label={ct.finalHeal} value={fmt(hIsCrit?critHeal:normalHeal)} color="text-red-300" border="border-red-400/50" />
              <ResBox label={ct.normalHeal} value={fmt(normalHeal)} color="text-red-300" border="border-red-400/50" />
              <ResBox label={ct.criticalHeal} value={fmt(critHeal)} color="text-yellow-300" border="border-yellow-400/50" />
              <ResBox label={ct.sumOfMasteries} value={fmt(hIsCrit?hMastCrit:hMastNorm)} color="text-emerald-100/80" border="border-emerald-500/30" />
            </div>
          </div>
        )}

        {/* ══ ARMOR ══ */}
        {tab==='armor' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">💚 {ct.armorTitle}</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
              <ResBox label={ct.armorGenerated} value={fmt(armorVal)} color="text-green-300" border="border-green-400/50" />
              <ResBox label={ct.afterCrumbly} value={fmt(armorCrumb)} color="text-green-300" border="border-green-400/50" />
              <ResBox label={ct.hpCap} value={armorCap!==null?fmt(armorCap):'N/A'} color="text-emerald-100/80" border="border-emerald-500/30" />
            </div>
          </div>
        )}

        {/* ══ BUILD ══ */}
        {tab==='build' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">⚖️ {ct.buildTitle}</h2>
            <p className="text-sm text-emerald-100/60">{ct.buildNote}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SecLabel><span className="text-blue-400/70">{ct.buildA}</span></SecLabel>
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
                <SecLabel><span className="text-emerald-400/70">{ct.buildB}</span></SecLabel>
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
            <div className="glass-soft rounded-2xl overflow-hidden mt-2">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-emerald-500/15">{[ct.metric,ct.buildA,ct.buildB].map(h=><th key={h} className="text-left px-4 py-2 text-[11px] uppercase tracking-widest text-emerald-400/65 font-semibold">{h}</th>)}</tr></thead>
                <tbody>
                  {[[ct.emNormal,fmtD(emA.em),fmtD(emB.em)],[ct.emCrit,fmtD(emA.emcrit),fmtD(emB.emcrit)],[ct.emAverage,fmtD(emA.avg),fmtD(emB.avg)]].map(([l,a,b])=>{
                    const w=winCls(parseFloat(a),parseFloat(b));
                    return <tr key={l} className="border-b border-emerald-500/07 last:border-0"><td className="px-4 py-2 text-emerald-100/80">{l}</td><td className={`px-4 py-2 ${w.a}`}>{a}</td><td className={`px-4 py-2 ${w.b}`}>{b}</td></tr>;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ TANK ══ */}
        {tab==='tank' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">🛡️ {ct.tankTitle}</h2>
            <p className="text-sm text-emerald-100/60">{ct.tankNote}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SecLabel><span className="text-blue-400/70">{ct.buildA}</span></SecLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Num label={ct.totalHp} value={taHP} onChange={setTaHP} />
                  <Num label={ct.resistancePct} value={taRes} onChange={setTaRes} min={0} max={90} tip={ct.tipUseResTab} />
                  <Num label={ct.blockChancePct} value={taBlock} onChange={setTaBlock} min={0} max={100} />
                </div>
                <div className="mt-2"><Check label={ct.blockingExpert} checked={taExpert} onChange={setTaExpert} /></div>
              </div>
              <div>
                <SecLabel><span className="text-emerald-400/70">{ct.buildB}</span></SecLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Num label={ct.totalHp} value={tbHP} onChange={setTbHP} />
                  <Num label={ct.resistancePct} value={tbRes} onChange={setTbRes} min={0} max={90} />
                  <Num label={ct.blockChancePct} value={tbBlock} onChange={setTbBlock} min={0} max={100} />
                </div>
                <div className="mt-2"><Check label={ct.blockingExpert} checked={tbExpert} onChange={setTbExpert} /></div>
              </div>
            </div>
            <div className="glass-soft rounded-2xl overflow-hidden mt-2">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-emerald-500/15">{[ct.metric,ct.buildA,ct.buildB].map(h=><th key={h} className="text-left px-4 py-2 text-[11px] uppercase tracking-widest text-emerald-400/65 font-semibold">{h}</th>)}</tr></thead>
                <tbody>
                  {[[ct.totalHp,fmt(taHP),fmt(tbHP)],[ct.resistancePct,`${taRes}%`,`${tbRes}%`],[ct.blockPct,`${taBlock}%`,`${tbBlock}%`],[ct.blockingExpert,taExpert?ct.yes:ct.no,tbExpert?ct.yes:ct.no]].map(([l,a,b])=>(
                    <tr key={l} className="border-b border-emerald-500/07"><td className="px-4 py-2 text-emerald-100/80">{l}</td><td className="px-4 py-2 text-emerald-100/80">{a}</td><td className={'px-4 py-2 text-emerald-100/80'}>{b}</td></tr>
                  ))}
                  <tr>{(()=>{const w=winCls(ehpA,ehpB);return(<><td className="px-4 py-2 text-emerald-100/80">{ct.ehpStar}</td><td className={`px-4 py-2 ${w.a}`}>{fmt(ehpA)}</td><td className={`px-4 py-2 ${w.b}`}>{fmt(ehpB)}</td></>);})()}</tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ RESISTANCE ══ */}
        {tab==='resistance' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">📏 {ct.resTitle}</h2>
            <SecLabel>{ct.flatToPct}</SecLabel>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex-1 min-w-[140px]"><Num label={ct.flatResistance} value={rFlat} onChange={setRFlat} /></div>
              <span className="text-xl text-emerald-400/55 pb-2">→</span>
              <ResBox label={ct.resistancePct} value={fmtD(flatToPerc(rFlat),1)+'%'} />
            </div>
            <SecLabel>{ct.pctToFlat}</SecLabel>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex-1 min-w-[140px]"><Num label={ct.resRange} value={rPerc} onChange={setRPerc} min={0} max={90} /></div>
              <span className="text-xl text-emerald-400/55 pb-2">→</span>
              <ResBox label={ct.flatResistance} value={fmt(percToFlat(rPerc))} />
            </div>
            <SecLabel>{ct.referenceTable}</SecLabel>
            <div className="glass-soft rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-emerald-500/15"><th className="text-left px-4 py-2 text-[11px] uppercase tracking-widest text-emerald-400/65 font-semibold">{ct.resistancePct}</th><th className="text-left px-4 py-2 text-[11px] uppercase tracking-widest text-emerald-400/65 font-semibold">{ct.flatNeeded}</th></tr></thead>
                <tbody>{resTable.map(p=><tr key={p} className="border-b border-emerald-500/07 last:border-0"><td className="px-4 py-2 text-emerald-100/80">{p}%</td><td className="px-4 py-2 text-emerald-100/80">{fmt(percToFlat(p))}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ FOW ══ */}
        {tab==='fow' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">⚡ {ct.fowTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.baseRemovalValue} value={fowBase} onChange={setFowBase} min={0} tip={ct.tipBaseRemoval} />
              <Num label={ct.casterFow} value={fowCaster} onChange={setFowCaster} tip={ct.tipCasterFow} />
              <Num label={ct.targetFow} value={fowTarget} onChange={setFowTarget} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              <ResBox label={ct.fowFactor} value={fmtD(ff,3)} color="text-yellow-300" border="border-yellow-400/50" />
              <ResBox label={ct.effectiveRemoval} value={fmtD(fowEff,3)} color="text-yellow-300" border="border-yellow-400/50" />
              <ResBox label={ct.guaranteedRemove} value={String(fowFloor)} color="text-blue-300" border="border-blue-400/50" />
              <ResBox label={ct.chanceRemovePlusOne} value={fowChance+'%'} color="text-blue-300" border="border-blue-400/50" />
            </div>
          </div>
        )}

        {/* ══ LOCK ══ */}
        {tab==='lock' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">⛓️ {ct.lockTitle}</h2>
            <p className="text-sm text-emerald-100/60">{ct.lockNote}</p>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              <ResBox label={ct.combinedLock} value={fmtD(L,1)} color="text-purple-300" border="border-purple-400/50" />
              <ResBox label={ct.xValue} value={fmtD(X,3)} color="text-purple-300" border="border-purple-400/50" />
              <ResBox label={ct.mpLoss} value={String(mpLoss)} color="text-purple-300" border="border-purple-400/50" />
              <ResBox label={ct.apLoss} value={String(apLoss)} color="text-purple-300" border="border-purple-400/50" />
            </div>
          </div>
        )}

        {/* ══ HP/EHP ══ */}
        {tab==='hp' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">🩸 {ct.hpTitle}</h2>
            <SecLabel>{ct.totalHpFromStats}</SecLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.characterLevel} value={hpLevel} onChange={setHpLevel} min={1} />
              <Num label={ct.flatHpBonus} value={hpFlat} onChange={setHpFlat} />
              <Num label={ct.pctHpBonus} value={hpPerc} onChange={setHpPerc} />
            </div>
            <ResBox label={ct.totalHp} value={fmt(totalHP)} color="text-red-300" border="border-red-400/50" />
            <SecLabel>{ct.effectiveHp}</SecLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label={ct.totalHp} value={ehpHP} onChange={setEhpHP} />
              <Num label={ct.resRange} value={ehpRes} onChange={setEhpRes} min={0} max={90} />
              <Num label={ct.blockChancePct} value={ehpBlock} onChange={setEhpBlock} min={0} max={100} />
            </div>
            <Check label={ct.blockingExpert} checked={ehpExpert} onChange={setEhpExpert} />
            <ResBox label={ct.effectiveHp} value={fmt(ehpVal)} color="text-red-300" border="border-red-400/50" />
          </div>
        )}

        {/* ══ EM ══ */}
        {tab==='em' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">🗡️ {ct.emTitle}</h2>
            <p className="text-sm text-emerald-100/60">{ct.emNote}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
              <ResBox label={ct.emNormal} value={fmtD(emNorm)} />
              <ResBox label={ct.emCrit} value={fmtD(emCrit2)} color="text-yellow-300" border="border-yellow-400/50" />
              <ResBox label={ct.emAverage} value={fmtD(emAvg)} color="text-green-300" border="border-green-400/50" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
