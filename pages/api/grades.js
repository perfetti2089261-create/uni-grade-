import { createServerClient } from '../../../lib/supabaseClient'

export default async function handler(req, res) {
  const supabase = createServerClient()

  if (req.method === 'POST') {
    const { course, grade, credits } = req.body || {}
    const numericGrade = parseFloat(grade)
    if (Number.isNaN(numericGrade)) return res.status(400).send('Invalid grade')

    const payload = { course: course || null, grade: numericGrade, credits: credits ?? null }
    const { data, error } = await supabase.from('grades').insert(payload).select().limit(1)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ inserted: data[0] })
  }

  if (req.method === 'GET') {
    // list grades and compute mean
    const { data: grades, error } = await supabase.from('grades').select('*').order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })

    // compute mean: if any credits present, compute weighted mean
    let mean = null
    if (grades.length > 0) {
      const hasCredits = grades.some(g => g.credits !== null && g.credits !== undefined)
      if (hasCredits) {
        let sum = 0, totalCredits = 0
        for (const g of grades) {
          const c = g.credits ? Number(g.credits) : 0
          sum += Number(g.grade) * (c || 1)
          totalCredits += (c || 1)
        }
        mean = totalCredits ? sum / totalCredits : null
      } else {
        mean = grades.reduce((a,b)=>a+Number(b.grade),0)/grades.length
      }
    }

    // If query params include target and futureCount, compute required average
    const { target, futureCount } = req.query
    let requiredAverage = null
    if (target !== undefined) {
      const t = parseFloat(target)
      const nFuture = futureCount ? parseInt(futureCount, 10) : 1
      if (!Number.isFinite(t) || !Number.isInteger(nFuture) || nFuture <= 0) {
        return res.status(400).json({ error: 'Invalid target or futureCount' })
      }

      const sumCurrent = grades.reduce((s,g)=>s+Number(g.grade),0)
      const nCurrent = grades.length
      // required average across next nFuture exams to reach target overall mean
      // formula: required = (t*(nCurrent + nFuture) - sumCurrent) / nFuture
      requiredAverage = (t * (nCurrent + nFuture) - sumCurrent) / nFuture
    }

    return res.status(200).json({ grades, mean, requiredAverage })
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end('Method Not Allowed')
}
