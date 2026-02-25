'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import chatbotIcon from '@/icons/chatbot.png';

// ─── Constellation Canvas ───
function ConstellationCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const particles: { x: number; y: number; vx: number; vy: number; r: number; opacity: number }[] = [];

        const resize = () => {
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
            ctx.scale(2, 2);
        };
        resize();
        window.addEventListener('resize', resize);

        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.3 + 0.1,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(249,115,22,${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(249,115,22,${p.opacity})`;
                ctx.fill();
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
            }
            animationId = requestAnimationFrame(draw);
        };
        draw();

        return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ─── Animated Document Flow ───
function AnimatedDocFlow() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const cycle = () => {
            setPhase(0);
            setTimeout(() => setPhase(1), 1200);
            setTimeout(() => setPhase(2), 3000);
            setTimeout(() => setPhase(3), 5000);
        };
        cycle();
        const loop = setInterval(cycle, 7500);
        return () => clearInterval(loop);
    }, []);

    return (
        <div className="rounded-xl overflow-hidden w-full max-w-[360px]"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.04]">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_6px_rgba(249,115,22,0.4)]" />
                <span className="text-[10px] font-bold tracking-[0.15em] text-zinc-600 uppercase">Document Pipeline</span>
            </div>

            <div className="p-4 min-h-[170px] space-y-3">
                {/* Step: Upload */}
                {phase >= 0 && (
                    <div className="flex items-center gap-3" style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: phase > 0 ? 'rgba(16,185,129,0.08)' : 'rgba(249,115,22,0.08)' }}>
                            {phase > 0 ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            )}
                        </div>
                        <div className="flex-1">
                            <span className="text-[11px] text-zinc-400 block">Document received</span>
                            <span className="text-[10px] text-zinc-700">Parsing content...</span>
                        </div>
                    </div>
                )}

                {/* Step: Chunk */}
                {phase >= 1 && (
                    <div className="flex items-center gap-3" style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: phase > 1 ? 'rgba(16,185,129,0.08)' : 'rgba(249,115,22,0.08)' }}>
                            {phase > 1 ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            )}
                        </div>
                        <div className="flex-1">
                            <span className="text-[11px] text-zinc-400 block">Splitting into chunks</span>
                            <span className="text-[10px] text-zinc-700">Semantic segmentation</span>
                        </div>
                    </div>
                )}

                {/* Step: Embed */}
                {phase >= 2 && (
                    <div className="flex items-center gap-3" style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: phase > 2 ? 'rgba(16,185,129,0.08)' : 'rgba(249,115,22,0.08)' }}>
                            {phase > 2 ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            )}
                        </div>
                        <div className="flex-1">
                            <span className="text-[11px] text-zinc-400 block">Generating embeddings</span>
                            <span className="text-[10px] text-zinc-700">Vector indexing</span>
                        </div>
                    </div>
                )}

                {/* Step: Ready */}
                {phase >= 3 && (
                    <div className="flex items-center gap-3 pt-2 border-t border-white/[0.04]" style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                        <span className="text-[10px] text-emerald-500/80 font-mono tracking-wider">Ready for questions</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) { setError('Passwords do not match'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setIsLoading(true);
        try {
            await register(username, email, password);
            router.push('/chat');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const strength = useMemo(() => {
        if (!password) return 0;
        let s = 0;
        if (password.length >= 6) s++;
        if (password.length >= 10) s++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
        if (/\d/.test(password)) s++;
        if (/[^A-Za-z0-9]/.test(password)) s++;
        return Math.min(s, 4);
    }, [password]);

    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['', '#ef4444', '#f59e0b', '#22c55e', '#10b981'];

    const inputCls = "w-full pl-12 pr-4 py-3.5 rounded-xl text-[14px] text-white placeholder:text-zinc-700 outline-none transition-all duration-300";
    const inputStyle = (f: string) => ({
        background: focused === f ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.015)',
        border: focused === f ? '1px solid rgba(249,115,22,0.2)' : '1px solid rgba(255,255,255,0.05)',
        boxShadow: focused === f ? '0 0 0 4px rgba(249,115,22,0.05)' : 'none',
    });
    const iconCls = (f: string) => `transition-colors duration-300 ${focused === f ? 'text-orange-500' : 'text-zinc-700'}`;

    return (
        <div className="min-h-screen flex" style={{ background: '#09090b' }}>
            {/* ── Left Panel ── */}
            <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden items-center justify-center"
                style={{ background: '#09090b' }}>

                <ConstellationCanvas />

                <div className="absolute top-[35%] left-[45%] w-[700px] h-[700px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 60%)' }} />

                <div className="relative z-10 flex flex-col items-center text-center px-12">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden mb-8 shadow-[0_0_60px_rgba(249,115,22,0.15)]"
                        style={{ border: '1px solid rgba(249,115,22,0.1)' }}>
                        <Image src={chatbotIcon} alt="Neural Core" width={80} height={80} className="w-full h-full object-cover" />
                    </div>

                    <h2 className="text-4xl font-bold text-white tracking-tight mb-4 leading-[1.15]">
                        Neural Core
                    </h2>

                    <p className="text-zinc-500 text-[15px] leading-relaxed max-w-[340px] mb-12">
                        See how your documents are processed into a searchable knowledge base.
                    </p>

                    <AnimatedDocFlow />
                </div>

                <div className="absolute right-0 top-[20%] bottom-[20%] w-px"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(249,115,22,0.06) 30%, rgba(249,115,22,0.06) 70%, transparent)' }} />
            </div>

            {/* ── Right: Form ── */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative"
                style={{ background: '#09090b' }}>

                <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.02] pointer-events-none"
                    style={{ background: 'radial-gradient(circle at top right, rgba(249,115,22,1), transparent 55%)' }} />

                <div className="w-full max-w-[360px] relative z-10">
                    <div className="lg:hidden flex items-center gap-3 mb-14">
                        <div className="w-10 h-10 rounded-xl overflow-hidden"
                            style={{ border: '1px solid rgba(249,115,22,0.1)' }}>
                            <Image src={chatbotIcon} alt="Neural Core" width={40} height={40} />
                        </div>
                        <span className="text-lg font-semibold text-white">Neural Core</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Create account</h1>
                        <p className="text-[14px] text-zinc-600">Start analyzing documents for free</p>
                    </div>

                    {error && (
                        <div className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-xl text-[13px]"
                            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.08)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-red-500 shrink-0 mt-0.5">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span className="text-red-400/80">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="text-[11px] font-medium text-zinc-600 uppercase tracking-[0.12em] ml-1 mb-2 block">Username</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={iconCls('username')}>
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                                    </svg>
                                </div>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                    onFocus={() => setFocused('username')} onBlur={() => setFocused(null)}
                                    required className={inputCls} style={inputStyle('username')} placeholder="Choose a username" />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-[11px] font-medium text-zinc-600 uppercase tracking-[0.12em] ml-1 mb-2 block">Email</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={iconCls('email')}>
                                        <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                                    required className={inputCls} style={inputStyle('email')} placeholder="your@email.com" />
                            </div>
                        </div>

                        {/* Password + strength */}
                        <div>
                            <label className="text-[11px] font-medium text-zinc-600 uppercase tracking-[0.12em] ml-1 mb-2 block">Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={iconCls('password')}>
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                </div>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                                    required className={inputCls} style={inputStyle('password')} placeholder="Min 6 characters" />
                            </div>
                            {password && (
                                <div className="flex items-center gap-2 mt-2 ml-1">
                                    <div className="flex gap-1 flex-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-[3px] flex-1 rounded-full transition-all duration-300"
                                                style={{ background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.05)' }} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-mono" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
                                </div>
                            )}
                        </div>

                        {/* Confirm */}
                        <div>
                            <label className="text-[11px] font-medium text-zinc-600 uppercase tracking-[0.12em] ml-1 mb-2 block">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={iconCls('confirm')}>
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                </div>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    onFocus={() => setFocused('confirm')} onBlur={() => setFocused(null)}
                                    required className={inputCls} style={inputStyle('confirm')} placeholder="Repeat password" />
                                {confirmPassword && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {password === confirmPassword ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading}
                            className="w-full py-3.5 rounded-xl text-[14px] font-semibold text-white transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_8px_40px_rgba(249,115,22,0.15)] hover:translate-y-[-1px] active:translate-y-[0px] mt-2"
                            style={{
                                background: isLoading ? 'rgba(249,115,22,0.2)' : 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%)',
                                boxShadow: isLoading ? 'none' : '0 4px 24px rgba(249,115,22,0.12)',
                            }}>
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2.5">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <span className="text-[14px] text-zinc-700">Already have an account? </span>
                        <Link href="/login" className="text-[14px] text-orange-500 hover:text-orange-400 font-medium transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
