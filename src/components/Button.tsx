import { useState, type ButtonHTMLAttributes } from "react";

type Variant = "filled" | "tonal" | "outlined" | "text" | "elevated";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    icon?: React.ReactNode;
};

type Ripple = { id: number; x: number; y: number };

const VARIANTS: Record<Variant, string> = {
    filled:
        "bg-md-primary text-md-on-primary hover:md-elev-1 active:md-elev-0",
    tonal:
        "bg-md-secondary-container text-md-on-secondary-container hover:md-elev-1",
    outlined:
        "border border-md-outline text-md-primary hover:bg-md-primary/8",
    text:
        "text-md-primary hover:bg-md-primary/8",
    elevated:
        "bg-md-surface-container text-md-primary md-elev-1 hover:md-elev-2",
};

export function Button({
    variant = "filled",
    icon,
    children,
    className = "",
    onClick,
    ...rest
}: Props) {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        const id = Date.now() + Math.random();
        setRipples((prev) => [...prev, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
        setTimeout(() => setRipples((p) => p.filter((x) => x.id !== id)), 600);
        onClick?.(e);
    };

    return (
        <button
            {...rest}
            onClick={handleClick}
            className={[
                "relative overflow-hidden select-none isolate",
                "inline-flex items-center justify-center gap-2",
                "h-10 px-6 rounded-md-xl", // MD3 pill shape
                "text-sm font-medium tracking-wide",
                "transition-[box-shadow,background-color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                "active:scale-[0.98]",
                "disabled:opacity-40 disabled:pointer-events-none",
                VARIANTS[variant],
                className,
            ].join(" ")}
        >
            {ripples.map((r) => (
                <span
                    key={r.id}
                    className="pointer-events-none absolute rounded-full bg-current animate-ripple"
                    style={{
                        left: r.x,
                        top: r.y,
                        width: 12,
                        height: 12,
                    }}
                />
            ))}
            {icon}
            <span className="relative z-10">{children}</span>
        </button>
    );
}