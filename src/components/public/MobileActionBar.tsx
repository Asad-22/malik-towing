import { MessageCircle, Phone } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import { telHref, whatsappHref } from '@/lib/contact';

export function MobileActionBar() {
  const { settings } = useSiteContent();
  const phone = settings.text('contact.phone_primary');
  const whatsappNumber = settings.text('contact.whatsapp_number');
  const message = settings.text('contact.whatsapp_message');

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-px bg-brand-navy shadow-[0_-8px_24px_rgba(10,34,64,0.25)] md:hidden">
      {phone && (
        <a
          href={telHref(phone)}
          className="flex items-center justify-center gap-2 bg-brand-red px-3 py-4 text-base font-extrabold uppercase tracking-wide text-white transition active:bg-brand-red/80"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          {settings.text('mobile_bar.call_label')}
        </a>
      )}
      {whatsappNumber && (
        <a
          href={whatsappHref(whatsappNumber, message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-whatsapp px-3 py-4 text-base font-extrabold uppercase tracking-wide text-white transition active:bg-whatsapp-dark"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          {settings.text('mobile_bar.whatsapp_label')}
        </a>
      )}
    </div>
  );
}
