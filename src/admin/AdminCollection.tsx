import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, Eye, EyeOff, LoaderCircle, Pencil, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { primaryButtonClass } from '@/lib/uiClasses';
import type { CollectionConfig } from '@/admin/collectionConfigs';
import { CollectionEditor, type CollectionItem } from '@/admin/CollectionEditor';

export function AdminCollection({ config }: { config: CollectionConfig }) {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scopeValue, setScopeValue] = useState(config.scope?.options[0]?.value ?? '');
  const [editing, setEditing] = useState<CollectionItem | 'new' | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase.from(config.table).select('*').order('sort_order').order('created_at');
    if (config.scope) query = query.eq(config.scope.column, scopeValue);
    const { data, error: queryError } = await query;
    setLoading(false);
    if (queryError) {
      setError(queryError.message);
      return;
    }
    if (!Array.isArray(data)) {
      setError('Unexpected response from the server.');
      return;
    }
    setError('');
    setItems(data as CollectionItem[]);
  }, [config, scopeValue]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleVisibility = async (item: CollectionItem) => {
    const next = item[config.visibilityKey] !== true;
    setItems((current) => current.map((row) => (row.id === item.id ? { ...row, [config.visibilityKey]: next } : row)));
    const { error: updateError } = await supabase.from(config.table).update({ [config.visibilityKey]: next }).eq('id', item.id);
    if (updateError) {
      setError(updateError.message);
      void load();
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const withOrder = reordered.map((row, position) => ({ ...row, sort_order: position }));
    const changed = withOrder.filter((row) => items.find((original) => original.id === row.id)?.sort_order !== row.sort_order);
    setItems(withOrder);
    const results = await Promise.all(
      changed.map((row) => supabase.from(config.table).update({ sort_order: row.sort_order }).eq('id', row.id)),
    );
    const failed = results.find((result) => result.error);
    if (failed?.error) {
      setError(failed.error.message);
      void load();
    }
  };

  const nextSortOrder = items.reduce((max, row) => Math.max(max, row.sort_order), -1) + 1;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold capitalize text-brand-navy">{config.singular}s</h1>
          <p className="mt-1 text-slate-600">{config.intro}</p>
        </div>
        <button type="button" onClick={() => setEditing('new')} className={primaryButtonClass}>
          <Plus className="h-5 w-5" aria-hidden="true" />
          Add {config.singular}
        </button>
      </div>

      {config.scope && (
        <div className="flex gap-2 rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200 sm:w-fit">
          {config.scope.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setScopeValue(option.value)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition sm:flex-none ${scopeValue === option.value ? 'bg-brand-navy text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-brand-red">{error}</p>}

      {loading ? (
        <LoaderCircle className="mx-auto mt-10 h-8 w-8 animate-spin text-brand-navy" aria-hidden="true" />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center text-slate-500">
          No {config.singular}s yet. Use the button above to add one.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item, index) => {
            const visible = item[config.visibilityKey] === true;
            const title = String(item[config.titleKey] ?? '');
            const subtitle = config.subtitleKey ? String(item[config.subtitleKey] ?? '') : '';
            const viewPath = config.viewPathKey ? `/${String(item[config.viewPathKey] ?? '')}` : '';
            return (
              <li
                key={item.id}
                className="animate-fade-up flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate font-bold text-brand-navy">{title || 'Untitled'}</p>
                  {subtitle && <p className="line-clamp-2 text-sm text-slate-600">{subtitle}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void toggleVisibility(item)}
                    aria-pressed={visible}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${visible ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                  >
                    {visible ? <Eye className="h-3.5 w-3.5" aria-hidden="true" /> : <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />}
                    {visible ? config.visibilityKey === 'is_published' ? 'Published' : 'Shown' : config.visibilityKey === 'is_published' ? 'Draft' : 'Hidden'}
                  </button>
                  {viewPath && visible && (
                    <a href={viewPath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      View
                    </a>
                  )}
                  <div className="flex items-center rounded-md ring-1 ring-slate-200">
                    <button
                      type="button"
                      onClick={() => void move(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${title} up`}
                      className="p-2 text-slate-600 transition hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowUp className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void move(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label={`Move ${title} down`}
                      className="p-2 text-slate-600 transition hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing(item)}
                    className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-brand-navy transition hover:bg-slate-200"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Edit
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <CollectionEditor
          config={config}
          item={editing === 'new' ? null : editing}
          scopeValue={scopeValue}
          nextSortOrder={nextSortOrder}
          onClose={() => setEditing(null)}
          onChanged={() => void load()}
        />
      )}
    </section>
  );
}
