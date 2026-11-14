/*
# Malik Towing core schema, owner access, and asset storage

Plain-English summary: creates every table the website and admin dashboard need, locks them down with row level security, and adds the owner-only admin role.

1. New Tables
- `admins`: user accounts allowed to manage the site (one owner account by default).
- `site_settings`: every editable piece of public text, phone number, button label, color, image, list and toggle. Grouped so the admin editor can show them in sections.
- `navigation_links`: header and footer menu links (label, destination, location, order, visibility).
- `pages`: custom pages built in the admin (slug, title, hero image, content, SEO, published flag).
- `services`: towing service cards.
- `trust_badges`: "Why choose us" trust cards.
- `reviews`: customer testimonials with a 1-5 star rating.
- `leads`: tow requests submitted from the public dispatch form.

2. Functions
- `is_admin()`: returns true when the signed-in user is listed in `admins`.
- `claim_admin()`: lets a signed-in user become the owner, but only while no owner exists yet.

3. Storage
- `site-assets` public bucket for logos, favicon, hero and page images. Anyone can view, only admins can upload, replace or delete.

4. Security
- Row level security is enabled on every table.
- Public visitors can read visible content and submit tow requests. They cannot read leads or change anything.
- Admins can manage all content and read and update leads.
- Column-level grant on `leads`: admins can only change `status` and `dispatch_notes`.

5. Important notes
- Statements are idempotent (IF NOT EXISTS / DROP POLICY IF EXISTS), so re-running is safe.
- No data is dropped or altered.
*/

CREATE TABLE IF NOT EXISTS admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  group_key text NOT NULL,
  label text NOT NULL,
  field_type text NOT NULL CHECK (field_type IN ('text', 'textarea', 'phone', 'url', 'image', 'lines', 'color', 'number', 'boolean')),
  value jsonb NOT NULL DEFAULT '""'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS navigation_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL CHECK (char_length(label) BETWEEN 1 AND 60),
  href text NOT NULL CHECK (char_length(href) BETWEEN 1 AND 300),
  location text NOT NULL CHECK (location IN ('header', 'footer')),
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) BETWEEN 1 AND 100),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 150),
  hero_subtitle text NOT NULL DEFAULT '',
  hero_image_url text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 150),
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Truck',
  price_note text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trust_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 150),
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'BadgeCheck',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 100),
  location_label text NOT NULL DEFAULT '',
  rating smallint NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_name text NOT NULL CHECK (char_length(driver_name) BETWEEN 1 AND 120),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 30),
  truck_type text NOT NULL CHECK (char_length(truck_type) BETWEEN 1 AND 60),
  issue text NOT NULL CHECK (char_length(issue) BETWEEN 1 AND 1000),
  location_text text NOT NULL DEFAULT '' CHECK (char_length(location_text) <= 300),
  latitude double precision CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
  longitude double precision CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
  maps_url text NOT NULL DEFAULT '' CHECK (char_length(maps_url) <= 500),
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Dispatched', 'Completed', 'Cancelled')),
  dispatch_notes text NOT NULL DEFAULT '' CHECK (char_length(dispatch_notes) <= 5000),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_navigation_links_location_order ON navigation_links (location, sort_order);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services (sort_order);
CREATE INDEX IF NOT EXISTS idx_trust_badges_sort_order ON trust_badges (sort_order);
CREATE INDEX IF NOT EXISTS idx_reviews_sort_order ON reviews (sort_order);
CREATE INDEX IF NOT EXISTS idx_pages_sort_order ON pages (sort_order);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION claim_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  IF EXISTS (SELECT 1 FROM public.admins) THEN
    RETURN EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
  END IF;

  INSERT INTO public.admins (user_id) VALUES (auth.uid());
  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION claim_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION claim_admin() TO authenticated;

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON admins TO authenticated;
DROP POLICY IF EXISTS "Admins can see their own admin record" ON admins;
CREATE POLICY "Admins can see their own admin record" ON admins FOR SELECT
TO authenticated USING (user_id = auth.uid());

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON site_settings TO authenticated;
DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT
TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins can insert site settings" ON site_settings;
CREATE POLICY "Admins can insert site settings" ON site_settings FOR INSERT
TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;
CREATE POLICY "Admins can update site settings" ON site_settings FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can delete site settings" ON site_settings;
CREATE POLICY "Admins can delete site settings" ON site_settings FOR DELETE
TO authenticated USING (is_admin());

ALTER TABLE navigation_links ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON navigation_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON navigation_links TO authenticated;
DROP POLICY IF EXISTS "Public can read visible navigation" ON navigation_links;
CREATE POLICY "Public can read visible navigation" ON navigation_links FOR SELECT
TO anon, authenticated USING (is_visible);
DROP POLICY IF EXISTS "Admins can read all navigation" ON navigation_links;
CREATE POLICY "Admins can read all navigation" ON navigation_links FOR SELECT
TO authenticated USING (is_admin());
DROP POLICY IF EXISTS "Admins can insert navigation" ON navigation_links;
CREATE POLICY "Admins can insert navigation" ON navigation_links FOR INSERT
TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can update navigation" ON navigation_links;
CREATE POLICY "Admins can update navigation" ON navigation_links FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can delete navigation" ON navigation_links;
CREATE POLICY "Admins can delete navigation" ON navigation_links FOR DELETE
TO authenticated USING (is_admin());

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON pages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON pages TO authenticated;
DROP POLICY IF EXISTS "Public can read published pages" ON pages;
CREATE POLICY "Public can read published pages" ON pages FOR SELECT
TO anon, authenticated USING (is_published);
DROP POLICY IF EXISTS "Admins can read all pages" ON pages;
CREATE POLICY "Admins can read all pages" ON pages FOR SELECT
TO authenticated USING (is_admin());
DROP POLICY IF EXISTS "Admins can insert pages" ON pages;
CREATE POLICY "Admins can insert pages" ON pages FOR INSERT
TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can update pages" ON pages;
CREATE POLICY "Admins can update pages" ON pages FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can delete pages" ON pages;
CREATE POLICY "Admins can delete pages" ON pages FOR DELETE
TO authenticated USING (is_admin());

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON services TO authenticated;
DROP POLICY IF EXISTS "Public can read visible services" ON services;
CREATE POLICY "Public can read visible services" ON services FOR SELECT
TO anon, authenticated USING (is_visible);
DROP POLICY IF EXISTS "Admins can read all services" ON services;
CREATE POLICY "Admins can read all services" ON services FOR SELECT
TO authenticated USING (is_admin());
DROP POLICY IF EXISTS "Admins can insert services" ON services;
CREATE POLICY "Admins can insert services" ON services FOR INSERT
TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can update services" ON services;
CREATE POLICY "Admins can update services" ON services FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can delete services" ON services;
CREATE POLICY "Admins can delete services" ON services FOR DELETE
TO authenticated USING (is_admin());

ALTER TABLE trust_badges ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON trust_badges TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON trust_badges TO authenticated;
DROP POLICY IF EXISTS "Public can read visible trust badges" ON trust_badges;
CREATE POLICY "Public can read visible trust badges" ON trust_badges FOR SELECT
TO anon, authenticated USING (is_visible);
DROP POLICY IF EXISTS "Admins can read all trust badges" ON trust_badges;
CREATE POLICY "Admins can read all trust badges" ON trust_badges FOR SELECT
TO authenticated USING (is_admin());
DROP POLICY IF EXISTS "Admins can insert trust badges" ON trust_badges;
CREATE POLICY "Admins can insert trust badges" ON trust_badges FOR INSERT
TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can update trust badges" ON trust_badges;
CREATE POLICY "Admins can update trust badges" ON trust_badges FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can delete trust badges" ON trust_badges;
CREATE POLICY "Admins can delete trust badges" ON trust_badges FOR DELETE
TO authenticated USING (is_admin());

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON reviews TO authenticated;
DROP POLICY IF EXISTS "Public can read visible reviews" ON reviews;
CREATE POLICY "Public can read visible reviews" ON reviews FOR SELECT
TO anon, authenticated USING (is_visible);
DROP POLICY IF EXISTS "Admins can read all reviews" ON reviews;
CREATE POLICY "Admins can read all reviews" ON reviews FOR SELECT
TO authenticated USING (is_admin());
DROP POLICY IF EXISTS "Admins can insert reviews" ON reviews;
CREATE POLICY "Admins can insert reviews" ON reviews FOR INSERT
TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can update reviews" ON reviews;
CREATE POLICY "Admins can update reviews" ON reviews FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can delete reviews" ON reviews;
CREATE POLICY "Admins can delete reviews" ON reviews FOR DELETE
TO authenticated USING (is_admin());

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON leads TO anon, authenticated;
GRANT SELECT, DELETE ON leads TO authenticated;
GRANT UPDATE (status, dispatch_notes) ON leads TO authenticated;
DROP POLICY IF EXISTS "Public can submit tow requests" ON leads;
CREATE POLICY "Public can submit tow requests" ON leads FOR INSERT
TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can read leads" ON leads;
CREATE POLICY "Admins can read leads" ON leads FOR SELECT
TO authenticated USING (is_admin());
DROP POLICY IF EXISTS "Admins can update leads" ON leads;
CREATE POLICY "Admins can update leads" ON leads FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can delete leads" ON leads;
CREATE POLICY "Admins can delete leads" ON leads FOR DELETE
TO authenticated USING (is_admin());

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1 FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime' AND tablename = 'leads'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE leads;
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view site assets" ON storage.objects;
CREATE POLICY "Public can view site assets" ON storage.objects FOR SELECT
TO anon, authenticated USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Admins can upload site assets" ON storage.objects;
CREATE POLICY "Admins can upload site assets" ON storage.objects FOR INSERT
TO authenticated WITH CHECK (bucket_id = 'site-assets' AND is_admin());

DROP POLICY IF EXISTS "Admins can update site assets" ON storage.objects;
CREATE POLICY "Admins can update site assets" ON storage.objects FOR UPDATE
TO authenticated USING (bucket_id = 'site-assets' AND is_admin()) WITH CHECK (bucket_id = 'site-assets' AND is_admin());

DROP POLICY IF EXISTS "Admins can delete site assets" ON storage.objects;
CREATE POLICY "Admins can delete site assets" ON storage.objects FOR DELETE
TO authenticated USING (bucket_id = 'site-assets' AND is_admin());
