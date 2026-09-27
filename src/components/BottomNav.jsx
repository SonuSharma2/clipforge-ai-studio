import React from 'react';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { currentPage, setCurrentPage, user, navigateToAuth } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe glass-bottom-nav">
      <div className="h-16 px-4 flex items-center justify-around">
        <button
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-colors ${
            currentPage === 'home' ? 'text-[#c0c1ff]' : 'text-[#c7c4d7] hover:text-[#e2e2ea]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          <span className="text-[10px] font-mono">Home</span>
        </button>

        <button
          onClick={() => setCurrentPage('studio')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-colors ${
            currentPage === 'studio' ? 'text-[#c0c1ff]' : 'text-[#c7c4d7] hover:text-[#e2e2ea]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">movie_edit</span>
          <span className="text-[10px] font-mono">Studio</span>
        </button>

        {/* Central glowing action button */}
        <div className="relative -top-3 flex flex-col items-center justify-center">
          <button
            onClick={() => setCurrentPage('clip')}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#571bc1] via-[#8083ff] to-[#4cd7f6] flex items-center justify-center text-white shadow-[0_0_20px_rgba(128,131,255,0.4)] active:scale-95 transition-all"
            title="Create Short"
          >
            <span className="material-symbols-outlined text-[24px]">auto_videocam</span>
          </button>
          <span className="text-[10px] font-mono mt-1 text-[#c0c1ff]">Clip</span>
        </div>

        <button
          onClick={() => setCurrentPage('features')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-colors ${
            currentPage === 'features' ? 'text-[#c0c1ff]' : 'text-[#c7c4d7] hover:text-[#e2e2ea]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          <span className="text-[10px] font-mono">Features</span>
        </button>

        <button
          onClick={() => setCurrentPage('pricing')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-colors ${
            currentPage === 'pricing' ? 'text-[#c0c1ff]' : 'text-[#c7c4d7] hover:text-[#e2e2ea]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">payments</span>
          <span className="text-[10px] font-mono">Pricing</span>
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
            currentPage === 'auth' ? 'text-[#c0c1ff]' : 'text-[#c7c4d7] hover:text-[#e2e2ea]'
          }`}
        >
          {user ? (
            <img
              src={user.avatar || 'https://avatars.githubusercontent.com/u/47955645?v=4'}
              alt=""
              className="w-5 h-5 rounded-full object-cover border border-[#8083ff]"
            />
          ) : (
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
          )}
          <span className="text-[10px] font-mono">{user ? 'Account' : 'Sign In'}</span>
        </button>
      </div>
    </nav>
  );
}
