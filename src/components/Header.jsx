import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { currentPage, setCurrentPage } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'studio', label: 'Studio', icon: 'movie_edit' },
    { id: 'clip', label: 'Clip Generator', icon: 'auto_videocam' },
    { id: 'features', label: 'Features', icon: 'psychology' },
    { id: 'pricing', label: 'Pricing', icon: 'payments' },
    { id: 'templates', label: 'Templates', icon: 'dashboard_customize' },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 pt-safe glass-nav">
        <div className="max-w-7xl mx-auto h-16 px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#571bc1] via-[#8083ff] to-[#4cd7f6] flex items-center justify-center text-white shadow-[0_0_12px_rgba(128,131,255,0.4)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#e2e2ea]">ClipForge</span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#282a30] text-[#4cd7f6] border border-[#33343b]">
              React AI Suite
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-1.5 transition-colors focus:outline-none ${
                  currentPage === item.id
                    ? 'text-[#c0c1ff] font-semibold'
                    : 'text-[#c7c4d7] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#c7c4d7] hover:text-[#e2e2ea] hover:bg-[#282a30] transition-colors relative"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotif && (
              <div className="absolute top-12 right-0 w-80 rounded-xl bg-[#1d1f26] border border-[#33343b] shadow-2xl p-3 z-50 flex flex-col gap-2 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-[#33343b]">
                  <span className="text-xs font-semibold text-[#e2e2ea] uppercase tracking-wider">AI Notifications</span>
                  <span className="text-[10px] text-[#4cd7f6] font-mono">2 New</span>
                </div>
                <div
                  onClick={() => {
                    setCurrentPage('studio');
                    setShowNotif(false);
                  }}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-[#191b22] hover:bg-[#282a30] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#c0c1ff] text-[18px] mt-0.5">check_circle</span>
                  <div className="flex flex-col text-xs">
                    <span className="font-medium text-white">Episode_42_Cut_01 Ready</span>
                    <span className="text-[11px] text-[#c7c4d7]">3 viral clips auto-framed with 98% score.</span>
                    <span className="text-[9px] text-[#908fa0] mt-1 font-mono">2 mins ago</span>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setCurrentPage('pricing');
                    setShowNotif(false);
                  }}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-[#191b22] hover:bg-[#282a30] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[18px] mt-0.5">bolt</span>
                  <div className="flex flex-col text-xs">
                    <span className="font-medium text-white">GPU Cluster Priority Active</span>
                    <span className="text-[11px] text-[#c7c4d7]">FFmpeg v7.1 and H100 acceleration online.</span>
                    <span className="text-[9px] text-[#908fa0] mt-1 font-mono">1 hour ago</span>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Avatar / Mobile Drawer Trigger */}
            <button
              onClick={() => setShowDrawer(true)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#282a30] transition-colors border border-[#33343b]"
              title="Open Navigation Menu"
            >
              <img
                alt="Profile Avatar"
                className="w-8 h-8 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-w7wMnJainoYTirpv9tnRm6ZuHNSze7RVnlm0wVZGeEierfeyaf3ck0tZa4Kyv0XSh8rtjo8OCMAQMHLEXyepyrZYnYjkQcEm6zeWTdBP6tTRdBKsawPYgsEsDcbTgtQ_tmhSWXNjlRy0q48G2i57WHclrzSQ8qtbpBqaMhoFwIMc2_zN-BJSvqrN2BXwfO9PknNuAMjWoZMbZecd7V_FvtP8OyIu6njkjLoPfwE"
              />
              <span className="material-symbols-outlined text-[20px] text-[#c7c4d7] pr-1">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-fadeIn">
          <div className="w-72 h-full bg-[#191b22] border-l border-[#33343b] p-5 flex flex-col justify-between shadow-2xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#33343b]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-white">ClipForge</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#282a30] text-[#4cd7f6]">React</span>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#908fa0] hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-2 font-medium text-sm">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setShowDrawer(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                      currentPage === item.id
                        ? 'bg-[#1d1f26] text-[#c0c1ff] font-semibold'
                        : 'hover:bg-[#1d1f26] text-[#e2e2ea]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-[#33343b]">
              <button
                onClick={() => {
                  setCurrentPage('clip');
                  setShowDrawer(false);
                }}
                className="w-full h-11 rounded-lg bg-gradient-to-r from-[#8083ff] to-[#571bc1] text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Create Shorts Free</span>
              </button>
              <span className="text-[11px] text-center text-[#908fa0]">60 free GPU processing minutes included</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
