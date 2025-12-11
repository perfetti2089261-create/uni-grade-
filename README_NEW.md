# UniGrade

A web application for tracking exam grades and predicting future performance based on mean scores.

## Features

- 📊 **Grade Management**: Register and track all your exam grades
- 📈 **Analytics**: View your mean grade and performance trends
- 🔮 **Predictions**: Get predictions for future exams based on historical data
- ☁️ **Cloud Sync**: Secure cloud storage using Supabase
- 🚀 **Easy Deployment**: Deploy to Vercel with one click
- 🔐 **User Authentication**: Secure login with Supabase Auth

## Tech Stack

### Frontend
- **React 18** - UI library
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **CSS3** - Styling

### Backend
- **Next.js API Routes** - Serverless backend
- **Supabase** - PostgreSQL database and authentication
- **Row Level Security (RLS)** - Data protection

### Deployment
- **Vercel** - Hosting platform
- **Supabase Cloud** - Database hosting

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Supabase account (free tier available at https://supabase.com)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd uni-grade-
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
```

4. Configure your `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### Setting Up Supabase

1. Create a new project at https://supabase.com
2. In the SQL editor, run the queries from `sql/schema.sql` to create tables and set up Row Level Security
3. Copy your project URL and API keys from Settings → API

### Running Locally

```bash
npm run dev
```

Visit http://localhost:3000 to see the app.

## Project Structure

```
├── pages/
│   ├── api/              # API routes
│   │   ├── exams/        # Exam endpoints
│   │   ├── grades/       # Grade endpoints
│   │   └── predictions/  # Prediction endpoints
│   ├── index.tsx         # Home page
│   ├── dashboard.tsx     # Dashboard page
│   ├── register-grade.tsx # Grade registration page
│   └── predictions.tsx   # Predictions page
├── lib/
│   ├── components/       # React components
│   │   ├── ExamForm.tsx
│   │   ├── GradeForm.tsx
│   │   ├── GradeList.tsx
│   │   └── PredictionList.tsx
│   └── supabaseClient.ts # Supabase configuration
├── styles/
│   └── globals.css       # Global styles
├── sql/
│   └── schema.sql        # Database schema
├── .env.local.example    # Environment variables template
├── tsconfig.json         # TypeScript configuration
├── next.config.js        # Next.js configuration
└── vercel.json           # Vercel configuration
```

## API Endpoints

### Exams
- `POST /api/exams` - Create a new exam
- `GET /api/exams` - Get all user's exams

### Grades
- `POST /api/grades` - Register a new grade
- `GET /api/grades` - Get all user's grades

### Predictions
- `POST /api/predictions` - Generate a prediction based on mean grade
- `GET /api/predictions` - Get all user's predictions

## Database Schema

### Exams Table
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to auth.users
- `name` (VARCHAR): Exam name
- `course_code` (VARCHAR): Optional course code
- `credits` (INT): Optional course credits
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### Grades Table
- `id` (UUID): Primary key
- `exam_id` (UUID): Foreign key to exams
- `user_id` (UUID): Foreign key to auth.users
- `grade` (DECIMAL): Grade value (0-30)
- `date_taken` (TIMESTAMP): When the exam was taken
- `notes` (TEXT): Optional notes
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### Predictions Table
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to auth.users
- `exam_id` (UUID): Optional foreign key to exams
- `predicted_grade` (DECIMAL): Predicted grade based on mean
- `confidence_score` (DECIMAL): Confidence level (0-1)
- `calculation_date` (TIMESTAMP): When prediction was calculated
- `created_at` (TIMESTAMP): Creation timestamp

## Deployment to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com and sign in
3. Click "New Project" and select your repository
4. Add environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
5. Click "Deploy"

The app will automatically deploy on every push to the main branch.

## Prediction Algorithm

The current prediction system calculates:
1. **Mean Grade**: Average of all registered grades
2. **Confidence Score**: Based on the number of grades recorded
   - Increases as you add more grades
   - Reaches 100% confidence with 10+ grades

Future enhancements could include:
- Trend analysis
- Subject-specific predictions
- Time-series forecasting

## Security

- Row Level Security (RLS) is enabled on all tables
- Users can only see their own data
- API routes validate user identity
- Sensitive environment variables are never exposed to the client

## Contributing

Feel free to fork this project and submit pull requests with improvements.

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue in the GitHub repository.

---

Built with ❤️ for university students
