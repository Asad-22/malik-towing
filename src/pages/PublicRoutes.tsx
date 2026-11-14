import { useSiteContent } from '@/context/SiteContentContext';
import { usePathname, Link } from '@/lib/router';
import { PublicLayout } from '@/components/public/PublicLayout';
import { HeroSection } from '@/components/public/HeroSection';
import { DispatchSection } from '@/components/public/dispatch/DispatchSection';
import { ServicesSection } from '@/components/public/ServicesSection';
import { TrustSection } from '@/components/public/TrustSection';
import { CoverageSection } from '@/components/public/CoverageSection';
import { ReviewsSection } from '@/components/public/ReviewsSection';
import { PageContent } from '@/components/public/PageContent';
import { telHref } from '@/lib/contact';
import { Phone } from 'lucide-react';

export function PublicRoutes() {
  const pathname = usePathname();
  const { pages, settings } = useSiteContent();
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  if (normalized === '/') {
    return (
      <PublicLayout>
        <HeroSection />
        <DispatchSection />
        <ServicesSection />
        <TrustSection />
        <CoverageSection />
        <ReviewsSection />
      </PublicLayout>
    );
  }

  const page = pages.find((item) => `/${item.slug}` === normalized);
  const phone = settings.text('contact.phone_primary');

  if (!page) {
    return (
      <PublicLayout>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-32 text-center">
          <p className="text-6xl font-extrabold text-brand-red">404</p>
          <Link href="/" className="rounded-md bg-brand-navy px-6 py-3 font-bold text-white transition hover:bg-brand-navy/90">
            {settings.text('company.name')}
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout page={page}>
      <section className="relative isolate overflow-hidden bg-brand-navy text-white">
        {page.hero_image_url && (
          <img src={page.hero_image_url} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-navy via-brand-navy/90 to-brand-navy/60" />
        <div className="animate-fade-up mx-auto max-w-4xl px-4 py-20 text-center lg:py-28">
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">{page.title}</h1>
          {page.hero_subtitle && <p className="mt-5 text-lg leading-relaxed text-white/85">{page.hero_subtitle}</p>}
        </div>
        <div className="flag-divider" />
      </section>

      <article className="mx-auto max-w-3xl px-4 py-16 lg:py-24">
        <PageContent content={page.content} />
        {phone && (
          <a
            href={telHref(phone)}
            className="mt-12 inline-flex items-center gap-3 rounded-md bg-brand-red px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-xl transition hover:bg-brand-red/90"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            {settings.text('hero.call_label')}
          </a>
        )}
      </article>
    </PublicLayout>
  );
}
