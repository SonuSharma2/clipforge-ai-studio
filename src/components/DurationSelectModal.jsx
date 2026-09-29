import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function DurationSelectModal({
  isOpen,
  onClose,
  onConfirm,
  initialDuration = '30',
  url = ''
}) {
  const { user, isProUser, updateUser, addToast, setCurrentPage } = useApp();

  const [selectedDuration, setSelectedDuration] = useState(() => {
    if (['15', '30', '45', '60', 'varied'].includes(initialDuration)) {
      return initialDuration;
    }
    if (strIsDigit(initialDuration) && Number(initialDuration) > 30) {
      return 'custom';
    }
    return '30';
  });

  const [customSeconds, setCustomSeconds] = useState(() => {
    if (strIsDigit(initialDuration) && Number(initialDuration) > 30) {
      return Math.min(60, Math.max(31, Number(initialDuration)));
    }
    return 45;
  });

  const [isClaimingTrial, setIsClaimingTrial] = useState(false);

  if (!isOpen) return null;

  function strIsDigit(val) {
    return val && String(val).trim().length > 0 && !isNaN(Number(val));
  }

  // Calculate if the current choice is over 30s (Paid feature)
  const isOver30s =
    selectedDuration === '45' ||
    selectedDuration === '60' ||
    selectedDuration === 'varied' ||
    (selectedDuration === 'custom' && Number(customSeconds) > 30);

  const userCredits = user?.credits ?? 10;
  const canUsePro = isProUser || userCredits > 0;
  const isBlocked = isOver30s && !canUsePro;

  const handleCustomInput = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setCustomSeconds(31);
    } else {
      setCustomSeconds(Math.min(60, Math.max(5, val)));
    }
  };

  const handleClaimTrial = async () => {
    setIsClaimingTrial(true);
    const email = user?.email || 'creator@clipforge.ai';
    try {
      const res = await fetch('/api/user/grant-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setIsClaimingTrial(false);
      if (data.success) {
        if (data.user) {
          updateUser(data.user);
        } else {
          updateUser({ credits: (user?.credits || 0) + 3 });
        }
        addToast('🎉 3 Free Pro Trial Credits Activated! You can now generate over 30s clips.', 'success');
      } else {
        addToast(data.error || 'Failed to claim trial credits', 'error');
      }
    } catch (err) {
      setIsClaimingTrial(false);
      updateUser({ credits: (user?.credits || 0) + 3 });
      addToast('🎉 3 Free Pro Trial Credits Activated!', 'success');
    }
  };

  const handleProceed = () => {
    if (isBlocked) {
      addToast('Please upgrade or select 15s/30s for free generation.', 'info');
      return;
    }

    let finalDuration = selectedDuration;
    if (selectedDuration === 'custom') {
      finalDuration = String(Math.min(60, Math.max(5, customSeconds)));
    }

    onConfirm(finalDuration);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 overflow-hidden border-b border-indigo-900/40">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[14px] text-amber-300">timelapse</span>
            <span>Duration & Intelligence Gate</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1">
            Choose Clip Duration
          </h3>
          <p className="text-xs text-indigo-200/90 leading-relaxed">
            Shorts up to <span className="font-bold text-emerald-300">30 seconds are 100% Free</span>. Durations above 30s (45s, 60s max, or custom time) unlock deep narrative payoffs & require Pro.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* TIER 1: FREE (UP TO 30 SECONDS) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Free Tier • Up to 30 Seconds
              </span>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                100% Free • Unlimited
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 15s */}
              <div
                onClick={() => setSelectedDuration('15')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedDuration === '15'
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      15s
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Snappy TikTok Hook</div>
                      <div className="text-[10px] text-slate-500">Fast swipe-stopper</div>
                    </div>
                  </div>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedDuration === '15' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                  }`}>
                    {selectedDuration === '15' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-600 leading-snug">
                  High-velocity intro retention spike designed for maximum completion rate.
                </div>
              </div>

              {/* Option 30s */}
              <div
                onClick={() => setSelectedDuration('30')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedDuration === '30'
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      30s
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Shorts Standard Climax</div>
                      <div className="text-[10px] text-slate-500">Sweet-spot length</div>
                    </div>
                  </div>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedDuration === '30' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                  }`}>
                    {selectedDuration === '30' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-600 leading-snug">
                  Peak retention moment extracted from replay heatmap. Ideal for Shorts & Reels.
                </div>
              </div>
            </div>
          </div>

          {/* TIER 2: PRO (ABOVE 30 SECONDS & CUSTOM TIME) */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Paid Tier • Above 30 Seconds & Custom
              </span>
              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-300/60 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-amber-600">lock</span>
                Pro & Studio
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option Varied Pack */}
              <div
                onClick={() => setSelectedDuration('varied')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedDuration === 'varied'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                      MIX
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>Varied Pack</span>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                          BEST
                        </span>
                      </div>
                      <div className="text-[10px] text-indigo-600 font-semibold">15s + 30s + 60s Max</div>
                    </div>
                  </div>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedDuration === 'varied' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                  }`}>
                    {selectedDuration === 'varied' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-600 leading-snug">
                  Generates 3 clips with graduated durations tailored for TikTok, Shorts, and Reels in 1 pass.
                </div>
              </div>

              {/* Option 45s */}
              <div
                onClick={() => setSelectedDuration('45')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedDuration === '45'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      45s
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>45s Extended</span>
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-600">PRO</span>
                      </div>
                      <div className="text-[10px] text-slate-500">Tactical breakdown</div>
                    </div>
                  </div>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedDuration === '45' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                  }`}>
                    {selectedDuration === '45' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-600 leading-snug">
                  Deeper explanatory setup delivering actionable tactics and insight before concluding.
                </div>
              </div>

              {/* Option 60s Max */}
              <div
                onClick={() => setSelectedDuration('60')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedDuration === '60'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                      60s
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>60s Deep Narrative</span>
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-purple-100 text-purple-700">MAX</span>
                      </div>
                      <div className="text-[10px] text-slate-500">Full 1-min narrative</div>
                    </div>
                  </div>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedDuration === '60' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                  }`}>
                    {selectedDuration === '60' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-600 leading-snug">
                  Maximum allowed length for YouTube Shorts & Reels. Full story payoff for watch time.
                </div>
              </div>

              {/* Option Custom Duration */}
              <div
                onClick={() => setSelectedDuration('custom')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedDuration === 'custom'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-300 flex items-center justify-center font-bold text-xs">
                      ⚙️
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>Custom Duration</span>
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-600">ENTER</span>
                      </div>
                      <div className="text-[10px] text-slate-500">Choose exact seconds</div>
                    </div>
                  </div>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedDuration === 'custom' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                  }`}>
                    {selectedDuration === 'custom' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                </div>

                {/* Custom Input box & quick chips */}
                <div className="mt-2.5 flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="5"
                      max="60"
                      value={customSeconds}
                      onChange={handleCustomInput}
                      onFocus={() => setSelectedDuration('custom')}
                      className="w-16 px-2 py-1 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 text-center"
                    />
                    <span className="text-xs font-semibold text-slate-600">seconds (max 60s)</span>
                  </div>

                  {/* Quick chips */}
                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    {[35, 40, 48, 50, 55, 60].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => {
                          setSelectedDuration('custom');
                          setCustomSeconds(sec);
                        }}
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                          selectedDuration === 'custom' && customSeconds === sec
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* USER TIER & UPGRADE PROMPT NOTICE */}
          {isBlocked && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300/80 flex flex-col gap-3 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-amber-600 shrink-0 mt-0.5">
                  workspace_premium
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-amber-950">
                    Durations over 30s require Creator Pro
                  </span>
                  <span className="text-[11px] text-amber-800 leading-normal">
                    Durations up to 30 seconds are 100% free! You can switch back to 30s or claim 3 Free Trial Credits to generate extended cuts right now.
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleClaimTrial}
                  disabled={isClaimingTrial}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                  <span>{isClaimingTrial ? 'Activating...' : 'Claim 3 Free Pro Credits (Instant Trial)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setCurrentPage('pricing');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors"
                >
                  View Pro Plans ($29/mo)
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDuration('30')}
                  className="text-xs font-semibold text-indigo-700 hover:underline px-2 py-1"
                >
                  Switch to Free 30s
                </button>
              </div>
            </div>
          )}

          {/* Active Status Ribbon */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="material-symbols-outlined text-[16px] text-indigo-600">account_circle</span>
              <span>
                Plan: <strong className="text-slate-900">{user?.plan || 'Creator Free'}</strong>
              </span>
              <span>•</span>
              <span>
                Pro Credits: <strong className="text-indigo-600">{userCredits}</strong>
              </span>
            </div>

            <div className="text-[11px] font-mono font-semibold">
              {isOver30s ? (
                <span className="text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                  Paid Mode (Over 30s)
                </span>
              ) : (
                <span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  Free Mode (≤ 30s)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleProceed}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all ${
              isBlocked
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : isOver30s
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isOver30s ? 'auto_awesome' : 'flash_on'}
            </span>
            <span>
              {isBlocked
                ? 'Upgrade to Unlock >30s'
                : isOver30s
                ? `Generate Pro Short (${selectedDuration === 'custom' ? `${customSeconds}s` : (selectedDuration === 'varied' ? '15s/30s/60s' : `${selectedDuration}s`)})`
                : `Generate Free Short (${selectedDuration}s)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
