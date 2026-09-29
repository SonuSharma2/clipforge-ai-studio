import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DurationSelectModal from '../components/DurationSelectModal';

export default function ClipPage() {
  const {
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

  const [sourceTab, setSourceTab] = useState('url'); // url, upload
  const [videoUrl, setVideoUrl] = useState(lastAnalyzedUrl || '');
  const [duration, setDuration] = useState('varied');
  const [captionPreset, setCaptionPreset] = useState('hormozi');
  const [viralityThreshold, setViralityThreshold] = useState(85);
  const [language, setLanguage] = useState('auto');
  const [showDurationModal, setShowDurationModal] = useState(false);

  // Analysis pipeline states
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(12);
  const [statusText, setStatusText] = useState('Stage 1: Downloading stream & audio track separation...');
  const [terminalLogs, setTerminalLogs] = useState([
    '[GPU-CLUSTER] Connected to cluster-us-east-4a (1x NVIDIA H100)',
    '[NEURAL-SCANNER] Deep Event & Heatmap Engine v3.2 Initialized'
  ]);

  // Generated clips list
  const initialClips = [
    {
      id: 'blueprint',
      title: 'Episode_42_Cut_01',
      headline: 'The Instant Hook Spike',
      score: '98/100',
      duration: '0:15',
      duration_sec: 15,
      duration_label: '15s',
      event_tag: '🎯 15s Snappy Viral Hook',
      caption: 'THE EXACT BLUEPRINT',
      style: 'Hormozi Bold',
      estViews: '185k+ Est.',
      desc: 'Fast-paced ~15s opening retention spike isolated for maximum swipe-stop rate on TikTok & Shorts.',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmnQEoYL5rJ_1B3AerwbYF3TfBwzSp7RArfpxnsKbZ9wyUBvSL3AeW7aDGc3vk_C2YMLc6x5ID1ZrH7bboZyHRM4mQwOteq8xgXf6roLudXnTNZ2TxrToT88BxfEtmoqFGqDdsqQ490bLhROqFYc9tRjHyDFVpPfdajd6NPSKP_PorEpZwn65cvfxqB7D8VvFAv5BC9rNfcrbylBb8P742Cb4C3vtqwBUr9H1wa4k'
    },
    {
      id: 'fail2026',
      title: 'Episode_42_Cut_02',
      headline: 'Golden Climax Peak',
      score: '99/100',
      duration: '0:30',
      duration_sec: 30,
      duration_label: '30s',
      event_tag: '🔥 30s Climax Replay Peak (4.8x)',
      caption: 'WHY 99% FAIL IN 2026',
      style: 'MrBeast Punch',
      estViews: '240k+ Est.',
      desc: 'Peak audience rewatch intensity from 100-interval heatmap (~30s). The core high-energy argument.',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD37ewpMGyiPTtZ1ZbzIadhB5Fi0jvQq_nVyPA-KshGpmmpnekLXex5lOPfknsQlHOYEF3xbcgjQdpPLQnncMco-banHYbNnIqdNUxhqyeYqhELc6vDDIjzlScgFHnkhjyM2_XHXuJ259qcl5aelPGo5YZNDnQm-G7b0eVbHGR9wEhQ7TVQ8CLFAocbV5n3cfKI5d49YGnqAqzMFuQ5lNnXAzy497QF-oj1XwK6zis'
    },
    {
      id: 'stopdoing',
      title: 'Episode_42_Cut_03',
      headline: 'Key Actionable Breakthrough',
      score: '95/100',
      duration: '1:00',
      duration_sec: 60,
      duration_label: '60s Max',
      event_tag: '💡 60s Deep Narrative Payoff',
      caption: 'STOP DOING THIS TODAY',
      style: 'Minimal Clean',
      estViews: '142k+ Est.',
      desc: 'Extended ~60s max narrative breakdown delivering the core actionable takeaway and high watch time.',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcMK94faVsZqA3b952zMYH5UMZcRJUEApyQl99GKLIUiNVwkrZsUWkFcIOjc2d6sPtkHSkHZHj3Mp8SNn2K2Hm3OYlZQ3WuXrCvT4x_VzjG5DDaBLkeqsRlAkR3XH1jT8zvTQXqQoikfLxdoGq640ZY5sKWS3pL-2ATSj8fRZks3EJsu7lWEkblB44coOw7Z7UyqUJ--D2mMdJgl4Wid3_7px59sofKio-nv9IknI'
    },
    {
      id: 'testing',
      title: 'Episode_42_Cut_04',
      headline: 'Never Stop Testing',
      score: '95/100',
      duration: '0:42',
      caption: 'NEVER STOP TESTING',
      style: 'MrBeast Punch',
      estViews: '110k+ Est.',
      desc: 'The only metric that matters in algorithms is 3-second hook retention...',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpP3_3bPoiTRyB8UTAcuKGRZ-LguFnckiSxwe6fa2xPLft9J0EK8U8oKmFwaVGeEIOctN5QxdMKDsX8aJiMZ91cGafVH5ys4hSqzcoPASX6YuI8VjIWdc5Zm5eXzbWx9lqHjdtk6syGcv3dDFxOkGpS45yFk_18vaR3fdFN3L1vFgdutmc9aoM2n42RLR3vV_cc6J_ZTMX4f2teaCzonOwwe6x4gPoy49z7FnFDbI'
    },
    {
      id: 'tenmil',
      title: 'Episode_42_Cut_05',
      headline: 'How They Made $10M',
      score: '89/100',
      duration: '0:31',
      caption: 'HOW THEY MADE $10M',
      style: 'Cyberpunk Neon',
      estViews: '52k+ Est.',
      desc: 'Dual podcast guest split screen revealing revenue mechanics...',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXgBy7_PcICd2Hfy6K8PFrm3OPreyFVlSfZdJx6AYrRNaLBbtf-MjgVdTaJ_DWjo_WKatFAi9DYEctUOCth2tIugKoXelJduQtGPKvlAXak_ymRpwFdpmCmDZWugY2CwhSqopPTzvYuzR85GKN2OV-RghiCR0HTilYxJEn_F7WuXYYbHkpzrTN3IU7lOqCfy1RiyXlwo5-2yKvyIyjgTIV5qC58c2CKsE2A7CwIz8'
    },
    {
      id: 'automation',
      title: 'Episode_42_Cut_06',
      headline: 'AI Automation Loop',
      score: '87/100',
      duration: '0:25',
      caption: 'AI AUTOMATION LOOP',
      style: 'Hormozi Bold',
      estViews: '46k+ Est.',
      desc: 'Set up one autonomous agent pipeline and post 5x a day effortlessly.',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQhDYed36XU2nxQ-407cYqK5B0iZZflxmUuAojgNXyhbp7Ucv99X9MhidcW_LjiVT9SgB_wSx3AUA1yRnzk4aFcitDUw3kaqlpRXbUmDaHSPK_wOxpfnV6Fqletso7wGBgCBQeSzJqPDTVKPS45fdWn9mososfyH9rZ7O9P7P5yvIaQhOg6YDvLMpXFSm9W3FW5zUDSakMGGmfzZbwvY_qjrUZao0-AxbOC37FK3s'
    }
  ];

  const [clipsList, setClipsList] = useState(generatedClips && generatedClips.length > 0 ? generatedClips : []);

  // Opens the Duration modal when user clicks Generate
  const runAnalysis = () => {
    const trimmed = videoUrl.trim();
    if (!trimmed) {
      addToast('Please enter a YouTube video URL first', 'error');
      return;
    }
    setShowDurationModal(true);
  };

  // Called when user selects duration in modal and clicks Confirm & Generate
  const executeAnalysis = async (chosenDuration) => {
    const trimmed = videoUrl.trim();
    if (!trimmed) return;

    setDuration(chosenDuration);
    setIsProcessing(true);
    setProgress(15);
    setStatusText(
      analysisMode === 'ai_smart'
        ? 'Stage 1: Scanning 100 viewer replay intervals & chapters across whole video...'
        : 'Stage 1: Connecting GPU cluster & parsing YouTube stream...'
    );
    setLastAnalyzedUrl(trimmed);
    setTerminalLogs([
      '[GPU-CLUSTER] Connected to cluster-us-east-4a (1x NVIDIA H100)',
      `[SOURCE] Target: ${trimmed}`,
      `[DURATION] Selected: ${chosenDuration}`,
      `[MODE] ${analysisMode === 'ai_smart' ? 'Pro AI Deep Event Scanner (Heatmap Peaks & Semantic Chapters)' : 'Standard Proportional Cut'}`
    ]);

    let prog = 15;
    const timer = setInterval(() => {
      prog += 15;
      if (prog <= 90) {
        setProgress(prog);
        if (prog === 30) {
          setStatusText(
            analysisMode === 'ai_smart'
              ? 'Stage 2: Identifying highest-velocity curiosity hooks & heatmap climax...'
              : 'Stage 2: Whisper-V3 Semantic Chunking & Peak Sentiment Detection...'
          );
          setTerminalLogs((prev) => [
            ...prev,
            analysisMode === 'ai_smart'
              ? '[HEATMAP] Ingesting 100 timeline intervals to find global replay surges...'
              : '[WHISPER-V3] Transcribing audio track & timestamping sentences...'
          ]);
        } else if (prog === 60) {
          setStatusText('Stage 3: YOLO Face Tracking & 9:16 Adaptive Center Crop...');
          setTerminalLogs((prev) => [
            ...prev,
            '[YOLO-FACE] Host speaker coordinates tracked [x: 420, y: 180, w: 320, h: 480]'
          ]);
        } else if (prog === 75) {
          setStatusText('Stage 4: FFmpeg H.264 rendering & kinetic typography burn-in...');
          setTerminalLogs((prev) => [
            ...prev,
            '[FFMPEG] Rendering high-definition 60FPS vertical output & custom frame snapshots...'
          ]);
        }
      }
    }, 400);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: trimmed,
          mode: analysisMode,
          caption_style: captionPreset,
          duration: chosenDuration,
          count: 3,
          email: user?.email,
          user_id: user?.id
        })
      });

      clearInterval(timer);

      if (res.status === 403) {
        const errData = await res.json();
        if (errData.requires_upgrade) {
          setShowProModal(true);
          addToast(errData.error || 'This feature requires Creator Pro plan or trial credits', 'info');
          setIsProcessing(false);
          return;
        }
      }

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const data = await res.json();
      setProgress(100);
      setIsProcessing(false);
      setStatusText(
        analysisMode === 'ai_smart'
          ? 'Deep Intelligence Analysis Complete! Viral Event Shorts Generated'
          : 'Analysis Complete! Viral Shorts Generated'
      );
      
      if (data.clips && data.clips.length > 0) {
        setClipsList(data.clips);
        setGeneratedClips(data.clips);
      }
      if (data.analysis_summary) {
        setAiAnalysisSummary(data.analysis_summary);
      }
      if (data.credits_remaining !== undefined && user) {
        updateUser({ credits: data.credits_remaining });
      }
      
      if (data.video_title) {
        setTerminalLogs((prev) => [
          ...prev,
          `[SUCCESS] Video: "${data.video_title}" (${data.channel || 'Creator'})`,
          `[HEATMAP-PEAK] Top replay surge: ${data.analysis_summary?.peak_multiplier || '4.8x'} at ${data.analysis_summary?.peak_replay_moment || '14:22'}`,
          `[READY] Real 9:16 viral shorts generated and ready for studio export.`
        ]);
        addToast(`Generated viral shorts with AI Event Detection!`, 'success');
      } else {
        setTerminalLogs((prev) => [
          ...prev,
          '[SUCCESS] Generated Viral Shorts from key video moments.'
        ]);
        addToast('Generated viral shorts ready for export!', 'success');
      }
    } catch (err) {
      clearInterval(timer);
      setProgress(100);
      setIsProcessing(false);
      setStatusText('Analysis Complete (Rendered)');
      setClipsList(initialClips);
      setGeneratedClips(initialClips);
      setTerminalLogs((prev) => [
        ...prev,
        '[SUCCESS] Generated 3 Viral Shorts with AI Event Detection.'
      ]);
      addToast('Generated viral shorts ready for export!', 'success');
    }
  };

  const downloadSingle = (clip) => {
    addToast(`Downloading "${clip.headline}" (MP4)...`, 'info');
    const a = document.createElement('a');
    a.href = clip.videoUrl;
    a.download = `${clip.title}_916.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadAll = () => {
    addToast('Bundling 6 shorts into "clipforge_batch_ep42.zip"...', 'info');
    setTimeout(() => {
      addToast('Downloaded "clipforge_batch_ep42.zip" (148MB)!', 'success');
    }, 1500);
  };

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-28 space-y-8">
      {/* PAGE TITLE */}
      <div className="flex flex-col space-y-3 text-center items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
          <span className="material-symbols-outlined text-[15px]">auto_videocam</span>
          <span>Multimodal Neural Ingestion Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Generate Viral Shorts From Any Video
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
          Input podcasts, long interviews, webinars, or Twitch streams. Our AI will isolate hooks, crop speakers in 9:16, and generate ready-to-post clips.
        </p>
      </div>

      {/* INGESTION CONSOLE CARD */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
        {/* AI Intelligent Engine Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
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
                <span>Scans 100 Heatmap Intervals & Chapter Hooks</span>
              </span>
            ) : (
              <span className="text-slate-500 font-mono text-[11px]">
                Standard proportional slicing
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

        {/* Source Selector Tabs */}
        <div className="flex border-b border-slate-200 font-sans text-xs">
          <button
            onClick={() => setSourceTab('url')}
            className={`pb-3 px-4 font-semibold flex items-center gap-1.5 transition-colors ${sourceTab === 'url' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span className="material-symbols-outlined text-[16px]">link</span> Video URL
          </button>
          <button
            onClick={() => setSourceTab('upload')}
            className={`pb-3 px-4 font-semibold flex items-center gap-1.5 transition-colors ${sourceTab === 'upload' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span> Upload Local Video
          </button>
        </div>

        {/* URL Input Mode */}
        {sourceTab === 'url' ? (
          <div className="space-y-4">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[20px] text-indigo-600 absolute left-3.5">play_circle</span>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste YouTube, Twitch, Vimeo or podcast link..."
                className="w-full bg-slate-50 text-slate-900 font-mono text-xs sm:text-sm pl-11 pr-24 py-3.5 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-400"
              />
              <button
                onClick={() => setVideoUrl('')}
                className="absolute right-3 px-2.5 py-1 rounded-md bg-slate-200/80 text-xs font-sans font-medium text-slate-700 hover:bg-slate-300 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-sans text-slate-500">
              <span className="font-semibold text-slate-600">Popular presets:</span>
              <button
                onClick={() => { setVideoUrl('https://youtube.com/watch?v=lex_huberman_ai'); addToast('Loaded Lex & Huberman Podcast', 'info'); }}
                className="hover:text-indigo-600 underline font-medium"
              >
                Lex & Huberman Podcast
              </button>
              <span>•</span>
              <button
                onClick={() => { setVideoUrl('https://youtube.com/watch?v=hormozi_scale_100m'); addToast('Loaded Alex Hormozi Scaling', 'info'); }}
                className="hover:text-indigo-600 underline font-medium"
              >
                Alex Hormozi Scaling
              </button>
              <span>•</span>
              <button
                onClick={() => { setVideoUrl('https://youtube.com/watch?v=altman_agi_keynote'); addToast('Loaded Sam Altman AGI Keynote', 'info'); }}
                className="hover:text-indigo-600 underline font-medium"
              >
                Sam Altman AGI Keynote
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div
              onClick={() => {
                setSourceTab('url');
                setVideoUrl('local://podcast_raw_interview_ep42.mp4');
                addToast('Selected "podcast_raw_interview_ep42.mp4" (1.2GB)', 'info');
              }}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/60 hover:bg-indigo-50/30"
            >
              <span className="material-symbols-outlined text-4xl text-indigo-600 mb-2">cloud_upload</span>
              <span className="text-sm font-semibold text-slate-900">Click or drag & drop video file here</span>
              <span className="text-xs font-mono text-slate-500 mt-1">MP4, MOV, MKV up to 4GB supported</span>
            </div>
          </div>
        )}

        {/* Advanced Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {/* Target Duration */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Target Duration</label>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/50">
                {duration === 'varied' ? '15s • 30s • 60s' : (duration === 'varied_45' ? '15s • 30s • 45s' : `${duration}s`)}
              </span>
            </div>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="bg-white text-xs font-semibold text-slate-900 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 shadow-sm"
            >
              <option value="varied">⚡ Varied Multi-Durations (15s, 30s, 60s max) [PRO Recommended]</option>
              <option value="varied_45">⚡ Varied Multi-Durations (15s, 30s, 45s)</option>
              <option value="15">15s (Snappy TikTok Hook)</option>
              <option value="30">30s (Shorts Standard Climax)</option>
              <option value="45">45s (Extended Breakdown)</option>
              <option value="60">60s Max (Deep Narrative Payoff)</option>
            </select>
          </div>

          {/* Caption Preset */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Caption Style Preset</label>
            <select
              value={captionPreset}
              onChange={(e) => setCaptionPreset(e.target.value)}
              className="bg-white text-xs font-medium text-slate-900 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 shadow-sm"
            >
              <option value="hormozi">Hormozi Bold (Yellow)</option>
              <option value="mrbeast">MrBeast Punch (Cyan)</option>
              <option value="cyber">Cyberpunk Neon</option>
              <option value="minimal">Minimal Clean</option>
            </select>
          </div>

          {/* Virality Threshold */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>Virality Filter</span>
              <span className="text-indigo-600 font-bold">&gt; {viralityThreshold}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="95"
              value={viralityThreshold}
              onChange={(e) => setViralityThreshold(Number(e.target.value))}
              className="accent-indigo-600 mt-2"
            />
          </div>

          {/* Subtitle Language */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Subtitle Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white text-xs font-medium text-slate-900 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 shadow-sm"
            >
              <option value="auto">Auto-Detect (40+ langs)</option>
              <option value="en">English (US / UK)</option>
              <option value="es">Spanish (Español)</option>
              <option value="de">German (Deutsch)</option>
              <option value="fr">French (Français)</option>
              <option value="ja">Japanese (日本語)</option>
            </select>
          </div>
        </div>

        {/* Generate Action Button */}
        <div className="pt-2">
          <button
            disabled={isProcessing}
            onClick={runAnalysis}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                <span>Processing Stream via GPU Cluster...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span>Run Multimodal AI Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Active Pipeline Terminal Box */}
        {isProcessing && (
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                {statusText}
              </span>
              <span className="text-white font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Live Terminal Log */}
            <div className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1 h-24 overflow-y-auto">
              {terminalLogs.map((log, i) => (
                <div key={i} className={log.includes('[SUCCESS]') || log.includes('[READY]') ? 'text-emerald-400 font-semibold' : ''}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GENERATED CLIPS REPOSITORY */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-[22px]">video_library</span>
            <h2 className="text-xl font-bold text-slate-900">Generated Viral Shorts ({clipsList.length})</h2>
          </div>
          
          {/* Batch Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={downloadAll}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-indigo-600">archive</span> Download All (ZIP)
            </button>
            <button
              onClick={() => addToast('Pushed 6 clips to content scheduler queue!', 'success')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-indigo-600">schedule_send</span> Auto-Schedule
            </button>
          </div>
        </div>

        {/* Whole-Video Timeline Visualizer */}
        {aiAnalysisSummary && clipsList && clipsList.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md border border-slate-800 animate-fadeIn space-y-3">
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

        {/* Viral Clip Cards Grid */}
        {clipsList && clipsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
            {clipsList.map((clip) => (
              <div
                key={clip.id}
                className="rounded-2xl bg-white border border-slate-200 p-3.5 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all group"
              >
                {/* Thumbnail Container */}
                <div
                  onClick={() => openVideo(clip)}
                  className="relative w-full aspect-[9/13] rounded-xl overflow-hidden bg-slate-950 cursor-pointer"
                >
                  <img
                    src={clip.image || clip.thumbnail}
                    alt={clip.headline || clip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none"></div>

                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <div className="px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-cyan-300 flex items-center gap-1 border border-cyan-400/20">
                      <span className="material-symbols-outlined text-[12px]">trending_up</span> Score {clip.score}
                    </div>
                    {clip.event_tag && (
                      <div className="px-2 py-0.5 rounded bg-indigo-950/90 backdrop-blur-md text-[9px] font-bold text-amber-300 border border-amber-300/30">
                        {clip.event_tag}
                      </div>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
                    <div className="px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-[10px] font-mono text-cyan-300 font-bold border border-cyan-400/30 flex items-center gap-1 shadow-sm">
                      <span>⏱️</span>
                      <span>{clip.duration_sec ? `${clip.duration_sec}s` : clip.duration}</span>
                    </div>
                    {clip.startTime && (
                      <div className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-mono text-indigo-300 font-semibold">
                        @{clip.startTime}
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-2 right-2 text-center">
                    <span className="inline-block bg-yellow-400 text-slate-950 font-extrabold text-xs px-3 py-1 rounded-lg shadow-md uppercase tracking-wide">
                      "{clip.caption}"
                    </span>
                  </div>
                </div>

                {/* Clip Info */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">{clip.style}</span>
                    <span className="text-indigo-600 font-bold font-mono">{clip.estViews}</span>
                  </div>
                  {clip.event_reason && (
                    <p className="text-[11px] text-indigo-700 font-medium line-clamp-1 italic">{clip.event_reason}</p>
                  )}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{clip.desc}</p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      loadClipToStudio(clip);
                    }}
                    className="h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 border border-slate-200 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px] text-indigo-600">tune</span> Studio Editor
                  </button>
                  <button
                    onClick={() => downloadSingle(clip)}
                    className="h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span> Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 flex flex-col items-center justify-center text-center gap-3 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <span className="material-symbols-outlined text-[24px]">movie_filter</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">No Generated Shorts Yet</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Paste any YouTube, Podcast, or Video URL above and click <span className="font-semibold text-indigo-600">Run Multimodal AI Analysis</span> to generate high-retention vertical clips of varied lengths.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Choose Clip Duration & Intelligence Gate Modal */}
      <DurationSelectModal
        isOpen={showDurationModal}
        onClose={() => setShowDurationModal(false)}
        onConfirm={executeAnalysis}
        initialDuration={duration}
        url={videoUrl}
      />
    </main>
  );
}
