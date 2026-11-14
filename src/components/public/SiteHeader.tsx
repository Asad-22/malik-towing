import { useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import { Link } from '@/lib/router';
import { telHref } from '@/lib/contact';
import { BrandLogo } from '@/components/public/BrandLogo';

export function SiteHeader() {
  const { navLinks, settings } = useSiteContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerLinks = navLinks.filter((link) => link.location === 'header');
  const phone = settings.text('contact.phone_primary');

  return (
    <header className="border-b border-white/10 bg-brand-navy text-white shadow-lg shadow-brand-navy/20">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
        <Link href="/" className="flex items-center rounded-md transition hover:opacity-90">
          <BrandLogo variant="header" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {headerLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {phone && (
            <a
              href={telHref(phone)}
              className="hidden items-center gap-2 rounded-md bg-brand-red px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-red/90 sm:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {settings.text('header.call_label')}
            </a>
          )}
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-md p-2 transition hover:bg-white/10 lg:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="animate-fade-up border-t border-white/10 bg-brand-navy lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {headerLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
