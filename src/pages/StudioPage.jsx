import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function StudioPage() {
  const { activeStudioClip, setActiveStudioClip, setCurrentPage, addToast, generatedClips } = useApp();

  const [projectTitle, setProjectTitle] = useState(activeStudioClip?.title || 'Episode_42_Cut_01');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [leftTab, setLeftTab] = useState('clips'); // clips, styles, audio
  const [rightTab, setRightTab] = useState('captions'); // captions, tracking, hooks
  
  // Video playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(14);
  const [totalSeconds, setTotalSeconds] = useState(34);
  const [isLooping, setIsLooping] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showFaceBox, setShowFaceBox] = useState(true);
  const [showWatermark, setShowWatermark] = useState(false);

  // Caption customizer state
  const [captionText, setCaptionText] = useState(activeStudioClip?.caption || 'THE EXACT BLUEPRINT');
  const [captionFont, setCaptionFont] = useState('Geist');
  const [captionBgColor, setCaptionBgColor] = useState('#FFE600');
  const [captionTextColor, setCaptionTextColor] = useState('#000000');
  const [captionFontSize, setCaptionFontSize] = useState(16);
  const [captionAnimation, setCaptionAnimation] = useState('pop');
  const [captionPosition, setCaptionPosition] = useState('bottom-14');
  const [captionStyleClass, setCaptionStyleClass] = useState('caption-hormozi');

  // Tracking state
  const [reframeMode, setReframeMode] = useState('single'); // single, split, pan
  const [smoothness, setSmoothness] = useState(85);

  // Export modal state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportRes, setExportRes] = useState('1080p');
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStepText, setRenderStepText] = useState('Encoding 60fps H.264 stream...');

  const videoRef = useRef(null);
  const playIntervalRef = useRef(null);

  // Sync when activeStudioClip changes from context
  useEffect(() => {
    if (activeStudioClip) {
      if (activeStudioClip.title) setProjectTitle(activeStudioClip.title);
      if (activeStudioClip.caption) setCaptionText(activeStudioClip.caption);
    }
  }, [activeStudioClip]);

  // Video element event listeners
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Playback notice:', e);
        setIsPlaying(true);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentSeconds(Math.floor(videoRef.current.currentTime));
      if (videoRef.current.duration) {
        setTotalSeconds(Math.floor(videoRef.current.duration));
      }
    }
  };

  const seekRelative = (delta) => {
    if (videoRef.current) {
      const nextTime = Math.max(0, Math.min(totalSeconds, videoRef.current.currentTime + delta));
      videoRef.current.currentTime = nextTime;
      setCurrentSeconds(Math.floor(nextTime));
    }
  };

  const seekTo = (sec) => {
    if (videoRef.current) {
      videoRef.current.currentTime = sec;
      setCurrentSeconds(sec);
      addToast(`Jumped playhead to 00:${sec < 10 ? '0' + sec : sec}`, 'info');
    }
  };

  const handleTimelineClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = Math.round(pct * totalSeconds);
    seekTo(targetSec);
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
    addToast(`Playback speed: ${nextSpeed}x`, 'info');
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Presets
  const applyPreset = (style) => {
    if (style === 'hormozi') {
      setCaptionStyleClass('caption-hormozi');
      setCaptionBgColor('#FFE600');
      setCaptionTextColor('#000000');
      setCaptionFont('Geist');
    } else if (style === 'mrbeast') {
      setCaptionStyleClass('caption-mrbeast');
      setCaptionBgColor('#00E5FF');
      setCaptionTextColor('#000000');
      setCaptionFont('Geist');
    } else if (style === 'cyber') {
      setCaptionStyleClass('caption-cyber');
      setCaptionBgColor('rgba(17,19,25,0.9)');
      setCaptionTextColor('#4cd7f6');
      setCaptionFont('JetBrains Mono');
    } else if (style === 'minimal') {
      setCaptionStyleClass('caption-minimal');
      setCaptionBgColor('rgba(255,255,255,0.15)');
      setCaptionTextColor('#ffffff');
      setCaptionFont('Geist');
    }
    addToast(`Applied preset: ${style.toUpperCase()}`, 'success');
  };

  // Export & real download pipeline
  const handleStartRender = () => {
    setIsRendering(true);
    setRenderProgress(15);
    setRenderStepText('Analyzing neural facial keyframes...');

    let prog = 15;
    const timer = setInterval(() => {
      prog += 20;
      if (prog <= 95) {
        setRenderProgress(prog);
        if (prog === 35) setRenderStepText('Reframing 9:16 vertical crop...');
        if (prog === 55) setRenderStepText('Burning kinetic word subtitles...');
        if (prog === 75) setRenderStepText('Packaging 60fps MP4 container...');
      } else {
        clearInterval(timer);
        setRenderProgress(100);
        setRenderStepText('Render Complete! Starting download...');
        addToast('Render complete! Real MP4 downloading...', 'success');

        // Trigger real MP4 download
        const downloadUrl = activeStudioClip?.videoUrl || '/generated_shorts/viral_blueprint_master.mp4';
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${projectTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_916.mp4`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => {
          setIsRendering(false);
          setIsExportOpen(false);
          setRenderProgress(0);
        }, 1200);
      }
    }, 280);
  };

  // Format time mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <div className="bg-white text-slate-900 font-sans h-screen flex flex-col overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* TOP STUDIO TOOLBAR */}
      <header className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
            title="Back to Home"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-500">arrow_back</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[16px]">movie_edit</span>
            </div>
          </button>

          <div className="h-5 w-[1px] bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="bg-transparent font-sans text-xs sm:text-sm font-semibold text-slate-900 focus:bg-slate-100 px-2 py-1 rounded-lg border border-transparent focus:border-slate-300 transition-colors max-w-[140px] sm:max-w-none"
            />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> 1080x1920 60FPS
            </span>
          </div>
        </div>

        {/* Center Aspect Ratio Switcher */}
        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 font-sans text-xs">
          <button
            onClick={() => { setAspectRatio('9:16'); addToast('Aspect ratio: 9:16 Shorts', 'info'); }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${aspectRatio === '9:16' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            9:16 Shorts
          </button>
          <button
            onClick={() => { setAspectRatio('16:9'); addToast('Aspect ratio: 16:9 Wide', 'info'); }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${aspectRatio === '16:9' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            16:9 Wide
          </button>
          <button
            onClick={() => { setAspectRatio('1:1'); addToast('Aspect ratio: 1:1 Square', 'info'); }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${aspectRatio === '1:1' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            1:1 Square
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center text-xs font-sans text-slate-500 gap-1 mr-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">cloud_done</span>
            <span>Auto-saved</span>
          </div>

          <button
            onClick={() => addToast('Undo action', 'info')}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Undo"
          >
            <span className="material-symbols-outlined text-[18px]">undo</span>
          </button>
          <button
            onClick={() => addToast('Redo action', 'info')}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Redo"
          >
            <span className="material-symbols-outlined text-[18px]">redo</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE: 3-COLUMN FLEX */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: MEDIA & PRESET DOCK */}
        <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col shrink-0">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200 font-sans text-xs">
            <button
              onClick={() => setLeftTab('clips')}
              className={`flex-1 py-2.5 text-center font-medium transition-colors ${leftTab === 'clips' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Clips
            </button>
            <button
              onClick={() => setLeftTab('styles')}
              className={`flex-1 py-2.5 text-center font-medium transition-colors ${leftTab === 'styles' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Presets
            </button>
            <button
              onClick={() => setLeftTab('audio')}
              className={`flex-1 py-2.5 text-center font-medium transition-colors ${leftTab === 'audio' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Sound FX
            </button>
          </div>

          {/* Left Content */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {leftTab === 'clips' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-sans mb-1">
                  <span>AI Generated Clips ({generatedClips?.length || 3})</span>
                  <span className="text-indigo-600 font-semibold text-[10px]">Real 9:16 MP4</span>
                </div>

                {(generatedClips && generatedClips.length > 0 ? generatedClips : [
                  {
                    id: 'blueprint',
                    title: 'Episode_42_Cut_01',
                    headline: 'The Exact Blueprint',
                    caption: 'THE EXACT BLUEPRINT',
                    score: '98/100',
                    duration: '0:34',
                    videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
                    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmnQEoYL5rJ_1B3AerwbYF3TfBwzSp7RArfpxnsKbZ9wyUBvSL3AeW7aDGc3vk_C2YMLc6x5ID1ZrH7bboZyHRM4mQwOteq8xgXf6roLudXnTNZ2TxrToT88BxfEtmoqFGqDdsqQ490bLhROqFYc9tRjHyDFVpPfdajd6NPSKP_PorEpZwn65cvfxqB7D8VvFAv5BC9rNfcrbylBb8P742Cb4C3vtqwBUr9H1wa4k'
                  },
                  {
                    id: 'fail2026',
                    title: 'Episode_42_Cut_02',
                    headline: 'Why 99% Fail in 2026',
                    caption: 'WHY 99% FAIL IN 2026',
                    score: '94/100',
                    duration: '0:48',
                    videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
                    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD37ewpMGyiPTtZ1ZbzIadhB5Fi0jvQq_nVyPA-KshGpmmpnekLXex5lOPfknsQlHOYEF3xbcgjQdpPLQnncMco-banHYbNnIqdNUxhqyeYqhELc6vDDIjzlScgFHnkhjyM2_XHXuJ259qcl5aelPGo5YZNDnQm-G7b0eVbHGR9wEhQ7TVQ8CLFAocbV5n3cfKI5d49YGnqAqzMFuQ5lNnXAzy497QF-oj1XwK6zis'
                  },
                  {
                    id: 'stopdoing',
                    title: 'Episode_42_Cut_03',
                    headline: 'Stop Doing This Today',
                    caption: 'STOP DOING THIS TODAY',
                    score: '91/100',
                    duration: '0:29',
                    videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
                    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcMK94faVsZqA3b952zMYH5UMZcRJUEApyQl99GKLIUiNVwkrZsUWkFcIOjc2d6sPtkHSkHZHj3Mp8SNn2K2Hm3OYlZQ3WuXrCvT4x_VzjG5DDaBLkeqsRlAkR3XH1jT8zvTQXqQoikfLxdoGq640ZY5sKWS3pL-2ATSj8fRZks3EJsu7lWEkblB44coOw7Z7UyqUJ--D2mMdJgl4Wid3_7px59sofKio-nv9IknI'
                  }
                ]).map((clip, idx) => (
                  <div
                    key={clip.id || idx}
                    onClick={() => {
                      setActiveStudioClip(clip);
                      setProjectTitle(clip.headline || clip.title);
                      setCaptionText(clip.caption);
                      addToast(`Loaded "${clip.headline || clip.title}" into Studio`, 'info');
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer flex items-center gap-2.5 transition-all ${
                      activeStudioClip?.title === (clip.headline || clip.title) || activeStudioClip?.title === clip.title
                        ? 'bg-indigo-50 border-2 border-indigo-600 shadow-sm'
                        : 'bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={clip.thumbnail || clip.image}
                      className="w-12 h-16 rounded-lg object-cover"
                      alt={clip.headline || clip.title}
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-bold text-slate-900 truncate">{clip.headline || clip.title}</span>
                      <span className="text-[10px] font-mono text-indigo-600 font-semibold">Score: {clip.score} • {clip.duration}</span>
                      <span className="text-[10px] text-slate-500 truncate">"{clip.caption}"</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {leftTab === 'styles' && (
              <div className="space-y-2">
                <span className="text-xs text-slate-500 font-medium">1-Click Caption Styles</span>
                <button
                  onClick={() => applyPreset('hormozi')}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-indigo-500 hover:bg-white transition-all shadow-sm"
                >
                  <span className="caption-hormozi text-[11px] block w-fit mb-1">HORMOZI PUNCH</span>
                  <span className="text-[10px] text-slate-500">Yellow box, all-caps, heavy drop shadow</span>
                </button>
                <button
                  onClick={() => applyPreset('mrbeast')}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-indigo-500 hover:bg-white transition-all shadow-sm"
                >
                  <span className="caption-mrbeast text-[11px] block w-fit mb-1">MRBEAST GLOW</span>
                  <span className="text-[10px] text-slate-500">Cyan pill highlight with black stroke outline</span>
                </button>
                <button
                  onClick={() => applyPreset('cyber')}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-indigo-500 hover:bg-white transition-all shadow-sm"
                >
                  <span className="caption-cyber text-[11px] block w-fit mb-1">CYBERPUNK NEON</span>
                  <span className="text-[10px] text-slate-500">JetBrains mono, cyan stroke, terminal glow</span>
                </button>
                <button
                  onClick={() => applyPreset('minimal')}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-indigo-500 hover:bg-white transition-all shadow-sm"
                >
                  <span className="caption-minimal text-[11px] block w-fit mb-1">MINIMAL CLEAN</span>
                  <span className="text-[10px] text-slate-500">Semi-translucent frosted glass pill</span>
                </button>
              </div>
            )}

            {leftTab === 'audio' && (
              <div className="space-y-2">
                <span className="text-xs text-slate-500 font-medium">Viral Sound FX Stings</span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-indigo-600">volume_up</span>
                    <span className="text-xs font-medium text-slate-800">Cinematic Whoosh</span>
                  </div>
                  <button onClick={() => addToast('Inserted Cinematic Whoosh at playhead!', 'success')} className="text-xs text-indigo-600 font-semibold hover:underline">+ Add</button>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-indigo-600">volume_up</span>
                    <span className="text-xs font-medium text-slate-800">Bass Drop Impact</span>
                  </div>
                  <button onClick={() => addToast('Inserted Bass Drop Impact at 00:08 Hook!', 'success')} className="text-xs text-indigo-600 font-semibold hover:underline">+ Add</button>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-indigo-600">volume_up</span>
                    <span className="text-xs font-medium text-slate-800">Cash Register Ka-ching</span>
                  </div>
                  <button onClick={() => addToast('Inserted Cash Register at playhead!', 'success')} className="text-xs text-indigo-600 font-semibold hover:underline">+ Add</button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER VIEWPORT: VIDEO CANVAS & PLAYBACK */}
        <main className="flex-1 flex flex-col bg-slate-100/70 overflow-hidden relative">
          
          {/* Video Stage Area */}
          <div className="flex-1 flex items-center justify-center p-3 sm:p-6 overflow-hidden relative">
            
            {/* Aspect Ratio Box */}
            <div
              className={`relative bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center group transition-all duration-300 ${
                aspectRatio === '9:16'
                  ? 'aspect-[9/16] h-full max-h-[540px]'
                  : aspectRatio === '16:9'
                  ? 'aspect-[16/9] w-full max-w-[700px]'
                  : 'aspect-square h-full max-h-[500px]'
              }`}
            >
              {/* Real HTML5 Video Player */}
              <video
                ref={videoRef}
                src={activeStudioClip?.videoUrl || '/generated_shorts/viral_blueprint_master.mp4'}
                loop={isLooping}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

              {/* Face Tracking Bounding Box */}
              {showFaceBox && (
                <div className="absolute top-[20%] left-[22%] w-[56%] h-[34%] border-2 border-dashed border-cyan-400 rounded-xl pointer-events-none flex flex-col justify-between p-1.5 animate-pulse transition-opacity duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono bg-cyan-400 text-slate-900 px-1 rounded font-bold">FACE TRACK 99.4%</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  </div>
                  <span className="text-[8px] font-mono text-cyan-300 self-end">ACTIVE SPEAKER</span>
                </div>
              )}

              {/* Watermark */}
              {showWatermark && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white/80 border border-white/10 pointer-events-none flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-cyan-300">auto_awesome</span> ClipForge AI
                </div>
              )}

              {/* Viral Hook Badge on Canvas */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur-md flex items-center gap-1.5 text-xs text-cyan-300 font-mono border border-cyan-400/30 shadow-lg pointer-events-none">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>Score: {activeStudioClip?.score || '98/100'}</span>
              </div>

              {/* Real-time Dynamic Kinetic Caption */}
              <div className={`absolute ${captionPosition} left-3 right-3 text-center pointer-events-none transition-all duration-200`}>
                <span
                  className={`${captionStyleClass} inline-block`}
                  style={{
                    fontFamily: captionFont,
                    fontSize: `${captionFontSize}px`,
                    backgroundColor: captionBgColor,
                    color: captionTextColor
                  }}
                >
                  "{captionText}"
                </span>
              </div>

              {/* Large Play/Pause Trigger */}
              <button
                onClick={togglePlay}
                className="absolute w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95 shadow-xl"
              >
                <span className="material-symbols-outlined text-[32px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>

            {/* Floating Quick Toggles */}
            <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-sm text-xs font-sans">
              <button
                onClick={() => setShowFaceBox(!showFaceBox)}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${showFaceBox ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <span className="material-symbols-outlined text-[15px]">face</span> Face Box
              </button>
              <span className="text-slate-200">|</span>
              <button
                onClick={() => setShowWatermark(!showWatermark)}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${showWatermark ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Watermark
              </button>
            </div>
          </div>

          {/* PLAYBACK CONTROL DOCK */}
          <div className="h-12 bg-white border-t border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-sm">
            {/* Timecode */}
            <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
              <span className="text-slate-900 font-bold">{formatTime(currentSeconds)}</span>
              <span>/</span>
              <span>{formatTime(totalSeconds)}</span>
            </div>

            {/* Play/Pause/Seek */}
            <div className="flex items-center gap-3">
              <button onClick={() => seekRelative(-5)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100" title="Rewind 5s">
                <span className="material-symbols-outlined text-[18px]">replay_5</span>
              </button>
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[22px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <button onClick={() => seekRelative(5)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100" title="Forward 5s">
                <span className="material-symbols-outlined text-[18px]">forward_5</span>
              </button>
              <button
                onClick={() => { setIsLooping(!isLooping); addToast(`Looping ${!isLooping ? 'enabled' : 'disabled'}`, 'info'); }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isLooping ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-800'}`}
                title="Toggle Loop"
              >
                <span className="material-symbols-outlined text-[18px]">repeat</span>
              </button>
            </div>

            {/* Speed & Volume */}
            <div className="flex items-center gap-3 text-xs font-sans text-slate-600">
              <button onClick={cycleSpeed} className="px-2 py-0.5 rounded-lg hover:bg-slate-100 text-indigo-600 font-bold font-mono">
                {playbackSpeed}x
              </button>
              <button onClick={toggleMute} className="hover:text-slate-900">
                <span className="material-symbols-outlined text-[18px]">
                  {isMuted ? 'volume_off' : 'volume_up'}
                </span>
              </button>
            </div>
          </div>

          {/* BOTTOM TIMELINE SUITE */}
          <div className="h-44 bg-slate-50 border-t border-slate-200 flex flex-col shrink-0">
            {/* Tool Strip */}
            <div className="h-9 px-4 border-b border-slate-200 bg-white flex items-center justify-between text-xs font-sans text-slate-500">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addToast(`Split clip at ${formatTime(currentSeconds)}`, 'info')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 border border-slate-200 font-medium"
                >
                  <span className="material-symbols-outlined text-[14px]">content_cut</span> Split (S)
                </button>
                <button
                  onClick={() => addToast('AI Hook auto-snapped to nearest silence gap', 'success')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 border border-slate-200 font-medium"
                >
                  <span className="material-symbols-outlined text-[14px]">auto_fix_high</span> Auto-Trim Silence
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-indigo-600 font-semibold">Live Playhead Sync</span>
              </div>
            </div>

            {/* Ruler & Multi-Track Area */}
            <div
              className="flex-1 overflow-x-auto overflow-y-hidden relative select-none p-2 space-y-1.5 cursor-pointer"
              onClick={handleTimelineClick}
            >
              {/* Playhead Needle */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-indigo-600 z-30 shadow-[0_0_8px_rgba(79,70,229,0.4)] pointer-events-none transition-all duration-75"
                style={{ left: `${totalSeconds > 0 ? (currentSeconds / totalSeconds) * 100 : 0}%` }}
              >
                <div className="w-3 h-3 -ml-[5px] bg-indigo-600 rotate-45 -mt-1 shadow-md"></div>
              </div>

              {/* Track 1: Subtitle Kinetic Blocks */}
              <div className="h-7 w-full rounded-lg bg-white flex items-center px-2 relative text-[10px] font-sans border border-slate-200">
                <span className="absolute left-2 text-slate-400 text-[9px] uppercase font-bold pointer-events-none">Subtitles</span>
                <div className="ml-16 h-5 rounded-md bg-indigo-600 text-white flex items-center px-2 font-bold truncate">
                  "{captionText}"
                </div>
                <div className="ml-2 h-5 rounded-md bg-slate-100 text-slate-600 flex items-center px-2 truncate border border-slate-200">
                  [Host: "...just two steps to scale..."]
                </div>
              </div>

              {/* Track 2: B-Roll & Visual Inserts */}
              <div className="h-7 w-full rounded-lg bg-white flex items-center px-2 relative text-[10px] font-sans border border-slate-200">
                <span className="absolute left-2 text-slate-400 text-[9px] uppercase font-bold pointer-events-none">B-Roll Cut</span>
                <div className="ml-24 h-5 rounded-md bg-amber-50 text-amber-800 flex items-center px-2 font-medium border border-amber-200">
                  ⚡ Studio Keylight Cutaway (00:08)
                </div>
              </div>

              {/* Track 3: Video Stream & Face Track */}
              <div className="h-7 w-full rounded-lg bg-white flex items-center px-2 relative text-[10px] font-sans border border-slate-200 overflow-hidden">
                <span className="absolute left-2 text-slate-400 text-[9px] uppercase font-bold pointer-events-none z-10">Video 9:16</span>
                <div className="ml-16 w-full h-full bg-slate-50 flex items-center pl-2 text-slate-600 text-[10px]">
                  Active Speaker Framing: Host (Primary) • 1080x1920 60fps
                </div>
              </div>

              {/* Track 4: Audio Waveform with Viral Hook Markers */}
              <div className="h-8 w-full rounded-lg bg-white flex items-center px-2 relative border border-slate-200">
                <span className="absolute left-2 text-slate-400 text-[9px] uppercase font-bold pointer-events-none z-10">Audio</span>
                <div className="ml-16 flex-1 h-6 flex items-center gap-1 opacity-75">
                  <div className="w-1 h-2 bg-slate-300 rounded"></div>
                  <div className="w-1 h-4 bg-slate-300 rounded"></div>
                  <div className="w-1 h-3 bg-slate-300 rounded"></div>
                  <div className="w-1 h-6 bg-indigo-600 rounded"></div>
                  <div className="w-1 h-7 bg-indigo-600 rounded"></div>
                  <div className="w-1 h-5 bg-indigo-600 rounded"></div>
                  <div className="w-1 h-3 bg-slate-300 rounded"></div>
                  <div className="w-1 h-4 bg-slate-300 rounded"></div>
                  <div className="w-1 h-2 bg-slate-300 rounded"></div>
                  <div className="w-1 h-5 bg-indigo-500 rounded"></div>
                  <div className="w-1 h-7 bg-indigo-500 rounded"></div>
                  <div className="w-1 h-6 bg-indigo-500 rounded"></div>
                  <div className="w-1 h-4 bg-slate-300 rounded"></div>
                  <div className="w-1 h-2 bg-slate-300 rounded"></div>
                  <div className="w-1 h-5 bg-slate-300 rounded"></div>
                  <div className="w-1 h-6 bg-slate-300 rounded"></div>
                  <div className="w-1 h-3 bg-slate-300 rounded"></div>
                </div>
                {/* Viral Hook Marker badge */}
                <div className="absolute left-[24%] top-1 px-1.5 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-mono font-bold flex items-center gap-0.5 shadow-sm">
                  <span className="w-1 h-1 rounded-full bg-white"></span> Viral Hook (00:08)
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: AI INSPECTOR */}
        <aside className="w-80 border-l border-slate-200 bg-white hidden xl:flex flex-col shrink-0 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 font-sans text-xs">
            <button
              onClick={() => setRightTab('captions')}
              className={`flex-1 py-3 text-center font-semibold transition-colors ${rightTab === 'captions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Captions
            </button>
            <button
              onClick={() => setRightTab('tracking')}
              className={`flex-1 py-3 text-center font-semibold transition-colors ${rightTab === 'tracking' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Tracking
            </button>
            <button
              onClick={() => setRightTab('hooks')}
              className={`flex-1 py-3 text-center font-semibold transition-colors ${rightTab === 'hooks' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              AI Hooks
            </button>
          </div>

          {/* Tab 1: Captions */}
          {rightTab === 'captions' && (
            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Active Subtitle Text</label>
                <textarea
                  rows="2"
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 uppercase transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Typography</label>
                <select
                  value={captionFont}
                  onChange={(e) => setCaptionFont(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-sans"
                >
                  <option value="Geist">Geist (Modern Sans)</option>
                  <option value="JetBrains Mono">JetBrains Mono (Cyber)</option>
                  <option value="Impact">Impact (Hormozi Classic)</option>
                  <option value="Arial Black">Arial Black (Bold Punch)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Highlight Color Accent</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setCaptionBgColor('#FFE600'); setCaptionTextColor('#000000'); addToast('Selected Hormozi Yellow', 'info'); }}
                    className="w-7 h-7 rounded-full bg-[#FFE600] border-2 border-slate-300 shadow-sm hover:scale-110 transition-transform"
                    title="Hormozi Yellow"
                  />
                  <button
                    onClick={() => { setCaptionBgColor('#00E5FF'); setCaptionTextColor('#000000'); addToast('Selected MrBeast Cyan', 'info'); }}
                    className="w-7 h-7 rounded-full bg-[#00E5FF] hover:scale-110 transition-transform"
                    title="MrBeast Cyan"
                  />
                  <button
                    onClick={() => { setCaptionBgColor('#FF2A85'); setCaptionTextColor('#FFFFFF'); addToast('Selected Neon Magenta', 'info'); }}
                    className="w-7 h-7 rounded-full bg-[#FF2A85] hover:scale-110 transition-transform"
                    title="Neon Magenta"
                  />
                  <button
                    onClick={() => { setCaptionBgColor('#4f46e5'); setCaptionTextColor('#FFFFFF'); addToast('Selected Indigo Primary', 'info'); }}
                    className="w-7 h-7 rounded-full bg-indigo-600 hover:scale-110 transition-transform"
                    title="Indigo Primary"
                  />
                  <button
                    onClick={() => { setCaptionBgColor('#00FF66'); setCaptionTextColor('#000000'); addToast('Selected Electric Green', 'info'); }}
                    className="w-7 h-7 rounded-full bg-[#00FF66] hover:scale-110 transition-transform"
                    title="Electric Green"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-sans text-slate-600">
                  <span>Font Size</span>
                  <span className="font-bold">{captionFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="28"
                  value={captionFontSize}
                  onChange={(e) => setCaptionFontSize(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-700">Vertical Position</label>
                <div className="flex gap-2 text-xs font-sans">
                  <button
                    onClick={() => setCaptionPosition('bottom-8')}
                    className={`flex-1 py-1.5 rounded-xl transition-colors font-medium ${captionPosition === 'bottom-8' ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                  >
                    Low
                  </button>
                  <button
                    onClick={() => setCaptionPosition('bottom-14')}
                    className={`flex-1 py-1.5 rounded-xl transition-colors font-medium ${captionPosition === 'bottom-14' ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                  >
                    Mid
                  </button>
                  <button
                    onClick={() => setCaptionPosition('top-16')}
                    className={`flex-1 py-1.5 rounded-xl transition-colors font-medium ${captionPosition === 'top-16' ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                  >
                    High
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Tracking */}
          {rightTab === 'tracking' && (
            <div className="p-4 space-y-4">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Neural Speaker Tracking</span>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900">Reframing Mode</label>
                <div className="space-y-2">
                  <label
                    onClick={() => { setReframeMode('single'); addToast('Single speaker auto-follow active', 'info'); }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${reframeMode === 'single' ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                  >
                    <input type="radio" checked={reframeMode === 'single'} readOnly className="accent-indigo-600" />
                    <span>Auto-Follow Active Speaker (Single 9:16)</span>
                  </label>
                  <label
                    onClick={() => { setReframeMode('split'); addToast('Split-screen dual host active', 'info'); }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${reframeMode === 'split' ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                  >
                    <input type="radio" checked={reframeMode === 'split'} readOnly className="accent-indigo-600" />
                    <span>Split-Screen Stack (Dual Hosts)</span>
                  </label>
                  <label
                    onClick={() => { setReframeMode('pan'); addToast('Cinematic pan & scan active', 'info'); }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${reframeMode === 'pan' ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                  >
                    <input type="radio" checked={reframeMode === 'pan'} readOnly className="accent-indigo-600" />
                    <span>Cinematic Pan & Scan (Smoothed)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-sans text-slate-600">
                  <span>Camera Smoothness</span>
                  <span className="font-bold text-indigo-600">{smoothness}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={smoothness}
                  onChange={(e) => setSmoothness(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <span className="text-slate-900 font-semibold flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-indigo-600 text-[16px]">visibility</span>
                  Speaker Isolation Active
                </span>
                The neural net automatically pans the 9:16 crop window when audio decibels shift between speakers.
              </div>
            </div>
          )}

          {/* Tab 3: Hooks */}
          {rightTab === 'hooks' && (
            <div className="p-4 space-y-3">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">AI Detected Hook Highlights</span>
              
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Hook Peak
                  </span>
                  <span className="text-xs font-mono text-indigo-600 font-bold">98% Viral Prob</span>
                </div>
                <span className="text-[11px] text-slate-600">"The exact blueprint why most creators burn out..."</span>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => seekTo(8)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
                  >
                    Jump to 00:08
                  </button>
                  <button
                    onClick={() => addToast('Trimmed clip to Hook duration (0:34)', 'success')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                  >
                    Trim
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Key Punchline
                  </span>
                  <span className="text-xs font-mono text-indigo-600 font-bold">93% Viral Prob</span>
                </div>
                <span className="text-[11px] text-slate-600">"Stop doing this today if you want to grow in 2026..."</span>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => seekTo(24)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
                  >
                    Jump to 00:24
                  </button>
                  <button
                    onClick={() => addToast('Trimmed clip to Punchline duration', 'success')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                  >
                    Trim
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* EXPORT RENDER MODAL */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600 text-[22px]">rocket_launch</span>
                <h3 className="font-bold text-base text-slate-900">Render & Export Short</h3>
              </div>
              <button onClick={() => !isRendering && setIsExportOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Export Resolution</label>
                <div className="grid grid-cols-3 gap-2 text-xs font-sans">
                  {['1080p', '4k', '720p'].map((res) => (
                    <button
                      key={res}
                      onClick={() => setExportRes(res)}
                      className={`p-2.5 rounded-xl text-center font-semibold transition-all border ${exportRes === res ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                    >
                      {res === '1080p' ? '1080p 60fps' : res === '4k' ? '4K Ultra-HD' : '720p Fast'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Direct Platform Format</label>
                <div className="grid grid-cols-3 gap-2 text-xs font-sans">
                  <label className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer text-slate-800 font-medium">
                    <input type="checkbox" defaultChecked className="accent-indigo-600" /> TikTok
                  </label>
                  <label className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer text-slate-800 font-medium">
                    <input type="checkbox" defaultChecked className="accent-indigo-600" /> Shorts
                  </label>
                  <label className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer text-slate-800 font-medium">
                    <input type="checkbox" defaultChecked className="accent-indigo-600" /> Reels
                  </label>
                </div>
              </div>

              {/* Progress Bar when rendering */}
              {isRendering && (
                <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                      {renderStepText}
                    </span>
                    <span className="text-white font-bold">{renderProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300" style={{ width: `${renderProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                disabled={isRendering}
                onClick={() => setIsExportOpen(false)}
                className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors border border-slate-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isRendering}
                onClick={handleStartRender}
                className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Download MP4</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
