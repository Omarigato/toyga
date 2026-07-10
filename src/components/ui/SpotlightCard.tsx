import { useRef, useState, type MouseEvent } from 'react';
import { cn } from '@/lib/cn';

interface SpotlightCardProps {
    children: React.ReactNode;
    className?: string;
}

export default function SpotlightCard({ children, className }: SpotlightCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                'group relative overflow-hidden rounded-xl transition-all duration-300',
                className
            )}
            style={{
                background: isHovered
                    ? `radial-gradient(circle 200px at ${position.x}px ${position.y}px, oklch(0.92 0.10 80 / 0.15), transparent 80%), oklch(var(--background-50))`
                    : 'oklch(var(--background-50))',
            }}
        >
            {/* Glow border */}
            {isHovered && (
                <div
                    className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle 150px at ${position.x}px ${position.y}px, oklch(0.72 0.19 80 / 0.3), transparent 70%)`,
                        zIndex: 1,
                    }}
                />
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
