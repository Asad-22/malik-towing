import { Phone } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import { telHref } from '@/lib/contact';

export function EmergencyBar() {
  const { settings } = useSiteContent();
  const phone = settings.text('contact.phone_primary');

  if (!settings.flag('emergency_bar.visible')) return null;

  return (
    <div className="bg-brand-red text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-sm font-semibold sm:text-base">
        <p className="text-center">{settings.text('emergency_bar.text')}</p>
        {phone && (
          <a
            href={telHref(phone)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-bold text-brand-red transition hover:bg-slate-100"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {settings.text('emergency_bar.phone_label')} {phone}
          </a>
        )}
      </div>
    </div>
  );
}
