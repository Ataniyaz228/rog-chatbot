'use client';

import { motion } from 'framer-motion';

export default function NexusLens() {
    return (
        <div className="relative w-[320px] h-[320px] flex items-center justify-center group pointer-events-none">

            {/* Outer Magnetic Field (Slow rotating dash array) */}
            <motion.div
                className="absolute inset-0 rounded-full border-[1px] border-white/10"
                style={{ borderStyle: 'dashed' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute inset-8 rounded-full border-[1px] border-zinc-500/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            >
                {/* Alignment marks */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-zinc-600" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-zinc-600" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-[2px] bg-zinc-600" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-[2px] bg-zinc-600" />
            </motion.div>

            {/* Deep Dynamic Light Source (The Energy Core) */}
            <div className="absolute w-56 h-56 rounded-full overflow-hidden blur-[40px] opacity-70 mix-blend-screen transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-100">
                <motion.div
                    className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,#ffffff_20%,transparent_40%,#52525b_60%,transparent_80%)]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* The Lens / Quantum Housing */}
            <div className="relative z-10 w-48 h-48 rounded-full border border-white/20 bg-[#09090b]/40 backdrop-blur-2xl shadow-[inset_0_0_50px_rgba(255,255,255,0.05),0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden transition-all duration-700 pointer-events-auto cursor-pointer group-hover:border-white/40">

                {/* Surface Reflection Line */}
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-full pointer-events-none transform -rotate-12" />

                {/* Secondary inner glass ring */}
                <div className="absolute inset-3 rounded-full border border-white/10 bg-white/[0.02]" />
                <div className="absolute inset-8 rounded-full border border-white/5 border-dashed" />

                {/* The Singularity / Aperture */}
                <motion.div
                    className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_10px_rgba(255,255,255,0.3)] transition-all duration-700 group-hover:shadow-[0_0_60px_20px_rgba(255,255,255,0.5)]"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {/* Technical aperture grid */}
                    <div className="absolute inset-1 rounded-full border-[1.5px] border-[#09090b] border-dashed opacity-40" />
                    <div className="absolute inset-[6px] rounded-full border-[1px] border-[#09090b] opacity-80" />

                    {/* Dark center abyss */}
                    <div className="w-5 h-5 bg-[#09090b] rounded-full shadow-[inset_0_0_8px_rgba(0,0,0,1)] relative overflow-hidden">
                        <motion.div
                            className="absolute w-[200%] h-[1px] bg-white/30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            animate={{ rotate: [45, 225] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </motion.div>

                {/* Sweeping scan line inside the lens */}
                <motion.div
                    className="absolute left-0 right-0 top-[-50%] h-[50%] bg-gradient-to-b from-transparent to-white/10 pointer-events-none"
                    animate={{ top: ['100%', '-50%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Depth Particles (Orbital focus blur) */}
            <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute top-[15%] left-[25%] w-2 h-2 bg-white rounded-full blur-[1px] opacity-80 shadow-[0_0_10px_rgba(255,255,255,1)]" />
                <div className="absolute bottom-[20%] right-[30%] w-3 h-3 bg-zinc-400 rounded-full blur-[3px] opacity-50" />
                <div className="absolute bottom-[40%] left-[10%] w-1.5 h-1.5 bg-white rounded-full opacity-30" />
            </motion.div>

            {/* Counter-rotating sharp particles */}
            <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute top-[35%] right-[15%] w-1 h-1 bg-white rounded-full opacity-90 shadow-[0_0_5px_rgba(255,255,255,1)]" />
            </motion.div>
        </div>
    );
}
