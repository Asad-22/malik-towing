import { Truck } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';

export function BrandLogo({ variant }: { variant: 'header' | 'footer' }) {
  const { settings } = useSiteContent();
  const companyName = settings.text('company.name');
  const headerLogo = settings.text('company.logo_url');
  const logo =
    variant === 'footer' ? settings.text('company.footer_logo_url') || headerLogo : headerLogo;

  if (logo) {
    return (
      <img
        src={logo}
        alt={companyName}
        className="h-[72px] w-auto max-w-[300px] shrink-0 object-contain transition-transform duration-200"
      />
    );
  }

  return (
    <span className="flex items-center gap-3.5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red text-white shadow-md sm:h-14 sm:w-14">
        <Truck className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
      </span>
      <span className="text-xl font-extrabold uppercase tracking-tight text-white sm:text-2xl">
        {companyName}
      </span>
    </span>
  );
}
