import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { currentPage, setCurrentPage, user, logoutUser, navigateToAuth } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
              AI Studio
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
          <div className="flex items-center gap-3 relative">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#c7c4d7] hover:text-[#e2e2ea] hover:bg-[#282a30] transition-colors relative"
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

            {/* Authenticated State vs Guest State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full hover:bg-[#282a30] transition-colors border border-[#33343b] focus:outline-none"
                >
                  <img
                    alt={user.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-[#8083ff]/40"
                    src={user.avatar || 'https://avatars.githubusercontent.com/u/47955645?v=4'}
                  />
                  <span className="text-xs font-medium text-white max-w-[100px] truncate hidden sm:inline-block">
                    {user.name?.split(' ')[0] || 'Creator'}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#908fa0]">
                    expand_more
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute top-12 right-0 w-64 rounded-xl bg-[#1d1f26] border border-[#33343b] shadow-2xl p-3 z-50 flex flex-col gap-2 animate-fadeIn">
                    <div className="flex items-center gap-2.5 p-2 pb-3 border-b border-[#33343b]">
                      <img
                        src={user.avatar || 'https://avatars.githubusercontent.com/u/47955645?v=4'}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover border border-[#8083ff]/40"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-white truncate">{user.name || 'Creator'}</span>
                        <span className="text-[10px] text-[#908fa0] truncate">{user.email}</span>
                        <span className="text-[9px] font-mono text-[#8083ff] mt-0.5 font-semibold">
                          {user.plan || 'Pro Studio'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 py-1 text-xs">
                      <button
                        onClick={() => {
                          setCurrentPage('studio');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-lg text-[#c7c4d7] hover:text-white hover:bg-[#282a30] transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[18px]">movie_edit</span>
                        <span>Video Studio</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('clip');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-lg text-[#c7c4d7] hover:text-white hover:bg-[#282a30] transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[18px]">auto_videocam</span>
                        <span>My Generated Shorts</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('pricing');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-lg text-[#c7c4d7] hover:text-white hover:bg-[#282a30] transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                        <span>Manage Subscription</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-[#33343b]">
                      <button
                        onClick={() => {
                          logoutUser();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-xs text-left font-medium"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateToAuth('login')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#c7c4d7] hover:text-white hover:bg-[#282a30] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigateToAuth('signup')}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#8083ff] to-[#571bc1] text-white text-xs font-semibold shadow-md hover:opacity-95 transition-opacity hidden sm:flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">bolt</span>
                  <span>Get Started</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setShowDrawer(true)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#c7c4d7] hover:text-white hover:bg-[#282a30] transition-colors"
              title="Open Navigation Menu"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
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
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#571bc1] to-[#8083ff] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  </div>
                  <span className="font-bold text-base text-white">ClipForge AI</span>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#908fa0] hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* User info if logged in */}
              {user && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111319] border border-[#33343b]">
                  <img
                    src={user.avatar || 'https://avatars.githubusercontent.com/u/47955645?v=4'}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-[#8083ff]/40"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white truncate">{user.name}</span>
                    <span className="text-[10px] text-[#908fa0] truncate">{user.email}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5 font-medium text-sm">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setShowDrawer(false);
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left ${
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
              {user ? (
                <button
                  onClick={() => {
                    logoutUser();
                    setShowDrawer(false);
                  }}
                  className="w-full h-11 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-semibold flex items-center justify-center gap-2 text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      navigateToAuth('login');
                      setShowDrawer(false);
                    }}
                    className="w-full h-11 rounded-lg bg-[#282a30] text-white font-semibold flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      navigateToAuth('signup');
                      setShowDrawer(false);
                    }}
                    className="w-full h-11 rounded-lg bg-gradient-to-r from-[#8083ff] to-[#571bc1] text-white font-semibold flex items-center justify-center gap-2 shadow-lg text-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    <span>Create Account Free</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

