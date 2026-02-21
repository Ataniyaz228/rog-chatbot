'use client';

import { useEffect, useState, useRef } from 'react';

// Generates a smooth SVG path from a series of points
const createCurve = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        path += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
    }
    path += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    return path;
};

export default function CursorHalo() {
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
    const requestRef = useRef<number>(0);
    const mousePos = useRef({ x: 0, y: 0 });
    const pointsRef = useRef<{ x: number; y: number }[]>([]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', handleMouseMove);

        const updateTrail = () => {
            // Add current mouse position to exactly follow head
            pointsRef.current.push({ ...mousePos.current });

            // Keep only the last N points (adjust for tail length)
            if (pointsRef.current.length > 20) {
                pointsRef.current.shift();
            }

            // Smoothly interpolate points to move them towards the mouse (giving an elastic line feel)
            for (let i = 0; i < pointsRef.current.length - 1; i++) {
                pointsRef.current[i].x += (pointsRef.current[i + 1].x - pointsRef.current[i].x) * 0.4;
                pointsRef.current[i].y += (pointsRef.current[i + 1].y - pointsRef.current[i].y) * 0.4;
            }

            setPoints([...pointsRef.current]);
            requestRef.current = requestAnimationFrame(updateTrail);
        };

        requestRef.current = requestAnimationFrame(updateTrail);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    if (points.length < 2) return null;

    return (
        <svg
            className="fixed inset-0 pointer-events-none z-[100]"
            style={{ width: '100vw', height: '100vh' }}
        >
            <defs>
                <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
                    <stop offset="80%" stopColor="rgba(255, 255, 255, 0.4)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path
                d={createCurve(points)}
                fill="none"
                stroke="url(#trailGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#glow)"
                style={{
                    opacity: 1,
                    transition: 'opacity 0.2s',
                    mixBlendMode: 'difference'
                }}
            />
        </svg>
    );
}
