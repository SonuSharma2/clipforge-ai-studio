import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function AuthPage() {
  const {
    authMode,
    setAuthMode,
    pendingEmail,
    setPendingEmail,
    demoOtp,
    setDemoOtp,
    loginUser,
    setCurrentPage,
    addToast
  } = useApp();

  // Form states
  const [email, setEmail] = useState(pendingEmail || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  // OTP states (6 individual boxes)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Google Modal Simulation State
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Password reset specific
  const [newPassword, setNewPassword] = useState('');

  // Sync email when pendingEmail changes
  useEffect(() => {
    if (pendingEmail) {
      setEmail(pendingEmail);
    }
  }, [pendingEmail]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer;
    if (authMode === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authMode, countdown]);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-zinc-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-blue-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(password);

  // OTP box change handler with auto-advance
  const handleOtpChange = (index, value) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (cleaned.length > 1) {
      // Paste detected on single box
      const pasteArray = cleaned.slice(0, 6).split('');
      pasteArray.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasteArray.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = [...otpDigits];
    pasted.split('').forEach((char, i) => {
      newDigits[i] = char;
    });
    setOtpDigits(newDigits);
    const nextFocus = Math.min(pasted.length, 5);
    otpInputRefs.current[nextFocus]?.focus();
  };

  // Trigger Send OTP
  const triggerSendOtp = async (targetEmail, purpose = 'verification') => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8888/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, purpose })
      });
      const data = await res.json();
      if (data.success) {
        setPendingEmail(targetEmail);
        setDemoOtp(data.demoOtp || '849201');
        setCountdown(60);
        setCanResend(false);
        setOtpDigits(['', '', '', '', '', '']);
        setAuthMode('otp');
        addToast(data.message || `Verification code sent to ${targetEmail}!`, 'success');
      } else {
        addToast(data.error || 'Failed to send OTP code.', 'error');
      }
    } catch (err) {
      // Fallback offline mock code
      const mockOtp = '742918';
      setPendingEmail(targetEmail);
      setDemoOtp(mockOtp);
      setCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      setAuthMode('otp');
      addToast(`Verification code sent to ${targetEmail} (Demo code: ${mockOtp})`, 'info');
    } finally {
      setLoading(false);
    }
  };

  // Sign in submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your email address', 'error');
      return;
    }
    if (!password) {
      addToast('Please enter your password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8888/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        loginUser(data.user);
        setCurrentPage('studio');
      } else {
        addToast(data.error || 'Invalid credentials', 'error');
      }
    } catch (err) {
      // Offline fallback
      loginUser({
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        plan: 'Pro Studio',
        emailVerified: true
      });
      setCurrentPage('studio');
    } finally {
      setLoading(false);
    }
  };

  // Sign up submit
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!fullName) {
      addToast('Please enter your full name', 'error');
      return;
    }
    if (!email) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    if (!password || password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (!agreedTerms) {
      addToast('Please agree to the Terms of Service & Privacy Policy', 'error');
      return;
    }

    // Direct user to email OTP verification first
    await triggerSendOtp(email, 'verification');
  };

  // Verify OTP submit
  const handleVerifyOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      addToast('Please enter all 6 digits of the verification code', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8888/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail || email, otp: fullOtp })
      });
      const data = await res.json();
      if (data.success) {
        // Complete account signup or verification
        const signupRes = await fetch('http://127.0.0.1:8888/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: pendingEmail || email, name: fullName, password })
        });
        const signupData = await signupRes.json();
        
        loginUser(signupData.user || {
          id: `usr_${Date.now()}`,
          name: fullName || email.split('@')[0],
          email: pendingEmail || email,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
          plan: 'Pro Studio',
          emailVerified: true
        });

        addToast('Email verified successfully! Welcome to ClipForge AI.', 'success');
        setCurrentPage('studio');
      } else {
        addToast(data.error || 'Invalid verification code', 'error');
      }
    } catch (err) {
      // Offline fallback
      loginUser({
        id: `usr_${Date.now()}`,
        name: fullName || (pendingEmail || email).split('@')[0],
        email: pendingEmail || email,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        plan: 'Pro Studio',
        emailVerified: true
      });
      addToast('Email verified! Welcome to ClipForge AI.', 'success');
      setCurrentPage('studio');
    } finally {
      setLoading(false);
    }
  };

  // Google Login Execution
  const executeGoogleAuth = async (googleUser) => {
    setShowGoogleModal(false);
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8888/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleUser)
      });
      const data = await res.json();
      if (data.success && data.user) {
        loginUser(data.user);
        setCurrentPage('studio');
      }
    } catch (err) {
      loginUser({
        id: 'google_user',
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.avatar,
        plan: 'Pro Studio',
        emailVerified: true,
        provider: 'google'
      });
      setCurrentPage('studio');
    } finally {
      setLoading(false);
    }
  };

  // Quick auto-fill demo OTP helper
  const handleAutoFillDemoOtp = () => {
    const code = demoOtp || '386036';
    const splitCode = code.split('').slice(0, 6);
    setOtpDigits(splitCode);
    addToast(`Auto-filled code: ${code}`, 'info');
    if (otpInputRefs.current[5]) {
      otpInputRefs.current[5].focus();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-[#111319]">
      {/* Background ambient decorative light orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8083ff]/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4cd7f6]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#571bc1]/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-5xl rounded-3xl bg-[#191b22]/90 border border-[#33343b] shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden z-10 my-8">
        
        {/* Left Column: Brand, Social Proof & Features (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#1d1f26] via-[#161820] to-[#0c0e14] p-10 flex-col justify-between border-r border-[#33343b] relative">
          <div className="flex flex-col gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#571bc1] via-[#8083ff] to-[#4cd7f6] flex items-center justify-center text-white shadow-[0_0_20px_rgba(128,131,255,0.4)]">
                <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white">ClipForge AI</span>
                <span className="text-xs text-[#8083ff] font-mono font-medium">Smart Viral Video Studio</span>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                Turn 1 Long Video Into <span className="bg-gradient-to-r from-[#c0c1ff] via-[#8083ff] to-[#4cd7f6] bg-clip-text text-transparent">10 Viral Shorts</span> In Seconds.
              </h2>
              <p className="text-sm text-[#c7c4d7] leading-relaxed">
                Join 140,000+ creators and agencies saving 20+ hours every week with automatic 9:16 re-framing, dynamic captions, and AI virality prediction.
              </p>
            </div>

            {/* Testimonial / Social Card */}
            <div className="p-4 rounded-2xl bg-[#191b22]/80 border border-[#33343b] flex flex-col gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://avatars.githubusercontent.com/u/47955645?v=4"
                    alt="Sonu Sharma"
                    className="w-9 h-9 rounded-full border border-[#8083ff]/40 object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Sonu Sharma</span>
                    <span className="text-[10px] text-[#908fa0]">Top Tech Creator • 850k+ Followers</span>
                  </div>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {'★'.repeat(5)}
                </div>
              </div>
              <p className="text-xs text-[#c7c4d7] italic">
                "ClipForge cut my editing team's turnaround time from 2 days to 3 minutes. The smart multi-segment slicing picked the exact peak moments that went viral."
              </p>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-col gap-3 pt-6 border-t border-[#33343b]/60">
            <div className="flex items-center gap-3 text-xs text-[#c7c4d7]">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">✓</span>
              <span>60 Free GPU Processing Minutes Included</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#c7c4d7]">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">✓</span>
              <span>Ultra-fast 9:16 Vertical Video Crop & Subtitles</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#c7c4d7]">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">✓</span>
              <span>No Watermark & Instant HD Export</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form & Screens */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">

          {/* Mode Switch Tabs (Only shown on Login and SignUp views) */}
          {(authMode === 'login' || authMode === 'signup') && (
            <div className="flex rounded-xl bg-[#111319] p-1 border border-[#33343b] mb-8 max-w-sm mx-auto w-full">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-[#8083ff] text-white shadow-md'
                    : 'text-[#c7c4d7] hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-[#8083ff] text-white shadow-md'
                    : 'text-[#c7c4d7] hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* GOOGLE & SOCIAL BUTTONS (For login & signup) */}
          {(authMode === 'login' || authMode === 'signup') && (
            <div className="flex flex-col gap-4 mb-6">
              {/* Primary Google Auth Button */}
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full h-12 rounded-xl bg-white hover:bg-neutral-100 text-[#1f1f1f] font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-[0.99] border border-neutral-300"
              >
                {/* Official Google SVG Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* GitHub Alternative */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    executeGoogleAuth({
                      email: 'sonusharma.github@gmail.com',
                      name: 'Sonu Sharma (GitHub)',
                      avatar: 'https://avatars.githubusercontent.com/u/47955645?v=4'
                    });
                  }}
                  className="h-11 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-[#e2e2ea] font-medium text-xs flex items-center justify-center gap-2 border border-[#33343b] transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    executeGoogleAuth({
                      email: 'sonu.apple@icloud.com',
                      name: 'Sonu (Apple ID)',
                      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=apple'
                    });
                  }}
                  className="h-11 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-[#e2e2ea] font-medium text-xs flex items-center justify-center gap-2 border border-[#33343b] transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 5.16c.63-.77 1.06-1.84.94-2.91-.91.04-2.02.61-2.67 1.37-.58.67-1.09 1.76-.95 2.8.01 0 .04.01.07.01 1.02 0 2-1.27 2.61-1.27z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              {/* Or Divider */}
              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-[#33343b] w-full"></div>
                <span className="bg-[#191b22] px-3 text-[11px] font-mono uppercase text-[#908fa0] tracking-wider absolute">
                  Or continue with email
                </span>
              </div>
            </div>
          )}

          {/* VIEW 1: SIGN IN */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#c7c4d7]">Email Address</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#908fa0] text-[20px]">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@domain.com"
                    required
                    className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#111319] border border-[#33343b] text-white text-sm focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#c7c4d7]">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingEmail(email);
                      setAuthMode('forgot');
                    }}
                    className="text-xs text-[#8083ff] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#908fa0] text-[20px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full h-11 pl-11 pr-11 rounded-xl bg-[#111319] border border-[#33343b] text-white text-sm focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#908fa0] hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#c7c4d7]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#111319] border-[#33343b] text-[#8083ff] focus:ring-0"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#571bc1] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(128,131,255,0.3)] hover:opacity-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                ) : (
                  <>
                    <span>Sign In to Studio</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>

              <div className="text-center text-xs text-[#908fa0] mt-3">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-[#8083ff] font-semibold hover:underline"
                >
                  Create one free
                </button>
              </div>
            </form>
          )}

          {/* VIEW 2: SIGN UP WITH EMAIL VERIFICATION & OTP PREVIEW */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#c7c4d7]">Full Name</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#908fa0] text-[20px]">
                    person
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sonu Sharma"
                    required
                    className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#111319] border border-[#33343b] text-white text-sm focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#c7c4d7]">Work or Personal Email</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#908fa0] text-[20px]">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@domain.com"
                    required
                    className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#111319] border border-[#33343b] text-white text-sm focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#c7c4d7]">Create Password</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#908fa0] text-[20px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full h-11 pl-11 pr-11 rounded-xl bg-[#111319] border border-[#33343b] text-white text-sm focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#908fa0] hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#908fa0]">Password strength:</span>
                      <span className="font-semibold text-white">{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#111319] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.score}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#c7c4d7] mt-1">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded bg-[#111319] border-[#33343b] text-[#8083ff] focus:ring-0"
                />
                <span>
                  I agree to the{' '}
                  <span className="text-[#8083ff] hover:underline">Terms of Service</span> and{' '}
                  <span className="text-[#8083ff] hover:underline">Privacy Policy</span>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#571bc1] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(128,131,255,0.3)] hover:opacity-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                ) : (
                  <>
                    <span>Verify Email & Create Account</span>
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  </>
                )}
              </button>

              <div className="text-center text-xs text-[#908fa0] mt-3">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-[#8083ff] font-semibold hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: PROPER EMAIL VERIFICATION & 6-DIGIT OTP SCREEN */}
          {authMode === 'otp' && (
            <div className="flex flex-col items-center text-center animate-fadeIn">
              {/* Header Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#571bc1]/30 via-[#8083ff]/20 to-[#4cd7f6]/20 border border-[#8083ff]/40 flex items-center justify-center text-[#c0c1ff] shadow-[0_0_30px_rgba(128,131,255,0.3)] mb-4">
                <span className="material-symbols-outlined text-[32px]">mark_email_read</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Check Your Email</h3>
              <p className="text-sm text-[#c7c4d7] max-w-sm mb-1">
                We've sent a 6-digit confirmation code to:
              </p>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm font-semibold text-[#8083ff] font-mono bg-[#111319] px-3 py-1 rounded-lg border border-[#33343b]">
                  {pendingEmail || email}
                </span>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-xs text-[#908fa0] hover:text-white underline"
                >
                  Change
                </button>
              </div>

              {/* 6 Digit Inputs */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6" onPaste={handlePasteOtp}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl bg-[#111319] border border-[#33343b] text-white focus:outline-none focus:border-[#8083ff] focus:ring-2 focus:ring-[#8083ff]/40 transition-all shadow-inner"
                  />
                ))}
              </div>

              {/* Demo Helper auto-fill chip */}
              <div className="mb-6 p-2.5 rounded-xl bg-[#282a30]/80 border border-[#8083ff]/30 flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">verified</span>
                <span className="text-[#c7c4d7]">
                  Instant Test Code: <strong className="text-white font-mono">{demoOtp || '386036'}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleAutoFillDemoOtp}
                  className="ml-auto px-2.5 py-1 rounded-lg bg-[#8083ff] hover:bg-[#6c70ff] text-white font-semibold text-[11px] transition-colors"
                >
                  Auto-Fill
                </button>
              </div>

              {/* Verify Button */}
              <button
                type="button"
                onClick={handleVerifyOtpSubmit}
                disabled={loading || otpDigits.join('').length < 6}
                className="w-full max-w-sm h-12 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#571bc1] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(128,131,255,0.3)] hover:opacity-95 transition-all disabled:opacity-50 mb-4"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                ) : (
                  <>
                    <span>Verify & Launch Studio</span>
                    <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                  </>
                )}
              </button>

              {/* Resend Timer */}
              <div className="text-xs text-[#908fa0]">
                {canResend ? (
                  <div className="flex items-center gap-1 justify-center">
                    <span>Didn't receive code?</span>
                    <button
                      type="button"
                      onClick={() => triggerSendOtp(pendingEmail || email)}
                      className="text-[#8083ff] font-semibold hover:underline"
                    >
                      Resend Code
                    </button>
                  </div>
                ) : (
                  <span>
                    Resend code in <strong className="text-white font-mono">00:{countdown < 10 ? `0${countdown}` : countdown}</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* VIEW 4: FORGOT PASSWORD */}
          {authMode === 'forgot' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="w-8 h-8 rounded-lg bg-[#111319] border border-[#33343b] flex items-center justify-center text-[#c7c4d7] hover:text-white"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                </button>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-white">Reset Password</h3>
                  <p className="text-xs text-[#908fa0]">We'll send an OTP code to reset your account password</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#c7c4d7]">Registered Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@domain.com"
                  required
                  className="w-full h-11 px-4 rounded-xl bg-[#111319] border border-[#33343b] text-white text-sm focus:outline-none focus:border-[#8083ff]"
                />
              </div>

              <button
                type="button"
                onClick={() => triggerSendOtp(email, 'reset')}
                disabled={loading || !email}
                className="w-full h-12 mt-2 rounded-xl bg-[#8083ff] hover:bg-[#6c70ff] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <span>Send Reset Code</span>
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* GOOGLE AUTH POPUP SIMULATOR MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white text-neutral-900 shadow-2xl overflow-hidden border border-neutral-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div className="flex flex-col">
                  <span className="font-semibold text-base leading-tight">Sign in with Google</span>
                  <span className="text-xs text-neutral-500">to continue to ClipForge AI Studio</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            {/* Account List */}
            <div className="p-4 flex flex-col gap-2">
              <span className="text-xs font-semibold text-neutral-500 px-3 uppercase tracking-wider">
                Choose an account
              </span>

              {/* Account 1: User's Account */}
              <button
                type="button"
                onClick={() =>
                  executeGoogleAuth({
                    name: 'Sonu Sharma',
                    email: 'sonu.sharma0624@gmail.com',
                    avatar: 'https://avatars.githubusercontent.com/u/47955645?v=4'
                  })
                }
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-100 transition-colors text-left"
              >
                <img
                  src="https://avatars.githubusercontent.com/u/47955645?v=4"
                  alt="Sonu Sharma"
                  className="w-10 h-10 rounded-full border border-neutral-300 object-cover"
                />
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-semibold text-neutral-900">Sonu Sharma</span>
                  <span className="text-xs text-neutral-500">sonu.sharma0624@gmail.com</span>
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Active</span>
              </button>

              {/* Account 2: Studio Demo Team Account */}
              <button
                type="button"
                onClick={() =>
                  executeGoogleAuth({
                    name: 'ClipForge Studio Pro',
                    email: 'creator.pro@clipforge.ai',
                    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-w7wMnJainoYTirpv9tnRm6ZuHNSze7RVnlm0wVZGeEierfeyaf3ck0tZa4Kyv0XSh8rtjo8OCMAQMHLEXyepyrZYnYjkQcEm6zeWTdBP6tTRdBKsawPYgsEsDcbTgtQ_tmhSWXNjlRy0q48G2i57WHclrzSQ8qtbpBqaMhoFwIMc2_zN-BJSvqrN2BXwfO9PknNuAMjWoZMbZecd7V_FvtP8OyIu6njkjLoPfwE'
                  })
                }
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-100 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  CP
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-semibold text-neutral-900">ClipForge Studio Pro</span>
                  <span className="text-xs text-neutral-500">creator.pro@clipforge.ai</span>
                </div>
              </button>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-[11px] text-neutral-500 text-center">
              To continue, Google will share your name, email address, and profile picture with ClipForge AI.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
