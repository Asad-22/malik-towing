import type { FieldKind } from '@/admin/fields/FieldInput';

export interface CollectionField {
  key: string;
  kind: FieldKind;
  label: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface CollectionScope {
  column: string;
  options: { value: string; label: string }[];
}

export interface CollectionConfig {
  key: string;
  table: string;
  singular: string;
  intro: string;
  titleKey: string;
  subtitleKey?: string;
  visibilityKey: string;
  viewPathKey?: string;
  scope?: CollectionScope;
  fields: CollectionField[];
}

const SLUG_PATTERN = '^[a-z0-9]+(?:-[a-z0-9]+)*$';

export const COLLECTIONS: Record<'navigation' | 'pages' | 'services' | 'trust' | 'reviews', CollectionConfig> = {
  navigation: {
    key: 'navigation',
    table: 'navigation_links',
    singular: 'menu link',
    intro: 'Add, rename, reorder, or hide links in the header and footer menus.',
    titleKey: 'label',
    subtitleKey: 'href',
    visibilityKey: 'is_visible',
    scope: {
      column: 'location',
      options: [
        { value: 'header', label: 'Header menu' },
        { value: 'footer', label: 'Footer menu' },
      ],
    },
    fields: [
      { key: 'label', kind: 'text', label: 'Link text', required: true, maxLength: 40 },
      {
        key: 'href',
        kind: 'text',
        label: 'Link destination',
        required: true,
        maxLength: 200,
        hint: 'Use a section such as /#services, a custom page such as /about, or a full web address.',
      },
      { key: 'is_visible', kind: 'boolean', label: 'Show this link' },
    ],
  },
  pages: {
    key: 'pages',
    table: 'pages',
    singular: 'page',
    intro: 'Create custom pages. Published pages are live at /your-slug.',
    titleKey: 'title',
    subtitleKey: 'slug',
    visibilityKey: 'is_published',
    viewPathKey: 'slug',
    fields: [
      { key: 'title', kind: 'text', label: 'Page title', required: true, maxLength: 120 },
      {
        key: 'slug',
        kind: 'text',
        label: 'URL slug',
        required: true,
        maxLength: 60,
        pattern: SLUG_PATTERN,
        hint: 'Lowercase letters, numbers and hyphens only, e.g. heavy-towing.',
      },
      { key: 'hero_subtitle', kind: 'text', label: 'Hero subtitle', maxLength: 240 },
      { key: 'hero_image_url', kind: 'image', label: 'Hero banner image' },
      { key: 'content', kind: 'textarea', label: 'Page content', hint: 'Separate paragraphs with a blank line. Start a line with ## for a heading.' },
      { key: 'meta_title', kind: 'text', label: 'SEO title', maxLength: 70 },
      { key: 'meta_description', kind: 'textarea', label: 'SEO description', maxLength: 160 },
      { key: 'is_published', kind: 'boolean', label: 'Published (visible to visitors)' },
    ],
  },
  services: {
    key: 'services',
    table: 'services',
    singular: 'service',
    intro: 'Towing and roadside services shown as cards on the homepage.',
    titleKey: 'title',
    subtitleKey: 'price_note',
    visibilityKey: 'is_visible',
    fields: [
      { key: 'title', kind: 'text', label: 'Service name', required: true, maxLength: 80 },
      { key: 'description', kind: 'textarea', label: 'Description', maxLength: 400 },
      { key: 'icon', kind: 'icon', label: 'Icon' },
      { key: 'price_note', kind: 'text', label: 'Price note', maxLength: 120 },
      { key: 'image_url', kind: 'image', label: 'Optional photo' },
      { key: 'is_visible', kind: 'boolean', label: 'Show this service' },
    ],
  },
  trust: {
    key: 'trust',
    table: 'trust_badges',
    singular: 'trust badge',
    intro: 'Trust cards in the "Why Choose" section.',
    titleKey: 'title',
    subtitleKey: 'description',
    visibilityKey: 'is_visible',
    fields: [
      { key: 'title', kind: 'text', label: 'Badge title', required: true, maxLength: 80 },
      { key: 'description', kind: 'textarea', label: 'Description', maxLength: 240 },
      { key: 'icon', kind: 'icon', label: 'Icon' },
      { key: 'is_visible', kind: 'boolean', label: 'Show this badge' },
    ],
  },
  reviews: {
    key: 'reviews',
    table: 'reviews',
    singular: 'review',
    intro: 'Customer testimonials shown in the reviews section.',
    titleKey: 'author_name',
    subtitleKey: 'body',
    visibilityKey: 'is_visible',
    fields: [
      { key: 'author_name', kind: 'text', label: 'Customer name', required: true, maxLength: 80 },
      { key: 'location_label', kind: 'text', label: 'Location or role', maxLength: 80 },
      { key: 'rating', kind: 'number', label: 'Stars (1-5)', required: true, min: 1, max: 5 },
      { key: 'body', kind: 'textarea', label: 'Review', required: true, maxLength: 600 },
      { key: 'is_visible', kind: 'boolean', label: 'Show this review' },
    ],
  },
};
