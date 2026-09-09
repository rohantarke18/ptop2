import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { consultationService } from '../services/consultationService';
import { Consultation, ConsultationStatus } from '../types';
import {
  Vote,
  Calendar,
  Building2,
  Users,
  ChevronRight,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const ConsultationsPage: React.FC = () => {
  const { t } = useLanguage();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const statusTabs = [
    { label: 'All Consultations', value: 'All' },
    { label: 'Active & Open', value: 'Active' },
    { label: 'Under Deliberation', value: 'Under Deliberation' },
    { label: 'Concluded & Adopted', value: 'Concluded' },
  ];

  useEffect(() => {
    consultationService.getConsultations().then(setConsultations);
  }, []);

  const filteredConsultations = consultations.filter((item) => {
    if (selectedStatus === 'All') return true;
    return item.status === selectedStatus;
  });

  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Under Deliberation':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Concluded':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Draft':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 text-white rounded-xl p-8 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-xs">
            <Vote className="w-3.5 h-3.5 text-purple-300" />
            <span>Participatory Democracy Room</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {t.consultations.title}
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed font-normal max-w-2xl">
            {t.consultations.subtitle}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              type="button"
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedStatus === tab.value
                  ? 'bg-purple-700 text-white font-semibold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filteredConsultations.length}</strong> public policy dockets
        </div>
      </div>

      {/* Consultation Cards */}
      <div className="space-y-4">
        {filteredConsultations.map((item) => {
          const daysLeft = Math.ceil(
            (new Date(item.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
          );

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {item.department}
                  </span>
                  <span className="text-xs text-slate-400">
                    Topic: {item.topic}
                  </span>
                </div>

                <Link to={`/consultations/${item.id}`} className="group block">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    {item.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {daysLeft > 0 ? (
                        <>Closing in <strong>{daysLeft} days</strong> ({new Date(item.deadline).toLocaleDateString()})</>
                      ) : (
                        <>Deliberation closed on {new Date(item.deadline).toLocaleDateString()}</>
                      )}
                    </span>
                  </span>

                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong>{item.totalResponses.toLocaleString()}</strong> citizen submissions</span>
                  </span>
                </div>
              </div>

              {/* Right CTA */}
              <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-end justify-center gap-2">
                <Link
                  to={`/consultations/${item.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-2xs transition-colors"
                >
                  <span>{item.status === 'Active' ? t.consultations.participate : t.consultations.viewResults}</span>
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
