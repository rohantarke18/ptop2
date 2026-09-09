import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { Shield, Phone, ArrowRight, CheckCircle2, Lock, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithPhone, switchRoleForDemo } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('+91 98201 23454');
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setOtpSent(true);
    showToast('info', 'OTP Dispatched', 'Demo OTP: 123456 has been generated.');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginWithPhone(phone, otp);
      showToast('success', 'Authenticated', 'Welcome to your CivicBridge citizen portal.');
      navigate('/dashboard');
      setIsLoading(false);
    }, 600);
  };

  const handleQuickDemoCitizen = () => {
    switchRoleForDemo('citizen');
    showToast('success', 'Logged in as Citizen', 'Persona: Shreya Kulkarni');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-xs">
          CB
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Citizen Portal Access
        </h1>
        <p className="text-xs text-slate-500">
          Log in with your registered mobile number to manage your complaints and proposals.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label htmlFor="phone-input" className="block text-xs font-semibold text-slate-800 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="phone-input"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded border border-slate-300 focus:outline-blue-600 bg-white"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                A 6-digit one-time code will be dispatched to verify your identity.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Send OTP Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label htmlFor="otp-input" className="block text-xs font-semibold text-slate-800 mb-1">
                Enter Verification Code (OTP)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="otp-input"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded border border-slate-300 focus:outline-blue-600 font-mono tracking-widest bg-white"
                />
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                Simulation code: 123456
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>
        )}

        {/* Quick Demo Access Button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleQuickDemoCitizen}
            className="w-full py-2 px-3 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Instant Demo Citizen Login</span>
          </button>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/admin"
            className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center justify-center gap-1"
          >
            <Shield className="w-3 h-3" />
            <span>Switch to Official Administration Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
