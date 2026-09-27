import React from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import VideoModal from './components/VideoModal';
import ToastContainer from './components/ToastContainer';

import HomePage from './pages/HomePage';
import StudioPage from './pages/StudioPage';
import ClipPage from './pages/ClipPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import TemplatesPage from './pages/TemplatesPage';
import AuthPage from './pages/AuthPage';

export default function App() {
  const { currentPage } = useApp();

  return (
    <div className="bg-white text-slate-900 font-sans min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white relative">
      {/* Global Header (shown on all pages except Studio, which has its full-bleed suite toolbar) */}
      {currentPage !== 'studio' && <Header />}

      {/* Dynamic Module Content */}
      <div className={`flex-1 flex flex-col ${currentPage !== 'studio' ? 'pt-16' : ''}`}>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'studio' && <StudioPage />}
        {currentPage === 'clip' && <ClipPage />}
        {currentPage === 'features' && <FeaturesPage />}
        {currentPage === 'pricing' && <PricingPage />}
        {currentPage === 'templates' && <TemplatesPage />}
        {currentPage === 'auth' && <AuthPage />}
      </div>

      {/* Global Real Video Modal Player */}
      <VideoModal />

      {/* Toast Feedback Manager */}
      <ToastContainer />

      {/* Mobile Bottom Navigation Bar */}
      {currentPage !== 'studio' && <BottomNav />}
    </div>
  );
}
