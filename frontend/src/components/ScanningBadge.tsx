'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScanningBadgeProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export default function ScanningBadge({ children, className = '', style = {} }: ScanningBadgeProps) {
    return (
        <span
            className={`relative overflow-hidden inline-flex items-center ${className}`}
            style={{
                ...style,
                isolation: 'isolate', // Ensure hardware acceleration and z-indexing
            }}
        >
            {/* The Badge Content */}
            <span className="relative z-10 flex items-center gap-1.5">{children}</span>

            {/* Laser Scan Line */}
            <motion.div
                initial={{ left: '-50%' }}
                animate={{ left: '150%' }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2 + 1, // Random delay between 1 and 3 seconds
                    ease: "linear",
                }}
                className="absolute top-0 bottom-0 w-8 z-20 pointer-events-none"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                    transform: 'skewX(-20deg)',
                    filter: 'blur(2px)' // Glow effect
                }}
            />

            {/* Base Highlight to make the scan stick out */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.1, 0] }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2 + 1,
                    ease: "linear",
                }}
                className="absolute inset-0 z-0 pointer-events-none"
                style={{ background: 'var(--text-primary)' }}
            />
        </span>
    );
}
