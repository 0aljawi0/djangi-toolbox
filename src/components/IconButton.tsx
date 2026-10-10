import { useState, type ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    danger?: boolean;
};

export function IconButton({ children, danger, className = "", onClick, ...rest }: Props) {
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        const id = Date.now() + Math.random();
        setRipples((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
        setTimeout(() => setRipples((p) => p.filter((x) => x.id !== id)), 500);
        onClick?.(e);
    };

    return (
        <button
            {...rest}
            onClick={handleClick}
            className={[
                "relative overflow-hidden isolate",
                "inline-flex items-center justify-center",
                "h-9 w-9 rounded-full",
                "transition-colors duration-200",
                danger
                    ? "text-md-error hover:bg-md-error/10"
                    : "text-md-on-surface-variant hover:bg-md-on-surface/8",
                className,
            ].join(" ")}
        >
            {ripples.map((r) => (
                <span
                    key={r.id}
                    className="pointer-events-none absolute rounded-full bg-current animate-ripple"
                    style={{ left: r.x, top: r.y, width: 10, height: 10 }}
                />
            ))}
            <span className="relative z-10">{children}</span>
        </button>
    );
}