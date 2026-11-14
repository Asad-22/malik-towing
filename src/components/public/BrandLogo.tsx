import { Truck } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';

export function BrandLogo({ variant }: { variant: 'header' | 'footer' }) {
  const { settings } = useSiteContent();
  const companyName = settings.text('company.name');
  const headerLogo = settings.text('company.logo_url');
  const logo =
    variant === 'footer' ? settings.text('company.footer_logo_url') || headerLogo : headerLogo;

  if (logo) {
    return <img src={logo} alt={companyName} className="h-12 w-auto max-w-[220px] object-contain" />;
  }

  return (
    <span className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-red text-white shadow-md">
        <Truck className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="text-lg font-extrabold uppercase tracking-tight text-white">{companyName}</span>
    </span>
  );
}
