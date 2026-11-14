import { useState } from 'react';
import { ICON_NAMES, getIcon } from '@/lib/icons';
import { inputClass, labelClass } from '@/lib/uiClasses';
import { ImageUploadField } from '@/admin/fields/ImageUploadField';

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'phone'
  | 'url'
  | 'number'
  | 'lines'
  | 'color'
  | 'boolean'
  | 'image'
  | 'icon'
  | 'select';

export interface FieldOption {
  value: string;
  label: string;
}

interface FieldInputProps {
  id: string;
  kind: FieldKind;
  label: string;
  value: unknown;
  onChange: (value: unknown) => void;
  options?: FieldOption[];
  required?: boolean;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

function LinesField({ id, label, value, onChange }: Pick<FieldInputProps, 'id' | 'label' | 'value' | 'onChange'>) {
  const initial = Array.isArray(value) ? value.join('\n') : '';
  const [draft, setDraft] = useState(initial);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <textarea
        id={id}
        rows={4}
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          onChange(event.target.value.split('\n').map((line) => line.trim()).filter(Boolean));
        }}
        className={inputClass}
      />
    </div>
  );
}

export function FieldInput(props: FieldInputProps) {
  const { id, kind, label, value, onChange, options, required, maxLength, pattern, min, max } = props;
  const text = typeof value === 'string' ? value : '';

  if (kind === 'lines') return <LinesField id={id} label={label} value={value} onChange={onChange} />;

  if (kind === 'image') {
    return <ImageUploadField id={id} label={label} value={text} onChange={(url) => onChange(url)} />;
  }

  if (kind === 'boolean') {
    return (
      <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <input
          id={id}
          type="checkbox"
          checked={value === true}
          onChange={(event) => onChange(event.target.checked)}
          className="h-5 w-5 accent-brand-navy"
        />
      </label>
    );
  }

  if (kind === 'color') {
    return (
      <div>
        <label htmlFor={id} className={labelClass}>{label}</label>
        <div className="flex items-center gap-3">
          <input
            id={id}
            type="color"
            value={text || '#000000'}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            className="h-11 w-14 cursor-pointer rounded-md border border-slate-300 bg-white p-1"
          />
          <input
            aria-label={label}
            value={text}
            maxLength={7}
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    );
  }

  const field = (() => {
    if (kind === 'textarea') {
      return (
        <textarea
          id={id}
          rows={4}
          required={required}
          maxLength={maxLength}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      );
    }
    if (kind === 'number') {
      return (
        <input
          id={id}
          type="number"
          required={required}
          min={min}
          max={max}
          step="any"
          value={typeof value === 'number' ? value : ''}
          onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))}
          className={inputClass}
        />
      );
    }
    if (kind === 'select' || kind === 'icon') {
      const choices: FieldOption[] =
        kind === 'icon' ? ICON_NAMES.map((name) => ({ value: name, label: name })) : options ?? [];
      return (
        <div className="flex items-center gap-3">
          {kind === 'icon' && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white">
              {(() => {
                const Icon = getIcon(text);
                return <Icon className="h-5 w-5" aria-hidden="true" />;
              })()}
            </span>
          )}
          <select id={id} required={required} value={text} onChange={(event) => onChange(event.target.value)} className={inputClass}>
            {choices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return (
      <input
        id={id}
        type={kind === 'phone' ? 'tel' : kind === 'url' ? 'url' : 'text'}
        required={required}
        maxLength={maxLength}
        pattern={pattern}
        value={text}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    );
  })();

  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      {field}
    </div>
  );
}
