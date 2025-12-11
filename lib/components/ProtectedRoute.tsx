'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/auth');
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => subscription?.unsubscribe();
  }, [router]);

  if (isAuthenticated === null) {
    return <div className="loading">Checking authentication...</div>;
  }

  return <>{children}</>;
};
