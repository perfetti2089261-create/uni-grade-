'use client';

import { useEffect, useState } from 'react';
import { ExamForm } from '@/lib/components/ExamForm';
import { GradeForm } from '@/lib/components/GradeForm';

interface Exam {
  id: string;
  name: string;
  course_code?: string;
  credits?: number;
}

export default function RegisterGrade() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewExamForm, setShowNewExamForm] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/exams');
      if (!response.ok) throw new Error('Failed to fetch exams');
      const data = await response.json();
      setExams(data);
      if (data.length > 0) setSelectedExam(data[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <main className="register-grade-page">
      <h1>Register a Grade</h1>

      {error && <p className="error">{error}</p>}

      <section className="form-section">
        {exams.length === 0 ? (
          <div className="no-exams">
            <p>You haven't added any exams yet.</p>
            <ExamForm onExamAdded={fetchExams} />
          </div>
        ) : (
          <>
            <div className="exam-selector">
              <label htmlFor="exam">Select Exam</label>
              <select
                id="exam"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
              >
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name} {exam.course_code ? `(${exam.course_code})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {selectedExam && (
              <GradeForm
                examId={selectedExam}
                onGradeAdded={() => {
                  // Could trigger a refresh or success message here
                }}
              />
            )}

            <button
              onClick={() => setShowNewExamForm(!showNewExamForm)}
              className="btn btn-secondary"
            >
              {showNewExamForm ? 'Cancel' : 'Add New Exam'}
            </button>

            {showNewExamForm && <ExamForm onExamAdded={fetchExams} />}
          </>
        )}
      </section>

      <a href="/dashboard" className="btn btn-secondary">
        Back to Dashboard
      </a>
    </main>
  );
}
