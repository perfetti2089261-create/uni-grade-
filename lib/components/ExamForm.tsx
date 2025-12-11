'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ExamFormProps {
  onExamAdded?: () => void;
}

export const ExamForm: React.FC<ExamFormProps> = ({ onExamAdded }) => {
  const [name, setName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [credits, setCredits] = useState('');
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name,
          courseCode,
          credits: credits ? parseInt(credits) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add exam');
      }

      setSuccess('Exam added successfully!');
      setName('');
      setCourseCode('');
      setCredits('');
      onExamAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="exam-form">
      <div className="form-group">
        <label htmlFor="name">Exam Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Advanced Mathematics"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="courseCode">Course Code (optional)</label>
        <input
          id="courseCode"
          type="text"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          placeholder="e.g., MAT101"
        />
      </div>

      <div className="form-group">
        <label htmlFor="credits">Credits (optional)</label>
        <input
          id="credits"
          type="number"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          placeholder="e.g., 6"
          min="1"
          max="20"
        />
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Exam'}
      </button>
    </form>
  );
};
