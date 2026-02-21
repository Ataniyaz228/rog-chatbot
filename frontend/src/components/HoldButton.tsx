'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { IconTrash as Trash2, IconWarning as AlertTriangle } from './icons';

interface HoldButtonProps {
    onHoldComplete: () => void;
    holdDurationMs?: number;
    text?: string;
}

export default function HoldButton({
    onHoldComplete,
    holdDurationMs = 1500,
    text = "Hold to Confirm"
}: HoldButtonProps) {
    const [isHolding, setIsHolding] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const holdTimer = useRef<NodeJS.Timeout | null>(null);
    const controls = useAnimation();
    const progress = useMotionValue(0);

    const startHold = () => {
        if (isComplete) return;
        setIsHolding(true);

        // Reset progress
        progress.set(0);

        // Animate the fill
        controls.start({
            width: "100%",
            transition: { duration: holdDurationMs / 1000, ease: "linear" }
        });

        // Start the timer
        holdTimer.current = setTimeout(() => {
            setIsComplete(true);
            setIsHolding(false);
            onHoldComplete();
        }, holdDurationMs);
    };

    const cancelHold = () => {
        if (isComplete) return;
        setIsHolding(false);

        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }

        // Snap back to 0
        controls.stop();
        controls.start({
            width: "0%",
            transition: { duration: 0.3, ease: "easeOut" }
        });
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (holdTimer.current) clearTimeout(holdTimer.current);
        };
    }, []);

    if (isComplete) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold overflow-hidden relative border"
                style={{
                    background: 'rgba(239, 68, 68, 0.2)', // Very red
                    color: '#EF4444',
                    borderColor: '#EF4444',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
                }}
            >
                <AlertTriangle size={18} className="animate-pulse" />
                <span>Action Confirmed</span>
                <div className="absolute inset-0 bg-red-500/20 mix-blend-overlay animate-[shimmer_1s_infinite]" />
            </motion.div>
        );
    }

    return (
        <motion.button
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden group select-none ${isHolding ? 'cursor-wait' : 'cursor-pointer'}`}
            style={{
                background: 'rgba(248, 113, 113, 0.05)',
                color: 'var(--error)',
                border: '1px solid rgba(248, 113, 113, 0.2)'
            }}
        >
            {/* The fill background */}
            <motion.div
                className="absolute left-0 top-0 bottom-0 bg-red-500 z-0 origin-left"
                initial={{ width: "0%" }}
                animate={controls}
                style={{
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
                }}
            />

            {/* Glitch Overlay while holding - REMOVED FOR MINIMALISM */}

            <div className="relative z-20 flex items-center gap-2 mix-blend-screen drop-shadow-md">
                <Trash2 size={16} />
                <span>{isHolding ? 'Hold to Confirm...' : text}</span>
            </div>

            {/* Warning outline that pulses when hovered but not held */}
            {!isHolding && (
                <div className="absolute inset-0 border border-red-500/0 rounded-xl group-hover:border-red-500/50 transition-colors duration-300 pointer-events-none" />
            )}
        </motion.button>
    );
}
