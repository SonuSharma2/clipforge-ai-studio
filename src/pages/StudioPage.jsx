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
    <div className="bg-surface text-on-surface font-sans h-screen flex flex-col overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      
      {/* TOP STUDIO TOOLBAR */}
      <header className="h-14 border-b border-surface-container-highest bg-[#111319] px-4 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-1.5 text-outline hover:text-white transition-colors"
            title="Back to Home"
          >
            <span className="material-symbols-outlined text-[20px] text-tertiary">arrow_back</span>
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-secondary-container via-primary-container to-tertiary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[16px]">movie_edit</span>
            </div>
          </button>

          <div className="h-5 w-[1px] bg-surface-container-highest hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="bg-transparent font-mono text-xs sm:text-sm font-semibold text-white focus:bg-surface-container px-2 py-1 rounded border border-transparent focus:border-surface-container-highest transition-colors max-w-[140px] sm:max-w-none"
            />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container-high text-tertiary border border-tertiary/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> 1080x1920 60FPS
            </span>
          </div>
        </div>

        {/* Center Aspect Ratio Switcher */}
        <div className="hidden md:flex items-center bg-surface-container-lowest p-1 rounded-lg border border-surface-container-highest font-mono text-xs">
          <button
            onClick={() => { setAspectRatio('9:16'); addToast('Aspect ratio: 9:16 Shorts', 'info'); }}
            className={`px-2.5 py-1 rounded font-medium transition-all ${aspectRatio === '9:16' ? 'bg-primary-container text-white shadow-sm' : 'text-outline hover:text-white'}`}
          >
            9:16 Shorts
          </button>
          <button
            onClick={() => { setAspectRatio('16:9'); addToast('Aspect ratio: 16:9 Wide', 'info'); }}
            className={`px-2.5 py-1 rounded font-medium transition-all ${aspectRatio === '16:9' ? 'bg-primary-container text-white shadow-sm' : 'text-outline hover:text-white'}`}
          >
            16:9 Wide
          </button>
          <button
            onClick={() => { setAspectRatio('1:1'); addToast('Aspect ratio: 1:1 Square', 'info'); }}
            className={`px-2.5 py-1 rounded font-medium transition-all ${aspectRatio === '1:1' ? 'bg-primary-container text-white shadow-sm' : 'text-outline hover:text-white'}`}
          >
            1:1 Square
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center text-xs font-mono text-outline gap-1 mr-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary">cloud_done</span>
            <span>Auto-saved</span>
          </div>

          <button
            onClick={() => addToast('Undo action', 'info')}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-white hover:bg-surface-container transition-colors"
            title="Undo"
          >
            <span className="material-symbols-outlined text-[18px]">undo</span>
          </button>
          <button
            onClick={() => addToast('Redo action', 'info')}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-white hover:bg-surface-container transition-colors"
            title="Redo"
          >
            <span className="material-symbols-outlined text-[18px]">redo</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="h-9 px-4 rounded-lg bg-gradient-to-r from-primary-container via-secondary-container to-tertiary text-white font-semibold text-xs flex items-center gap-1.5 shadow-[0_0_16px_rgba(128,131,255,0.4)] hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE: 3-COLUMN FLEX */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: MEDIA & PRESET DOCK */}
        <aside className="w-64 border-r border-surface-container-highest bg-[#12141a] hidden lg:flex flex-col shrink-0">
          {/* Tab Headers */}
          <div className="flex border-b border-surface-container-highest font-mono text-xs">
            <button
              onClick={() => setLeftTab('clips')}
              className={`flex-1 py-2.5 text-center font-medium transition-colors ${leftTab === 'clips' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-white'}`}
            >
              Clips
            </button>
            <button
              onClick={() => setLeftTab('styles')}
              className={`flex-1 py-2.5 text-center font-medium transition-colors ${leftTab === 'styles' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-white'}`}
            >
              Presets
            </button>
            <button
              onClick={() => setLeftTab('audio')}
              className={`flex-1 py-2.5 text-center font-medium transition-colors ${leftTab === 'audio' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-white'}`}
            >
              Sound FX
            </button>
          </div>

          {/* Left Content */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {leftTab === 'clips' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-outline font-mono mb-1">
                  <span>AI Generated Clips ({generatedClips?.length || 3})</span>
                  <span className="text-tertiary text-[10px]">Real 9:16 MP4</span>
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
                    className={`p-2 rounded-xl cursor-pointer flex items-center gap-2.5 transition-all ${
                      activeStudioClip?.title === (clip.headline || clip.title) || activeStudioClip?.title === clip.title
                        ? 'bg-surface-container border border-primary/60'
                        : 'bg-surface-container-low border border-surface-container-highest hover:bg-surface-container-high'
                    }`}
                  >
                    <img
                      src={clip.thumbnail || clip.image}
                      className="w-12 h-16 rounded object-cover"
                      alt={clip.headline || clip.title}
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-semibold text-white truncate">{clip.headline || clip.title}</span>
                      <span className="text-[10px] font-mono text-tertiary">Score: {clip.score} • {clip.duration}</span>
                      <span className="text-[10px] text-outline truncate">"{clip.caption}"</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {leftTab === 'styles' && (
              <div className="space-y-2">
                <span className="text-xs text-outline font-mono">1-Click Caption Styles</span>
                <button
                  onClick={() => applyPreset('hormozi')}
                  className="w-full p-2.5 rounded-lg bg-surface-container border border-surface-container-highest text-left hover:border-primary transition-all"
                >
                  <span className="caption-hormozi text-[11px] block w-fit mb-1">HORMOZI PUNCH</span>
                  <span className="text-[10px] text-outline">Yellow box, all-caps, heavy drop shadow</span>
                </button>
                <button
                  onClick={() => applyPreset('mrbeast')}
                  className="w-full p-2.5 rounded-lg bg-surface-container border border-surface-container-highest text-left hover:border-tertiary transition-all"
                >
                  <span className="caption-mrbeast text-[11px] block w-fit mb-1">MRBEAST GLOW</span>
                  <span className="text-[10px] text-outline">Cyan pill highlight with black stroke outline</span>
                </button>
                <button
                  onClick={() => applyPreset('cyber')}
                  className="w-full p-2.5 rounded-lg bg-surface-container border border-surface-container-highest text-left hover:border-tertiary transition-all"
                >
                  <span className="caption-cyber text-[11px] block w-fit mb-1">CYBERPUNK NEON</span>
                  <span className="text-[10px] text-outline">JetBrains mono, cyan stroke, terminal glow</span>
                </button>
                <button
                  onClick={() => applyPreset('minimal')}
                  className="w-full p-2.5 rounded-lg bg-surface-container border border-surface-container-highest text-left hover:border-white transition-all"
                >
                  <span className="caption-minimal text-[11px] block w-fit mb-1">MINIMAL CLEAN</span>
                  <span className="text-[10px] text-outline">Semi-translucent frosted glass pill</span>
                </button>
              </div>
            )}

            {leftTab === 'audio' && (
              <div className="space-y-2">
                <span className="text-xs text-outline font-mono">Viral Sound FX Stings</span>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">volume_up</span>
                    <span className="text-xs text-white">Cinematic Whoosh</span>
                  </div>
                  <button onClick={() => addToast('Inserted Cinematic Whoosh at playhead!', 'success')} className="text-xs text-primary font-mono hover:underline">+ Add</button>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">volume_up</span>
                    <span className="text-xs text-white">Bass Drop Impact</span>
                  </div>
                  <button onClick={() => addToast('Inserted Bass Drop Impact at 00:08 Hook!', 'success')} className="text-xs text-primary font-mono hover:underline">+ Add</button>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">volume_up</span>
                    <span className="text-xs text-white">Cash Register Ka-ching</span>
                  </div>
                  <button onClick={() => addToast('Inserted Cash Register at playhead!', 'success')} className="text-xs text-primary font-mono hover:underline">+ Add</button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER VIEWPORT: VIDEO CANVAS & PLAYBACK */}
        <main className="flex-1 flex flex-col bg-[#0b0c10] overflow-hidden relative">
          
          {/* Video Stage Area */}
          <div className="flex-1 flex items-center justify-center p-3 sm:p-6 overflow-hidden relative">
            
            {/* Aspect Ratio Box */}
            <div
              className={`relative bg-black rounded-2xl border border-surface-container-highest shadow-2xl overflow-hidden flex items-center justify-center group transition-all duration-300 ${
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
                <div className="absolute top-[20%] left-[22%] w-[56%] h-[34%] border-2 border-dashed border-[#4cd7f6] rounded-xl pointer-events-none flex flex-col justify-between p-1.5 animate-pulse transition-opacity duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono bg-[#4cd7f6] text-[#003640] px-1 rounded font-bold">FACE TRACK 99.4%</span>
                    <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span>
                  </div>
                  <span className="text-[8px] font-mono text-[#4cd7f6]/90 self-end">ACTIVE SPEAKER</span>
                </div>
              )}

              {/* Watermark */}
              {showWatermark && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-outline border border-white/10 pointer-events-none flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-tertiary">auto_awesome</span> ClipForge AI
                </div>
              )}

              {/* Viral Hook Badge on Canvas */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0c0e14]/90 backdrop-blur-md flex items-center gap-1.5 text-xs text-[#4cd7f6] font-mono border border-[#4cd7f6]/30 shadow-lg pointer-events-none">
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
            <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2 bg-surface-container-low/80 backdrop-blur-md p-1.5 rounded-lg border border-surface-container-highest text-xs font-mono">
              <button
                onClick={() => setShowFaceBox(!showFaceBox)}
                className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${showFaceBox ? 'text-tertiary bg-surface-container' : 'text-outline hover:text-white'}`}
              >
                <span className="material-symbols-outlined text-[14px]">face</span> Face Box
              </button>
              <span className="text-surface-container-highest">|</span>
              <button
                onClick={() => setShowWatermark(!showWatermark)}
                className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${showWatermark ? 'text-primary bg-surface-container' : 'text-outline hover:text-white'}`}
              >
                Watermark
              </button>
            </div>
          </div>

          {/* PLAYBACK CONTROL DOCK */}
          <div className="h-12 bg-[#12141a] border-t border-surface-container-highest px-4 flex items-center justify-between shrink-0">
            {/* Timecode */}
            <div className="flex items-center gap-2 font-mono text-xs text-outline">
              <span className="text-white font-semibold">{formatTime(currentSeconds)}</span>
              <span>/</span>
              <span>{formatTime(totalSeconds)}</span>
            </div>

            {/* Play/Pause/Seek */}
            <div className="flex items-center gap-3">
              <button onClick={() => seekRelative(-5)} className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-white hover:bg-surface-container" title="Rewind 5s">
                <span className="material-symbols-outlined text-[18px]">replay_5</span>
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center shadow-[0_0_12px_rgba(128,131,255,0.4)] active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <button onClick={() => seekRelative(5)} className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-white hover:bg-surface-container" title="Forward 5s">
                <span className="material-symbols-outlined text-[18px]">forward_5</span>
              </button>
              <button
                onClick={() => { setIsLooping(!isLooping); addToast(`Looping ${!isLooping ? 'enabled' : 'disabled'}`, 'info'); }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isLooping ? 'text-tertiary' : 'text-outline hover:text-white'}`}
                title="Toggle Loop"
              >
                <span className="material-symbols-outlined text-[18px]">repeat</span>
              </button>
            </div>

            {/* Speed & Volume */}
            <div className="flex items-center gap-3 text-xs font-mono text-outline">
              <button onClick={cycleSpeed} className="px-2 py-0.5 rounded hover:bg-surface-container text-tertiary">
                {playbackSpeed}x
              </button>
              <button onClick={toggleMute} className="hover:text-white">
                <span className="material-symbols-outlined text-[18px]">
                  {isMuted ? 'volume_off' : 'volume_up'}
                </span>
              </button>
            </div>
          </div>

          {/* BOTTOM TIMELINE SUITE */}
          <div className="h-44 bg-[#181b22] border-t border-surface-container-highest flex flex-col shrink-0">
            {/* Tool Strip */}
            <div className="h-9 px-4 border-b border-surface-container-highest flex items-center justify-between text-xs font-mono text-outline">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addToast(`Split clip at ${formatTime(currentSeconds)}`, 'info')}
                  className="px-2 py-1 rounded bg-surface-container hover:text-white flex items-center gap-1 border border-surface-container-highest"
                >
                  <span className="material-symbols-outlined text-[14px]">content_cut</span> Split (S)
                </button>
                <button
                  onClick={() => addToast('AI Hook auto-snapped to nearest silence gap', 'success')}
                  className="px-2 py-1 rounded bg-surface-container hover:text-white flex items-center gap-1 border border-surface-container-highest"
                >
                  <span className="material-symbols-outlined text-[14px]">auto_fix_high</span> Auto-Trim Silence
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-tertiary">Live Playhead Sync</span>
              </div>
            </div>

            {/* Ruler & Multi-Track Area */}
            <div
              className="flex-1 overflow-x-auto overflow-y-hidden relative select-none p-2 space-y-1.5 cursor-pointer"
              onClick={handleTimelineClick}
            >
              {/* Playhead Needle */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-tertiary z-30 shadow-[0_0_8px_#4cd7f6] pointer-events-none transition-all duration-75"
                style={{ left: `${totalSeconds > 0 ? (currentSeconds / totalSeconds) * 100 : 0}%` }}
              >
                <div className="w-3 h-3 -ml-[5px] bg-tertiary rotate-45 -mt-1 shadow-md"></div>
              </div>

              {/* Track 1: Subtitle Kinetic Blocks */}
              <div className="h-7 w-full rounded bg-surface-container flex items-center px-2 relative text-[10px] font-mono border border-surface-container-highest">
                <span className="absolute left-2 text-outline text-[9px] uppercase pointer-events-none">Subtitles</span>
                <div className="ml-16 h-5 rounded bg-primary-container/80 text-white flex items-center px-2 font-bold truncate border border-primary">
                  "{captionText}"
                </div>
                <div className="ml-2 h-5 rounded bg-surface-container-high text-on-surface-variant flex items-center px-2 truncate">
                  [Host: "...just two steps to scale..."]
                </div>
              </div>

              {/* Track 2: B-Roll & Visual Inserts */}
              <div className="h-7 w-full rounded bg-surface-container flex items-center px-2 relative text-[10px] font-mono border border-surface-container-highest">
                <span className="absolute left-2 text-outline text-[9px] uppercase pointer-events-none">B-Roll Cut</span>
                <div className="ml-24 h-5 rounded bg-secondary-container text-on-secondary-container flex items-center px-2 font-medium border border-secondary/50">
                  ⚡ Studio Keylight Cutaway (00:08)
                </div>
              </div>

              {/* Track 3: Video Stream & Face Track */}
              <div className="h-7 w-full rounded bg-surface-container flex items-center px-2 relative text-[10px] font-mono border border-surface-container-highest overflow-hidden">
                <span className="absolute left-2 text-outline text-[9px] uppercase pointer-events-none z-10">Video 9:16</span>
                <div className="ml-16 w-full h-full bg-gradient-to-r from-surface-container-highest via-[#282a30] to-surface-container-highest flex items-center pl-2 text-outline text-[10px]">
                  Active Speaker Framing: Host (Primary) • 1080x1920 60fps
                </div>
              </div>

              {/* Track 4: Audio Waveform with Viral Hook Markers */}
              <div className="h-8 w-full rounded bg-surface-container-lowest flex items-center px-2 relative border border-surface-container-highest">
                <span className="absolute left-2 text-outline text-[9px] uppercase pointer-events-none z-10">Audio</span>
                <div className="ml-16 flex-1 h-6 flex items-center gap-1 opacity-75">
                  <div className="w-1 h-2 bg-outline rounded"></div>
                  <div className="w-1 h-4 bg-outline rounded"></div>
                  <div className="w-1 h-3 bg-outline rounded"></div>
                  <div className="w-1 h-6 bg-tertiary rounded shadow-[0_0_4px_#4cd7f6]"></div>
                  <div className="w-1 h-7 bg-tertiary rounded shadow-[0_0_4px_#4cd7f6]"></div>
                  <div className="w-1 h-5 bg-tertiary rounded shadow-[0_0_4px_#4cd7f6]"></div>
                  <div className="w-1 h-3 bg-outline rounded"></div>
                  <div className="w-1 h-4 bg-outline rounded"></div>
                  <div className="w-1 h-2 bg-outline rounded"></div>
                  <div className="w-1 h-5 bg-primary rounded"></div>
                  <div className="w-1 h-7 bg-primary rounded"></div>
                  <div className="w-1 h-6 bg-primary rounded"></div>
                  <div className="w-1 h-4 bg-outline rounded"></div>
                  <div className="w-1 h-2 bg-outline rounded"></div>
                  <div className="w-1 h-5 bg-outline rounded"></div>
                  <div className="w-1 h-6 bg-outline rounded"></div>
                  <div className="w-1 h-3 bg-outline rounded"></div>
                </div>
                {/* Viral Hook Marker badge */}
                <div className="absolute left-[24%] top-1 px-1.5 py-0.5 rounded bg-tertiary text-black text-[9px] font-mono font-bold flex items-center gap-0.5 shadow-md">
                  <span className="w-1 h-1 rounded-full bg-black"></span> Viral Hook (00:08)
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: AI INSPECTOR */}
        <aside className="w-80 border-l border-surface-container-highest bg-[#12141a] hidden xl:flex flex-col shrink-0 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-surface-container-highest font-mono text-xs">
            <button
              onClick={() => setRightTab('captions')}
              className={`flex-1 py-3 text-center font-semibold transition-colors ${rightTab === 'captions' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-white'}`}
            >
              Captions
            </button>
            <button
              onClick={() => setRightTab('tracking')}
              className={`flex-1 py-3 text-center font-semibold transition-colors ${rightTab === 'tracking' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-white'}`}
            >
              Tracking
            </button>
            <button
              onClick={() => setRightTab('hooks')}
              className={`flex-1 py-3 text-center font-semibold transition-colors ${rightTab === 'hooks' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-white'}`}
            >
              AI Hooks
            </button>
          </div>

          {/* Tab 1: Captions */}
          {rightTab === 'captions' && (
            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-outline">Active Subtitle Text</label>
                <textarea
                  rows="2"
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-lg bg-surface-container border border-surface-container-highest text-xs font-bold text-white focus:outline-none focus:border-primary uppercase transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-outline">Typography</label>
                <select
                  value={captionFont}
                  onChange={(e) => setCaptionFont(e.target.value)}
                  className="w-full p-2 rounded-lg bg-surface-container border border-surface-container-highest text-xs text-white focus:outline-none font-mono"
                >
                  <option value="Geist">Geist (Modern Sans)</option>
                  <option value="JetBrains Mono">JetBrains Mono (Cyber)</option>
                  <option value="Impact">Impact (Hormozi Classic)</option>
                  <option value="Arial Black">Arial Black (Bold Punch)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-outline">Highlight Color Accent</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setCaptionBgColor('#FFE600'); setCaptionTextColor('#000000'); addToast('Selected Hormozi Yellow', 'info'); }}
                    className="w-7 h-7 rounded-full bg-[#FFE600] border-2 border-white shadow-sm hover:scale-110 transition-transform"
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
                    onClick={() => { setCaptionBgColor('#8083ff'); setCaptionTextColor('#FFFFFF'); addToast('Selected Purple Primary', 'info'); }}
                    className="w-7 h-7 rounded-full bg-[#8083ff] hover:scale-110 transition-transform"
                    title="ClipForge Purple"
                  />
                  <button
                    onClick={() => { setCaptionBgColor('#00FF66'); setCaptionTextColor('#000000'); addToast('Selected Electric Green', 'info'); }}
                    className="w-7 h-7 rounded-full bg-[#00FF66] hover:scale-110 transition-transform"
                    title="Electric Green"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-outline">
                  <span>Font Size</span>
                  <span>{captionFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="28"
                  value={captionFontSize}
                  onChange={(e) => setCaptionFontSize(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-surface-container-highest">
                <label className="text-xs font-mono text-outline">Vertical Position</label>
                <div className="flex gap-2 text-xs font-mono">
                  <button
                    onClick={() => setCaptionPosition('bottom-8')}
                    className={`flex-1 py-1.5 rounded transition-colors ${captionPosition === 'bottom-8' ? 'bg-primary-container text-white' : 'bg-surface-container hover:bg-surface-container-high text-white'}`}
                  >
                    Low
                  </button>
                  <button
                    onClick={() => setCaptionPosition('bottom-14')}
                    className={`flex-1 py-1.5 rounded transition-colors ${captionPosition === 'bottom-14' ? 'bg-primary-container text-white' : 'bg-surface-container hover:bg-surface-container-high text-white'}`}
                  >
                    Mid
                  </button>
                  <button
                    onClick={() => setCaptionPosition('top-16')}
                    className={`flex-1 py-1.5 rounded transition-colors ${captionPosition === 'top-16' ? 'bg-primary-container text-white' : 'bg-surface-container hover:bg-surface-container-high text-white'}`}
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
              <span className="text-xs font-mono text-tertiary uppercase tracking-wider">Neural Speaker Tracking</span>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-white">Reframing Mode</label>
                <div className="space-y-2">
                  <label
                    onClick={() => { setReframeMode('single'); addToast('Single speaker auto-follow active', 'info'); }}
                    className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer ${reframeMode === 'single' ? 'bg-surface-container border border-primary/50 text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                  >
                    <input type="radio" checked={reframeMode === 'single'} readOnly className="accent-primary" />
                    <span>Auto-Follow Active Speaker (Single 9:16)</span>
                  </label>
                  <label
                    onClick={() => { setReframeMode('split'); addToast('Split-screen dual host active', 'info'); }}
                    className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer ${reframeMode === 'split' ? 'bg-surface-container border border-primary/50 text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                  >
                    <input type="radio" checked={reframeMode === 'split'} readOnly className="accent-primary" />
                    <span>Split-Screen Stack (Dual Hosts)</span>
                  </label>
                  <label
                    onClick={() => { setReframeMode('pan'); addToast('Cinematic pan & scan active', 'info'); }}
                    className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer ${reframeMode === 'pan' ? 'bg-surface-container border border-primary/50 text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                  >
                    <input type="radio" checked={reframeMode === 'pan'} readOnly className="accent-primary" />
                    <span>Cinematic Pan & Scan (Smoothed)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-mono text-outline">
                  <span>Camera Smoothness</span>
                  <span>{smoothness}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={smoothness}
                  onChange={(e) => setSmoothness(Number(e.target.value))}
                  className="w-full accent-tertiary"
                />
              </div>

              <div className="p-3 rounded-lg bg-surface-container border border-surface-container-highest text-xs text-outline leading-relaxed">
                <span className="text-white font-semibold flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-tertiary text-[16px]">visibility</span>
                  Speaker Isolation Active
                </span>
                The neural net automatically pans the 9:16 crop window when audio decibels shift between speakers.
              </div>
            </div>
          )}

          {/* Tab 3: Hooks */}
          {rightTab === 'hooks' && (
            <div className="p-4 space-y-3">
              <span className="text-xs font-mono text-primary uppercase tracking-wider">AI Detected Hook Highlights</span>
              
              <div className="p-3 rounded-xl bg-surface-container border border-primary/60 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span> Hook Peak
                  </span>
                  <span className="text-xs font-mono text-tertiary font-bold">98% Viral Prob</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">"The exact blueprint why most creators burn out..."</span>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => seekTo(8)}
                    className="flex-1 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-white transition-colors"
                  >
                    Jump to 00:08
                  </button>
                  <button
                    onClick={() => addToast('Trimmed clip to Hook duration (0:34)', 'success')}
                    className="px-2.5 py-1 rounded bg-primary-container text-white text-xs font-mono"
                  >
                    Trim
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-highest flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span> Key Punchline
                  </span>
                  <span className="text-xs font-mono text-secondary font-bold">93% Viral Prob</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">"Stop doing this today if you want to grow in 2026..."</span>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => seekTo(24)}
                    className="flex-1 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-white transition-colors"
                  >
                    Jump to 00:24
                  </button>
                  <button
                    onClick={() => addToast('Trimmed clip to Punchline duration', 'success')}
                    className="px-2.5 py-1 rounded bg-surface-container-high text-white text-xs font-mono"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface-container border border-surface-container-highest shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">rocket_launch</span>
                <h3 className="font-bold text-base text-white">Render & Export Short</h3>
              </div>
              <button onClick={() => !isRendering && setIsExportOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-white">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-outline block mb-1">Export Resolution</label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {['1080p', '4k', '720p'].map((res) => (
                    <button
                      key={res}
                      onClick={() => setExportRes(res)}
                      className={`p-2 rounded-lg text-center font-semibold transition-all ${exportRes === res ? 'bg-primary-container text-white border border-primary' : 'bg-surface-container-high text-outline hover:text-white'}`}
                    >
                      {res === '1080p' ? '1080p 60fps' : res === '4k' ? '4K Ultra-HD' : '720p Fast'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-outline block mb-1">Direct Platform Format</label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <label className="p-2 rounded bg-surface-container-high flex items-center justify-center gap-1.5 cursor-pointer text-white">
                    <input type="checkbox" defaultChecked className="accent-primary" /> TikTok
                  </label>
                  <label className="p-2 rounded bg-surface-container-high flex items-center justify-center gap-1.5 cursor-pointer text-white">
                    <input type="checkbox" defaultChecked className="accent-primary" /> Shorts
                  </label>
                  <label className="p-2 rounded bg-surface-container-high flex items-center justify-center gap-1.5 cursor-pointer text-white">
                    <input type="checkbox" defaultChecked className="accent-primary" /> Reels
                  </label>
                </div>
              </div>

              {/* Progress Bar when rendering */}
              {isRendering && (
                <div className="flex flex-col gap-2 p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-tertiary flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
                      {renderStepText}
                    </span>
                    <span className="text-white font-bold">{renderProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-container to-tertiary rounded-full transition-all duration-300" style={{ width: `${renderProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                disabled={isRendering}
                onClick={() => setIsExportOpen(false)}
                className="flex-1 h-11 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-on-surface transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isRendering}
                onClick={handleStartRender}
                className="flex-1 h-11 rounded-lg bg-gradient-to-r from-primary-container via-secondary-container to-tertiary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
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
