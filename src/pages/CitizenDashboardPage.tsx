import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { complaintService } from '../services/complaintService';
import { innovationService } from '../services/innovationService';
import { consultationService } from '../services/consultationService';
import { Problem, Innovation, Consultation } from '../types';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import {
  FileText,
  PlusCircle,
  Clock,
  ShieldCheck,
  Lightbulb,
  Vote,
  MapPin,
  ChevronRight,
  User,
  ArrowRight,
  AlertCircle,
  Building2,
} from 'lucide-react';

export const CitizenDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [innovations, setInnovations] = useState<Innovation[]>([]);
  const [activeTab, setActiveTab] = useState<'problems' | 'innovations'>('problems');

  useEffect(() => {
    complaintService.getComplaints().then(setProblems);
    innovationService.getInnovations().then(setInnovations);
  }, []);

  const pendingVerificationCount = problems.filter(
    (p) => p.status === 'Resolution Submitted' || p.status === 'Citizen Verification'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Citizen Welcome Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shrink-0">
            {user?.name?.split(' ').map((n) => n[0]).join('') || 'CU'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Welcome, {user?.name || 'Citizen User'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Personal civic dossier • Ward 14 (Shivajinagar) Resident
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report a New Problem</span>
          </Link>
        </div>
      </div>

      {/* Verification Attention Banner (if any) */}
      {pendingVerificationCount > 0 && (
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-purple-100 text-purple-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                Action Required: {pendingVerificationCount} Resolution Awaiting Verification
              </h4>
              <p className="text-xs text-purple-800 mt-0.5">
                The municipal engineer has uploaded completion proof. Please inspect and verify on-ground resolution.
              </p>
            </div>
          </div>

          <Link
            to="/track?id=CIV-2026-001024"
            className="px-3.5 py-1.5 rounded bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shrink-0 self-start sm:self-auto"
          >
            Inspect & Verify Case
          </Link>
        </div>
      )}

      {/* KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-500">Reported by You</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{problems.length}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-500">Awaiting Verification</span>
          <p className="text-2xl font-bold text-purple-600 mt-1">{pendingVerificationCount}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-500">Verified Closed</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {problems.filter((p) => p.status === 'Resolved').length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-500">Innovations Backed</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{innovations.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('problems')}
            className={`text-xs font-bold pb-1 cursor-pointer transition-colors ${
              activeTab === 'problems'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Your Reported Problems ({problems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('innovations')}
            className={`text-xs font-bold pb-1 cursor-pointer transition-colors ${
              activeTab === 'innovations'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Your Innovation Submissions ({innovations.length})
          </button>
        </div>

        {/* Tab 1: Problems */}
        {activeTab === 'problems' && (
          <div className="space-y-3">
            {problems.map((prob) => (
              <div
                key={prob.id}
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {prob.id}
                    </span>
                    <PriorityBadge priority={prob.priority} size="sm" />
                    <StatusBadge status={prob.status} size="sm" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{prob.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{prob.description}</p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {prob.location.ward}
                    </span>
                    <span>•</span>
                    <span>{prob.department}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/track?id=${prob.id}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                  >
                    <span>Track & Audit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Innovations */}
        {activeTab === 'innovations' && (
          <div className="space-y-3">
            {innovations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      {item.stage}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-600 font-medium">{item.votes} votes</span>
                  <Link
                    to={`/innovations/${item.id}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                  >
                    <span>View Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
