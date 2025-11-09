import { useState } from 'react';

export default function App() {
  const [expPerItem, setExpPerItem] = useState('');
  const [selectedRange, setSelectedRange] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [result, setResult] = useState(null);
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-    1490482075699771"
     crossorigin="anonymous"></script>
  const BG_URL = '424478.jpg';

  const professions = [
    'Armorer','Baker','Chef','Handyman','Jeweler','Leather Dealer','Tailor','Weapons Master'
  ];

  const levelRanges = [
    { range: '2 - 10', expDiff: 7500, recipe: 'Coarse' },
    { range: '10 - 20', expDiff: 22500, recipe: 'Basic' },
    { range: '20 - 30', expDiff: 37500, recipe: 'Imperfect' },
    { range: '30 - 40', expDiff: 52500, recipe: 'Fragile' },
    { range: '40 - 50', expDiff: 67500, recipe: 'Rustic' },
    { range: '50 - 60', expDiff: 82500, recipe: 'Raw' },
    { range: '60 - 70', expDiff: 97500, recipe: 'Solid' },
    { range: '70 - 80', expDiff: 112500, recipe: 'Durable' },
    { range: '80 - 90', expDiff: 127500, recipe: 'Refined' },
    { range: '90 - 100', expDiff: 142500, recipe: 'Precious' },
    { range: '100 - 110', expDiff: 157500, recipe: 'Exquisite' },
    { range: '110 - 120', expDiff: 172500, recipe: 'Mystical' },
    { range: '120 - 130', expDiff: 187500, recipe: 'Eternal' },
    { range: '130 - 140', expDiff: 202500, recipe: 'Divine' },
    { range: '140 - 150', expDiff: 217500, recipe: 'Infernal' },
    { range: '150 - 160', expDiff: 232500, recipe: 'Ancestral' }
  ];

  const professionRecipes = {
    'Weapons Master': 'Handle',
    'Handyman': 'Bracket',
    'Baker': 'Oil',
    'Chef': 'Spice',
    'Armorer': 'Plate',
    'Jeweler': 'Gem',
    'Leather Dealer': 'Leather',
    'Tailor': 'Fiber'
  };

  function handleCalculate(e) {
    e.preventDefault();
    const expItem = parseFloat(expPerItem);

    if (!expItem || expItem <= 0 || !selectedRange || !selectedProfession) {
      alert('Please fill all fields and select a profession and level range.');
      return;
    }

    const selected = levelRanges.find(r => r.range === selectedRange);
    if (!selected) return;

    const craftCount = Math.ceil(selected.expDiff / expItem);
    const resourceCount = craftCount * 5;

    setResult({ ...selected, selectedProfession, craftCount, resourceCount });
  }

  const currentRangeRecipe = levelRanges.find(r => r.range === selectedRange)?.recipe || 'Recipe Name';
  const currentProfessionRecipe = professionRecipes[selectedProfession] || '';

  const recipeDisplay = `${currentRangeRecipe}${currentProfessionRecipe ? `  ${currentProfessionRecipe}` : ''}`;

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ backgroundImage: `url(${BG_URL})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.85) saturate(1.1)' }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-900/40 via-emerald-800/20 to-sky-900/40" />
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{ boxShadow: 'inset 0 0 250px rgba(0,0,0,0.55)' }} />

      <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg mb-6 text-center text-emerald-200">Wakfu Crafting XP Calculator</h1>
      <p className="text-emerald-100/90 mb-8 text-center max-w-2xl">Select your profession, choose a level range, and enter the EXP per crafted item.</p>

      <form onSubmit={handleCalculate} className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-2 text-sm text-emerald-100">Select Profession</label>
            <select value={selectedProfession} onChange={(e) => setSelectedProfession(e.target.value)} className="w-full p-3 rounded-lg bg-white/80 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-400/40" required>
              <option value="">-- Select a Profession --</option>
              {professions.map((p, i) => (<option key={i} value={p}>{p}</option>))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-emerald-100">Select Level Range</label>
            <select value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)} className="w-full p-3 rounded-lg bg-white/80 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-400/40" required>
              <option value="">-- Select a Range --</option>
              {levelRanges.map((r, i) => (<option key={i} value={r.range}>{r.range}</option>))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-emerald-100">Recipe</label>
            <p className="p-3 rounded-lg bg-white/80 text-gray-900 font-semibold">{recipeDisplay}</p>
          </div>

          <div>
            <label className="block mb-2 text-sm text-emerald-100">EXP per Crafted Item</label>
            <input type="number" value={expPerItem} onChange={(e) => setExpPerItem(e.target.value)} placeholder="e.g. 150" className="w-full p-3 rounded-lg bg-white/80 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-emerald-400/40" required />
          </div>
        </div>

        <button type="submit" className="w-full py-3 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 transition shadow-lg shadow-emerald-900/30">Calculate Required Crafts</button>
      </form>

      {result && (
        <div className="mt-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl max-w-xl w-full">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-emerald-200">Results for {result.selectedProfession} ({result.range})</h2>
            <ul className="divide-y divide-white/15 text-emerald-50/95">
              <li className="py-2 flex items-center justify-between"><span>XP Difference</span><span className="font-semibold text-emerald-300">{result.expDiff.toLocaleString()}</span></li>
              <li className="py-2 flex items-center justify-between"><span>Crafts Needed</span><span className="font-semibold text-emerald-300">{result.craftCount}</span></li>
              <li className="py-2 flex items-center justify-between"><span>Resource Count (per resource)</span><span className="font-semibold text-emerald-300">{result.resourceCount}</span></li>
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`::selection{ background: rgba(16, 185, 129, 0.35); }`}</style>
      <footer className="mt-12 text-emerald-200/80 text-sm text-center drop-shadow">© {new Date().getFullYear()} Created by KreedAc and LadyKreedAc</footer>
    </div>
  );
}
