import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { currentPage, setCurrentPage, user, logoutUser, navigateToAuth } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'studio', label: 'Studio', icon: 'movie_edit', badge: 'Soon' },
    { id: 'clip', label: 'Clip Generator', icon: 'auto_videocam' },
    { id: 'features', label: 'Features', icon: 'psychology' },
    { id: 'pricing', label: 'Pricing', icon: 'payments' },
    { id: 'templates', label: 'Templates', icon: 'dashboard_customize' },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 pt-safe bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto h-16 px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[19px]">auto_awesome</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">ClipForge</span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold">
              AI Studio
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all focus:outline-none ${
                  currentPage === item.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 relative">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative border border-slate-200/60"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotif && (
              <div className="absolute top-12 right-0 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 flex flex-col gap-2 animate-fadeIn text-slate-900">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Notifications</span>
                  <span className="text-[10px] text-indigo-600 font-mono font-bold bg-indigo-50 px-2 py-0.5 rounded">2 New</span>
                </div>
                <div
                  onClick={() => {
                    setCurrentPage('studio');
                    setShowNotif(false);
                  }}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100"
                >
                  <span className="material-symbols-outlined text-indigo-600 text-[18px] mt-0.5">check_circle</span>
                  <div className="flex flex-col text-xs">
                    <span className="font-semibold text-slate-900">Episode_42_Cut_01 Ready</span>
                    <span className="text-[11px] text-slate-500">3 viral clips auto-framed with 98% score.</span>
                    <span className="text-[9px] text-slate-400 mt-1 font-mono">2 mins ago</span>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setCurrentPage('pricing');
                    setShowNotif(false);
                  }}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100"
                >
                  <span className="material-symbols-outlined text-sky-600 text-[18px] mt-0.5">bolt</span>
                  <div className="flex flex-col text-xs">
                    <span className="font-semibold text-slate-900">GPU Cluster Priority Active</span>
                    <span className="text-[11px] text-slate-500">FFmpeg v7.1 and H100 acceleration online.</span>
                    <span className="text-[9px] text-slate-400 mt-1 font-mono">1 hour ago</span>
                  </div>
                </div>
              </div>
            )}

            {/* Authenticated State vs Guest State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200 focus:outline-none bg-white shadow-xs"
                >
                  <img
                    alt={user.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-indigo-200"
                    src={user.avatar || 'https://avatars.githubusercontent.com/u/47955645?v=4'}
                  />
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline-block">
                    {user.name?.split(' ')[0] || 'Creator'}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-500">
                    expand_more
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute top-12 right-0 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 flex flex-col gap-2 animate-fadeIn text-slate-900">
                    <div className="flex items-center gap-2.5 p-2 pb-3 border-b border-slate-100">
                      <img
                        src={user.avatar || 'https://avatars.githubusercontent.com/u/47955645?v=4'}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover border border-indigo-200"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 truncate">{user.name || 'Creator'}</span>
                        <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
                        <span className="text-[10px] font-mono text-indigo-600 mt-0.5 font-bold">
                          {user.plan || 'Pro Studio'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 py-1 text-xs font-medium">
                      <button
                        onClick={() => {
                          setCurrentPage('studio');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[18px] text-indigo-600">movie_edit</span>
                        <span>Video Studio</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('clip');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[18px] text-sky-600">auto_videocam</span>
                        <span>My Generated Shorts</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('pricing');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[18px] text-violet-600">workspace_premium</span>
                        <span>Manage Subscription</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logoutUser();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-xs text-left font-semibold"
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
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigateToAuth('signup')}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity hidden sm:flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">bolt</span>
                  <span>Get Started</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setShowDrawer(true)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Open Navigation Menu"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="w-72 h-full bg-white border-l border-slate-200 p-5 flex flex-col justify-between shadow-2xl text-slate-900">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  </div>
                  <span className="font-bold text-base text-slate-900">ClipForge AI</span>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* User info if logged in */}
              {user && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <img
                    src={user.avatar || 'https://avatars.githubusercontent.com/u/47955645?v=4'}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-indigo-200"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">{user.name}</span>
                    <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
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
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors text-left ${
                      currentPage === item.id
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
              {user ? (
                <button
                  onClick={() => {
                    logoutUser();
                    setShowDrawer(false);
                  }}
                  className="w-full h-11 rounded-xl bg-red-50 text-red-600 border border-red-200 font-semibold flex items-center justify-center gap-2 text-sm"
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
                    className="w-full h-11 rounded-xl bg-slate-100 text-slate-800 font-semibold flex items-center justify-center gap-2 text-sm border border-slate-200"
                  >
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      navigateToAuth('signup');
                      setShowDrawer(false);
                    }}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md text-sm"
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

