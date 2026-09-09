import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { innovationService } from '../services/innovationService';
import { Innovation, InnovationReview, InnovationComment } from '../types';
import {
  Lightbulb,
  ThumbsUp,
  Award,
  ChevronLeft,
  MessageSquare,
  ShieldCheck,
  Send,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
  TrendingUp,
  Tag,
} from 'lucide-react';

export const InnovationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user, isExpert } = useAuth();
  const { showToast } = useNotifications();

  const [innovation, setInnovation] = useState<Innovation | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Expert review state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [feasibilityScore, setFeasibilityScore] = useState<number>(85);
  const [costScore, setCostScore] = useState<number>(80);
  const [impactScore, setImpactScore] = useState<number>(90);
  const [reviewRecommendation, setReviewRecommendation] = useState<
    'Approve for Pilot' | 'Needs Revision' | 'Reject'
  >('Approve for Pilot');
  const [reviewComments, setReviewComments] = useState('');

  useEffect(() => {
    if (id) {
      innovationService.getInnovationById(id).then((item) => {
        if (item) setInnovation(item);
      });
    }
  }, [id]);

  if (!innovation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">Loading civic innovation proposal...</p>
      </div>
    );
  }

  const handleVote = async () => {
    if (hasVoted) return;
    try {
      const updated = await innovationService.upvoteInnovation(innovation.id);
      setInnovation(updated);
      setHasVoted(true);
      showToast('success', 'Vote Counted', 'Thank you for supporting this civic innovation!');
    } catch (err: any) {
      showToast('error', 'Vote Error', err.message);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsPostingComment(true);
      const commentPayload: Partial<InnovationComment> = {
        userName: user?.name || 'Citizen Contributor',
        userRole: user?.role || 'citizen',
        comment: newComment.trim(),
      };
      const updated = await innovationService.addComment(innovation.id, commentPayload);
      setInnovation(updated);
      setNewComment('');
      showToast('success', 'Comment Added', 'Your perspective has been posted.');
    } catch (err: any) {
      showToast('error', 'Failed to comment', err.message);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComments.trim()) {
      showToast('warning', 'Review Comment Required', 'Please provide detailed review feedback.');
      return;
    }

    try {
      const reviewPayload: Partial<InnovationReview> = {
        reviewerName: user?.name || 'Expert Evaluator',
        reviewerTitle: user?.designation || 'Civic Review Committee Member',
        feasibilityScore,
        costEffectivenessScore: costScore,
        communityImpactScore: impactScore,
        overallScore: Math.round((feasibilityScore + costScore + impactScore) / 3),
        recommendation: reviewRecommendation,
        comments: reviewComments.trim(),
      };

      const updated = await innovationService.addReview(innovation.id, reviewPayload);
      setInnovation(updated);
      setShowReviewModal(false);
      setReviewComments('');
      showToast('success', 'Review Recorded', 'Your expert score has been incorporated into the project dossier.');
    } catch (err: any) {
      showToast('error', 'Failed to submit review', err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/innovations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Innovations Catalog</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded">
              {innovation.category}
            </span>
            <span className="text-xs text-slate-400">
              Submitted on {new Date(innovation.createdAt).toLocaleDateString()}
            </span>
          </div>

          <span className="text-xs font-bold uppercase tracking-wider bg-slate-900 text-white px-3 py-1 rounded">
            Stage: {innovation.stage}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {innovation.title}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            <span>By <strong className="text-slate-900">{innovation.submitterName}</strong></span>
            <span>•</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
              {innovation.submitterType}
            </span>
          </div>
        </div>

        {/* Upvote & Metric highlight row */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleVote}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              hasVoted
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-300'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-white' : ''}`} />
            <span>{hasVoted ? 'Supported' : 'Support Proposal'} ({innovation.votes})</span>
          </button>

          <div className="flex items-center gap-6 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[11px]">Feasibility Index</span>
              <strong className="text-slate-900 text-sm">{innovation.feasibilityScore}/100</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Est. Budget</span>
              <strong className="text-slate-900 text-sm">{innovation.costEstimate}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Timeframe</span>
              <strong className="text-slate-900 text-sm">{innovation.timelineEstimate}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details, Solution, Reviews, Comments */}
        <div className="lg:col-span-2 space-y-8">
          {/* Problem Statement & Proposed Solution */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                Problem Statement Addressed
              </h2>
              <div className="p-4 rounded-lg bg-rose-50/50 border border-rose-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed">
                {innovation.problemAddressed}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                Proposed Solution & Methodology
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {innovation.description}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                Anticipated Community Impact
              </h2>
              <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed">
                {innovation.expectedImpact}
              </div>
            </div>
          </div>

          {/* Expert Reviews & Committee Scoring */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Expert Advisory Evaluations ({innovation.reviews.length})
                </h3>
              </div>

              {/* Button to add review (visible for experts/admins, or for demonstration) */}
              <button
                type="button"
                onClick={() => setShowReviewModal(!showReviewModal)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                + Add Committee Evaluation
              </button>
            </div>

            {/* Modal / Inline form to add review */}
            {showReviewModal && (
              <form onSubmit={handleAddReview} className="p-4 rounded bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900">Official Feasibility & Viability Audit</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Feasibility (0-100)</label>
                    <input
                      type="number"
                      value={feasibilityScore}
                      onChange={(e) => setFeasibilityScore(Number(e.target.value))}
                      className="w-full p-1.5 border rounded bg-white"
                      min={0}
                      max={100}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Cost-Effectiveness (0-100)</label>
                    <input
                      type="number"
                      value={costScore}
                      onChange={(e) => setCostScore(Number(e.target.value))}
                      className="w-full p-1.5 border rounded bg-white"
                      min={0}
                      max={100}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Community Impact (0-100)</label>
                    <input
                      type="number"
                      value={impactScore}
                      onChange={(e) => setImpactScore(Number(e.target.value))}
                      className="w-full p-1.5 border rounded bg-white"
                      min={0}
                      max={100}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Committee Recommendation</label>
                  <select
                    value={reviewRecommendation}
                    onChange={(e) => setReviewRecommendation(e.target.value as any)}
                    className="w-full p-1.5 border rounded bg-white"
                  >
                    <option value="Approve for Pilot">Approve for Pilot</option>
                    <option value="Needs Revision">Needs Revision</option>
                    <option value="Reject">Reject</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Evaluator Notes & Technical Observations</label>
                  <textarea
                    rows={3}
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    placeholder="Document technical observations regarding scaling, procurement, or safety..."
                    className="w-full p-2 border rounded bg-white"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 text-white rounded font-semibold cursor-pointer"
                  >
                    Save Official Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-3 py-1.5 border rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Review List */}
            <div className="space-y-4 pt-1">
              {innovation.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rev.reviewerName}</h4>
                      <p className="text-[11px] text-slate-500">{rev.reviewerTitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                        Score: {rev.overallScore}/100
                      </span>
                      <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        {rev.recommendation}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{rev.comments}</p>
                  <span className="text-[10px] text-slate-400 block pt-1 font-mono">
                    Audited on {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Community Discussion Thread */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Community Discussion ({innovation.comments.length})
              </h3>
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="space-y-2">
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your perspective, suggestions, or constructive questions..."
                className="w-full text-xs p-3 rounded border border-slate-300 focus:outline-blue-600 bg-white"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPostingComment || !newComment.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Perspective</span>
                </button>
              </div>
            </form>

            {/* Comment Thread List */}
            <div className="space-y-3 pt-3">
              {innovation.comments.map((comm) => (
                <div key={comm.id} className="p-3.5 rounded bg-slate-50 border border-slate-200/70 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{comm.userName}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded">
                        {comm.userRole}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comm.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{comm.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Metadata & Impact Checklist */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Proposal Metadata
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-400">Reference ID:</span>
                <span className="font-mono font-bold text-slate-800">{innovation.id}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-400">Category:</span>
                <span className="font-medium text-slate-800">{innovation.category}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-400">Current Stage:</span>
                <span className="font-bold text-blue-700">{innovation.stage}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-400">Feasibility Score:</span>
                <span className="font-bold text-emerald-700">{innovation.feasibilityScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Community Backing:</span>
                <span className="font-bold text-purple-700">{innovation.votes} verified votes</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/60 rounded-xl border border-blue-200 p-5 text-xs text-blue-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Pilot Approval Pathway</span>
            </div>
            <p className="text-blue-800 leading-relaxed">
              Proposals surpassing 150 community endorsements and achieving an Expert Feasibility rating &gt; 80 are automatically shortlisted for municipal pilot funding and ward implementation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
