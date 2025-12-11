import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <main className="home-page">
      <div className="hero">
        <h1>UniGrade</h1>
        <p>Track your exam grades and predict your future performance</p>
        
        <div className="cta-buttons">
          {user ? (
            <>
              <a href="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </a>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/auth" className="btn btn-primary">
                Login / Sign Up
              </a>
            </>
          )}
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
            <h3>📅 Study Planner</h3>
            <p>Plan study sessions with an interactive calendar</p>
          </div>

          <div className="feature-card">
            <h3>☁️ Cloud Sync</h3>
            <p>Your data is securely stored in the cloud with Supabase</p>
          </div>

          <div className="feature-card">
            <h3>🔐 Secure</h3>
            <p>Your data is protected with row-level security policies</p>
          </div>
        </div>
      </section>
    </main>
  );
}
