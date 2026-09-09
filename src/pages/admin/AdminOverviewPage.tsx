import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { complaintService } from '../../services/complaintService';
import { analyticsService } from '../../services/analyticsService';
import { Problem, PublicMetrics } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ChevronRight,
  TrendingUp,
  UserCheck,
  FileCheck2,
  ExternalLink,
  Shield,
} from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const { user, role } = useAuth();
  const { t } = useLanguage();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [metrics, setMetrics] = useState<PublicMetrics | null>(null);

  useEffect(() => {
    complaintService.getComplaints().then(setProblems);
    analyticsService.getPublicMetrics().then(setMetrics);
  }, []);

  const openCases = problems.filter((p) => p.status !== 'Resolved');
  const criticalCases = problems.filter((p) => p.priority === 'Critical');
  const pendingVerification = problems.filter(
    (p) => p.status === 'Resolution Submitted' || p.status === 'Citizen Verification'
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Institutional Oversight Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time municipal grievance triage, SLA tracking, and resolution proof audit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/problems"
            className="px-3.5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs"
          >
            Manage All Problems ({problems.length})
          </Link>
        </div>
      </div>

      {/* Top KPI Metric Cards (Section 19 requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{t.admin.totalOpen}</span>
            <AlertCircle className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5">{openCases.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active across 4 wards</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-rose-700 font-semibold">
            <span>{t.admin.highPriority}</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-1.5">{criticalCases.length}</p>
          <span className="text-[11px] text-rose-600 mt-1 block">Immediate dispatch</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-amber-800 font-semibold">
            <span>{t.admin.dueToday}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-1.5">3</p>
          <span className="text-[11px] text-amber-700 mt-1 block">SLA target &lt; 8 hours</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-purple-800 font-semibold">
            <span>Citizen Verify</span>
            <FileCheck2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-1.5">{pendingVerification.length}</p>
          <span className="text-[11px] text-purple-700 mt-1 block">Proof uploaded</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold">
            <span>{t.admin.resolved}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-1.5">
            {problems.filter((p) => p.status === 'Resolved').length}
          </p>
          <span className="text-[11px] text-emerald-700 mt-1 block">Fully verified</span>
        </div>
      </div>

      {/* Grid: Recent Problems Table & SLA Alert Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Problems (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Active Municipal Grievance Docket
            </h2>
            <Link
              to="/admin/problems"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All Records</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Reference ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {problems.slice(0, 6).map((prob) => (
                  <tr key={prob.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {prob.id}
                    </td>
                    <td className="p-3 font-medium text-slate-900 max-w-[200px] truncate" title={prob.title}>
                      {prob.title}
                    </td>
                    <td className="p-3 text-slate-600 max-w-[150px] truncate">
                      {prob.department}
                    </td>
                    <td className="p-3">
                      <PriorityBadge priority={prob.priority} size="sm" />
                    </td>
                    <td className="p-3">
                      <StatusBadge status={prob.status} size="sm" />
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/admin/problems/${prob.id}`}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px]"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: SLA Alert Feed & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>SLA Escalation Alerts</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded border border-rose-200 bg-rose-50/60 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-rose-950">
                  <span>CIV-2026-001026</span>
                  <span className="text-[10px] bg-rose-200 px-1.5 py-0.2 rounded font-mono">1.2h left</span>
                </div>
                <p className="text-rose-800 line-clamp-1">
                  Water Contamination & Pipeline Rupture
                </p>
                <div className="flex justify-between items-center text-[10px] text-rose-700 pt-1">
                  <span>Ward 14 • Field Team Dispatched</span>
                  <Link to="/admin/problems/CIV-2026-001026" className="font-bold underline">
                    Prioritize
                  </Link>
                </div>
              </div>

              <div className="p-3 rounded border border-amber-200 bg-amber-50/60 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-amber-950">
                  <span>CIV-2026-001024</span>
                  <span className="text-[10px] bg-amber-200 px-1.5 py-0.2 rounded font-mono">6.4h left</span>
                </div>
                <p className="text-amber-800 line-clamp-1">
                  Deep Pothole & Caved Asphalt
                </p>
                <div className="flex justify-between items-center text-[10px] text-amber-700 pt-1">
                  <span>Pending Citizen Verification</span>
                  <Link to="/admin/problems/CIV-2026-001024" className="font-bold underline">
                    Review Proof
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Department Link */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Statutory Compliance Notice</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every status alteration and evidence upload is cryptographically recorded to ensure civic transparency under the Public Grievance Charter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
