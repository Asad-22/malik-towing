import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LoaderCircle, RefreshCw } from 'lucide-react';
import { createSettingsReader, type SettingsReader } from '@/lib/settings';
import { fetchSiteContent, type SiteContent } from '@/lib/siteContent';

interface SiteContentValue extends Omit<SiteContent, 'settings'> {
  settings: SettingsReader;
}

const SiteContentContext = createContext<SiteContentValue | null>(null);

type LoadState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; content: SiteContent };

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    fetchSiteContent()
      .then((content) => {
        if (active) setState({ status: 'ready', content });
      })
      .catch(() => {
        if (active) setState({ status: 'error' });
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const value = useMemo<SiteContentValue | null>(() => {
    if (state.status !== 'ready') return null;
    const { settings, ...rest } = state.content;
    return { ...rest, settings: createSettingsReader(settings) };
  }, [state]);

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <LoaderCircle className="h-10 w-10 animate-spin text-brand-navy" aria-hidden="true" />
      </div>
    );
  }

  if (state.status === 'error' || !value) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <p className="text-lg font-semibold text-brand-navy">We could not load the website right now.</p>
        <button
          type="button"
          onClick={() => {
            setState({ status: 'loading' });
            setAttempt((count) => count + 1);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-5 py-3 font-semibold text-white transition hover:bg-brand-navy/90"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContentValue {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error('useSiteContent must be used inside SiteContentProvider');
  return context;
}
