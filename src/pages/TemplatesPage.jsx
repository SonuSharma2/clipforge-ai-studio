import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function TemplatesPage() {
  const { openVideo, loadClipToStudio, addToast } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const templates = [
    {
      id: 'blueprint',
      title: 'Episode_42_Cut_01',
      templateName: 'Hormozi High-Retention Podcast',
      categories: ['podcast'],
      badge: 'Podcast Hook',
      desc: 'All-caps yellow emphasis with Shure SM7B audio tuning and dynamic speaker snap-in.',
      caption: 'THE EXACT BLUEPRINT',
      captionClass: 'caption-hormozi',
      format: '9:16 Shorts',
      retention: '98% Retention',
      score: '98/100',
      estViews: '250k+ Avg.',
      style: 'Hormozi Bold',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmnQEoYL5rJ_1B3AerwbYF3TfBwzSp7RArfpxnsKbZ9wyUBvSL3AeW7aDGc3vk_C2YMLc6x5ID1ZrH7bboZyHRM4mQwOteq8xgXf6roLudXnTNZ2TxrToT88BxfEtmoqFGqDdsqQ490bLhROqFYc9tRjHyDFVpPfdajd6NPSKP_PorEpZwn65cvfxqB7D8VvFAv5BC9rNfcrbylBb8P742Cb4C3vtqwBUr9H1wa4k'
    },
    {
      id: 'testing',
      title: 'Episode_42_Cut_04',
      templateName: 'MrBeast Kinetic Punch',
      categories: ['tech', 'story'],
      badge: 'Viral Challenge',
      desc: 'Heavy black strokes with cyan neon background highlights and instant sound effect pops.',
      caption: 'NEVER STOP TESTING',
      captionClass: 'caption-mrbeast',
      format: '9:16 TikTok',
      retention: '95% Retention',
      score: '95/100',
      estViews: '400k+ Avg.',
      style: 'MrBeast Punch',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpP3_3bPoiTRyB8UTAcuKGRZ-LguFnckiSxwe6fa2xPLft9J0EK8U8oKmFwaVGeEIOctN5QxdMKDsX8aJiMZ91cGafVH5ys4hSqzcoPASX6YuI8VjIWdc5Zm5eXzbWx9lqHjdtk6syGcv3dDFxOkGpS45yFk_18vaR3fdFN3L1vFgdutmc9aoM2n42RLR3vV_cc6J_ZTMX4f2teaCzonOwwe6x4gPoy49z7FnFDbI'
    },
    {
      id: 'fail2026',
      title: 'Episode_42_Cut_02',
      templateName: 'Cyberpunk Developer Log',
      categories: ['tech'],
      badge: 'Tech & AI',
      desc: 'JetBrains Mono monospaced subtitle boxes with cyan rim glow and terminal typewriter fx.',
      caption: 'WHY 99% FAIL IN 2026',
      captionClass: 'caption-cyber',
      format: '9:16 Reels',
      retention: '94% Retention',
      score: '94/100',
      estViews: '180k+ Avg.',
      style: 'Cyberpunk Neon',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD37ewpMGyiPTtZ1ZbzIadhB5Fi0jvQq_nVyPA-KshGpmmpnekLXex5lOPfknsQlHOYEF3xbcgjQdpPLQnncMco-banHYbNnIqdNUxhqyeYqhELc6vDDIjzlScgFHnkhjyM2_XHXuJ259qcl5aelPGo5YZNDnQm-G7b0eVbHGR9wEhQ7TVQ8CLFAocbV5n3cfKI5d49YGnqAqzMFuQ5lNnXAzy497QF-oj1XwK6zis'
    },
    {
      id: 'stopdoing',
      title: 'Episode_42_Cut_03',
      templateName: 'Editorial Minimal Glass',
      categories: ['finance', 'story'],
      badge: 'Editorial',
      desc: 'Soft frosted glass pills with understated typography for luxury, design, and essay creators.',
      caption: 'STOP DOING THIS TODAY',
      captionClass: 'caption-minimal',
      format: '9:16 Shorts',
      retention: '91% Retention',
      score: '91/100',
      estViews: '140k+ Avg.',
      style: 'Minimal Clean',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcMK94faVsZqA3b952zMYH5UMZcRJUEApyQl99GKLIUiNVwkrZsUWkFcIOjc2d6sPtkHSkHZHj3Mp8SNn2K2Hm3OYlZQ3WuXrCvT4x_VzjG5DDaBLkeqsRlAkR3XH1jT8zvTQXqQoikfLxdoGq640ZY5sKWS3pL-2ATSj8fRZks3EJsu7lWEkblB44coOw7Z7UyqUJ--D2mMdJgl4Wid3_7px59sofKio-nv9IknI'
    },
    {
      id: 'tenmil',
      title: 'Episode_42_Cut_05',
      templateName: 'Dual Host Split Stack',
      categories: ['podcast', 'finance'],
      badge: 'Duo Stack',
      desc: 'Upper frame host, lower frame guest with auto audio-reactive focus switching.',
      caption: 'HOW THEY MADE $10M',
      captionClass: 'caption-hormozi',
      format: '9:16 Split',
      retention: '89% Retention',
      score: '89/100',
      estViews: '210k+ Avg.',
      style: 'Hormozi Bold',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXgBy7_PcICd2Hfy6K8PFrm3OPreyFVlSfZdJx6AYrRNaLBbtf-MjgVdTaJ_DWjo_WKatFAi9DYEctUOCth2tIugKoXelJduQtGPKvlAXak_ymRpwFdpmCmDZWugY2CwhSqopPTzvYuzR85GKN2OV-RghiCR0HTilYxJEn_F7WuXYYbHkpzrTN3IU7lOqCfy1RiyXlwo5-2yKvyIyjgTIV5qC58c2CKsE2A7CwIz8'
    },
    {
      id: 'automation',
      title: 'Episode_42_Cut_06',
      templateName: 'AI Automation Fast Loop',
      categories: ['tech', 'story'],
      badge: 'Quick Cut',
      desc: 'High-velocity 15-second rhythm with quick B-roll inserts for coding tutorials and tool reviews.',
      caption: 'AI AUTOMATION LOOP',
      captionClass: 'caption-cyber',
      format: '9:16 TikTok',
      retention: '87% Retention',
      score: '87/100',
      estViews: '95k+ Avg.',
      style: 'Cyberpunk Neon',
      videoUrl: '/generated_shorts/viral_blueprint_master.mp4',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQhDYed36XU2nxQ-407cYqK5B0iZZflxmUuAojgNXyhbp7Ucv99X9MhidcW_LjiVT9SgB_wSx3AUA1yRnzk4aFcitDUw3kaqlpRXbUmDaHSPK_wOxpfnV6Fqletso7wGBgCBQeSzJqPDTVKPS45fdWn9mososfyH9rZ7O9P7P5yvIaQhOg6YDvLMpXFSm9W3FW5zUDSakMGGmfzZbwvY_qjrUZao0-AxbOC37FK3s'
    }
  ];

  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory = activeCategory === 'all' || tpl.categories.includes(activeCategory);
    const matchesSearch =
      tpl.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.caption.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-28 space-y-8">
      {/* HEADER INTRO */}
      <div className="flex flex-col space-y-2 text-center items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-tertiary text-xs font-mono border border-surface-container-highest">
          <span className="material-symbols-outlined text-[14px]">dashboard_customize</span>
          <span>Curated Viral Video Presets</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Viral Shorts Templates Library
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg">
          Pre-configured animation styles, typography combinations, sound stings, and active speaker layout presets inspired by the top 0.1% creators.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container-highest">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {[
            { id: 'all', label: 'All Templates (6)' },
            { id: 'podcast', label: 'Podcasts' },
            { id: 'tech', label: 'Tech & Coding' },
            { id: 'finance', label: 'Finance & Hustle' },
            { id: 'story', label: 'Storytelling' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                addToast(`Filtered: ${cat.label}`, 'info');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeCategory === cat.id ? 'bg-primary-container text-white font-semibold' : 'bg-surface-container text-outline hover:text-white'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <span className="material-symbols-outlined text-[16px] text-outline absolute left-2.5 top-2.5">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-surface-container-lowest text-xs font-mono pl-8 pr-3 py-2 rounded-lg border border-surface-container focus:outline-none focus:border-primary text-white"
          />
        </div>
      </div>

      {/* TEMPLATES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="p-3 rounded-2xl bg-surface-container-low border border-surface-container-highest shadow-xl flex flex-col justify-between space-y-3 group hover:border-primary/50 transition-all"
          >
            {/* Thumbnail */}
            <div
              onClick={() => openVideo(tpl)}
              className="relative w-full aspect-[9/13] rounded-xl overflow-hidden bg-black cursor-pointer"
            >
              <img
                src={tpl.image}
                alt={tpl.templateName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-tertiary">
                {tpl.badge}
              </div>

              <div className="absolute bottom-3 left-2 right-2 text-center">
                <span className={`${tpl.captionClass} text-xs inline-block`}>
                  "{tpl.caption}"
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">{tpl.templateName}</h3>
              <p className="text-xs text-outline leading-relaxed">{tpl.desc}</p>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant pt-1 border-t border-surface-container-highest">
              <span>{tpl.format}</span>
              <span className="text-tertiary">{tpl.retention}</span>
            </div>

            {/* Action */}
            <button
              onClick={() => loadClipToStudio(tpl)}
              className="w-full h-9 rounded-lg bg-surface-container-high hover:bg-primary-container hover:text-white text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Use in Studio</span>
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
