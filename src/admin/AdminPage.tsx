import { useState } from 'react';
import {
  Award,
  Bell,
  FileText,
  Globe,
  LayoutList,
  LoaderCircle,
  LogOut,
  Palette,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react';
import { useAdminAccess } from '@/admin/useAdminAccess';
import { AdminAuthScreen } from '@/admin/AdminAuthScreen';
import { AdminLeads } from '@/admin/AdminLeads';
import { AdminSettings } from '@/admin/AdminSettings';
import { AdminCollection } from '@/admin/AdminCollection';
import { COLLECTIONS } from '@/admin/collectionConfigs';

type TabId = 'leads' | 'contact' | 'homepage' | 'branding' | 'navigation' | 'pages' | 'services' | 'trust' | 'reviews' | 'seo';

const TABS: { id: TabId; label: string; icon: typeof Bell }[] = [
  { id: 'leads', label: 'Leads & Dispatch', icon: Bell },
  { id: 'contact', label: 'Phones & Buttons', icon: Phone },
  { id: 'homepage', label: 'Homepage Text', icon: LayoutList },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'navigation', label: 'Navigation', icon: Globe },
  { id: 'pages', label: 'Pages', icon: FileText },
  { id: 'services', label: 'Services', icon: Truck },
  { id: 'trust', label: 'Trust Badges', icon: Award },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'seo', label: 'SEO', icon: Search },
];

const HOMEPAGE_GROUPS = [
  { key: 'emergency_bar', title: 'Top emergency bar' },
  { key: 'hero', title: 'Hero section' },
  { key: 'dispatch_form', title: 'Quick dispatch form' },
  { key: 'services', title: 'Services section' },
  { key: 'trust', title: 'Trust section' },
  { key: 'coverage', title: 'Service area and map' },
  { key: 'reviews', title: 'Reviews section' },
  { key: 'footer', title: 'Footer' },
];

const CONTACT_GROUPS = [
  { key: 'contact', title: 'Phone numbers, WhatsApp and hours' },
  { key: 'header', title: 'Header buttons' },
  { key: 'mobile_bar', title: 'Mobile action bar' },
];

const BRANDING_GROUPS = [{ key: 'branding', title: 'Logo, favicon and USA flag theme' }];
const SEO_GROUPS = [{ key: 'seo', title: 'Search results, social sharing and local schema' }];

function renderTab(tab: TabId) {
  switch (tab) {
    case 'leads':
      return <AdminLeads />;
    case 'contact':
      return <AdminSettings groups={CONTACT_GROUPS} />;
    case 'homepage':
      return <AdminSettings groups={HOMEPAGE_GROUPS} />;
    case 'branding':
      return <AdminSettings groups={BRANDING_GROUPS} />;
    case 'seo':
      return <AdminSettings groups={SEO_GROUPS} />;
    case 'navigation':
      return <AdminCollection config={COLLECTIONS.navigation} />;
    case 'pages':
      return <AdminCollection config={COLLECTIONS.pages} />;
    case 'services':
      return <AdminCollection config={COLLECTIONS.services} />;
    case 'trust':
      return <AdminCollection config={COLLECTIONS.trust} />;
    case 'reviews':
      return <AdminCollection config={COLLECTIONS.reviews} />;
  }
}

export function AdminPage() {
  const auth = useAdminAccess();
  const [tab, setTab] = useState<TabId>('leads');

  if (auth.state.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <LoaderCircle className="h-10 w-10 animate-spin text-brand-navy" aria-hidden="true" />
      </div>
    );
  }

  if (auth.state.status !== 'admin') return <AdminAuthScreen auth={auth} />;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-brand-navy text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-extrabold uppercase tracking-tight">Malik Towing Admin</p>
              <p className="text-xs text-white/70">{auth.state.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="rounded-md px-3 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white">
              View site
            </a>
            <button
              type="button"
              onClick={() => void auth.signOut()}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold transition hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
        <nav className="no-scrollbar overflow-x-auto border-t border-white/10">
          <div className="mx-auto flex max-w-7xl gap-1 px-4 py-2 lg:px-6">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={tab === id ? 'page' : undefined}
                className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${tab === id ? 'bg-white text-brand-navy' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-10">{renderTab(tab)}</main>
    </div>
  );
}
