/*
# Seed navigation, services, trust badges, reviews, and starter pages

Plain-English summary: adds the default menu links, the four towing services, four trust cards, four customer reviews, and two starter pages (About and Service Areas) so the site looks complete on day one. Everything can be edited or removed in the admin dashboard.

1. Seeded Rows
- navigation_links: header menu (Services, Why Us, Service Areas, About, Reviews) and footer menu (Home, Services, Service Areas, About, Reviews, Request a Tow).
- services: Heavy-Duty Truck Towing, Medium and Light-Duty Towing, 24/7 Emergency Roadside Assistance, Winch-Out and Highway Accident Recovery.
- trust_badges: 30-Minute Average ETA, 24/7/365 Live Dispatch, Fully Licensed and Insured, Upfront and Honest Rates.
- reviews: four sample customer reviews from truckers and local drivers.
- pages: About Malik Towing (/about) and Service Areas (/service-areas), both published.

2. Security
- No security changes.

3. Important notes
- Rows use fixed IDs and ON CONFLICT (id) DO NOTHING, so re-running never duplicates content or overwrites owner edits.
*/

INSERT INTO navigation_links (id, label, href, location, sort_order, is_visible) VALUES
  ('10000000-0000-4000-8000-000000000001', 'Services', '/#services', 'header', 10, true),
  ('10000000-0000-4000-8000-000000000002', 'Why Us', '/#why-us', 'header', 20, true),
  ('10000000-0000-4000-8000-000000000003', 'Service Areas', '/service-areas', 'header', 30, true),
  ('10000000-0000-4000-8000-000000000004', 'About', '/about', 'header', 40, true),
  ('10000000-0000-4000-8000-000000000005', 'Reviews', '/#reviews', 'header', 50, true),
  ('10000000-0000-4000-8000-000000000011', 'Home', '/', 'footer', 10, true),
  ('10000000-0000-4000-8000-000000000012', 'Services', '/#services', 'footer', 20, true),
  ('10000000-0000-4000-8000-000000000013', 'Service Areas', '/service-areas', 'footer', 30, true),
  ('10000000-0000-4000-8000-000000000014', 'About', '/about', 'footer', 40, true),
  ('10000000-0000-4000-8000-000000000015', 'Reviews', '/#reviews', 'footer', 50, true),
  ('10000000-0000-4000-8000-000000000016', 'Request a Tow', '/#dispatch', 'footer', 60, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, description, icon, price_note, sort_order, is_visible) VALUES
  ('20000000-0000-4000-8000-000000000001', 'Heavy-Duty Truck Towing', 'Tractor-trailers, semi-trucks and 18-wheelers recovered and transported with heavy-duty rotators and flatbeds.', 'Truck', 'Quoted upfront by dispatch', 10, true),
  ('20000000-0000-4000-8000-000000000002', 'Medium and Light-Duty Towing', 'Box trucks, cargo vans, pickups, SUVs and cars towed safely with wheel-lift and flatbed units.', 'Car', 'Transparent pricing before we hook up', 20, true),
  ('20000000-0000-4000-8000-000000000003', '24/7 Emergency Roadside Assistance', 'Flat tires, jump starts, fuel delivery, lockouts and brake failures, at any hour of the day or night.', 'Wrench', 'Available around the clock', 30, true),
  ('20000000-0000-4000-8000-000000000004', 'Winch-Out and Highway Accident Recovery', 'Ditch recovery, rollover clean-up and highway accident removal, handled safely alongside law enforcement.', 'Siren', 'Dispatch will confirm the rig needed', 40, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO trust_badges (id, title, description, icon, sort_order, is_visible) VALUES
  ('30000000-0000-4000-8000-000000000001', '30-Minute Average ETA in 19154', 'Dispatch sends the closest available rig to your location.', 'Timer', 10, true),
  ('30000000-0000-4000-8000-000000000002', '24/7/365 Live Dispatch', 'A real dispatcher answers nights, weekends and holidays.', 'Headset', 20, true),
  ('30000000-0000-4000-8000-000000000003', 'Fully Licensed and Insured', 'Licensed operators and commercial-grade liability coverage.', 'BadgeCheck', 30, true),
  ('30000000-0000-4000-8000-000000000004', 'Upfront and Honest Rates', 'You get a price before we hook up. No surprise fees.', 'DollarSign', 40, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, author_name, location_label, rating, body, sort_order, is_visible) VALUES
  ('40000000-0000-4000-8000-000000000001', 'Marcus T.', 'Owner-operator, Parkwood', 5, 'Blown tire on I-95 at 2 AM. They had a rig on scene in under 30 minutes and had my trailer moving before sunrise.', 10, true),
  ('40000000-0000-4000-8000-000000000002', 'Denise R.', 'Fleet manager, Byberry', 5, 'We run box trucks out of Northeast Philly and Malik Towing is our first call every time. Honest pricing and fast trucks.', 20, true),
  ('40000000-0000-4000-8000-000000000003', 'James O.', 'Local driver, Roosevelt Blvd', 5, 'My car died on Roosevelt Blvd in the rain. Sharing my GPS location through their form made it so easy. The driver was professional.', 30, true),
  ('40000000-0000-4000-8000-000000000004', 'Priya K.', 'Commuter, Northeast Philadelphia', 5, 'Quick, friendly and clear about the price before they hooked up. I recommend them to anyone stuck in Philly traffic.', 40, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO pages (id, slug, title, hero_subtitle, hero_image_url, content, meta_title, meta_description, is_published, sort_order) VALUES
  ('50000000-0000-4000-8000-000000000001', 'about', 'About Malik Towing',
   'Your neighbors on the road in Northeast Philadelphia, around the clock.',
   'https://images.pexels.com/photos/17429097/pexels-photo-17429097.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   E'Malik Towing was built in Philadelphia 19154 for drivers who cannot afford to wait. We answer the phone day and night, and we send the right equipment for the job, whether that is a light-duty wheel-lift for a delivery van or a heavy-duty rotator for a loaded 18-wheeler.\n\n## Our promise\n\nWe tell you the price before we hook up, we keep you updated until the truck is on the hook, and we treat your cargo and your schedule with respect.\n\n## Licensed and insured\n\nOur operators are licensed, our trucks are inspected, and our commercial liability coverage protects your fleet.',
   'About Malik Towing | Philadelphia Truck Towing', 'Learn about Malik Towing, a 24/7 towing and roadside assistance company serving Philadelphia PA 19154.', true, 10),
  ('50000000-0000-4000-8000-000000000002', 'service-areas', 'Service Areas',
   'Fast response across Northeast Philadelphia, I-95, the PA Turnpike and Route 1.',
   'https://images.pexels.com/photos/8931961/pexels-photo-8931961.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   E'Our home base is Philadelphia, PA 19154. From there we cover Parkwood, Byberry and the surrounding Northeast Philadelphia neighborhoods.\n\n## Highways we serve\n\nI-95 from the Delaware County line to the Bucks County line, the PA Turnpike (I-276), and Route 1 / Roosevelt Blvd.\n\n## Not sure if we cover your location?\n\nCall 215-974-9700 or send your GPS location through the dispatch form and we will confirm your ETA.',
   'Truck Towing Service Areas | Malik Towing Philadelphia 19154', 'See the Philadelphia 19154 neighborhoods and highways Malik Towing covers, including I-95, the PA Turnpike and Roosevelt Blvd.', true, 20)
ON CONFLICT (id) DO NOTHING;
