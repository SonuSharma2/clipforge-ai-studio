import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function PricingPage() {
  const { setCurrentPage, addToast } = useApp();

  const [isAnnual, setIsAnnual] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // ROI Calculator
  const [weeklyShorts, setWeeklyShorts] = useState(7);

  // Checkout modal
  const [checkoutPlan, setCheckoutPlan] = useState(null); // { name, price }
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const calculateRoi = (count) => {
    const hours = count * 3.5;
    const dollars = count * 75;
    const views = `${count * 45}K+`;
    return { hours, dollars, views };
  };

  const roi = calculateRoi(weeklyShorts);

  const openCheckout = (name, monthlyPrice) => {
    const finalPrice = isAnnual ? Math.round(monthlyPrice * 0.75) : monthlyPrice;
    setCheckoutPlan({ name, price: finalPrice });
    setDiscount(0);
    setCoupon('');
  };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'VIRAL2026') {
      setDiscount(10);
      addToast('Coupon "VIRAL2026" applied! $10 discount.', 'success');
    } else {
      addToast('Invalid coupon code. Try "VIRAL2026"', 'error');
    }
  };

  const handleCompleteCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      const planName = checkoutPlan?.name;
      setCheckoutPlan(null);
      addToast(`🎉 Welcome to ClipForge ${planName}! Unlimited GPU enabled.`, 'success');
    }, 1200);
  };

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-28 space-y-12">
      {/* PRICING HEADER */}
      <div className="flex flex-col space-y-2 text-center items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-mono border border-surface-container-highest">
          <span className="material-symbols-outlined text-[14px]">payments</span>
          <span>Transparent Cloud Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Start Free. Upgrade As You Go Viral.
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg leading-relaxed">
          No surprise overage fees. Unlimited cloud renders on all tiers. Switch plans or cancel anytime with 1-click.
        </p>

        {/* Monthly / Annual Switcher */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <span className={`text-xs font-mono transition-colors ${!isAnnual ? 'text-white font-semibold' : 'text-outline'}`}>
            Monthly
          </span>
          <button
            onClick={() => {
              setIsAnnual(!isAnnual);
              addToast(isAnnual ? 'Switched to Monthly billing' : 'Switched to Annual billing (25% off!)', 'info');
            }}
            className="w-12 h-6 rounded-full bg-surface-container-highest p-0.5 transition-colors relative flex items-center"
          >
            <div
              className={`w-5 h-5 rounded-full bg-primary transition-transform duration-200 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}
            ></div>
          </button>
          <span className={`text-xs font-mono flex items-center gap-1.5 transition-colors ${isAnnual ? 'text-white font-semibold' : 'text-outline'}`}>
            Annual <span className="px-1.5 py-0.5 rounded bg-tertiary/20 text-tertiary text-[10px] font-bold">SAVE 25%</span>
          </span>
        </div>
      </div>

      {/* 3 TIERS STACK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Starter Tier */}
        <div className="p-6 rounded-2xl bg-surface-container border border-surface-container-highest flex flex-col justify-between space-y-4 shadow-md">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Starter</h3>
                <p className="text-xs text-on-surface-variant">For new creators exploring AI shorts</p>
              </div>
              <span className="text-3xl font-bold text-white font-mono">$0</span>
            </div>

            <div className="h-[1px] bg-surface-container-highest my-4"></div>

            <ul className="flex flex-col gap-3 text-xs text-on-surface-variant">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary">check</span> 60 Processing Minutes / mo</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary">check</span> 720p HD Exports</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary">check</span> Standard Kinetic Captions</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary">check</span> 1 Concurrent Render</li>
              <li className="flex items-center gap-2 text-outline"><span className="material-symbols-outlined text-[16px] text-outline">close</span> ClipForge Watermark</li>
            </ul>
          </div>

          <button
            onClick={() => setCurrentPage('clip')}
            className="w-full h-11 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-mono font-semibold transition-colors flex items-center justify-center"
          >
            Get Started Free
          </button>
        </div>

        {/* Creator Pro (Most Popular) */}
        <div className="relative p-6 rounded-2xl bg-surface-container-low border-2 border-primary-container flex flex-col justify-between space-y-4 shadow-2xl">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-primary-container to-secondary-container text-white font-mono text-[10px] font-bold tracking-wider uppercase shadow-lg">
            Most Popular
          </div>

          <div>
            <div className="flex justify-between items-start pt-1">
              <div>
                <h3 className="text-lg font-bold text-white">Creator Pro</h3>
                <p className="text-xs text-on-surface-variant">For consistent multi-platform uploaders</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-white font-mono">
                  ${isAnnual ? '14' : '19'}
                </span>
                <span className="text-[10px] text-outline block">/ month</span>
              </div>
            </div>

            <div className="h-[1px] bg-surface-container-highest my-4"></div>

            <ul className="flex flex-col gap-3 text-xs text-on-surface-variant">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">check</span> 300 Processing Minutes / mo</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">check</span> 1080p 60FPS Ultra HD Exports</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">check</span> All Kinetic Caption Presets</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Active Face Tracking 9:16 Reframe</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">check</span> No Watermark</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">check</span> 3 Concurrent Renders</li>
            </ul>
          </div>

          <button
            onClick={() => openCheckout('Creator Pro', 19)}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-primary-container via-secondary-container to-tertiary text-white text-xs font-mono font-bold shadow-[0_0_16px_rgba(128,131,255,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Upgrade to Pro</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Studio Scale */}
        <div className="p-6 rounded-2xl bg-surface-container border border-surface-container-highest flex flex-col justify-between space-y-4 shadow-md">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Studio Scale</h3>
                <p className="text-xs text-on-surface-variant">For agencies, media teams & networks</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-white font-mono">
                  ${isAnnual ? '37' : '49'}
                </span>
                <span className="text-[10px] text-outline block">/ month</span>
              </div>
            </div>

            <div className="h-[1px] bg-surface-container-highest my-4"></div>

            <ul className="flex flex-col gap-3 text-xs text-on-surface-variant">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary">check</span> Unlimited GPU Processing</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary">check</span> 4K Ultra-HD Export Stream</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary">check</span> Custom Brand Typography & Colors</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary">check</span> Direct Auto-Posting to TikTok / Shorts</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary">check</span> Dedicated Priority GPU Node</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary">check</span> Multi-user Workspace Access</li>
            </ul>
          </div>

          <button
            onClick={() => openCheckout('Studio Scale', 49)}
            className="w-full h-11 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-mono font-semibold transition-colors flex items-center justify-center"
          >
            Get Studio Scale
          </button>
        </div>
      </div>

      {/* INTERACTIVE ROI & SAVINGS CALCULATOR */}
      <section className="rounded-2xl bg-surface-container-low border border-surface-container-highest p-5 sm:p-6 shadow-xl space-y-5">
        <div className="border-b border-surface-container-highest pb-4">
          <span className="text-xs font-mono text-tertiary uppercase tracking-widest">ROI Calculator</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">How Much Time & Money Will You Save?</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-outline">Shorts Produced Per Week:</span>
              <span className="text-tertiary font-bold text-sm">{weeklyShorts} Shorts / Week</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={weeklyShorts}
              onChange={(e) => setWeeklyShorts(Number(e.target.value))}
              className="w-full accent-tertiary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-highest flex flex-col items-center text-center">
              <span className="text-3xl font-bold text-primary font-mono">{roi.hours} hrs</span>
              <span className="text-xs text-white mt-1">Editing Hours Saved</span>
              <span className="text-[10px] text-outline">Per month</span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-highest flex flex-col items-center text-center">
              <span className="text-3xl font-bold text-tertiary font-mono">${roi.dollars}</span>
              <span className="text-xs text-white mt-1">Saved on Freelance Editors</span>
              <span className="text-[10px] text-outline">Per month</span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-highest flex flex-col items-center text-center">
              <span className="text-3xl font-bold text-white font-mono">{roi.views}</span>
              <span className="text-xs text-white mt-1">Estimated Monthly Reach</span>
              <span className="text-[10px] text-tertiary">+450% Average Lift</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE COMPARISON TABLE */}
      <section className="rounded-2xl bg-surface-container-low border border-surface-container-highest p-5 sm:p-6 shadow-xl space-y-4 overflow-x-auto">
        <h2 className="text-xl font-bold text-white mb-2">Detailed Feature Matrix</h2>
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-surface-container-highest text-outline">
              <th className="pb-3 text-on-surface">Feature</th>
              <th className="pb-3 text-center">Starter ($0)</th>
              <th className="pb-3 text-center text-primary">Creator Pro (${isAnnual ? '14' : '19'})</th>
              <th className="pb-3 text-center text-tertiary">Studio Scale (${isAnnual ? '37' : '49'})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest text-on-surface-variant">
            <tr>
              <td className="py-3 text-white">Monthly Processing Minutes</td>
              <td className="py-3 text-center">60 Mins</td>
              <td className="py-3 text-center text-primary">300 Mins</td>
              <td className="py-3 text-center text-tertiary">Unlimited</td>
            </tr>
            <tr>
              <td className="py-3 text-white">Export Resolution</td>
              <td className="py-3 text-center">720p</td>
              <td className="py-3 text-center text-primary">1080p 60fps</td>
              <td className="py-3 text-center text-tertiary">4K Ultra-HD</td>
            </tr>
            <tr>
              <td className="py-3 text-white">Active Speaker Neural Tracking</td>
              <td className="py-3 text-center text-outline">Basic</td>
              <td className="py-3 text-center text-primary">✓ Advanced Dual-Host</td>
              <td className="py-3 text-center text-tertiary">✓ Custom Keyframes</td>
            </tr>
            <tr>
              <td className="py-3 text-white">Kinetic Subtitle Styles</td>
              <td className="py-3 text-center">1 Style</td>
              <td className="py-3 text-center text-primary">All 4 Presets</td>
              <td className="py-3 text-center text-tertiary">Unlimited Custom</td>
            </tr>
            <tr>
              <td className="py-3 text-white">Watermark Free</td>
              <td className="py-3 text-center text-outline">No</td>
              <td className="py-3 text-center text-primary">✓ Yes</td>
              <td className="py-3 text-center text-tertiary">✓ Yes</td>
            </tr>
            <tr>
              <td className="py-3 text-white">Direct Social Media Auto-Post</td>
              <td className="py-3 text-center text-outline">No</td>
              <td className="py-3 text-center text-outline">No</td>
              <td className="py-3 text-center text-tertiary">✓ Full Schedule Suite</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* FAQ ACCORDION */}
      <section className="rounded-2xl bg-surface-container-low border border-surface-container-highest p-5 sm:p-6 shadow-xl space-y-4">
        <h2 className="text-xl font-bold text-white mb-2">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            {
              q: 'Can I cancel or upgrade anytime?',
              a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time with one click in your account settings. No hidden cancellation penalties.'
            },
            {
              q: 'Do you offer refunds if it doesn’t work for my content?',
              a: 'We offer a 14-day 100% money-back guarantee on all paid plans if you are not completely thrilled with the quality of clips generated.'
            },
            {
              q: 'How does the AI choose viral hooks?',
              a: 'Our models are trained on over 500,000 top-performing shorts across TikTok, YouTube, and Reels. It evaluates sentiment, vocal inflections, key curiosity triggers, and pacing transitions.'
            },
            {
              q: 'Are the exported MP4 videos 100% real and downloadable?',
              a: 'Yes! ClipForge produces high-bitrate, hardware-accelerated MP4 vertical videos (1080x1920) formatted specifically for direct upload to YouTube Shorts, TikTok, and Instagram Reels.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-surface-container border border-surface-container-highest cursor-pointer transition-colors"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between text-sm font-semibold text-white">
                <span>{item.q}</span>
                <span className="material-symbols-outlined text-[18px] text-tertiary transition-transform duration-200" style={{ transform: activeFaq === idx ? 'rotate(180deg)' : 'none' }}>
                  expand_more
                </span>
              </div>
              {activeFaq === idx && (
                <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CHECKOUT MODAL */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface-container border border-surface-container-highest shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">shopping_cart_checkout</span>
                <h3 className="font-bold text-base text-white">Complete Upgrade</h3>
              </div>
              <button
                onClick={() => setCheckoutPlan(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">{checkoutPlan.name} Plan</span>
                <span className="text-[11px] text-outline font-mono">Billed {isAnnual ? 'Annually' : 'Monthly'}</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-xl font-bold text-tertiary">
                  ${Math.max(0, checkoutPlan.price - discount)}
                </span>
                <span className="text-[10px] text-outline block">/ mo</span>
              </div>
            </div>

            {/* Coupon Code input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-outline">Promo Code (Try: VIRAL2026)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon..."
                  className="flex-1 p-2 rounded-lg bg-surface-container-lowest border border-surface-container text-xs font-mono text-white focus:outline-none uppercase"
                />
                <button
                  onClick={applyCoupon}
                  className="px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-white transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Simulated Payment */}
            <div className="space-y-2 pt-2 border-t border-surface-container-highest">
              <label className="text-xs font-mono text-outline">Card Information</label>
              <input
                type="text"
                readOnly
                value="•••• •••• •••• 4242 (Test Card)"
                className="w-full p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container text-xs font-mono text-white"
              />
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <input type="text" readOnly value="12 / 28" className="p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container text-white" />
                <input type="text" readOnly value="CVC: 888" className="p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container text-white" />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                disabled={isCheckingOut}
                onClick={() => setCheckoutPlan(null)}
                className="flex-1 h-11 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-on-surface transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isCheckingOut}
                onClick={handleCompleteCheckout}
                className="flex-1 h-11 rounded-lg bg-gradient-to-r from-primary-container via-secondary-container to-tertiary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                {isCheckingOut ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>Confirm Upgrade</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
