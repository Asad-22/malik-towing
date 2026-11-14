export type SettingFieldType =
  | 'text'
  | 'textarea'
  | 'phone'
  | 'url'
  | 'image'
  | 'lines'
  | 'color'
  | 'number'
  | 'boolean';

export interface SiteSetting {
  key: string;
  group_key: string;
  label: string;
  field_type: SettingFieldType;
  value: unknown;
  sort_order: number;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  location: 'header' | 'footer';
  sort_order: number;
  is_visible: boolean;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  hero_subtitle: string;
  hero_image_url: string;
  content: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  sort_order: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price_note: string;
  image_url: string;
  sort_order: number;
  is_visible: boolean;
}

export interface TrustBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  is_visible: boolean;
}

export interface Review {
  id: string;
  author_name: string;
  location_label: string;
  rating: number;
  body: string;
  sort_order: number;
  is_visible: boolean;
}

export const LEAD_STATUSES = ['New', 'Dispatched', 'Completed', 'Cancelled'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  id: string;
  driver_name: string;
  phone: string;
  truck_type: string;
  issue: string;
  location_text: string;
  latitude: number | null;
  longitude: number | null;
  maps_url: string;
  status: LeadStatus;
  dispatch_notes: string;
  created_at: string;
}
