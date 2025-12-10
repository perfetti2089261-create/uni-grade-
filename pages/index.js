import { useEffect, useState } from 'react'

export default function Home() {
  const [grades, setGrades] = useState([])
  const [course, setCourse] = useState('')
  const [grade, setGrade] = useState('')
  const [credits, setCredits] = useState('')
  const [mean, setMean] = useState(null)
  const [target, setTarget] = useState('')
  const [futureCount, setFutureCount] = useState('1')
  const [required, setRequired] = useState(null)

  async function fetchGrades() {
    const res = await fetch('/api/grades')
    const data = await res.json()
    setGrades(data.grades || [])
    setMean(data.mean ?? null)
  }

  useEffect(() => { fetchGrades() }, [])

  async function addGrade(e) {
    e.preventDefault()
    const payload = { course, grade: parseFloat(grade), credits: credits ? parseFloat(credits) : null }
    const res = await fetch('/api/grades', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      setCourse('')
      setGrade('')
      setCredits('')
      fetchGrades()
    } else {
      const txt = await res.text()
      alert('Error: ' + txt)
    }
  }

  async function calcProvision(e) {
    e && e.preventDefault()
    if (!target) return
    const q = new URLSearchParams({ target: target.toString(), futureCount: futureCount.toString() })
    const res = await fetch('/api/grades?' + q.toString())
    const data = await res.json()
    setRequired(data.requiredAverage ?? null)
  }

  return (
    <div className="container">
      <h1>Uni Grade — Register Exams</h1>

      <section className="card">
        <h2>Add grade</h2>
        <form onSubmit={addGrade}>
          <input placeholder="Course" value={course} onChange={(e)=>setCourse(e.target.value)} />
          <input placeholder="Grade (numeric)" value={grade} onChange={(e)=>setGrade(e.target.value)} />
          <input placeholder="Credits (optional)" value={credits} onChange={(e)=>setCredits(e.target.value)} />
          <button type="submit">Add</button>
        </form>
      </section>

      <section className="card">
        <h2>Grades</h2>
        <div className="stats">Current mean: {mean !== null ? mean.toFixed(2) : '—'}</div>
        <ul>
          {grades.map(g => (
            <li key={g.id}>{g.course || '—'} — {g.grade}{g.credits ? ` (credits ${g.credits})` : ''}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Provision calculator</h2>
        <form onSubmit={calcProvision}>
          <input placeholder="Target mean" value={target} onChange={(e)=>setTarget(e.target.value)} />
          <input placeholder="Number of future exams" value={futureCount} onChange={(e)=>setFutureCount(e.target.value)} />
          <button type="submit">Calculate required average</button>
        </form>
        {required !== null && (
          <div className="result">Required average across next {futureCount} exam(s): {Number.isFinite(required) ? required.toFixed(2) : required}</div>
        )}
      </section>

      <footer className="footer">Deployable to Vercel. Uses Supabase for storage.</footer>

      <style jsx>{`
        .container{max-width:800px;margin:40px auto;padding:0 16px}
        .card{background:#fff;padding:16px;border-radius:8px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,.05)}
        input{display:block;padding:8px;margin:8px 0;width:100%;box-sizing:border-box}
        button{padding:8px 12px}
        ul{padding-left:16px}
        .stats{margin-bottom:8px}
        .result{margin-top:8px;font-weight:600}
        .footer{font-size:13px;color:#666;margin-top:16px}
      `}</style>
    </div>
  )
}
