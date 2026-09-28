import { ChevronDown } from 'lucide-react';

interface HowItWorksProps {
  title: string;
  text: string;
  className?: string;
}

/**
 * Collapsible explanation section. Built on <details> so the text is always
 * in the prerendered HTML (indexable) and toggles without JavaScript.
 */
export function HowItWorks({ title, text, className = '' }: HowItWorksProps) {
  return (
    <details className={`group glass rounded-2xl overflow-hidden ${className}`}>
      <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none select-none hover:bg-emerald-500/5 transition-colors [&::-webkit-details-marker]:hidden">
        <h2 className="text-sm md:text-base font-bold text-emerald-300">{title}</h2>
        <ChevronDown className="h-4 w-4 text-emerald-300 shrink-0 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <p className="px-4 pb-4 text-sm text-emerald-100/85 leading-relaxed">{text}</p>
    </details>
  );
}
