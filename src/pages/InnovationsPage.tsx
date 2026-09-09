import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { innovationService } from '../services/innovationService';
import { Innovation, InnovationCategory } from '../types';
import {
  Lightbulb,
  PlusCircle,
  ThumbsUp,
  Award,
  Filter,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const InnovationsPage: React.FC = () => {
  const { t } = useLanguage();

  const [innovations, setInnovations] = useState<Innovation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const categories = [
    'All',
    'Waste Management',
    'Traffic & Mobility',
    'Water Conservation',
    'Digital Governance',
    'Green Urban Spaces',
  ];

  useEffect(() => {
    innovationService.getInnovations().then(setInnovations);
  }, []);

  const handleVote = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (votedIds.has(id)) return;

    try {
      const updated = await innovationService.upvoteInnovation(id);
      setInnovations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, votes: updated.votes } : item))
      );
      setVotedIds((prev) => new Set([...prev, id]));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredInnovations = innovations.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const getStageBadge = (stage: Innovation['stage']) => {
    switch (stage) {
      case 'Pilot Approved':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Implemented':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-slate-900 text-white rounded-xl p-8 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-xs">
            <Lightbulb className="w-3.5 h-3.5 text-amber-200" />
            <span>Civic Innovation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {t.innovations.title}
          </h1>
          <p className="text-xs sm:text-sm text-amber-50/90 leading-relaxed font-normal max-w-2xl">
            {t.innovations.subtitle}
          </p>

          <div className="pt-2">
            <Link
              to="/innovations/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-amber-600" />
              <span>{t.innovations.submitCta}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              type="button"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filteredInnovations.length}</strong> active proposals
        </div>
      </div>

      {/* Innovation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInnovations.map((item) => {
          const hasVoted = votedIds.has(item.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Stage badge & Category */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStageBadge(
                      item.stage
                    )}`}
                  >
                    {item.stage}
                  </span>
                </div>

                {/* Title */}
                <Link to={`/innovations/${item.id}`} className="group">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>

                {/* Submitter info */}
                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-medium text-slate-800">{item.submitterName}</span>
                  <span>•</span>
                  <span className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                    {item.submitterType}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Metric pill row */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Feasibility: <strong>{item.feasibilityScore}/100</strong></span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    Est: {item.costEstimate}
                  </span>
                </div>
              </div>

              {/* Bottom action row */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => handleVote(e, item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    hasVoted
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200'
                  }`}
                  title="Support this civic proposal"
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-blue-600 text-blue-600' : ''}`} />
                  <span>{item.votes}</span>
                </button>

                <Link
                  to={`/innovations/${item.id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  <span>{t.innovations.viewDetails}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
