'use client';

// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
// Custom Geometric Icon Library
// Monochrome, minimal, hand-drawn SVG icons for Neural Core
// All icons accept: size (default 16), className (for color/styling)
// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ

interface IconProps {
    size?: number;
    className?: string;
    style?: React.CSSProperties;
}

// в”Ђв”Ђ Chat / Message icons в”Ђв”Ђ

export function IconThreads({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="13" cy="8" r="1" fill="currentColor" opacity="0.4" />
        </svg>
    );
}

export function IconSend({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M14 2L7 9M14 2L10 14L7 9M14 2L2 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconCopy({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3 11V3.5A1.5 1.5 0 014.5 2H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

export function IconCheck({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// в”Ђв”Ђ File / Document icons в”Ђв”Ђ

export function IconFile({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M4 2h5l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M9 2v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconFileCode({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M4 2h5l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M6 10l-1 1.5L6 13M10 10l1 1.5L10 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        </svg>
    );
}

export function IconFileSpreadsheet({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M4 2h5l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M6 9h4M6 11.5h4M8 8v5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
        </svg>
    );
}

export function IconUpload({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M8 10V3M8 3L5 6M8 3L11 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 11v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

// в”Ђв”Ђ Navigation / Action icons в”Ђв”Ђ

export function IconPlus({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function IconSearch({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.3" />
            <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    );
}

export function IconTrash({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M3 4h10M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M4 4l1 10h6l1-10" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M7 7v4M9 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
    );
}

export function IconChevronLeft({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconChevronRight({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconX({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

export function IconSettings({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
    );
}

export function IconSave({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M3 2h8l3 3v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M5 2v3h5V2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <rect x="5" y="9" width="6" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
    );
}

export function IconLogOut({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M10 8H3M6 5L3 8L6 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 2h3a1 1 0 011 1v10a1 1 0 01-1 1h-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

export function IconAlertTriangle({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M8 2L1 14h14L8 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M8 6v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="8" cy="12" r="0.5" fill="currentColor" />
        </svg>
    );
}

// в”Ђв”Ђ User / Profile icons в”Ђв”Ђ

export function IconUser({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

// в”Ђв”Ђ Status icons в”Ђв”Ђ

export function IconWarning({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M8 6v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.6" fill="currentColor" />
        </svg>
    );
}

export function IconCheckCircle({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5.5 8L7.5 10L11 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconAlertCircle({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.6" fill="currentColor" />
        </svg>
    );
}

export function IconLoader({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M8 2v2M8 12v2M2 8h2M12 8h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.3" />
            <path d="M4.22 4.22l1.42 1.42M10.36 10.36l1.42 1.42" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
            <path d="M4.22 11.78l1.42-1.42M10.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    );
}

// в”Ђв”Ђ Decorative / Feature icons в”Ђв”Ђ

export function IconCube({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M8 14V8M8 8L2 5.5M8 8L14 5.5" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        </svg>
    );
}

export function IconPulse({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M1 8h3l2-4 2 8 2-4h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconWave({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M2 10c1-3 2.5-3 3.5 0s2.5 3 3.5 0 2.5-3 3.5 0 2 3 3 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    );
}

export function IconLock({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="8" cy="10.5" r="1" fill="currentColor" />
        </svg>
    );
}

export function IconGrid({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
            <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
            <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
            <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" opacity="0.4" />
        </svg>
    );
}

export function IconNetwork({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <circle cx="8" cy="4" r="2" stroke="currentColor" strokeWidth="1.1" />
            <circle cx="4" cy="12" r="2" stroke="currentColor" strokeWidth="1.1" />
            <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.1" />
            <path d="M8 6v1.5M6.5 10.5L7 8M9.5 10.5L9 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
    );
}

export function IconCpu({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <rect x="6" y="6" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <path d="M6 2v2M10 2v2M6 12v2M10 12v2M2 6h2M2 10h2M12 6h2M12 10h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        </svg>
    );
}

export function IconFileSearch({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M4 2h5l4 4v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 14V3a1 1 0 011-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="10.5" cy="11.5" r="2.5" stroke="currentColor" strokeWidth="1.1" />
            <path d="M12.5 13.5L14 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

export function IconPaperclip({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M10.5 5L6 9.5a1.5 1.5 0 002.12 2.12L13 6.5a3 3 0 00-4.24-4.24L3.5 7.5A4.5 4.5 0 009.86 13.86" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

export function IconSparkles({ size = 16, className, style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
            <path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M4 4l1.5 1.5M10.5 10.5L12 12M4 12l1.5-1.5M10.5 5.5L12 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
    );
}

