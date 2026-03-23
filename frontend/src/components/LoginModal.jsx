import React, { useState } from 'react';
import { Mail, ShieldCheck, ArrowRight, Loader, X } from 'lucide-react';
import { authService } from '../services/api';

const LoginModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.sendOtp(email);
      setMessage(res.message);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.verifyOtp(email, otp);
      localStorage.setItem('india247_token', res.token);
      localStorage.setItem('india247_user', JSON.stringify(res.user));
      onClose();
      // Reload to update UI
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-saffron mb-4">
              {step === 1 ? <Mail size={28} /> : <ShieldCheck size={28} />}
            </div>
            <h2 className="text-2xl font-bold text-navy">
              {step === 1 ? 'Citizen Login' : 'Verify Identity'}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {step === 1 
                ? 'Enter your email to receive a secure login OTP' 
                : `We've sent a 6-digit code to ${email}`}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}

          {message && !error && step === 2 && (
            <div className="mb-6 p-3 bg-green-50 border border-green-100 text-india-green text-sm rounded-xl font-medium">
              {message}
            </div>
          )}

          <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-5">
            {step === 1 ? (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                     type="email" 
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-saffron focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium"
                     placeholder="e.g. rahul@example.com"
                   />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">OTP Code</label>
                <div className="relative">
                   <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                     type="text" 
                     required
                     maxLength={6}
                     value={otp}
                     onChange={(e) => setOtp(e.target.value)}
                     className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-saffron focus:ring-4 focus:ring-orange-50 outline-none transition-all font-bold tracking-[0.5em] text-lg text-center"
                     placeholder="••••••"
                   />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-navy text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all hover:shadow-xl shadow-navy/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <>
                  <span>{step === 1 ? 'Send OTP' : 'Verify & Login'}</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {step === 2 && (
            <button 
              onClick={() => { setStep(1); setOtp(''); }} 
              className="w-full mt-4 text-sm font-bold text-gray-400 hover:text-navy transition-colors"
            >
              Change Email
            </button>
          )}
        </div>
        
        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium">By logging in, you agree to our Terms and Data Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
