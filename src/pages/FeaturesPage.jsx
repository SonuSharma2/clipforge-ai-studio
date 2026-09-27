import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function FeaturesPage() {
  const { setCurrentPage, addToast } = useApp();

  // Module 1: Retention Graph
  const [retentionPoint, setRetentionPoint] = useState({
    time: 8,
    score: 98,
    desc: 'Viral Hook: The Exact Blueprint'
  });

  // Module 2: Kinetic Captions
  const [captionInput, setCaptionInput] = useState('NEVER STOP TESTING');
  const [captionStyle, setCaptionStyle] = useState('caption-hormozi');
  const [captionBg, setCaptionBg] = useState('#FFE600');
  const [captionTextCol, setCaptionTextCol] = useState('#000000');

  // Module 3: Active Speaker Tracking
  const [cameraFocus, setCameraFocus] = useState('host'); // host, guest, split

  // Module 4: Multiplier
  const [videoMinutes, setVideoMinutes] = useState(45);

  const calculateAssets = (mins) => {
    const factor = mins / 15;
    return {
      tiktoks: Math.round(factor * 1),
      shorts: Math.round(factor * 1.3),
      reels: Math.round(factor * 1),
      reach: `${Math.round(factor * 80)}K+`
    };
  };

  const assetCounts = calculateAssets(videoMinutes);

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-28 space-y-12">
      {/* HEADER INTRO */}
      <div className="flex flex-col space-y-2 text-center items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-mono border border-surface-container-highest">
          <span className="material-symbols-outlined text-[14px]">psychology</span>
          <span>Built For Scale • High-Performance AI Modules</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Engineered for 10x Content Virality
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg leading-relaxed">
          Test and experience ClipForge's 4 core neural systems below. Every feature is tuned for low-latency video processing and maximum viewer retention.
        </p>
      </div>

      {/* FEATURE 1: AI VIRAL MOMENT DETECTION & RETENTION GRAPH */}
      <section className="rounded-2xl bg-surface-container-low border border-surface-container-highest p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-highest pb-4">
          <div>
            <span className="text-xs font-mono text-tertiary uppercase tracking-widest">Module 01</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">psychology</span>
              AI Viral Moment Detection Sandbox
            </h2>
          </div>
          <span className="text-xs font-mono text-outline">Real-Time Retention Prediction</span>
        </div>

        <p className="text-xs sm:text-sm text-on-surface-variant">
          Our proprietary transformer model analyzes acoustic volume cadence, laughter bursts, pace accelerations, and semantic curiosity hooks to predict audience drop-off markers.
        </p>

        {/* Interactive Retention Curve Simulation */}
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-highest space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-outline">Click bars on the timeline to inspect retention spikes:</span>
            <span className="px-2.5 py-0.5 rounded bg-tertiary text-black font-bold">
              Virality Score: {retentionPoint.score}%
            </span>
          </div>

          {/* Retention Bar Graph */}
          <div className="relative w-full h-32 flex items-end gap-1.5 pt-4">
            {[
              { time: 5, score: 45, desc: 'Cold Intro (Normal)', height: '30%', col: 'bg-primary/20 hover:bg-primary/40' },
              { time: 7, score: 52, desc: 'Setup Context', height: '35%', col: 'bg-primary/20 hover:bg-primary/40' },
              { time: 8, score: 98, desc: 'Viral Hook: The Exact Blueprint', height: '98%', col: 'bg-tertiary/80 shadow-[0_0_12px_rgba(76,215,246,0.6)]' },
              { time: 14, score: 68, desc: 'Story Explanation', height: '60%', col: 'bg-primary/30 hover:bg-primary/40' },
              { time: 24, score: 93, desc: 'Shock Punchline: 99% Fail', height: '93%', col: 'bg-secondary/80 shadow-[0_0_12px_rgba(208,188,255,0.6)]' },
              { time: 29, score: 62, desc: 'Data Demonstration', height: '55%', col: 'bg-primary/30 hover:bg-primary/40' },
              { time: 33, score: 89, desc: 'Climax & CTA', height: '89%', col: 'bg-primary/60 shadow-[0_0_12px_rgba(192,193,255,0.6)]' }
            ].map((bar, i) => (
              <div
                key={i}
                onClick={() => {
                  setRetentionPoint(bar);
                  addToast(`Selected moment: ${bar.desc} (${bar.score}%)`, 'info');
                }}
                className={`w-full ${bar.col} rounded-t cursor-pointer transition-all hover:scale-y-105 origin-bottom`}
                style={{ height: bar.height }}
                title={`${bar.desc} (${bar.score}%)`}
              />
            ))}
          </div>

          <div className="p-3 rounded-lg bg-surface-container border border-surface-container-highest flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[18px]">auto_fix_high</span>
              <span className="text-white font-semibold">
                {retentionPoint.desc} (00:{retentionPoint.time < 10 ? '0' + retentionPoint.time : retentionPoint.time})
              </span>
            </div>
            <span className="text-tertiary font-bold">+140% Retention Spike</span>
          </div>
        </div>
      </section>

      {/* FEATURE 2: KINETIC AUTO-CAPTIONS SANDBOX */}
      <section className="rounded-2xl bg-surface-container-low border border-surface-container-highest p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-highest pb-4">
          <div>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Module 02</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">subtitles</span>
              Kinetic Auto-Captions Sandbox
            </h2>
          </div>
          <span className="text-xs font-mono text-outline">99.2% Whisper Accuracy</span>
        </div>

        <p className="text-xs sm:text-sm text-on-surface-variant">
          Type any sentence below and instantly preview how word-by-word highlighted captions render on mobile feeds.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-outline">Test Custom Caption Text:</label>
              <input
                type="text"
                value={captionInput}
                onChange={(e) => setCaptionInput(e.target.value.toUpperCase())}
                className="w-full p-3 rounded-xl bg-surface-container-lowest border border-surface-container text-sm font-bold text-white uppercase focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-outline">Preset Style:</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => {
                    setCaptionStyle('caption-hormozi');
                    setCaptionBg('#FFE600');
                    setCaptionTextCol('#000000');
                    addToast('Style: Hormozi Punch', 'info');
                  }}
                  className={`p-2.5 rounded-lg border text-center font-bold transition-all ${captionStyle === 'caption-hormozi' ? 'bg-surface-container border-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-outline'}`}
                >
                  Hormozi (Yellow)
                </button>
                <button
                  onClick={() => {
                    setCaptionStyle('caption-mrbeast');
                    setCaptionBg('#00E5FF');
                    setCaptionTextCol('#000000');
                    addToast('Style: MrBeast Glow', 'info');
                  }}
                  className={`p-2.5 rounded-lg border text-center font-bold transition-all ${captionStyle === 'caption-mrbeast' ? 'bg-surface-container border-tertiary text-white' : 'bg-surface-container hover:bg-surface-container-high text-outline'}`}
                >
                  MrBeast (Cyan)
                </button>
                <button
                  onClick={() => {
                    setCaptionStyle('caption-cyber');
                    setCaptionBg('rgba(17,19,25,0.9)');
                    setCaptionTextCol('#4cd7f6');
                    addToast('Style: Cyberpunk Neon', 'info');
                  }}
                  className={`p-2.5 rounded-lg border text-center font-bold transition-all ${captionStyle === 'caption-cyber' ? 'bg-surface-container border-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-outline'}`}
                >
                  Cyberpunk
                </button>
                <button
                  onClick={() => {
                    setCaptionStyle('caption-minimal');
                    setCaptionBg('rgba(255,255,255,0.15)');
                    setCaptionTextCol('#ffffff');
                    addToast('Style: Minimal Glass', 'info');
                  }}
                  className={`p-2.5 rounded-lg border text-center font-bold transition-all ${captionStyle === 'caption-minimal' ? 'bg-surface-container border-white text-white' : 'bg-surface-container hover:bg-surface-container-high text-outline'}`}
                >
                  Minimal Glass
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-outline">Caption Highlight Color:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setCaptionBg('#FFE600'); setCaptionTextCol('#000000'); }}
                  className="w-7 h-7 rounded-full bg-[#FFE600] border-2 border-white"
                />
                <button
                  onClick={() => { setCaptionBg('#00E5FF'); setCaptionTextCol('#000000'); }}
                  className="w-7 h-7 rounded-full bg-[#00E5FF]"
                />
                <button
                  onClick={() => { setCaptionBg('#FF2A85'); setCaptionTextCol('#FFFFFF'); }}
                  className="w-7 h-7 rounded-full bg-[#FF2A85]"
                />
                <button
                  onClick={() => { setCaptionBg('#8083ff'); setCaptionTextCol('#FFFFFF'); }}
                  className="w-7 h-7 rounded-full bg-[#8083ff]"
                />
                <button
                  onClick={() => { setCaptionBg('#00FF66'); setCaptionTextCol('#000000'); }}
                  className="w-7 h-7 rounded-full bg-[#00FF66]"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Mockup */}
          <div className="w-full aspect-[9/10] sm:aspect-[9/9] rounded-2xl bg-black border border-surface-container-highest overflow-hidden relative flex items-center justify-center p-4">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpP3_3bPoiTRyB8UTAcuKGRZ-LguFnckiSxwe6fa2xPLft9J0EK8U8oKmFwaVGeEIOctN5QxdMKDsX8aJiMZ91cGafVH5ys4hSqzcoPASX6YuI8VjIWdc5Zm5eXzbWx9lqHjdtk6syGcv3dDFxOkGpS45yFk_18vaR3fdFN3L1vFgdutmc9aoM2n42RLR3vV_cc6J_ZTMX4f2teaCzonOwwe6x4gPoy49z7FnFDbI"
              alt="Preview"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

            <div className="absolute bottom-8 left-4 right-4 text-center">
              <span
                className={`${captionStyle} text-base sm:text-lg inline-block`}
                style={{ backgroundColor: captionBg, color: captionTextCol }}
              >
                "{captionInput}"
              </span>
            </div>

            <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-tertiary">
              ✦ Word-by-Word Kinetic Pop Active
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 3: ACTIVE SPEAKER TRACKING */}
      <section className="rounded-2xl bg-surface-container-low border border-surface-container-highest p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-highest pb-4">
          <div>
            <span className="text-xs font-mono text-secondary uppercase tracking-widest">Module 03</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">center_focus_strong</span>
              Active Speaker Tracking (16:9 to 9:16)
            </h2>
          </div>
          <span className="text-xs font-mono text-outline">Dual-Speaker Neural Crop</span>
        </div>

        <p className="text-xs sm:text-sm text-on-surface-variant">
          See how our active face tracking model locks onto whichever podcast host is speaking, automatically sliding the 9:16 vertical crop window without cutting off reactions.
        </p>

        {/* Reframe Simulator */}
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-highest space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-outline">Camera Focus Target:</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setCameraFocus('host'); addToast('Camera locked to Host (Left)', 'info'); }}
                className={`px-3 py-1 rounded transition-colors ${cameraFocus === 'host' ? 'bg-primary-container text-white font-semibold' : 'bg-surface-container text-outline hover:text-white'}`}
              >
                Host (Left)
              </button>
              <button
                onClick={() => { setCameraFocus('guest'); addToast('Camera locked to Guest (Right)', 'info'); }}
                className={`px-3 py-1 rounded transition-colors ${cameraFocus === 'guest' ? 'bg-primary-container text-white font-semibold' : 'bg-surface-container text-outline hover:text-white'}`}
              >
                Guest (Right)
              </button>
              <button
                onClick={() => { setCameraFocus('split'); addToast('Dual Host Stack Active', 'info'); }}
                className={`px-3 py-1 rounded transition-colors ${cameraFocus === 'split' ? 'bg-primary-container text-white font-semibold' : 'bg-surface-container text-outline hover:text-white'}`}
              >
                Duo Stack
              </button>
            </div>
          </div>

          {/* 16:9 Stage with Animated 9:16 Crop Box */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-surface-container-highest">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXgBy7_PcICd2Hfy6K8PFrm3OPreyFVlSfZdJx6AYrRNaLBbtf-MjgVdTaJ_DWjo_WKatFAi9DYEctUOCth2tIugKoXelJduQtGPKvlAXak_ymRpwFdpmCmDZWugY2CwhSqopPTzvYuzR85GKN2OV-RghiCR0HTilYxJEn_F7WuXYYbHkpzrTN3IU7lOqCfy1RiyXlwo5-2yKvyIyjgTIV5qC58c2CKsE2A7CwIz8"
              alt="Stage"
              className="w-full h-full object-cover"
            />

            {/* Moving 9:16 Crop Window */}
            <div
              className="absolute top-0 bottom-0 border-2 border-tertiary bg-tertiary/10 backdrop-blur-[1px] shadow-[0_0_24px_rgba(76,215,246,0.5)] transition-all duration-500 ease-out flex flex-col justify-between p-2 pointer-events-none"
              style={{
                left: cameraFocus === 'host' ? '12%' : cameraFocus === 'guest' ? '54%' : '26%',
                width: cameraFocus === 'split' ? '48%' : '34%'
              }}
            >
              <span className="text-[9px] font-mono bg-tertiary text-black px-1 rounded font-bold w-fit">
                9:16 CROP
              </span>
              <span className="text-[10px] font-mono text-tertiary bg-black/80 px-1.5 py-0.5 rounded self-center">
                {cameraFocus === 'host' ? 'HOST ACTIVE' : cameraFocus === 'guest' ? 'GUEST ACTIVE' : 'DUO STACK'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 4: CONTENT MULTIPLIER CALCULATOR */}
      <section className="rounded-2xl bg-surface-container-low border border-surface-container-highest p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-highest pb-4">
          <div>
            <span className="text-xs font-mono text-tertiary uppercase tracking-widest">Module 04</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">calculate</span>
              Content Multiplier & Schedule Engine
            </h2>
          </div>
          <span className="text-xs font-mono text-outline">ROI Calculator</span>
        </div>

        <p className="text-xs sm:text-sm text-on-surface-variant">
          Move the slider below to see how many high-impact viral assets ClipForge extracts from your long-form video library.
        </p>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-highest space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-outline">Original Video Length:</span>
              <span className="text-tertiary font-bold text-sm">{videoMinutes} Minutes</span>
            </div>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={videoMinutes}
              onChange={(e) => setVideoMinutes(Number(e.target.value))}
              className="w-full accent-tertiary"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-surface-container border border-surface-container-highest flex flex-col items-center text-center">
              <span className="text-2xl font-bold text-primary font-mono">{assetCounts.tiktoks}</span>
              <span className="text-xs font-medium text-white mt-0.5">TikToks</span>
              <span className="text-[10px] font-mono text-outline">High Velocity</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-container border border-surface-container-highest flex flex-col items-center text-center">
              <span className="text-2xl font-bold text-tertiary font-mono">{assetCounts.shorts}</span>
              <span className="text-xs font-medium text-white mt-0.5">YT Shorts</span>
              <span className="text-[10px] font-mono text-outline">SEO Optimized</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-container border border-surface-container-highest flex flex-col items-center text-center">
              <span className="text-2xl font-bold text-secondary font-mono">{assetCounts.reels}</span>
              <span className="text-xs font-medium text-white mt-0.5">IG Reels</span>
              <span className="text-[10px] font-mono text-outline">Visual Hook</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-container border border-surface-container-highest flex flex-col items-center text-center">
              <span className="text-2xl font-bold text-white font-mono">{assetCounts.reach}</span>
              <span className="text-xs font-medium text-white mt-0.5">Est. Reach</span>
              <span className="text-[10px] font-mono text-tertiary">+340% Boost</span>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => setCurrentPage('clip')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary-container to-secondary-container text-white text-xs font-semibold shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Multiply My First Video Free</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
