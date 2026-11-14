import { useState } from 'react';
import { ImageIcon, LoaderCircle, Upload } from 'lucide-react';
import { inputClass, labelClass } from '@/lib/uiClasses';
import { uploadSiteAsset } from '@/admin/uploadSiteAsset';

interface ImageUploadFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploadField({ id, label, value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setUploading(true);
    const result = await uploadSiteAsset(file);
    setUploading(false);
    if ('error' in result) {
      setError(result.error);
      return;
    }
    onChange(result.url);
  };

  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-contain p-2" />
          ) : (
            <ImageIcon className="h-6 w-6 text-slate-400" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <input id={id} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} placeholder="https://" />
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-navy/90">
              {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
              Upload image
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploading}
                onChange={(event) => {
                  void handleFile(event.target.files?.[0]);
                  event.target.value = '';
                }}
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Remove
              </button>
            )}
          </div>
          {error && <p className="text-sm font-semibold text-brand-red">{error}</p>}
        </div>
      </div>
    </div>
  );
}
