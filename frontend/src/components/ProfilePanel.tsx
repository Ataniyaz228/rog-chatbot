'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    IconSettings as Settings,
    IconSave as Save,
    IconAlertTriangle as AlertTriangle,
    IconLogOut as LogOut,
    IconChevronRight as ChevronRight,
} from './icons';
import type { Conversation, DocumentInfo } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import SpotlightCard from './SpotlightCard';
import ScrambleText from './ScrambleText';
import FrostedOrb from './FrostedOrb';
import HoldButton from './HoldButton';
import TickingNumber from './TickingNumber';

interface ProfilePanelProps {
    conversations: Conversation[];
    documents: DocumentInfo[];
    onClearData: () => void;
}

// ── Custom geometric mini-icons (monochrome, original) ──

function IconThreads({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="13" cy="8" r="1" fill="currentColor" opacity="0.4" />
        </svg>
    );
}

function IconCube({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M8 14V8M8 8L2 5.5M8 8L14 5.5" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        </svg>
    );
}

function IconPulse({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M1 8h3l2-4 2 8 2-4h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconWave({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M2 10c1-3 2.5-3 3.5 0s2.5 3 3.5 0 2.5-3 3.5 0 2 3 3 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    );
}

function IconLock({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
            <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="8" cy="10.5" r="1" fill="currentColor" />
        </svg>
    );
}

function IconGrid({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
            <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
            <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
            <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" opacity="0.4" />
        </svg>
    );
}

// Stagger animation presets
import { Variants } from 'framer-motion';

const stagger: { container: Variants; item: Variants } = {
    container: {
        animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
    },
    item: {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
    }
};

export default function ProfilePanel({
    conversations,
    documents,
    onClearData
}: ProfilePanelProps) {
    const { user, logout } = useAuth();
    const [name, setName] = useState(user?.username || 'User');
    const [role, setRole] = useState('AI Explorer');
    const [isEditing, setIsEditing] = useState(false);

    // Settings state
    const [notifications, setNotifications] = useState(true);
    const [dataSharing, setDataSharing] = useState(false);

    // Calculate total messages
    const totalMessages = conversations.reduce((acc, c) => acc + (c.messages?.length || 0), 0);

    // Sync name from auth context when it loads
    useEffect(() => {
        if (user?.username) setName(user.username);
    }, [user?.username]);

    // Load preferences from local storage (not name — that comes from auth)
    useEffect(() => {
        const savedRole = localStorage.getItem('rag_userrole');
        const savedNotifs = localStorage.getItem('rag_notifs');
        const savedSharing = localStorage.getItem('rag_sharing');

        if (savedRole) setRole(savedRole);
        if (savedNotifs) setNotifications(savedNotifs === 'true');
        if (savedSharing) setDataSharing(savedSharing === 'true');
    }, []);

    const handleSaveProfile = () => {
        localStorage.setItem('rag_username', name);
        localStorage.setItem('rag_userrole', role);
        setIsEditing(false);
    };

    const handleToggleNotifs = () => {
        const newVal = !notifications;
        setNotifications(newVal);
        localStorage.setItem('rag_notifs', String(newVal));
    };

    const handleToggleSharing = () => {
        const newVal = !dataSharing;
        setDataSharing(newVal);
        localStorage.setItem('rag_sharing', String(newVal));
    };

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto relative font-sans">

            {/* Subtle ambient background - completely transparent so Vanta flows under */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute inset-0 bg-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(255,255,255,0.01)_0%,transparent_60%)]" />
            </div>

            <motion.div
                variants={stagger.container}
                initial="initial"
                animate="animate"
                className="max-w-4xl mx-auto w-full relative z-10 px-6 py-10 md:px-12"
            >
                {/* ═══════════════════════════════════════════════ */}
                {/* HERO BANNER                                     */}
                {/* ═══════════════════════════════════════════════ */}
                <motion.div variants={stagger.item} className="relative mb-10">
                    <div className="relative rounded-3xl overflow-hidden border border-white/[0.06]" style={{ background: 'linear-gradient(160deg, #131313 0%, #0e0e0e 40%, #0a0a0a 100%)' }}>
                        {/* Subtle animated mesh */}
                        <div className="absolute inset-0 overflow-hidden">
                            <motion.div
                                animate={{ x: [0, 30, 0], y: [0, -15, 0], opacity: [0.4, 0.6, 0.4] }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-16 -left-16 w-48 h-48 rounded-full"
                                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }}
                            />
                            <motion.div
                                animate={{ x: [0, -20, 0], y: [0, 10, 0], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full"
                                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)' }}
                            />
                        </div>

                        {/* Banner content */}
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
                            {/* Avatar */}
                            <div className="shrink-0 relative group">
                                <FrostedOrb />
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="absolute -bottom-1 -right-1 bg-[#18181b] border border-white/10 rounded-full p-2 text-zinc-500 hover:text-orange-500 transition-all cursor-pointer shadow-xl opacity-0 group-hover:opacity-100 hover:scale-110"
                                    >
                                        <Settings size={12} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSaveProfile}
                                        className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-2 hover:bg-orange-400 transition-all cursor-pointer shadow-xl hover:scale-110"
                                    >
                                        <Save size={12} />
                                    </button>
                                )}
                            </div>

                            {/* Identity */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="bg-transparent border-b border-white/20 text-2xl font-semibold text-white focus:outline-none focus:border-white/50 w-full max-w-[200px] text-center md:text-left transition-colors font-sans pb-1"
                                            autoFocus
                                        />
                                    ) : (
                                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                                            <ScrambleText text={name} speed={20} />
                                        </h1>
                                    )}
                                    <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold tracking-wider text-orange-500">PRO</span>
                                </div>

                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="bg-transparent border-b border-white/10 text-sm text-zinc-500 focus:outline-none focus:border-white/30 tracking-wide w-full max-w-[200px] text-center md:text-left mt-1 transition-colors pb-1"
                                    />
                                ) : (
                                    <p className="text-sm text-zinc-500 tracking-wide mt-0.5">{role}</p>
                                )}

                                {/* Status line */}
                                <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                                    <span className="text-xs text-zinc-600">Neural Core Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ═══════════════════════════════════════════════ */}
                {/* STATS GRID                                      */}
                {/* ═══════════════════════════════════════════════ */}
                <motion.div variants={stagger.item} className="mb-8">
                    <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-widest pl-1 mb-4">Telemetry</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Stat 1: Conversations */}
                        <SpotlightCard className="p-5 rounded-2xl bg-[#0e0e11]/60 border border-white/[0.05] backdrop-blur-xl group cursor-default" spotlightColor="rgba(255,255,255,0.03)">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] group-hover:bg-white/[0.06] transition-colors text-zinc-400">
                                    <IconThreads size={16} />
                                </div>
                                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Threads</span>
                            </div>
                            <div className="text-3xl font-light text-zinc-200 mb-1">
                                <TickingNumber value={conversations.length} delayMs={200} />
                            </div>
                            <p className="text-xs text-zinc-600">Conversation history</p>
                        </SpotlightCard>

                        {/* Stat 2: Indexed Files */}
                        <SpotlightCard className="p-5 rounded-2xl bg-[#0e0e11]/60 border border-white/[0.05] backdrop-blur-xl group cursor-default" spotlightColor="rgba(255,255,255,0.03)">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] group-hover:bg-white/[0.06] transition-colors text-zinc-400">
                                    <IconCube size={16} />
                                </div>
                                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Indexed</span>
                            </div>
                            <div className="text-3xl font-light text-zinc-200 mb-1">
                                <TickingNumber value={documents.length} delayMs={400} />
                            </div>
                            <p className="text-xs text-zinc-600">Knowledge base</p>
                        </SpotlightCard>

                        {/* Stat 3: Total Messages */}
                        <SpotlightCard className="p-5 rounded-2xl bg-[#0e0e11]/60 border border-white/[0.05] backdrop-blur-xl group cursor-default" spotlightColor="rgba(255,255,255,0.03)">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] group-hover:bg-white/[0.06] transition-colors text-zinc-400">
                                    <IconPulse size={16} />
                                </div>
                                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Messages</span>
                            </div>
                            <div className="text-3xl font-light text-zinc-200 mb-1">
                                <TickingNumber value={totalMessages} delayMs={600} />
                            </div>
                            <p className="text-xs text-zinc-600">Total interactions</p>
                        </SpotlightCard>
                    </div>
                </motion.div>

                {/* ═══════════════════════════════════════════════ */}
                {/* ACTIVITY FEED                                   */}
                {/* ═══════════════════════════════════════════════ */}
                <motion.div variants={stagger.item} className="mb-8">
                    <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-widest pl-1 mb-4">Recent Activity</h2>
                    <div className="bg-[#0e0e11]/50 border border-white/[0.05] rounded-2xl backdrop-blur-xl overflow-hidden">
                        {conversations.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="text-zinc-600 mx-auto mb-3 w-5 h-5 flex items-center justify-center">
                                    <IconGrid size={20} />
                                </div>
                                <p className="text-sm text-zinc-500">No conversations yet</p>
                                <p className="text-xs text-zinc-600 mt-1">Start chatting to see your history here</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.03]">
                                {conversations.slice(0, 5).map((conv, idx) => (
                                    <motion.div
                                        key={conv.id || idx}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 + 0.3 }}
                                        className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/[0.05] shrink-0 text-zinc-500">
                                            <IconThreads size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-zinc-300 truncate">
                                                {conv.title || `Conversation ${idx + 1}`}
                                            </p>
                                            <p className="text-xs text-zinc-600 mt-0.5">
                                                {conv.messages?.length || 0} messages
                                            </p>
                                        </div>
                                        <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-500 transition-colors shrink-0" />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ═══════════════════════════════════════════════ */}
                {/* PREFERENCES                                     */}
                {/* ═══════════════════════════════════════════════ */}
                <motion.div variants={stagger.item} className="mb-8">
                    <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-widest pl-1 mb-4">Preferences</h2>
                    <div className="bg-[#0e0e11]/50 border border-white/[0.05] rounded-2xl backdrop-blur-xl overflow-hidden divide-y divide-white/[0.03]">
                        {/* Notifications */}
                        <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] text-zinc-400">
                                    <IconWave size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-zinc-200">System Notifications</h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">Receive audio cues for tasks</p>
                                </div>
                            </div>
                            <MinimalToggle checked={notifications} onChange={handleToggleNotifs} />
                        </div>

                        {/* Telemetry */}
                        <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] text-zinc-400">
                                    <IconLock size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-zinc-200">Data Analytics</h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">Help improve our models</p>
                                </div>
                            </div>
                            <MinimalToggle checked={dataSharing} onChange={handleToggleSharing} />
                        </div>
                    </div>
                </motion.div>

                {/* ═══════════════════════════════════════════════ */}
                {/* DANGER ZONE                                     */}
                {/* ═══════════════════════════════════════════════ */}
                <motion.div variants={stagger.item} className="mb-8">
                    <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-widest pl-1 mb-4">Security</h2>

                    <div className="rounded-2xl overflow-hidden border border-white/[0.04]" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.02) 0%, #0e0e11 100%)' }}>
                        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] shrink-0 mt-0.5 text-zinc-500">
                                    <AlertTriangle size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-zinc-300 mb-1">Local Data Wipe</h3>
                                    <p className="text-xs text-zinc-600 leading-relaxed max-w-sm">
                                        Permanently delete all your local settings, cached vector indices, and history. This action cannot be reversed.
                                    </p>
                                </div>
                            </div>

                            <div className="w-full sm:w-[180px] shrink-0">
                                <HoldButton
                                    text="Hold to Wipe"
                                    holdDurationMs={2000}
                                    onHoldComplete={() => {
                                        localStorage.removeItem('rag_username');
                                        localStorage.removeItem('rag_userrole');
                                        localStorage.removeItem('rag_notifs');
                                        localStorage.removeItem('rag_sharing');
                                        onClearData();
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full mt-4 p-4 rounded-xl text-sm font-medium text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2 cursor-pointer group"
                    >
                        <LogOut size={16} className="group-hover:translate-x-[-2px] transition-transform" /> Sign Out
                    </button>
                </motion.div>

                {/* Footer */}
                <motion.div variants={stagger.item} className="py-6 text-center border-t border-white/[0.03]">
                    <p className="text-xs text-zinc-700">Neural Core v1.0 — RAG Engine</p>
                </motion.div>

            </motion.div>
        </div>
    );
}

// Minimalist monochrome toggle
function MinimalToggle({ checked, onChange }: { checked: boolean, onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className="w-11 h-6 rounded-full relative transition-colors duration-500 outline-none cursor-pointer"
            style={{
                background: checked ? '#ffffff' : 'rgba(255,255,255,0.08)',
                border: '1px solid',
                borderColor: checked ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)',
                boxShadow: checked ? '0 0 12px rgba(255,255,255,0.1)' : 'none'
            }}
        >
            <motion.div
                className="w-4 h-4 rounded-full absolute top-[3px]"
                animate={{ left: checked ? '22px' : '4px' }}
                style={{
                    backgroundColor: checked ? '#000000' : '#52525b',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        </button>
    );
}
