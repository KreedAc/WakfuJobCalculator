import { ChevronDown, Info } from 'lucide-react';

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
    <details className={`group card overflow-hidden ${className}`}>
      <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none select-none hover:bg-surface2 transition-colors [&::-webkit-details-marker]:hidden">
        <Info className="w-[18px] h-[18px] text-primary shrink-0" />
        <h2 className="text-[15px] font-semibold text-fg font-sans tracking-normal">{title}</h2>
        <ChevronDown className="ml-auto w-4 h-4 text-subtle shrink-0 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <p className="px-5 pb-5 text-[14px] text-muted leading-relaxed">{text}</p>
    </details>
  );
}
