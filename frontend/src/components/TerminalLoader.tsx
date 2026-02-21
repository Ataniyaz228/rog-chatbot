'use client';

import { useState, useEffect, useRef } from 'react';

interface TerminalLoaderProps {
    text?: string;
}

export default function TerminalLoader({ text = "PROCESSING" }: TerminalLoaderProps) {
    const [display, setDisplay] = useState('');
    const chars = '01#$&*@%¥€';
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        let frame = 0;

        const animate = () => {
            frame++;

            // Core glitching random prefix
            const prefixLen = Math.floor(Math.random() * 3) + 1;
            let glitch = '';
            for (let i = 0; i < prefixLen; i++) {
                glitch += chars[Math.floor(Math.random() * chars.length)];
            }

            // Flashing block cursor
            const showCursor = frame % 20 < 10;
            const block = showCursor ? '█' : ' ';

            // "Processing... " with animated dots based on time
            const dots = ['.', '..', '...'][(Math.floor(frame / 15)) % 3];

            setDisplay(`[${glitch}] ${text}${dots}${block}`);

            // Slow down the framerate intentionally for that retro terminal feel
            if (frame % 3 === 0) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    animationRef.current = requestAnimationFrame(animate);
                }, 30);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [text]);

    return (
        <span
            className="font-mono text-xs font-bold tracking-widest inline-block"
            style={{
                color: 'var(--text-primary)',
                textShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
            }}
        >
            {display}
        </span>
    );
}
