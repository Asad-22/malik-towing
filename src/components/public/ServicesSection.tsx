import { useSiteContent } from '@/context/SiteContentContext';
import { getIcon } from '@/lib/icons';
import { SectionHeading } from '@/components/public/SectionHeading';

export function ServicesSection() {
  const { services, settings } = useSiteContent();

  return (
    <section id="services" className="scroll-mt-40 bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          title={settings.text('services.heading')}
          subtitle={settings.text('services.subheading')}
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <article
                key={service.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-navy/30 hover:shadow-xl"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-red transition duration-300 group-hover:scale-x-100" />
                {service.image_url && (
                  <img
                    src={service.image_url}
                    alt=""
                    loading="lazy"
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy text-white transition group-hover:bg-brand-red">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold leading-snug text-brand-navy">{service.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-slate-600">{service.description}</p>
                  {service.price_note && (
                    <p className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold text-brand-red">
                      {service.price_note}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
