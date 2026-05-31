import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Pill, Sparkles, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';

interface AdminSignInProps {
  onLoginSuccess: () => void;
}

export default function AdminSignIn({ onLoginSuccess }: AdminSignInProps) {
  const [email, setEmail] = useState('admin@medonepharmacy.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem('medone_admin_token', data.token);
          onLoginSuccess();
        } else {
          setError(data.error || 'Please enter valid administrator credentials.');
        }
      })
      .catch((err) => {
        console.error('Admin authentication failure:', err);
        setError('Network error. Could not connect to MedOne+ authentication service.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100/50 to-blue-50/30 p-4 sm:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]" id="login-panel-container">
        
        {/* Left Form Panel: 5 Cols on LG screen */}
        <div className="col-span-1 lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between text-left">
          
          {/* Logo Brand Header */}
          <div className="flex items-center space-x-3 select-none mb-10">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-slate-100">
              <Logo size="sm" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-black tracking-tight text-[#0d5cb5] leading-none">
                MedOne+
              </span>
              <span className="text-[9px] font-bold tracking-[0.25em] text-[#10b981] uppercase mt-0.5 block leading-none">
                Pharmacy
              </span>
            </div>
          </div>

          {/* Form Content Block */}
          <div className="flex-grow flex flex-col justify-center max-w-md w-full mx-auto lg:mx-0">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
              Welcome Back!
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1 mb-8">
              Sign in to manage your pharmacy.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center space-x-2 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@medonepharmacy.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#10b981] focus:bg-white text-xs sm:text-sm font-semibold text-slate-800 rounded-2xl transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password Block */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 focus:border-[#10b981] focus:bg-white text-xs sm:text-sm font-semibold tracking-widest text-[#0d5cb5] rounded-2xl transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Extra Checkboxes & Links */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2.5 cursor-pointer text-slate-500 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-[#10b981] focus:ring-[#10b981] border-slate-300 accent-[#10b981]"
                  />
                  <span className="font-semibold">Remember me</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link has been dispatched to administrators mailbox.');
                  }}
                  className="font-bold text-[#10b981] hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-100 transition-all active:scale-98 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75"
              >
                <span>{isSubmitting ? 'Authenticing...' : 'Sign In'}</span>
                {!isSubmitting && <ArrowRight className="w-4.5 h-4.5" />}
              </button>

            </form>
          </div>

          {/* Secure Note Footer */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center space-x-2 text-slate-400">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Secure & private access</span>
          </div>

        </div>

        {/* Right Art Panel: 6 Cols on LG screen */}
        <div className="hidden lg:col-span-6 bg-radial from-slate-50 to-blue-50/65 relative overflow-hidden flex flex-col justify-center items-center border-l border-slate-100/50 p-12 text-center">
          
          {/* Ambient blurred glowing graphic bubbles */}
          <div className="absolute top-20 right-10 w-48 h-48 bg-[#10b981]/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-16 left-8 w-56 h-56 bg-[#0d5cb5]/8 rounded-full blur-3xl" />

          {/* Floating Premium Medicine Renders built purely in CSS/Tailwind */}
          <div className="relative w-full max-w-sm h-[320px] mb-8">
            
            {/* Glossy Paracetamol Card (Top Left) */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-4 left-6 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-white shadow-lg flex items-center space-x-3.5 max-w-[200px] z-20 text-left"
            >
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 flex-shrink-0">
                <Pill className="w-5 h-5 text-[#10b981]" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-800 leading-none">Panadol 500mg</p>
                <p className="text-[9px] text-[#10b981] font-bold mt-1 leading-none">Verified Batch</p>
              </div>
            </motion.div>

            {/* Glossy Vaccine Jar (Bottom right) */}
            <motion.div 
              animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-white shadow-xl flex items-center space-x-3 max-w-[190px] z-20 text-left"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#0d5cb5]" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-800 leading-none">Cold-Chain Secure</p>
                <p className="text-[9px] text-[#0d5cb5] font-bold mt-1 leading-none">Temp Verified</p>
              </div>
            </motion.div>

            {/* Sleek Medical Cross Shield illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-44 h-44 bg-gradient-to-tr from-emerald-100 to-sky-100 rounded-full flex items-center justify-center shadow-inner">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-50 relative group">
                  
                  {/* Decorative glowing sparkle */}
                  <Sparkles className="absolute -top-1 -right-1 text-emerald-400 w-5 h-5 animate-pulse" />

                  {/* Medical Cross Sign */}
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className="absolute w-12 h-3.5 bg-gradient-to-r from-[#10b981] to-emerald-500 rounded-full" />
                    <div className="absolute h-12 w-3.5 bg-gradient-to-b from-[#10b981] to-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Flying dynamic capsule pills built in Tailwind */}
            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [0, 45, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-10 right-10 w-11 h-5 bg-gradient-to-r from-rose-500 to-red-400 rounded-full opacity-80 border border-white/50 shadow-md transform rotate-[35deg]"
            />
            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, -45, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-10 left-10 w-9 h-4 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full opacity-70 border border-white/50 shadow-md transform -rotate-[45deg]"
            />

          </div>

          <h3 className="text-xl font-black text-slate-800 tracking-tight leading-snug">
            Professional Pharmacy Portal
          </h3>
          <p className="text-xs text-slate-450 leading-relaxed max-w-sm mt-2.5">
            Access secure analytics, real-time medicine inventories, incoming customer orders catalog, and digital prescription tracking with utmost speed.
          </p>

        </div>

      </div>
    </div>
  );
}
