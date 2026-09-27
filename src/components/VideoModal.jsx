import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function VideoModal() {
  const { modalVideo, closeVideo, loadClipToStudio, addToast } = useApp();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
  }, [modalVideo]);

  if (!modalVideo) return null;

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const downloadClip = () => {
    addToast(`Downloading MP4 for "${modalVideo.title}"...`, 'info');
    const a = document.createElement('a');
    a.href = modalVideo.videoUrl || '/generated_shorts/viral_blueprint_master.mp4';
    a.download = `${modalVideo.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => {
      addToast(`"${modalVideo.title}.mp4" saved to downloads!`, 'success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-indigo-600">movie</span>
            <span className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">
              {modalVideo.title}
            </span>
          </div>
          <button
            onClick={closeVideo}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* 9:16 Video Player Container */}
        <div className="relative w-full aspect-[9/16] max-h-[500px] bg-slate-950 flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={modalVideo.videoUrl || '/generated_shorts/viral_blueprint_master.mp4'}
            poster={modalVideo.image}
            playsInline
            loop
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

          {/* Viral Score Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur-md flex items-center gap-1.5 text-xs text-cyan-300 font-mono border border-cyan-400/30 shadow-lg pointer-events-none">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>Score: {modalVideo.score}</span>
          </div>

          {/* Face Tracking Bounding Box Overlay */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-44 h-44 border-2 border-dashed border-cyan-400/80 rounded-xl pointer-events-none animate-pulse flex items-start justify-end p-1">
            <span className="text-[9px] font-mono bg-cyan-400 text-slate-900 px-1 rounded font-bold">
              FACE TRACK 99.4%
            </span>
          </div>

          {/* Kinetic Caption Overlay */}
          <div className="absolute bottom-14 left-4 right-4 text-center pointer-events-none">
            <span className="inline-block bg-indigo-600 text-white font-black text-sm px-3 py-1.5 rounded-lg uppercase tracking-tight shadow-xl">
              "{modalVideo.caption}"
            </span>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayback}
            className="absolute w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:scale-110 active:scale-95 transition-all shadow-2xl"
          >
            <span className="material-symbols-outlined text-[32px]">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-150"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Preset: <strong className="text-slate-800">{modalVideo.style}</strong></span>
            <span className="text-indigo-600 font-semibold">{modalVideo.estViews}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={() => {
                addToast('Studio editor is locked for polish! Check upcoming features.', 'info');
                closeVideo();
                setCurrentPage('studio');
              }}
              className="h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              <span className="material-symbols-outlined text-[15px] text-amber-600">lock</span>
              Studio (Soon)
            </button>
            <button
              onClick={downloadClip}
              className="h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Download MP4
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
