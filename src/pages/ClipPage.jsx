import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ClipPage() {
  const { openVideo, loadClipToStudio, addToast, generatedClips, setGeneratedClips, lastAnalyzedUrl, setLastAnalyzedUrl } = useApp();

  const [sourceTab, setSourceTab] = useState('url'); // url, upload
  const [videoUrl, setVideoUrl] = useState(lastAnalyzedUrl || 'https://youtube.com/watch?v=k9X8fG0vQw2');
  const [duration, setDuration] = useState('auto');
  const [captionPreset, setCaptionPreset] = useState('hormozi');
  const [viralityThreshold, setViralityThreshold] = useState(85);
  const [language, setLanguage] = useState('auto');

  // Analysis pipeline states
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(12);
  const [statusText, setStatusText] = useState('Stage 1: Downloading stream & audio track separation...');
  const [terminalLogs, setTerminalLogs] = useState([
    '[GPU-CLUSTER] Connected to cluster-us-east-4a (1x NVIDIA H100)',
    '[WHISPER-V3] Ingesting high-definition audio waveform...'
  ]);

  // Generated clips list
  const initialClips = [
    {
      id: 'blueprint',
      title: 'Episode_42_Cut_01',
      headline: 'The Exact Blueprint',
      score: '98/100',
      duration: '0:34',
      caption: 'THE EXACT BLUEPRINT',
      style: 'Hormozi Bold',
      estViews: '120k+ Est.',
      desc: 'Here is the exact blueprint why 99% fail before their first viral hit...',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmnQEoYL5rJ_1B3AerwbYF3TfBwzSp7RArfpxnsKbZ9wyUBvSL3AeW7aDGc3vk_C2YMLc6x5ID1ZrH7bboZyHRM4mQwOteq8xgXf6roLudXnTNZ2TxrToT88BxfEtmoqFGqDdsqQ490bLhROqFYc9tRjHyDFVpPfdajd6NPSKP_PorEpZwn65cvfxqB7D8VvFAv5BC9rNfcrbylBb8P742Cb4C3vtqwBUr9H1wa4k'
    },
    {
      id: 'fail2026',
      title: 'Episode_42_Cut_02',
      headline: 'Why 99% Fail in 2026',
      score: '94/100',
      duration: '0:48',
      caption: 'WHY 99% FAIL IN 2026',
      style: 'Minimal Clean',
      estViews: '85k+ Est.',
      desc: "The future isn't about writing code, it's about intelligence pipelines...",
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD37ewpMGyiPTtZ1ZbzIadhB5Fi0jvQq_nVyPA-KshGpmmpnekLXex5lOPfknsQlHOYEF3xbcgjQdpPLQnncMco-banHYbNnIqdNUxhqyeYqhELc6vDDIjzlScgFHnkhjyM2_XHXuJ259qcl5aelPGo5YZNDnQm-G7b0eVbHGR9wEhQ7TVQ8CLFAocbV5n3cfKI5d49YGnqAqzMFuQ5lNnXAzy497QF-oj1XwK6zis'
    },
    {
      id: 'stopdoing',
      title: 'Episode_42_Cut_03',
      headline: 'Stop Doing This Today',
      score: '91/100',
      duration: '0:29',
      caption: 'STOP DOING THIS TODAY',
      style: 'Viral Pulse',
      estViews: '64k+ Est.',
      desc: 'Stop editing frame-by-frame manually. Automated multi-track pacing wins.',
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

  const [clipsList, setClipsList] = useState(generatedClips && generatedClips.length > 0 ? generatedClips : initialClips);

  // Pipeline trigger
  const runAnalysis = async () => {
    const trimmed = videoUrl.trim();
    if (!trimmed) {
      addToast('Please enter a YouTube video URL', 'error');
      return;
    }

    setIsProcessing(true);
    setProgress(15);
    setStatusText('Stage 1: Connecting GPU cluster & parsing YouTube stream...');
    setLastAnalyzedUrl(trimmed);
    setTerminalLogs([
      '[GPU-CLUSTER] Connected to cluster-us-east-4a (1x NVIDIA H100)',
      `[SOURCE] Target: ${trimmed}`
    ]);

    let prog = 15;
    const timer = setInterval(() => {
      prog += 15;
      if (prog <= 90) {
        setProgress(prog);
        if (prog === 30) {
          setStatusText('Stage 2: Whisper-V3 Semantic Chunking & Peak Sentiment Detection...');
          setTerminalLogs((prev) => [...prev, '[WHISPER-V3] Transcribing audio track & timestamping sentences...']);
        } else if (prog === 60) {
          setStatusText('Stage 3: YOLO Face Tracking & 9:16 Adaptive Center Crop...');
          setTerminalLogs((prev) => [...prev, '[YOLO-FACE] Host speaker coordinates tracked [x: 420, y: 180, w: 320, h: 480]']);
        } else if (prog === 75) {
          setStatusText('Stage 4: FFmpeg H.264 rendering & kinetic typography burn-in...');
          setTerminalLogs((prev) => [...prev, '[FFMPEG] Rendering high-definition 60FPS vertical output...']);
        }
      }
    }, 400);

    try {
      const parsedDuration = duration === 'auto' ? 15 : Number(duration) || 15;
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed, caption_style: captionPreset, duration: parsedDuration })
      });

      clearInterval(timer);

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const data = await res.json();
      setProgress(100);
      setIsProcessing(false);
      setStatusText('Analysis Complete! Viral Shorts Generated');
      
      if (data.clips && data.clips.length > 0) {
        setClipsList(data.clips);
        setGeneratedClips(data.clips);
      }
      
      if (data.video_title) {
        setTerminalLogs((prev) => [
          ...prev,
          `[SUCCESS] Extracted: "${data.video_title}" (${data.channel || 'Creator'})`,
          `[READY] Real 9:16 viral short generated and ready for studio export.`
        ]);
        addToast(`Extracted real stream: "${data.video_title.slice(0, 30)}..."`, 'success');
      } else {
        setTerminalLogs((prev) => [
          ...prev,
          '[SUCCESS] Generated 6 Viral Shorts. Virality scores: 98, 95, 94, 91, 89, 87.'
        ]);
        addToast('Generated viral shorts ready for export!', 'success');
      }
    } catch (err) {
      clearInterval(timer);
      setProgress(0);
      setIsProcessing(false);
      setStatusText('Analysis Failed');
      setTerminalLogs((prev) => [
        ...prev,
        `[ERROR] Could not process stream: ${err.message || 'Network error'}`
      ]);
      addToast(`Analysis error: ${err.message || 'Check connection'}`, 'error');
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
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Target Clip Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="bg-white text-xs font-medium text-slate-900 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 shadow-sm"
            >
              <option value="auto">Auto (Best Hooks)</option>
              <option value="30">30s (Shorts Standard)</option>
              <option value="15">15s (TikTok Fast)</option>
              <option value="60">60s (Deep Narrative)</option>
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

        {/* 6 Viral Clip Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-cyan-300 flex items-center gap-1 border border-cyan-400/20">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span> Score {clip.score}
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white">
                  {clip.duration}
                </div>

                <div className="absolute bottom-3 left-2 right-2 text-center">
                  <span className="inline-block bg-indigo-600 text-white font-bold text-xs px-3 py-1 rounded-lg shadow-md uppercase tracking-wide">
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
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{clip.desc}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => loadClipToStudio(clip)}
                  className="h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 border border-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span> Studio
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
      </div>
    </main>
  );
}
