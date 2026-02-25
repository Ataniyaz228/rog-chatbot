'use client';

import { useEffect, useRef } from 'react';

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    brightness: number;
    targetBrightness: number;
    pulsePhase: number;
}

interface Particle {
    x: number;
    y: number;
    fromNode: number;
    toNode: number;
    progress: number;
    speed: number;
    opacity: number;
}

export default function NeuralConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = 0, h = 0;
        const nodes: Node[] = [];
        const particles: Particle[] = [];
        const NODE_COUNT = 60;
        const PARTICLE_COUNT = 15;
        const CONNECTION_DIST = 180;
        const MOUSE_RADIUS = 250;

        const resize = () => {
            w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        const initNodes = () => {
            nodes.length = 0;
            const cw = canvas.offsetWidth;
            const ch = canvas.offsetHeight;
            for (let i = 0; i < NODE_COUNT; i++) {
                nodes.push({
                    x: Math.random() * cw,
                    y: Math.random() * ch,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.5 + 0.5,
                    brightness: 0.15,
                    targetBrightness: 0.15,
                    pulsePhase: Math.random() * Math.PI * 2,
                });
            }
        };

        const initParticles = () => {
            particles.length = 0;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                spawnParticle();
            }
        };

        const spawnParticle = () => {
            const from = Math.floor(Math.random() * nodes.length);
            let to = Math.floor(Math.random() * nodes.length);
            if (to === from) to = (to + 1) % nodes.length;
            particles.push({
                x: nodes[from]?.x || 0,
                y: nodes[from]?.y || 0,
                fromNode: from,
                toNode: to,
                progress: 0,
                speed: 0.003 + Math.random() * 0.005,
                opacity: 0.4 + Math.random() * 0.4,
            });
        };

        const draw = () => {
            const cw = canvas.offsetWidth;
            const ch = canvas.offsetHeight;
            ctx.clearRect(0, 0, cw, ch);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const time = Date.now() * 0.001;

            // Update & draw nodes
            for (const node of nodes) {
                node.x += node.vx;
                node.y += node.vy;
                if (node.x < 0 || node.x > cw) node.vx *= -1;
                if (node.y < 0 || node.y > ch) node.vy *= -1;
                node.x = Math.max(0, Math.min(cw, node.x));
                node.y = Math.max(0, Math.min(ch, node.y));

                // Mouse influence
                const dx = mx - node.x;
                const dy = my - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                node.targetBrightness = dist < MOUSE_RADIUS
                    ? 0.15 + 0.85 * (1 - dist / MOUSE_RADIUS)
                    : 0.15;
                node.brightness += (node.targetBrightness - node.brightness) * 0.05;

                // Pulse
                const pulse = Math.sin(time * 1.5 + node.pulsePhase) * 0.1 + 0.9;
                const alpha = node.brightness * pulse;

                // Glow
                if (node.brightness > 0.3) {
                    const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 20);
                    grad.addColorStop(0, `rgba(249, 115, 22, ${alpha * 0.15})`);
                    grad.addColorStop(1, 'rgba(249, 115, 22, 0)');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Node dot
                ctx.fillStyle = node.brightness > 0.3
                    ? `rgba(249, 115, 22, ${alpha})`
                    : `rgba(255, 255, 255, ${alpha * 0.6})`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius * (1 + node.brightness * 0.5), 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        const opacity = (1 - dist / CONNECTION_DIST) * 0.12;
                        const bright = Math.max(nodes[i].brightness, nodes[j].brightness);
                        if (bright > 0.3) {
                            ctx.strokeStyle = `rgba(249, 115, 22, ${opacity * bright * 2})`;
                        } else {
                            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        }
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Update & draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.progress += p.speed;
                if (p.progress >= 1) {
                    particles.splice(i, 1);
                    spawnParticle();
                    continue;
                }
                const from = nodes[p.fromNode];
                const to = nodes[p.toNode];
                if (!from || !to) continue;
                p.x = from.x + (to.x - from.x) * p.progress;
                p.y = from.y + (to.y - from.y) * p.progress;

                const fadeIn = Math.min(p.progress * 5, 1);
                const fadeOut = Math.min((1 - p.progress) * 5, 1);
                const alpha = p.opacity * fadeIn * fadeOut;

                ctx.fillStyle = `rgba(249, 115, 22, ${alpha * 0.6})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            animRef.current = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        resize();
        initNodes();
        initParticles();
        animRef.current = requestAnimationFrame(draw);

        window.addEventListener('resize', () => { resize(); initNodes(); initParticles(); });
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'auto' }}
        />
    );
}
