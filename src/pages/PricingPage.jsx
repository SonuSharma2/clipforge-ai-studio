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
      <div className="flex flex-col space-y-3 text-center items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
          <span className="material-symbols-outlined text-[15px]">payments</span>
          <span>Transparent Cloud Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Start Free. Upgrade As You Go Viral.
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
          No surprise overage fees. Unlimited cloud renders on all tiers. Switch plans or cancel anytime with 1-click.
        </p>

        {/* Monthly / Annual Switcher */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <span className={`text-xs font-sans transition-colors ${!isAnnual ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => {
              setIsAnnual(!isAnnual);
              addToast(isAnnual ? 'Switched to Monthly billing' : 'Switched to Annual billing (25% off!)', 'info');
            }}
            className="w-12 h-6 rounded-full bg-slate-200 p-0.5 transition-colors relative flex items-center"
          >
            <div
              className={`w-5 h-5 rounded-full bg-indigo-600 shadow-sm transition-transform duration-200 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}
            ></div>
          </button>
          <span className={`text-xs font-sans flex items-center gap-1.5 transition-colors ${isAnnual ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
            Annual <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">SAVE 25%</span>
          </span>
        </div>
      </div>

      {/* 3 TIERS STACK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter Tier */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-5 shadow-sm hover:shadow-md transition-all">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Starter</h3>
                <p className="text-xs text-slate-500 mt-0.5">For new creators exploring AI shorts</p>
              </div>
              <span className="text-3xl font-extrabold text-slate-900 font-sans">$0</span>
            </div>

            <div className="h-[1px] bg-slate-100 my-4"></div>

            <ul className="flex flex-col gap-3 text-xs text-slate-600">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-emerald-600">check</span> 60 Processing Minutes / mo</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-emerald-600">check</span> 720p HD Exports</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-emerald-600">check</span> Standard Kinetic Captions</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-emerald-600">check</span> 1 Concurrent Render</li>
              <li className="flex items-center gap-2 text-slate-400"><span className="material-symbols-outlined text-[16px]">close</span> ClipForge Watermark</li>
            </ul>
          </div>

          <button
            onClick={() => setCurrentPage('clip')}
            className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center border border-slate-200"
          >
            Get Started Free
          </button>
        </div>

        {/* Creator Pro (Most Popular) */}
        <div className="relative p-6 sm:p-7 rounded-2xl bg-white border-2 border-indigo-600 flex flex-col justify-between space-y-5 shadow-xl ring-4 ring-indigo-50">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-indigo-600 text-white font-sans text-[11px] font-bold tracking-wider uppercase shadow-md">
            Most Popular
          </div>

          <div>
            <div className="flex justify-between items-start pt-1">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Creator Pro</h3>
                <p className="text-xs text-slate-500 mt-0.5">For consistent multi-platform uploaders</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-slate-900 font-sans">
                  ${isAnnual ? '14' : '19'}
                </span>
                <span className="text-[11px] text-slate-500 block">/ month</span>
              </div>
            </div>

            <div className="h-[1px] bg-slate-100 my-4"></div>

            <ul className="flex flex-col gap-3 text-xs text-slate-700">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-indigo-600">check</span> 300 Processing Minutes / mo</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-indigo-600">check</span> 1080p 60FPS Ultra HD Exports</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-indigo-600">check</span> All Kinetic Caption Presets</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-indigo-600">check</span> Active Face Tracking 9:16 Reframe</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-indigo-600">check</span> No Watermark</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-indigo-600">check</span> 3 Concurrent Renders</li>
            </ul>
          </div>

          <button
            onClick={() => openCheckout('Creator Pro', 19)}
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Upgrade to Pro</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Studio Scale */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-5 shadow-sm hover:shadow-md transition-all">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Studio Scale</h3>
                <p className="text-xs text-slate-500 mt-0.5">For agencies, media teams & networks</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-slate-900 font-sans">
                  ${isAnnual ? '37' : '49'}
                </span>
                <span className="text-[11px] text-slate-500 block">/ month</span>
              </div>
            </div>

            <div className="h-[1px] bg-slate-100 my-4"></div>

            <ul className="flex flex-col gap-3 text-xs text-slate-600">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-emerald-600">check</span> Unlimited GPU Processing</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-emerald-600">check</span> 4K Ultra-HD Export Stream</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-emerald-600">check</span> Custom Brand Typography & Colors</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-emerald-600">check</span> Direct Auto-Posting to TikTok / Shorts</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-emerald-600">check</span> Dedicated Priority GPU Node</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-emerald-600">check</span> Multi-user Workspace Access</li>
            </ul>
          </div>

          <button
            onClick={() => openCheckout('Studio Scale', 49)}
            className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center border border-slate-200"
          >
            Get Studio Scale
          </button>
        </div>
      </div>

      {/* INTERACTIVE ROI & SAVINGS CALCULATOR */}
      <section className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">ROI Calculator</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">How Much Time & Money Will You Save?</h2>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600">Shorts Produced Per Week:</span>
              <span className="text-indigo-600 font-bold text-sm font-mono">{weeklyShorts} Shorts / Week</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={weeklyShorts}
              onChange={(e) => setWeeklyShorts(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 font-mono">{roi.hours} hrs</span>
              <span className="text-xs font-semibold text-slate-800 mt-1">Editing Hours Saved</span>
              <span className="text-[11px] text-slate-500">Per month</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">${roi.dollars}</span>
              <span className="text-xs font-semibold text-slate-800 mt-1">Saved on Freelance Editors</span>
              <span className="text-[11px] text-slate-500">Per month</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">{roi.views}</span>
              <span className="text-xs font-semibold text-slate-800 mt-1">Estimated Monthly Reach</span>
              <span className="text-[11px] text-indigo-600 font-bold">+450% Average Lift</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE COMPARISON TABLE */}
      <section className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 overflow-x-auto">
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Detailed Feature Matrix</h2>
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-3 text-slate-900 font-bold">Feature</th>
              <th className="pb-3 text-center">Starter ($0)</th>
              <th className="pb-3 text-center text-indigo-600 font-bold">Creator Pro (${isAnnual ? '14' : '19'})</th>
              <th className="pb-3 text-center text-slate-900 font-bold">Studio Scale (${isAnnual ? '37' : '49'})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            <tr>
              <td className="py-3.5 font-medium text-slate-900">Monthly Processing Minutes</td>
              <td className="py-3.5 text-center">60 Mins</td>
              <td className="py-3.5 text-center text-indigo-600 font-semibold">300 Mins</td>
              <td className="py-3.5 text-center text-slate-900 font-semibold">Unlimited</td>
            </tr>
            <tr>
              <td className="py-3.5 font-medium text-slate-900">Export Resolution</td>
              <td className="py-3.5 text-center">720p</td>
              <td className="py-3.5 text-center text-indigo-600 font-semibold">1080p 60fps</td>
              <td className="py-3.5 text-center text-slate-900 font-semibold">4K Ultra-HD</td>
            </tr>
            <tr>
              <td className="py-3.5 font-medium text-slate-900">Active Speaker Neural Tracking</td>
              <td className="py-3.5 text-center text-slate-400">Basic</td>
              <td className="py-3.5 text-center text-indigo-600 font-semibold">✓ Advanced Dual-Host</td>
              <td className="py-3.5 text-center text-slate-900 font-semibold">✓ Custom Keyframes</td>
            </tr>
            <tr>
              <td className="py-3.5 font-medium text-slate-900">Kinetic Subtitle Styles</td>
              <td className="py-3.5 text-center">1 Style</td>
              <td className="py-3.5 text-center text-indigo-600 font-semibold">All 4 Presets</td>
              <td className="py-3.5 text-center text-slate-900 font-semibold">Unlimited Custom</td>
            </tr>
            <tr>
              <td className="py-3.5 font-medium text-slate-900">Watermark Free</td>
              <td className="py-3.5 text-center text-slate-400">No</td>
              <td className="py-3.5 text-center text-indigo-600 font-semibold">✓ Yes</td>
              <td className="py-3.5 text-center text-slate-900 font-semibold">✓ Yes</td>
            </tr>
            <tr>
              <td className="py-3.5 font-medium text-slate-900">Direct Social Media Auto-Post</td>
              <td className="py-3.5 text-center text-slate-400">No</td>
              <td className="py-3.5 text-center text-slate-400">No</td>
              <td className="py-3.5 text-center text-slate-900 font-semibold">✓ Full Schedule Suite</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* FAQ ACCORDION */}
      <section className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Frequently Asked Questions</h2>
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
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                <span>{item.q}</span>
                <span className="material-symbols-outlined text-[18px] text-indigo-600 transition-transform duration-200" style={{ transform: activeFaq === idx ? 'rotate(180deg)' : 'none' }}>
                  expand_more
                </span>
              </div>
              {activeFaq === idx && (
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CHECKOUT MODAL */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600 text-[22px]">shopping_cart_checkout</span>
                <h3 className="font-bold text-base text-slate-900">Complete Upgrade</h3>
              </div>
              <button
                onClick={() => setCheckoutPlan(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 block">{checkoutPlan.name} Plan</span>
                <span className="text-[11px] text-slate-500 font-medium">Billed {isAnnual ? 'Annually' : 'Monthly'}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-indigo-600 font-mono">
                  ${Math.max(0, checkoutPlan.price - discount)}
                </span>
                <span className="text-[11px] text-slate-500 block">/ mo</span>
              </div>
            </div>

            {/* Coupon Code input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Promo Code (Try: VIRAL2026)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 uppercase"
                />
                <button
                  onClick={applyCoupon}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Simulated Payment */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700">Card Information</label>
              <input
                type="text"
                readOnly
                value="•••• •••• •••• 4242 (Test Card)"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800"
              />
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <input type="text" readOnly value="12 / 28" className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800" />
                <input type="text" readOnly value="CVC: 888" className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800" />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                disabled={isCheckingOut}
                onClick={() => setCheckoutPlan(null)}
                className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
              >
                Cancel
              </button>
              <button
                disabled={isCheckingOut}
                onClick={handleCompleteCheckout}
                className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
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
