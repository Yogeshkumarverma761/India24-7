import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | signup
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && !name.trim()) { setError('Please enter your name'); return; }
    if (!email.trim()) { setError('Please enter your email'); return; }
    setLoading(true);

    try {
      // Simple localStorage auth (matching the app's auth pattern)
      const user = { name: mode === 'signup' ? name.trim() : email.split('@')[0], email: email.trim() };
      localStorage.setItem('india247_user', JSON.stringify(user));
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(210_20%_98%)] flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-xl border border-[hsl(220_13%_90%)] shadow-sm w-full max-w-[400px] p-8 modal-slide-up">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-[hsl(220_60%_25%)] rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <span className="text-[hsl(24_90%_52%)] font-bold text-xl leading-none">247</span>
          </div>
          <h1 className="text-2xl font-semibold text-[hsl(220_30%_10%)] tracking-tight mb-1">{mode === 'login' ? 'Welcome back' : 'Create an account'}</h1>
          <p className="text-[14px] text-[hsl(220_10%_45%)]">{mode === 'login' ? 'Enter your credentials to access your account' : 'Enter your details to get started'}</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-[hsl(210_15%_95%)] rounded-lg p-1 mb-6">
          <button onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-1.5 rounded-md text-[13px] font-medium transition-all ${mode === 'login' ? 'bg-white text-[hsl(220_30%_10%)] shadow-sm' : 'text-[hsl(220_10%_45%)] hover:text-[hsl(220_30%_10%)]'}`}>
            Sign In
          </button>
          <button onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-1.5 rounded-md text-[13px] font-medium transition-all ${mode === 'signup' ? 'bg-white text-[hsl(220_30%_10%)] shadow-sm' : 'text-[hsl(220_10%_45%)] hover:text-[hsl(220_30%_10%)]'}`}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[hsl(220_30%_10%)]">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                className="input-field" />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[hsl(220_30%_10%)]">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="m@example.com"
              className="input-field" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[hsl(220_30%_10%)]">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="input-field" />
          </div>

          {error && (
            <div className="text-[hsl(0_84%_60%)] text-[13px] font-medium mt-2">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className={`w-full mt-2 h-[40px] rounded-md text-[14px] font-medium transition-colors flex items-center justify-center gap-2 ${
              loading ? 'bg-[hsl(220_60%_25%)]/70 text-white cursor-not-allowed' : 'bg-[hsl(220_60%_25%)] hover:bg-[hsl(220_60%_20%)] text-white'
            }`}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => {
            const guest = { name: 'Guest User', email: 'guest@india247.in' };
            localStorage.setItem('india247_user', JSON.stringify(guest));
            navigate('/');
          }} className="text-[14px] text-[hsl(220_10%_45%)] hover:text-[hsl(220_30%_10%)] transition-colors underline underline-offset-4">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
