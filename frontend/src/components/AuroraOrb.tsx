'use client';

import { motion } from 'framer-motion';

export default function AuroraOrb() {
    return (
        <div className="relative w-48 h-48 flex items-center justify-center perspective-1000">
            {/* Outer ambient glow */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    filter: 'blur(24px)',
                }}
            />

            {/* Morphing fluid gradient shape 1 */}
            <motion.div
                animate={{
                    rotate: [0, 360],
                    borderRadius: ["50% 50% 50% 50%", "40% 60% 70% 30%", "30% 70% 40% 60%", "60% 40% 30% 70%", "50% 50% 50% 50%"],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute w-32 h-32 opacity-70"
                style={{
                    background: 'conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0.05) 0deg, rgba(255,255,255,0.5) 180deg, rgba(255,255,255,0.05) 360deg)',
                    filter: 'blur(8px)',
                }}
            />

            {/* Morphing fluid gradient shape 2 (Counter rotating) */}
            <motion.div
                animate={{
                    rotate: [360, 0],
                    borderRadius: ["50% 50% 50% 50%", "60% 40% 30% 70%", "30% 70% 40% 60%", "40% 60% 70% 30%", "50% 50% 50% 50%"],
                    scale: [0.9, 1.1, 0.9],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-28 h-28 opacity-60"
                style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 65%)',
                    filter: 'blur(4px)',
                    mixBlendMode: 'overlay'
                }}
            />

            {/* Core Solid Light */}
            <motion.div
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-16 h-16 bg-white rounded-full z-10"
                style={{
                    boxShadow: '0 0 50px rgba(255,255,255,0.9), inset 0 0 20px rgba(0,0,0,0.1)',
                    filter: 'blur(1px)'
                }}
            />

            {/* Tech Rings (Adds the "AI" structural feel over the organic orb) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20" style={{ perspective: '800px' }}>
                <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-44 h-44 rounded-full"
                    style={{
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderTopColor: 'rgba(255,255,255,0.5)',
                        transformStyle: 'preserve-3d',
                        rotateX: 65,
                        rotateZ: -20
                    }}
                />
                <motion.div
                    animate={{ rotateY: [360, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute w-40 h-40 rounded-full"
                    style={{
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderBottomColor: 'rgba(255,255,255,0.4)',
                        transformStyle: 'preserve-3d',
                        rotateX: 70,
                        rotateZ: 40
                    }}
                />
            </div>
        </div>
    );
}
