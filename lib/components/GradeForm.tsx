'use client';

import { useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

interface GradeFormProps {
  examId: string;
  onGradeAdded?: () => void;
}

export const GradeForm: React.FC<GradeFormProps> = ({ examId, onGradeAdded }) => {
  const [grade, setGrade] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Get session token
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch('/api/grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          examId,
          grade: parseFloat(grade),
          dateTaken: new Date(date).toISOString(),
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add grade');
      }

      setSuccess('Grade added successfully!');
      setGrade('');
      setDate('');
      setNotes('');
      onGradeAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grade-form">
      <div className="form-group">
        <label htmlFor="grade">Grade (0-30)</label>
        <input
          id="grade"
          type="number"
          min="0"
          max="30"
          step="0.5"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="date">Exam Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Grade'}
      </button>
    </form>
  );
};
