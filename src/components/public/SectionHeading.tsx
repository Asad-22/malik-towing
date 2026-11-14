import { Star } from 'lucide-react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  tone?: 'light' | 'dark';
}

export function SectionHeading({ title, subtitle, tone = 'light' }: SectionHeadingProps) {
  const titleColor = tone === 'dark' ? 'text-white' : 'text-brand-navy';
  const subtitleColor = tone === 'dark' ? 'text-white/80' : 'text-slate-600';

  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mx-auto mb-5 flex items-center justify-center gap-3" aria-hidden="true">
        <span className="h-px w-10 bg-brand-red" />
        <Star className="h-4 w-4 fill-brand-red text-brand-red" />
        <span className="h-px w-10 bg-brand-red" />
      </div>
      <h2 className={`text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-4xl ${titleColor}`}>
        {title}
      </h2>
      {subtitle && <p className={`mt-4 text-lg leading-relaxed ${subtitleColor}`}>{subtitle}</p>}
    </div>
  );
}
