/**
 * ClipForge Shared Utilities & Navigation Logic
 */

// Initialize Toast Container
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('toast-container')) {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Bind universal mobile drawer & notification toggles
  initHeaderInteractions();
});

// Toast Notification
function showToast(message, type = 'info', duration = 3200) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
  
  let icon = 'info';
  if (type === 'success') icon = 'check_circle';
  if (type === 'error') icon = 'error';

  toast.innerHTML = `
    <span class="material-symbols-outlined text-[18px] ${type === 'success' ? 'text-[#4cd7f6]' : type === 'error' ? 'text-[#ffb4ab]' : 'text-[#c0c1ff]'}">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Global Video Modal Preview
function openVideoModal(clipData) {
  let modal = document.getElementById('global-video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'global-video-modal';
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 transition-opacity duration-300';
    document.body.appendChild(modal);
  }

  const title = clipData.title || 'ClipForge AI Viral Short';
  const score = clipData.score || '98/100';
  const img = clipData.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmnQEoYL5rJ_1B3AerwbYF3TfBwzSp7RArfpxnsKbZ9wyUBvSL3AeW7aDGc3vk_C2YMLc6x5ID1ZrH7bboZyHRM4mQwOteq8xgXf6roLudXnTNZ2TxrToT88BxfEtmoqFGqDdsqQ490bLhROqFYc9tRjHyDFVpPfdajd6NPSKP_PorEpZwn65cvfxqB7D8VvFAv5BC9rNfcrbylBb8P742Cb4C3vtqwBUr9H1wa4k';
  const caption = clipData.caption || 'THE EXACT BLUEPRINT';
  const style = clipData.style || 'Hormozi Bold';
  const estViews = clipData.estViews || '120k+ Est.';
  const videoUrl = clipData.video_url || '/generated_shorts/viral_blueprint_master.mp4';

  modal.innerHTML = `
    <div class="relative w-full max-w-sm rounded-2xl bg-[#181b22] border border-[#232733] overflow-hidden shadow-2xl flex flex-col animate-scaleUp">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-3 border-b border-[#232733] bg-[#111319]">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-[#4cd7f6]">movie</span>
          <span class="text-sm font-semibold text-[#e2e2ea] truncate max-w-[200px]">${title}</span>
        </div>
        <button onclick="closeVideoModal()" class="w-8 h-8 rounded-full flex items-center justify-center text-[#908fa0] hover:text-white hover:bg-[#282a30] transition-colors">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <!-- Real 9:16 Video Player Area -->
      <div class="relative w-full aspect-[9/16] max-h-[500px] bg-black flex items-center justify-center overflow-hidden">
        <video id="modal-real-video" src="${videoUrl}" poster="${img}" playsinline loop class="w-full h-full object-cover"></video>
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

        <!-- Viral Score Badge -->
        <div class="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0c0e14]/90 backdrop-blur-md flex items-center gap-1.5 text-xs text-[#4cd7f6] font-mono border border-[#4cd7f6]/30 shadow-lg pointer-events-none">
          <span class="material-symbols-outlined text-[14px]">trending_up</span>
          <span>Score: ${score}</span>
        </div>

        <!-- Face Tracking Box Simulation -->
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-44 h-44 border-2 border-dashed border-[#4cd7f6]/70 rounded-xl pointer-events-none animate-pulse flex items-start justify-end p-1">
          <span class="text-[9px] font-mono bg-[#4cd7f6] text-[#003640] px-1 rounded font-bold">FACE TRACK 99.4%</span>
        </div>

        <!-- Kinetic Caption Display -->
        <div class="absolute bottom-14 left-4 right-4 text-center pointer-events-none">
          <span class="inline-block bg-[#8083ff] text-white font-black text-sm px-3 py-1.5 rounded-lg uppercase tracking-tight shadow-xl">
            "${caption}"
          </span>
        </div>

        <!-- Play/Pause Overlay Button -->
        <button id="modal-play-btn" onclick="toggleModalRealPlayback()" class="absolute w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:scale-110 active:scale-95 transition-all shadow-2xl">
          <span id="modal-play-icon" class="material-symbols-outlined text-[32px]">play_arrow</span>
        </button>

        <!-- Scrub progress bar -->
        <div class="absolute bottom-0 left-0 right-0 h-1.5 bg-[#282a30]">
          <div id="modal-progress-bar" class="h-full bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] w-0 transition-all duration-200"></div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="p-3 bg-[#111319] border-t border-[#232733] flex flex-col gap-2">
        <div class="flex items-center justify-between text-xs text-[#908fa0]">
          <span>Preset: <strong class="text-[#e2e2ea]">${style}</strong></span>
          <span class="text-[#4cd7f6]">${estViews}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-1">
          <a href="studio.html?clip=${encodeURIComponent(title)}&video=${encodeURIComponent(videoUrl)}" class="h-9 rounded-lg bg-[#282a30] hover:bg-[#33343b] text-[#e2e2ea] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
            <span class="material-symbols-outlined text-[16px]">tune</span>
            Open in Studio
          </a>
          <button onclick="downloadClip('${title}', '${videoUrl}')" class="h-9 rounded-lg bg-gradient-to-r from-[#8083ff] to-[#571bc1] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all">
            <span class="material-symbols-outlined text-[16px]">download</span>
            Download MP4
          </button>
        </div>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  
  // Set up video event listeners for real progress
  const video = document.getElementById('modal-real-video');
  const bar = document.getElementById('modal-progress-bar');
  if (video && bar) {
    video.ontimeupdate = () => {
      if (video.duration) {
        bar.style.width = ((video.currentTime / video.duration) * 100) + '%';
      }
    };
  }
}

function closeVideoModal() {
  const modal = document.getElementById('global-video-modal');
  if (modal) {
    const video = document.getElementById('modal-real-video');
    if (video) video.pause();
    modal.style.display = 'none';
  }
}

function toggleModalRealPlayback() {
  const video = document.getElementById('modal-real-video');
  const icon = document.getElementById('modal-play-icon');
  if (!video) return;

  if (video.paused) {
    video.play();
    if (icon) icon.textContent = 'pause';
  } else {
    video.pause();
    if (icon) icon.textContent = 'play_arrow';
  }
}

function downloadClip(title, videoUrl) {
  const url = videoUrl || '/generated_shorts/viral_blueprint_master.mp4';
  showToast(`Downloading real MP4 short for "${title}"...`, 'info');
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.mp4`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  
  setTimeout(() => {
    showToast(`"${title}.mp4" downloaded successfully!`, 'success');
  }, 1200);
}

// Navigation & Notifications Dropdown
function initHeaderInteractions() {
  // Mobile Nav Drawer Toggle
  const menuBtns = document.querySelectorAll('.mobile-menu-trigger');
  const drawer = document.getElementById('mobile-drawer');
  
  menuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (drawer) {
        drawer.classList.toggle('hidden');
      }
    });
  });

  // Notifications Toggle
  const notifBtns = document.querySelectorAll('.notifications-trigger');
  const notifDropdown = document.getElementById('notifications-dropdown');
  if (notifBtns.length && notifDropdown) {
    notifBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('hidden');
      });
    });

    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target)) {
        notifDropdown.classList.add('hidden');
      }
    });
  }
}
