'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface TickingNumberProps {
    value: number;
    durationMs?: number;
    delayMs?: number;
    className?: string;
}

export default function TickingNumber({ value, durationMs = 2000, delayMs = 0, className = "" }: TickingNumberProps) {
    const [hasMounted, setHasMounted] = useState(false);

    const spring = useSpring(0, {
        stiffness: 50,
        damping: 20,
        mass: 1,
        restDelta: 0.001
    });

    const display = useTransform(spring, (current) => Math.floor(current));

    useEffect(() => {
        setHasMounted(true);
        const timer = setTimeout(() => {
            spring.set(value);
        }, delayMs);
        return () => clearTimeout(timer);
    }, [value, delayMs, spring]);

    if (!hasMounted) {
        return <span className={className}>0</span>;
    }

    return <motion.span className={className}>{display}</motion.span>;
}
