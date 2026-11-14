import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, LoaderCircle, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SiteSetting } from '@/lib/types';
import { primaryButtonClass } from '@/lib/uiClasses';
import { FieldInput } from '@/admin/fields/FieldInput';

interface SettingsGroup {
  key: string;
  title: string;
}

export function AdminSettings({ groups }: { groups: SettingsGroup[] }) {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [originals, setOriginals] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, unknown>>({});
  const [selected, setSelected] = useState(groups[0]?.key ?? '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data, error: queryError } = await supabase
      .from('site_settings')
      .select('key, group_key, label, field_type, value, sort_order')
      .in('group_key', groups.map((group) => group.key))
      .order('sort_order');
    setLoading(false);
    if (queryError) {
      setError(queryError.message);
      return;
    }
    const rows = (Array.isArray(data) ? data : []) as SiteSetting[];
    setSettings(rows);
    setOriginals(Object.fromEntries(rows.map((row) => [row.key, JSON.stringify(row.value)])));
    setDrafts(Object.fromEntries(rows.map((row) => [row.key, row.value])));
  }, [groups]);

  useEffect(() => {
    void load();
  }, [load]);

  const dirtyKeys = settings
    .filter((setting) => JSON.stringify(drafts[setting.key]) !== originals[setting.key])
    .map((setting) => setting.key);

  const save = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    const results = await Promise.all(
      dirtyKeys.map((key) =>
        supabase.from('site_settings').update({ value: drafts[key], updated_at: new Date().toISOString() }).eq('key', key),
      ),
    );
    setSaving(false);
    const failed = results.find((result) => result.error);
    if (failed?.error) {
      setError(failed.error.message);
      return;
    }
    setSaved(true);
    void load();
  };

  if (loading) {
    return <LoaderCircle className="mx-auto mt-16 h-8 w-8 animate-spin text-brand-navy" aria-hidden="true" />;
  }

  const activeGroup = groups.find((group) => group.key === selected) ?? groups[0];
  const activeSettings = settings.filter((setting) => setting.group_key === activeGroup?.key);

  return (
    <section className="flex flex-col gap-6 pb-28">
      {groups.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {groups.map((group) => (
            <button
              key={group.key}
              type="button"
              onClick={() => setSelected(group.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${selected === group.key ? 'bg-brand-navy text-white' : 'bg-white text-slate-700 shadow-sm hover:bg-slate-50'}`}
            >
              {group.title}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h1 className="mb-6 text-2xl font-extrabold text-brand-navy">{activeGroup?.title}</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {activeSettings.map((setting) => (
            <div key={setting.key} className={setting.field_type === 'textarea' || setting.field_type === 'lines' || setting.field_type === 'image' ? 'md:col-span-2' : ''}>
              <FieldInput
                id={`setting-${setting.key}`}
                kind={setting.field_type}
                label={setting.label}
                value={drafts[setting.key]}
                onChange={(value) => {
                  setSaved(false);
                  setDrafts((current) => ({ ...current, [setting.key]: value }));
                }}
                min={setting.field_type === 'number' ? (setting.key === 'map.zoom' ? 1 : undefined) : undefined}
                max={setting.key === 'map.zoom' ? 20 : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-6">
          <p className="text-sm font-semibold text-slate-600">
            {error && <span className="text-brand-red">{error}</span>}
            {!error && saved && (
              <span className="inline-flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Saved. Refresh the public site to see changes.
              </span>
            )}
            {!error && !saved && dirtyKeys.length > 0 && `${dirtyKeys.length} unsaved change(s)`}
          </p>
          <button type="button" onClick={() => void save()} disabled={saving || dirtyKeys.length === 0} className={primaryButtonClass}>
            {saving ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Save className="h-5 w-5" aria-hidden="true" />}
            Save changes
          </button>
        </div>
      </div>
    </section>
  );
}
