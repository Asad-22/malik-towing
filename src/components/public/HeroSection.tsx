import { Clock, MapPin, MessageCircle, Phone, Shield } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import { telHref, whatsappHref } from '@/lib/contact';

export function HeroSection() {
  const { settings } = useSiteContent();
  const phone = settings.text('contact.phone_primary');
  const whatsappNumber = settings.text('contact.whatsapp_number');
  const image = settings.text('hero.image_url');

  return (
    <section className="relative isolate overflow-hidden bg-brand-navy text-white">
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-100"
          fetchPriority="high"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-navy via-brand-navy/70 to-brand-navy/45" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-12 lg:gap-10 lg:px-6 lg:py-24">
        <div className="animate-fade-up lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold">
            <Shield className="h-4 w-4 text-white" aria-hidden="true" />
            {settings.text('hero.badge')}
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            {settings.text('hero.headline')}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            {settings.text('hero.subheadline')}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {phone && (
              <a
                href={telHref(phone)}
                className="animate-pulse-ring inline-flex items-center justify-center gap-3 rounded-md bg-brand-red px-7 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-brand-red/90"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                {settings.text('hero.call_label')}
              </a>
            )}
            {whatsappNumber && (
              <a
                href={whatsappHref(whatsappNumber, settings.text('contact.whatsapp_message'))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-md border border-white/30 bg-whatsapp px-7 py-4 text-lg font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-whatsapp-dark"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {settings.text('hero.whatsapp_label')}
              </a>
            )}
          </div>
        </div>

        <aside className="animate-fade-up flex flex-col justify-center gap-6 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm sm:p-8 lg:col-span-5">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-brand-navy">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-lg font-semibold leading-snug">{settings.text('contact.address')}</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-red text-white">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-lg font-semibold leading-snug">{settings.text('contact.hours')}</p>
          </div>
        </aside>
      </div>

      <div className="flag-divider" />
    </section>
  );
}
