import { Wrench } from 'lucide-react';

export function ItemsCraftGuidePage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center justify-center gap-6 p-12">
        <Wrench className="w-24 h-24 text-emerald-400/50" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold text-emerald-300 text-center">
          Items Craft Guide
        </h1>
        <p className="text-xl text-emerald-200/70 text-center max-w-2xl">
          This feature is currently under development. Check back soon for a comprehensive guide on crafting items in WAKFU!
        </p>
      </div>
    </div>
  );
}
