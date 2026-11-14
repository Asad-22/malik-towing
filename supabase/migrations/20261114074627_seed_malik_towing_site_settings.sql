/*
# Seed editable site settings for Malik Towing

Plain-English summary: fills the database with every line of text, phone number, color, image and list that appears on the public website, so the owner can change all of it from the admin dashboard.

1. Seeded Rows (site_settings)
- contact: primary phone 215-974-9700, backup numbers, WhatsApp number and pre-filled message, ZIP 19154, address, hours.
- branding: company name, header logo, footer logo, favicon, and the USA flag theme colors (navy, crimson, white).
- emergency_bar: top banner text and toggle.
- header: header call button label.
- hero: background image, headline, sub-headline, badge, call and WhatsApp button labels.
- dispatch_form: form title, subtitle, field labels, GPS button, vehicle dropdown options, submit and confirmation text.
- services, trust, reviews: section headings and sub-headings.
- coverage: heading, description, ZIP codes, highways, neighborhoods, map center and zoom.
- footer: company bio, headings, copyright.
- mobile_bar: call and WhatsApp labels for the bottom action bar on phones.
- seo: default title, description, keywords, social share image, and local business schema details (postal code 19154, Philadelphia, PA, US).

2. Security
- No security changes. Rows are read by the public site and edited only by admins under the policies created in the schema migration.

3. Important notes
- Uses ON CONFLICT DO NOTHING, so re-running this migration never overwrites values the owner has edited.
*/

INSERT INTO site_settings (key, group_key, label, field_type, value, sort_order) VALUES
  ('contact.phone_primary', 'contact', 'Primary phone number', 'phone', '"215-974-9700"', 10),
  ('contact.phone_backups', 'contact', 'Backup phone numbers (one per line)', 'lines', '[]', 20),
  ('contact.whatsapp_number', 'contact', 'WhatsApp number (with country code)', 'phone', '"+1 215-974-9700"', 30),
  ('contact.whatsapp_message', 'contact', 'Pre-filled WhatsApp emergency message', 'textarea', '"Hi Malik Towing, I need an emergency tow in Philadelphia 19154. My location: "', 40),
  ('contact.service_zip', 'contact', 'Primary service ZIP code', 'text', '"19154"', 50),
  ('contact.address', 'contact', 'Business address or service base', 'text', '"Philadelphia, PA 19154"', 60),
  ('contact.hours', 'contact', 'Business hours', 'text', '"Open 24 hours, 7 days a week"', 70),

  ('company.name', 'branding', 'Company name', 'text', '"Malik Towing"', 10),
  ('company.logo_url', 'branding', 'Header logo', 'image', '""', 20),
  ('company.footer_logo_url', 'branding', 'Footer logo', 'image', '""', 30),
  ('company.favicon_url', 'branding', 'Favicon (browser tab icon)', 'image', '""', 40),
  ('theme.navy', 'branding', 'Primary navy color', 'color', '"#0A2240"', 50),
  ('theme.red', 'branding', 'Accent crimson color', 'color', '"#B22234"', 60),
  ('theme.white', 'branding', 'Crisp white color', 'color', '"#FFFFFF"', 70),

  ('emergency_bar.visible', 'emergency_bar', 'Show the top emergency bar', 'boolean', 'true', 10),
  ('emergency_bar.text', 'emergency_bar', 'Banner message', 'text', '"Stranded on I-95 or the PA Turnpike? Dispatch is live 24/7."', 20),
  ('emergency_bar.phone_label', 'emergency_bar', 'Clickable phone label', 'text', '"Tap to call now"', 30),

  ('header.call_label', 'header', 'Header call button label', 'text', '"Call Now"', 10),

  ('hero.image_url', 'hero', 'Background photo', 'image', '"https://images.pexels.com/photos/40650628/pexels-photo-40650628.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"', 10),
  ('hero.badge', 'hero', 'Badge above the headline', 'text', '"Licensed, Insured and Ready 24/7"', 20),
  ('hero.headline', 'hero', 'Headline', 'textarea', '"Stranded in Philadelphia (19154) or on I-95? Fast, Reliable 24/7 Truck Towing You Can Trust!"', 30),
  ('hero.subheadline', 'hero', 'Sub-headline', 'textarea', '"Rapid response across Northeast Philadelphia, PA 19154 for Semi-Trucks, 18-Wheelers, Box Trucks and Commercial Fleets. Licensed, Insured and Ready 24/7."', 40),
  ('hero.call_label', 'hero', 'Primary call button (red)', 'text', '"CALL NOW: 215-974-9700"', 50),
  ('hero.whatsapp_label', 'hero', 'Secondary WhatsApp button', 'text', '"WhatsApp Instant Dispatch"', 60),

  ('form.title', 'dispatch_form', 'Form title', 'text', '"Get a Tow Dispatched Now"', 10),
  ('form.subtitle', 'dispatch_form', 'Form subtitle', 'textarea', '"Tell us where you are and what you are driving. A dispatcher will confirm your estimated arrival."', 20),
  ('form.name_label', 'dispatch_form', 'Driver name field label', 'text', '"Driver name"', 30),
  ('form.phone_label', 'dispatch_form', 'Phone number field label', 'text', '"Best phone number"', 40),
  ('form.truck_label', 'dispatch_form', 'Vehicle type field label', 'text', '"Vehicle type"', 50),
  ('form.vehicle_options', 'dispatch_form', 'Vehicle dropdown options (one per line)', 'lines', '["Semi-Truck","18-Wheeler","Box Truck","Pickup / SUV","Car","Other"]', 60),
  ('form.issue_label', 'dispatch_form', 'Issue field label', 'text', '"What happened?"', 70),
  ('form.location_label', 'dispatch_form', 'Location field label', 'text', '"Location, nearest exit or mile marker"', 80),
  ('form.gps_button_label', 'dispatch_form', 'GPS button label', 'text', '"Share My Live GPS Location"', 90),
  ('form.gps_success', 'dispatch_form', 'Message after GPS is captured', 'text', '"GPS captured. Your exact location is attached to this request."', 100),
  ('form.gps_error', 'dispatch_form', 'Message if GPS is unavailable', 'text', '"We could not access your GPS. Please type your nearest exit or mile marker."', 110),
  ('form.submit_label', 'dispatch_form', 'Submit button label', 'text', '"Request Emergency Tow"', 120),
  ('form.submit_error', 'dispatch_form', 'Message if the request fails', 'text', '"We could not send your request. Please call dispatch directly."', 130),
  ('form.success_title', 'dispatch_form', 'Confirmation title', 'text', '"Help is on the way"', 140),
  ('form.success_message', 'dispatch_form', 'Confirmation message', 'textarea', '"Your request is in our dispatch queue. Call us right away if your situation changes or you need an update."', 150),
  ('form.success_call_label', 'dispatch_form', 'Confirmation call button label', 'text', '"Call Dispatch: 215-974-9700"', 160),

  ('services.heading', 'services', 'Section heading', 'text', '"Heavy-Duty and Roadside Towing Built for Commercial Fleets"', 10),
  ('services.subheading', 'services', 'Section sub-heading', 'textarea', '"From a flat tire on Roosevelt Blvd to a jackknifed trailer on I-95, we bring the right equipment to get you moving again."', 20),

  ('trust.heading', 'trust', 'Section heading', 'text', '"Why Philadelphia Drivers Choose Malik Towing"', 10),
  ('trust.subheading', 'trust', 'Section sub-heading', 'textarea', '"We know a breakdown is stressful. Here is what you can count on every time you call."', 20),

  ('coverage.heading', 'coverage', 'Section heading', 'text', '"Serving Northeast Philadelphia and Beyond"', 10),
  ('coverage.description', 'coverage', 'Section description', 'textarea', '"Based in Philadelphia 19154, we respond quickly across Parkwood, Byberry, I-95, the PA Turnpike (I-276) and Route 1 / Roosevelt Blvd."', 20),
  ('coverage.zip_codes', 'coverage', 'Covered ZIP codes (one per line)', 'lines', '["19154"]', 30),
  ('coverage.highways', 'coverage', 'Covered highways (one per line)', 'lines', '["I-95","I-276 (PA Turnpike)","Route 1 / Roosevelt Blvd"]', 40),
  ('coverage.neighborhoods', 'coverage', 'Covered neighborhoods (one per line)', 'lines', '["Northeast Philadelphia","Parkwood","Byberry"]', 50),
  ('map.latitude', 'coverage', 'Map center latitude', 'number', '40.0989', 60),
  ('map.longitude', 'coverage', 'Map center longitude', 'number', '-75.0145', 70),
  ('map.zoom', 'coverage', 'Map zoom level (1 to 20)', 'number', '12', 80),

  ('reviews.heading', 'reviews', 'Section heading', 'text', '"Trusted by Truckers and Local Drivers"', 10),
  ('reviews.subheading', 'reviews', 'Section sub-heading', 'textarea', '"Real feedback from fleet owners and drivers across Philadelphia."', 20),

  ('footer.bio', 'footer', 'Company bio', 'textarea', '"Malik Towing provides fast, professional towing and roadside assistance for semi-trucks, box trucks, fleets and passenger vehicles across Philadelphia, PA 19154."', 10),
  ('footer.links_heading', 'footer', 'Quick links heading', 'text', '"Quick Links"', 20),
  ('footer.contact_heading', 'footer', 'Contact heading', 'text', '"Contact Dispatch"', 30),
  ('footer.area_heading', 'footer', 'Service area heading', 'text', '"Service Area"', 40),
  ('footer.copyright', 'footer', 'Copyright line', 'text', '"© 2026 Malik Towing. All rights reserved."', 50),

  ('mobile_bar.call_label', 'mobile_bar', 'Mobile call button label', 'text', '"Call Now"', 10),
  ('mobile_bar.whatsapp_label', 'mobile_bar', 'Mobile WhatsApp button label', 'text', '"WhatsApp"', 20),

  ('seo.title', 'seo', 'Default page title', 'text', '"Malik Towing | 24/7 Truck Towing in Philadelphia, PA 19154"', 10),
  ('seo.description', 'seo', 'Default meta description', 'textarea', '"24/7 heavy-duty truck towing and roadside assistance in Philadelphia, PA 19154. Semi-trucks, 18-wheelers, box trucks and fleets. Call 215-974-9700."', 20),
  ('seo.keywords', 'seo', 'Keywords (comma separated)', 'text', '"truck towing philadelphia, 19154 towing, semi truck towing, I-95 towing, roadside assistance philadelphia"', 30),
  ('seo.og_image_url', 'seo', 'Social share image', 'image', '""', 40),
  ('seo.schema_type', 'seo', 'Local business schema type', 'text', '"AutomotiveBusiness"', 50),
  ('seo.postal_code', 'seo', 'Schema postal code', 'text', '"19154"', 60),
  ('seo.locality', 'seo', 'Schema city', 'text', '"Philadelphia"', 70),
  ('seo.region', 'seo', 'Schema state', 'text', '"PA"', 80),
  ('seo.country', 'seo', 'Schema country code', 'text', '"US"', 90)
ON CONFLICT (key) DO NOTHING;
