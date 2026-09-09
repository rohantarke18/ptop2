import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { analyticsService } from '../services/analyticsService';
import { complaintService } from '../services/complaintService';
import { PublicMetrics, Problem } from '../types';
import {
  Clock,
  ShieldCheck,
  Wrench,
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Shield,
  Search,
  ChevronDown,
  CheckCircle2,
  Building2,
  AlertCircle,
  Activity,
  ChevronRight,
  FileText,
  Lightbulb,
  Vote,
  Sparkles,
  Layers,
  PhoneCall,
} from 'lucide-react';

type RoleTab = 'citizen' | 'officer' | 'department_admin' | 'super_admin';

export const LandingPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { loginAsCitizen, loginAsOfficial, switchRoleForDemo } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  // Role selector state
  const [selectedRole, setSelectedRole] = useState<RoleTab>('citizen');
  const [email, setEmail] = useState('aarav.deshmukh@example.org');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Registration fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regWard, setRegWard] = useState('Ward 14, Pune Central');

  // Quick Docket Search
  const [quickTrackId, setQuickTrackId] = useState('');
  const [metrics, setMetrics] = useState<PublicMetrics | null>(null);
  const [recentResolved, setRecentResolved] = useState<Problem[]>([]);

  // Sync demo emails when changing role
  const handleSelectRole = (role: RoleTab) => {
    setSelectedRole(role);
    if (role === 'citizen') {
      setEmail('aarav.deshmukh@example.org');
    } else if (role === 'officer') {
      setEmail('sanjay.shinde@civicbridge.gov.in');
    } else if (role === 'department_admin') {
      setEmail('meera.kulkarni@civicbridge.gov.in');
    } else if (role === 'super_admin') {
      setEmail('commissioner.admin@civicbridge.gov.in');
    }
  };

  useEffect(() => {
    analyticsService.getPublicMetrics().then(setMetrics);
    complaintService.getComplaints().then((items) => {
      setRecentResolved(items.filter((p) => p.status === 'Resolved' || p.status === 'Citizen Verification').slice(0, 3));
    });
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'citizen') {
      loginAsCitizen(email, 'Aarav Deshmukh (Citizen)');
      showToast('success', 'Logged in as Citizen', 'Welcome to CivicBridge Citizen Portal.');
      navigate('/dashboard');
    } else if (selectedRole === 'officer') {
      loginAsOfficial('officer', email);
      showToast('success', 'Logged in as Field Officer', 'Municipal Dispatch & Field Resolution Console.');
      navigate('/admin');
    } else if (selectedRole === 'department_admin') {
      loginAsOfficial('department_admin', email);
      showToast('success', 'Logged in as Department Admin', 'Ward & Department Supervision Console.');
      navigate('/admin');
    } else {
      loginAsOfficial('super_admin', email);
      showToast('success', 'Logged in as Super Admin', 'Municipal Control Room & Citywide Governance.');
      navigate('/admin');
    }
  };

  const handleGoogleSignIn = () => {
    if (selectedRole === 'citizen') {
      loginAsCitizen('google.citizen@gmail.com', 'Verified Citizen User');
      showToast('success', 'Authenticated with Google', 'Citizen Session Initialized');
      navigate('/dashboard');
    } else {
      switchRoleForDemo(selectedRole);
      showToast('success', 'Single Sign-On Verified', `Role: ${selectedRole.replace('_', ' ').toUpperCase()}`);
      navigate('/admin');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsCitizen(regPhone || 'citizen@civicbridge.gov.in', regName || 'Registered Citizen');
    showToast('success', 'Account Registered', 'Welcome to CivicBridge. You can now submit and track complaints.');
    navigate('/dashboard');
  };

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      navigate(`/track?id=${encodeURIComponent(quickTrackId.trim())}`);
    } else {
      navigate('/track');
    }
  };

  const getRoleButtonLabel = () => {
    switch (selectedRole) {
      case 'citizen':
        return t.portalAuth.signInButton.citizen;
      case 'officer':
        return t.portalAuth.signInButton.officer;
      case 'department_admin':
        return t.portalAuth.signInButton.department_admin;
      case 'super_admin':
        return t.portalAuth.signInButton.super_admin;
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-slate-900 font-sans pb-16">
      {/* ===================================================
          1. HERO PORTAL SIGN-IN CARD (REFERENCE LAYOUT APPLIED TO CIVICBRIDGE)
         =================================================== */}
      <section className="pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* ================= LEFT COLUMN (DEEP SLATE / NAVY CIVIC IDENTITY) ================= */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 p-8 sm:p-10 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background Civic Emblem Watermark */}
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none text-blue-400">
              <Building2 className="w-96 h-96" strokeWidth={1} />
            </div>

            <div className="relative z-10">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-900/60 text-blue-300 border border-blue-500/40 mb-6 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                <span>{t.portalAuth.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.15] text-white mb-4">
                {t.brand.name}<br />
                <span className="text-blue-400 font-medium text-2xl sm:text-3xl">{t.portalAuth.tagline}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal mb-8 max-w-sm">
                {t.portalAuth.description}
              </p>

              {/* 3 Feature Highlights */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-300">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                    {t.portalAuth.feature1}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                    {t.portalAuth.feature2}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-300">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                    {t.portalAuth.feature3}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Institutional Disclaimer */}
            <div className="relative z-10 pt-8 mt-8 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 font-medium leading-tight">
                {t.portalAuth.govLabel}
              </p>
              <p className="text-[11px] text-blue-300 font-semibold mt-1">
                {t.portalAuth.govSublabel}
              </p>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (CLEAN WHITE AUTH FORM) ================= */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              {/* Top Header Row: "← Home" on left */}
              <div className="flex items-center justify-between pb-6 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    navigate('/');
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.nav.home}</span>
                </button>
              </div>

              {!isRegisterMode ? (
                <>
                  {/* Title & Subtitle */}
                  <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      {t.portalAuth.signInTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {t.portalAuth.signInSubtitle}
                    </p>
                  </div>

                  {/* SELECT YOUR ROLE */}
                  <div className="mb-5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                      {t.portalAuth.selectRoleLabel}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {/* 1. Citizen */}
                      <button
                        type="button"
                        onClick={() => handleSelectRole('citizen')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedRole === 'citizen'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                        }`}
                      >
                        <User className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.portalAuth.roles.citizen}</span>
                      </button>

                      {/* 2. Field Officer */}
                      <button
                        type="button"
                        onClick={() => handleSelectRole('officer')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedRole === 'officer'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.portalAuth.roles.officer}</span>
                      </button>

                      {/* 3. Department Admin */}
                      <button
                        type="button"
                        onClick={() => handleSelectRole('department_admin')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedRole === 'department_admin'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.portalAuth.roles.department_admin}</span>
                      </button>

                      {/* 4. Super Admin */}
                      <button
                        type="button"
                        onClick={() => handleSelectRole('super_admin')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedRole === 'super_admin'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.portalAuth.roles.super_admin}</span>
                      </button>
                    </div>

                    {/* Role Context Descriptor for Theme Alignment */}
                    <div className="mt-2.5 px-3 py-2 rounded-lg bg-blue-50/60 border border-blue-100 flex items-start gap-2 text-[11px] leading-relaxed text-slate-600">
                      <span className="font-bold text-blue-900 shrink-0">
                        {selectedRole === 'citizen' && (language === 'mr' ? 'नागरिक अधिकारक्षेत्र:' : language === 'hi' ? 'नागरिक भूमिका:' : 'Citizen Jurisdiction:')}
                        {selectedRole === 'officer' && (language === 'mr' ? 'क्षेत्रीय अभियंता:' : language === 'hi' ? 'वार्ड इंजीनियर:' : 'Field Engineer:')}
                        {selectedRole === 'department_admin' && (language === 'mr' ? 'विभाग प्रशासन:' : language === 'hi' ? 'विभाग प्रशासन:' : 'Dept Administration:')}
                        {selectedRole === 'super_admin' && (language === 'mr' ? 'आयुक्त नियंत्रण:' : language === 'hi' ? 'आयुक्त नियंत्रण:' : 'Municipal Commissioner:')}
                      </span>
                      <span className="text-slate-700">
                        {selectedRole === 'citizen' && (
                          language === 'mr'
                            ? 'समस्या नोंदणी, थेट SLA ट्रॅकिंग, कामाचा फोटो पडताळणी आणि नागरी उपविधींमध्ये मतदान.'
                            : language === 'hi'
                            ? 'वार्ड समस्याएं दर्ज करना, फोटो सत्यापन, और सार्वजनिक नीति परामर्श में सहभागिता।'
                            : 'Report civic issues, track live ward SLAs, inspect resolution proof, and vote in policy consultations.'
                        )}
                        {selectedRole === 'officer' && (
                          language === 'mr'
                            ? 'प्रभाग कार्य आदेश स्वीकारणे, घटनास्थळी जाऊन काम करणे आणि जिओ-टॅग फोटो पुरावा अपलोड करणे.'
                            : language === 'hi'
                            ? 'वार्ड कार्य आदेश प्राप्त करना, स्थल पर समाधान और जियो-टैग फोटो साक्ष्य अपलोड करना।'
                            : 'Receive ward dispatch orders, inspect sites on-ground, and upload geotagged completion proof.'
                        )}
                        {selectedRole === 'department_admin' && (
                          language === 'mr'
                            ? 'रस्ते, कचरा, पाणी विभागांचे पर्यवेक्षण, अधिकारी वाटप आणि प्रभाग SLA चेतावणी निवारण.'
                            : language === 'hi'
                            ? 'सड़क, स्वच्छता, जल आपूर्ति विभागों की निगरानी, कार्य आवंटन और SLA एस्केलेशन समाधान।'
                            : 'Supervise municipal departments (Roads, Waste, Water), assign dockets, and resolve SLA escalations.'
                        )}
                        {selectedRole === 'super_admin' && (
                          language === 'mr'
                            ? 'संपूर्ण महानगरपालिका SLA नियंत्रण कक्ष, प्रभाग अंकेक्षण आणि शहरव्यापी धोरण मान्यता.'
                            : language === 'hi'
                            ? 'संपूर्ण नगर निगम SLA निगरानी, प्रभाग ऑडिट और शहरव्यापी नीति अनुमोदन।'
                            : 'Citywide municipal command center, cross-ward SLA benchmarks, and immutable audit logs.'
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Sign In Form */}
                  <form onSubmit={handleSignIn} className="space-y-4">
                    {/* Email Input */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {t.portalAuth.emailLabel}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t.portalAuth.emailPlaceholder}
                          required
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-blue-600 focus:border-blue-600 bg-white transition-colors"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700">
                          {t.portalAuth.passwordLabel}
                        </label>
                        <button
                          type="button"
                          onClick={() => showToast('info', 'Password Reset', 'Password recovery instructions sent to registered phone/email.')}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          {t.portalAuth.forgotPassword}
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-blue-600 focus:border-blue-600 bg-white transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Session */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <input
                        id="remember-session"
                        type="checkbox"
                        checked={rememberSession}
                        onChange={(e) => setRememberSession(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-600 border-slate-300 accent-blue-600"
                      />
                      <label htmlFor="remember-session" className="text-xs text-slate-600 font-medium cursor-pointer">
                        {t.portalAuth.rememberSession}
                      </label>
                    </div>

                    {/* Sign In Primary Button */}
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <span>{getRoleButtonLabel()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Divider: OR CONTINUE WITH */}
                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                      <span className="bg-white px-3">{t.portalAuth.orContinueWith}</span>
                    </div>
                  </div>

                  {/* Continue with Google */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-2.5 px-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>{t.portalAuth.googleSignIn}</span>
                  </button>

                  {/* Register link footer */}
                  <div className="text-center mt-5">
                    <p className="text-xs text-slate-500">
                      {t.portalAuth.noAccount}{' '}
                      <button
                        type="button"
                        onClick={() => setIsRegisterMode(true)}
                        className="font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        {t.portalAuth.registerHere}
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                /* Registration Mode */
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {t.portalAuth.registerTitle}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {t.portalAuth.registerSubtitle}
                    </p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        {t.portalAuth.fullNameLabel}
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder={t.portalAuth.fullNamePlaceholder}
                        required
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        {t.portalAuth.mobileLabel}
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98201 44521"
                        required
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        {t.portalAuth.wardLabel}
                      </label>
                      <select
                        value={regWard}
                        onChange={(e) => setRegWard(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-blue-600 bg-white"
                      >
                        <option value="Ward 14, Pune Central">Ward 14, Pune Central</option>
                        <option value="Ward 12, Kothrud West">Ward 12, Kothrud West</option>
                        <option value="Ward 8, Hadapsar Industrial">Ward 8, Hadapsar Industrial</option>
                        <option value="Ward 21, Aundh">Ward 21, Aundh</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer mt-2"
                    >
                      {t.portalAuth.createAccountBtn}
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 underline"
                    >
                      {t.portalAuth.alreadyAccount}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Micro footer note */}
            <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>{t.portalAuth.encryptedSession}</span>
              <span>{t.portalAuth.versionTag}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          2. QUICK DOCKET TRACKER & SEARCH STRIP
         =================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {t.portalAuth.quickTrackBadge}
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              {t.portalAuth.quickTrackTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {t.portalAuth.quickTrackDesc}
            </p>
          </div>

          <form onSubmit={handleQuickTrack} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={quickTrackId}
                onChange={(e) => setQuickTrackId(e.target.value)}
                placeholder={t.portalAuth.quickTrackPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-blue-600 bg-slate-50 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              {t.portalAuth.quickTrackBtn}
            </button>
          </form>
        </div>
      </section>

      {/* ===================================================
          3. THE 5-STAGE CIVIC JOURNEY
         =================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {language === 'mr' ? 'नागरी उत्तरदायित्व जीवनचक्र' : language === 'hi' ? 'नागरिक जवाबदेही जीवनचक्र' : 'Civic Accountability Lifecycle'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">
              {language === 'mr' ? 'उत्तरदायी नागरी प्रवास' : language === 'hi' ? 'जवाबदेह नागरिक यात्रा' : 'The Accountable Civic Journey'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'mr'
                ? 'प्रत्यक्ष पुराव्यापासून विभाग वाटप, नागरिक पडताळणी आणि नगरपालिका धोरण निर्मितीपर्यंत.'
                : language === 'hi'
                ? 'जमीनी साक्ष्यों से लेकर विभाग आवंटन, नागरिक सत्यापन और नगर पालिका नीति निर्माण तक।'
                : 'From on-ground evidence to department dispatch, citizen verification, and municipal policy co-creation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                stage: '01',
                name: t.hero.journey.report,
                desc: language === 'mr' ? 'नागरिक पुरावे, जिओ-टॅगिंग आणि विभाग वर्गीकरण' : language === 'hi' ? 'नागरिक साक्ष्य, जियो-टैगिंग एवं विभाग आवंटन' : 'Citizen evidence, geo-tagging & category routing',
                icon: AlertCircle,
                color: 'text-blue-600 bg-blue-50 border-blue-200',
              },
              {
                stage: '02',
                name: t.hero.journey.action,
                desc: language === 'mr' ? 'प्रभाग अधिकाऱ्यास कार्य आदेश वाटप व SLA कालावधी' : language === 'hi' ? 'फील्ड अधिकारी को कार्य आदेश आवंटन व SLA समय-सीमा' : 'Department work order allocation to field officer',
                icon: Building2,
                color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
              },
              {
                stage: '03',
                name: t.hero.journey.verification,
                desc: language === 'mr' ? 'तक्रार बंद करण्यासाठी नागरिकांची प्रत्यक्ष पडताळणी आवश्यक' : language === 'hi' ? 'मामला बंद करने हेतु नागरिक फोटो निरीक्षण अनिवार्य' : 'Citizen photo inspection required to close case',
                icon: ShieldCheck,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
              },
              {
                stage: '04',
                name: t.hero.journey.innovation,
                desc: language === 'mr' ? 'प्रभागातील दीर्घकालीन समस्यांवर युवक व तज्ञांचे उपाय' : language === 'hi' ? 'वार्ड की पुरानी समस्याओं पर युवाओं व विशेषज्ञों के नवाचार' : 'Youth & expert solutions for chronic ward issues',
                icon: Lightbulb,
                color: 'text-amber-600 bg-amber-50 border-amber-200',
              },
              {
                stage: '05',
                name: t.hero.journey.policy,
                desc: language === 'mr' ? 'प्रभाग उपविधी आणि थेट लोकसहभागी सल्लामसलत' : language === 'hi' ? 'वार्ड उप-नियम एवं प्रत्यक्ष जन-भागीदारी परामर्श' : 'Ward bylaws and participatory public consultations',
                icon: Vote,
                color: 'text-purple-600 bg-purple-50 border-purple-200',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.stage}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {item.stage}
                      </span>
                      <div className={`p-1.5 rounded-lg border ${item.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================
          4. COMPARISON: BROKEN REDRESSAL VS CIVICBRIDGE STANDARD
         =================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              {language === 'mr' ? 'पडताळणीकृत सार्वजनिक निवारण' : language === 'hi' ? 'सत्यापित सार्वजनिक निवारण' : 'Verified Public Redressal'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {language === 'mr'
                ? 'पारंपरिक तक्रार निवारण का अपयशी ठरते — आणि सिव्हिकब्रिज ते कसे सुधारते'
                : language === 'hi'
                ? 'पारंपरिक शिकायत निवारण क्यों विफल होता है — और सिविकब्रिज इसे कैसे सुधारता है'
                : 'Why Traditional Grievances Fail — And How CivicBridge Fixes It'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* The Old Grievance System */}
            <div className="p-5 rounded-xl bg-rose-50/40 border border-rose-100 text-slate-800">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>
                  {language === 'mr'
                    ? 'पारंपरिक समस्या: तुटलेली निवारण यंत्रणा'
                    : language === 'hi'
                    ? 'पारंपरिक समस्या: अपूर्ण निवारण प्रणाली'
                    : 'The Traditional Problem: Broken Redressal'}
                </span>
              </div>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>
                    {language === 'mr'
                      ? 'तक्रारी प्रशासकीय प्रक्रियेत हरवून जातात आणि कोणतीही सार्वजनिक SLA पारदर्शकता नसते.'
                      : language === 'hi'
                      ? 'शिकायतें बिना किसी सार्वजनिक SLA पारदर्शिता के फाइलों में खो जाती हैं।'
                      : 'Complaints disappear into bureaucratic black boxes without public SLA transparency.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>
                    {language === 'mr'
                      ? 'छायाचित्र पुरावा किंवा नागरिकांच्या प्रत्यक्ष तपासणीशिवाय प्रकरण कागदावर "बंद" केले जाते.'
                      : language === 'hi'
                      ? 'फोटो साक्ष्य या नागरिक निरीक्षण के बिना मामले कागजों पर "बंद" कर दिए जाते हैं।'
                      : 'Cases are marked "closed" on paper without photographic proof or citizen inspection.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>
                    {language === 'mr'
                      ? 'दीर्घकालीन स्थानिक समस्यांवर नागरिकांना उपाय सुचवण्याची कोणतीही सोय नसते.'
                      : language === 'hi'
                      ? 'पुरानी सामुदायिक समस्याओं पर नागरिकों द्वारा समाधान प्रस्तुत करने का कोई विकल्प नहीं होता।'
                      : 'Zero mechanism for citizens to propose structural community solutions to chronic issues.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* The CivicBridge Standard */}
            <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-slate-900">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>
                  {language === 'mr'
                    ? 'सिव्हिकब्रिज मानक: खात्रीशीर उत्तरदायित्व'
                    : language === 'hi'
                    ? 'सिविकब्रिज मानक: सत्यापित जवाबदेही'
                    : 'The CivicBridge Standard: Verified Accountability'}
                </span>
              </div>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>
                      {language === 'mr' ? 'नागरिक पडताळणी लॉक: ' : language === 'hi' ? 'नागरिक सत्यापन लॉक: ' : 'Citizen Verification Lock: '}
                    </strong>
                    {language === 'mr'
                      ? 'तक्रारदार नागरिकाने प्रत्यक्ष पुरावा तपासून मंजुरी दिल्याशिवाय प्रकरण बंद होत नाही.'
                      : language === 'hi'
                      ? 'शिकायतकर्ता नागरिक द्वारा साक्ष्य की जांच और अनुमोदन के बिना मामला बंद नहीं हो सकता।'
                      : 'Cases cannot be closed until reporting citizens inspect resolution evidence.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>
                      {language === 'mr' ? 'पारदर्शक SLA: ' : language === 'hi' ? 'पारदर्शी SLA: ' : 'Transparent SLAs: '}
                    </strong>
                    {language === 'mr'
                      ? 'प्रभागातील प्रत्येक नागरिकाला दिसणारा सार्वजनिक कालावधी ट्रॅकर.'
                      : language === 'hi'
                      ? 'वार्ड के सभी निवासियों को दिखने वाला सार्वजनिक समय-सीमा ट्रैकर।'
                      : 'Public escalation countdowns visible to all ward residents.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>
                      {language === 'mr' ? 'कल्पना ते धोरण चक्र: ' : language === 'hi' ? 'विचार से नीति चक्र: ' : 'Idea-to-Policy Loop: '}
                    </strong>
                    {language === 'mr'
                      ? 'वारंवार उद्भवणाऱ्या समस्यांवर नागरी नवनिर्मिती आव्हाने आणि खुली सल्लामसलत सुरू होते.'
                      : language === 'hi'
                      ? 'बार-बार होने वाली समस्याओं पर नागरिक नवाचार चुनौतियाँ और खुला परामर्श शुरू होता है।'
                      : 'Recurring problems trigger municipal innovation challenges and open consultations.'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          5. LIVE TRANSPARENCY METRICS & EMERGENCY HELPLINES
         =================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: 24x7 Helplines */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <PhoneCall className="w-4 h-4" />
                <span>{language === 'mr' ? '२४x७ महानगरपालिका हेल्पलाईन' : language === 'hi' ? '२४x७ नगर निगम हेल्पलाइन' : '24x7 Municipal Lines'}</span>
              </div>
              <h4 className="text-lg font-extrabold text-white">
                {language === 'mr' ? 'थेट हेल्पलाईन संपर्क' : language === 'hi' ? 'सीधा हेल्पलाइन संपर्क' : 'Direct Helpline Access'}
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {language === 'mr'
                  ? 'आपत्कालीन नागरी धोके, पाणी दूषितीकरण किंवा धोकादायक खड्ड्यांसाठी संपर्क.'
                  : language === 'hi'
                  ? 'आपातकालीन नागरिक खतरों, दूषित पानी या खतरनाक गड्ढों के लिए संपर्क करें।'
                  : 'For emergency municipal hazards, water contamination, or hazardous road cave-ins.'}
              </p>
            </div>

            <div className="mt-4 space-y-2 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  {language === 'mr' ? 'महानगरपालिका हेल्पलाईन:' : language === 'hi' ? 'नगर निगम हेल्पलाइन:' : 'Municipal Helpline:'}
                </span>
                <strong className="text-white font-mono text-sm">1800-120-8040</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  {language === 'mr' ? 'आपत्ती व्यवस्थापन:' : language === 'hi' ? 'आपदा प्रबंधन:' : 'Disaster Management:'}
                </span>
                <strong className="text-white font-mono text-sm">112</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  {language === 'mr' ? 'सार्वजनिक तक्रार निवारण:' : language === 'hi' ? 'सार्वजनिक शिकायत मंच:' : 'Public Grievance Forum:'}
                </span>
                <strong className="text-white font-mono text-sm">1905</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Transparency Metrics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
                <Activity className="w-4 h-4" />
                <span>
                  {language === 'mr' ? 'अंकेक्षित कामगिरी' : language === 'hi' ? 'ऑडिटेड प्रदर्शन' : 'Audited Performance'}
                </span>
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">
                {language === 'mr' ? 'शहरव्यापी SLA निकष' : language === 'hi' ? 'शहरव्यापी SLA मानक' : 'Citywide SLA Benchmarks'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'mr'
                  ? 'सर्व प्रभागांमध्ये दररोज तपासले जाणारे सार्वजनिक कामगिरी निर्देशक.'
                  : language === 'hi'
                  ? 'सभी वार्डों में प्रतिदिन जांचे जाने वाले सार्वजनिक प्रदर्शन संकेतक।'
                  : 'Verified public performance indicators audited daily across all municipal wards.'}
              </p>
            </div>

            <div className="mt-4 space-y-2 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">
                  {language === 'mr' ? 'सरासरी अधिकारी वाटप वेळ:' : language === 'hi' ? 'औसत अधिकारी तैनाती समय:' : 'Avg Field Dispatch Time:'}
                </span>
                <strong className="text-slate-900 font-bold">{language === 'mr' ? '३.८ तास' : language === 'hi' ? '३.८ घंटे' : '3.8 Hours'}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">
                  {language === 'mr' ? 'वेळेवर SLA निवारण:' : language === 'hi' ? 'समय पर SLA निवारण:' : 'On-Time SLA Resolution:'}
                </span>
                <strong className="text-emerald-700 font-bold">96.8%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">
                  {language === 'mr' ? 'नागरिक-पडताळणी बंद प्रकरणे:' : language === 'hi' ? 'नागरिक-सत्यापित बंद मामले:' : 'Citizen-Verified Closures:'}
                </span>
                <strong className="text-slate-900 font-bold">14,280+</strong>
              </div>
            </div>
          </div>

          {/* Card 3: Report & Participate */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
                <Vote className="w-4 h-4" />
                <span>
                  {language === 'mr' ? 'लोकशाही सहभाग' : language === 'hi' ? 'लोकतांत्रिक सहभागिता' : 'Democratic Co-Creation'}
                </span>
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">
                {language === 'mr' ? 'नागरी सहभाग' : language === 'hi' ? 'नागरिक भागीदारी' : 'Citizen Participation'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'mr'
                  ? 'प्रभाग अंदाजपत्रक, पादचारी झोन आणि कचरा व्यवस्थापन उपविधींवर सार्वजनिक चर्चेत सामील व्हा.'
                  : language === 'hi'
                  ? 'वार्ड बजट, पैदल यात्री क्षेत्र और कचरा प्रबंधन उप-नियमों पर सार्वजनिक चर्चा में शामिल हों।'
                  : 'Join active public consultations on ward budgets, pedestrian zones, and waste management bylaws.'}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <Link
                to="/report"
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{t.nav.reportProblem}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/consultations"
                className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{t.nav.consultations}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
