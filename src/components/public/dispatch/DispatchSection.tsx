import { useState } from 'react';
import { Phone } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import { telHref } from '@/lib/contact';
import { DispatchForm, type SubmittedLead } from '@/components/public/dispatch/DispatchForm';

export function DispatchSection() {
  const { settings } = useSiteContent();
  const [submitted, setSubmitted] = useState<SubmittedLead | null>(null);
  const phone = settings.text('contact.phone_primary');

  return (
    <section id="dispatch" className="scroll-mt-40 bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:gap-16 lg:px-6">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold leading-[1.2] tracking-tight text-brand-navy sm:text-4xl">
            {settings.text('form.title')}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{settings.text('form.subtitle')}</p>
          {phone && (
            <a
              href={telHref(phone)}
              className="mt-8 inline-flex w-fit items-center gap-3 rounded-md bg-brand-navy px-6 py-4 text-lg font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-navy/90"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {phone}
            </a>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          {submitted ? (
            <div className="animate-fade-up flex flex-col items-center gap-5 py-6 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-red text-white shadow-lg">
                <Phone className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="text-2xl font-extrabold text-brand-navy">{settings.text('form.success_title')}</h3>
              <p className="leading-relaxed text-slate-600">{settings.text('form.success_message')}</p>
              {phone && (
                <a
                  href={telHref(phone)}
                  className="animate-pulse-ring inline-flex items-center gap-3 rounded-md bg-brand-red px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-xl transition hover:bg-brand-red/90"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  {settings.text('form.success_call_label')}
                </a>
              )}
            </div>
          ) : (
            <DispatchForm onSubmitted={setSubmitted} />
          )}
        </div>
      </div>
    </section>
  );
}
