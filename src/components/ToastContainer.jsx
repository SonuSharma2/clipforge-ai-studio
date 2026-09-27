import React from 'react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div id="toast-container" className="fixed bottom-20 md:bottom-8 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        let icon = 'info';
        let borderColor = 'border-l-indigo-600';
        let iconColor = 'text-indigo-600';

        if (toast.type === 'success') {
          icon = 'check_circle';
          borderColor = 'border-l-emerald-500';
          iconColor = 'text-emerald-600';
        } else if (toast.type === 'error') {
          icon = 'error';
          borderColor = 'border-l-rose-500';
          iconColor = 'text-rose-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 bg-white/95 backdrop-blur-md border border-slate-200 ${borderColor} border-l-4 rounded-xl text-slate-800 text-xs font-medium shadow-xl transition-all duration-300 animate-slideUp`}
          >
            <span className={`material-symbols-outlined text-[18px] ${iconColor}`}>{icon}</span>
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
