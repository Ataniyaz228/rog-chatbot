'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

export default function NeuralCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        let mouseX = -1000;
        let mouseY = -1000;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const numParticles = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 10000), 150); // density control

            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5, // Slow movement
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 1.5 + 0.5
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];

                // Connect particles to each other
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = dx * dx + dy * dy;

                    if (dist < 15000) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 - dist / 300000})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Connect particles to mouse
                const dxMouse = p1.x - mouseX;
                const dyMouse = p1.y - mouseY;
                const distMouse = dxMouse * dxMouse + dyMouse * dyMouse;

                if (distMouse < 30000) {
                    ctx.beginPath();
                    // Stronger connection to the mouse
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - distMouse / 200000})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();

                    // Subtle magnetic pull towards mouse
                    p1.vx -= dxMouse * 0.0001;
                    p1.vy -= dyMouse * 0.0001;
                }
            }

            // Update and draw particles
            for (const p of particles) {
                // Friction
                p.vx *= 0.99;
                p.vy *= 0.99;

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Brownian motion baseline
                p.vx += (Math.random() - 0.5) * 0.05;
                p.vy += (Math.random() - 0.5) * 0.05;

                // Speed limit
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > 2) {
                    p.vx = (p.vx / speed) * 2;
                    p.vy = (p.vy / speed) * 2;
                }

                // Bounce off edges smoothly
                if (p.x < 0) p.vx += 0.1;
                if (p.x > canvas.width) p.vx -= 0.1;
                if (p.y < 0) p.vy += 0.1;
                if (p.y > canvas.height) p.vy -= 0.1;

                // Draw dot
                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 255, 255, 0.4)`;
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleMouseLeave = () => {
            mouseX = -1000;
            mouseY = -1000;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ width: '100vw', height: '100vh', mixBlendMode: 'screen' }}
        />
    );
}
