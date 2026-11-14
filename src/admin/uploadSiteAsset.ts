import { supabase } from '@/lib/supabase';

const BUCKET = 'site-assets';
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/gif'];

export type UploadResult = { url: string } | { error: string };

export async function uploadSiteAsset(file: File): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) return { error: 'Please choose a PNG, JPG, WEBP, SVG, GIF or ICO image.' };
  if (file.size > MAX_BYTES) return { error: 'Images must be 5 MB or smaller.' };

  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
    cacheControl: '3600',
  });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
