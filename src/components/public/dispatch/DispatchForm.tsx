import { useState, type FormEvent } from 'react';
import { CheckCircle2, LoaderCircle, MapPin } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import { useGpsLocation } from '@/hooks/useGpsLocation';
import { supabase } from '@/lib/supabase';
import { mapsHref } from '@/lib/contact';
import { inputClass, labelClass, primaryButtonClass } from '@/lib/uiClasses';

export interface SubmittedLead {
  driverName: string;
}

interface DispatchFormProps {
  onSubmitted: (lead: SubmittedLead) => void;
}

export function DispatchForm({ onSubmitted }: DispatchFormProps) {
  const { settings } = useSiteContent();
  const { state: gps, request: requestGps } = useGpsLocation();
  const vehicleOptions = settings.list('form.vehicle_options');
  const [driverName, setDriverName] = useState('');
  const [phone, setPhone] = useState('');
  const [truckType, setTruckType] = useState('');
  const [issue, setIssue] = useState('');
  const [locationText, setLocationText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const hasGps = gps.status === 'ready';
    const payload = {
      driver_name: driverName.trim(),
      phone: phone.trim(),
      truck_type: truckType || vehicleOptions[0] || '',
      issue: issue.trim(),
      location_text: locationText.trim(),
      latitude: hasGps ? gps.latitude : null,
      longitude: hasGps ? gps.longitude : null,
      maps_url: hasGps ? mapsHref(gps.latitude, gps.longitude) : '',
    };

    const { error } = await supabase.from('leads').insert(payload);
    setSubmitting(false);

    if (error) {
      setErrorMessage(settings.text('form.submit_error'));
      return;
    }
    onSubmitted({ driverName: payload.driver_name });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="lead-name" className={labelClass}>{settings.text('form.name_label')}</label>
        <input
          id="lead-name"
          required
          maxLength={120}
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          className={inputClass}
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="lead-phone" className={labelClass}>{settings.text('form.phone_label')}</label>
        <input
          id="lead-phone"
          type="tel"
          required
          minLength={7}
          maxLength={30}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
          autoComplete="tel"
        />
      </div>

      <div>
        <label htmlFor="lead-truck" className={labelClass}>{settings.text('form.truck_label')}</label>
        <select
          id="lead-truck"
          required
          value={truckType || vehicleOptions[0] || ''}
          onChange={(e) => setTruckType(e.target.value)}
          className={inputClass}
        >
          {vehicleOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="lead-issue" className={labelClass}>{settings.text('form.issue_label')}</label>
        <textarea
          id="lead-issue"
          required
          rows={3}
          maxLength={1000}
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="lead-location" className={labelClass}>{settings.text('form.location_label')}</label>
        <input
          id="lead-location"
          maxLength={300}
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-dashed border-brand-navy/30 bg-slate-50 p-4">
        <button
          type="button"
          onClick={requestGps}
          disabled={gps.status === 'loading'}
          className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-brand-navy px-5 py-3 font-bold text-brand-navy transition hover:bg-brand-navy hover:text-white disabled:opacity-60"
        >
          {gps.status === 'loading' ? (
            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <MapPin className="h-5 w-5" aria-hidden="true" />
          )}
          {settings.text('form.gps_button_label')}
        </button>
        {gps.status === 'ready' && (
          <p className="animate-fade-up flex items-start gap-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {settings.text('form.gps_success')}
          </p>
        )}
        {gps.status === 'error' && (
          <p className="text-sm font-semibold text-brand-red">{settings.text('form.gps_error')}</p>
        )}
      </div>

      {errorMessage && <p className="text-sm font-semibold text-brand-red">{errorMessage}</p>}

      <button type="submit" disabled={submitting} className={`${primaryButtonClass} w-full py-4 text-lg uppercase tracking-wide`}>
        {submitting && <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />}
        {settings.text('form.submit_label')}
      </button>
    </form>
  );
}
