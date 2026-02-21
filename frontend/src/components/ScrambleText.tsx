'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ScrambleTextProps extends HTMLMotionProps<"span"> {
    text: string;
    speed?: number;
    delay?: number;
    scrambleCharacters?: string;
    className?: string;
    triggerOnHover?: boolean;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

export default function ScrambleText({
    text,
    speed = 30,
    delay = 0,
    scrambleCharacters = DEFAULT_CHARS,
    className = '',
    triggerOnHover = false,
    ...props
}: ScrambleTextProps) {
    const [displayText, setDisplayText] = useState('');
    const [isScrambling, setIsScrambling] = useState(false);
    const frameRef = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scramble = () => {
        if (isScrambling) return;
        setIsScrambling(true);

        let frame = 0;
        const totalFrames = text.length * 6; // Much longer duration for the effect to be highly noticeable

        const animate = () => {
            let n = '';
            for (let i = 0; i < text.length; i++) {
                // If this character has resolved
                if (frame >= i * 6) {
                    n += text[i];
                } else {
                    n += scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)];
                }
            }

            setDisplayText(n);

            if (frame < totalFrames) {
                frame++;
                timeoutRef.current = setTimeout(() => {
                    frameRef.current = requestAnimationFrame(animate);
                }, speed);
            } else {
                setDisplayText(text);
                setIsScrambling(false);
            }
        };

        if (delay > 0) {
            setTimeout(() => {
                frameRef.current = requestAnimationFrame(animate);
            }, delay);
        } else {
            frameRef.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        // ALWAYS scramble on mount
        scramble();

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [text]);

    return (
        <motion.span
            className={`inline-block font-mono ${className}`}
            onMouseEnter={() => triggerOnHover && scramble()}
            {...props}
        >
            {displayText || text}
        </motion.span>
    );
}
