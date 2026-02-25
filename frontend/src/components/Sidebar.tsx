'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IconPlus as Plus,
    IconThreads as MessageSquare,
    IconTrash as Trash2,
    IconSearch as Search,
    IconFile as FileText,
    IconChevronLeft as ChevronLeft,
    IconSparkles as Sparkles,
    IconUser as User
} from './icons';
import Image from 'next/image';
import chatbotIcon from '@/icons/chatbot.png';
import RippleButton from './RippleButton';
import type { Conversation } from '@/lib/api';

interface SidebarProps {
    conversations: Conversation[];
    activeId: string | null;
    onSelect: (id: string) => void;
    onNew: () => void;
    onDelete: (id: string) => void;
    collapsed: boolean;
    onToggle: () => void;
    onProfileClick: () => void;
}

function getTimeGroup(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return 'This Week';
    if (days < 30) return 'This Month';
    return 'Older';
}

export default function Sidebar({
    conversations,
    activeId,
    onSelect,
    onNew,
    onDelete,
    collapsed,
    onToggle,
    onProfileClick,
}: SidebarProps) {
    const [search, setSearch] = useState('');

    const filtered = conversations.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    const grouped = useMemo(() => {
        const groups: Record<string, Conversation[]> = {};
        filtered.forEach((conv) => {
            const group = getTimeGroup(conv.updatedAt || conv.createdAt || new Date().toISOString());
            if (!groups[group]) groups[group] = [];
            groups[group].push(conv);
        });
        return groups;
    }, [filtered]);

    const groupOrder = ['Today', 'Yesterday', 'This Week', 'This Month', 'Older'];

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 68 : 280 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="h-full flex flex-col relative overflow-hidden shrink-0 z-20"
            style={{
                background: 'rgba(9, 9, 11, 0.4)', /* Ultra dark minimalist */
                borderRight: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 h-16">
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2.5"
                        >
                            <Image
                                src={chatbotIcon}
                                alt="RAG Chat"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                            <span
                                className="font-semibold text-sm tracking-tight"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                RAG Chat
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <RippleButton
                    onClick={onToggle}
                    className="p-2 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                    <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronLeft size={16} style={{ color: 'var(--text-tertiary)' }} />
                    </motion.div>
                </RippleButton>
            </div>

            {/* New Chat Button */}
            <div className="px-4 mb-4 mt-2 w-full">
                <RippleButton
                    onClick={onNew}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer border border-white/5 text-zinc-300 bg-white/[0.02] hover:bg-white/[0.06] hover:text-white"
                >
                    <Plus size={16} />
                    {!collapsed && <span>New Conversation</span>}
                </RippleButton>
            </div>

            {/* Search */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 mb-4"
                    >
                        <div
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-black/20 border border-white/5"
                        >
                            <Search size={14} className="text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent outline-none w-full text-sm text-zinc-300 placeholder:text-zinc-600"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Conversations with time groups */}
            <div className="flex-1 overflow-y-auto px-2 py-1">
                {!collapsed ? (
                    <>
                        {groupOrder.map((group) => {
                            const items = grouped[group];
                            if (!items || items.length === 0) return null;
                            return (
                                <div key={group} className="mb-3">
                                    <p
                                        className="text-xs font-medium px-2 py-1.5 uppercase tracking-wider"
                                        style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}
                                    >
                                        {group}
                                    </p>
                                    <AnimatePresence>
                                        {items.map((conv) => (
                                            <motion.div
                                                key={conv.id}
                                                layout
                                                role="button"
                                                tabIndex={0}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{
                                                    opacity: [1, 1, 0],
                                                    scale: [1, 0.95, 0.8],
                                                    y: [0, -10, 40],
                                                    rotateX: [0, -20, -60],
                                                    filter: ["blur(0px)", "blur(2px)", "blur(10px)"],
                                                    transition: { duration: 0.4, ease: "anticipate" }
                                                }}
                                                onClick={() => onSelect(conv.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 text-left transition-all duration-300 group cursor-pointer relative overflow-hidden`}
                                                style={{
                                                    background: activeId === conv.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (activeId !== conv.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (activeId !== conv.id) e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                {/* Minimal Active Indicator */}
                                                {activeId === conv.id && (
                                                    <motion.div
                                                        layoutId="activeSidebarIndicator"
                                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[40%] bg-orange-500 rounded-r-full"
                                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                    />
                                                )}

                                                {activeId === conv.id ? (
                                                    <div className="active-dot flex-shrink-0 ml-1" />
                                                ) : (
                                                    <MessageSquare
                                                        size={14}
                                                        className={`flex-shrink-0 ${activeId === conv.id ? 'text-white' : 'text-zinc-500'}`}
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className={`text-sm truncate transition-colors ${activeId === conv.id ? 'text-orange-400' : 'text-zinc-400 group-hover:text-zinc-300'}`}
                                                    >
                                                        {conv.title}
                                                    </p>
                                                    <p
                                                        className="text-[11px] mt-0.5 text-zinc-600"
                                                    >
                                                        {conv.messages.length} msgs
                                                        {conv.documentIds.length > 0 && (
                                                            <span className="inline-flex items-center gap-1 ml-2">
                                                                <FileText size={9} />
                                                                {conv.documentIds.length}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(conv.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all duration-150 cursor-pointer"
                                                    style={{ color: 'var(--text-tertiary)' }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                        {filtered.length === 0 && (
                            <div
                                className="text-center py-8 text-sm"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                No conversations yet
                            </div>
                        )}
                    </>
                ) : (
                    <AnimatePresence>
                        {filtered.map((conv) => (
                            <motion.button
                                key={conv.id}
                                layout
                                onClick={() => onSelect(conv.id)}
                                className="w-full flex items-center justify-center p-2.5 rounded-xl mb-0.5 cursor-pointer"
                                style={{
                                    background: activeId === conv.id ? 'var(--bg-tertiary)' : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                    if (activeId !== conv.id) e.currentTarget.style.background = 'var(--bg-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    if (activeId !== conv.id) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {activeId === conv.id ? (
                                    <div className="active-dot" />
                                ) : (
                                    <MessageSquare size={16} style={{ color: 'var(--text-tertiary)' }} />
                                )}
                            </motion.button>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Bottom Badge */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-3"
                    >
                        <div
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs bg-white/[0.02] border border-white/5 text-zinc-500"
                        >
                            <Sparkles size={12} className="text-zinc-400" />
                            <span>Neural Core v2</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Bottom Button */}
            <div className="p-3">
                <button
                    onClick={onProfileClick}
                    className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} p-2 rounded-xl transition-all duration-300 cursor-pointer text-zinc-400 hover:text-white hover:bg-white/[0.03] group`}
                >
                    <div className="p-1.5 rounded-lg flex-shrink-0 bg-white/[0.02] border border-white/5 group-hover:bg-white/10 transition-colors">
                        <User size={16} className="text-zinc-300" />
                    </div>
                    {!collapsed && (
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-medium truncate text-zinc-200">Profile</p>
                            <p className="text-[11px] truncate text-zinc-500">Settings & Stats</p>
                        </div>
                    )}
                </button>
            </div>
        </motion.aside>
    );
}
