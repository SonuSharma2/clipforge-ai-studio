import React from 'react';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { currentPage, setCurrentPage, user, navigateToAuth } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-sm">
      <div className="h-16 px-4 flex items-center justify-around">
        <button
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-colors ${
            currentPage === 'home' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          onClick={() => setCurrentPage('studio')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-colors relative ${
            currentPage === 'studio' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">movie_edit</span>
          <span className="text-[10px] font-medium flex items-center gap-0.5">
            Studio
            <span className="text-[8px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1 rounded">Soon</span>
          </span>
        </button>

        {/* Central glowing action button */}
        <div className="relative -top-3 flex flex-col items-center justify-center">
          <button
            onClick={() => setCurrentPage('clip')}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md active:scale-95 transition-all"
            title="Create Short"
          >
            <span className="material-symbols-outlined text-[24px]">auto_videocam</span>
          </button>
          <span className="text-[10px] font-medium mt-1 text-indigo-600">Clip</span>
        </div>

        <button
          onClick={() => setCurrentPage('features')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-colors ${
            currentPage === 'features' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          <span className="text-[10px] font-medium">Features</span>
        </button>

        <button
          onClick={() => setCurrentPage('pricing')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-colors ${
            currentPage === 'pricing' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">payments</span>
          <span className="text-[10px] font-medium">Pricing</span>
        </button>

        <button
          onClick={() => {
            if (user) {
              setCurrentPage('studio');
            } else {
              navigateToAuth('login');
            }
          }}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-colors ${
            currentPage === 'auth' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {user ? (
            <img
              src={user.avatar || 'https://avatars.githubusercontent.com/u/47955645?v=4'}
              alt=""
              className="w-5 h-5 rounded-full object-cover border border-indigo-500"
            />
          ) : (
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
          )}
          <span className="text-[10px] font-medium">{user ? 'Account' : 'Sign In'}</span>
        </button>
      </div>
    </nav>
  );
}
