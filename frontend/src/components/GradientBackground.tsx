'use client';

export default function GradientBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[var(--bg-primary)]">
            {/* Elegant moving monochrome gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full mix-blend-screen animate-float-slow"
                style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 60%)',
                    filter: 'blur(100px)',
                    animationDuration: '15s',
                }}
            />
            <div className="absolute top-[30%] right-[-10%] w-[60%] h-[60%] rounded-full mix-blend-screen animate-breathe"
                style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 60%)',
                    filter: 'blur(120px)',
                    animationDuration: '20s',
                }}
            />
            <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full mix-blend-screen animate-float-slow"
                style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.015) 0%, transparent 60%)',
                    filter: 'blur(90px)',
                    animationDuration: '18s',
                    animationDelay: '2s',
                }}
            />
        </div>
    );
}
