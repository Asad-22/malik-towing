import { useSiteContent } from '@/context/SiteContentContext';
import { getIcon } from '@/lib/icons';
import { SectionHeading } from '@/components/public/SectionHeading';

export function TrustSection() {
  const { trustBadges, settings } = useSiteContent();

  return (
    <section id="why-us" className="scroll-mt-40 bg-brand-navy py-16 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          tone="dark"
          title={settings.text('trust.heading')}
          subtitle={settings.text('trust.subheading')}
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {trustBadges.map((badge) => {
            const Icon = getIcon(badge.icon);
            return (
              <div
                key={badge.id}
                className="group rounded-2xl border border-white/15 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-white shadow-lg transition group-hover:scale-110">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold leading-snug">{badge.title}</h3>
                <p className="mt-2 leading-relaxed text-white/80">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
