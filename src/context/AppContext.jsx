import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home'); // home, studio, clip, features, pricing, templates
  const [generatedClips, setGeneratedClips] = useState(null);
  const [lastAnalyzedUrl, setLastAnalyzedUrl] = useState('');
  
  const [activeStudioClip, setActiveStudioClip] = useState({
    title: 'The Viral Hook Peak',
    score: '98/100',
    caption: 'THE EXACT BLUEPRINT',
    style: 'Hormozi Bold',
    videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmnQEoYL5rJ_1B3AerwbYF3TfBwzSp7RArfpxnsKbZ9wyUBvSL3AeW7aDGc3vk_C2YMLc6x5ID1ZrH7bboZyHRM4mQwOteq8xgXf6roLudXnTNZ2TxrToT88BxfEtmoqFGqDdsqQ490bLhROqFYc9tRjHyDFVpPfdajd6NPSKP_PorEpZwn65cvfxqB7D8VvFAv5BC9rNfcrbylBb8P742Cb4C3vtqwBUr9H1wa4k'
  });
  const [modalVideo, setModalVideo] = useState(null); // When open, holds clip details
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const openVideo = (clip) => {
    setModalVideo({
      title: clip.title || clip.headline || 'ClipForge AI Viral Short',
      score: clip.score || '98/100',
      caption: clip.caption || 'THE EXACT BLUEPRINT',
      style: clip.style || 'Hormozi Bold',
      estViews: clip.estViews || '120k+ Est.',
      image: clip.thumbnail || clip.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmnQEoYL5rJ_1B3AerwbYF3TfBwzSp7RArfpxnsKbZ9wyUBvSL3AeW7aDGc3vk_C2YMLc6x5ID1ZrH7bboZyHRM4mQwOteq8xgXf6roLudXnTNZ2TxrToT88BxfEtmoqFGqDdsqQ490bLhROqFYc9tRjHyDFVpPfdajd6NPSKP_PorEpZwn65cvfxqB7D8VvFAv5BC9rNfcrbylBb8P742Cb4C3vtqwBUr9H1wa4k',
      videoUrl: clip.videoUrl || '/generated_shorts/viral_blueprint_master.mp4'
    });
  };

  const closeVideo = () => {
    setModalVideo(null);
  };

  const loadClipToStudio = (clip) => {
    setActiveStudioClip({
      title: clip.headline || clip.title || 'Viral Short',
      caption: clip.caption || 'THE EXACT BLUEPRINT',
      score: clip.score || '98/100',
      style: clip.style || 'Hormozi Bold',
      videoUrl: clip.videoUrl || '/generated_shorts/viral_blueprint_master.mp4',
      image: clip.thumbnail || clip.image
    });
    setCurrentPage('studio');
    addToast(`Loaded "${clip.headline || clip.title}" into Studio!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        generatedClips,
        setGeneratedClips,
        lastAnalyzedUrl,
        setLastAnalyzedUrl,
        activeStudioClip,
        setActiveStudioClip,
        loadClipToStudio,
        modalVideo,
        openVideo,
        closeVideo,
        toasts,
        addToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
