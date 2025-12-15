'use client';

import { useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

interface Props {
  onAdded?: () => void;
}

export const QuickAddExamGrade: React.FC<Props> = ({ onAdded }) => {
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('');
  const [grade, setGrade] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get session token
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const token = session.access_token;

      // 1) create exam
      const examRes = await fetch('/api/exams', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, courseCode: '', credits: credits ? parseInt(credits) : null }),
      });

      if (!examRes.ok) throw new Error('Failed to create exam');
      const exam = await examRes.json();

      // 2) create grade for the newly created exam
      const gradeRes = await fetch('/api/grades', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          examId: exam.id,
          grade: parseFloat(grade),
          dateTaken: date ? new Date(date).toISOString() : new Date().toISOString(),
          notes,
        }),
      });

      if (!gradeRes.ok) throw new Error('Failed to create grade');

      setName('');
      setCredits('');
      setGrade('');
      setDate('');
      setNotes('');
      onAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="quick-add-form">
      <h3>Quick Add: Exam + Grade</h3>

      <div className="form-group">
        <label htmlFor="q-name">Subject Name</label>
        <input id="q-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="form-group">
        <label htmlFor="q-credits">Credits</label>
        <input id="q-credits" type="number" min={0} value={credits} onChange={(e) => setCredits(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="q-grade">Grade (0-30)</label>
        <input id="q-grade" type="number" step="0.5" min={0} max={30} value={grade} onChange={(e) => setGrade(e.target.value)} required />
      </div>

      <div className="form-group">
        <label htmlFor="q-date">Exam Date</label>
        <input id="q-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="q-notes">Notes</label>
        <textarea id="q-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add Exam & Grade'}</button>
    </form>
  );
};

export default QuickAddExamGrade;
