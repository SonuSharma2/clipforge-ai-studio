import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { setCurrentPage, openVideo, loadClipToStudio, addToast, generatedClips, setGeneratedClips, setLastAnalyzedUrl } = useApp();

  // Generator simulation states
  const [urlInput, setUrlInput] = useState('https://youtube.com/watch?v=k9X8fG0vQw2');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Audio Hook Extraction & Sentiment Spikes...');
  const [btnText, setBtnText] = useState('Generate Shorts');

  // Before / After toggle state
  const [reframingMode, setReframingMode] = useState('9:16'); // '16:9' or '9:16'

  // Studio Preview state
  const [studioPlaying, setStudioPlaying] = useState(false);
  const [studioSeconds, setStudioSeconds] = useState(14);

  // Pricing toggle state
  const [isAnnual, setIsAnnual] = useState(false);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState(null);

  const initialClips = [
    {
      title: 'The Exact Blueprint',
      score: '98/100',
      duration: '0:34',
      style: 'Hormozi Bold',
      estViews: '120k+ Est.',
      caption: 'THE EXACT BLUEPRINT',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmnQEoYL5rJ_1B3AerwbYF3TfBwzSp7RArfpxnsKbZ9wyUBvSL3AeW7aDGc3vk_C2YMLc6x5ID1ZrH7bboZyHRM4mQwOteq8xgXf6roLudXnTNZ2TxrToT88BxfEtmoqFGqDdsqQ490bLhROqFYc9tRjHyDFVpPfdajd6NPSKP_PorEpZwn65cvfxqB7D8VvFAv5BC9rNfcrbylBb8P742Cb4C3vtqwBUr9H1wa4k',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4'
    },
    {
      title: 'Why 99% Fail in 2026',
      score: '94/100',
      duration: '0:48',
      style: 'Minimal Clean',
      estViews: '85k+ Est.',
      caption: 'WHY 99% FAIL IN 2026',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD37ewpMGyiPTtZ1ZbzIadhB5Fi0jvQq_nVyPA-KshGpmmpnekLXex5lOPfknsQlHOYEF3xbcgjQdpPLQnncMco-banHYbNnIqdNUxhqyeYqhELc6vDDIjzlScgFHnkhjyM2_XHXuJ259qcl5aelPGo5YZNDnQm-G7b0eVbHGR9wEhQ7TVQ8CLFAocbV5n3cfKI5d49YGnqAqzMFuQ5lNnXAzy497QF-oj1XwK6zis',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4'
    },
    {
      title: 'Stop Doing This Today',
      score: '91/100',
      duration: '0:29',
      style: 'Viral Pulse',
      estViews: '64k+ Est.',
      caption: 'STOP DOING THIS TODAY',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcMK94faVsZqA3b952zMYH5UMZcRJUEApyQl99GKLIUiNVwkrZsUWkFcIOjc2d6sPtkHSkHZHj3Mp8SNn2K2Hm3OYlZQ3WuXrCvT4x_VzjG5DDaBLkeqsRlAkR3XH1jT8zvTQXqQoikfLxdoGq640ZY5sKWS3pL-2ATSj8fRZks3EJsu7lWEkblB44coOw7Z7UyqUJ--D2mMdJgl4Wid3_7px59sofKio-nv9IknI',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4'
    }
  ];

  const [clips, setClips] = useState(generatedClips && generatedClips.length > 0 ? generatedClips.slice(0, 3) : initialClips);

  const handleGenerate = async () => {
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) {
      addToast('Please enter or paste a valid video URL', 'error');
      return;
    }

    setIsGenerating(true);
    setProgress(15);
    setBtnText('Processing Stream...');
    setStatusText('Ingesting YouTube stream & separating audio track...');
    setLastAnalyzedUrl(trimmedUrl);

    let currentProgress = 15;
    const interval = setInterval(() => {
      currentProgress += 12;
      if (currentProgress === 39) {
        setStatusText('Whisper-V3 semantic hook extraction & sentiment analysis...');
      } else if (currentProgress === 63) {
        setStatusText('Fast 9:16 vertical re-framing & H.264 rendering...');
      } else if (currentProgress === 87) {
        setStatusText('Burning kinetic subtitles & scoring retention probability...');
      }
      setProgress(Math.min(92, currentProgress));
    }, 400);

    try {
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl, duration: 15 })
      });

      clearInterval(interval);

      if (!resp.ok) {
        throw new Error(`Server status ${resp.status}`);
      }

      const data = await resp.json();
      setProgress(100);
      setIsGenerating(false);
      setBtnText('3 Shorts Ready!');
      setStatusText(data.video_title ? `Extracted: "${data.video_title.slice(0, 32)}..."` : 'Completed! 3 Viral Shorts Generated');
      
      if (data.clips && data.clips.length > 0) {
        setClips(data.clips.slice(0, 3));
        setGeneratedClips(data.clips);
      }
      addToast(`Generated 3 Viral Shorts from "${(data.video_title || 'video').slice(0, 25)}..."!`, 'success');
      setTimeout(() => setBtnText('Generate Shorts'), 4000);
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      setIsGenerating(false);
      setBtnText('Generate Shorts');
      setStatusText('Processing error occurred');
      addToast(`Failed to analyze stream: ${err.message || 'Check server connection'}`, 'error');
    }
  };

  const toggleStudioPlayback = () => {
    setStudioPlaying(!studioPlaying);
  };

  const downloadClipDirect = (title, videoUrl) => {
    addToast(`Downloading "${title}.mp4"...`, 'info');
    const a = document.createElement('a');
    a.href = videoUrl || '/generated_shorts/viral_blueprint_master.mp4';
    a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const faqs = [
    {
      q: 'How does ClipForge find viral hooks?',
      a: 'We train proprietary multimodal transformer models on over 500,000 viral shorts across TikTok, YouTube, and Instagram. The AI analyzes verbal cadence, sentiment escalation, visual motion speed, and speech retention hooks to isolate moments with high viral probability.'
    },
    {
      q: 'Which video links and formats are supported?',
      a: 'ClipForge supports public and unlisted YouTube links, Vimeo, Twitch VODs, Google Drive shares, plus direct uploads of MP4, MOV, and MKV files up to 4GB.'
    },
    {
      q: 'Can I customize caption animations and fonts?',
      a: 'Yes! Choose from pre-made viral templates like Kinetic Hormozi, Minimal Clean, or Neon Glow. You can customize font weight, text colors, background highlight pills, and emoji placements to stay true to your identity.'
    },
    {
      q: 'Does auto reframing cut off faces in conversations?',
      a: 'No. Our dual-speaker face tracking model detects whoever is speaking in real-time, executing smooth camera pans between hosts and guests, or automatically generating split-screen views when both react simultaneously.'
    }
  ];

  return (
    <div className="flex flex-col w-full max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-28 space-y-12">
      
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center space-y-4 pt-4">
        {/* Live AI Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#282a30] text-[#c0c1ff] text-xs font-mono shadow-[0_0_16px_rgba(192,193,255,0.15)] border border-[#33343b]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping"></span>
          <span>AI-Powered Short-Form Video Engine</span>
        </div>

        {/* Main Title with Gradient Accents */}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#e2e2ea] leading-tight">
          Turn Any Video Into{' '}
          <span className="bg-gradient-to-r from-[#c0c1ff] via-[#d0bcff] to-[#4cd7f6] bg-clip-text text-transparent">
            Scroll-Stopping Shorts
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#c7c4d7] max-w-lg leading-relaxed">
          Paste any YouTube link. Our multimodal neural model isolates hooks, reframes dynamic speakers, and prints viral captions in seconds.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row w-full max-w-md gap-3 pt-2">
          <button
            onClick={() => setCurrentPage('clip')}
            className="w-full sm:flex-1 h-12 rounded-lg bg-gradient-to-r from-[#8083ff] via-[#571bc1] to-[#8083ff] text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(128,131,255,0.35)] active:scale-[0.98] transition-all hover:brightness-110"
          >
            <span>Create Shorts Free</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <a
            href="#how-it-works"
            className="w-full sm:flex-1 h-12 rounded-lg bg-[#1d1f26] text-[#e2e2ea] font-semibold flex items-center justify-center gap-2 hover:bg-[#282a30] border border-[#33343b] active:scale-[0.98] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">play_circle</span>
            <span>See How It Works</span>
          </a>
        </div>

        {/* Trust Micro-Copy */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#908fa0] pt-2">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">bolt</span> Instant Analysis
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#c0c1ff]">auto_fix_high</span> Zero Editing Skills
          </span>
          <span>•</span>
          <span>🛡️ No CC Required</span>
        </div>
      </section>

      {/* INTERACTIVE HERO PRODUCT DEMO CARD */}
      <section className="flex flex-col rounded-2xl bg-[#191b22] border border-[#33343b] p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#c0c1ff]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#4cd7f6]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Window Mock Topbar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#33343b]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ffb4ab]/80"></span>
            <span className="w-3 h-3 rounded-full bg-[#d0bcff]/80"></span>
            <span className="w-3 h-3 rounded-full bg-[#4cd7f6]/80"></span>
            <span className="text-xs font-mono text-[#908fa0] ml-2">clipforge-studio-v2.6.ai</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#33343b] text-[#4cd7f6] border border-[#1d1f26] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span> GPU Cluster Ready
          </span>
        </div>

        {/* URL Input Console */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="relative flex-1 flex items-center">
            <span className="material-symbols-outlined text-[18px] text-[#908fa0] absolute left-3">link</span>
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-[#0c0e14] text-[#e2e2ea] font-mono text-xs pl-9 pr-8 py-3 rounded-lg border border-[#1d1f26] focus:border-[#8083ff] focus:outline-none transition-colors"
              type="text"
              placeholder="Paste YouTube video link..."
            />
            {urlInput && (
              <button
                onClick={() => setUrlInput('')}
                className="absolute right-3 text-[#908fa0] hover:text-[#e2e2ea]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="h-11 sm:h-auto px-6 rounded-lg bg-gradient-to-r from-[#571bc1] via-[#8083ff] to-[#4cd7f6] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(87,27,193,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
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
          <div className="flex flex-col gap-2 mt-4 p-3 rounded-lg bg-[#0c0e14] border border-[#1d1f26] animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#4cd7f6] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping"></span>
                {statusText}
              </span>
              <span className="text-[#c7c4d7] font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-[#1d1f26] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8083ff] via-[#4cd7f6] to-[#571bc1] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Generated Results Grid */}
        <div className="flex flex-col gap-3 mt-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#e2e2ea] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">movie</span>
              AI Detected Clips (3)
            </span>
            <span className="text-[11px] font-mono text-[#c0c1ff] bg-[#c0c1ff]/10 px-2.5 py-0.5 rounded-full border border-[#c0c1ff]/20">
              Auto-Framed 9:16
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {clips.map((clip, idx) => (
              <div
                key={clip.id || idx}
                className="rounded-xl bg-[#1d1f26] border border-[#33343b] p-2.5 flex flex-col gap-2 shadow-lg group hover:border-[#c0c1ff]/50 transition-all"
              >
                <div
                  className="relative w-full aspect-[9/13] rounded-lg overflow-hidden bg-[#0c0e14] cursor-pointer"
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

                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0c0e14]/90 backdrop-blur-md flex items-center gap-1 text-[10px] font-mono text-[#4cd7f6]">
                    <span className="material-symbols-outlined text-[12px] text-[#4cd7f6]">trending_up</span>
                    <span>Score {clip.score}</span>
                  </div>
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-white">
                    {clip.duration}
                  </div>
                  <div className="absolute bottom-3 left-2 right-2 text-center">
                    <span className="inline-block bg-[#c0c1ff] text-[#1000a9] font-bold text-[11px] px-2 py-1 rounded uppercase shadow-md leading-tight">
                      "{clip.caption}"
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 px-1">
                  <div className="flex items-center justify-between text-xs font-mono text-[#c7c4d7]">
                    <span>{clip.style}</span>
                    <span className="text-[#4cd7f6] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">visibility</span> {clip.estViews}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => loadClipToStudio(clip)}
                      className="h-8 rounded bg-[#282a30] hover:bg-[#373940] text-[#e2e2ea] text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">tune</span> Studio
                    </button>
                    <button
                      onClick={() => downloadClipDirect(clip.title, clip.videoUrl)}
                      className="h-8 rounded bg-[#8083ff] text-white text-xs font-medium flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[14px]">download</span> Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF STATS */}
      <section className="flex flex-col gap-3 text-center">
        <p className="text-xs font-mono text-[#c7c4d7] uppercase tracking-wider">
          Built for creators who want to publish daily without burning out
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#191b22] border border-[#33343b] shadow-sm">
            <span className="text-2xl sm:text-3xl font-bold text-[#c0c1ff]">12K+</span>
            <span className="text-xs font-mono text-[#908fa0] mt-1">Top Creators</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#191b22] border border-[#33343b] shadow-sm">
            <span className="text-2xl sm:text-3xl font-bold text-[#4cd7f6]">480K+</span>
            <span className="text-xs font-mono text-[#908fa0] mt-1">Clips Rendered</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#191b22] border border-[#33343b] shadow-sm">
            <span className="text-2xl sm:text-3xl font-bold text-[#d0bcff]">1.8M+</span>
            <span className="text-xs font-mono text-[#908fa0] mt-1">Minutes Cut</span>
          </div>
        </div>
      </section>

      {/* 3 STEPS WORKFLOW */}
      <section id="how-it-works" className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-mono text-[#4cd7f6] uppercase tracking-widest">Effortless Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e2e2ea]">
            From Long YouTube Stream to Viral Short in 3 Steps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#1d1f26] border border-[#33343b] shadow-md">
            <div className="w-10 h-10 rounded-lg bg-[#33343b] flex items-center justify-center font-mono text-sm text-[#c0c1ff] font-bold">
              01
            </div>
            <div className="flex flex-col space-y-1">
              <h3 className="text-base font-semibold text-[#e2e2ea]">Paste Any Long Video URL</h3>
              <p className="text-xs sm:text-sm text-[#c7c4d7] leading-relaxed">
                Input YouTube links, podcasts, interviews, or raw MP4 files. ClipForge ingests high-definition transcripts and audio instantly.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#1d1f26] border border-[#33343b] shadow-md">
            <div className="w-10 h-10 rounded-lg bg-[#33343b] flex items-center justify-center font-mono text-sm text-[#4cd7f6] font-bold">
              02
            </div>
            <div className="flex flex-col space-y-1">
              <h3 className="text-base font-semibold text-[#e2e2ea]">Multimodal AI Pinpoints Gold</h3>
              <p className="text-xs sm:text-sm text-[#c7c4d7] leading-relaxed">
                Our neural model scans emotional peaks, voice pacing, audience drop-off markers, and punchlines to curate self-contained viral hooks.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#1d1f26] border border-[#33343b] shadow-md">
            <div className="w-10 h-10 rounded-lg bg-[#33343b] flex items-center justify-center font-mono text-sm text-[#d0bcff] font-bold">
              03
            </div>
            <div className="flex flex-col space-y-1">
              <h3 className="text-base font-semibold text-[#e2e2ea]">Publish Everywhere with 1-Click</h3>
              <p className="text-xs sm:text-sm text-[#c7c4d7] leading-relaxed">
                Receive ready-to-upload 9:16 shorts with synchronized dynamic subtitles, B-roll auto-inserts, and speaker reframing for TikTok, Shorts, & Reels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER INTERACTIVE COMPARISON */}
      <section className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-mono text-[#d0bcff] uppercase tracking-widest">Transformative AI</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e2e2ea]">Before vs. After AI Reframing</h2>
          <p className="text-xs sm:text-sm text-[#c7c4d7]">
            See how wide 16:9 desktop videos turn into focused 9:16 vertical storytelling.
          </p>
        </div>

        {/* Toggle Controls */}
        <div className="flex rounded-lg bg-[#0c0e14] p-1 border border-[#33343b] max-w-sm">
          <button
            onClick={() => setReframingMode('16:9')}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              reframingMode === '16:9'
                ? 'bg-[#8083ff] text-white shadow'
                : 'text-[#c7c4d7] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">crop_16_9</span>
            Original 16:9
          </button>
          <button
            onClick={() => setReframingMode('9:16')}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              reframingMode === '9:16'
                ? 'bg-[#8083ff] text-white shadow'
                : 'text-[#c7c4d7] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">crop_portrait</span>
            AI Framed 9:16
          </button>
        </div>

        {/* Comparative Stage */}
        <div className="relative w-full rounded-2xl bg-[#191b22] border border-[#33343b] p-4 flex flex-col items-center justify-center min-h-[360px] overflow-hidden shadow-xl">
          {reframingMode === '16:9' ? (
            <div className="w-full max-w-lg flex flex-col items-center animate-fadeIn">
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-black relative shadow-lg border border-[#33343b]">
                <img
                  className="w-full h-full object-cover"
                  alt="Wide 16:9 Shot"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXgBy7_PcICd2Hfy6K8PFrm3OPreyFVlSfZdJx6AYrRNaLBbtf-MjgVdTaJ_DWjo_WKatFAi9DYEctUOCth2tIugKoXelJduQtGPKvlAXak_ymRpwFdpmCmDZWugY2CwhSqopPTzvYuzR85GKN2OV-RghiCR0HTilYxJEn_F7WuXYYbHkpzrTN3IU7lOqCfy1RiyXlwo5-2yKvyIyjgTIV5qC58c2CKsE2A7CwIz8"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] font-mono text-white rounded">
                  Uncut 16:9 • Static Wide Frame
                </div>
              </div>
              <span className="text-xs font-mono text-[#908fa0] mt-3">
                Low mobile retention: Faces are distant, no dynamic subtitles
              </span>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center animate-fadeIn">
              <div className="w-[220px] sm:w-[240px] aspect-[9/15] rounded-xl overflow-hidden bg-[#0c0e14] relative shadow-2xl border border-[#4cd7f6]/40">
                <img
                  className="w-full h-full object-cover"
                  alt="Reframed 9:16 Shot"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpP3_3bPoiTRyB8UTAcuKGRZ-LguFnckiSxwe6fa2xPLft9J0EK8U8oKmFwaVGeEIOctN5QxdMKDsX8aJiMZ91cGafVH5ys4hSqzcoPASX6YuI8VjIWdc5Zm5eXzbWx9lqHjdtk6syGcv3dDFxOkGpS45yFk_18vaR3fdFN3L1vFgdutmc9aoM2n42RLR3vV_cc6J_ZTMX4f2teaCzonOwwe6x4gPoy49z7FnFDbI"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#009eb9]/90 text-white text-[10px] font-mono flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  Face Tracked
                </div>

                <div className="absolute top-[22%] left-[18%] w-[64%] h-[38%] border border-[#4cd7f6]/80 rounded-md pointer-events-none"></div>

                <div className="absolute bottom-5 left-2 right-2 text-center">
                  <span className="inline-block bg-[#c0c1ff] text-[#1000a9] font-bold text-xs px-2.5 py-1 rounded shadow-lg uppercase">
                    "NEVER STOP TESTING"
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-[#4cd7f6] mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                +320% higher TikTok & Shorts watch time
              </span>
            </div>
          )}
        </div>
      </section>

      {/* MOBILE AI EDITING SUITE SHOWCASE */}
      <section className="flex flex-col space-y-4">
        <div className="flex items-end justify-between">
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-mono text-[#c0c1ff] uppercase tracking-widest">Professional Control</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#e2e2ea]">Your Mobile AI Editing Suite</h2>
            <p className="text-xs sm:text-sm text-[#c7c4d7]">
              Tweak clips, customize caption palettes, and export directly from your phone or browser.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('studio')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#282a30] hover:bg-[#373940] text-xs font-mono text-[#4cd7f6] transition-colors border border-[#33343b]"
          >
            <span>Launch Full Studio</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </button>
        </div>

        <div className="flex flex-col rounded-2xl bg-[#191b22] border border-[#33343b] p-4 shadow-xl">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#33343b]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c0c1ff] text-[20px]">movie_edit</span>
              <span className="font-mono text-xs sm:text-sm text-[#e2e2ea] font-semibold">Episode_42_Cut_01</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-[#282a30] text-[#c7c4d7]">1080x1920</span>
              <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/20 text-[#4cd7f6] border border-[#4cd7f6]/30">60 FPS</span>
            </div>
          </div>

          {/* Video Centerpiece */}
          <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-black flex items-center justify-center mt-3">
            <img
              className="w-full h-full object-cover opacity-85"
              alt="Studio Preview"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQhDYed36XU2nxQ-407cYqK5B0iZZflxmUuAojgNXyhbp7Ucv99X9MhidcW_LjiVT9SgB_wSx3AUA1yRnzk4aFcitDUw3kaqlpRXbUmDaHSPK_wOxpfnV6Fqletso7wGBgCBQeSzJqPDTVKPS45fdWn9mososfyH9rZ7O9P7P5yvIaQhOg6YDvLMpXFSm9W3FW5zUDSakMGGmfzZbwvY_qjrUZao0-AxbOC37FK3s"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button
                onClick={toggleStudioPlayback}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform shadow-lg border border-white/30"
              >
                <span className="material-symbols-outlined text-[28px]">
                  {studioPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white">
              00:{studioSeconds < 10 ? '0' + studioSeconds : studioSeconds} / 00:38
            </div>
          </div>

          {/* Scrubber with Peak Highlights */}
          <div className="flex flex-col gap-1 mt-3 p-2 rounded-lg bg-[#1d1f26] border border-[#33343b]">
            <div className="flex justify-between text-[10px] font-mono text-[#908fa0] px-1">
              <span>00:00</span>
              <span className="text-[#4cd7f6] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                Viral Hook (00:08)
              </span>
              <span>00:38</span>
            </div>

            <div className="relative w-full h-10 rounded bg-[#0c0e14] overflow-hidden flex items-center px-1 border border-[#33343b]">
              <div className="w-full h-6 flex items-center gap-1 opacity-70">
                <div className="w-1 h-2 bg-[#908fa0] rounded"></div>
                <div className="w-1 h-4 bg-[#908fa0] rounded"></div>
                <div className="w-1 h-3 bg-[#908fa0] rounded"></div>
                <div className="w-1 h-5 bg-[#4cd7f6] rounded"></div>
                <div className="w-1 h-6 bg-[#4cd7f6] rounded"></div>
                <div className="w-1 h-5 bg-[#4cd7f6] rounded"></div>
                <div className="w-1 h-3 bg-[#908fa0] rounded"></div>
                <div className="w-1 h-4 bg-[#908fa0] rounded"></div>
                <div className="w-1 h-2 bg-[#908fa0] rounded"></div>
                <div className="w-1 h-4 bg-[#908fa0] rounded"></div>
                <div className="w-1 h-6 bg-[#c0c1ff] rounded"></div>
                <div className="w-1 h-5 bg-[#c0c1ff] rounded"></div>
                <div className="w-1 h-3 bg-[#908fa0] rounded"></div>
                <div className="w-1 h-2 bg-[#908fa0] rounded"></div>
              </div>

              {/* Playhead needle */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]"
                style={{ left: `${(studioSeconds / 38) * 100}%` }}
              >
                <div className="w-2.5 h-2.5 -ml-1 rounded-full bg-[#4cd7f6] -mt-0.5"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING TIERS PREVIEW */}
      <section className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1 text-center">
          <span className="text-xs font-mono text-[#c0c1ff] uppercase tracking-widest">Transparent Plans</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e2e2ea]">Start Free. Upgrade As You Go Viral.</h2>
          <p className="text-xs sm:text-sm text-[#c7c4d7]">Cancel or swap tiers anytime. Unlimited cloud renders.</p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 py-1">
          <span className={`text-xs font-mono ${!isAnnual ? 'text-[#e2e2ea] font-semibold' : 'text-[#908fa0]'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 rounded-full bg-[#33343b] p-0.5 transition-colors relative flex items-center"
          >
            <div
              className={`w-5 h-5 rounded-full bg-[#c0c1ff] transition-transform duration-200 ${
                isAnnual ? 'translate-x-6' : ''
              }`}
            ></div>
          </button>
          <span className={`text-xs font-mono flex items-center gap-1.5 ${isAnnual ? 'text-[#e2e2ea] font-semibold' : 'text-[#908fa0]'}`}>
            Annual <span className="px-1.5 py-0.5 rounded bg-[#4cd7f6]/20 text-[#4cd7f6] text-[10px] font-bold">SAVE 25%</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Starter */}
          <div className="p-5 rounded-2xl bg-[#1d1f26] border border-[#33343b] flex flex-col justify-between space-y-4 shadow-md">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-semibold text-[#e2e2ea]">Starter</h3>
                  <p className="text-xs text-[#c7c4d7]">For new creators exploring AI shorts</p>
                </div>
                <span className="text-2xl font-bold text-[#e2e2ea] font-mono">$0</span>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs text-[#c7c4d7] py-4">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">check</span> 60 Processing Minutes / mo</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">check</span> 720p HD Exports</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">check</span> Standard Kinetic Captions</li>
              </ul>
            </div>
            <button
              onClick={() => setCurrentPage('clip')}
              className="w-full h-11 rounded-lg bg-[#282a30] hover:bg-[#373940] text-[#e2e2ea] text-sm font-semibold transition-colors flex items-center justify-center"
            >
              Get Started
            </button>
          </div>

          {/* Creator Pro */}
          <div className="relative p-5 rounded-2xl bg-[#191b22] border-2 border-[#8083ff] flex flex-col justify-between space-y-4 shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#8083ff] to-[#571bc1] text-white font-mono text-[10px] font-bold tracking-wider uppercase shadow-md">
              Most Popular
            </div>
            <div>
              <div className="flex justify-between items-start pt-1">
                <div>
                  <h3 className="text-base font-semibold text-[#e2e2ea]">Creator Pro</h3>
                  <p className="text-xs text-[#c7c4d7]">For consistent multi-platform uploaders</p>
                </div>
                <div className="flex items-baseline font-mono">
                  <span className="text-2xl font-bold text-[#c0c1ff]">{isAnnual ? '$14' : '$19'}</span>
                  <span className="text-xs text-[#908fa0]">/mo</span>
                </div>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs text-[#e2e2ea] py-4">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">check_circle</span> 300 Processing Minutes / mo</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">check_circle</span> 1080p 60fps Crisp Export</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">check_circle</span> No ClipForge Watermark</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">check_circle</span> Custom Font & Color Presets</li>
              </ul>
            </div>
            <button
              onClick={() => setCurrentPage('pricing')}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-[#8083ff] to-[#571bc1] text-white text-sm font-semibold shadow-[0_0_16px_rgba(128,131,255,0.4)] active:scale-[0.98] transition-all flex items-center justify-center"
            >
              Start 7-Day Free Trial
            </button>
          </div>

          {/* Agency Studio */}
          <div className="p-5 rounded-2xl bg-[#1d1f26] border border-[#33343b] flex flex-col justify-between space-y-4 shadow-md">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-semibold text-[#e2e2ea]">Agency Studio</h3>
                  <p className="text-xs text-[#c7c4d7]">For production teams and managers</p>
                </div>
                <div className="flex items-baseline font-mono">
                  <span className="text-2xl font-bold text-[#e2e2ea]">{isAnnual ? '$36' : '$49'}</span>
                  <span className="text-xs text-[#908fa0]">/mo</span>
                </div>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs text-[#c7c4d7] py-4">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">check</span> 1,200 Processing Minutes / mo</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">check</span> 4K Ultra-HD Upscaling</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">check</span> Priority GPU Cluster Queue</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">check</span> 5 Team Workspace Seats</li>
              </ul>
            </div>
            <button
              onClick={() => setCurrentPage('pricing')}
              className="w-full h-11 rounded-lg bg-[#282a30] hover:bg-[#373940] text-[#e2e2ea] text-sm font-semibold transition-colors flex items-center justify-center"
            >
              Upgrade to Agency
            </button>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-mono text-[#d0bcff] uppercase tracking-widest">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e2e2ea]">Frequently Asked Questions</h2>
        </div>
        <div className="flex flex-col gap-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl bg-[#1d1f26] border border-[#33343b] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-2 focus:outline-none"
              >
                <span className="text-sm font-medium text-[#e2e2ea]">{faq.q}</span>
                <span
                  className={`material-symbols-outlined text-[#908fa0] transition-transform duration-200 text-[20px] ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 animate-fadeIn">
                  <p className="text-xs sm:text-sm text-[#c7c4d7] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL HIGH-IMPACT CTA */}
      <section className="relative rounded-2xl bg-gradient-to-b from-[#282a30] to-[#191b22] border border-[#33343b] p-6 sm:p-10 text-center flex flex-col items-center space-y-4 overflow-hidden shadow-2xl">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#c0c1ff]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="w-12 h-12 rounded-xl bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff] mb-1 border border-[#c0c1ff]/20">
          <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-[#e2e2ea] tracking-tight leading-tight">
          Your Next Viral Short is One Click Away
        </h2>
        <p className="text-xs sm:text-sm text-[#c7c4d7] max-w-sm">
          Stop wasting 6 hours editing keyframes. Turn your library of videos into daily growth now.
        </p>
        <button
          onClick={() => setCurrentPage('clip')}
          className="w-full sm:w-auto px-8 h-12 rounded-lg bg-gradient-to-r from-[#8083ff] via-[#571bc1] to-[#4cd7f6] text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(128,131,255,0.4)] active:scale-[0.98] transition-transform"
        >
          <span>Create Your First Short Free</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <span className="text-[11px] font-mono text-[#908fa0]">
          Free account • 60 minutes included • Instant results
        </span>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col space-y-4 pt-4 text-center border-t border-[#33343b]">
        <div className="flex items-center justify-center gap-2">
          <span className="font-bold text-[#e2e2ea]">ClipForge</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#282a30] text-[#4cd7f6]">React Suite</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-[#c7c4d7]">
          <button onClick={() => setCurrentPage('pricing')} className="hover:text-white">Pricing</button>
          <button onClick={() => setCurrentPage('studio')} className="hover:text-white">Studio</button>
          <button onClick={() => setCurrentPage('clip')} className="hover:text-white">Generator</button>
          <button onClick={() => setCurrentPage('features')} className="hover:text-white">Features</button>
          <button onClick={() => setCurrentPage('templates')} className="hover:text-white">Templates</button>
        </div>
        <p className="text-[11px] font-mono text-[#908fa0]">
          © 2026 ClipForge AI Inc. Engineered for viral creators worldwide.
        </p>
      </footer>
    </div>
  );
}
