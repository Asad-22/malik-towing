import { useEffect } from 'react';
import type { Page } from '@/lib/types';
import { useSiteContent } from '@/context/SiteContentContext';
import { hexToRgbTriplet } from '@/lib/contact';

const SCHEMA_SCRIPT_ID = 'local-business-schema';

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setSchema(schema: Record<string, unknown>) {
  let script = document.getElementById(SCHEMA_SCRIPT_ID) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = SCHEMA_SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema);
}

const THEME_VARIABLES = [
  ['theme.navy', '--brand-navy-rgb'],
  ['theme.red', '--brand-red-rgb'],
  ['theme.white', '--brand-white-rgb'],
] as const;

export function SiteHead({ page }: { page?: Page }) {
  const { settings } = useSiteContent();

  useEffect(() => {
    const companyName = settings.text('company.name');
    const title = page
      ? page.meta_title || `${page.title} | ${companyName}`
      : settings.text('seo.title');
    const description = page?.meta_description || settings.text('seo.description');
    const image = settings.text('seo.og_image_url') || page?.hero_image_url || '';

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', settings.text('seo.keywords'));
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:image', image);

    const favicon = settings.text('company.favicon_url');
    const iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon && iconLink) iconLink.href = favicon;

    for (const [key, cssVariable] of THEME_VARIABLES) {
      const triplet = hexToRgbTriplet(settings.text(key));
      if (triplet) document.documentElement.style.setProperty(cssVariable, triplet);
    }

    const locality = settings.text('seo.locality');
    setSchema({
      '@context': 'https://schema.org',
      '@type': settings.text('seo.schema_type') || 'LocalBusiness',
      name: companyName,
      description,
      telephone: settings.text('contact.phone_primary'),
      url: window.location.origin,
      image,
      areaServed: { '@type': 'City', name: locality },
      address: {
        '@type': 'PostalAddress',
        addressLocality: locality,
        addressRegion: settings.text('seo.region'),
        postalCode: settings.text('seo.postal_code'),
        addressCountry: settings.text('seo.country'),
      },
    });
  }, [settings, page]);

  return null;
}
