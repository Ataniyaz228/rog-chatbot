'use client';

import { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IconCopy as Copy, IconCheck as Check, IconUser as User, IconFile as FileText } from './icons';
import Image from 'next/image';
import chatbotIcon from '@/icons/chatbot.png';
import type { SourceReference } from '@/lib/api';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    sources?: SourceReference[];
    timestamp?: string;
    isLoading?: boolean;
}

function MessageBubble({
    role,
    content,
    sources,
    timestamp,
    isLoading,
}: MessageBubbleProps) {
    const [copied, setCopied] = useState(false);
    const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
    const [expandedSource, setExpandedSource] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyCode = useCallback((code: string, index: number) => {
        navigator.clipboard.writeText(code);
        setCopiedBlock(index);
        setTimeout(() => setCopiedBlock(null), 2000);
    }, []);

    const isUser = role === 'user';

    let codeBlockIndex = 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex gap-4 py-6 px-2 md:px-4 group relative ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            {/* Assistant Avatar */}
            {!isUser && (
                <div className="flex-shrink-0 mt-1">
                    <Image
                        src={chatbotIcon}
                        alt="Assistant"
                        width={32}
                        height={32}
                        className="rounded-xl"
                    />
                </div>
            )}

            {/* Content */}
            <div className={`max-w-[85%] md:max-w-[75%] min-w-0 ${isUser ? 'order-first' : ''}`}>
                <div
                    className={`rounded-2xl px-5 py-4 ${isUser ? 'bg-white/10 border border-white/10 text-white shadow-sm backdrop-blur-sm' : 'bg-white/[0.04] backdrop-blur-xl border border-white/10 text-zinc-200 shadow-xl'}`}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-3 py-2 px-1">
                            <motion.div
                                className="w-3.5 h-3.5 bg-white/70"
                                animate={{
                                    scale: [1, 1.4, 1],
                                    rotate: [0, 90, 180],
                                    borderRadius: ["20%", "50%", "20%"]
                                }}
                                transition={{
                                    duration: 1.5,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                }}
                            />
                            <span className="text-xs font-mono tracking-widest uppercase opacity-50 text-zinc-400">
                                Processing
                            </span>
                        </div>
                    ) : isUser ? (
                        <p className="text-[15px] leading-relaxed font-normal">
                            {content}
                        </p>
                    ) : (
                        <div
                            className="markdown-content text-[15px] leading-relaxed font-light text-zinc-300 space-y-4"
                        >
                            {/* Assistant Header */}
                            {!isUser && (
                                <div className="text-[11px] font-medium mb-3 tracking-wide text-zinc-500 uppercase">
                                    Neural Core
                                </div>
                            )}

                            <ReactMarkdown
                                components={{
                                    code({ className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const codeString = String(children).replace(/\n$/, '');
                                        const isInline = !match && !codeString.includes('\n');

                                        if (isInline) {
                                            return (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }

                                        const lang = match ? match[1] : 'text';
                                        const currentIndex = codeBlockIndex++;

                                        return (
                                            <div
                                                className="relative rounded-xl overflow-hidden my-4 border border-white/5 bg-[#09090b]"
                                            >
                                                {/* Header bar */}
                                                <div
                                                    className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5"
                                                >
                                                    <span
                                                        className="text-[11px] font-mono text-zinc-500"
                                                    >
                                                        {lang}
                                                    </span>
                                                    <button
                                                        onClick={() => handleCopyCode(codeString, currentIndex)}
                                                        className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-all duration-300 cursor-pointer ${copiedBlock === currentIndex ? 'text-emerald-400 bg-emerald-400/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]'}`}
                                                    >
                                                        {copiedBlock === currentIndex ? (
                                                            <>
                                                                <Check size={12} />
                                                                Copied
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy size={12} />
                                                                Copy
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                                {/* Code */}
                                                <SyntaxHighlighter
                                                    style={coldarkDark}
                                                    language={lang}
                                                    PreTag="div"
                                                    customStyle={{
                                                        margin: 0,
                                                        padding: '1.25em 1.5em',
                                                        background: 'transparent',
                                                        fontSize: '13px',
                                                        lineHeight: '1.7',
                                                        borderRadius: 0,
                                                    }}
                                                    codeTagProps={{
                                                        style: {
                                                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                                                        },
                                                    }}
                                                >
                                                    {codeString}
                                                </SyntaxHighlighter>
                                            </div>
                                        );
                                    },
                                    pre({ children }) {
                                        return <>{children}</>;
                                    },
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Sources */}
                {sources && sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {sources.map((source, idx) => (
                            <button
                                key={idx}
                                onClick={() =>
                                    setExpandedSource(expandedSource === idx ? null : idx)
                                }
                                className="source-chip inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs cursor-pointer"
                            >
                                <FileText size={11} style={{ color: 'var(--accent)' }} />
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    {source.documentName}
                                    {source.section && (
                                        <span style={{ opacity: 0.7 }}> • {source.section}</span>
                                    )}
                                </span>
                                <span
                                    className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-zinc-400 border border-white/5"
                                >
                                    {Math.round(source.relevanceScore * 100)}%
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Expanded source */}
                {expandedSource !== null && sources && sources[expandedSource] && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 rounded-xl p-3 text-xs"
                        style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        <p className="leading-relaxed">{sources[expandedSource].snippet}</p>
                    </motion.div>
                )}

                {/* Bottom bar */}
                <div className="flex items-center justify-between mt-1.5 px-1 relative">
                    {timestamp && (
                        <motion.span
                            initial={{ opacity: 0, x: isUser ? 10 : -10 }}
                            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : (isUser ? 10 : -10) }}
                            transition={{ duration: 0.2 }}
                            className={`text-xs absolute ${isUser ? 'right-0 -bottom-6' : 'left-0 -bottom-6'}`}
                            style={{ color: 'var(--text-tertiary)', fontSize: '11px', whiteSpace: 'nowrap' }}
                        >
                            {new Date(timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </motion.span>
                    )}
                    {!isUser && !isLoading && (
                        <button
                            onClick={handleCopy}
                            className="p-1 rounded-md transition-all duration-150 cursor-pointer"
                            style={{ color: copied ? 'var(--success)' : 'var(--text-tertiary)' }}
                            onMouseEnter={(e) => {
                                if (!copied) e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                            onMouseLeave={(e) => {
                                if (!copied) e.currentTarget.style.color = 'var(--text-tertiary)';
                            }}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    )}
                </div>
            </div>

            {/* User Avatar */}
            {isUser && (
                <div
                    className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-1"
                    style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                    }}
                >
                    <User size={15} style={{ color: 'var(--text-secondary)' }} />
                </div>
            )}
        </motion.div>
    );
}

export default memo(MessageBubble);
