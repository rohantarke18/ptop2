import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { UserRole } from '../types';
import { Shield, Lock, Mail, ChevronRight, UserCheck, AlertTriangle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, switchRoleForDemo } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [email, setEmail] = useState('officer.salvi@civicbridge.gov.in');
  const [password, setPassword] = useState('GovSecure@2026');
  const [selectedRole, setSelectedRole] = useState<UserRole>('officer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      loginAdmin(email, password, selectedRole);
      showToast('success', 'Access Granted', `Signed in as ${selectedRole.replace('_', ' ')}`);
      navigate('/admin');
      setIsLoading(false);
    }, 600);
  };

  const roles: { key: UserRole; title: string; email: string; dept: string }[] = [
    {
      key: 'officer',
      title: 'Field Executive Engineer',
      email: 'officer.salvi@civicbridge.gov.in',
      dept: 'Road Maintenance & Civil Infrastructure',
    },
    {
      key: 'department_admin',
      title: 'Additional Municipal Commissioner',
      email: 'admin.sharma@civicbridge.gov.in',
      dept: 'Central Municipal Administration',
    },
    {
      key: 'expert',
      title: 'Civic Advisory Committee Member',
      email: 'prof.mehta@civicbridge.gov.in',
      dept: 'Urban Planning Advisory Council',
    },
    {
      key: 'super_admin',
      title: 'Municipal Chief Admin Officer',
      email: 'chief.director@civicbridge.gov.in',
      dept: 'Department of Public Grievances',
    },
  ];

  const handleSelectRole = (r: typeof roles[0]) => {
    setSelectedRole(r.key);
    setEmail(r.email);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xl mx-auto shadow-md font-serif">
          CB
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          CivicBridge Administration
        </h1>
        <p className="text-xs text-amber-400/90 uppercase tracking-wider font-semibold">
          Authorized Municipal Personnel Only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-xl rounded-xl sm:px-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-slate-300 mb-1">
                Official Government Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded border border-slate-700 bg-slate-800 text-white focus:outline-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-slate-300 mb-1">
                Secure Credential Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded border border-slate-700 bg-slate-800 text-white focus:outline-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Select Official Persona for Audit & Evaluation:
              </label>
              <div className="space-y-1.5">
                {roles.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => handleSelectRole(r)}
                    className={`w-full text-left p-2 rounded border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      selectedRole === r.key
                        ? 'border-blue-500 bg-blue-950/40 text-white font-semibold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{r.title}</p>
                      <p className="text-[10px] text-slate-500">{r.dept}</p>
                    </div>
                    {selectedRole === r.key && (
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Verifying Credentials...' : 'Authenticate & Enter Admin Console'}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-white">
              ← Return to Citizen Public Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
