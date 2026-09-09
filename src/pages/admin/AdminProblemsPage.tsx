import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Problem, ProblemStatus, PriorityLevel, ProblemCategory } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminProblemsPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useNotifications();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date_desc' | 'priority' | 'sla'>('date_desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    complaintService.getComplaints().then(setProblems);
  }, []);

  // Filter & Search Logic
  const filteredProblems = problems.filter((p) => {
    if (selectedDept !== 'All' && p.department !== selectedDept) return false;
    if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
    if (selectedPriority !== 'All' && p.priority !== selectedPriority) return false;
    if (selectedWard !== 'All' && !p.location.ward.includes(selectedWard)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = p.id.toLowerCase().includes(q);
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCitizen = p.citizenName.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchCitizen && !matchDesc) return false;
    }

    return true;
  });

  // Sort logic
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortBy === 'priority') {
      const pWeights = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return pWeights[b.priority] - pWeights[a.priority];
    }
    if (sortBy === 'sla') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    // Default date_desc
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPages = Math.ceil(sortedProblems.length / itemsPerPage) || 1;
  const paginatedProblems = sortedProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedProblems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedProblems.map((p) => p.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkStatusChange = (status: ProblemStatus) => {
    if (selectedIds.size === 0) return;
    showToast('info', 'Bulk Action Applied', `Updated ${selectedIds.size} cases to "${status}".`);
    setSelectedIds(new Set());
  };

  const getSlaBadge = (deadlineStr: string, status: ProblemStatus) => {
    if (status === 'Resolved') {
      return <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Met SLA</span>;
    }
    const diffHours = (new Date(deadlineStr).getTime() - new Date().getTime()) / (1000 * 3600);
    if (diffHours < 0) {
      return <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Overdue</span>;
    }
    if (diffHours <= 24) {
      return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">At Risk</span>;
    }
    return <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">On Track</span>;
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Administrative Grievance Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit, assign, and track the full resolution lifecycle of registered public problems.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded text-xs text-blue-900 font-medium">
              <span>{selectedIds.size} Selected</span>
              <button
                type="button"
                onClick={() => handleBulkStatusChange('In Progress')}
                className="bg-blue-600 text-white px-2 py-0.5 rounded text-[11px] font-bold"
              >
                Mark In Progress
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, keyword, citizen name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-blue-600 bg-white"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full text-xs p-1.5 rounded border border-slate-300 bg-white"
            >
              <option value="All">All Departments</option>
              <option value="Municipal Road Maintenance & Civil Infrastructure">Road Maintenance</option>
              <option value="Department of Water Supply & Drainage">Water Supply</option>
              <option value="Solid Waste Management Division">Solid Waste</option>
              <option value="Traffic & Transport Engineering Cell">Traffic Cell</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs p-1.5 rounded border border-slate-300 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolution Submitted">Resolution Submitted</option>
              <option value="Citizen Verification">Citizen Verification</option>
              <option value="Resolved">Resolved</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full text-xs p-1.5 rounded border border-slate-300 bg-white"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Sort & Count row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <button
              type="button"
              onClick={() => setSortBy('date_desc')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                sortBy === 'date_desc' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Recent First
            </button>
            <button
              type="button"
              onClick={() => setSortBy('priority')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                sortBy === 'priority' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Priority High-Low
            </button>
            <button
              type="button"
              onClick={() => setSortBy('sla')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                sortBy === 'sla' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'
              }`}
            >
              SLA Deadline
            </button>
          </div>

          <div>
            Showing <strong>{sortedProblems.length}</strong> matching records
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paginatedProblems.length && paginatedProblems.length > 0}
                    onChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="p-3">Reference ID</th>
                <th className="p-3">Title & Ward</th>
                <th className="p-3">Department</th>
                <th className="p-3">Assigned Officer</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">SLA Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProblems.map((prob) => {
                const isSelected = selectedIds.has(prob.id);

                return (
                  <tr key={prob.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(prob.id)}
                        aria-label={`Select ${prob.id}`}
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {prob.id}
                    </td>
                    <td className="p-3 max-w-[240px]">
                      <p className="font-semibold text-slate-900 truncate" title={prob.title}>
                        {prob.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{prob.location.ward}</p>
                    </td>
                    <td className="p-3 max-w-[150px] truncate text-slate-700" title={prob.department}>
                      {prob.department}
                    </td>
                    <td className="p-3 text-slate-700 whitespace-nowrap">
                      {prob.assignedOfficer?.name ? (
                        <span className="font-medium text-slate-900">{prob.assignedOfficer.name}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3">
                      <PriorityBadge priority={prob.priority} size="sm" />
                    </td>
                    <td className="p-3">
                      <StatusBadge status={prob.status} size="sm" />
                    </td>
                    <td className="p-3">
                      {getSlaBadge(prob.deadline, prob.status)}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/admin/problems/${prob.id}`}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] inline-block"
                      >
                        Inspect Docket
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
