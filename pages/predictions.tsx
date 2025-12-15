'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { PredictionList } from '@/lib/components/PredictionList';

interface Prediction {
  id: string;
  predicted_grade: number;
  confidence_score: number;
  calculation_date: string;
  exams?: {
    name: string;
  };
}

export default function Predictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch('/api/predictions', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch predictions');
      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateNewPrediction = async () => {
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ examId: null }),
      });

      if (!response.ok) throw new Error('Failed to generate prediction');
      await fetchPredictions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <main className="predictions-page">
      <h1>Future Exam Predictions</h1>

      {error && <p className="error">{error}</p>}

      <div className="predictions-actions">
        <button onClick={generateNewPrediction} className="btn btn-primary">
          Generate New Prediction
        </button>
      </div>

      <section className="predictions-section">
        <h2>Your Predictions</h2>
        <PredictionList predictions={predictions} />
      </section>

      <a href="/dashboard" className="btn btn-secondary">
        Back to Dashboard
      </a>
    </main>
  );
}
