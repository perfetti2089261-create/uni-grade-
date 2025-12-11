'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Calendar from '@/lib/components/Calendar';

interface Session {
  id: string;
  session_date: string;
  notes?: string;
  exams?: {
    name?: string;
  };
}

export default function StudyPlanner() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNotes, setNewNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession?.access_token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const res = await fetch('/api/study-sessions', {
        headers: {
          'Authorization': `Bearer ${authSession.access_token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const onAddDate = (iso: string) => {
    setSelectedDate(iso);
    setNewNotes('');
  };

  const createSession = async () => {
    if (!selectedDate) return;
    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession?.access_token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const res = await fetch('/api/study-sessions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authSession.access_token}`,
        },
        body: JSON.stringify({ examId: null, sessionDate: selectedDate, notes: newNotes }),
      });
      if (!res.ok) throw new Error('Failed to create session');
      await fetchSessions();
      setSelectedDate(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <main className="study-planner-page">
      <h1>Study Planner</h1>
      <p>Plan study sessions and mark future exam dates.</p>

      <Calendar sessions={sessions} onAdd={onAddDate} />

      {selectedDate && (
        <form className="session-form" onSubmit={(e) => { e.preventDefault(); createSession(); }}>
          <h3>New Session: {new Date(selectedDate).toLocaleString()}</h3>
          <div className="form-group">
            <label>Notes</label>
            <textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} rows={3} />
          </div>
          <button type="submit" className="btn btn-primary">Save Session</button>
          <button type="button" className="btn btn-secondary" onClick={() => setSelectedDate(null)}>Cancel</button>
        </form>
      )}

      <section className="upcoming-sessions">
        <h2>Upcoming Sessions</h2>
        {sessions.length === 0 ? (
          <div className="empty-state">No sessions planned.</div>
        ) : (
          <ul>
            {sessions.map(s => (
              <li key={s.id} className="grade-card">
                <div>
                  <strong>{s.exams?.name || 'Study Session'}</strong>
                  <div className="grade-date">{new Date(s.session_date).toLocaleString()}</div>
                  {s.notes && <div className="grade-notes">{s.notes}</div>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
