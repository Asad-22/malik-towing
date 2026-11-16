import {
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  CheckCircle2,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import { telHref, whatsappHref } from '@/lib/contact';

export function HeroSection() {
  const { settings } = useSiteContent();
  const phone = settings.text('contact.phone_primary');
  const whatsappNumber = settings.text('contact.whatsapp_number');
  const image = settings.text('hero.image_url');

  return (
    <section className="relative isolate overflow-hidden bg-brand-navy text-white">
      {/* Background Image (Same working setup from your original code) */}
      {image && (
        <img
          src={image}
          alt="Malik Towing Service"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-100"
          fetchPriority="high"
        />
      )}

      {/* Rich USA Flag Navy Gradient Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-navy/95 via-brand-navy/80 to-brand-navy/45" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-brand-navy to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-6 lg:py-24">
        {/* Left Column: Main Value Proposition & Instant Actions */}
        <div className="animate-fade-up lg:col-span-7">
          {/* Live Status + Badge */}
          <div className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-red" />
            </span>
            <Shield className="h-4 w-4 text-white" aria-hidden="true" />
            <span>{settings.text('hero.badge')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {settings.text('hero.headline')}
          </h1>

          {/* Subheadline */}
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            {settings.text('hero.subheadline')}
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            {phone && (
              <a
                href={telHref(phone)}
                className="animate-pulse-ring group inline-flex items-center justify-center gap-3 rounded-xl bg-brand-red px-7 py-4 text-left text-white shadow-2xl shadow-brand-red/30 transition duration-200 hover:-translate-y-0.5 hover:bg-brand-red/90"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-white/85">
                    {settings.text('hero.call_label')}
                  </span>
                  <span className="block text-lg font-extrabold tracking-tight">
                    {phone}
                  </span>
                </span>
              </a>
            )}

            {whatsappNumber && (
              <a
                href={whatsappHref(whatsappNumber, settings.text('contact.whatsapp_message'))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/25 bg-whatsapp px-7 py-4 text-white shadow-xl transition duration-200 hover:-translate-y-0.5 hover:bg-whatsapp-dark"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-left">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-white/85">
                    Instant Location Share
                  </span>
                  <span className="block text-lg font-bold">
                    {settings.text('hero.whatsapp_label')}
                  </span>
                </span>
              </a>
            )}
          </div>

          {/* Trust & Guarantee Highlights */}
          <div className="mt-9 grid grid-cols-1 gap-3 border-t border-white/15 pt-6 text-sm font-semibold text-white/90 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-red" aria-hidden="true" />
              <span>Licensed &amp; Fully Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 shrink-0 text-brand-red" aria-hidden="true" />
              <span>Heavy &amp; Light Duty Fleet</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-red" aria-hidden="true" />
              <span>Fast Emergency Response</span>
            </div>
          </div>
        </div>

        {/* Right Column: Emergency Dispatch Card */}
        <aside className="animate-fade-up lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-white/20 bg-brand-navy/80 shadow-2xl backdrop-blur-md">
            {/* Top Red USA Accent Bar */}
            <div className="flex items-center justify-between bg-brand-red px-6 py-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-white">
                24/7 Emergency Dispatch
              </span>
              <span className="rounded bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white">
                ONLINE NOW
              </span>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white">
                  Need Immediate Roadside Help?
                </h2>
                <p className="mt-1.5 text-sm text-white/75">
                  Direct dispatch with no middleman delays. Tap below to connect right away.
                </p>
              </div>

              <div className="space-y-4">
                {/* Address Item */}
                <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-brand-navy shadow">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-white/60">
                      Dispatch Base &amp; Coverage
                    </span>
                    <p className="mt-0.5 text-base font-semibold leading-snug text-white">
                      {settings.text('contact.address')}
                    </p>
                  </div>
                </div>

                {/* Hours Item */}
                <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-red text-white shadow">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-white/60">
                      Operating Hours
                    </span>
                    <p className="mt-0.5 text-base font-semibold leading-snug text-white">
                      {settings.text('contact.hours')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Scroll to Dispatch Form */}
              <a
                href="#dispatch"
                className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-brand-navy"
              >
                <span>Request Tow Truck Online</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </aside>
      </div>

      <div className="flag-divider" />
    </section>
  );
}
