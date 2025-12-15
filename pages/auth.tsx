'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { AuthForm } from '@/lib/components/AuthForm';

export default function Auth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/dashboard');
        }
      } catch (err) {
        // Log and continue to show auth form if Supabase isn't available
        // eslint-disable-next-line no-console
        console.error('auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>UniGrade</h1>
          <p>Track your grades and predict your future exams</p>
        </div>

        <AuthForm
          onSuccess={() => {
            router.push('/dashboard');
          }}
        />
      </div>
    </main>
  );
}
