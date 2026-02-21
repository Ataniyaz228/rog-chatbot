'use client';

import { motion } from 'framer-motion';

export default function FrostedOrb() {
    return (
        <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Soft background glow */}
            <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full" />

            {/* The Orb */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-full rounded-full border border-white/10"
                style={{
                    background: 'radial-gradient(130% 130% at 30% 20%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 100%)',
                    boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                {/* Inner highlight simulating glass reflection */}
                <div className="absolute top-0 left-1/2 w-16 h-8 -translate-x-1/2 rounded-full bg-white/5 blur-sm mix-blend-overlay" />

                {/* Secondary highlight */}
                <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/10 blur-md mix-blend-overlay" />
            </motion.div>

            {/* Slow pulsing core indicator */}
            <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-3 h-3 bg-white/80 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] blur-[0.5px]"
            />
        </div>
    );
}
