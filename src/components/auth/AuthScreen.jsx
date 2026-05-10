// src/components/auth/AuthScreen.jsx
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Building2, Mail, Lock, Loader2, AlertTriangle, Eye, EyeOff,
  Shield, CheckCircle2, ArrowRight
} from 'lucide-react';

const TRUST_BADGES = ['SOC 2 Type II', '256-bit AES', 'GDPR Compliant'];

const TESTIMONIAL = {
  quote: 'Reduced our TP documentation time by 60%. The benchmarking engine alone saves us ₹15 lakhs per client annually.',
  author: 'Managing Partner, Big 4 Advisory Firm',
};

const FEATURES = [
  'Complete Transfer Pricing Suite with benchmarking',
  'Real-time PE & Expat risk monitoring',
  '40+ compliance filings auto-tracked',
  'FEMA, GST & DTAA advisory tools',
  'ICA document generation engine',
  'Pillar Two / ETR modelling',
];

const PasswordStrength = ({ password }) => {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/]
    .filter(r => r.test(password)).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= score ? colors[score] : 'bg-slate-200'}`} />
        ))}
      </div>
      <p className={`text-xs font-semibold ${score <= 1 ? 'text-rose-500' : score === 2 ? 'text-amber-500' : score === 3 ? 'text-blue-500' : 'text-emerald-500'}`}>
        {labels[score]}
      </p>
    </div>
  );
};

export default function AuthScreen() {
  const [view, setView] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (view === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setView('signin');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setForgotSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B132B] flex lg:flex-row flex-col relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/8 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-violet-600/5 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      {/* Left panel — feature showcase */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-14 relative z-10">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center mr-3 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-extrabold text-lg tracking-tight">GCC Advisory Pro</span>
            <span className="ml-2 text-[10px] text-indigo-400 font-bold uppercase tracking-widest border border-indigo-500/30 px-2 py-0.5 rounded-full">Enterprise</span>
          </div>
        </div>

        {/* Hero copy */}
        <div>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            The complete<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
              GCC tax advisory
            </span><br />
            platform.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
            Replace 6 people worth of manual advisory work. Built for Indian GCC Transfer Pricing, FEMA, GST, and Pillar Two compliance.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-12">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mr-2.5 mt-0.5 flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium leading-snug">{f}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-slate-300 text-sm leading-relaxed italic mb-4">"{TESTIMONIAL.quote}"</p>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center mr-3">
                <span className="text-indigo-300 font-bold text-xs">M</span>
              </div>
              <span className="text-slate-400 text-xs font-semibold">{TESTIMONIAL.author}</span>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-4">
          {TRUST_BADGES.map((b, i) => (
            <div key={i} className="flex items-center text-slate-500 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mr-3 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-extrabold text-xl">GCC Advisory Pro</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Tab switcher */}
            {view !== 'forgot' && (
              <div className="flex border-b border-white/10">
                {['signin', 'signup'].map(v => (
                  <button
                    key={v}
                    onClick={() => { setView(v); setError(''); }}
                    className={`flex-1 py-4 text-sm font-bold transition-colors ${view === v ? 'text-white bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {v === 'signin' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>
            )}

            <div className="p-8">
              {view === 'forgot' ? (
                /* Forgot password */
                forgotSent ? (
                  <div className="text-center py-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-lg mb-2">Check your inbox</h3>
                    <p className="text-slate-400 text-sm mb-6">We sent a reset link to <strong className="text-slate-300">{email}</strong></p>
                    <button onClick={() => { setView('signin'); setForgotSent(false); }} className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold">
                      Back to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgot} className="space-y-5">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">Reset password</h3>
                      <p className="text-slate-400 text-sm">Enter your email and we'll send a reset link.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Work Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          placeholder="partner@firm.com" />
                      </div>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center disabled:opacity-60">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Send Reset Link</span><ArrowRight className="w-4 h-4 ml-2" /></>}
                    </button>
                    <button type="button" onClick={() => setView('signin')} className="w-full text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors">
                      ← Back to Sign In
                    </button>
                  </form>
                )
              ) : (
                /* Sign In / Sign Up */
                <form onSubmit={handleAuth} className="space-y-5">
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1">
                      {view === 'signin' ? 'Welcome back' : 'Create your account'}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {view === 'signin' ? 'Sign in to your advisory platform.' : 'Start your 14-day free trial.'}
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        placeholder="partner@firm.com" />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                      {view === 'signin' && (
                        <button type="button" onClick={() => setView('forgot')} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full pl-10 pr-11 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {view === 'signup' && <PasswordStrength password={password} />}
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm flex items-start">
                      <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center disabled:opacity-60 active:scale-[0.98]">
                    {loading
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : <><span>{view === 'signin' ? 'Sign In Securely' : 'Start Free Trial'}</span><ArrowRight className="w-4 h-4 ml-2" /></>}
                  </button>

                  {/* Demo hint */}
                  <p className="text-center text-slate-600 text-xs">
                    Demo: use any email & password
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Trust row */}
          <div className="flex items-center justify-center gap-5 mt-6">
            {TRUST_BADGES.map((b, i) => (
              <div key={i} className="flex items-center text-slate-600 text-xs font-medium">
                <Shield className="w-3 h-3 mr-1" />{b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}