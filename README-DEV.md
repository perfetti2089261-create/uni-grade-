Uni Grade — developer notes

Quick start (local):

1. Copy env example and fill keys:

```bash
cp .env.example .env.local
# then edit .env.local with your Supabase project values
```

2. Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

3. The app will be available at `http://localhost:3000`.

Supabase setup:

- Create a Supabase project and run the SQL in `sql/init.sql` (Query Editor) to create the `grades` table.
- Add the keys to `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_URL` (same as NEXT_PUBLIC_SUPABASE_URL)
  - `SUPABASE_SERVICE_ROLE_KEY` (service role key for server API)

Deploy to Vercel:

- Push the repo to GitHub. In Vercel, create a new project from the repo.
- Set the environment variables on Vercel (same names as above). For frontend, `NEXT_PUBLIC_*` vars are used; for server API the `SUPABASE_SERVICE_ROLE_KEY` must be set as a secret (server-only).

API routes:

- `POST /api/grades` — add grade `{ course, grade, credits }`
- `GET /api/grades` — list grades and `mean`
- `GET /api/grades?target=7.5&futureCount=3` — compute `requiredAverage` across next `futureCount` exams to reach `target` mean
