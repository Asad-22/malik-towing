import { MapPin } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import { mapEmbedHref } from '@/lib/contact';
import { SectionHeading } from '@/components/public/SectionHeading';

export function CoverageSection() {
  const { settings } = useSiteContent();
  const heading = settings.text('coverage.heading');
  const latitude = settings.number('map.latitude');
  const longitude = settings.number('map.longitude');
  const zoom = settings.number('map.zoom');
  const hasMap = Number.isFinite(latitude) && Number.isFinite(longitude);
  const chips = [
    ...settings.list('coverage.zip_codes'),
    ...settings.list('coverage.neighborhoods'),
    ...settings.list('coverage.highways'),
  ];

  return (
    <section id="coverage" className="scroll-mt-40 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading title={heading} subtitle={settings.text('coverage.description')} />

        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-6">
            <div className="flex flex-wrap gap-3">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-navy/15 bg-slate-50 px-4 py-2 text-sm font-semibold text-brand-navy transition hover:border-brand-red hover:text-brand-red"
                >
                  <MapPin className="h-4 w-4 text-brand-red" aria-hidden="true" />
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {hasMap && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
              <iframe
                title={heading}
                src={mapEmbedHref(latitude, longitude, Number.isFinite(zoom) ? zoom : 12)}
                className="h-80 w-full border-0 lg:h-full lg:min-h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
