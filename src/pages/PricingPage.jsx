import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import InvoiceModal from '../components/InvoiceModal';

export default function PricingPage() {
  const { setCurrentPage, addToast, user, updateUser, navigateToAuth } = useApp();

  const [isAnnual, setIsAnnual] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // ROI Calculator
  const [weeklyShorts, setWeeklyShorts] = useState(7);

  // Stripe Checkout modal state
  const [checkoutPlan, setCheckoutPlan] = useState(null); // { name, price, monthlyBase }
  const [checkoutMode, setCheckoutMode] = useState('card'); // 'card' or 'hosted'
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Card Form State & Validation
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardPostal, setCardPostal] = useState('10001');
  const [cardholderName, setCardholderName] = useState(user?.name || 'Sonu Sharma');
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Success Celebration Modal
  const [successPlan, setSuccessPlan] = useState(null);

  // Billing History Modal
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loadingBilling, setLoadingBilling] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Check URL parameters for Stripe redirect return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const isSuccess = urlParams.get('success');
    const planFromUrl = urlParams.get('plan') || 'Creator Pro';

    if (sessionId && isSuccess) {
      const email = user?.email || 'creator@clipforge.ai';
      fetch('http://127.0.0.1:8888/api/stripe/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          email: email,
          plan: planFromUrl,
          interval: 'month'
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          updateUser(data.user);
          setSuccessPlan(data.plan || planFromUrl);
          addToast(`🎉 Stripe Checkout verified! You are on ${data.plan}!`, 'success');
        }
      })
      .catch(err => console.warn('Stripe verify err:', err));
    }
  }, [user]);

  const calculateRoi = (count) => {
    const hours = count * 3.5;
    const dollars = count * 75;
    const views = `${count * 45}K+`;
    return { hours, dollars, views };
  };

  const roi = calculateRoi(weeklyShorts);

  const openCheckout = (name, monthlyPrice) => {
    if (!user) {
      addToast('Please sign in or create an account to upgrade', 'info');
      navigateToAuth('signup');
      return;
    }
    const finalPrice = isAnnual ? Math.round(monthlyPrice * 0.75) : monthlyPrice;
    setCheckoutPlan({ name, price: finalPrice, monthlyBase: monthlyPrice });
    setDiscount(0);
    setCoupon('');
    setCardNumber('4242 4242 4242 4242');
    setCardExp('12/28');
    setCardCvc('888');
    setCardPostal('10001');
    setCardholderName(user?.name || 'Sonu Sharma');
    setFormErrors({});
    setTouchedFields({});
  };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'VIRAL2026') {
      setDiscount(10);
      addToast('Coupon "VIRAL2026" applied! $10 discount.', 'success');
    } else {
      addToast('Invalid coupon code. Try "VIRAL2026"', 'error');
    }
  };

  // Luhn algorithm (Mod 10) for real-time card validation
  const validateLuhn = (numStr) => {
    const digits = (numStr || '').replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  // Card brand detection helper
  const getCardBrand = (num) => {
    const clean = (num || '').replace(/\D/g, '');
    if (clean.startsWith('4')) return { brand: 'VISA', color: 'bg-blue-600 text-white', isAmex: false };
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return { brand: 'MC', color: 'bg-amber-600 text-white', isAmex: false };
    if (/^3[47]/.test(clean)) return { brand: 'AMEX', color: 'bg-cyan-700 text-white', isAmex: true };
    if (/^6(011|5)/.test(clean)) return { brand: 'DISCOVER', color: 'bg-orange-600 text-white', isAmex: false };
    return { brand: 'CARD', color: 'bg-slate-700 text-white', isAmex: false };
  };

  // Format Card Number (adds space every 4 digits, or 4-6-5 for Amex)
  const formatCardNumber = (value) => {
    const digits = (value || '').replace(/\D/g, '');
    const isAmex = digits.startsWith('34') || digits.startsWith('37');
    if (isAmex) {
      const trimmed = digits.slice(0, 15);
      const parts = [];
      if (trimmed.length > 0) parts.push(trimmed.slice(0, 4));
      if (trimmed.length > 4) parts.push(trimmed.slice(4, 10));
      if (trimmed.length > 10) parts.push(trimmed.slice(10, 15));
      return parts.join(' ');
    } else {
      const trimmed = digits.slice(0, 16);
      const match = trimmed.match(/.{1,4}/g);
      return match ? match.join(' ') : '';
    }
  };

  // Format Expiration Date MM/YY
  const formatExpiry = (value) => {
    const digits = (value || '').replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  // Validate individual field
  const validateField = (fieldName, value, currentCardNum = cardNumber) => {
    let error = '';
    const cleanNum = (currentCardNum || '').replace(/\D/g, '');
    const isAmex = cleanNum.startsWith('34') || cleanNum.startsWith('37');

    if (fieldName === 'cardholderName') {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        error = 'Cardholder name is required';
      } else if (trimmed.length < 3) {
        error = 'Please enter your full name (minimum 3 letters)';
      }
    } else if (fieldName === 'cardNumber') {
      const digits = (value || '').replace(/\D/g, '');
      const amex = digits.startsWith('34') || digits.startsWith('37');
      if (!digits) {
        error = 'Card number is required';
      } else if (amex && digits.length < 15) {
        error = `American Express requires 15 digits (entered ${digits.length})`;
      } else if (!amex && digits.length < 16) {
        error = `Card number must be 16 digits (entered ${digits.length})`;
      } else if (!validateLuhn(digits)) {
        error = 'Invalid card number (Luhn checksum failed)';
      }
    } else if (fieldName === 'cardExp') {
      const clean = (value || '').replace(/\D/g, '');
      if (!clean) {
        error = 'Expiration date is required';
      } else if (clean.length < 4) {
        error = 'Incomplete expiry date (use MM/YY)';
      } else {
        const month = parseInt(clean.slice(0, 2), 10);
        const year = 2000 + parseInt(clean.slice(2, 4), 10);
        if (month < 1 || month > 12) {
          error = 'Month must be between 01 and 12';
        } else if (year < 2026 || (year === 2026 && month < 9)) {
          error = 'This card is expired. Please enter a valid date.';
        } else if (year > 2060) {
          error = 'Invalid expiration year';
        }
      }
    } else if (fieldName === 'cardCvc') {
      const digits = (value || '').replace(/\D/g, '');
      const reqLen = isAmex ? 4 : 3;
      if (!digits) {
        error = 'CVC is required';
      } else if (digits.length !== reqLen) {
        error = `CVC must be ${reqLen} digits for ${isAmex ? 'Amex' : 'this card'}`;
      }
    } else if (fieldName === 'cardPostal') {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        error = 'Postal code is required';
      } else if (trimmed.length < 3) {
        error = 'Postal / ZIP code is too short';
      }
    }
    return error;
  };

  // Live input handlers
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    const err = validateField('cardNumber', formatted);
    const cvcErr = validateField('cardCvc', cardCvc, formatted);
    setFormErrors(prev => ({ ...prev, cardNumber: err, cardCvc: cvcErr }));
  };

  const handleCardExpChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setCardExp(formatted);
    const err = validateField('cardExp', formatted);
    setFormErrors(prev => ({ ...prev, cardExp: err }));
  };

  const handleCardCvcChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(digits);
    const err = validateField('cardCvc', digits, cardNumber);
    setFormErrors(prev => ({ ...prev, cardCvc: err }));
  };

  const handleCardholderNameChange = (e) => {
    const val = e.target.value;
    setCardholderName(val);
    const err = validateField('cardholderName', val);
    setFormErrors(prev => ({ ...prev, cardholderName: err }));
  };

  const handleCardPostalChange = (e) => {
    const val = e.target.value;
    setCardPostal(val);
    const err = validateField('cardPostal', val);
    setFormErrors(prev => ({ ...prev, cardPostal: err }));
  };

  const handleBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    let val = '';
    if (field === 'cardNumber') val = cardNumber;
    if (field === 'cardExp') val = cardExp;
    if (field === 'cardCvc') val = cardCvc;
    if (field === 'cardholderName') val = cardholderName;
    if (field === 'cardPostal') val = cardPostal;
    const err = validateField(field, val, cardNumber);
    setFormErrors(prev => ({ ...prev, [field]: err }));
  };

  // Test Presets for Instant QA
  const applyPreset = (preset) => {
    if (preset === 'valid_visa') {
      const num = '4242 4242 4242 4242';
      const exp = '12/28';
      const cvc = '888';
      const zip = '10001';
      const name = user?.name || 'Sonu Sharma';
      setCardNumber(num);
      setCardExp(exp);
      setCardCvc(cvc);
      setCardPostal(zip);
      setCardholderName(name);
      setTouchedFields({ cardNumber: true, cardExp: true, cardCvc: true, cardPostal: true, cardholderName: true });
      setFormErrors({});
      addToast('Loaded: Valid Stripe Visa Test Card (4242)', 'info');
    } else if (preset === 'valid_amex') {
      const num = '3700 000000 00002';
      const exp = '10/29';
      const cvc = '8888';
      const zip = '90210';
      const name = user?.name || 'Sonu Sharma';
      setCardNumber(num);
      setCardExp(exp);
      setCardCvc(cvc);
      setCardPostal(zip);
      setCardholderName(name);
      setTouchedFields({ cardNumber: true, cardExp: true, cardCvc: true, cardPostal: true, cardholderName: true });
      setFormErrors({});
      addToast('Loaded: Valid American Express Card (3700)', 'info');
    } else if (preset === 'invalid_num') {
      const num = '4242 4242 4242 4243';
      setCardNumber(num);
      setTouchedFields(prev => ({ ...prev, cardNumber: true }));
      setFormErrors(prev => ({ ...prev, cardNumber: 'Invalid card number (Luhn checksum failed)' }));
      addToast('Loaded: Invalid Card Number (Checksum fails)', 'error');
    } else if (preset === 'expired') {
      const exp = '04/24';
      setCardExp(exp);
      setTouchedFields(prev => ({ ...prev, cardExp: true }));
      setFormErrors(prev => ({ ...prev, cardExp: 'This card is expired. Please enter a valid date.' }));
      addToast('Loaded: Expired Expiration Date (04/24)', 'error');
    } else if (preset === 'clear') {
      setCardNumber('');
      setCardExp('');
      setCardCvc('');
      setCardPostal('');
      setCardholderName('');
      setTouchedFields({});
      setFormErrors({});
      addToast('Card form cleared for manual testing', 'info');
    }
  };

  // Validate entire form prior to submission
  const validateAllForm = () => {
    const errors = {
      cardholderName: validateField('cardholderName', cardholderName, cardNumber),
      cardNumber: validateField('cardNumber', cardNumber, cardNumber),
      cardExp: validateField('cardExp', cardExp, cardNumber),
      cardCvc: validateField('cardCvc', cardCvc, cardNumber),
      cardPostal: validateField('cardPostal', cardPostal, cardNumber)
    };
    setTouchedFields({
      cardholderName: true,
      cardNumber: true,
      cardExp: true,
      cardCvc: true,
      cardPostal: true
    });
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  // Process Direct Card Charge via Stripe with thorough validation
  const handleDirectCardCharge = async () => {
    const isValid = validateAllForm();
    if (!isValid) {
      addToast('⚠️ Please correct the invalid card details before proceeding.', 'error');
      return;
    }

    setIsCheckingOut(true);
    const targetEmail = user?.email || 'creator@clipforge.ai';
    try {
      const res = await fetch('http://127.0.0.1:8888/api/stripe/direct-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          cardNumber: cardNumber,
          expMonth: cardExp.split('/')[0] || '12',
          expYear: cardExp.split('/')[1] || '28',
          cvc: cardCvc,
          plan: checkoutPlan?.name || 'Creator Pro',
          interval: isAnnual ? 'annual' : 'month',
          discountCents: discount * 100
        })
      });
      const data = await res.json();
      setIsCheckingOut(false);
      if (res.ok && data.success) {
        if (data.user) {
          updateUser(data.user);
        } else {
          updateUser({ plan: checkoutPlan.name, credits: (user?.credits || 10) + (checkoutPlan.name === 'Studio Scale' ? 2000 : 500) });
        }
        const completedPlan = checkoutPlan.name;
        setCheckoutPlan(null);
        setSuccessPlan(completedPlan);
        addToast(`🎉 Payment approved via Stripe! Welcome to ${completedPlan}.`, 'success');
      } else {
        // Backend validation or authorization failed
        const errMsg = data.error || 'Payment declined. Please verify your card details.';
        addToast(errMsg, 'error');
        if (errMsg.toLowerCase().includes('card') || errMsg.toLowerCase().includes('luhn')) {
          setFormErrors(prev => ({ ...prev, cardNumber: errMsg }));
          setTouchedFields(prev => ({ ...prev, cardNumber: true }));
        } else if (errMsg.toLowerCase().includes('expire') || errMsg.toLowerCase().includes('month') || errMsg.toLowerCase().includes('year')) {
          setFormErrors(prev => ({ ...prev, cardExp: errMsg }));
          setTouchedFields(prev => ({ ...prev, cardExp: true }));
        } else if (errMsg.toLowerCase().includes('cvc')) {
          setFormErrors(prev => ({ ...prev, cardCvc: errMsg }));
          setTouchedFields(prev => ({ ...prev, cardCvc: true }));
        }
      }
    } catch (err) {
      setIsCheckingOut(false);
      addToast('Payment network error. Please ensure the backend server is running.', 'error');
    }
  };


  // Create Stripe Hosted Checkout Session
  const handleHostedStripeCheckout = async () => {
    setIsCheckingOut(true);
    const targetEmail = user?.email || 'creator@clipforge.ai';
    try {
      const res = await fetch('http://127.0.0.1:8888/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: checkoutPlan?.name || 'Creator Pro',
          interval: isAnnual ? 'annual' : 'month',
          email: targetEmail,
          user_id: user?.id || ''
        })
      });
      const data = await res.json();
      setIsCheckingOut(false);
      if (data.success && data.checkoutUrl) {
        if (data.mode === 'stripe_hosted') {
          addToast('Redirecting to official Stripe Checkout page...', 'info');
          window.location.href = data.checkoutUrl;
        } else {
          // Instant test simulation
          await handleDirectCardCharge();
        }
      } else {
        await handleDirectCardCharge();
      }
    } catch (err) {
      setIsCheckingOut(false);
      await handleDirectCardCharge();
    }
  };

  const handleOpenBillingHistory = async () => {
    setShowBillingModal(true);
    setLoadingBilling(true);
    try {
      const email = user?.email || 'sonu.sharma0624@gmail.com';
      const res = await fetch(`http://127.0.0.1:8888/api/user/billing?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setBillingHistory(data.payments || []);
    } catch (err) {
      console.warn('Billing fetch err:', err);
    } finally {
      setLoadingBilling(false);
    }
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

        {/* Current Plan & Billing History Bar */}
        {user && (
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 animate-fadeIn">
            <span className="text-xs text-slate-500 font-medium">
              Your Plan: <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">{user.plan || 'Creator Free'}</span>
              <span className="ml-2 font-mono text-[11px] text-slate-500">({user.credits || 10} Credits remaining)</span>
            </span>
            <span className="text-slate-300">•</span>
            <button
              onClick={handleOpenBillingHistory}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">receipt_long</span>
              <span>View Stripe Billing History</span>
            </button>
          </div>
        )}
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
            {user?.plan === 'Creator Free' ? 'Current Free Tier' : 'Get Started Free'}
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

          {user?.plan === 'Creator Pro' ? (
            <button
              disabled
              className="w-full h-11 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-default"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              <span>Current Active Plan</span>
            </button>
          ) : (
            <button
              onClick={() => openCheckout('Creator Pro', 19)}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Upgrade with Stripe</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          )}
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

          {user?.plan === 'Studio Scale' ? (
            <button
              disabled
              className="w-full h-11 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-default"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              <span>Current Active Plan</span>
            </button>
          ) : (
            <button
              onClick={() => openCheckout('Studio Scale', 49)}
              className="w-full h-11 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>Get Studio Scale with Stripe</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          )}
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

      {/* STRIPE CHECKOUT MODAL */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-scaleUp my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">credit_card</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Secure Stripe Checkout</h3>
                  <p className="text-[11px] text-slate-500 font-mono">256-Bit Encrypted • PCI-DSS Compliant</p>
                </div>
              </div>
              <button
                onClick={() => setCheckoutPlan(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Plan Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/70 to-slate-50 border border-indigo-100/80 flex items-center justify-between">
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full mb-1">
                  Selected Tier
                </span>
                <span className="text-base font-extrabold text-slate-900 block">{checkoutPlan.name}</span>
                <span className="text-xs text-slate-500 font-medium">Billed {isAnnual ? 'Annually (25% Savings)' : 'Monthly'}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono">
                  ${Math.max(0, checkoutPlan.price - discount)}
                </span>
                <span className="text-xs text-slate-500 block">/ month</span>
              </div>
            </div>

            {/* Checkout Mode Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setCheckoutMode('card')}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  checkoutMode === 'card'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">credit_card</span>
                <span>Card (Instant)</span>
              </button>
              <button
                onClick={() => setCheckoutMode('hosted')}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  checkoutMode === 'hosted'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                <span>Stripe Hosted Page</span>
              </button>
            </div>

            {/* Promo Code Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-700">Promo Code</label>
                <span className="text-slate-400 font-mono text-[11px]">Use: VIRAL2026 for $10 off</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter code..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 uppercase"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 border border-slate-200 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Tab 1: Direct Card Form (Stripe Elements Style with Real-time Validation) */}
            {checkoutMode === 'card' && (
              <div className="space-y-3.5 pt-1">
                {/* Instant QA / Testing Presets */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-indigo-600">tune</span>
                      Validation Test Presets
                    </span>
                    <button
                      type="button"
                      onClick={() => applyPreset('clear')}
                      className="text-[10px] text-slate-500 hover:text-slate-800 underline font-medium"
                    >
                      Clear form
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyPreset('valid_visa')}
                      className="px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      title="Valid Visa card (4242) passing Luhn checksum"
                    >
                      ✓ Valid 4242
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('valid_amex')}
                      className="px-2 py-1 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
                      title="Valid Amex card (3700) passing Luhn checksum"
                    >
                      ✓ Valid Amex
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('invalid_num')}
                      className="px-2 py-1 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                      title="Card number with wrong checksum"
                    >
                      ✗ Invalid Card #
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('expired')}
                      className="px-2 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                      title="Card with past expiration date"
                    >
                      ✗ Expired Date
                    </button>
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-700">Cardholder Name</label>
                    {touchedFields.cardholderName && !formErrors.cardholderName && cardholderName.trim().length >= 3 && (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span> Valid
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={handleCardholderNameChange}
                    onBlur={() => handleBlur('cardholderName')}
                    placeholder="Full Name as on card"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs text-slate-900 transition-all focus:outline-none ${
                      touchedFields.cardholderName && formErrors.cardholderName
                        ? 'border-2 border-rose-500 bg-rose-50/20 ring-2 ring-rose-100 focus:border-rose-600'
                        : 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600'
                    }`}
                  />
                  {touchedFields.cardholderName && formErrors.cardholderName && (
                    <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium pt-0.5">
                      <span className="material-symbols-outlined text-[13px]">error</span>
                      {formErrors.cardholderName}
                    </p>
                  )}
                </div>

                {/* Card Number with Brand Badge & Luhn Indicator */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-700">Card Number</label>
                    {touchedFields.cardNumber && !formErrors.cardNumber && cardNumber.replace(/\D/g, '').length >= 15 ? (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">verified</span> Valid Card
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Mod-10 Checksum Enforced</span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      onBlur={() => handleBlur('cardNumber')}
                      placeholder="4242 4242 4242 4242"
                      maxLength={getCardBrand(cardNumber).isAmex ? 17 : 19}
                      className={`w-full pl-3.5 pr-14 py-2.5 rounded-xl text-xs font-mono text-slate-900 transition-all focus:outline-none ${
                        touchedFields.cardNumber && formErrors.cardNumber
                          ? 'border-2 border-rose-500 bg-rose-50/20 ring-2 ring-rose-100 focus:border-rose-600'
                          : 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600'
                      }`}
                    />
                    <div className="absolute right-2.5 flex items-center">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono shadow-2xs ${getCardBrand(cardNumber).color}`}>
                        {getCardBrand(cardNumber).brand}
                      </span>
                    </div>
                  </div>
                  {touchedFields.cardNumber && formErrors.cardNumber && (
                    <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium pt-0.5">
                      <span className="material-symbols-outlined text-[13px]">error</span>
                      {formErrors.cardNumber}
                    </p>
                  )}
                </div>

                {/* Expiration, CVC, Zip */}
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Expiration */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-slate-700">Expires</label>
                      {touchedFields.cardExp && !formErrors.cardExp && cardExp.length === 5 && (
                        <span className="material-symbols-outlined text-[13px] text-emerald-600">check_circle</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={handleCardExpChange}
                      onBlur={() => handleBlur('cardExp')}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-mono text-slate-900 transition-all focus:outline-none ${
                        touchedFields.cardExp && formErrors.cardExp
                          ? 'border-2 border-rose-500 bg-rose-50/20 ring-2 ring-rose-100 focus:border-rose-600'
                          : 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600'
                      }`}
                    />
                    {touchedFields.cardExp && formErrors.cardExp && (
                      <p className="text-[10px] text-rose-600 font-medium leading-tight pt-0.5">
                        {formErrors.cardExp}
                      </p>
                    )}
                  </div>

                  {/* CVC */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-slate-700">CVC</label>
                      {touchedFields.cardCvc && !formErrors.cardCvc && cardCvc.length >= 3 && (
                        <span className="material-symbols-outlined text-[13px] text-emerald-600">check_circle</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={handleCardCvcChange}
                      onBlur={() => handleBlur('cardCvc')}
                      placeholder={getCardBrand(cardNumber).isAmex ? '4 digits' : '3 digits'}
                      maxLength={getCardBrand(cardNumber).isAmex ? 4 : 3}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-mono text-slate-900 transition-all focus:outline-none ${
                        touchedFields.cardCvc && formErrors.cardCvc
                          ? 'border-2 border-rose-500 bg-rose-50/20 ring-2 ring-rose-100 focus:border-rose-600'
                          : 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600'
                      }`}
                    />
                    {touchedFields.cardCvc && formErrors.cardCvc && (
                      <p className="text-[10px] text-rose-600 font-medium leading-tight pt-0.5">
                        {formErrors.cardCvc}
                      </p>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-slate-700">Postal Code</label>
                      {touchedFields.cardPostal && !formErrors.cardPostal && cardPostal.trim().length >= 3 && (
                        <span className="material-symbols-outlined text-[13px] text-emerald-600">check_circle</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={cardPostal}
                      onChange={handleCardPostalChange}
                      onBlur={() => handleBlur('cardPostal')}
                      placeholder="ZIP"
                      maxLength={10}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-mono text-slate-900 transition-all focus:outline-none ${
                        touchedFields.cardPostal && formErrors.cardPostal
                          ? 'border-2 border-rose-500 bg-rose-50/20 ring-2 ring-rose-100 focus:border-rose-600'
                          : 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600'
                      }`}
                    />
                    {touchedFields.cardPostal && formErrors.cardPostal && (
                      <p className="text-[10px] text-rose-600 font-medium leading-tight pt-0.5">
                        {formErrors.cardPostal}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Hosted Checkout Preview */}
            {checkoutMode === 'hosted' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">verified_user</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Redirect to Stripe Checkout</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    You will be securely redirected to Stripe's hosted payment page supporting Apple Pay, Google Pay, and international cards.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                disabled={isCheckingOut}
                onClick={checkoutMode === 'hosted' ? handleHostedStripeCheckout : handleDirectCardCharge}
                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-98 transition-all"
              >
                {isCheckingOut ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>Authorizing with Stripe...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    <span>
                      Pay ${Math.max(0, checkoutPlan.price - discount)} & Activate {checkoutPlan.name}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                  Cancel anytime
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-indigo-600">lock</span>
                  Powered by Stripe
                </span>
                <span>•</span>
                <span>Instant Activation</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CELEBRATION SUCCESS MODAL */}
      {successPlan && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-center animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-[32px]">celebration</span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Payment Confirmed
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                You're on {successPlan}!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your Stripe transaction was processed and your account is now equipped with Pro GPU rendering, watermark-free exports, and 500 processing credits.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Account:</span>
                <span className="font-semibold text-slate-900">{user?.email || 'Active User'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Plan Tier:</span>
                <span className="font-bold text-indigo-600">{successPlan}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Credits:</span>
                <span className="font-bold text-emerald-600">{user?.credits || 510} Credits</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setSuccessPlan(null);
                  setCurrentPage('clip');
                }}
                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
              >
                <span>Generate Shorts with {successPlan}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
              <button
                onClick={() => setSuccessPlan(null)}
                className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BILLING HISTORY MODAL */}
      {showBillingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600 text-[22px]">receipt_long</span>
                <h3 className="font-bold text-base text-slate-900">Billing History & Receipts</h3>
              </div>
              <button
                onClick={() => setShowBillingModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              {loadingBilling ? (
                <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span>Fetching billing records...</span>
                </div>
              ) : billingHistory.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <span className="material-symbols-outlined text-[32px] text-slate-300 block mb-1">payments</span>
                  <span>No payment receipts found yet.</span>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
                  {billingHistory.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 block">{item.plan} Subscription</span>
                          <span className="font-mono text-[10px] text-slate-400 font-semibold">{item.invoice_number || `INV-2026-${idx + 101}`}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">{item.created_at || 'Recent'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="font-mono font-bold text-slate-900 block">
                            ${(item.amount_cents / 100).toFixed(2)}
                          </span>
                          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                            Paid ✓
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedInvoice(item)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px]">visibility</span>
                          <span>Invoice</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowBillingModal(false)}
                className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          user={user}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

    </main>
  );
}


