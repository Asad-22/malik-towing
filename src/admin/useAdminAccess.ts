import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type AccessState =
  | { status: 'loading' }
  | { status: 'signed_out' }
  | { status: 'not_admin'; email: string }
  | { status: 'admin'; email: string };

export function useAdminAccess() {
  const [state, setState] = useState<AccessState>({ status: 'loading' });

  const resolve = useCallback(async (session: Session | null) => {
    if (!session) {
      setState({ status: 'signed_out' });
      return;
    }
    const email = session.user.email ?? '';
    const { data, error } = await supabase.rpc('is_admin');
    setState(!error && data === true ? { status: 'admin', email } : { status: 'not_admin', email });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => resolve(data.session));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        await resolve(session);
      })();
    });
    return () => subscription.subscription.unsubscribe();
  }, [resolve]);

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };

  const signUp = async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (!data.session) {
      const retry = await supabase.auth.signInWithPassword({ email, password });
      if (retry.error) return retry.error.message;
    }
    return null;
  };

  const claimOwnerAccess = async (): Promise<boolean> => {
    const { data, error } = await supabase.rpc('claim_admin');
    if (error || data !== true) return false;
    const session = await supabase.auth.getSession();
    await resolve(session.data.session);
    return true;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { state, signIn, signUp, claimOwnerAccess, signOut };
}

export type AdminAuth = ReturnType<typeof useAdminAccess>;
