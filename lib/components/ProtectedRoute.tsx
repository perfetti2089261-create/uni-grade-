'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabaseClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth');
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        // If Supabase isn't configured, redirect to auth to avoid hanging
        // eslint-disable-next-line no-console
        console.error('ProtectedRoute check error:', err);
        router.push('/auth');
      }
    };

    checkAuth();

    try {
      const supabase = getSupabase();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!session) {
          router.push('/auth');
        } else {
          setIsAuthenticated(true);
        }
      });

      return () => subscription?.unsubscribe();
    } catch (err) {
      // If subscription couldn't be created, just redirect to auth
      // eslint-disable-next-line no-console
      console.error('ProtectedRoute subscription error:', err);
      router.push('/auth');
    }
  }, [router]);

  if (isAuthenticated === null) {
    return <div className="loading">Checking authentication...</div>;
  }

  return <>{children}</>;
};
