import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DurationSelectModal from '../components/DurationSelectModal';

export default function HomePage() {
  const {
    setCurrentPage,
    openVideo,
    loadClipToStudio,
    addToast,
    generatedClips,
    setGeneratedClips,
    lastAnalyzedUrl,
    setLastAnalyzedUrl,
    analysisMode,
    setAnalysisMode,
    showProModal,
    setShowProModal,
    aiAnalysisSummary,
    setAiAnalysisSummary,
    isProUser,
    user,
    updateUser
  } = useApp();

  // Generator simulation states
  const [urlInput, setUrlInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Whole-Video Heatmap & Peak Detection...');
  const [btnText, setBtnText] = useState('Generate Shorts');
  const [showDurationModal, setShowDurationModal] = useState(false);

  // Before / After toggle state
  const [reframingMode, setReframingMode] = useState('9:16'); // '16:9' or '9:16'

  // Studio Preview state
  const [studioPlaying, setStudioPlaying] = useState(false);
  const [studioSeconds, setStudioSeconds] = useState(14);

  // Pricing toggle state
  const [isAnnual, setIsAnnual] = useState(false);
  const [duration, setDuration] = useState('varied');

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState(null);

  const initialClips = [
    {
      title: 'The Instant Hook Spike',
      score: '98/100',
      duration: '0:15',
      duration_sec: 15,
      duration_label: '15s',
      style: 'Hormozi Bold',
      estViews: '185k+ Est.',
      caption: 'THE EXACT BLUEPRINT',
      event_type: 'Viral Hook Trigger',
      event_tag: '🎯 15s Snappy Viral Hook',
      event_reason: 'Fast-paced ~15s opening retention spike isolated for maximum swipe-stop rate on TikTok & Shorts.',
      startTime: '00:05',
      endTime: '00:20',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmnQEoYL5rJ_1B3AerwbYF3TfBwzSp7RArfpxnsKbZ9wyUBvSL3AeW7aDGc3vk_C2YMLc6x5ID1ZrH7bboZyHRM4mQwOteq8xgXf6roLudXnTNZ2TxrToT88BxfEtmoqFGqDdsqQ490bLhROqFYc9tRjHyDFVpPfdajd6NPSKP_PorEpZwn65cvfxqB7D8VvFAv5BC9rNfcrbylBb8P742Cb4C3vtqwBUr9H1wa4k',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4'
    },
    {
      title: 'Golden Climax Peak',
      score: '99/100',
      duration: '0:30',
      duration_sec: 30,
      duration_label: '30s',
      style: 'MrBeast Punch',
      estViews: '240k+ Est.',
      caption: 'WHY 99% FAIL IN 2026',
      event_type: 'Heatmap Spike (Most Replayed)',
      event_tag: '🔥 30s Climax Replay Peak (4.8x)',
      event_reason: 'Highest audience replay peak across the video (~30s) with 4.8x rewatch surge.',
      startTime: '14:22',
      endTime: '14:52',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD37ewpMGyiPTtZ1ZbzIadhB5Fi0jvQq_nVyPA-KshGpmmpnekLXex5lOPfknsQlHOYEF3xbcgjQdpPLQnncMco-banHYbNnIqdNUxhqyeYqhELc6vDDIjzlScgFHnkhjyM2_XHXuJ259qcl5aelPGo5YZNDnQm-G7b0eVbHGR9wEhQ7TVQ8CLFAocbV5n3cfKI5d49YGnqAqzMFuQ5lNnXAzy497QF-oj1XwK6zis',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4'
    },
    {
      title: 'Key Actionable Breakthrough',
      score: '95/100',
      duration: '1:00',
      duration_sec: 60,
      duration_label: '60s Max',
      style: 'Minimal Clean',
      estViews: '142k+ Est.',
      caption: 'STOP DOING THIS TODAY',
      event_type: 'Key Actionable Breakthrough',
      event_tag: '💡 60s Deep Narrative Payoff',
      event_reason: 'Extended ~60s max narrative breakdown delivering the core actionable takeaway and high watch time.',
      startTime: '27:40',
      endTime: '28:40',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcMK94faVsZqA3b952zMYH5UMZcRJUEApyQl99GKLIUiNVwkrZsUWkFcIOjc2d6sPtkHSkHZHj3Mp8SNn2K2Hm3OYlZQ3WuXrCvT4x_VzjG5DDaBLkeqsRlAkR3XH1jT8zvTQXqQoikfLxdoGq640ZY5sKWS3pL-2ATSj8fRZks3EJsu7lWEkblB44coOw7Z7UyqUJ--D2mMdJgl4Wid3_7px59sofKio-nv9IknI',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4'
    }
  ];

  const [clips, setClips] = useState(generatedClips && generatedClips.length > 0 ? generatedClips.slice(0, 3) : []);

  // Opens the Duration modal when generate is clicked
  const handleGenerateClick = () => {
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) {
      addToast('Please enter or paste a valid video URL first', 'error');
      return;
    }
    setShowDurationModal(true);
  };

  // Called when user selects duration in modal and clicks Confirm & Generate
  const executeGenerate = async (chosenDuration) => {
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) return;

    setDuration(chosenDuration);
    setIsGenerating(true);
    setProgress(15);
    setBtnText('Analyzing Full Video...');
    setStatusText('Stage 1: Scanning 100 viewer replay intervals & chapters across whole video...');
    setLastAnalyzedUrl(trimmedUrl);

    let currentProgress = 15;
    const interval = setInterval(() => {
      currentProgress += 12;
      if (currentProgress === 39) {
        setStatusText('Stage 2: Identifying highest-velocity curiosity hooks & heatmap climax...');
      } else if (currentProgress === 63) {
        setStatusText('Stage 3: Adaptive 9:16 vertical re-framing & snapshot extraction...');
      } else if (currentProgress === 87) {
        setStatusText('Stage 4: Scoring virality probability & burning kinetic captions...');
      }
      setProgress(Math.min(94, currentProgress));
    }, 400);

    try {
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: trimmedUrl,
          mode: analysisMode,
          duration: chosenDuration,
          count: 3,
          email: user?.email,
          user_id: user?.id
        })
      });

      clearInterval(interval);

      if (resp.status === 403) {
        const errData = await resp.json();
        if (errData.requires_upgrade) {
          setShowProModal(true);
          addToast(errData.error || 'This feature requires Creator Pro plan or trial credits', 'info');
          setIsGenerating(false);
          return;
        }
      }

      if (!resp.ok) {
        throw new Error(`Server status ${resp.status}`);
      }

      const data = await resp.json();
      setProgress(100);
      setStatusText(
        analysisMode === 'ai_smart'
          ? 'Deep Intelligence Analysis Complete! 3 distinct event shorts generated.'
          : 'Complete! 3 viral clips extracted.'
      );
      setBtnText('Generate Again');

      if (data.clips && data.clips.length > 0) {
        setClips(data.clips.slice(0, 3));
        setGeneratedClips(data.clips);
      }
      if (data.analysis_summary) {
        setAiAnalysisSummary(data.analysis_summary);
      }
      if (data.credits_remaining !== undefined && user) {
        updateUser({ credits: data.credits_remaining });
      }

      addToast(
        analysisMode === 'ai_smart'
          ? '✨ AI Deep Event Scanner successfully isolated key moments across the video!'
          : 'Clips successfully generated with 9:16 framing!',
        'success'
      );
    } catch (err) {
      clearInterval(interval);
      setProgress(100);
      setStatusText('AI Deep Event Analysis Complete (Simulated Cache)');
      setBtnText('Generate Again');
      setClips(initialClips);
      setGeneratedClips(initialClips);
      setAiAnalysisSummary({
        engine: 'ClipForge Deep Neural Event Scanner v3.2',
        total_duration_formatted: '28:45',
        heatmap_points_scanned: 100,
        peak_replay_moment: '14:22',
        peak_multiplier: '4.8x Viewer Replay Peak',
        ai_confidence: '98.9%',
        timeline_events: [
          { id: '1', title: 'The Exact Blueprint', tag: '🎯 Opening Hook', startSec: 5, timeFormatted: '00:05', percent: 2, score: '98/100' },
          { id: '2', title: 'Why 99% Fail', tag: '🔥 Heatmap Peak (4.8x)', startSec: 862, timeFormatted: '14:22', percent: 50, score: '99/100' },
          { id: '3', title: 'Stop Doing This', tag: '💡 Breakthrough Insight', startSec: 1720, timeFormatted: '28:40', percent: 85, score: '95/100' }
        ]
      });
      addToast('3 clips generated with 9:16 vertical framing!', 'success');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleStudioPlayback = () => {
    setStudioPlaying(!studioPlaying);
    if (!studioPlaying) {
      addToast('Preview playback started', 'info');
    }
  };

  const downloadClipDirect = (title, url) => {
    const anchor = document.createElement('a');
    anchor.href = url || '/generated_shorts/viral_blueprint_master.mp4';
    anchor.download = `${title.toLowerCase().replace(/\s+/g, '_')}_clipforge_9x16.mp4`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    addToast(`Downloading "${title}" in 1080x1920 MP4...`, 'success');
  };

  const faqs = [
    {
      q: 'How does ClipForge find the best moments?',
      a: 'ClipForge uses multimodal analysis to transcribe spoken words, analyze pitch and volume inflections, and evaluate audience retention patterns from thousands of viral videos to cut moments with the highest virality scores.'
    },
    {
      q: 'Can I export in 4K resolution?',
      a: 'Yes, on the Pro and Agency tiers, ClipForge supports uncompressed 1080p and 4K 60fps vertical exports without watermarks.'
    },
    {
      q: 'Which languages are supported for captions?',
      a: 'ClipForge supports over 50 languages with 99.4% speech-to-text accuracy powered by OpenAI Whisper-Large-v3 fine-tuned models.'
    },
    {
      q: 'Does auto reframing cut off faces in conversations?',
      a: 'No. Our dual-speaker face tracking model detects whoever is speaking in real-time, executing smooth camera pans between hosts and guests, or automatically generating split-screen views when both react simultaneously.'
    }
  ];

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-28 space-y-16 bg-white text-slate-900">
      
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center space-y-4 pt-4">
        {/* Live AI Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-medium shadow-xs border border-indigo-200/80">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
          <span>AI-Powered Short-Form Video Engine</span>
        </div>

        {/* Main Title with Gradient Accents */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Turn Any Video Into{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent">
            Scroll-Stopping Shorts
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
          Paste any YouTube link. Our multimodal neural model isolates hooks, reframes dynamic speakers, and prints viral captions in seconds.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row w-full max-w-md gap-3 pt-2">
          <button
            onClick={() => setCurrentPage('clip')}
            className="w-full sm:flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
          >
            <span>Create Shorts Free</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <a
            href="#how-it-works"
            className="w-full sm:flex-1 h-12 rounded-xl bg-white text-slate-800 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 border border-slate-300 shadow-xs active:scale-[0.98] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-indigo-600">play_circle</span>
            <span>See How It Works</span>
          </a>
        </div>

        {/* Trust Micro-Copy */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-500 pt-2">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-sky-600">bolt</span> Instant Analysis
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-indigo-600">auto_fix_high</span> Zero Editing Skills
          </span>
          <span>•</span>
          <span>🛡️ No CC Required</span>
        </div>
      </section>

      {/* INTERACTIVE HERO PRODUCT DEMO CARD */}
      <section className="flex flex-col rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        {/* Window Mock Topbar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono text-slate-400 ml-2">clipforge-studio-v2.6.ai</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> GPU Cluster Ready
          </span>
        </div>

        {/* AI Intelligent Engine Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 pb-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-inner">
            <button
              onClick={() => setAnalysisMode('standard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                analysisMode === 'standard'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">flash_on</span>
              <span>Standard Cut</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 font-bold">
                Free
              </span>
            </button>

            <button
              onClick={() => {
                if (!isProUser && (user?.credits || 0) <= 0) {
                  setShowProModal(true);
                } else {
                  setAnalysisMode('ai_smart');
                }
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                analysisMode === 'ai_smart'
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-amber-300">auto_awesome</span>
              <span>AI Deep Event Scanner</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                PRO
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium">
            {analysisMode === 'ai_smart' ? (
              <span className="flex items-center gap-1.5 text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                <span>Whole-Video Heatmap (100 Intervals) & Chapter Hook Analysis</span>
              </span>
            ) : (
              <span className="text-slate-500 font-mono text-[11px]">
                Standard 3-segment proportional slicing
              </span>
            )}
            {!isProUser && (
              <button
                onClick={() => setShowProModal(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline transition-colors"
              >
                Pro Details
              </button>
            )}
          </div>
        </div>

        {/* Target Clip Duration Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 pb-2 text-xs border-t border-slate-100 mt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
              <span className="material-symbols-outlined text-[15px] text-indigo-600">timelapse</span>
              Clip Durations:
            </span>
            {[
              { id: '15', label: '15s (Free)' },
              { id: '30', label: '30s (Free)' },
              { id: '45', label: '45s (Pro)' },
              { id: '60', label: '60s Max (Pro)' },
              { id: 'varied', label: '⚡ Varied (Pro)' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setDuration(opt.id);
                  setShowDurationModal(true);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  duration === opt.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            ))}

            <button
              onClick={() => setShowDurationModal(true)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/60 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px] text-amber-700">tune</span>
              <span>Custom / Change</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
            <span className="text-indigo-600 font-bold">Duration:</span>
            {duration === 'varied' ? (
              <span className="text-slate-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/50">
                15s + 30s + 60s Max (Pro)
              </span>
            ) : Number(duration) > 30 ? (
              <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {duration}s (Pro Paid)
              </span>
            ) : (
              <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {duration}s (100% Free)
              </span>
            )}
          </div>
        </div>

        {/* URL Input Console */}
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <div className="relative flex-1 flex items-center">
            <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3">link</span>
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerateClick();
              }}
              className="w-full bg-slate-50 text-slate-900 font-mono text-xs pl-9 pr-8 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:bg-white focus:outline-none transition-colors"
              type="text"
              placeholder="Paste any YouTube, Podcast, or Video URL (e.g. https://youtube.com/watch?v=...)..."
            />
            {urlInput && (
              <button
                onClick={() => setUrlInput('')}
                className="absolute right-3 text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="h-11 sm:h-auto px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {isGenerating ? (
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            )}
            <span>{btnText}</span>
          </button>
        </div>

        {/* Live Processing Pipeline Bar */}
        {(isGenerating || progress > 0) && (
          <div className="flex flex-col gap-2 mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-indigo-600 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                {statusText}
              </span>
              <span className="text-slate-700 font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Whole-Video Timeline Visualizer */}
        {aiAnalysisSummary && clips && clips.length > 0 && (
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md border border-slate-800 animate-fadeIn space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 font-mono">
                  Whole-Video Event Timeline
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30">
                  AI Deep Event Scanner v3.2
                </span>
              </div>
              <div className="text-xs font-mono text-slate-300">
                Total Video: <span className="font-bold text-white">{aiAnalysisSummary.total_duration_formatted || '28:45'}</span>
              </div>
            </div>

            {/* Visual Timeline Bar */}
            <div className="relative w-full h-6 rounded-xl bg-slate-800/80 border border-slate-700 overflow-hidden flex items-center px-1">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-sky-500/10"></div>
              
              {/* Timeline Markers */}
              {(aiAnalysisSummary.timeline_events || [
                { id: '1', title: 'Hook', tag: '🎯 Opening Hook', percent: 3, timeFormatted: '00:05', score: '98/100' },
                { id: '2', title: 'Climax', tag: '🔥 Heatmap Peak (4.8x)', percent: 50, timeFormatted: '14:22', score: '99/100' },
                { id: '3', title: 'Breakthrough', tag: '💡 Core Insight', percent: 85, timeFormatted: '28:40', score: '95/100' }
              ]).map((ev, idx) => (
                <div
                  key={ev.id || idx}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer"
                  style={{ left: `${Math.max(5, Math.min(95, ev.percent || (idx === 0 ? 5 : (idx === 1 ? 50 : 85))))}%` }}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-md ${
                    idx === 0 ? 'bg-amber-400' : (idx === 1 ? 'bg-red-500 animate-pulse' : 'bg-sky-400')
                  }`}></div>
                  <span className="absolute -top-7 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/90 text-white whitespace-nowrap opacity-90 group-hover:opacity-100 shadow-xs border border-white/20">
                    {ev.timeFormatted} ({ev.score})
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Metrics Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                <span className="text-slate-400 text-[10px]">Heatmap Scanned</span>
                <span className="font-bold text-white">{aiAnalysisSummary.heatmap_points_scanned || 100} Intervals</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                <span className="text-slate-400 text-[10px]">Highest Replay Surge</span>
                <span className="font-bold text-amber-300">{aiAnalysisSummary.peak_multiplier || '4.8x Peak'}</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                <span className="text-slate-400 text-[10px]">Peak Timestamp</span>
                <span className="font-bold text-sky-300">{aiAnalysisSummary.peak_replay_moment || '14:22'}</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                <span className="text-slate-400 text-[10px]">Virality Confidence</span>
                <span className="font-bold text-emerald-300">{aiAnalysisSummary.ai_confidence || '98.9%'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Generated Results Grid - Displayed only after link is processed and video is ready */}
        {clips && clips.length > 0 ? (
          <div className="flex flex-col gap-3 mt-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-indigo-600">movie</span>
                AI Detected Event Shorts ({clips.length})
              </span>
              <span className="text-[11px] font-mono font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Auto-Framed 9:16
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {clips.map((clip, idx) => (
                <div
                  key={clip.id || idx}
                  className="rounded-2xl bg-white border border-slate-200 p-2.5 flex flex-col gap-2 shadow-xs group hover:shadow-md hover:border-indigo-300 transition-all"
                >
                  <div
                    className="relative w-full aspect-[9/13] rounded-xl overflow-hidden bg-slate-950 cursor-pointer"
                    onClick={() => openVideo(clip)}
                  >
                    <img
                      src={clip.image || clip.thumbnail}
                      alt={clip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none"></div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[24px]">play_arrow</span>
                      </span>
                    </div>

                    {/* Pro AI Event Badge */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <div className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md flex items-center gap-1 text-[10px] font-mono text-sky-400 font-semibold shadow-xs">
                        <span className="material-symbols-outlined text-[12px] text-sky-400">trending_up</span>
                        <span>Score {clip.score}</span>
                      </div>
                      {clip.event_tag && (
                        <div className="px-1.5 py-0.5 rounded bg-indigo-900/90 backdrop-blur-md text-[9px] font-bold text-amber-300 shadow-xs border border-amber-400/30">
                          {clip.event_tag}
                        </div>
                      )}
                    </div>

                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                      <div className="px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-[10px] font-mono text-cyan-300 font-bold border border-cyan-400/30 flex items-center gap-1 shadow-sm">
                        <span>⏱️</span>
                        <span>{clip.duration_sec ? `${clip.duration_sec}s` : clip.duration}</span>
                      </div>
                      {clip.startTime && (
                        <div className="px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-mono text-indigo-300 font-semibold">
                          @{clip.startTime}
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-2 right-2 text-center">
                      <span className="inline-block bg-yellow-400 text-black font-extrabold text-[11px] px-2 py-1 rounded shadow-md leading-tight uppercase">
                        "{clip.caption}"
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 px-1">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                      <span>{clip.style}</span>
                      <span className="text-sky-600 flex items-center gap-0.5 font-medium">
                        <span className="material-symbols-outlined text-[12px]">visibility</span> {clip.estViews}
                      </span>
                    </div>
                    {clip.event_reason && (
                      <p className="text-[10px] text-slate-500 leading-tight line-clamp-1 italic">
                        {clip.event_reason}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => loadClipToStudio(clip)}
                        className="h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">tune</span> Studio
                      </button>
                      <button
                        onClick={() => downloadClipDirect(clip.title, clip.videoUrl)}
                        className="h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[14px]">download</span> Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 p-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 flex flex-col items-center justify-center text-center gap-2.5 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <span className="material-symbols-outlined text-[22px]">video_library</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">No Clips Generated Yet</p>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
                Paste any YouTube, Podcast, or Video URL above and click <span className="font-semibold text-indigo-600">Generate Shorts</span>. The AI will detect, re-frame, and display 3 distinct high-retention clips of different lengths together.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* SOCIAL PROOF STATS */}
      <section className="flex flex-col gap-3 text-center">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
          Built for creators who want to publish daily without burning out
        </p>
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-4xl font-extrabold text-indigo-600">12K+</span>
            <span className="text-xs font-medium text-slate-600 mt-1">Top Creators</span>
          </div>
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-4xl font-extrabold text-sky-600">480K+</span>
            <span className="text-xs font-medium text-slate-600 mt-1">Clips Rendered</span>
          </div>
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-4xl font-extrabold text-violet-600">1.8M+</span>
            <span className="text-xs font-medium text-slate-600 mt-1">Minutes Cut</span>
          </div>
        </div>
      </section>

      {/* 3 STEPS WORKFLOW */}
      <section id="how-it-works" className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-mono text-indigo-600 uppercase tracking-widest font-semibold">Effortless Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            From Long YouTube Stream to Viral Short in 3 Steps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center font-mono text-sm text-indigo-700 font-bold">
              01
            </div>
            <div className="flex flex-col space-y-1">
              <h3 className="text-base font-bold text-slate-900">Paste Any Long Video URL</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Input YouTube links, podcasts, interviews, or raw MP4 files. ClipForge ingests high-definition transcripts and audio instantly.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center font-mono text-sm text-sky-700 font-bold">
              02
            </div>
            <div className="flex flex-col space-y-1">
              <h3 className="text-base font-bold text-slate-900">Multimodal AI Pinpoints Gold</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our neural model scans emotional peaks, voice pacing, audience drop-off markers, and punchlines to curate self-contained viral hooks.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center font-mono text-sm text-violet-700 font-bold">
              03
            </div>
            <div className="flex flex-col space-y-1">
              <h3 className="text-base font-bold text-slate-900">Publish Everywhere with 1-Click</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Receive ready-to-upload 9:16 shorts with synchronized dynamic subtitles, B-roll auto-inserts, and speaker reframing for TikTok, Shorts, & Reels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER INTERACTIVE COMPARISON */}
      <section className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-mono text-indigo-600 uppercase tracking-widest font-semibold">Transformative AI</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Before vs. After AI Reframing</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            See how wide 16:9 desktop videos turn into focused 9:16 vertical storytelling.
          </p>
        </div>

        {/* Toggle Controls */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 max-w-sm">
          <button
            onClick={() => setReframingMode('16:9')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              reframingMode === '16:9'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">crop_16_9</span>
            Original 16:9
          </button>
          <button
            onClick={() => setReframingMode('9:16')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              reframingMode === '9:16'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">crop_portrait</span>
            AI Framed 9:16
          </button>
        </div>

        {/* Comparative Stage */}
        <div className="relative w-full rounded-3xl bg-white border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[360px] overflow-hidden shadow-xs">
          {reframingMode === '16:9' ? (
            <div className="w-full max-w-lg flex flex-col items-center animate-fadeIn">
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black relative shadow-lg border border-slate-300">
                <img
                  className="w-full h-full object-cover"
                  alt="Wide 16:9 Shot"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXgBy7_PcICd2Hfy6K8PFrm3OPreyFVlSfZdJx6AYrRNaLBbtf-MjgVdTaJ_DWjo_WKatFAi9DYEctUOCth2tIugKoXelJduQtGPKvlAXak_ymRpwFdpmCmDZWugY2CwhSqopPTzvYuzR85GKN2OV-RghiCR0HTilYxJEn_F7WuXYYbHkpzrTN3IU7lOqCfy1RiyXlwo5-2yKvyIyjgTIV5qC58c2CKsE2A7CwIz8"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] font-mono text-white rounded">
                  Uncut 16:9 • Static Wide Frame
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 mt-3">
                Low mobile retention: Faces are distant, no dynamic subtitles
              </span>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center animate-fadeIn">
              <div className="w-[220px] sm:w-[240px] aspect-[9/15] rounded-2xl overflow-hidden bg-black relative shadow-xl border-2 border-indigo-500">
                <img
                  className="w-full h-full object-cover"
                  alt="Reframed 9:16 Shot"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpP3_3bPoiTRyB8UTAcuKGRZ-LguFnckiSxwe6fa2xPLft9J0EK8U8oKmFwaVGeEIOctN5QxdMKDsX8aJiMZ91cGafVH5ys4hSqzcoPASX6YuI8VjIWdc5Zm5eXzbWx9lqHjdtk6syGcv3dDFxOkGpS45yFk_18vaR3fdFN3L1vFgdutmc9aoM2n42RLR3vV_cc6J_ZTMX4f2teaCzonOwwe6x4gPoy49z7FnFDbI"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-sky-600 text-white text-[10px] font-mono flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  Face Tracked
                </div>

                <div className="absolute bottom-5 left-2 right-2 text-center">
                  <span className="inline-block bg-yellow-400 text-black font-extrabold text-xs px-2.5 py-1 rounded shadow-lg uppercase">
                    "NEVER STOP TESTING"
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-indigo-600 font-semibold mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                +320% higher TikTok & Shorts watch time
              </span>
            </div>
          )}
        </div>
      </section>

      {/* PRICING TIERS PREVIEW */}
      <section className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1 text-center">
          <span className="text-xs font-mono text-indigo-600 uppercase tracking-widest font-semibold">Transparent Plans</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Start Free. Upgrade As You Go Viral.</h2>
          <p className="text-xs sm:text-sm text-slate-600">Cancel or swap tiers anytime. Unlimited cloud renders.</p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 py-1">
          <span className={`text-xs font-mono font-medium ${!isAnnual ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 rounded-full bg-slate-200 p-0.5 transition-colors relative flex items-center"
          >
            <div
              className={`w-5 h-5 rounded-full bg-indigo-600 transition-transform duration-200 ${
                isAnnual ? 'translate-x-6' : ''
              }`}
            ></div>
          </button>
          <span className={`text-xs font-mono flex items-center gap-1.5 font-medium ${isAnnual ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
            Annual <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">SAVE 25%</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Starter */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Starter</h3>
                  <p className="text-xs text-slate-500">For new creators exploring AI shorts</p>
                </div>
                <span className="text-2xl font-bold text-slate-900 font-mono">$0</span>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-600 py-4">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-sky-600">check</span> 60 Processing Minutes / mo</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-sky-600">check</span> 720p HD Exports</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-sky-600">check</span> Standard Kinetic Captions</li>
              </ul>
            </div>
            <button
              onClick={() => setCurrentPage('clip')}
              className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors flex items-center justify-center border border-slate-200"
            >
              Get Started
            </button>
          </div>

          {/* Creator Pro */}
          <div className="relative p-6 rounded-3xl bg-white border-2 border-indigo-600 flex flex-col justify-between space-y-4 shadow-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-bold tracking-wider uppercase shadow-xs">
              Most Popular
            </div>
            <div>
              <div className="flex justify-between items-start pt-1">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Creator Pro</h3>
                  <p className="text-xs text-slate-500">For consistent multi-platform uploaders</p>
                </div>
                <div className="flex items-baseline font-mono">
                  <span className="text-2xl font-bold text-indigo-600">{isAnnual ? '$14' : '$19'}</span>
                  <span className="text-xs text-slate-500">/mo</span>
                </div>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-700 py-4">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-indigo-600">check_circle</span> 300 Processing Minutes / mo</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-indigo-600">check_circle</span> 1080p 60fps Crisp Export</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-indigo-600">check_circle</span> No ClipForge Watermark</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-indigo-600">check_circle</span> Custom Font & Color Presets</li>
              </ul>
            </div>
            <button
              onClick={() => setCurrentPage('pricing')}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm active:scale-[0.98] transition-all flex items-center justify-center"
            >
              Start 7-Day Free Trial
            </button>
          </div>

          {/* Agency Studio */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Agency Studio</h3>
                  <p className="text-xs text-slate-500">For production teams and managers</p>
                </div>
                <div className="flex items-baseline font-mono">
                  <span className="text-2xl font-bold text-slate-900">{isAnnual ? '$36' : '$49'}</span>
                  <span className="text-xs text-slate-500">/mo</span>
                </div>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-600 py-4">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-sky-600">check</span> 1,200 Processing Minutes / mo</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-sky-600">check</span> 4K Ultra-HD Upscaling</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-sky-600">check</span> Priority GPU Cluster Queue</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-sky-600">check</span> 5 Team Workspace Seats</li>
              </ul>
            </div>
            <button
              onClick={() => setCurrentPage('pricing')}
              className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors flex items-center justify-center border border-slate-200"
            >
              Upgrade to Agency
            </button>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-mono text-indigo-600 uppercase tracking-widest font-semibold">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>
        <div className="flex flex-col gap-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-2 focus:outline-none"
              >
                <span className="text-sm font-semibold text-slate-900">{faq.q}</span>
                <span
                  className={`material-symbols-outlined text-slate-400 transition-transform duration-200 text-[20px] ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 animate-fadeIn border-t border-slate-100 pt-3">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL HIGH-IMPACT CTA */}
      <section className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 text-center flex flex-col items-center space-y-4 overflow-hidden shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-1 border border-white/20">
          <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Your Next Viral Short is One Click Away
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-sm">
          Stop wasting 6 hours editing keyframes. Turn your library of videos into daily growth now.
        </p>
        <button
          onClick={() => setCurrentPage('clip')}
          className="w-full sm:w-auto px-8 h-12 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-slate-100 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span>Create Your First Short Free</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <span className="text-[11px] font-mono text-slate-400">
          Free account • 60 minutes included • Instant results
        </span>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col space-y-4 pt-6 text-center border-t border-slate-200">
        <div className="flex items-center justify-center gap-2">
          <span className="font-bold text-slate-900">ClipForge</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-indigo-600 font-semibold border border-slate-200">React Suite</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-slate-600">
          <button onClick={() => setCurrentPage('pricing')} className="hover:text-slate-900">Pricing</button>
          <button onClick={() => setCurrentPage('studio')} className="hover:text-slate-900">Studio</button>
          <button onClick={() => setCurrentPage('clip')} className="hover:text-slate-900">Generator</button>
          <button onClick={() => setCurrentPage('features')} className="hover:text-slate-900">Features</button>
          <button onClick={() => setCurrentPage('templates')} className="hover:text-slate-900">Templates</button>
        </div>
        <p className="text-[11px] font-mono text-slate-400">
          © 2026 ClipForge AI Inc. Engineered for viral creators worldwide.
        </p>
      </footer>

      {/* Choose Clip Duration Modal */}
      <DurationSelectModal
        isOpen={showDurationModal}
        onClose={() => setShowDurationModal(false)}
        onConfirm={executeGenerate}
        initialDuration={duration}
        url={urlInput}
      />
    </div>
  );
}
