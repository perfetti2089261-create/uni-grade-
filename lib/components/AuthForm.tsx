'use client';

import { useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

interface AuthFormProps {
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const supabase = getSupabase();

      if (isLogin) {
        // Sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        setMessage('Logged in successfully!');
        onSuccess?.();
      } else {
        // Sign up
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setMessage('Account created! Check your email to confirm.');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : isLogin ? 'Login' : 'Sign Up'}
      </button>

      <button
        type="button"
        onClick={() => {
          setIsLogin(!isLogin);
          setError('');
          setMessage('');
        }}
        className="btn btn-secondary"
      >
        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
      </button>
    </form>
  );
};
