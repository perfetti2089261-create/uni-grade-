export default function Home() {
  return (
    <main className="home-page">
      <div className="hero">
        <h1>UniGrade</h1>
        <p>Track your exam grades and predict your future performance</p>
        
        <div className="cta-buttons">
          <a href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </a>
          <a href="/register-grade" className="btn btn-secondary">
            Register a Grade
          </a>
        </div>
      </div>

      <section className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>📊 Grade Tracking</h3>
            <p>Keep track of all your exam grades in one place</p>
          </div>
          
          <div className="feature-card">
            <h3>📈 Analytics</h3>
            <p>View your mean grade and performance over time</p>
          </div>

          <div className="feature-card">
            <h3>🔮 Predictions</h3>
            <p>Get predictions for your future exams based on your mean grade</p>
          </div>

          <div className="feature-card">
            <h3>☁️ Cloud Sync</h3>
            <p>Your data is securely stored in the cloud with Supabase</p>
          </div>
        </div>
      </section>
    </main>
  );
}
