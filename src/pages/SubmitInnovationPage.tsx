import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { innovationService } from '../services/innovationService';
import { InnovationCategory, EvidenceItem } from '../types';
import { FileUploader } from '../components/common/FileUploader';
import {
  Lightbulb,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Coins,
  Clock,
  Sparkles,
  Loader2,
} from 'lucide-react';

const CATEGORIES: InnovationCategory[] = [
  'Waste Management',
  'Traffic & Mobility',
  'Water Conservation',
  'Digital Governance',
  'Green Urban Spaces',
  'Renewable Energy & Lighting',
];

export const SubmitInnovationPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<InnovationCategory>('Waste Management');
  const [submitterName, setSubmitterName] = useState(user?.name || '');
  const [submitterType, setSubmitterType] = useState<'Citizen' | 'Student team' | 'NGO' | 'Researcher' | 'Civic Tech'>('Student team');
  const [problemAddressed, setProblemAddressed] = useState('');
  const [description, setDescription] = useState('');
  const [expectedImpact, setExpectedImpact] = useState('');
  const [costEstimate, setCostEstimate] = useState('₹50,000 - ₹1.5 Lakhs');
  const [timelineEstimate, setTimelineEstimate] = useState('60 days');
  const [files, setFiles] = useState<EvidenceItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim() || title.length < 10) errs.title = 'Please enter a clear descriptive title (min 10 characters).';
    if (!problemAddressed.trim() || problemAddressed.length < 20) errs.problem = 'Describe the civic problem clearly (min 20 characters).';
    if (!description.trim() || description.length < 30) errs.description = 'Provide the core solution approach (min 30 characters).';
    if (!submitterName.trim()) errs.name = 'Submitter name or team name is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const created = await innovationService.submitInnovation({
        title,
        category,
        submitterName,
        submitterType,
        problemAddressed,
        description,
        expectedImpact,
        costEstimate,
        timelineEstimate,
        attachments: files,
      });

      showToast('success', 'Proposal Submitted', 'Your innovation has been queued for expert committee appraisal.');
      navigate(`/innovations/${created.id}`);
    } catch (err: any) {
      showToast('error', 'Submission Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <Link
          to="/innovations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Innovations</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Submit a Civic Innovation Proposal
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Co-create sustainable municipal solutions with local government and academic partners.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="proposal-title" className="block text-xs font-semibold text-slate-800 mb-1">
              Proposal Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="proposal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Decentralized Organic Waste Composting Hubs for Ward 14"
              className="w-full text-xs sm:text-sm p-2.5 rounded border border-slate-300 focus:outline-blue-600 bg-white"
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
          </div>

          {/* Category & Submitter Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="proposal-category" className="block text-xs font-semibold text-slate-800 mb-1">
                Category
              </label>
              <select
                id="proposal-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as InnovationCategory)}
                className="w-full text-xs sm:text-sm p-2.5 rounded border border-slate-300 focus:outline-blue-600 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="submitter-type" className="block text-xs font-semibold text-slate-800 mb-1">
                Submitter Classification
              </label>
              <select
                id="submitter-type"
                value={submitterType}
                onChange={(e) => setSubmitterType(e.target.value as any)}
                className="w-full text-xs sm:text-sm p-2.5 rounded border border-slate-300 focus:outline-blue-600 bg-white"
              >
                <option value="Citizen">Citizen</option>
                <option value="Student team">Student / Youth Team</option>
                <option value="NGO">Registered NGO / Community Org</option>
                <option value="Researcher">Academic / Researcher</option>
                <option value="Civic Tech">Civic Tech Startup</option>
              </select>
            </div>
          </div>

          {/* Submitter Name */}
          <div>
            <label htmlFor="submitter-name" className="block text-xs font-semibold text-slate-800 mb-1">
              Lead Proposer or Team Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="submitter-name"
              type="text"
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
              placeholder="e.g. Pune Institute Civic Tech Club / Shreya Kulkarni"
              className="w-full text-xs sm:text-sm p-2.5 rounded border border-slate-300 focus:outline-blue-600 bg-white"
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Problem Statement */}
          <div>
            <label htmlFor="problem-addressed" className="block text-xs font-semibold text-slate-800 mb-1">
              Problem Addressed <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="problem-addressed"
              rows={3}
              value={problemAddressed}
              onChange={(e) => setProblemAddressed(e.target.value)}
              placeholder="What chronic civic issue or infrastructure deficit does this proposal resolve?"
              className="w-full text-xs sm:text-sm p-2.5 rounded border border-slate-300 focus:outline-blue-600 bg-white"
            />
            {errors.problem && <p className="text-xs text-rose-600 mt-1">{errors.problem}</p>}
          </div>

          {/* Proposed Solution */}
          <div>
            <label htmlFor="proposed-solution" className="block text-xs font-semibold text-slate-800 mb-1">
              Proposed Solution & Methodology <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="proposed-solution"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe how the solution functions, required materials, technology, and operations..."
              className="w-full text-xs sm:text-sm p-2.5 rounded border border-slate-300 focus:outline-blue-600 bg-white"
            />
            {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
          </div>

          {/* Expected Impact */}
          <div>
            <label htmlFor="expected-impact" className="block text-xs font-semibold text-slate-800 mb-1">
              Expected Community Impact
            </label>
            <textarea
              id="expected-impact"
              rows={2}
              value={expectedImpact}
              onChange={(e) => setExpectedImpact(e.target.value)}
              placeholder="e.g. Diverts 4 tons of organic garbage daily, eliminating open dumping in 3 sub-wards."
              className="w-full text-xs sm:text-sm p-2.5 rounded border border-slate-300 focus:outline-blue-600 bg-white"
            />
          </div>

          {/* Cost & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cost-estimate" className="block text-xs font-semibold text-slate-800 mb-1">
                Estimated Pilot Cost
              </label>
              <input
                id="cost-estimate"
                type="text"
                value={costEstimate}
                onChange={(e) => setCostEstimate(e.target.value)}
                placeholder="e.g. ₹50,000"
                className="w-full text-xs sm:text-sm p-2.5 rounded border border-slate-300 focus:outline-blue-600 bg-white"
              />
            </div>

            <div>
              <label htmlFor="timeline-estimate" className="block text-xs font-semibold text-slate-800 mb-1">
                Pilot Timeline
              </label>
              <input
                id="timeline-estimate"
                type="text"
                value={timelineEstimate}
                onChange={(e) => setTimelineEstimate(e.target.value)}
                placeholder="e.g. 45 days"
                className="w-full text-xs sm:text-sm p-2.5 rounded border border-slate-300 focus:outline-blue-600 bg-white"
              />
            </div>
          </div>

          {/* File Upload for Pitch Deck or Diagram */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Supporting Blueprints or Slide Deck (Optional)
            </label>
            <FileUploader
              files={files}
              onChange={setFiles}
              maxFiles={3}
              helperText="Upload schematics, diagrams, or PDF overview decks."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link
              to="/innovations"
              className="px-4 py-2 text-xs font-semibold rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2 text-xs font-bold rounded bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Proposal...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit for Committee Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
