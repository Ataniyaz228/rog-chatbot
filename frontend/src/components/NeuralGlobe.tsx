'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function NeuralGlobe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;
        let mouseX = 0;
        let mouseY = 0;
        let targetRotateX = 0;
        let targetRotateY = 0;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = width * 0.4;

        // Fibonacci sphere point distribution
        const numParticles = 1000;
        const particles: { x: number, y: number, z: number, originalX: number, originalY: number, originalZ: number, size: number, pulseOffset: number }[] = [];
        const phi = Math.PI * (3 - Math.sqrt(5));

        for (let i = 0; i < numParticles; i++) {
            const y = 1 - (i / (numParticles - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;

            particles.push({
                x, y, z,
                originalX: x, originalY: y, originalZ: z,
                size: Math.random() * 1.2 + 0.3,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }

        const render = () => {
            time += 0.003;
            // Clear with transparent background to allow CSS underlay
            ctx.clearRect(0, 0, width, height);

            // Smooth interpolation towards mouse
            targetRotateX += (mouseX - targetRotateX) * 0.05;
            targetRotateY += (mouseY - targetRotateY) * 0.05;

            // Combine base rotation with mouse interaction
            const rotX = time * 0.5 + targetRotateY * 0.5;
            const rotY = time + targetRotateX * 0.5;

            const cx = Math.cos(rotX), sx = Math.sin(rotX);
            const cy = Math.cos(rotY), sy = Math.sin(rotY);

            // 3D Projection & Rotation
            const projected = particles.map(p => {
                const currentSize = p.size * (1 + 0.4 * Math.sin(time * 10 + p.pulseOffset));

                // Rotate around X
                let y1 = p.originalY * cx - p.originalZ * sx;
                let z1 = p.originalY * sx + p.originalZ * cx;

                // Rotate around Y
                let x2 = p.originalX * cy + z1 * sy;
                let z2 = -p.originalX * sy + z1 * cy;

                // Scale up
                const px = x2 * radius;
                const py = y1 * radius;
                const pz = z2 * radius;

                // Simple perspective calculation
                const perspective = 400 / (400 + pz);

                return {
                    x: centerX + px * perspective,
                    y: centerY + py * perspective,
                    z: pz,
                    perspective,
                    size: currentSize,
                };
            });

            // Painters algorithm: sort particles back to front
            projected.sort((a, b) => b.z - a.z);

            projected.forEach(p => {
                // Determine opacity based on depth
                const depthAlpha = Math.max(0.02, Math.min(1, (p.z + radius) / (radius * 2)));

                // Draw glow only for front particles to save performance
                if (depthAlpha > 0.6) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha * 0.15})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * p.perspective * 3.5, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha})`;
                } else {
                    ctx.fillStyle = `rgba(150, 150, 170, ${depthAlpha * 0.4})`;
                }

                // Core particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.perspective, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            // Normalize to -1 to 1
            mouseX = x / (rect.width / 2);
            mouseY = y / (rect.height / 2);
        };

        const handleMouseLeave = () => {
            mouseX = 0;
            mouseY = 0;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <motion.div
            className="relative w-[340px] h-[340px] flex items-center justify-center group"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Deep Ambient Glow */}
            <div className="absolute inset-0 bg-white/[0.015] rounded-full blur-[60px] pointer-events-none transition-all duration-700 group-hover:bg-white/[0.03] group-hover:blur-[80px]" />

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair"
                style={{ width: '340px', height: '340px' }}
            />

            {/* Elegant Inner Core Container */}
            <div className="absolute w-20 h-20 rounded-full border border-white/5 bg-[#09090b]/40 backdrop-blur-md flex items-center justify-center pointer-events-none overflow-hidden transition-transform duration-700 group-hover:scale-110">
                {/* Core gradient sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 rounded-full" />

                {/* Rotating scanner */}
                <div className="absolute w-[200%] h-[200%] animate-[spin_8s_linear_infinite] opacity-50">
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_180deg,rgba(255,255,255,0.1)_360deg)]" />
                </div>

                {/* Pulsing center star */}
                <div className="relative z-10 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_4px_rgba(255,255,255,0.8)] animate-pulse" />
            </div>
        </motion.div>
    );
}
