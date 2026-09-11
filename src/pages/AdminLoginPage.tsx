import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { UserRole } from '../types';
import { Shield, Lock, Mail, ChevronRight, UserCheck, AlertCircle, Loader2 } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginWithGoogle, loginAsOfficial } = useAuth();
  const { language } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('officer');
  const [officialEmail, setOfficialEmail] = useState('officer.salvi@civicbridge.gov.in');
  const [officialName, setOfficialName] = useState('Er. Milind Salvi');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const roles: { key: UserRole; title: string; email: string; name: string; dept: string }[] = [
    {
      key: 'officer',
      title: 'Field Executive Engineer',
      email: 'officer.salvi@civicbridge.gov.in',
      name: 'Er. Milind Salvi',
      dept: 'Road Maintenance & Civil Infrastructure',
    },
    {
      key: 'department_admin',
      title: 'Additional Municipal Commissioner',
      email: 'admin.sharma@civicbridge.gov.in',
      name: 'Dr. Sunita Sharma, IAS',
      dept: 'Central Municipal Administration',
    },
    {
      key: 'expert',
      title: 'Civic Advisory & Innovation Expert',
      email: 'prof.mehta@civicbridge.gov.in',
      name: 'Prof. Ramesh Mehta',
      dept: 'Urban Planning Advisory Council',
    },
    {
      key: 'super_admin',
      title: 'Municipal Chief Admin Officer',
      email: 'chief.director@civicbridge.gov.in',
      name: 'P. K. Verma',
      dept: 'Department of Public Grievances',
    },
  ];

  const handleSelectRole = (r: typeof roles[0]) => {
    setSelectedRole(r.key);
    setOfficialEmail(r.email);
    setOfficialName(r.name);
  };

  const handleOfficialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const user = await loginAsOfficial(selectedRole, officialEmail, officialName);
      showToast('success', 'Official Access Granted', `Signed in as ${user.designation || user.role}`);
      navigate('/admin');
    } catch (err: any) {
      console.error('Official login error:', err);
      setErrorMessage(err?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAdminSignIn = async () => {
    setIsLoadingGoogle(true);
    setErrorMessage(null);

    try {
      const user = await loginWithGoogle(selectedRole);
      showToast('success', 'Google Verification Verified', `Authorized as ${user.designation || user.role}`);
      navigate('/admin');
    } catch (err: any) {
      console.error('Google Admin Sign-in error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Google authentication cancelled.');
      } else {
        setErrorMessage(err?.message || 'Failed to authenticate via Google.');
      }
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-2xl mx-auto shadow-md font-serif">
          CB
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          CivicBridge Administration
        </h1>
        <p className="text-xs text-amber-400/90 uppercase tracking-wider font-semibold">
          Authorized Municipal & Governance Personnel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-xl rounded-2xl sm:px-10 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-lg text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Direct Google Sign In for Officials */}
          <div>
            <button
              type="button"
              onClick={handleGoogleAdminSignIn}
              disabled={isLoading || isLoadingGoogle}
              className="w-full py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingGoogle ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>
                {isLoadingGoogle ? 'Authenticating...' : 'Sign In with Official Google Account'}
              </span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800" />
            <span className="flex-shrink mx-4 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Or Select Administrative Level
            </span>
            <div className="flex-grow border-t border-slate-800" />
          </div>

          {/* Role selector buttons */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-slate-400">
              Department & Administrative Role
            </label>
            <div className="grid grid-cols-1 gap-2">
              {roles.map((r) => {
                const isSelected = selectedRole === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => handleSelectRole(r)}
                    className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500/30'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? 'bg-amber-400' : 'bg-slate-600'
                          }`}
                        />
                        <span>{r.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 pl-3.5">{r.dept}</div>
                    </div>
                    {isSelected && <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleOfficialSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-slate-300 mb-1">
                Official Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="admin-email"
                  type="email"
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isLoadingGoogle}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
              <span>Access Governance Console</span>
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-800">
            <Link
              to="/login"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Return to Citizen Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
