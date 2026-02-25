'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import SpotlightCard from '@/components/SpotlightCard';
import ScrambleText from '@/components/ScrambleText';

const NeuralConstellation = dynamic(() => import('@/components/NeuralConstellation'), { ssr: false });

// ─── SVG Icons ───
function IconSearch({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M8 11h6M11 8v6" opacity="0.4" />
    </svg>
  );
}

function IconLayers({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" opacity="0.6" />
      <path d="M2 12l10 5 10-5" opacity="0.3" />
    </svg>
  );
}

function IconLink({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" opacity="0.6" />
    </svg>
  );
}

function IconUpload({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconBrain({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" />
      <path d="M9 22h6M10 17v5M14 17v5" opacity="0.4" />
    </svg>
  );
}

function IconCheck({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Demo Chat Animation ───
function LiveDemoCard() {
  const [step, setStep] = useState(0);
  const [typedQuestion, setTypedQuestion] = useState('');
  const [loop, setLoop] = useState(0);

  const question = 'What were Q3 revenue figures?';

  useEffect(() => {
    setStep(0);
    setTypedQuestion('');

    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => {
        let i = 0;
        const interval = setInterval(() => {
          setTypedQuestion(question.slice(0, i + 1));
          i++;
          if (i >= question.length) clearInterval(interval);
        }, 40);
      }, 2000),
      setTimeout(() => setStep(2), 4200),
      setTimeout(() => setStep(3), 4600),
      setTimeout(() => setStep(4), 6400),
      setTimeout(() => setStep(5), 7800),
      setTimeout(() => { setLoop(l => l + 1); }, 13000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [loop]);

  return (
    <div className="relative group">
      {/* Subtle outer glow on hover */}
      <div className="absolute -inset-3 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />

      <div
        className="relative w-full max-w-[580px] rounded-2xl overflow-hidden flex glass-panel"
        style={{ height: '440px' }}
      >
        {/* ── Mini Sidebar ── */}
        <div className="w-[156px] shrink-0 border-r border-white/[0.04] flex flex-col bg-black/20">
          {/* Logo */}
          <div className="px-3.5 h-12 border-b border-white/[0.04] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.5)]" />
            <span className="text-[11px] font-semibold text-zinc-300 tracking-tight">Neural Core</span>
          </div>

          {/* Conversations */}
          <div className="flex-1 p-2 space-y-0.5 overflow-hidden">
            {/* Active */}
            <div className="px-2.5 py-2 rounded-lg flex items-center gap-2 bg-white/[0.05] border border-white/[0.04]">
              <div className="w-1 h-1 rounded-full bg-orange-500" />
              <span className="text-[10px] text-zinc-200 truncate font-medium">Q3 Analysis</span>
            </div>
            {['Product Roadmap', 'Budget Review', 'Team Standup'].map((name, i) => (
              <div key={i} className="px-2.5 py-2 rounded-lg flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-zinc-700" />
                <span className="text-[10px] text-zinc-600 truncate">{name}</span>
              </div>
            ))}
          </div>

          {/* User profile */}
          <div className="p-3 border-t border-white/[0.04] flex items-center gap-2">
            <div className="w-6 h-6 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-zinc-500">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="text-[10px] text-zinc-500">User</span>
          </div>
        </div>

        {/* ── Main Chat Area ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-4 h-12 border-b border-white/[0.04] flex items-center justify-between shrink-0">
            <span className="text-[11px] font-medium text-zinc-300">Q3 Analysis</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-zinc-600">Online</span>
            </div>
          </div>

          {/* Messages — mirrors real MessageBubble styling */}
          <div className="flex-1 px-3 py-4 space-y-5 overflow-hidden">
            {/* Document upload chip */}
            {step >= 1 && (
              <div className="message-enter flex justify-start">
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                  style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.12)' }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.15)' }}>
                    <IconUpload size={11} />
                  </div>
                  <div>
                    <span className="text-orange-400 text-[11px]">Q3_Financial_Report.pdf</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-10 h-0.5 rounded-full bg-orange-500/30 overflow-hidden">
                        <div className="w-full h-full bg-orange-500 rounded-full" />
                      </div>
                      <span className="text-[8px] text-emerald-500">Indexed</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User message — matches real: bg-white/10 border-white/10, right-aligned with user avatar */}
            {step >= 2 && (
              <div className="flex gap-2.5 justify-end message-enter">
                <div className="max-w-[80%]">
                  <div className="rounded-2xl px-4 py-3 bg-white/10 border border-white/10 text-white shadow-sm backdrop-blur-sm">
                    <p className="text-[12px] leading-relaxed">{question}</p>
                  </div>
                </div>
                {/* User avatar — same as real */}
                <div className="flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center mt-0.5"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-zinc-500">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
            )}

            {/* Thinking indicator — matches real Processing animation */}
            {step === 3 && (
              <div className="flex gap-2.5 items-start message-enter">
                {/* Chatbot icon placeholder */}
                <div className="flex-shrink-0 w-7 h-7 rounded-xl overflow-hidden mt-0.5"
                  style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.05))', border: '1px solid rgba(249,115,22,0.15)' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <IconBrain size={13} />
                  </div>
                </div>
                <div className="rounded-2xl px-4 py-3 bg-white/[0.04] backdrop-blur-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-white/70 rounded-[3px] animate-spin" style={{ animationDuration: '1.5s' }} />
                    <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 opacity-50">Processing</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI response — matches real: bg-white/[0.04] + Neural Core header */}
            {step >= 4 && (
              <div className="flex gap-2.5 items-start message-enter">
                {/* Chatbot avatar */}
                <div className="flex-shrink-0 w-7 h-7 rounded-xl overflow-hidden mt-0.5"
                  style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.05))', border: '1px solid rgba(249,115,22,0.15)' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <IconBrain size={13} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="rounded-2xl px-4 py-3 bg-white/[0.04] backdrop-blur-xl border border-white/10 text-zinc-200 shadow-xl">
                    {/* Neural Core header — same as real */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" />
                      <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Neural Core</span>
                    </div>
                    <p className="text-white font-semibold text-[12px] mb-1">Q3 Revenue Summary</p>
                    <p className="text-zinc-400 text-[11px] leading-relaxed font-light">
                      Total revenue reached{' '}
                      <span className="text-orange-400 font-semibold">$4.2M</span>
                      , representing a{' '}
                      <span className="text-emerald-400 font-semibold">23% YoY increase</span>
                      . Growth driven by enterprise contracts.
                    </p>
                  </div>

                  {/* Source chip — matches real source-chip styling */}
                  {step >= 5 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5 message-enter">
                      <div className="source-chip inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px]">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="text-zinc-400">Q3_Report.pdf <span className="opacity-70">· Section 2.1</span></span>
                        <span className="px-1 py-0.5 rounded text-[9px] bg-white/5 text-zinc-400 border border-white/5">94%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Input bar — matches real glass-input styling ── */}
          <div className="px-3 py-2.5 border-t border-white/[0.04]">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl glass-input">
              <span className="text-[11px] flex-1 truncate min-h-[16px]" style={{ color: 'var(--text-tertiary)' }}>
                {step < 2 && typedQuestion.length > 0 ? (
                  <span style={{ color: 'var(--text-primary)' }}>
                    {typedQuestion}
                    {typedQuestion.length < question.length && <span className="typing-cursor text-orange-500">|</span>}
                  </span>
                ) : (
                  'Ask about your documents...'
                )}
              </span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
                style={{
                  background: step < 2 && typedQuestion.length === question.length
                    ? 'linear-gradient(135deg, #F97316, #C2410C)'
                    : 'rgba(255,255,255,0.04)',
                  boxShadow: step < 2 && typedQuestion.length === question.length
                    ? '0 0 15px rgba(249,115,22,0.3)'
                    : 'none',
                }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  className={step < 2 && typedQuestion.length === question.length ? 'text-white' : 'text-zinc-600'}>
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── How It Works — Interactive Stepper ───
const STEP_DURATION = 5000;

const stepsData = [
  {
    num: '01',
    title: 'Upload documents',
    subtitle: 'Drop files — done.',
    desc: 'PDF, DOCX, XLSX are automatically split into semantic chunks, embedded, and indexed in your private vector store.',
  },
  {
    num: '02',
    title: 'Ask questions',
    subtitle: 'Natural language.',
    desc: 'No syntax. No boolean operators. Just ask like you\'re talking to a colleague who read every page.',
  },
  {
    num: '03',
    title: 'Get verified answers',
    subtitle: 'Cited. Traceable.',
    desc: 'Every claim links back to an exact source with a relevance score. No guessing. No hallucinations.',
  },
];

function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const startTime = Date.now();
    const raf = { id: 0 };

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / STEP_DURATION, 1);
      setProgress(p);
      if (p < 1) {
        raf.id = requestAnimationFrame(tick);
      } else {
        setActive(prev => (prev + 1) % 3);
      }
    };
    raf.id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.id);
  }, [active]);

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-[600px] opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at right, rgba(249,115,22,1), transparent 70%)' }} />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-orange-500/60 mb-3 block">How it works</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            From document to <span className="gradient-text">insight</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* ── Left: Step tabs ── */}
          <div className="lg:w-[340px] shrink-0 space-y-3">
            {stepsData.map((step, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-full text-left p-5 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden group ${active === i ? 'bg-white/[0.04]' : 'bg-transparent hover:bg-white/[0.02]'
                  }`}
                style={{
                  border: active === i ? '1px solid rgba(249,115,22,0.15)' : '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {/* Progress bar fill — only on active */}
                {active === i && (
                  <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-orange-500 to-orange-600 transition-none"
                    style={{ width: `${progress * 100}%` }} />
                )}

                <div className="flex items-start gap-4">
                  <span className={`text-[11px] font-mono font-bold mt-1 transition-colors ${active === i ? 'text-orange-500' : 'text-zinc-700'
                    }`}>{step.num}</span>
                  <div>
                    <h3 className={`text-[15px] font-semibold mb-0.5 transition-colors ${active === i ? 'text-white' : 'text-zinc-500'
                      }`}>{step.title}</h3>
                    <p className={`text-[12px] transition-colors ${active === i ? 'text-zinc-400' : 'text-zinc-600'
                      }`}>{step.subtitle}</p>
                    {active === i && (
                      <p className="text-[12px] text-zinc-500 mt-2 leading-relaxed">{step.desc}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ── Right: Visual demo with crossfade ── */}
          <div className="flex-1 relative" style={{ minHeight: '380px' }}>
            <div className="rounded-2xl overflow-hidden glass-panel h-full absolute inset-0 p-6 md:p-8">

              {/* All 3 panels rendered, crossfade via opacity + transform */}
              {[0, 1, 2].map((stepIdx) => (
                <div
                  key={stepIdx}
                  className="absolute inset-0 p-6 md:p-8"
                  style={{
                    opacity: active === stepIdx ? 1 : 0,
                    transform: active === stepIdx ? 'translateY(0)' : 'translateY(12px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    pointerEvents: active === stepIdx ? 'auto' : 'none',
                  }}
                >
                  {/* Step 1 Visual — File upload */}
                  {stepIdx === 0 && (
                    <div className="space-y-4">
                      <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-600 mb-6">Document Processing Pipeline</div>

                      {[
                        { name: 'Q3_Financial_Report.pdf', size: '2.4 MB', done: true },
                        { name: 'Employee_Survey.docx', size: '890 KB', done: true },
                        { name: 'Revenue_Data.xlsx', size: '1.1 MB', done: false },
                      ].map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                          }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(249,115,22,0.1)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-orange-500">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] text-zinc-300 truncate">{file.name}</span>
                              <span className="text-[10px] text-zinc-600 ml-2">{file.size}</span>
                            </div>
                            <div className="w-full h-1 rounded-full bg-white/[0.05] overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-1000 ${file.done ? 'bg-orange-500 w-full' : 'bg-orange-500/60 w-[70%]'}`} />
                            </div>
                          </div>
                          <span className={`text-[9px] font-mono shrink-0 ${file.done ? 'text-emerald-500' : 'text-orange-500/60'}`}>
                            {file.done ? 'INDEXED' : 'PROCESSING'}
                          </span>
                        </div>
                      ))}

                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-zinc-500 font-mono">3 documents · 847 chunks · 12,340 vectors ready</span>
                      </div>
                    </div>
                  )}

                  {/* Step 2 Visual — Ask */}
                  {stepIdx === 1 && (
                    <div className="space-y-5">
                      <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-600 mb-6">Semantic Query Engine</div>

                      <div className="rounded-xl p-4"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center gap-3">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600 shrink-0">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          <span className="text-[13px] text-zinc-300">How did Q3 revenue compare to projections?</span>
                          <span className="typing-cursor text-orange-500">|</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-[10px] text-zinc-600 font-mono">Query Analysis</div>
                        <div className="flex flex-wrap gap-2">
                          {['revenue', 'Q3', 'projections', 'comparison'].map((tag) => (
                            <span key={tag} className="px-2.5 py-1 rounded-lg text-[10px] font-mono"
                              style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.12)', color: 'rgba(249,115,22,0.7)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[10px] text-zinc-600 font-mono">Searching 847 chunks across 3 documents...</div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                            <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
                          </div>
                          <span className="text-[10px] text-orange-500 font-mono">12 matches</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 Visual — Answer */}
                  {stepIdx === 2 && (
                    <div className="space-y-4">
                      <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-600 mb-4">Generated Response</div>

                      <div className="rounded-2xl px-5 py-4 bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" />
                          <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Neural Core</span>
                        </div>
                        <p className="text-white font-semibold text-[13px] mb-2">Q3 Revenue vs. Projections</p>
                        <p className="text-zinc-400 text-[12px] leading-relaxed font-light">
                          Q3 actual revenue of <span className="text-orange-400 font-semibold">$4.2M</span> exceeded projections by{' '}
                          <span className="text-emerald-400 font-semibold">12%</span>. Growth was primarily driven by a{' '}
                          <span className="text-zinc-300">34% increase in enterprise contracts</span>, while SMB sector showed a modest 3% decline.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: 'Q3_Financial_Report.pdf', section: 'Section 2.1', score: 94 },
                          { name: 'Revenue_Data.xlsx', section: 'Sheet 3', score: 87 },
                        ].map((src, i) => (
                          <div key={i} className="source-chip inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px]">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span className="text-zinc-400">{src.name} <span className="opacity-70">· {src.section}</span></span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] bg-white/5 border border-white/5 ${src.score > 90 ? 'text-emerald-500' : 'text-orange-400'}`}>{src.score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Landing Page ───
export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ctaHref = isAuthenticated ? '/chat' : '/register';

  return (
    <div className="landing-page min-h-screen">
      {/* ═══ NAVBAR ═══ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(0,0,0,0.7)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
            <span className="text-sm font-semibold tracking-tight text-white">Neural Core</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href={ctaHref}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]"
              style={{ background: 'rgba(249,115,22,0.9)' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Constellation background */}
        <div className="absolute inset-0">
          <NeuralConstellation />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30 pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-zinc-500">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Powered by RAG Architecture
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Your Documents.{' '}
            <span className="gradient-text">One Neural Core.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
            AI-powered deep document analysis with semantic search and contextual reasoning. Upload, ask, understand.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href={ctaHref}
              className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
              style={{ background: 'linear-gradient(135deg, #F97316, #C2410C)' }}
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="px-6 py-3.5 rounded-xl text-sm font-medium text-zinc-400 border border-white/[0.08] hover:border-white/20 hover:text-white transition-all"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600">
          <div className="w-5 h-8 rounded-full border border-zinc-700 flex items-start justify-center p-1.5">
            <div className="w-1 h-1.5 rounded-full bg-zinc-500 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══ LIVE DEMO ═══ */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Watch it <span className="gradient-text">think.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Upload any document — PDFs, Word files, spreadsheets. Ask questions in natural language. Get precise, sourced answers instantly.
            </p>
            <ul className="space-y-3">
              {['Semantic understanding, not keyword matching', 'Every answer traced to its source', 'Handles complex multi-document queries'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                  <span className="text-orange-500"><IconCheck size={16} /></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <LiveDemoCard />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-5x1 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              <ScrambleText text="Intelligence at Every Layer" speed={15} />
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto">Three pillars that make Neural Core different from every other chatbot.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <IconSearch size={22} />,
                title: 'Semantic Search',
                desc: 'Find answers by meaning, not keywords. Our vector embeddings understand context, synonyms, and intent.',
              },
              {
                icon: <IconLayers size={22} />,
                title: 'Multi-Doc Analysis',
                desc: 'Cross-reference multiple documents simultaneously. Connect insights across your entire knowledge base.',
              },
              {
                icon: <IconLink size={22} />,
                title: 'Source Citations',
                desc: 'Every answer is traced back to its exact source. No hallucinations — just verified, referenced facts.',
              },
            ].map((feature, idx) => (
              <SpotlightCard
                key={idx}
                className="p-7 rounded-2xl bg-[#0a0a0e]/60 border border-white/[0.05] backdrop-blur-xl cursor-default group"
                spotlightColor="rgba(249,115,22,0.06)"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] text-zinc-400 group-hover:text-orange-500 transition-colors mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — Interactive Stepper ═══ */}
      <HowItWorksSection />

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative py-32 px-6">
        <div className="max-w-2xl mx-auto text-center relative">
          {/* Glow */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)' }} />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Ready to analyze<br />your documents? 
          </h2>
          <p className="text-zinc-400 mb-10 text-lg">Create a free account and start asking questions.</p>
          <Link
            href={ctaHref}
            className="inline-block px-10 py-4 rounded-xl text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]"
            style={{ background: 'linear-gradient(135deg, #F97316, #C2410C)' }}
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.04] py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-600 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500/40" />
            Neural Core v1.0
          </div>
          <p className="text-xs text-zinc-700">Built with Spring Boot, Next.js & AI</p>
        </div>
      </footer>
    </div>
  );
}
