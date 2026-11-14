import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BrandLogo } from '@/components/public/BrandLogo';
import { useSiteContent } from '@/context/SiteContentContext';
import { Link } from '@/lib/router';
import { telHref, whatsappHref } from '@/lib/contact';

export function SiteFooter() {
  const { navLinks, settings } = useSiteContent();
  const footerLinks = navLinks.filter((link) => link.location === 'footer');
  const phone = settings.text('contact.phone_primary');
  const whatsappNumber = settings.text('contact.whatsapp_number');
  const coverage = [...settings.list('coverage.zip_codes'), ...settings.list('coverage.highways')];

  return (
    <footer className="bg-brand-navy text-white">
      <div className="flag-divider" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandLogo variant="footer" />
          <p className="mt-5 leading-relaxed text-white/75">{settings.text('footer.bio')}</p>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">
            {settings.text('footer.links_heading')}
          </h2>
          <ul className="mt-5 space-y-3">
            {footerLinks.map((link) => (
              <li key={link.id}>
                <Link href={link.href} className="text-white/80 transition hover:text-white hover:underline underline-offset-4">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">
            {settings.text('footer.contact_heading')}
          </h2>
          <ul className="mt-5 space-y-4 text-white/85">
            {phone && (
              <li>
                <a href={telHref(phone)} className="inline-flex items-center gap-2 font-bold text-white transition hover:text-white/80 hover:underline underline-offset-4">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {phone}
                </a>
              </li>
            )}
            {whatsappNumber && (
              <li>
                <a
                  href={whatsappHref(whatsappNumber, settings.text('contact.whatsapp_message'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-white hover:underline underline-offset-4"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {settings.text('hero.whatsapp_label')}
                </a>
              </li>
            )}
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{settings.text('contact.hours')}</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">
            {settings.text('footer.area_heading')}
          </h2>
          <ul className="mt-5 space-y-3 text-white/85">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{settings.text('contact.address')}</span>
            </li>
            {coverage.map((item) => (
              <li key={item} className="pl-6">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-white/70 lg:px-6">
          {settings.text('footer.copyright')}
          <a 
  href="/admin" 
  className="text-xs text-white/60 hover:text-white underline ml-4"
>
  Admin Login
</a>

        </p>
      </div>
    </footer>
  );
}
