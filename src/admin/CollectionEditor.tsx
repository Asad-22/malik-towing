import { useState, type FormEvent } from 'react';
import { LoaderCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { primaryButtonClass } from '@/lib/uiClasses';
import { Dialog } from '@/admin/Dialog';
import { FieldInput } from '@/admin/fields/FieldInput';
import type { CollectionConfig } from '@/admin/collectionConfigs';

export type CollectionItem = { id: string; sort_order: number } & Record<string, unknown>;

interface CollectionEditorProps {
  config: CollectionConfig;
  item: CollectionItem | null;
  scopeValue: string;
  nextSortOrder: number;
  onClose: () => void;
  onChanged: () => void;
}

export function CollectionEditor({ config, item, scopeValue, nextSortOrder, onClose, onChanged }: CollectionEditorProps) {
  const [draft, setDraft] = useState<Record<string, unknown>>(() =>
    Object.fromEntries(config.fields.map((field) => [field.key, item ? item[field.key] : defaultValue(field.kind)])),
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState('');

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload: Record<string, unknown> = { ...draft };
    if (item) {
      const { error: updateError } = await supabase.from(config.table).update(payload).eq('id', item.id);
      setSaving(false);
      if (updateError) {
        setError(updateError.message);
        return;
      }
    } else {
      const scopePart = config.scope ? { [config.scope.column]: scopeValue } : {};
      const { error: insertError } = await supabase
        .from(config.table)
        .insert({ ...payload, ...scopePart, sort_order: nextSortOrder });
      setSaving(false);
      if (insertError) {
        setError(insertError.message);
        return;
      }
    }
    onChanged();
    onClose();
  };

  const remove = async () => {
    if (!item) return;
    setDeleting(true);
    setError('');
    const { error: deleteError } = await supabase.from(config.table).delete().eq('id', item.id);
    setDeleting(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    onChanged();
    onClose();
  };

  const title = item ? `Edit ${config.singular}` : `New ${config.singular}`;

  return (
    <Dialog title={title} onClose={onClose} wide>
      <form onSubmit={save} className="flex flex-col gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          {config.fields.map((field) => {
            const spanTwo = field.kind === 'textarea' || field.kind === 'image';
            return (
              <div key={field.key} className={spanTwo ? 'md:col-span-2' : ''}>
                <FieldInput
                  id={`${config.key}-${field.key}`}
                  kind={field.kind}
                  label={field.label}
                  value={draft[field.key]}
                  required={field.required}
                  maxLength={field.maxLength}
                  pattern={field.pattern}
                  min={field.min}
                  max={field.max}
                  onChange={(value) => setDraft((current) => ({ ...current, [field.key]: value }))}
                />
                {field.hint && <p className="mt-1.5 text-xs text-slate-500">{field.hint}</p>}
              </div>
            );
          })}
        </div>

        {error && <p className="text-sm font-semibold text-brand-red">{error}</p>}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
          {item ? (
            confirmingDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">Delete permanently?</span>
                <button
                  type="button"
                  onClick={() => void remove()}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 rounded-md bg-brand-red px-3 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
                >
                  {deleting && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  Yes, delete
                </button>
                <button type="button" onClick={() => setConfirmingDelete(false)} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                  Keep
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-brand-red transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </button>
            )
          ) : (
            <span />
          )}
          <button type="submit" disabled={saving} className={primaryButtonClass}>
            {saving && <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />}
            {item ? 'Save changes' : `Add ${config.singular}`}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

function defaultValue(kind: CollectionConfig['fields'][number]['kind']): unknown {
  if (kind === 'boolean') return true;
  if (kind === 'number') return 5;
  if (kind === 'icon') return 'Truck';
  return '';
}
