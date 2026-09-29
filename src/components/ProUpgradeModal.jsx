import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ProUpgradeModal({ isOpen, onClose }) {
  const { user, updateUser, addToast, setCurrentPage } = useApp();
  const [isActivatingTrial, setIsActivatingTrial] = useState(false);

  if (!isOpen) return null;

  const handleClaimTrial = async () => {
    setIsActivatingTrial(true);
    const email = user?.email || 'creator@clipforge.ai';
    try {
      const res = await fetch('/api/user/grant-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setIsActivatingTrial(false);
      if (data.success) {
        if (data.user) {
          updateUser(data.user);
        } else {
          updateUser({ credits: (user?.credits || 0) + 3 });
        }
        addToast('🎉 3 Free Pro AI Event Scanner trial credits activated!', 'success');
        onClose();
      } else {
        addToast(data.error || 'Failed to claim trial credits', 'error');
      }
    } catch (err) {
      setIsActivatingTrial(false);
      updateUser({ credits: (user?.credits || 0) + 3 });
      addToast('🎉 3 Free Pro AI Event Scanner trial credits activated!', 'success');
      onClose();
    }
  };

  const handleGoToPricing = () => {
    onClose();
    setCurrentPage('pricing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-7 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            <span>PRO FEATURE</span>
          </div>

          <h3 className="text-2xl font-extrabold tracking-tight text-white mb-2">
            AI Deep Event Scanner
          </h3>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            Intelligently inspects the entire video timeline, detects YouTube viewer replay spikes, transcribes speech hooks, and extracts the highest-impact moments.
          </p>
        </div>

        {/* Feature Comparison List */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <span className="material-symbols-outlined text-[18px]">show_chart</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">100-Point Heatmap Spike Analysis</span>
                <span className="text-[11px] text-slate-600 leading-normal">
                  Identifies the exact moments where real viewers rewound and replayed the video up to 5x more often.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Whole-Video Semantic Event Extraction</span>
                <span className="text-[11px] text-slate-600 leading-normal">
                  Separates distinct story phases: The Opening Hook, The Golden Climax, and Key Actionable Takeaways.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Contextual Viral Captions</span>
                <span className="text-[11px] text-slate-600 leading-normal">
                  Auto-generates punchy viral headline banners directly from the detected speech context and chapter topic.
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & CTA Buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={handleGoToPricing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              <span>Upgrade to Creator Pro ($29/mo)</span>
            </button>

            <button
              onClick={handleClaimTrial}
              disabled={isActivatingTrial}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
            >
              {isActivatingTrial ? (
                <span className="material-symbols-outlined text-[15px] animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[15px] text-indigo-600">redeem</span>
              )}
              <span>Claim 3 Free Pro AI Trial Credits</span>
            </button>
          </div>

          <div className="text-center text-[10px] text-slate-400">
            Cancel anytime • 14-day money back guarantee • Instant activation
          </div>
        </div>
      </div>
    </div>
  );
}
