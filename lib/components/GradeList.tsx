'use client';

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

interface GradeListProps {
  grades: Grade[];
  onGradeDeleted?: (id: string) => void;
}

export const GradeList: React.FC<GradeListProps> = ({ grades, onGradeDeleted }) => {
  const calculateMean = (grades: Grade[]) => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, g) => acc + g.grade, 0);
    return (sum / grades.length).toFixed(2);
  };

  return (
    <div className="grade-list">
      <div className="mean-display">
        <h3>Mean Grade: <span className="mean-value">{calculateMean(grades)}</span>/30</h3>
      </div>

      {grades.length === 0 ? (
        <p className="empty-state">No grades recorded yet.</p>
      ) : (
        <ul>
          {grades.map((grade) => (
            <li key={grade.id} className="grade-card">
              <div className="grade-header">
                <h4>{grade.exams?.name}</h4>
                {grade.exams?.course_code && (
                  <span className="course-code">{grade.exams.course_code}</span>
                )}
              </div>
              <div className="grade-value">{grade.grade.toFixed(2)}</div>
              <div className="grade-date">
                {new Date(grade.date_taken).toLocaleDateString()}
              </div>
              {grade.notes && <div className="grade-notes">{grade.notes}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
