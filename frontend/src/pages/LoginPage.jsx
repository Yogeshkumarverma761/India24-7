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
    <div className="min-h-screen bg-teal-dark flex items-center justify-center p-4 font-sora">
      <div className="bg-white rounded-[24px] p-8 shadow-2xl w-full max-w-md modal-slide-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <p className="text-warm-orange text-[14px] font-[800] tracking-widest leading-none mb-2">भारत 24/7</p>
          <h1 className="text-[36px] font-[800] text-teal-dark tracking-[-0.5px] leading-none mb-2">India247</h1>
          <p className="text-slate text-[13px] font-[600]">Bridge to the People · India</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-page-bg rounded-[12px] p-1 mb-6">
          <button onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2.5 rounded-[10px] text-[14px] font-[800] transition-all ${mode === 'login' ? 'bg-teal-dark text-white shadow-md' : 'text-slate hover:text-charcoal'}`}>
            Sign In
          </button>
          <button onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2.5 rounded-[10px] text-[14px] font-[800] transition-all ${mode === 'signup' ? 'bg-teal-dark text-white shadow-md' : 'text-slate hover:text-charcoal'}`}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] font-[800] text-charcoal tracking-widest uppercase mb-2 block">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name"
                className="input-field" />
            </div>
          )}
          <div>
            <label className="text-[11px] font-[800] text-charcoal tracking-widest uppercase mb-2 block">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              className="input-field" required />
          </div>
          <div>
            <label className="text-[11px] font-[800] text-charcoal tracking-widest uppercase mb-2 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="input-field" />
          </div>

          {error && (
            <div className="bg-[#FEF2F2] border border-[#FECACA] text-red text-[13px] font-[600] px-4 py-3 rounded-[12px]">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className={`w-full h-[52px] rounded-[12px] text-[15px] font-[800] shadow-md transition-all flex items-center justify-center gap-2 ${
              loading ? 'bg-warm-orange/60 text-white cursor-not-allowed' : 'bg-warm-orange hover:bg-warm-orange-hover text-white hover:shadow-lg'
            }`}>
            {loading ? 'Signing in...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => {
            const guest = { name: 'Guest User', email: 'guest@india247.in' };
            localStorage.setItem('india247_user', JSON.stringify(guest));
            navigate('/');
          }} className="text-teal-mid hover:text-teal-dark text-[13px] font-[700] transition-colors">
            Continue as Guest →
          </button>
        </div>
      </div>
    </div>
  );
}
