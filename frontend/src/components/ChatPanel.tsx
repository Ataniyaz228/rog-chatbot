'use client';

import { useRef, useEffect, useState, FormEvent, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { IconSend as Send, IconPaperclip as Paperclip, IconFile as FileText, IconUpload as Upload, IconSearch as Search, IconThreads as MessageSquare, IconPlus as Plus, IconNetwork as Network, IconCpu as Cpu, IconFileSearch as FileSearch } from './icons';
import MessageBubble from './MessageBubble';
import DocumentUpload from './DocumentUpload';
import IconWrapper from './IconWrapper';
import RippleButton from './RippleButton';
import SpotlightCard from './SpotlightCard';
import ScanningBadge from './ScanningBadge';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import GenkubRobot from './GenkubRobot';
import type { Message, DocumentInfo } from '@/lib/api';

interface ChatPanelProps {
    messages: Message[];
    isLoading: boolean;
    onSend: (message: string) => void;
    conversationId: string;
    documents: DocumentInfo[];
    onDocumentUploaded: (doc: DocumentInfo) => void;
    onDocumentDeleted: (id: string) => void;
}

// Features and suggestion arrays removed in favor of hardcoded asymmetrical layout components

export default function ChatPanel({
    messages,
    isLoading,
    onSend,
    conversationId,
    documents,
    onDocumentUploaded,
    onDocumentDeleted,
}: ChatPanelProps) {
    const [input, setInput] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Auto-grow textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + 'px';
        }
    }, [input]);

    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSend(input.trim());
        setInput('');
    }, [input, isLoading, onSend]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as FormEvent);
        }
    }, [handleSubmit]);

    const isEmpty = messages.length === 0;

    return (
        <div className="flex-1 flex flex-col h-full relative rounded-2xl glass-panel shadow-2xl" style={{ overflow: 'clip' }}>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto pb-40" ref={scrollRef}>
                <div className="min-h-full flex flex-col">
                    {isEmpty ? (
                        <div className="h-full flex-1 flex flex-col items-center justify-center px-6 py-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="text-center max-w-xl"
                            >
                                {/* 3D Robot Hero Area */}
                                <div className="flex justify-center mb-0 h-[260px] md:h-[280px] w-full relative z-[50] group">
                                    <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} style={{ background: 'transparent' }}>
                                        <ambientLight intensity={0.6} />
                                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

                                        {/* Environment mapping for realistic reflections */}
                                        <Environment preset="city" />

                                        <group position={[0, 0.1, 0]}>
                                            <GenkubRobot scale={2.6} />
                                        </group>

                                        <ContactShadows position={[0, -0.4, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />

                                        <OrbitControls
                                            enableZoom={false}
                                            enablePan={false}
                                            minPolarAngle={Math.PI / 2.5}
                                            maxPolarAngle={Math.PI / 1.8}
                                            minAzimuthAngle={-Math.PI / 4}
                                            maxAzimuthAngle={Math.PI / 4}
                                        />
                                    </Canvas>
                                </div>

                                <motion.h1
                                    className="text-3xl font-bold mb-1 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-500 inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Neural Core
                                </motion.h1>
                                <p
                                    className="text-sm leading-relaxed mb-3"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Upload documents and ask questions about their content.
                                    <br />
                                    Powered by AI with intelligent document analysis.
                                </p>

                                {/* Asymmetrical Bento Box */}
                                <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
                                    {/* Main Large Card */}
                                    <SpotlightCard className="md:col-span-8 p-5 rounded-[24px] flex flex-col justify-between text-left group cursor-pointer bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500" spotlightColor="rgba(255, 255, 255, 0.05)" onClick={() => {
                                        setInput("Analyze my uploaded documents");
                                        inputRef.current?.focus();
                                    }}>
                                        <div>
                                            <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-orange-500/5 border border-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                                                <Network size={20} className="text-orange-500/80 group-hover:text-orange-400 transition-colors" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-zinc-100 transition-colors">Deep Document Analysis</h3>
                                            <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300">
                                                Upload complex PDFs, CSVs, or text. The RAG engine creates a semantic vector space for hyper-specific cross-file queries.
                                            </p>
                                        </div>
                                    </SpotlightCard>

                                    {/* Side Stacked Cards */}
                                    <div className="md:col-span-4 flex flex-col gap-3">
                                        <SpotlightCard className="flex-1 p-5 rounded-[24px] flex flex-col justify-center items-start group cursor-pointer bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500" spotlightColor="rgba(255, 255, 255, 0.05)" onClick={() => {
                                            setInput("Explain the core concepts briefly");
                                            inputRef.current?.focus();
                                        }}>
                                            <Cpu size={20} className="mb-3 text-orange-500/70 group-hover:text-orange-400 transition-colors" />
                                            <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-white">Quick Synthesize</h4>
                                        </SpotlightCard>

                                        <SpotlightCard className="flex-1 p-5 rounded-[24px] flex flex-col justify-center items-start group cursor-pointer bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500" spotlightColor="rgba(255, 255, 255, 0.05)" onClick={() => {
                                            setInput("Find the most important metrics");
                                            inputRef.current?.focus();
                                        }}>
                                            <FileSearch size={20} className="mb-3 text-orange-500/70 group-hover:text-orange-400 transition-colors" />
                                            <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-white">Data Extraction</h4>
                                        </SpotlightCard>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto w-full px-6">
                            {messages.map((msg, idx) => (
                                <MessageBubble
                                    key={`${msg.role}-${msg.timestamp || idx}-${idx}`}
                                    role={msg.role}
                                    content={msg.content}
                                    sources={msg.sources}
                                    timestamp={msg.timestamp}
                                />
                            ))}
                            {isLoading && (
                                <MessageBubble role="assistant" content="" isLoading={true} />
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Panel */}
            <AnimatePresence>
                {showUpload && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        className="absolute bottom-28 left-1/2 -translate-x-1/2 w-full max-w-md z-10 p-5 rounded-3xl border bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                Documents
                            </h3>
                            <button
                                onClick={() => setShowUpload(false)}
                                className="text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer hover:bg-white/5"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                Close
                            </button>
                        </div>
                        <DocumentUpload
                            conversationId={conversationId}
                            documents={documents}
                            onDocumentUploaded={onDocumentUploaded}
                            onDocumentDeleted={onDocumentDeleted}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Document badges */}
            {documents.length > 0 && (
                <div className="max-w-4xl mx-auto w-full px-6">
                    <div className="flex items-center gap-2 py-2">
                        <div className="flex flex-wrap gap-1.5">
                            {documents.map((doc) => (
                                <ScanningBadge
                                    key={doc.id}
                                    className="px-2.5 py-1 rounded-lg text-xs"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: 'var(--text-secondary)',
                                    }}
                                >
                                    <FileText size={11} />
                                    {doc.name}
                                </ScanningBadge>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Island Input */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-30 group pointer-events-none">
                <SpotlightCard
                    className="w-full rounded-[2rem] shadow-2xl pointer-events-auto"
                    spotlightColor="rgba(255, 255, 255, 0.03)"
                >
                    <form
                        onSubmit={handleSubmit}
                        className="w-full flex items-end gap-3 p-2.5 rounded-[2rem] border relative overflow-hidden transition-all duration-500 bg-[#09090b]/40 backdrop-blur-2xl"
                        style={{
                            borderColor: input.trim() ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.05)',
                            boxShadow: input.trim() ? '0 8px 32px rgba(249,115,22,0.1)' : '0 10px 40px rgba(0,0,0,0.8)'
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setShowUpload(!showUpload)}
                            className={`p-2.5 rounded-2xl transition-all duration-300 flex-shrink-0 cursor-pointer ${showUpload ? 'bg-white/10 text-white' : 'bg-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                        >
                            <Paperclip size={20} />
                        </button>

                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message Neural Core..."
                            rows={1}
                            className="flex-1 bg-transparent outline-none resize-none text-[15px] py-3 px-2 leading-relaxed text-zinc-200 placeholder:text-zinc-600 font-sans"
                            style={{
                                maxHeight: '160px',
                            }}
                        />

                        <RippleButton
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            whileTap={{ scale: 0.95 }}
                            className={`p-2.5 rounded-[14px] transition-all duration-300 flex-shrink-0 cursor-pointer flex items-center justify-center relative z-10 ${input.trim() ? 'bg-orange-500 text-white hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-white/5 text-zinc-500'}`}
                            style={{
                                opacity: isLoading ? 0.5 : 1,
                            }}
                        >
                            <Send size={18} className={input.trim() ? "translate-x-[1px] -translate-y-[1px]" : ""} />
                        </RippleButton>
                    </form>
                </SpotlightCard>
                <p
                    className="text-center mt-4 opacity-40 font-medium tracking-widest uppercase"
                    style={{ fontSize: '10px' }}
                >
                    Neural Core v2.0
                </p>
            </div>
        </div>
    );
}
