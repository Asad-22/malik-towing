import { useState, type FormEvent } from 'react';
import { KeyRound, LoaderCircle, LogOut, ShieldCheck } from 'lucide-react';
import type { AdminAuth } from '@/admin/useAdminAccess';
import { inputClass, labelClass, primaryButtonClass } from '@/lib/uiClasses';

type Mode = 'signin' | 'setup';

export function AdminAuthScreen({ auth }: { auth: AdminAuth }) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const access = auth.state;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');

    if (mode === 'signin') {
      const message = await auth.signIn(email.trim(), password);
      if (message) setError(message);
      setBusy(false);
      return;
    }

    const message = await auth.signUp(email.trim(), password);
    if (message) {
      setError(message);
      setBusy(false);
      return;
    }
    const claimed = await auth.claimOwnerAccess();
    setBusy(false);
    if (!claimed) {
      await auth.signOut();
      setError('An owner account already exists. Switch to Sign in with that account.');
    }
  };

  const handleClaim = async () => {
    setBusy(true);
    setError('');
    setNotice('');
    const claimed = await auth.claimOwnerAccess();
    setBusy(false);
    if (!claimed) setNotice('An owner account already exists. Sign in with that account, or ask the owner for access.');
  };

  const signedInButNotAdmin = access.status === 'not_admin';

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy px-4 py-12">
      <div className="animate-fade-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="bg-brand-navy px-8 py-8 text-center text-white">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-brand-red shadow-lg">
            <ShieldCheck className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold uppercase tracking-tight">Malik Towing Admin</h1>
          <p className="mt-1 text-sm text-white/75">Owner dashboard</p>
        </div>
        <div className="flag-divider" />

        {signedInButNotAdmin ? (
          <div className="flex flex-col gap-5 p-8">
            <p className="text-slate-700">
              You are signed in as <span className="font-bold">{access.email}</span>, but this account does not have owner access.
            </p>
            <button type="button" onClick={handleClaim} disabled={busy} className={primaryButtonClass}>
              {busy && <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />}
              Claim owner access
            </button>
            <p className="text-sm text-slate-500">
              Claiming only works if no owner has been set up yet. Otherwise, sign in with the owner account.
            </p>
            {notice && <p className="text-sm font-semibold text-brand-red">{notice}</p>}
            <button
              type="button"
              onClick={() => void auth.signOut()}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
              {(['signin', 'setup'] as Mode[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setMode(option);
                    setError('');
                  }}
                  className={`rounded-md px-3 py-2 text-sm font-bold transition ${mode === option ? 'bg-white text-brand-navy shadow' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {option === 'signin' ? 'Sign in' : 'Owner setup'}
                </button>
              ))}
            </div>

            {mode === 'setup' && (
              <div className="rounded-lg border border-brand-navy/15 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                <p className="font-bold text-brand-navy">First-time setup</p>
                <p className="mt-1">
                  Create the owner account with your email and a strong password. The first account created becomes the owner.
                  After that, use Sign in only. Email confirmation must be turned off in your Supabase authentication settings.
                </p>
              </div>
            )}

            <div>
              <label htmlFor="admin-email" className={labelClass}>Email</label>
              <input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" />
            </div>
            <div>
              <label htmlFor="admin-password" className={labelClass}>Password</label>
              <input
                id="admin-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && <p className="text-sm font-semibold text-brand-red">{error}</p>}

            <button type="submit" disabled={busy} className={primaryButtonClass}>
              {busy ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <KeyRound className="h-5 w-5" aria-hidden="true" />}
              {mode === 'signin' ? 'Sign in' : 'Create owner account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
