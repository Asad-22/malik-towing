import { useCallback, useEffect, useMemo, useState } from 'react';
import { Clock, ExternalLink, LoaderCircle, MapPin, NotebookPen, Phone, Radio, Truck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { telHref } from '@/lib/contact';
import { LEAD_STATUSES, type Lead, type LeadStatus } from '@/lib/types';
import { inputClass, labelClass, primaryButtonClass } from '@/lib/uiClasses';
import { Dialog } from '@/admin/Dialog';

const STATUS_STYLES: Record<LeadStatus, string> = {
  New: 'bg-brand-red text-white',
  Dispatched: 'bg-brand-navy text-white',
  Completed: 'bg-emerald-600 text-white',
  Cancelled: 'bg-slate-300 text-slate-800',
};

function formatTimestamp(value: string): string {
  return new Date(value).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<LeadStatus | 'All'>('All');
  const [notesLead, setNotesLead] = useState<Lead | null>(null);

  const loadLeads = useCallback(async () => {
    const { data, error: queryError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(300);
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
    setLeads(data as Lead[]);
  }, []);

  useEffect(() => {
    void loadLeads();
    const channel = supabase
      .channel('admin-leads')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        setLeads((current) => [payload.new as Lead, ...current]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, (payload) => {
        setLeads((current) => current.map((lead) => (lead.id === (payload.new as Lead).id ? (payload.new as Lead) : lead)));
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadLeads]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: leads.length };
    for (const status of LEAD_STATUSES) result[status] = leads.filter((lead) => lead.status === status).length;
    return result;
  }, [leads]);

  const visibleLeads = filter === 'All' ? leads : leads.filter((lead) => lead.status === filter);

  const updateStatus = async (lead: Lead, status: LeadStatus) => {
    const previous = lead.status;
    setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, status } : item)));
    const { error: updateError } = await supabase.from('leads').update({ status }).eq('id', lead.id);
    if (updateError) {
      setError(updateError.message);
      setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, status: previous } : item)));
    }
  };

  if (loading) {
    return <LoaderCircle className="mx-auto mt-16 h-8 w-8 animate-spin text-brand-navy" aria-hidden="true" />;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-brand-navy">
            <Radio className="h-6 w-6 animate-pulse text-brand-red" aria-hidden="true" />
            Live tow requests
          </h1>
          <p className="mt-1 text-slate-600">New requests appear here instantly.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['All', ...LEAD_STATUSES] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${filter === status ? 'bg-brand-navy text-white' : 'bg-white text-slate-700 shadow-sm hover:bg-slate-50'}`}
            >
              {status} ({counts[status] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-brand-red">{error}</p>}

      {visibleLeads.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">
          <Truck className="mx-auto mb-3 h-10 w-10 text-slate-300" aria-hidden="true" />
          No requests in this view yet.
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {visibleLeads.map((lead) => (
          <article key={lead.id} className="animate-fade-up flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-brand-navy">{lead.driver_name}</h2>
                <p className="text-sm text-slate-500">
                  <Clock className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
                  {formatTimestamp(lead.created_at)}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[lead.status]}`}>
                {lead.status}
              </span>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <a href={telHref(lead.phone)} className="inline-flex items-center gap-2 font-bold text-brand-navy hover:underline">
                <Phone className="h-4 w-4 text-brand-red" aria-hidden="true" />
                {lead.phone}
              </a>
              <p className="inline-flex items-center gap-2 text-slate-700">
                <Truck className="h-4 w-4 text-brand-red" aria-hidden="true" />
                {lead.truck_type}
              </p>
              {lead.location_text && (
                <p className="inline-flex items-center gap-2 text-slate-700 sm:col-span-2">
                  <MapPin className="h-4 w-4 shrink-0 text-brand-red" aria-hidden="true" />
                  {lead.location_text}
                </p>
              )}
              {lead.maps_url && (
                <a
                  href={lead.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-brand-red hover:underline sm:col-span-2"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Open GPS location in Google Maps
                </a>
              )}
            </div>

            <p className="rounded-lg bg-slate-50 p-3 text-slate-800">{lead.issue}</p>

            {lead.dispatch_notes && (
              <p className="whitespace-pre-line rounded-lg border-l-4 border-brand-navy bg-slate-50 p-3 text-sm text-slate-700">
                {lead.dispatch_notes}
              </p>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
              <select
                aria-label="Request status"
                value={lead.status}
                onChange={(event) => void updateStatus(lead, event.target.value as LeadStatus)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800"
              >
                {LEAD_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setNotesLead(lead)}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <NotebookPen className="h-4 w-4" aria-hidden="true" />
                Dispatch notes
              </button>
            </div>
          </article>
        ))}
      </div>

      {notesLead && (
        <NotesDialog
          lead={notesLead}
          onClose={() => setNotesLead(null)}
          onSaved={(notes) => {
            setLeads((current) => current.map((item) => (item.id === notesLead.id ? { ...item, dispatch_notes: notes } : item)));
            setNotesLead(null);
          }}
        />
      )}
    </section>
  );
}

function NotesDialog({ lead, onClose, onSaved }: { lead: Lead; onClose: () => void; onSaved: (notes: string) => void }) {
  const [notes, setNotes] = useState(lead.dispatch_notes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setSaving(true);
    setError('');
    const { error: updateError } = await supabase.from('leads').update({ dispatch_notes: notes }).eq('id', lead.id);
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    onSaved(notes);
  };

  return (
    <Dialog title={`Dispatch notes: ${lead.driver_name}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="dispatch-notes" className={labelClass}>Internal notes (not shown to customers)</label>
          <textarea id="dispatch-notes" rows={6} maxLength={5000} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} />
        </div>
        {error && <p className="text-sm font-semibold text-brand-red">{error}</p>}
        <button type="button" onClick={() => void save()} disabled={saving} className={primaryButtonClass}>
          {saving && <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />}
          Save notes
        </button>
      </div>
    </Dialog>
  );
}
