'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { GradeList } from '@/lib/components/GradeList';

interface Grade {
  id: string;
  grade: number;
  date_taken: string;
  notes?: string;
  exams?: {
    name: string;
    course_code?: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth');
          return;
        }
        await fetchGrades();
      } catch (err) {
        // If Supabase is not configured or an error occurs, surface it and stop loading
        // eslint-disable-next-line no-console
        console.error('checkAuthAndFetch error:', err);
        setError(err instanceof Error ? err.message : 'Authentication error');
      } finally {
        setLoading(false);
      }
    };
    checkAuthAndFetch();
  }, [router]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch('/api/grades', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch grades');
      const data = await response.json();
      setGrades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>
      
      <div className="dashboard-navigation">
        <a href="/register-grade" className="btn btn-secondary">
          Add New Grade
        </a>
        <a href="/predictions" className="btn btn-secondary">
          View Predictions
        </a>
        <a href="/study-planner" className="btn btn-secondary">
          Study Planner
        </a>
      </div>

      {error && <p className="error">{error}</p>}
      
      <section className="grades-section">
        <h2>Your Grades</h2>
        <GradeList grades={grades} />
      </section>
    </main>
  );
}
