import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { complaintService } from '../services/complaintService';
import { Problem } from '../types';
import { getLocalizedProblem } from '../utils/localizedData';
import { TimelineView } from '../components/complaints/TimelineView';
import { CitizenVerificationCard } from '../components/complaints/CitizenVerificationCard';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { AiAssessmentCard } from '../components/common/AiAssessmentCard';
import {
  Search,
  MapPin,
  Building2,
  AlertCircle,
  Loader2,
  Paperclip,
  Trash2,
  Edit3,
  Calendar,
  PlusCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const TrackPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAdminOrOfficer } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlId = searchParams.get('id') || '';
  const [searchId, setSearchId] = useState(urlId);
  const [rawProblem, setProblem] = useState<Problem | null>(null);
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const problem = useMemo(() => {
    return rawProblem ? getLocalizedProblem(rawProblem, language) : null;
  }, [rawProblem, language]);

  const loadCase = async (idToLoad: string) => {
    if (!idToLoad.trim()) return;
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await complaintService.getComplaintById(idToLoad.trim());
      if (res) {
        setProblem(res);
        setEditTitle(res.title);
        setEditDesc(res.description);
        setSearchParams({ id: idToLoad.trim() });
      } else {
        setProblem(null);
        setErrorMessage(t.track.caseNotFound || `Case ${idToLoad} not found.`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error retrieving case docket');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    complaintService.getComplaints().then((list) => {
      const safeList = Array.isArray(list) ? list : [];
      setAllProblems(safeList);
      if (urlId) {
        loadCase(urlId);
      } else if (safeList.length > 0) {
        // Load latest
        setSearchId(safeList[0].id);
        loadCase(safeList[0].id);
      }
    });
  }, [urlId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCase(searchId);
  };

  const handleDelete = async () => {
    if (!problem) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete case docket ${problem.id}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await complaintService.deleteComplaint(problem.id);
      showToast('success', 'Case Deleted', `Docket ${problem.id} has been permanently deleted.`);

      const remaining = allProblems.filter((p) => p.id !== problem.id);
      setAllProblems(remaining);

      if (remaining.length > 0) {
        setSearchId(remaining[0].id);
        loadCase(remaining[0].id);
      } else {
        setProblem(null);
        setSearchParams({});
      }
    } catch (err: any) {
      showToast('error', 'Delete Failed', err?.message || 'Could not delete case.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem) return;
    if (!editTitle.trim() || !editDesc.trim()) return;

    try {
      setIsSavingEdit(true);
      const updated = await complaintService.updateComplaint(problem.id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
      });
      setProblem(updated);
      setIsEditing(false);
      showToast('success', 'Docket Updated', 'Complaint details updated successfully.');
    } catch (err: any) {
      showToast('error', 'Update Failed', err?.message || 'Could not save updates.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const canModify =
    isAdminOrOfficer ||
    (user && rawProblem && (rawProblem.reporterUid === user.id || rawProblem.citizenName === user.name));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header & Search */}
      <div className="max-w-3xl">
        <span className="text-xs uppercase font-bold tracking-wider text-blue-600">
          {language === 'mr'
            ? 'सार्वजनिक तक्रार निवारण लेखापरीक्षण'
            : language === 'hi'
            ? 'सार्वजनिक समस्या निवारण ऑडिट'
            : 'Public Case Redressal Audit'}
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
              placeholder={t.track.searchPlaceholder || 'Enter Reference ID e.g. CIV-2026-XXXX'}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-blue-600 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.track.searchBtn || 'Track Case'}
          </button>
        </form>

        {/* Recent Cases Selector */}
        {allProblems.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-medium">{t.track.recentCases || 'Logged Cases'}:</span>
            {allProblems.slice(0, 5).map((sp) => (
              <button
                key={sp.id}
                type="button"
                onClick={() => {
                  setSearchId(sp.id);
                  loadCase(sp.id);
                }}
                className={`px-2 py-0.5 rounded font-mono text-[11px] border cursor-pointer transition-colors ${
                  problem?.id === sp.id
                    ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {sp.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <Link
            to="/report"
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold"
          >
            Report Problem
          </Link>
        </div>
      )}

      {/* If No Problems Exist in System */}
      {!problem && allProblems.length === 0 && !isLoading && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No Problems Recorded Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              You are running on a clean live database. File your first civic grievance to begin real-time tracking.
            </p>
          </div>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>File New Grievance</span>
          </Link>
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
                    {language === 'mr' ? 'नोंदणी: ' : language === 'hi' ? 'दर्ज तिथि: ' : 'Logged: '}
                    {new Date(problem.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={problem.priority} size="sm" />
                  <StatusBadge status={problem.status} size="md" />
                  {canModify && (
                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                        title="Edit Docket"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Docket"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Editing Form */}
              {isEditing ? (
                <form onSubmit={handleSaveEdit} className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block">Edit Problem Details</span>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Description</label>
                    <textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingEdit}
                      className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                    >
                      {isSavingEdit ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {problem.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              )}

              {/* Meta tags row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">
                      {language === 'mr' ? 'स्थान:' : language === 'hi' ? 'स्थान:' : 'Location:'}
                    </span>{' '}
                    <span>
                      {problem.location.address}, {problem.location.ward}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">
                      {language === 'mr' ? 'विभाग:' : language === 'hi' ? 'विभाग:' : 'Department:'}
                    </span>{' '}
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
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Official Resolution Work Order Evidence
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {problem.resolutionEvidence.workOrderRef}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {problem.resolutionEvidence.notes}
                </p>

                {problem.resolutionEvidence.media && problem.resolutionEvidence.media.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {problem.resolutionEvidence.media.map((med) => (
                      <div
                        key={med.id}
                        className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50"
                      >
                        {med.type === 'image' ? (
                          <img
                            src={med.url}
                            alt={med.name}
                            className="w-full h-28 object-cover"
                          />
                        ) : (
                          <div className="p-3 text-center text-xs text-slate-600">
                            <Paperclip className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                            <span className="truncate block font-medium">{med.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Timeline Audit Trail */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span>{language === 'mr' ? 'कारवाईची वेळरेखा' : language === 'hi' ? 'कार्रवाई की समयरेखा' : 'Administrative Redressal Audit Trail'}</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  SLA Target: {new Date(problem.deadline).toLocaleDateString()}
                </span>
              </h3>
              <TimelineView events={problem.timeline} />
            </div>
          </div>

          {/* Right Col: AI Assessment & Assignment Details */}
          <div className="space-y-6">
            <AiAssessmentCard assessment={problem.aiAssessment} />

            {/* Assigned Officer Details */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Assigned Nodal Officer
              </h4>
              {problem.assignedOfficer ? (
                <div className="space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-900">{problem.assignedOfficer.name}</div>
                  <div className="text-slate-500">{problem.assignedOfficer.designation}</div>
                  <div className="text-slate-400 text-[11px]">{problem.assignedOfficer.department}</div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Officer assignment pending automated department triage.
                </p>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Target SLA Deadline:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(problem.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Citizen Reporter Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Citizen Audit Docket
              </h4>
              <div className="text-slate-600">
                <span className="text-slate-400">Reporter:</span> {problem.citizenName}
              </div>
              <div className="text-slate-600">
                <span className="text-slate-400">Masked Contact:</span> {problem.citizenPhoneMasked}
              </div>
              <div className="text-slate-600">
                <span className="text-slate-400">Impact Scope:</span> {problem.impactScope}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
