import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { analyticsService } from '../services/analyticsService';
import { PublicMetrics, ProblemCategory } from '../types';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Building2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#64748b'];

export const PublicDashboardPage: React.FC = () => {
  const { t } = useLanguage();

  const [metrics, setMetrics] = useState<PublicMetrics | null>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('90d');
  const [selectedWard, setSelectedWard] = useState('All Wards');

  useEffect(() => {
    analyticsService.getPublicMetrics().then(setMetrics);
    analyticsService.getCategoryBreakdown().then(setCategoryData);
    analyticsService.getResolutionTrends().then(setTrends);
    analyticsService.getDepartmentPerformance().then(setDeptData);
  }, []);

  const handleExportCSV = () => {
    const csvRows = [
      ['Metric', 'Value'],
      ['Total Reported', metrics?.totalReported || 12481],
      ['Total Resolved', metrics?.totalResolved || 9842],
      ['Under Review', metrics?.underReview || 1204],
      ['In Progress', metrics?.inProgress || 1120],
      ['Citizen Verification Rate (%)', metrics?.verificationRate || 78.4],
      ['SLA Compliance Rate (%)', metrics?.slaComplianceRate || 86.2],
      ['Average Resolution Days', metrics?.averageResolutionDays || 3.2],
      ['Active Civic Hotspots', metrics?.hotspotsIdentified || 18],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CivicBridge_Public_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const verificationBreakdown = [
    { name: 'Citizen Verified', value: 78, color: '#10b981' },
    { name: 'Pending Verification', value: 16, color: '#8b5cf6' },
    { name: 'Citizen Disputed', value: 6, color: '#f43f5e' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-600">
            Open Data & Performance Audits
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.publicStats.title}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Real-time administrative SLA tracking, ward resolution rates, and public accountability metrics.
          </p>
        </div>

        {/* Export and Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs p-2 rounded border border-slate-300 bg-white font-medium text-slate-700"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last 1 Year</option>
          </select>

          {/* Ward selector */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="text-xs p-2 rounded border border-slate-300 bg-white font-medium text-slate-700"
          >
            <option value="All Wards">All Municipal Wards</option>
            <option value="Ward 14">Ward 14 (Shivajinagar)</option>
            <option value="Ward 22">Ward 22 (Kothrud)</option>
            <option value="Ward 08">Ward 08 (Viman Nagar)</option>
            <option value="Ward 31">Ward 31 (Hadapsar)</option>
          </select>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Reported</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            {metrics?.totalReported.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +12% this month
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Resolved</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {metrics?.totalResolved.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">With completion proof</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Citizen Verification</span>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">
            {metrics?.verificationRate}%
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Independently verified</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">SLA Compliance</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">
            {metrics?.slaComplianceRate}%
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Within statutory target</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Avg Resolution Time</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            {metrics?.averageResolutionDays} days
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Target: ≤ 5.0 days</span>
        </div>
      </div>

      {/* Row 1 Charts: Monthly Trend & Verification Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Monthly Trends: Problems Reported vs Resolved
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Aggregated Monthly</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="reported"
                  name="Reported Problems"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved Cases"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification Status Breakdown (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Citizen Verification Ratio
            </h3>
            <span className="text-[11px] text-slate-400">Resolution Audit</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={verificationBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {verificationBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
            {verificationBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Category Breakdown & Department SLA Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Problems by Public Domain Category
            </h3>
            <span className="text-[11px] text-slate-400">Volume</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Reported Volume" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Performance Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Department SLA Compliance & Speed
            </h3>
            <span className="text-[11px] text-slate-400">Institutional Audit</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Department</th>
                  <th className="p-2.5">Resolved</th>
                  <th className="p-2.5">SLA Rate</th>
                  <th className="p-2.5">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptData.map((d) => (
                  <tr key={d.name} className="hover:bg-slate-50">
                    <td className="p-2.5 font-medium text-slate-800">{d.name}</td>
                    <td className="p-2.5 text-slate-600 font-mono">{d.resolved}</td>
                    <td className="p-2.5">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {d.slaCompliance}%
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-700 font-medium">{d.avgDays} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
