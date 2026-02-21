import React from 'react';
import { motion } from 'framer-motion';

type IconComponent = React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;

interface IconWrapperProps {
    icon: IconComponent;
    color?: 'indigo' | 'violet' | 'cyan' | 'rose' | 'emerald' | 'amber' | string;
    size?: number;
    className?: string;
}

export default function IconWrapper({
    icon: Icon,
    color = 'indigo',
    size = 20,
    className = ''
}: IconWrapperProps) {
    const colorMap: Record<string, { bg: string, text: string, shadow: string }> = {
        indigo: {
            bg: 'rgba(99, 102, 241, 0.15)',
            text: '#818cf8',
            shadow: '0 0 15px rgba(99, 102, 241, 0.3)'
        },
        violet: {
            bg: 'rgba(139, 92, 246, 0.15)',
            text: '#a78bfa',
            shadow: '0 0 15px rgba(139, 92, 246, 0.3)'
        },
        cyan: {
            bg: 'rgba(6, 182, 212, 0.15)',
            text: '#22d3ee',
            shadow: '0 0 15px rgba(6, 182, 212, 0.3)'
        },
        rose: {
            bg: 'rgba(244, 63, 94, 0.15)',
            text: '#fb7185',
            shadow: '0 0 15px rgba(244, 63, 94, 0.3)'
        },
        emerald: {
            bg: 'rgba(16, 185, 129, 0.15)',
            text: '#34d399',
            shadow: '0 0 15px rgba(16, 185, 129, 0.3)'
        },
        amber: {
            bg: 'rgba(245, 158, 11, 0.15)',
            text: '#fbbf24',
            shadow: '0 0 15px rgba(245, 158, 11, 0.3)'
        },
    };

    const scheme = colorMap[color] || {
        bg: 'rgba(255, 255, 255, 0.1)',
        text: color,
        shadow: 'none'
    };

    return (
        <div
            className={`relative flex items-center justify-center rounded-xl p-2 ${className}`}
            style={{
                background: scheme.bg,
                boxShadow: scheme.shadow,
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
        >
            <Icon size={size} style={{ color: scheme.text }} className="relative z-10" />
            <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{
                    boxShadow: [
                        `inset 0 0 0px ${scheme.text}20`,
                        `inset 0 0 10px ${scheme.text}40`,
                        `inset 0 0 0px ${scheme.text}20`,
                    ]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
}
