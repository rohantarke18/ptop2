import React, { useState } from 'react';
import { Problem, CitizenVerification } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { complaintService } from '../../services/complaintService';
import { useNotifications } from '../../context/NotificationContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  MessageSquare,
  Loader2,
} from 'lucide-react';

interface CitizenVerificationCardProps {
  problem: Problem;
  onVerificationSubmitted?: (updatedProblem: Problem) => void;
  className?: string;
}

export const CitizenVerificationCard: React.FC<CitizenVerificationCardProps> = ({
  problem,
  onVerificationSubmitted,
  className = '',
}) => {
  const { t, language } = useLanguage();
  const { showToast } = useNotifications();

  const [isDisputing, setIsDisputing] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [satisfactionRating, setSatisfactionRating] = useState<number>(5);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already verified or disputed, display permanent record
  if (problem.citizenVerification?.status === 'verified') {
    return (
      <div className={`p-4 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-950 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-emerald-950">
                {t.track.verificationDone}
              </h4>
              <span className="text-[11px] bg-emerald-200 text-emerald-900 font-semibold px-2 py-0.5 rounded">
                {t.track.caseClosed}
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-1">
              {t.track.citizenInspected} ({problem.citizenVerification.verifiedAt
                ? new Date(problem.citizenVerification.verifiedAt).toLocaleDateString()
                : 'file'}).
            </p>
            {problem.citizenVerification.feedbackNotes && (
              <div className="mt-2 text-xs bg-white/70 p-2 rounded border border-emerald-200 text-emerald-900">
                <span className="font-semibold">{language === 'mr' ? 'नागरिक नोंद:' : language === 'hi' ? 'नागरिक टिप्पणी:' : 'Citizen Note:'}</span> {problem.citizenVerification.feedbackNotes}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (problem.citizenVerification?.status === 'disputed') {
    return (
      <div className={`p-4 rounded-lg border border-rose-200 bg-rose-50 text-rose-950 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-full shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-rose-950">
                {t.track.verificationDisputed}
              </h4>
              <span className="text-[11px] bg-rose-200 text-rose-900 font-semibold px-2 py-0.5 rounded">
                {t.status.Reopened}
              </span>
            </div>
            <p className="text-xs text-rose-800 mt-1">
              {language === 'mr'
                ? 'नागरिकाने समस्या जागेवर सुटलेली नसल्याचा अहवाल दिला आहे. पर्यवेक्षी पुनर्निरीक्षणासाठी हे प्रकरण पुन्हा उघडण्यात आले आहे.'
                : language === 'hi'
                ? 'नागरिक ने मौके पर समस्या अनसुलझी होने की रिपोर्ट दी है। पर्यवेक्षी पुनर्निरिक्षण हेतु मामला दोबारा खोला गया है।'
                : 'The citizen reported that this issue remains unresolved on the ground. The administrative docket has been reopened for priority supervisory reinspection.'}
            </p>
            {problem.citizenVerification.disputeReason && (
              <div className="mt-2 text-xs bg-white/70 p-2 rounded border border-rose-200 text-rose-900">
                <span className="font-semibold">{language === 'mr' ? 'नागरिक आक्षेप कारण:' : language === 'hi' ? 'नागरिक आपत्ति का कारण:' : 'Citizen Discrepancy Reason:'}</span>{' '}
                {problem.citizenVerification.disputeReason}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If status is not ready for verification (e.g. still in progress)
  const isAwaitingVerification =
    problem.status === 'Resolution Submitted' ||
    problem.status === 'Citizen Verification' ||
    problem.status === 'Resolved';

  if (!isAwaitingVerification) {
    return (
      <div className={`p-4 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs ${className}`}>
        <div className="flex items-center gap-2 font-medium text-slate-800">
          <ShieldCheck className="w-4 h-4 text-slate-500" />
          <span>{language === 'mr' ? 'नागरिक निराकरण पडताळणी लॉक' : language === 'hi' ? 'नागरिक समाधान सत्यापन लॉक' : 'Citizen Resolution Verification Lock'}</span>
        </div>
        <p className="mt-1 text-slate-500">
          {language === 'mr'
            ? 'महानगरपालिका विभागाने कामाच्या पूर्णतेचा छायाचित्र पुरावा आणि कार्य अहवाल सादर केल्यानंतर नागरिक पडताळणी स्वयंचलितपणे सुरू होते.'
            : language === 'hi'
            ? 'नगर निगम विभाग द्वारा कार्य पूर्ण होने का फोटो प्रमाण और कार्य रिपोर्ट अपलोड करने के बाद नागरिक सत्यापन स्वतः सक्रिय हो जाता है।'
            : 'Citizen verification activates automatically once the municipal department uploads photographic proof of completion and submits the work order report.'}
        </p>
      </div>
    );
  }

  const handleVerifyYes = async () => {
    try {
      setIsSubmitting(true);
      const updated = await complaintService.verifyResolution(problem.id, {
        status: 'verified',
        satisfactionRating,
        feedbackNotes: feedbackNotes || (language === 'mr' ? 'जागेवर संपूर्ण समाधान निश्चित झाले.' : language === 'hi' ? 'मौके पर पूर्ण समाधान सत्यापित।' : 'Confirmed resolution on site.'),
      });
      showToast('success', language === 'mr' ? 'निराकरण पडताळणी पूर्ण' : language === 'hi' ? 'समाधान सत्यापित' : 'Resolution Verified', language === 'mr' ? 'धन्यवाद! आपल्या पडताळणीने हे प्रकरण बंद केले आहे.' : language === 'hi' ? 'धन्यवाद! आपके सत्यापन से यह मामला बंद हो गया है।' : 'Thank you! Your verification closes this administrative case.');
      if (onVerificationSubmitted) onVerificationSubmitted(updated);
    } catch (err: any) {
      showToast('error', 'Verification Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyNo = async () => {
    if (!disputeReason.trim()) {
      showToast('warning', language === 'mr' ? 'तपशील आवश्यक' : language === 'hi' ? 'विवरण आवश्यक' : 'Discrepancy Details Required', language === 'mr' ? 'समस्या का अपूर्ण आहे ते नमूद करा.' : language === 'hi' ? 'कृपया बताएं कि समस्या क्यों अनसुलझी है।' : 'Please specify why the issue remains unresolved.');
      return;
    }

    try {
      setIsSubmitting(true);
      const updated = await complaintService.verifyResolution(problem.id, {
        status: 'disputed',
        disputeReason,
      });
      showToast('info', language === 'mr' ? 'प्रकरण पुन्हा उघडले' : language === 'hi' ? 'मामला पुनः खोला गया' : 'Issue Reopened', language === 'mr' ? 'पर्यवेक्षी तपासणीसाठी प्रकरण पुन्हा पाठवण्यात आले आहे.' : language === 'hi' ? 'पर्यवेक्षी निरीक्षण हेतु मामला विभाग को पुनः प्रेषित किया गया।' : 'The docket has been flagged for departmental supervisory reinspection.');
      if (onVerificationSubmitted) onVerificationSubmitted(updated);
    } catch (err: any) {
      showToast('error', 'Failed to dispute', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-5 rounded-lg border-2 border-purple-200 bg-purple-50/40 text-slate-800 shadow-xs ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-purple-100 text-purple-700 rounded-md shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">
              {t.track.verificationCardTitle}
            </h4>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
              {t.citizenDashboard.actionRequired}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {t.track.verificationPrompt}
          </p>

          {!isDisputing ? (
            <div className="mt-4 space-y-3">
              {/* Optional rating */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-medium">{language === 'mr' ? 'मूल्यांकन:' : language === 'hi' ? 'रेटिंग:' : 'Rating:'}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSatisfactionRating(star)}
                      className="cursor-pointer p-0.5 text-amber-400 hover:scale-110 transition-transform"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= satisfactionRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional note */}
              <div>
                <input
                  type="text"
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder={language === 'mr' ? 'ऐच्छिक पुष्टीकरण नोंद (उदा. डांबरीकरण व्यवस्थित झाले आहे)' : language === 'hi' ? 'वैकल्पिक पुष्टि टिप्पणी (उदा. डामरीकरण सही पाया गया)' : 'Optional confirmation note (e.g. confirmed asphalt is flat and clean)'}
                  className="w-full text-xs p-2 rounded border border-slate-300 bg-white focus:outline-blue-600"
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleVerifyYes}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{t.track.btnVerified}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDisputing(true)}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{t.track.btnDispute}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3 bg-white p-3.5 rounded border border-rose-200">
              <div className="text-xs font-semibold text-rose-900">
                {language === 'mr' ? 'समस्या का अपूर्ण आहे ते नमूद करा' : language === 'hi' ? 'समस्या क्यों अनसुलझी है, बताएं' : 'Specify Why the Issue Remains Unresolved'}
              </div>
              <textarea
                rows={3}
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder={language === 'mr' ? 'अपूर्ण किंवा निकृष्ट कामाचे वर्णन करा (उदा. कचरा तसाच राहिला आहे, खड्डा अर्धवट भरला आहे)...' : language === 'hi' ? 'अपूर्ण या घटिया कार्य का विवरण दें (उदा. मलबा वहीं छूटा है, गड्ढा आधा भरा है)...' : 'Describe what is incomplete or substandard (e.g. debris left behind, pothole only partially filled, light still blinking)...'}
                className="w-full text-xs p-2.5 rounded border border-rose-300 focus:outline-rose-600"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleVerifyNo}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-rose-700 hover:bg-rose-800 text-white cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (language === 'mr' ? 'सादर करत आहे...' : language === 'hi' ? 'दर्ज कर रहे हैं...' : 'Submitting Discrepancy...') : (language === 'mr' ? 'आक्षेप नोंदवून प्रकरण पुन्हा उघडा' : language === 'hi' ? 'आपत्ति दर्ज करें एवं मामला पुनः खोलें' : 'Confirm Discrepancy & Reopen Case')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDisputing(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {t.common.cancel}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
