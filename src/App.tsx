import { SiteContentProvider } from '@/context/SiteContentContext';
import { usePathname } from '@/lib/router';
import { PublicRoutes } from '@/pages/PublicRoutes';
import { AdminPage } from '@/admin/AdminPage';

export default function App() {
  const pathname = usePathname();

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return <AdminPage />;
  }

  return (
    <SiteContentProvider>
      <PublicRoutes />
    </SiteContentProvider>
  );
}
