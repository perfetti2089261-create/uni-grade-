# UniGrade - Development Guide

## Project Overview

UniGrade is a full-stack application for tracking university exam grades and predicting future performance based on statistical analysis.

## Architecture

### Frontend (`pages/`)
- Home page: Landing page with features overview
- Dashboard: Main user interface showing all grades
- Register Grade: Page for adding new exams and grades
- Predictions: Page for viewing predicted grades

### Backend (`pages/api/`)
- RESTful API endpoints for exams, grades, and predictions
- Integrated with Supabase for data persistence
- Row Level Security for user data isolation

### Database (`sql/`)
- PostgreSQL database on Supabase
- Three main tables: exams, grades, predictions
- Indexes for optimal query performance
- RLS policies for security

## Key Features

### 1. Grade Registration
Users can:
- Add exams with course codes and credits
- Register grades (0-30 scale) for each exam
- Add notes to grades
- View all grades sorted by date

### 2. Grade Analytics
- Calculate and display mean grade
- Filter grades by exam or time period (extensible)
- Track grade trends over time

### 3. Predictions
- Generate predictions based on mean grade
- Calculate confidence score based on sample size
- Display prediction history

## Development Workflow

### Adding a New Feature

1. **Database Changes**: Modify `sql/schema.sql` and run migrations in Supabase
2. **API Endpoint**: Create new route in `pages/api/`
3. **Component**: Create React component in `lib/components/`
4. **Page**: Add or update page in `pages/`
5. **Styling**: Update `styles/globals.css`

### API Integration

All API endpoints expect:
- POST: JSON body with request data
- GET: Query parameters as needed
- Header: `x-user-id` for authentication (in production, use Supabase auth)

Example API call:
```javascript
const response = await fetch('/api/grades', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': userId
  },
  body: JSON.stringify({
    examId: '...',
    grade: 27,
    dateTaken: '2024-01-15'
  })
});
```

### Component Best Practices

1. Use TypeScript interfaces for props
2. Include loading and error states
3. Provide user feedback (success/error messages)
4. Make components reusable when possible

Example component structure:
```typescript
interface Props {
  examId: string;
  onSuccess?: () => void;
}

export const MyComponent: React.FC<Props> = ({ examId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Component logic
};
```

## Testing

Currently, the project doesn't have automated tests. Consider adding:
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Cypress or Playwright

## Performance Optimization

### Current Optimizations
- TypeScript for type safety
- Indexed database queries
- Client-side form validation
- Efficient component rendering

### Future Optimizations
- Image optimization with Next.js Image
- Code splitting
- Caching strategies
- Database query optimization

## Security Considerations

1. **Row Level Security**: All database access is protected by RLS
2. **Environment Variables**: Sensitive keys are never exposed to the client
3. **Type Safety**: TypeScript helps prevent runtime errors
4. **Input Validation**: All inputs should be validated before database operations

## Extending the App

### Add Authentication
1. Enable Supabase Auth in your project
2. Update API routes to validate tokens
3. Add login/signup pages

### Add Trends Analysis
1. Create new endpoint to fetch grades with timestamps
2. Calculate grade progression over time
3. Display trend charts (use Chart.js or Recharts)

### Add Subject-Specific Predictions
1. Create subjects table in database
2. Group grades by subject
3. Calculate predictions per subject

### Add Export Feature
1. Generate CSV or PDF from grade data
2. Create endpoint to generate reports
3. Add download button to dashboard

## Troubleshooting Guide

### API Returns 401 Unauthorized
- Check that `x-user-id` header is provided
- Verify user ID is correct
- In production, implement proper JWT validation

### Grades Not Showing Up
1. Check browser console for errors
2. Verify Supabase connection in Settings
3. Check RLS policies are correctly set up
4. Ensure exams exist before adding grades

### Build Fails on Vercel
- Check environment variables are set
- Review build logs in Vercel dashboard
- Verify TypeScript compilation succeeds locally

## Contributing

When contributing:
1. Follow existing code style
2. Use TypeScript for type safety
3. Test changes locally before pushing
4. Update documentation as needed
5. Make meaningful commit messages

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## License

MIT License - Feel free to use and modify for your own projects.
