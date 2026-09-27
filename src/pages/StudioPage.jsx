import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function StudioPage() {
  const { setCurrentPage, addToast, user } = useApp();
  const [waitlistEmail, setWaitlistEmail] = useState(user?.email || '');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleJoinWaitlist = (e) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    setIsSubscribed(true);
    addToast('🎉 You are on the Studio VIP early access list! We will notify you first.', 'success');
  };

  const upcomingFeatures = [
    {
      icon: 'timeline',
      title: 'Multi-Track Timeline',
      desc: 'Precision non-linear audio, video, and B-roll cutaway sequencing with automatic silence trimming and snap-to-beat markers.'
    },
    {
      icon: 'format_quote',
      title: 'Word-Level Kinetic Captions',
      desc: 'Customize font sizes, highlight stroke widths, animations, and color transitions for every single spoken syllable.'
    },
    {
      icon: 'person_pin_circle',
      title: 'Active Speaker Dual-Reframe',
      desc: 'Keyframe-controlled speaker tracking with split-screen podcast layouts, cinematic camera pans, and automated host switching.'
    },
    {
      icon: 'graphic_eq',
      title: 'AI Audio Mastering & SFX',
      desc: 'One-click vocal clarity enhancement, studio compression, loudness normalization (-14 LUFS), and built-in sound effect library.'
    }
  ];

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-28 space-y-10 animate-fadeIn">
      {/* LOCKED FEATURE BADGE & HEADER */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 shadow-xs">
          <span className="material-symbols-outlined text-[16px] text-amber-600">lock</span>
          <span>Studio Feature Locked • In Active Development</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          ClipForge Studio is <span className="text-indigo-600">Coming Soon</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          We have locked the advanced manual timeline studio for now so we can focus on perfecting our automated video ingestion, viral hook detection, and kinetic captioning engines first.
        </p>
      </div>

      {/* CALL TO ACTION CARDS: WHAT'S ACTIVE RIGHT NOW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Clip Generator (Active) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <span className="material-symbols-outlined text-[22px]">auto_videocam</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> 100% Active
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Clip Generator</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paste any YouTube video link or podcast stream to automatically generate 6 high-scoring 9:16 vertical shorts with burnt-in kinetic captions and instant MP4 downloads.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('clip')}
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Launch Clip Generator</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Card 2: Viral Templates (Active) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <span className="material-symbols-outlined text-[22px]">dashboard_customize</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> 100% Active
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Viral Shorts Templates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore pre-built viral animation styles including Hormozi Bold, MrBeast Punch, and Cyberpunk Neon tailored for maximum viewer retention.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('templates')}
            className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 transition-colors"
          >
            <span>Browse Templates</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* SNEAK PEEK / FROSTED LOCKED PREVIEW */}
      <div className="relative rounded-3xl bg-slate-900 overflow-hidden border border-slate-200 shadow-xl">
        {/* Background Visual Mockup */}
        <div className="p-6 sm:p-10 opacity-30 pointer-events-none filter blur-sm select-none">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4 text-slate-400 text-xs font-mono">
            <span>STUDIO TIMELINE EDITOR v2.0</span>
            <span>1080x1920 60FPS</span>
          </div>
          <div className="grid grid-cols-12 gap-4 mt-6 h-64">
            <div className="col-span-3 bg-slate-800 rounded-xl p-3"></div>
            <div className="col-span-6 bg-black rounded-xl p-3 flex items-center justify-center">
              <span className="text-white text-xs">VIDEO CANVAS 9:16</span>
            </div>
            <div className="col-span-3 bg-slate-800 rounded-xl p-3"></div>
          </div>
          <div className="mt-4 h-24 bg-slate-800 rounded-xl"></div>
        </div>

        {/* Foreground Locked Overlay */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[32px]">lock_clock</span>
          </div>

          <div className="space-y-1 max-w-md">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Studio Editor in Crafting Phase</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              We are carefully engineering each timeline track, keyframe animation, and audio effect before releasing the full studio editor to creators.
            </p>
          </div>

          {/* Waitlist Subscription */}
          {!isSubscribed ? (
            <form onSubmit={handleJoinWaitlist} className="w-full max-w-md flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="email"
                required
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Enter email for VIP early access..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95"
              >
                Notify Me
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>You're on the early access list! We'll email you at launch.</span>
            </div>
          )}
        </div>
      </div>

      {/* UPCOMING STUDIO ROADMAP FEATURES */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Upcoming Roadmap</span>
          <h2 className="text-2xl font-extrabold text-slate-900">What's Coming in Studio v2.0</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {upcomingFeatures.map((feat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <span className="material-symbols-outlined text-[20px]">{feat.icon}</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{feat.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BACK TO HOME FOOTER LINK */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => setCurrentPage('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Homepage</span>
        </button>
      </div>
    </main>
  );
}
