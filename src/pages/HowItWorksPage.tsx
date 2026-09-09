import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  Sparkles,
  Building2,
  FileCheck2,
  ShieldCheck,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Clock,
  Vote,
  Compass,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { t } = useLanguage();

  const stages = [
    {
      num: '01',
      title: 'Problem Identification & Evidence Capture',
      badge: 'Citizen Action',
      icon: FileText,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      description:
        'A citizen identifies a road hazard, sanitation failure, water disruption, or public safety danger in their daily life. Rather than venting on social media without accountability, they log a structured report on CivicBridge.',
      highlights: [
        'Precise geo-location pin and municipal ward tagging',
        'Mandatory visual evidence (photographs, videos, or documents)',
        'Specification of community impact scope and urgency',
        'Instant generation of an auditable tracking reference ID (e.g. CIV-2026-XXXXXX)',
      ],
    },
    {
      num: '02',
      title: 'Algorithmic Preliminary Triage (AI Assessment)',
      badge: 'Advisory Processing',
      icon: Sparkles,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description:
        'CivicBridge runs a rule-based AI preliminary assessment that parses the report description and evidence to accelerate municipal intake.',
      highlights: [
        'Calculates a priority impact score (0 to 100) based on vulnerability and hazard depth',
        'Suggests appropriate municipal department and zonal engineer',
        'Flags duplicate or clustered reports within the same geographical perimeter',
        'Distinctly marked as preliminary advice—never replaces official human administrative decisions',
      ],
    },
    {
      num: '03',
      title: 'Government Intake & SLA Assignment',
      badge: 'Administrative Action',
      icon: Building2,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      description:
        'The designated department intake officer reviews the triage docket and assigns it to a field executive engineer with a binding SLA completion deadline.',
      highlights: [
        'Assigned named officer and work order reference number',
        'Public countdown timer tracking SLA compliance',
        'Internal case notes recorded on an immutable municipal audit log',
        'Automated notifications dispatched to citizen upon each milestone transition',
      ],
    },
    {
      num: '04',
      title: 'Field Remediation & Resolution Proof Upload',
      badge: 'On-Ground Execution',
      icon: FileCheck2,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      description:
        'Municipal work crews carry out the physical repair or remedial work. Crucially, the case cannot simply be marked "resolved" by decree; photographic proof must be uploaded.',
      highlights: [
        'Upload of completion photographs showing the repaired surface or restored facility',
        'Official contractor or engineer completion notes',
        'Timestamped completion docket accessible to the public',
      ],
    },
    {
      num: '05',
      title: 'Citizen Verification Lock',
      badge: 'Accountability Gate',
      icon: ShieldCheck,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      description:
        'The core innovation of CivicBridge: The reporting citizen is notified to personally verify whether the issue was satisfactorily resolved on the ground.',
      highlights: [
        'Citizen inspects uploaded completion evidence and visits the site',
        'One-click confirmation: "Yes, the issue is resolved" closes the case',
        'Dispute mechanism: "No, the issue remains unresolved" reopens the case for supervisory audit',
        'System prevents bureaucratic "ghost closures"',
      ],
    },
    {
      num: '06',
      title: 'Systemic Innovation & Participatory Policy',
      badge: 'Co-Creation',
      icon: Lightbulb,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      description:
        'Chronic, recurring grievances are not treated as isolated incidents. They are synthesized into open community challenges and digital policy consultations.',
      highlights: [
        'Citizens and youth submit practical structural solutions via the Innovation Hub',
        'Expert advisory panels evaluate proposals on feasibility and cost-effectiveness',
        'Citizens participate in digital consultations on proposed municipal bylaws and master plans',
        'Completes the journey: Problem Reporter → Participant → Solution Creator → Policy Partner',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs uppercase font-bold tracking-wider text-blue-600">
          Architectural Blueprint
        </span>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How CivicBridge Bridges Citizens and Administration
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          CivicBridge transforms public grievance redressal from a dead-end submission portal into a closed-loop civic governance system anchored by on-ground evidence and citizen verification.
        </p>
      </div>

      {/* Conceptual Journey Hierarchy */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-xl border border-slate-800">
        <h2 className="text-xs uppercase font-bold tracking-wider text-amber-400">
          The 4-Stage Civic Evolution
        </h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { role: 'Problem Reporter', stage: 'Stage 1', desc: 'Identifies hazards and submits verified evidence.' },
            { role: 'Participant', stage: 'Stage 2', desc: 'Tracks SLA progress and inspects on-ground completion.' },
            { role: 'Solution Creator', stage: 'Stage 3', desc: 'Submits proposals to open municipal innovation challenges.' },
            { role: 'Policy Partner', stage: 'Stage 4', desc: 'Deliberates on draft municipal bylaws and zoning plans.' },
          ].map((item, idx) => (
            <div key={item.role} className="p-4 bg-slate-800/80 rounded-lg border border-slate-700">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">{item.stage}</span>
              <h3 className="text-sm font-bold text-white mt-1">{item.role}</h3>
              <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Stage Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">
          Detailed 6-Stage Accountability Lifecycle
        </h2>

        <div className="space-y-4">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.num}
                className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-mono font-bold text-slate-700 shrink-0">
                      {stage.num}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">{stage.title}</h3>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${stage.color}`}>
                          {stage.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-3xl">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {stage.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-blue-950">Ready to take civic action?</h3>
          <p className="text-xs sm:text-sm text-blue-800 mt-1">
            Report a community issue now and track its verified resolution.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/report"
            className="px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
          >
            Report a Problem
          </Link>
          <Link
            to="/track"
            className="px-4 py-2.5 rounded-md bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs"
          >
            Track Problem
          </Link>
        </div>
      </div>
    </div>
  );
};
