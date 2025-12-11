'use client';

import { useEffect, useState } from 'react';
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
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/grades');
      if (!response.ok) throw new Error('Failed to fetch grades');
      const data = await response.json();
      setGrades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <main className="dashboard-page">
      <h1>Dashboard</h1>
      
      <div className="dashboard-navigation">
        <a href="/register-grade" className="btn btn-secondary">
          Add New Grade
        </a>
        <a href="/predictions" className="btn btn-secondary">
          View Predictions
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
