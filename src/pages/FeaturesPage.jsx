import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function FeaturesPage() {
  const { setCurrentPage, addToast } = useApp();

  // Active filter category
  const [activeCategory, setActiveCategory] = useState('all'); // all, slicing, reframing, captions, analytics, pipeline

  // Module 1: Retention Graph & Slicing State
  const [retentionPoint, setRetentionPoint] = useState({
    time: 8,
    score: 98,
    tag: 'Curiosity Hook',
    desc: 'The Exact Blueprint: Why 99% of creators fail in the first 3 seconds',
    boost: '+142% Retention Spike'
  });

  // Module 2: Kinetic Captions State
  const [captionInput, setCaptionInput] = useState('NEVER STOP TESTING');
  const [captionStyle, setCaptionStyle] = useState('caption-hormozi');
  const [captionBg, setCaptionBg] = useState('#FFE600');
  const [captionTextCol, setCaptionTextCol] = useState('#000000');
  const [showEmoji, setShowEmoji] = useState(true);
  const [captionSize, setCaptionSize] = useState('text-lg');

  // Module 3: Active Speaker Tracking State
  const [cameraFocus, setCameraFocus] = useState('host'); // host, guest, split

  // Module 4: Content Multiplier State
  const [videoMinutes, setVideoMinutes] = useState(45);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const calculateAssets = (mins) => {
    const factor = mins / 15;
    return {
      tiktoks: Math.round(factor * 2),
      shorts: Math.round(factor * 2.5),
      reels: Math.round(factor * 2),
      hoursSaved: (factor * 3.5).toFixed(1),
      reach: `${Math.round(factor * 85)}K+`
    };
  };

  const assetCounts = calculateAssets(videoMinutes);

  const faqItems = [
    {
      q: "How does ClipForge extract different clips instead of repeating the start?",
      a: "Unlike rudimentary tools that only trim the first 60 seconds of a video, ClipForge probes the total duration using FFprobe and runs acoustic and semantic peak detection across the entire timeline. It automatically distributes cuts proportionally—extracting the Hook from the intro (5-15%), the High-Energy Climax from the middle (40-60%), and the Key Takeaway from the conclusion (75-90%)."
    },
    {
      q: "What video formats, resolutions, and sources are supported?",
      a: "ClipForge accepts direct YouTube video URLs, Vimeo links, and raw file uploads in MP4, MOV, WebM, MKV, and AVI. It natively handles source resolutions up to 4K 60fps and downsamples/crops using hardware-accelerated FFmpeg for pristine 1080x1920 (9:16) vertical output."
    },
    {
      q: "How accurate are the kinetic auto-captions?",
      a: "We utilize OpenAI Whisper Large-v3 with custom fine-tuning on social media vernacular, slang, and technical terminology. It achieves a 99.4% speech recognition accuracy across 50+ languages with millisecond-exact word timestamp alignments."
    },
    {
      q: "Can I customize the captions to match my personal or agency brand?",
      a: "Yes! You can choose from pre-built viral presets (Hormozi Bold, MrBeast Pop, Cyberpunk Neon, Vox Minimalist) or customize font family, stroke width, background pill colors, letter spacing, and automated emoji pop-ins directly inside our Studio Editor."
    },
    {
      q: "Are the generated videos watermarked?",
      a: "No! All videos exported through ClipForge AI are 100% watermark-free, uncompressed full HD 1080p, and you retain complete commercial ownership of your content for YouTube, TikTok, and Instagram monetization."
    }
  ];

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-28 space-y-16 bg-white text-slate-900">
      
      {/* ========================================================================= */}
      {/* 1. HERO HEADER INTRO */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-mono font-medium shadow-xs">
          <span className="material-symbols-outlined text-[15px] text-indigo-600">auto_awesome</span>
          <span>ClipForge Neural Engine v2.4 • Architecture & Capabilities</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Engineered for <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent">Maximum Viewer Retention</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
          From multi-segment timestamp discovery to hardware-accelerated 9:16 vertical re-framing and word-level animated subtitles, explore the complete technology stack powering modern creators.
        </p>

        {/* Quick Highlights Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs font-medium text-slate-600">
          <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            99.4% Whisper Accuracy
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            &lt;15s FFmpeg Transcoding
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            3.4x Reach Multiplier
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            50+ Languages Supported
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CATEGORY FILTER BAR */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-center overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold shadow-xs">
          {[
            { id: 'all', label: 'All Features', icon: 'grid_view' },
            { id: 'slicing', label: 'Multi-Segment Slicing', icon: 'content_cut' },
            { id: 'captions', label: 'Kinetic Subtitles', icon: 'subtitles' },
            { id: 'reframing', label: '9:16 Face Tracking', icon: 'center_focus_strong' },
            { id: 'analytics', label: 'Virality Scoring', icon: 'analytics' },
            { id: 'pipeline', label: 'Tech Pipeline', icon: 'memory' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                addToast(`Filtered: ${cat.label}`, 'info');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CORE FEATURE MODULE 1: MULTI-SEGMENT RETENTION DETECTION */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'slicing' || activeCategory === 'analytics') && (
        <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-sky-700 uppercase tracking-wider mb-1 font-semibold">
                <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-700">Module 01</span>
                <span>Proportional Slicing Algorithm</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-indigo-600 text-[28px]">psychology</span>
                AI Multi-Segment Viral Moment Detection
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <span className="material-symbols-outlined text-[16px] text-indigo-600">speed</span>
              <span>Real-Time Cadence Analysis</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Most automated tools naively chop the first 60 seconds of a video. ClipForge's transformer model scans your entire long-form recording, analyzing <strong>acoustic cadence, volume velocity, laughter bursts, and curiosity keywords</strong>.
              </p>
              
              <div className="space-y-2.5 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                  <div>
                    <h4 className="text-slate-900 font-semibold text-xs">The Curiosity Hook (Intro 5-15%)</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Stops the scroll by presenting high-tension questions or counter-intuitive statements.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                  <div>
                    <h4 className="text-slate-900 font-semibold text-xs">The High-Energy Climax (Mid 40-60%)</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Picks the debate peak, revelation, or dramatic story twist that maximizes watch time.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                  <div>
                    <h4 className="text-slate-900 font-semibold text-xs">The Golden Nugget (Outro 75-90%)</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Actionable advice or philosophical wrap-up that triggers saves and shares.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Timeline Graph */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Interactive Timeline: Click peak moments to inspect retention</span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-xs">
                  Viral Score: {retentionPoint.score}%
                </span>
              </div>

              {/* Bar Graph Simulation */}
              <div className="relative w-full h-36 flex items-end gap-2 pt-6 px-1 border-b border-slate-200 pb-2 bg-white rounded-xl p-3 border">
                {[
                  { time: 4, score: 45, tag: 'Context Setup', desc: 'Standard podcast introductory greeting and sponsorship check.', height: '35%', col: 'bg-slate-200 hover:bg-slate-300', boost: 'Baseline' },
                  { time: 8, score: 98, tag: 'The Curiosity Hook', desc: 'The Exact Blueprint: Why 99% of creators fail in the first 3 seconds.', height: '98%', col: 'bg-indigo-600 shadow-sm', boost: '+142% Retention Spike' },
                  { time: 14, score: 62, tag: 'Background Lore', desc: 'Explaining past experiments and technical methodology.', height: '55%', col: 'bg-indigo-200 hover:bg-indigo-300', boost: '+12% Baseline' },
                  { time: 24, score: 94, tag: 'Shock Revelation', desc: 'The $1.4M Mistake that almost destroyed our media company.', height: '94%', col: 'bg-violet-600 shadow-sm', boost: '+118% Viral Peak' },
                  { time: 31, score: 58, tag: 'Technical Nuance', desc: 'Discussing camera lens choices and recording equipment.', height: '50%', col: 'bg-slate-200 hover:bg-slate-300', boost: '+8% Baseline' },
                  { time: 42, score: 91, tag: 'Actionable Blueprint', desc: 'The 3-Step Execution Model you can implement immediately.', height: '91%', col: 'bg-sky-500 shadow-sm', boost: '+95% Save Trigger' }
                ].map((bar, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setRetentionPoint(bar);
                      addToast(`Inspecting: ${bar.tag} (${bar.score}%)`, 'info');
                    }}
                    className={`flex-1 ${bar.col} rounded-t-lg cursor-pointer transition-all hover:scale-y-105 origin-bottom relative group`}
                    style={{ height: bar.height }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] text-white font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {bar.score}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Moment Detail Display */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-bold">{retentionPoint.tag}</span>
                      <span className="text-indigo-600 text-[11px]">(00:{retentionPoint.time < 10 ? '0' + retentionPoint.time : retentionPoint.time}:00)</span>
                    </div>
                    <span className="text-slate-500 text-[11px] line-clamp-1">{retentionPoint.desc}</span>
                  </div>
                </div>
                <span className="text-indigo-700 font-bold px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 self-start sm:self-center">
                  {retentionPoint.boost}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. CORE FEATURE MODULE 2: KINETIC AUTO-CAPTIONS & SUBTITLES */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'captions') && (
        <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 uppercase tracking-wider mb-1 font-semibold">
                <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200">Module 02</span>
                <span>Word-Level Animated Subtitles</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-indigo-600 text-[28px]">subtitles</span>
                Kinetic Auto-Captions Sandbox
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-600 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              OpenAI Whisper Large-v3 Integration
            </span>
          </div>

          <p className="text-sm text-slate-600">
            83% of mobile users watch short-form videos with sound off. Test our dynamic word-by-word highlighted caption styles and customize your typography in real-time below:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Caption Controls */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                  <span>Custom Caption Text Preview:</span>
                  <span className="text-[10px] text-slate-500 font-mono">(Type anything to test)</span>
                </label>
                <input
                  type="text"
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value.toUpperCase())}
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 uppercase focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                  placeholder="TYPE CAPTION WORDS HERE"
                />
              </div>

              {/* Style Presets */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Trending Creator Presets:</label>
                <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
                  {[
                    { id: 'caption-hormozi', name: 'Hormozi Punch', bg: '#FFE600', col: '#000000', border: 'border-yellow-400' },
                    { id: 'caption-mrbeast', name: 'MrBeast Pop', bg: '#00E5FF', col: '#000000', border: 'border-cyan-400' },
                    { id: 'caption-cyber', name: 'Cyberpunk Neon', bg: '#0f172a', col: '#38bdf8', border: 'border-sky-400' },
                    { id: 'caption-minimal', name: 'Minimalist Clean', bg: '#f1f5f9', col: '#0f172a', border: 'border-slate-300' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => {
                        setCaptionStyle(style.id);
                        setCaptionBg(style.bg);
                        setCaptionTextCol(style.col);
                        addToast(`Applied: ${style.name}`, 'info');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        captionStyle === style.id
                          ? `bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs`
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold">{style.name}</span>
                        <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: style.bg }}></span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal">Auto kinetic animation</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlight Palette & Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Accent Color:</label>
                  <div className="flex items-center gap-2">
                    {[
                      { bg: '#FFE600', col: '#000000' },
                      { bg: '#00E5FF', col: '#000000' },
                      { bg: '#FF2A85', col: '#FFFFFF' },
                      { bg: '#6366f1', col: '#FFFFFF' },
                      { bg: '#10b981', col: '#FFFFFF' }
                    ].map((c, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCaptionBg(c.bg);
                          setCaptionTextCol(c.col);
                        }}
                        className={`w-7 h-7 rounded-full transition-transform hover:scale-110 border border-slate-200 ${captionBg === c.bg ? 'ring-2 ring-indigo-600 ring-offset-2' : ''}`}
                        style={{ backgroundColor: c.bg }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Visual Polish:</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowEmoji(!showEmoji)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${showEmoji ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                    >
                      🔥 Auto-Emoji {showEmoji ? 'ON' : 'OFF'}
                    </button>
                    <button
                      onClick={() => setCaptionSize(captionSize === 'text-lg' ? 'text-xl' : 'text-lg')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    >
                      Font: {captionSize === 'text-lg' ? 'Standard' : 'Large'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated 9:16 Mobile Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] rounded-3xl bg-slate-950 border-4 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between p-4">
                {/* Background Image / Video Simulation */}
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpP3_3bPoiTRyB8UTAcuKGRZ-LguFnckiSxwe6fa2xPLft9J0EK8U8oKmFwaVGeEIOctN5QxdMKDsX8aJiMZ91cGafVH5ys4hSqzcoPASX6YuI8VjIWdc5Zm5eXzbWx9lqHjdtk6syGcv3dDFxOkGpS45yFk_18vaR3fdFN3L1vFgdutmc9aoM2n42RLR3vV_cc6J_ZTMX4f2teaCzonOwwe6x4gPoy49z7FnFDbI"
                  alt="Video background"
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none"></div>

                {/* Top UI Bar */}
                <div className="relative z-10 flex items-center justify-between text-white text-xs">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md font-mono text-[10px] text-sky-400">
                    ● 9:16 VERTICAL
                  </span>
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                </div>

                {/* Right Engagement Floating Icons */}
                <div className="relative z-10 self-end flex flex-col items-center gap-3 text-white">
                  <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-[24px] text-red-500">favorite</span>
                    <span className="text-[10px] font-mono">148k</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
                    <span className="text-[10px] font-mono">3.2k</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-[24px] text-sky-400">bookmark</span>
                    <span className="text-[10px] font-mono">29k</span>
                  </div>
                </div>

                {/* Centered Rendered Kinetic Caption */}
                <div className="relative z-10 text-center mb-6 px-2">
                  <div
                    className={`${captionStyle} ${captionSize} font-extrabold uppercase px-3 py-1.5 rounded-lg inline-block shadow-2xl transition-all duration-200 transform scale-105`}
                    style={{ backgroundColor: captionBg, color: captionTextCol }}
                  >
                    {showEmoji && '🔥 '}
                    {captionInput || 'NEVER STOP TESTING'}
                    {showEmoji && ' ⚡'}
                  </div>
                  <div className="text-[10px] text-white/90 font-mono mt-2 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm inline-block">
                    @00:08.40 • Whisper Synchronized
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. CORE FEATURE MODULE 3: ACTIVE SPEAKER TRACKING */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'reframing') && (
        <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-violet-700 uppercase tracking-wider mb-1 font-semibold">
                <span className="px-2 py-0.5 rounded bg-violet-50 border border-violet-200 text-violet-700">Module 03</span>
                <span>Computer Vision Re-framing</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-indigo-600 text-[28px]">center_focus_strong</span>
                Active Speaker Tracking (16:9 to 9:16)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-600 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              Zero Face-Cutting Guarantee
            </span>
          </div>

          <p className="text-sm text-slate-600">
            Widescreen podcast episodes feature multiple hosts and guests. ClipForge uses <strong>MediaPipe facial landmark detection</strong> combined with audio diarization to smoothly shift the 9:16 vertical crop window without abrupt jarring jumps.
          </p>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-slate-500">Interactive Camera Switcher: Click to test neural tracking</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCameraFocus('host');
                    addToast('Camera locked onto Host (Left)', 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${cameraFocus === 'host' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                >
                  Host Speaking (Left)
                </button>
                <button
                  onClick={() => {
                    setCameraFocus('guest');
                    addToast('Camera locked onto Guest (Right)', 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${cameraFocus === 'guest' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                >
                  Guest Speaking (Right)
                </button>
                <button
                  onClick={() => {
                    setCameraFocus('split');
                    addToast('Duo Split-Screen Stack Active', 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${cameraFocus === 'split' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                >
                  Dual Stack (Split)
                </button>
              </div>
            </div>

            {/* 16:9 Stage with Animated 9:16 Crop Box */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXgBy7_PcICd2Hfy6K8PFrm3OPreyFVlSfZdJx6AYrRNaLBbtf-MjgVdTaJ_DWjo_WKatFAi9DYEctUOCth2tIugKoXelJduQtGPKvlAXak_ymRpwFdpmCmDZWugY2CwhSqopPTzvYuzR85GKN2OV-RghiCR0HTilYxJEn_F7WuXYYbHkpzrTN3IU7lOqCfy1RiyXlwo5-2yKvyIyjgTIV5qC58c2CKsE2A7CwIz8"
                alt="Studio Stage"
                className="w-full h-full object-cover"
              />

              {/* Dynamic Moving 9:16 Viewport Highlight */}
              <div
                className="absolute top-0 bottom-0 border-2 border-sky-400 bg-sky-400/10 backdrop-blur-[2px] shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all duration-500 ease-out flex flex-col justify-between p-3 pointer-events-none"
                style={{
                  left: cameraFocus === 'host' ? '12%' : cameraFocus === 'guest' ? '54%' : '26%',
                  width: cameraFocus === 'split' ? '48%' : '34%'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono bg-sky-400 text-black px-1.5 py-0.5 rounded font-bold">
                    9:16 CROP REGION
                  </span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                </div>
                <div className="self-center bg-black/85 px-2 py-1 rounded border border-sky-400/40 text-center">
                  <span className="text-[11px] font-mono font-bold text-sky-400">
                    {cameraFocus === 'host' ? 'HOST ACTIVE' : cameraFocus === 'guest' ? 'GUEST ACTIVE' : 'DUO STACK ACTIVE'}
                  </span>
                  <div className="text-[9px] text-slate-300">Gaussian Motion Smoothing</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. CORE FEATURE MODULE 4: ROI CONTENT MULTIPLIER */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'analytics') && (
        <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-sky-700 uppercase tracking-wider mb-1 font-semibold">
                <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-700">Module 04</span>
                <span>Production Velocity Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-indigo-600 text-[28px]">calculate</span>
                Content Multiplier & ROI Simulator
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-600 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              Estimated Output Yield
            </span>
          </div>

          <p className="text-sm text-slate-600">
            Drag the slider to your average raw recording length to see how many platform-ready viral assets ClipForge automatically synthesizes:
          </p>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-600">Raw Video Input Duration:</span>
                <span className="text-lg font-bold text-indigo-600 font-mono bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
                  {videoMinutes} Minutes
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                step="15"
                value={videoMinutes}
                onChange={(e) => setVideoMinutes(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>15 mins (Quick Podcast)</span>
                <span>60 mins (Standard Episode)</span>
                <span>180 mins (Livestream Master)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center text-center shadow-xs">
                <span className="text-3xl font-black text-indigo-600 font-mono">{assetCounts.tiktoks}</span>
                <span className="text-xs font-bold text-slate-900 mt-1">TikToks</span>
                <span className="text-[10px] font-mono text-slate-500">High Momentum</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center text-center shadow-xs">
                <span className="text-3xl font-black text-sky-600 font-mono">{assetCounts.shorts}</span>
                <span className="text-xs font-bold text-slate-900 mt-1">YT Shorts</span>
                <span className="text-[10px] font-mono text-slate-500">Algorithmic Push</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center text-center shadow-xs">
                <span className="text-3xl font-black text-violet-600 font-mono">{assetCounts.reels}</span>
                <span className="text-xs font-bold text-slate-900 mt-1">IG Reels</span>
                <span className="text-[10px] font-mono text-slate-500">Share Velocity</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center text-center shadow-xs">
                <span className="text-3xl font-black text-emerald-600 font-mono">{assetCounts.hoursSaved}h</span>
                <span className="text-xs font-bold text-slate-900 mt-1">Time Saved</span>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold">vs. Manual Edit</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center text-center col-span-2 sm:col-span-1 shadow-xs">
                <span className="text-3xl font-black text-amber-600 font-mono">{assetCounts.reach}</span>
                <span className="text-xs font-bold text-slate-900 mt-1">Est. Reach</span>
                <span className="text-[10px] font-mono text-amber-600 font-semibold">+340% Lift</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 7. TECHNICAL ARCHITECTURE GRID (DEEP DIVE) */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'pipeline') && (
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-indigo-600 uppercase tracking-wider font-semibold">Engine Deep-Dive</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Full-Stack Processing Pipeline</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              How ClipForge combines industry-standard low-level media libraries with modern transformers for rapid video turnaround.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: 'terminal',
                title: 'FFmpeg 7.1 GPU Acceleration',
                tag: 'Media Core',
                desc: 'Utilizes zero-loss hardware pipelines with optimized x264/NVENC encoding. Scales 16:9 widescreen to 1080x1920 with sub-pixel interpolation.'
              },
              {
                icon: 'graphic_eq',
                title: 'EBU R128 Audio Normalization',
                tag: 'Acoustics',
                desc: 'Automatically masters loudness to mobile short standards (-14 LUFS). Removes background hum and equalizes dynamic speech range.'
              },
              {
                icon: 'auto_videocam',
                title: 'Smart B-Roll & Visual Fill',
                tag: 'Retention AI',
                desc: 'Identifies narrative lulls and automatically suggests or inserts contextually relevant visual cutaways to curb viewer abandonment.'
              },
              {
                icon: 'photo_camera',
                title: 'Instant HD Poster Extraction',
                tag: 'Click-Through Rate',
                desc: 'Extracts the single most expressive, high-contrast frame at the exact peak moment to generate click-worthy preview thumbnails.'
              },
              {
                icon: 'api',
                title: 'Developer REST API & Webhooks',
                tag: 'Integration',
                desc: 'Full programmatic access via `/api/process-video` and `/api/shorts` allows seamless automated pipelines for media companies and CMSs.'
              },
              {
                icon: 'cloud_done',
                title: 'Browser Studio Sandbox',
                tag: 'Zero-Install',
                desc: 'Fine-tune captions, adjust start/end trimmer timestamps, switch font presets, and export directly from any modern web browser.'
              }
            ].map((card, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between group shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 font-semibold">
                      {card.tag}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{card.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 8. COMPARISON MATRIX: CLIPFORGE VS TRADITIONAL EDITING */}
      {/* ========================================================================= */}
      <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-indigo-600 uppercase tracking-wider font-semibold">Competitive Edge</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">How ClipForge Compares</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            See the concrete difference between manual editing workflows, generic clipping tools, and ClipForge AI.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase bg-slate-50">
                <th className="py-3 px-4">Feature / Metric</th>
                <th className="py-3 px-4 text-indigo-600 font-bold">ClipForge AI</th>
                <th className="py-3 px-4">Manual Editing (Premiere)</th>
                <th className="py-3 px-4">Basic AI Cutters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50/60">
                <td className="py-3.5 px-4 font-semibold text-slate-900">Time to Produce 10 Shorts</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold font-mono">⚡ 60 Seconds</td>
                <td className="py-3.5 px-4 font-mono text-red-500">8+ Hours</td>
                <td className="py-3.5 px-4 font-mono">15-20 Minutes</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3.5 px-4 font-semibold text-slate-900">Multi-Segment Discovery</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">✓ Proportional Peak Slicing</td>
                <td className="py-3.5 px-4">Manual Timeline Scrubbing</td>
                <td className="py-3.5 px-4 text-red-500">✗ First 60s Only</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3.5 px-4 font-semibold text-slate-900">Word-by-Word Subtitles</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">✓ Whisper Large-v3 Included</td>
                <td className="py-3.5 px-4">Requires $40/mo plugin</td>
                <td className="py-3.5 px-4">Basic static blocks</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3.5 px-4 font-semibold text-slate-900">9:16 Adaptive Re-framing</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">✓ Active Speaker Face Tracking</td>
                <td className="py-3.5 px-4">Manual Keyframing</td>
                <td className="py-3.5 px-4 text-red-500">✗ Fixed Center Crop</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3.5 px-4 font-semibold text-slate-900">AI Virality Retention Score</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">✓ Predictive Retention (0-100%)</td>
                <td className="py-3.5 px-4">Subjective Guesswork</td>
                <td className="py-3.5 px-4 text-red-500">✗ Not Available</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3.5 px-4 font-semibold text-slate-900">Export Quality & Watermark</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">1080p 60fps • 100% Watermark-Free</td>
                <td className="py-3.5 px-4">1080p (Manual render)</td>
                <td className="py-3.5 px-4 text-red-500">720p with Watermark</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      {/* ========================================================================= */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-indigo-600 uppercase tracking-wider font-semibold">Got Questions?</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Frequently Asked Questions</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Everything you need to know about processing capabilities, licensing, and audio fidelity.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:text-indigo-600 transition-colors"
              >
                <span>{item.q}</span>
                <span className="material-symbols-outlined text-indigo-600 transition-transform duration-300" style={{ transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0)' }}>
                  expand_more
                </span>
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CLOSING CTA BANNER */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-mono text-sky-300 uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
            Start Multiplying Your Videos Today
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Turn 1 Video Into 10 Viral Shorts?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Paste any YouTube URL or upload a raw file to test ClipForge's multi-segment slicing, kinetic auto-captions, and AI virality predictor.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setCurrentPage('clip')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px] text-indigo-600">auto_videocam</span>
              <span>Generate Viral Clips Now</span>
            </button>

            <button
              onClick={() => setCurrentPage('studio')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">movie_edit</span>
              <span>Open Studio Editor</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-mono pt-1">
            ✓ 60 Free GPU Processing Minutes • No Credit Card Required • Instant HD Export
          </p>
        </div>
      </div>

    </main>
  );
}
