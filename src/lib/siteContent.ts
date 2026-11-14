import { supabase } from '@/lib/supabase';
import type { NavLink, Page, Review, Service, SiteSetting, TrustBadge } from '@/lib/types';

export interface SiteContent {
  settings: SiteSetting[];
  navLinks: NavLink[];
  pages: Page[];
  services: Service[];
  trustBadges: TrustBadge[];
  reviews: Review[];
}

interface QueryResult {
  data: unknown;
  error: { message: string } | null;
}

function rowsOf<T>(result: QueryResult): T[] {
  if (result.error) throw new Error(result.error.message);
  if (!Array.isArray(result.data)) throw new Error('Unexpected response shape');
  return result.data as T[];
}

export async function fetchSiteContent(): Promise<SiteContent> {
  const [settings, navLinks, pages, services, trustBadges, reviews] = await Promise.all([
    supabase.from('site_settings').select('*').order('sort_order'),
    supabase.from('navigation_links').select('*').eq('is_visible', true).order('sort_order'),
    supabase.from('pages').select('*').eq('is_published', true).order('sort_order'),
    supabase.from('services').select('*').eq('is_visible', true).order('sort_order'),
    supabase.from('trust_badges').select('*').eq('is_visible', true).order('sort_order'),
    supabase.from('reviews').select('*').eq('is_visible', true).order('sort_order'),
  ]);

  return {
    settings: rowsOf<SiteSetting>(settings),
    navLinks: rowsOf<NavLink>(navLinks),
    pages: rowsOf<Page>(pages),
    services: rowsOf<Service>(services),
    trustBadges: rowsOf<TrustBadge>(trustBadges),
    reviews: rowsOf<Review>(reviews),
  };
}
