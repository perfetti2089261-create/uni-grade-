'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

export const useUser = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
const supabase = getSupabase();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    setUser(data.user);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
    setUser(null);
  } finally {
    setLoading(false);
  }
};

getUser();

    // Listen for auth changes
    try {
      const supabaseSub = getSupabase();
      const { data: { subscription } } = supabaseSub.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null);
        }
      );

      return () => subscription?.unsubscribe();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('useUser subscription error:', err);
      return;
    }
  }, []);

  return { user, loading, error };
};
