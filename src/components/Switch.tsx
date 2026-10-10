type Props = {
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
    label?: string;
};

export function Switch({ checked, onChange, disabled, label }: Props) {
    return (
        <label className="inline-flex cursor-pointer items-center gap-3 select-none">
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={[
                    // Track: 56×32, pill shape, centered content
                    "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border-2",
                    "transition-colors duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                    // Push thumb to the correct edge
                    checked ? "justify-end" : "justify-start",
                    checked
                        ? "border-md-primary bg-md-primary"
                        : "border-md-outline bg-md-surface-container-high",
                    disabled && "pointer-events-none opacity-40",
                ].join(" ")}
            >
                <span
                    className={[
                        // Thumb: margin gives 4px inset from the outer edge on both sides
                        "mx-0.5 rounded-full",
                        "transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                        checked
                            ? "h-5 w-5 bg-md-on-primary"
                            : "h-4 w-4 bg-md-outline",
                    ].join(" ")}
                >
                    {checked && (
                        <svg
                            viewBox="0 0 16 16"
                            className="h-full w-full p-0.75 text-md-primary"
                            fill="none"
                        >
                            <path
                                d="M3 8.2l3.4 3.4L13 5.4"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </span>
            </button>
            {label && <span className="text-sm text-md-on-surface">{label}</span>}
        </label>
    );
}