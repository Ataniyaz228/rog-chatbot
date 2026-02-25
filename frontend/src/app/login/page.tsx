'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import chatbotIcon from '@/icons/chatbot.png';

// ─── Animated Constellation Background (Canvas) ───
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

        // Create particles
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.1,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            // Draw connections
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

            // Draw & update particles
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(249,115,22,${p.opacity})`;
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
            }

            animationId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(username, password, rememberMe);
            router.push('/chat');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ background: '#09090b' }}>
            {/* ── Left: Immersive Visual Panel ── */}
            <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden items-center justify-center"
                style={{ background: '#09090b' }}>

                {/* Live constellation canvas */}
                <ConstellationCanvas />

                {/* Warm radial glow */}
                <div className="absolute top-[35%] left-[45%] w-[700px] h-[700px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 60%)' }} />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center px-12">
                    {/* App icon — real chatbot icon */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden mb-8 shadow-[0_0_60px_rgba(249,115,22,0.15)]"
                        style={{ border: '1px solid rgba(249,115,22,0.1)' }}>
                        <Image src={chatbotIcon} alt="Neural Core" width={80} height={80} className="w-full h-full object-cover" />
                    </div>

                    <h2 className="text-4xl font-bold text-white tracking-tight mb-4 leading-[1.15]">
                        Neural Core
                    </h2>

                    <p className="text-zinc-500 text-[15px] leading-relaxed max-w-[340px] mb-12">
                        Upload documents, ask questions in natural language, get answers with source citations.
                    </p>

                    {/* Animated message preview */}
                    <div className="w-full max-w-[360px] space-y-3">
                        <AnimatedChatPreview />
                    </div>
                </div>

                {/* Side accent */}
                <div className="absolute right-0 top-[20%] bottom-[20%] w-px"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(249,115,22,0.06) 30%, rgba(249,115,22,0.06) 70%, transparent)' }} />
            </div>

            {/* ── Right: Login Form ── */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative"
                style={{ background: '#09090b' }}>

                <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.02] pointer-events-none"
                    style={{ background: 'radial-gradient(circle at top right, rgba(249,115,22,1), transparent 55%)' }} />

                <div className="w-full max-w-[360px] relative z-10">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-14">
                        <div className="w-10 h-10 rounded-xl overflow-hidden"
                            style={{ border: '1px solid rgba(249,115,22,0.1)' }}>
                            <Image src={chatbotIcon} alt="Neural Core" width={40} height={40} />
                        </div>
                        <span className="text-lg font-semibold text-white">Neural Core</span>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back</h1>
                        <p className="text-[14px] text-zinc-600">Sign in to your workspace</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-xl text-[13px]"
                            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.08)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-red-500 shrink-0 mt-0.5">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span className="text-red-400/80">{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <InputField
                            label="Username"
                            type="text"
                            value={username}
                            onChange={setUsername}
                            focused={focused}
                            setFocused={setFocused}
                            field="username"
                            placeholder="Enter your username"
                            icon={<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            focused={focused}
                            setFocused={setFocused}
                            field="password"
                            placeholder="Enter your password"
                            icon={<><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>}
                        />

                        {/* Remember */}
                        <label htmlFor="rememberMe" className="flex items-center gap-3 cursor-pointer select-none group pt-1">
                            <div className="relative">
                                <input type="checkbox" id="rememberMe" checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)} className="sr-only" />
                                <div className="w-[18px] h-[18px] rounded-[5px] transition-all duration-200 flex items-center justify-center"
                                    style={{
                                        border: rememberMe ? '1px solid rgba(249,115,22,0.5)' : '1px solid rgba(255,255,255,0.08)',
                                        background: rememberMe ? 'rgba(249,115,22,0.85)' : 'transparent',
                                    }}>
                                    {rememberMe && (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <span className="text-[13px] text-zinc-600 group-hover:text-zinc-400 transition-colors">Remember for 30 days</span>
                        </label>

                        {/* Submit */}
                        <button type="submit" disabled={isLoading}
                            className="w-full py-3.5 rounded-xl text-[14px] font-semibold text-white transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_8px_40px_rgba(249,115,22,0.15)] hover:translate-y-[-1px] active:translate-y-[0px] mt-2"
                            style={{
                                background: isLoading ? 'rgba(249,115,22,0.2)' : 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%)',
                                boxShadow: isLoading ? 'none' : '0 4px 24px rgba(249,115,22,0.12)',
                            }}>
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2.5">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <span className="text-[14px] text-zinc-700">No account yet? </span>
                        <Link href="/register" className="text-[14px] text-orange-500 hover:text-orange-400 font-medium transition-colors">
                            Create one
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Shared Input Component ───
function InputField({ label, type, value, onChange, focused, setFocused, field, placeholder, icon }: {
    label: string; type: string; value: string; onChange: (v: string) => void;
    focused: string | null; setFocused: (v: string | null) => void;
    field: string; placeholder: string; icon: React.ReactNode;
}) {
    const isActive = focused === field;
    return (
        <div>
            <label className="text-[11px] font-medium text-zinc-600 uppercase tracking-[0.12em] ml-1 mb-2 block">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        className={`transition-colors duration-300 ${isActive ? 'text-orange-500' : 'text-zinc-700'}`}>
                        {icon}
                    </svg>
                </div>
                <input
                    type={type} value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setFocused(field)}
                    onBlur={() => setFocused(null)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl text-[14px] text-white placeholder:text-zinc-700 outline-none transition-all duration-300"
                    style={{
                        background: isActive ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.015)',
                        border: isActive ? '1px solid rgba(249,115,22,0.2)' : '1px solid rgba(255,255,255,0.05)',
                        boxShadow: isActive ? '0 0 0 4px rgba(249,115,22,0.05)' : 'none',
                    }}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}

// ─── Animated Mini Chat Preview ───
function AnimatedChatPreview() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 1500),
            setTimeout(() => setStep(2), 3500),
            setTimeout(() => setStep(3), 5500),
            setTimeout(() => setStep(0), 9000),
        ];
        const loop = setInterval(() => {
            setStep(0);
            setTimeout(() => setStep(1), 1500);
            setTimeout(() => setStep(2), 3500);
            setTimeout(() => setStep(3), 5500);
        }, 9000);
        return () => { timers.forEach(clearTimeout); clearInterval(loop); };
    }, []);

    return (
        <div className="rounded-xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.04]">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_6px_rgba(249,115,22,0.4)]" />
                <span className="text-[10px] font-bold tracking-[0.15em] text-zinc-600 uppercase">Neural Core</span>
            </div>

            <div className="p-4 space-y-3 min-h-[160px]">
                {/* User message */}
                {step >= 1 && (
                    <div className="flex justify-end" style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}>
                        <div className="px-3 py-2 rounded-xl rounded-br-sm text-[11px] text-white max-w-[80%]"
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            What is the refund policy?
                        </div>
                    </div>
                )}

                {/* AI thinking */}
                {step === 2 && (
                    <div className="flex items-center gap-2 px-3 py-2" style={{ animation: 'fadeSlideIn 0.3s ease forwards' }}>
                        <div className="w-2.5 h-2.5 bg-zinc-600 animate-[spin_1.5s_ease-in-out_infinite]" style={{ borderRadius: '20%' }} />
                        <span className="text-[10px] text-zinc-600 font-mono tracking-wider uppercase">Processing</span>
                    </div>
                )}

                {/* AI answer */}
                {step >= 3 && (
                    <div style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}>
                        <div className="px-3 py-2 rounded-xl text-[11px] text-zinc-400 leading-relaxed"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                            Refunds are available within <span className="text-orange-400">30 days</span> of purchase with a valid receipt...
                        </div>
                        <div className="flex items-center gap-1 mt-1.5 ml-1">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(249,115,22,0.5)" strokeWidth="2" strokeLinecap="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            </svg>
                            <span className="text-[9px] text-zinc-700">policy.pdf · Section 3</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
