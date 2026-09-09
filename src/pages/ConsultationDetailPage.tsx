import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { consultationService } from '../services/consultationService';
import { Consultation, ConsultationQuestion } from '../types';
import {
  Vote,
  ChevronLeft,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  FileText,
  Download,
  Share2,
  Send,
  Loader2,
  BarChart2,
  X,
} from 'lucide-react';

export const ConsultationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [showBriefModal, setShowBriefModal] = useState(false);

  useEffect(() => {
    if (id) {
      consultationService.getConsultationById(id).then((item) => {
        if (item) setConsultation(item);
      });
    }
  }, [id]);

  if (!consultation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">Loading civic consultation docket...</p>
      </div>
    );
  }

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleRating = (questionId: string, val: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleTextChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const res = await consultationService.submitResponse(consultation.id, {
        userName: user?.name || 'Citizen Contributor',
        userRole: user?.role || 'citizen',
        ward: 'Ward 14 (Shivajinagar)',
        answers,
      });

      setSubmittedRef(res.id);
      showToast('success', 'Response Recorded', 'Your input has been added to the public policy docket.');

      // Refresh consultation data to reflect new tally
      const updated = await consultationService.getConsultationById(consultation.id);
      if (updated) setConsultation(updated);
    } catch (err: any) {
      showToast('error', 'Submission Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link
          to="/consultations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Consultations</span>
        </Link>

        <button
          type="button"
          onClick={() => setShowBriefModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>View Policy Brief Document</span>
        </button>
      </div>

      {/* Header Docket Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded">
              {consultation.status}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {consultation.department}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Deadline: <strong>{new Date(consultation.deadline).toLocaleDateString()}</strong></span>
            <span>•</span>
            <span><strong>{consultation.totalResponses.toLocaleString()}</strong> Recorded Inputs</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {consultation.title}
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
            {consultation.summary}
          </p>
        </div>
      </div>

      {/* Grid: Questionnaire & Live Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form or Receipt */}
        <div className="lg:col-span-2 space-y-6">
          {submittedRef ? (
            <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-xs text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Civic Feedback Successfully Registered
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for exercising participatory democracy. Your response has been compiled into the permanent municipal public record.
              </p>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-xs font-bold text-purple-900 inline-block">
                Receipt Reference: {submittedRef}
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittedRef(null)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Submit Another Perspective
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Vote className="w-4 h-4 text-purple-600" />
                  <span>Participatory Policy Questionnaire</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your responses directly guide the municipal steering committee ahead of final enactment.
                </p>
              </div>

              <form onSubmit={handleSubmitResponse} className="space-y-6">
                {consultation.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-lg bg-slate-50/70 border border-slate-200/80 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-purple-700 font-mono mt-0.5">
                        Q{idx + 1}.
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {q.prompt}
                      </h3>
                    </div>

                    {/* Single Choice Options */}
                    {q.type === 'single_choice' && q.options && (
                      <div className="space-y-2 pt-1">
                        {q.options.map((opt) => {
                          const isSelected = answers[q.id] === opt;
                          return (
                            <label
                              key={opt}
                              className={`flex items-center gap-2.5 p-2.5 rounded border text-xs cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-purple-50 border-purple-500 font-semibold text-purple-950'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={isSelected}
                                onChange={() => handleSelectOption(q.id, opt)}
                                className="text-purple-600 focus:ring-purple-500"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Rating Scale */}
                    {q.type === 'rating_scale' && (
                      <div className="pt-1">
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleRating(q.id, val)}
                              className={`w-9 h-9 rounded text-xs font-bold cursor-pointer transition-colors border ${
                                answers[q.id] === val
                                  ? 'bg-purple-700 text-white border-purple-700'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400 mt-1 max-w-[200px]">
                          <span>1 = Strongly Disagree</span>
                          <span>5 = Strongly Agree</span>
                        </div>
                      </div>
                    )}

                    {/* Open Text */}
                    {q.type === 'open_text' && (
                      <div className="pt-1">
                        <textarea
                          rows={3}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleTextChange(q.id, e.target.value)}
                          placeholder="Provide specific localized feedback, exceptions, or recommendations..."
                          className="w-full text-xs p-2.5 rounded border border-slate-300 focus:outline-purple-600 bg-white"
                        />
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Logged as: <strong>{user?.name || 'Verified Citizen'}</strong>
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting Input...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Consultation Response</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Col: Real-time Community Aggregate Tally */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-purple-600" />
                <span>Live Community Distribution</span>
              </h3>
              <span className="text-[10px] bg-purple-50 text-purple-800 font-semibold px-2 py-0.5 rounded">
                Verified
              </span>
            </div>

            {/* Distribution charts */}
            <div className="space-y-5">
              {consultation.questions
                .filter((q) => q.liveDistribution)
                .map((q) => {
                  const dist = q.liveDistribution!;
                  const totalVotes = Object.values(dist).reduce<number>((a, b) => Number(a) + Number(b), 0);

                  return (
                    <div key={q.id} className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-800 leading-snug">
                        {q.prompt}
                      </h4>

                      <div className="space-y-1.5 pt-1">
                        {Object.entries(dist).map(([opt, count]) => {
                          const voteCount = Number(count);
                          const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                          return (
                            <div key={opt} className="text-xs">
                              <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                                <span className="truncate max-w-[180px]" title={opt}>{opt}</span>
                                <span className="font-semibold">{pct}% ({voteCount})</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-purple-600 h-2 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="bg-purple-50/60 rounded-xl border border-purple-200 p-5 text-xs text-purple-950 space-y-2">
            <span className="font-bold text-purple-900 block">
              Policy Deliberation Protocol
            </span>
            <p className="text-purple-800 leading-relaxed">
              Upon conclusion of the public comment period on {new Date(consultation.deadline).toLocaleDateString()}, the municipal council will publish an official White Paper detailing how citizen submissions were incorporated into the final gazette.
            </p>
          </div>
        </div>
      </div>

      {/* Policy Brief Modal / Preview */}
      {showBriefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Official Policy Brief Draft Dossier
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBriefModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-3 text-slate-700 font-mono leading-relaxed bg-slate-50 p-4 rounded border border-slate-200">
              <p><strong>DOCKET REF:</strong> {consultation.id}</p>
              <p><strong>TITLE:</strong> {consultation.title}</p>
              <p><strong>DEPT:</strong> {consultation.department}</p>
              <p><strong>GAZETTE DEADLINE:</strong> {consultation.deadline}</p>
              <hr className="my-2 border-slate-200" />
              <p className="font-bold text-slate-900">EXECUTIVE SUMMARY:</p>
              <p>{consultation.summary}</p>
              <p className="font-bold text-slate-900 mt-2">REGULATORY OBJECTIVES:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Enforce localized zero-waste decentralized segregation.</li>
                <li>Incentivize bulk waste generators through property-tax rebates.</li>
                <li>Empower Ward Vigilance Committees with audit powers.</li>
              </ul>
              <p className="text-[11px] text-slate-400 pt-2">
                * Document produced under Section 4(1)(b) of the Right to Public Civic Transparency Charter.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Print / Save PDF
              </button>
              <button
                type="button"
                onClick={() => setShowBriefModal(false)}
                className="px-4 py-2 border rounded text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
