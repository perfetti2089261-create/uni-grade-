# Deployment Guide

## Deploying to Vercel

### Step 1: Prepare Your Repository

1. Make sure your code is committed and pushed to GitHub:
```bash
git add .
git commit -m "Initial project setup"
git push origin main
```

### Step 2: Create Supabase Project

1. Go to https://supabase.com and sign up
2. Create a new project
3. In the SQL Editor, run the contents of `sql/schema.sql`
4. Go to Settings → API and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_KEY`

### Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "New Project"
3. Select your `uni-grade-` repository
4. In "Environment Variables", add:
   - Name: `NEXT_PUBLIC_SUPABASE_URL` → Value: your Supabase URL
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: your anon key
   - Name: `SUPABASE_SERVICE_KEY` → Value: your service key
5. Click "Deploy"

### Step 4: Access Your App

Your app will be live at `https://<your-project>.vercel.app`

### Continuous Deployment

Every time you push to the main branch, Vercel will automatically:
1. Build your app
2. Run tests (if configured)
3. Deploy to production

## Environment Variables Summary

| Variable | Source | Visibility |
|----------|--------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings → API | Public (browser) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings → API | Public (browser) |
| `SUPABASE_SERVICE_KEY` | Supabase Settings → API | Private (server only) |

## Troubleshooting

### Missing Environment Variables
If your app won't build, check the Vercel dashboard for missing environment variables.

### Database Connection Issues
1. Verify your Supabase URL and keys are correct
2. Check that RLS policies are enabled in Supabase
3. Ensure your Supabase project isn't paused

### Authentication Issues
If users can't log in:
1. Check Supabase Auth settings
2. Verify the redirect URLs in Supabase match your Vercel domain
3. Check browser console for specific error messages

## Local Testing Before Deployment

```bash
# Install dependencies
npm install

# Create .env.local with your credentials
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Build the app locally
npm run build

# Start production build
npm run start
```

If the build succeeds locally, it should also succeed on Vercel.
