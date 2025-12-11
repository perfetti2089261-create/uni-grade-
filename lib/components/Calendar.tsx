'use client';

import React, { useMemo, useState } from 'react';

interface Session {
  id: string;
  session_date: string;
  notes?: string;
  exams?: { name?: string };
}

interface Props {
  sessions: Session[];
  onAdd?: (date: string) => void;
}

const WEEK_DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }

export const Calendar: React.FC<Props> = ({ sessions, onAdd }) => {
  const [current, setCurrent] = useState(() => new Date());

  const monthMatrix = useMemo(() => {
    const start = startOfMonth(current);
    const end = endOfMonth(current);
    const startDay = start.getDay();
    const daysInMonth = end.getDate();
    const matrix: (number | null)[][] = [];
    let week: (number | null)[] = Array(startDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d);
      if (week.length === 7) { matrix.push(week); week = []; }
    }
    if (week.length) {
      while (week.length < 7) week.push(null);
      matrix.push(week);
    }
    return matrix;
  }, [current]);

  const sessionsByDay = useMemo(() => {
    const map = new Map<number, Session[]>();
    sessions.forEach(s => {
      const d = new Date(s.session_date);
      if (d.getMonth() === current.getMonth() && d.getFullYear() === current.getFullYear()) {
        const day = d.getDate();
        const arr = map.get(day) || [];
        arr.push(s);
        map.set(day, arr);
      }
    });
    return map;
  }, [sessions, current]);

  const prevMonth = () => setCurrent(c => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(c => new Date(c.getFullYear(), c.getMonth() + 1, 1));

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth} className="btn btn-secondary">‹</button>
        <h3>{current.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</h3>
        <button onClick={nextMonth} className="btn btn-secondary">›</button>
      </div>

      <table className="calendar-table">
        <thead>
          <tr>{WEEK_DAYS.map(w => <th key={w}>{w}</th>)}</tr>
        </thead>
        <tbody>
          {monthMatrix.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => (
                <td key={j} className="calendar-cell">
                  {day ? (
                    <div>
                      <div className="calendar-day-header">
                        <span className="day-number">{day}</span>
                        <button onClick={() => onAdd?.(new Date(current.getFullYear(), current.getMonth(), day).toISOString())} className="btn btn-small">+</button>
                      </div>
                      <div className="calendar-sessions">
                        {(sessionsByDay.get(day) || []).slice(0,3).map(s => (
                          <div key={s.id} className="calendar-session">
                            <small>{s.exams?.name || 'Study'}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
