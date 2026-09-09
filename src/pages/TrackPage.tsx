import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { complaintService } from '../services/complaintService';
import { Problem } from '../types';
import { TimelineView } from '../components/complaints/TimelineView';
import { CitizenVerificationCard } from '../components/complaints/CitizenVerificationCard';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { AiAssessmentCard } from '../components/common/AiAssessmentCard';
import {
  Search,
  MapPin,
  Building2,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Shield,
  Loader2,
  Sparkles,
  Paperclip,
} from 'lucide-react';

export const TrackPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || 'CIV-2026-001024';

  const [searchId, setSearchId] = useState(initialId);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [sampleProblems, setSampleProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    complaintService.getComplaints().then((list) => {
      setSampleProblems(list.slice(0, 4));
    });
  }, []);

  const loadCase = async (idToLoad: string) => {
    if (!idToLoad.trim()) return;
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await complaintService.getComplaintById(idToLoad.trim());
      if (res) {
        setProblem(res);
        setSearchParams({ id: idToLoad.trim() });
      } else {
        setProblem(null);
        setErrorMessage(t.track.caseNotFound);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error retrieving case docket');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      loadCase(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCase(searchId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header & Search */}
      <div className="max-w-3xl">
        <span className="text-xs uppercase font-bold tracking-wider text-blue-600">
          Public Case Redressal Audit
        </span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.track.title}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
          {t.track.subtitle}
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="mt-5 flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder={t.track.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded border border-slate-300 bg-white focus:outline-blue-600 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.track.searchBtn}
          </button>
        </form>

        {/* Quick Sample Selector */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-medium">{t.track.recentCases}:</span>
          {sampleProblems.map((sp) => (
            <button
              key={sp.id}
              type="button"
              onClick={() => {
                setSearchId(sp.id);
                loadCase(sp.id);
              }}
              className={`px-2 py-0.5 rounded font-mono text-[11px] border cursor-pointer ${
                problem?.id === sp.id
                  ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {sp.id}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Track View */}
      {problem && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Main Timeline & Problem Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Docket Header Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    {problem.id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Logged: {new Date(problem.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={problem.priority} size="sm" />
                  <StatusBadge status={problem.status} size="md" />
                </div>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {problem.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {problem.description}
                </p>
              </div>

              {/* Meta tags row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Location:</span>{' '}
                    <span>{problem.location.address}, {problem.location.ward}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Department:</span>{' '}
                    <span>{problem.department}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Citizen Verification Section */}
            <CitizenVerificationCard
              problem={problem}
              onVerificationSubmitted={(updated) => setProblem(updated)}
            />

            {/* Resolution Evidence Box (if submitted) */}
            {problem.resolutionEvidence && (
              <div className="bg-white rounded-xl border border-teal-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-teal-100">
                  <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                    <FileCheck2 className="w-4 h-4 text-teal-700" />
                    <span>{t.track.resolutionProof}</span>
                  </div>
                  <span className="text-[11px] font-mono bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                    Work Order: {problem.resolutionEvidence.workOrderRef || 'WO-COMPLETED'}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  {problem.resolutionEvidence.notes}
                </p>

                {problem.resolutionEvidence.media.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block mb-2">
                      Department Completion Proof Media:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {problem.resolutionEvidence.media.map((item) => (
                        <div key={item.id} className="rounded border border-slate-200 overflow-hidden bg-slate-100">
                          {item.type === 'image' && (
                            <img
                              src={item.url}
                              alt="Work completion evidence"
                              className="w-full h-40 object-cover"
                            />
                          )}
                          <div className="p-2 text-[11px] text-slate-600 bg-white">
                            <span>{item.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 pt-2 flex items-center justify-between border-t border-slate-100">
                  <span>Certified by: {problem.resolutionEvidence.submittedBy} ({problem.resolutionEvidence.officerDesignation})</span>
                  <span>Date: {problem.resolutionEvidence.completionDate}</span>
                </div>
              </div>
            )}

            {/* Timeline View */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  {t.track.timelineHeading}
                </h3>
                <span className="text-xs text-slate-400">
                  {problem.timeline.length} Recorded Steps
                </span>
              </div>

              <TimelineView events={problem.timeline} currentStatus={problem.status} />
            </div>
          </div>

          {/* Right Col: Admin & SLA Metrics */}
          <div className="space-y-6">
            {/* Responsible Officer Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.track.officerDetails}
              </h3>

              <div className="flex items-start gap-3 pt-1">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                  {problem.assignedOfficer?.name
                    ? problem.assignedOfficer.name.split(' ').map((n) => n[0]).join('')
                    : 'DE'}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {problem.assignedOfficer?.name || 'Department Central Pool'}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    {problem.assignedOfficer?.designation || 'Pending Field Dispatch'}
                  </p>
                  <p className="text-xs text-blue-700 mt-1 truncate">
                    {problem.department}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">SLA Target Deadline:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(problem.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Impact Scope:</span>
                  <span className="font-medium text-slate-800">{problem.impactScope}</span>
                </div>
              </div>
            </div>

            {/* AI Assessment Card */}
            <AiAssessmentCard assessment={problem.aiAssessment} />

            {/* Attached Citizen Evidence */}
            {problem.evidence.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Citizen Evidence Uploaded ({problem.evidence.length})</span>
                </h3>

                <div className="space-y-2">
                  {problem.evidence.map((item) => (
                    <div key={item.id} className="p-2 rounded border border-slate-200 bg-slate-50 text-xs">
                      {item.type === 'image' && (
                        <img
                          src={item.url}
                          alt="Citizen evidence"
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                      )}
                      <span className="font-medium text-slate-800 truncate block">{item.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.type.toUpperCase()} • {new Date(item.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
