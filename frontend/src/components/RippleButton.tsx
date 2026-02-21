'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';

interface RippleButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children: React.ReactNode;
}

export default function RippleButton({
    children,
    className = '',
    ...props
}: RippleButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = ref.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = { x, y, id: Date.now() };
        setRipples((prev) => [...prev, newRipple]);

        if (props.onClick) {
            props.onClick(e);
        }
    };

    return (
        <motion.button
            ref={ref}
            whileTap={{ scale: 0.95 }}
            className={`relative overflow-hidden ${className}`}
            onClick={handleClick}
            style={{
                ...props.style
            }}
            {...props}
        >
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.span
                        key={ripple.id}
                        initial={{ opacity: 0.8, scale: 0 }}
                        animate={{ opacity: 0, scale: 5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        onAnimationComplete={() => {
                            setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
                        }}
                        className="absolute pointer-events-none rounded-full"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            width: 80,
                            height: 80,
                            transform: 'translate(-50%, -50%)',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                            boxShadow: '0 0 20px rgba(255,255,255,0.5)',
                            filter: 'blur(2px)'
                        }}
                    />
                ))}
            </AnimatePresence>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                {children}
            </div>
        </motion.button>
    );
}
