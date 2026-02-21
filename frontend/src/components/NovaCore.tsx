'use client';
import { motion } from 'framer-motion';

export default function NovaCore() {
    return (
        <div className="relative w-40 h-40 flex items-center justify-center" style={{ perspective: '800px' }}>
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-white/5 rounded-full blur-[50px] pointer-events-none" />

            {/* Rotating 3D Rings */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-full h-full border border-white/[0.06] rounded-full"
                        style={{
                            rotateX: 70,
                            rotateZ: i * 30, // static initial offset
                        }}
                        animate={{
                            rotateZ: [i * 30, i * 30 + 360], // Rotates 360 degrees from its initial offset
                        }}
                        transition={{
                            duration: 24,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {/* Shimmering particle on the track */}
                        <motion.div
                            className="absolute -top-[1.5px] left-1/2 -ml-[1.5px] w-[3px] h-[3px] bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]"
                            animate={{ opacity: [0.1, 1, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Central Core */}
            <motion.div
                className="relative z-10 w-20 h-20 flex items-center justify-center cursor-pointer group"
                whileHover={{ scale: 1.05 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Diffuse outer glow */}
                <div className="absolute inset-0 bg-white/10 rounded-full blur-xl pointer-events-none transition-all duration-500 group-hover:bg-white/20" />

                {/* Dense inner glass */}
                <div className="absolute inset-2 bg-white/[0.05] border border-white/10 backdrop-blur-md rounded-full pointer-events-none" />

                {/* Pure white core center */}
                <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_30px_15px_rgba(255,255,255,0.15)] pointer-events-none" />

                {/* Sophisticated SVG Star floating in the center */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" className="opacity-90" />
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
}
