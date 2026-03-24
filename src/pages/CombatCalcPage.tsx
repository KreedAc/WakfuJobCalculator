import { useState } from 'react';
import type { Language } from '../constants/translations';

// ─── Types ───────────────────────────────────────────────────────────────────
type Position = 'facing' | 'side' | 'rear';
const TABS = ['⚔️ Damage','❤️ Heal','💚 Armor','⚖️ Build','🛡️ Tank','📏 Resistance','⚡ FoW','⛓️ Lock','🩸 HP/EHP','🗡️ EM'] as const;
type Tab = typeof TABS[number];

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

const FacingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="4" r="2.2"/>
    <circle cx="8.2" cy="3.5" r="0.5" fill="currentColor" opacity="0.25"/>
    <circle cx="11.8" cy="3.5" r="0.5" fill="currentColor" opacity="0.25"/>
    <rect x="7.5" y="7" width="5" height="6" rx="1.2"/>
    <rect x="5" y="7.5" width="2" height="4.5" rx="1"/>
    <rect x="13" y="7.5" width="2" height="4.5" rx="1"/>
    <rect x="7.5" y="13.5" width="2" height="5" rx="1"/>
    <rect x="10.5" y="13.5" width="2" height="5" rx="1"/>
  </svg>
);

const SideIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="4" r="2.2"/>
    <circle cx="11.2" cy="3.4" r="0.55" fill="currentColor" opacity="0.25"/>
    <rect x="8.5" y="7" width="3" height="6" rx="1.2"/>
    <rect x="11.2" y="7.5" width="2" height="4" rx="1"/>
    <rect x="8.5" y="13.5" width="2" height="5" rx="1"/>
    <rect x="11" y="13.5" width="2" height="5" rx="1"/>
  </svg>
);

const RearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="4" r="2.2"/>
    <rect x="7.5" y="7" width="5" height="6" rx="1.2"/>
    <rect x="5" y="7.5" width="2" height="4.5" rx="1"/>
    <rect x="13" y="7.5" width="2" height="4.5" rx="1"/>
    <rect x="7.5" y="13.5" width="2" height="5" rx="1"/>
    <rect x="10.5" y="13.5" width="2" height="5" rx="1"/>
    <line x1="8" y1="8.5" x2="12" y2="8.5" stroke="currentColor" strokeWidth="0.8" opacity="0.35"/>
    <line x1="8" y1="10.5" x2="12" y2="10.5" stroke="currentColor" strokeWidth="0.8" opacity="0.35"/>
  </svg>
);

const POS_CONFIG: { value: Position; Icon: React.FC; label: string }[] = [
  { value: 'facing', Icon: FacingIcon, label: 'Facing' },
  { value: 'side',   Icon: SideIcon,   label: 'Side'   },
  { value: 'rear',   Icon: RearIcon,   label: 'Rear'   },
];

function RadioPos({ pos, setPos }: { pos: Position; setPos: (p: Position) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {POS_CONFIG.map(({ value: v, Icon, label }) => (
        <button key={v} onClick={() => setPos(v)}
          className={`flex items-center gap-2 flex-1 min-w-[100px] px-3 py-2.5 rounded-xl border border-transparent text-sm font-semibold transition-all duration-200
            ${pos === v ? 'glass-soft !border-emerald-500/55 text-emerald-300 shadow-sm shadow-emerald-500/15' : '!border-emerald-500/16 text-emerald-200/65 hover:!border-emerald-500/30 hover:text-emerald-200'}`}
        >
          <Icon /><span>{label}</span>
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
  const [tab, setTab] = useState<Tab>('⚔️ Damage');

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
      <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-3 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-200">
        {language === 'fr' ? 'Calculateur de Combat' : 'Combat Calculator'}
      </h1>
      <p className="text-emerald-100/80 mb-8 text-center max-w-2xl text-base leading-relaxed drop-shadow-md">
        {language === 'fr' ? 'Calculez vos dégâts, soins, armures, et bien plus.' : 'Calculate damage, heals, armor, resistances and more.'}
      </p>

      {/* Tabs */}
      <div className="glass rounded-2xl p-3 mb-5 flex flex-wrap gap-1.5 w-full">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap
              ${tab===t ? 'glass-soft border border-emerald-500/55 text-emerald-300 shadow-sm shadow-emerald-500/10' : 'text-emerald-200/60 hover:text-emerald-200 border border-transparent hover:border-emerald-500/20'}`}
          >{t}</button>
        ))}
      </div>

      <div className="w-full">

        {/* ══ DAMAGE ══ */}
        {tab==='⚔️ Damage' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">⚔️ Damage Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="Spell Base Value" value={dBase} onChange={setDBase} min={0} tip="Raw damage value from the spell description." />
              <Num label="Elemental Mastery" value={dElem} onChange={setDElem} />
              <Num label="Melee / Distance Mastery" value={dRange} onChange={setDRange} tip="Melee if 1–2 cells away. Distance if 3+ cells." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="Berserk Mastery (≤50% HP)" value={dBerserk} onChange={setDBerserk} tip="Only applies when caster is at 50% HP or less." />
              {dPos==='rear' && <Num label="Rear Mastery" value={dRear} onChange={setDRear} tip="Added to masteries only when attacking from Rear." />}
              <Num label="Critical Mastery" value={dCrit} onChange={setDCrit} tip="Added only on a critical hit." />
            </div>
            <SecLabel>Bonuses &amp; Conditions</SecLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="% Damage Inflicted" value={dDI} onChange={setDDI} />
              <Num label="Enemy % Resistance" value={dRes} onChange={setDRes} min={0} max={90} tip="Capped at 90% since update 1.68." />
              <Num label="Fixed Damage Bonus" value={dFixed} onChange={setDFixed} tip="Added after masteries, not affected by resistance." />
            </div>
            <SecLabel>Position vs Target</SecLabel>
            <RadioPos pos={dPos} setPos={setDPos} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Sel label="Block" value={dBlock} onChange={setDBlock} options={[{label:'Not blocked',value:1},{label:'Blocked (×0.80)',value:0.8},{label:'Blocked + Expert (×0.68)',value:0.68}]} />
              <Num label="Barrier" value={dBarrier} onChange={setDBarrier} min={0} tip="Flat value subtracted after fixed damage." />
            </div>
            <div className="flex gap-4 flex-wrap pt-1">
              <Check label="Critical Hit" checked={dIsCrit} onChange={setDIsCrit} />
              <Check label="Caster at ≤50% HP" checked={dIsBerserk} onChange={setDIsBerserk} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              <ResBox label="Final Damage" value={fmt(dIsCrit?critDmg:normalDmg)} />
              <ResBox label="Normal Hit" value={fmt(normalDmg)} color="text-blue-300" border="border-blue-400/50" />
              <ResBox label="Critical Hit" value={fmt(critDmg)} color="text-yellow-300" border="border-yellow-400/50" />
              <ResBox label="Sum of Masteries" value={fmt(dIsCrit?mastCrit:mastNorm)} color="text-emerald-100/80" border="border-emerald-500/30" />
            </div>
          </div>
        )}

        {/* ══ HEAL ══ */}
        {tab==='❤️ Heal' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">❤️ Heal Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="Spell Base Value" value={hBase} onChange={setHBase} min={0} />
              <Num label="Elemental Mastery" value={hElem} onChange={setHElem} />
              <Num label="Melee / Distance Mastery" value={hRange} onChange={setHRange} tip="Melee if 1–2 cells. Distance if 3+ cells." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="Healing Mastery" value={hHeal} onChange={setHHeal} tip="Always added to heal masteries." />
              <Num label="Berserk Mastery (≤50% HP)" value={hBerserk} onChange={setHBerserk} />
              <Num label="Critical Mastery" value={hCrit} onChange={setHCrit} />
            </div>
            <SecLabel>Heal Bonuses &amp; Resistances</SecLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="% Heals Performed (caster)" value={hHP} onChange={setHHP} tip="Conditional HP% (e.g. at distance) is added here." />
              <Num label="% Heals Received (target)" value={hHR} onChange={setHHR} tip="Works regardless of who cast the spell." />
              <Num label="Target Heal Resistance %" value={hHealRes} onChange={setHHealRes} min={0} tip="Increases each time the target is healed." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Num label="% Incurable" value={hIncur} onChange={setHIncur} min={0} max={100} tip="Reduces heals received by this % amount." />
            </div>
            <div className="flex gap-4 flex-wrap pt-1">
              <Check label="Critical Hit" checked={hIsCrit} onChange={setHIsCrit} />
              <Check label="Caster at ≤50% HP" checked={hIsBerserk} onChange={setHIsBerserk} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              <ResBox label="Final Heal" value={fmt(hIsCrit?critHeal:normalHeal)} color="text-red-300" border="border-red-400/50" />
              <ResBox label="Normal Heal" value={fmt(normalHeal)} color="text-red-300" border="border-red-400/50" />
              <ResBox label="Critical Heal" value={fmt(critHeal)} color="text-yellow-300" border="border-yellow-400/50" />
              <ResBox label="Sum of Masteries" value={fmt(hIsCrit?hMastCrit:hMastNorm)} color="text-emerald-100/80" border="border-emerald-500/30" />
            </div>
          </div>
        )}

        {/* ══ ARMOR ══ */}
        {tab==='💚 Armor' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">💚 Armor Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="Spell Base Value" value={arBase} onChange={setArBase} min={0} />
              <Num label="% Armor Given (on allies)" value={arGiven} onChange={setArGiven} tip="Only applies when casting on an ally." />
              <Num label="% Armor Received (target)" value={arReceived} onChange={setArReceived} tip="Works regardless of who cast the spell." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Num label="% Crumbly" value={arCrumbly} onChange={setArCrumbly} min={0} max={100} tip="Reduces armor generated by this %." />
              <Num label="Target Max HP (for 50% cap)" value={arMaxHP} onChange={setArMaxHP} min={0} placeholder="0 = skip cap" tip="Armor cannot exceed 50% of max HP." />
            </div>
            <div className="flex gap-4 flex-wrap pt-1">
              <Check label="Critical Hit (×1.25)" checked={arIsCrit} onChange={setArIsCrit} />
              <Check label="Casting on an ally" checked={arOnAlly} onChange={setArOnAlly} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
              <ResBox label="Armor Generated" value={fmt(armorVal)} color="text-green-300" border="border-green-400/50" />
              <ResBox label="After Crumbly" value={fmt(armorCrumb)} color="text-green-300" border="border-green-400/50" />
              <ResBox label="50% HP Cap" value={armorCap!==null?fmt(armorCap):'N/A'} color="text-emerald-100/80" border="border-emerald-500/30" />
            </div>
          </div>
        )}

        {/* ══ BUILD ══ */}
        {tab==='⚖️ Build' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">⚖️ Build Comparison — Effective Masteries</h2>
            <p className="text-sm text-emerald-100/60">Accounts for masteries, % Damage Inflicted and Crit Chance in a single metric.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SecLabel><span className="text-blue-400/70">Build A</span></SecLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Num label="Elemental Mastery" value={baElem} onChange={setBaElem} />
                  <Num label="Melee/Dist Mastery" value={baRange} onChange={setBaRange} />
                  <Num label="Critical Mastery" value={baCrit} onChange={setBaCrit} />
                  <Num label="% Dmg Inflicted" value={baDI} onChange={setBaDI} />
                  <Num label="% Crit Hit Chance" value={baCH} onChange={setBaCH} min={0} max={100} />
                  <Num label="% Crit DI bonus" value={baCritDI} onChange={setBaCritDI} />
                </div>
              </div>
              <div>
                <SecLabel><span className="text-emerald-400/70">Build B</span></SecLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Num label="Elemental Mastery" value={bbElem} onChange={setBbElem} />
                  <Num label="Melee/Dist Mastery" value={bbRange} onChange={setBbRange} />
                  <Num label="Critical Mastery" value={bbCrit} onChange={setBbCrit} />
                  <Num label="% Dmg Inflicted" value={bbDI} onChange={setBbDI} />
                  <Num label="% Crit Hit Chance" value={bbCH} onChange={setBbCH} min={0} max={100} />
                  <Num label="% Crit DI bonus" value={bbCritDI} onChange={setBbCritDI} />
                </div>
              </div>
            </div>
            <div className="glass-soft rounded-2xl overflow-hidden mt-2">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-emerald-500/15">{['Metric','Build A','Build B'].map(h=><th key={h} className="text-left px-4 py-2 text-[11px] uppercase tracking-widest text-emerald-400/65 font-semibold">{h}</th>)}</tr></thead>
                <tbody>
                  {[['EM (Normal)',fmtD(emA.em),fmtD(emB.em)],['EMcrit',fmtD(emA.emcrit),fmtD(emB.emcrit)],['EM Average ★',fmtD(emA.avg),fmtD(emB.avg)]].map(([l,a,b])=>{
                    const w=winCls(parseFloat(a),parseFloat(b));
                    return <tr key={l} className="border-b border-emerald-500/07 last:border-0"><td className="px-4 py-2 text-emerald-100/80">{l}</td><td className={`px-4 py-2 ${w.a}`}>{a}</td><td className={`px-4 py-2 ${w.b}`}>{b}</td></tr>;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ TANK ══ */}
        {tab==='🛡️ Tank' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">🛡️ Tankiness — EHP Comparison</h2>
            <p className="text-sm text-emerald-100/60">Converts resistances and block into equivalent HP for direct comparison.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SecLabel><span className="text-blue-400/70">Build A</span></SecLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Num label="Total HP" value={taHP} onChange={setTaHP} />
                  <Num label="% Resistance" value={taRes} onChange={setTaRes} min={0} max={90} tip="Use Resistance tab to convert from flat." />
                  <Num label="% Block Chance" value={taBlock} onChange={setTaBlock} min={0} max={100} />
                </div>
                <div className="mt-2"><Check label="Blocking Expert sublimation" checked={taExpert} onChange={setTaExpert} /></div>
              </div>
              <div>
                <SecLabel><span className="text-emerald-400/70">Build B</span></SecLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Num label="Total HP" value={tbHP} onChange={setTbHP} />
                  <Num label="% Resistance" value={tbRes} onChange={setTbRes} min={0} max={90} />
                  <Num label="% Block Chance" value={tbBlock} onChange={setTbBlock} min={0} max={100} />
                </div>
                <div className="mt-2"><Check label="Blocking Expert sublimation" checked={tbExpert} onChange={setTbExpert} /></div>
              </div>
            </div>
            <div className="glass-soft rounded-2xl overflow-hidden mt-2">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-emerald-500/15">{['Metric','Build A','Build B'].map(h=><th key={h} className="text-left px-4 py-2 text-[11px] uppercase tracking-widest text-emerald-400/65 font-semibold">{h}</th>)}</tr></thead>
                <tbody>
                  {[['Total HP',fmt(taHP),fmt(tbHP)],['% Resistance',`${taRes}%`,`${tbRes}%`],['% Block',`${taBlock}%`,`${tbBlock}%`],['Blocking Expert',taExpert?'Yes':'No',tbExpert?'Yes':'No']].map(([l,a,b])=>(
                    <tr key={l} className="border-b border-emerald-500/07"><td className="px-4 py-2 text-emerald-100/80">{l}</td><td className="px-4 py-2 text-emerald-100/80">{a}</td><td className={'px-4 py-2 text-emerald-100/80'}>{b}</td></tr>
                  ))}
                  <tr>{(()=>{const w=winCls(ehpA,ehpB);return(<><td className="px-4 py-2 text-emerald-100/80">EHP ★</td><td className={`px-4 py-2 ${w.a}`}>{fmt(ehpA)}</td><td className={`px-4 py-2 ${w.b}`}>{fmt(ehpB)}</td></>);})()}</tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ RESISTANCE ══ */}
        {tab==='📏 Resistance' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">📏 Flat ↔ % Resistance Converter</h2>
            <SecLabel>Flat Resistance → % Resistance</SecLabel>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex-1 min-w-[140px]"><Num label="Flat Resistance" value={rFlat} onChange={setRFlat} /></div>
              <span className="text-xl text-emerald-400/55 pb-2">→</span>
              <ResBox label="% Resistance" value={fmtD(flatToPerc(rFlat),1)+'%'} />
            </div>
            <SecLabel>% Resistance → Flat Resistance</SecLabel>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex-1 min-w-[140px]"><Num label="% Resistance (0–90)" value={rPerc} onChange={setRPerc} min={0} max={90} /></div>
              <span className="text-xl text-emerald-400/55 pb-2">→</span>
              <ResBox label="Flat Resistance" value={fmt(percToFlat(rPerc))} />
            </div>
            <SecLabel>Reference Table</SecLabel>
            <div className="glass-soft rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-emerald-500/15"><th className="text-left px-4 py-2 text-[11px] uppercase tracking-widest text-emerald-400/65 font-semibold">% Resistance</th><th className="text-left px-4 py-2 text-[11px] uppercase tracking-widest text-emerald-400/65 font-semibold">Flat needed</th></tr></thead>
                <tbody>{resTable.map(p=><tr key={p} className="border-b border-emerald-500/07 last:border-0"><td className="px-4 py-2 text-emerald-100/80">{p}%</td><td className="px-4 py-2 text-emerald-100/80">{fmt(percToFlat(p))}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ FOW ══ */}
        {tab==='⚡ FoW' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">⚡ Force of Will — AP / MP Removal</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="Base Removal Value" value={fowBase} onChange={setFowBase} min={0} tip="Raw AP/MP removal from spell description." />
              <Num label="Caster Force of Will" value={fowCaster} onChange={setFowCaster} tip="Target gains +10 FoW per AP/MP removed." />
              <Num label="Target Force of Will" value={fowTarget} onChange={setFowTarget} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              <ResBox label="FoW Factor (FF)" value={fmtD(ff,3)} color="text-yellow-300" border="border-yellow-400/50" />
              <ResBox label="Effective Removal" value={fmtD(fowEff,3)} color="text-yellow-300" border="border-yellow-400/50" />
              <ResBox label="Guaranteed Remove" value={String(fowFloor)} color="text-blue-300" border="border-blue-400/50" />
              <ResBox label="Chance to Remove +1" value={fowChance+'%'} color="text-blue-300" border="border-blue-400/50" />
            </div>
          </div>
        )}

        {/* ══ LOCK ══ */}
        {tab==='⛓️ Lock' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">⛓️ Lock / Dodge — MP / AP Losses</h2>
            <p className="text-sm text-emerald-100/60">MP/AP losses when a target (lvl 100+) dodges. Lockers are weighted: A×1, B×½, C×⅓, D×¼.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="Locker A Lock" value={lkLA} onChange={setLkLA} min={0} tip="Strongest locker — full value." />
              <Num label="Locker B Lock" value={lkLB} onChange={setLkLB} min={0} tip="Counts at ½ value." />
              <Num label="Locker C Lock" value={lkLC} onChange={setLkLC} min={0} tip="Counts at ⅓ value." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="Locker D Lock" value={lkLD} onChange={setLkLD} min={0} tip="Counts at ¼ value." />
              <Num label="Target Dodge" value={lkDodge} onChange={setLkDodge} min={0} />
              <Sel label="Locker Orientation" value={lkOrient} onChange={setLkOrient} options={[{label:'At least one facing (factor 0)',value:0},{label:'At least one showing side (factor 1)',value:1},{label:'All showing back (factor 2)',value:2}]} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              <ResBox label="Combined Lock (L)" value={fmtD(L,1)} color="text-purple-300" border="border-purple-400/50" />
              <ResBox label="X value" value={fmtD(X,3)} color="text-purple-300" border="border-purple-400/50" />
              <ResBox label="MP Loss" value={String(mpLoss)} color="text-purple-300" border="border-purple-400/50" />
              <ResBox label="AP Loss" value={String(apLoss)} color="text-purple-300" border="border-purple-400/50" />
            </div>
          </div>
        )}

        {/* ══ HP/EHP ══ */}
        {tab==='🩸 HP/EHP' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">🩸 HP &amp; EHP Calculator</h2>
            <SecLabel>Total HP from Stats</SecLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="Character Level" value={hpLevel} onChange={setHpLevel} min={1} />
              <Num label="Flat HP Bonus" value={hpFlat} onChange={setHpFlat} />
              <Num label="% HP Bonus" value={hpPerc} onChange={setHpPerc} />
            </div>
            <ResBox label="Total HP" value={fmt(totalHP)} color="text-red-300" border="border-red-400/50" />
            <SecLabel>Effective HP (EHP)</SecLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="Total HP" value={ehpHP} onChange={setEhpHP} />
              <Num label="% Resistance (0–90)" value={ehpRes} onChange={setEhpRes} min={0} max={90} />
              <Num label="% Block Chance" value={ehpBlock} onChange={setEhpBlock} min={0} max={100} />
            </div>
            <Check label="Blocking Expert sublimation" checked={ehpExpert} onChange={setEhpExpert} />
            <ResBox label="Effective HP (EHP)" value={fmt(ehpVal)} color="text-red-300" border="border-red-400/50" />
          </div>
        )}

        {/* ══ EM ══ */}
        {tab==='🗡️ EM' && (
          <div className="glass rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-emerald-200 border-b border-emerald-500/18 pb-3">🗡️ Effective Masteries (EM)</h2>
            <p className="text-sm text-emerald-100/60">Converts % Damage Inflicted and Crit into a unified mastery metric for accurate build comparison.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="Sum of Relevant Masteries" value={emMast} onChange={setEmMast} tip="Exclude critical mastery here — it goes in the next field." />
              <Num label="Critical Mastery" value={emCritMast} onChange={setEmCritMast} />
              <Num label="% Dmg Inflicted (non-crit)" value={emDI} onChange={setEmDI} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Num label="% Crit Dmg Inflicted" value={emCritDI} onChange={setEmCritDI} tip="e.g. from the Courage sublimation." />
              <Num label="% Crit Hit Chance" value={emCH} onChange={setEmCH} min={0} max={100} />
              <Num label="% Stasis Dmg Bonus" value={emStasis} onChange={setEmStasis} min={100} tip="For player characters always leave at 100%." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
              <ResBox label="EM (Normal)" value={fmtD(emNorm)} />
              <ResBox label="EMcrit" value={fmtD(emCrit2)} color="text-yellow-300" border="border-yellow-400/50" />
              <ResBox label="EM Average ★" value={fmtD(emAvg)} color="text-green-300" border="border-green-400/50" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
