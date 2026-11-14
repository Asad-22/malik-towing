import type { ReactNode } from 'react';
import type { Page } from '@/lib/types';
import { SiteHead } from '@/components/public/SiteHead';
import { EmergencyBar } from '@/components/public/EmergencyBar';
import { SiteHeader } from '@/components/public/SiteHeader';
import { SiteFooter } from '@/components/public/SiteFooter';
import { MobileActionBar } from '@/components/public/MobileActionBar';

export function PublicLayout({ page, children }: { page?: Page; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <SiteHead page={page} />
      <div className="sticky top-0 z-50">
        <EmergencyBar />
        <SiteHeader />
      </div>
      <main>{children}</main>
      <SiteFooter />
      <MobileActionBar />
    </div>
  );
}
