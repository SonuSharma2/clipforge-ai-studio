import React from 'react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div id="toast-container" className="fixed bottom-20 md:bottom-8 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        let icon = 'info';
        let borderColor = 'border-l-[#8083ff]';
        let iconColor = 'text-[#c0c1ff]';

        if (toast.type === 'success') {
          icon = 'check_circle';
          borderColor = 'border-l-[#4cd7f6]';
          iconColor = 'text-[#4cd7f6]';
        } else if (toast.type === 'error') {
          icon = 'error';
          borderColor = 'border-l-[#ffb4ab]';
          iconColor = 'text-[#ffb4ab]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 bg-[#1d1f26] border border-[#282a30] ${borderColor} border-l-4 rounded-lg text-[#e2e2ea] text-xs font-sans shadow-2xl transition-all duration-300 animate-slideUp`}
          >
            <span className={`material-symbols-outlined text-[18px] ${iconColor}`}>{icon}</span>
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
