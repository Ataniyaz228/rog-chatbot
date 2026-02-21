'use client';

import { motion } from 'framer-motion';

export default function NeuralCore() {
    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-full rounded-full"
                style={{
                    border: '1px dashed rgba(255,255,255,0.1)',
                }}
            />

            {/* Middle Ring - Counter Rotating */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-24 h-24 rounded-full"
                style={{
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)'
                }}
            />

            {/* Inner Core */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    boxShadow: '0 0 30px rgba(255,255,255,0.1)'
                }}
            >
                <div className="w-4 h-4 rounded-full bg-white opacity-90 blur-[1px]" />
            </motion.div>

            {/* Floating Particles around the core */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [-10, 10, -10],
                        x: Math.random() * 20 - 10,
                        scale: [0.5, 1, 0.5],
                        opacity: [0.2, 0.8, 0.2]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                        top: `${40 + Math.random() * 20}%`,
                        left: `${40 + Math.random() * 20}%`,
                        filter: 'blur(0.5px)'
                    }}
                />
            ))}
        </div>
    );
}
