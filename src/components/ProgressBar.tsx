type Props = { value?: number }; // 0..1 for determinate

export function ProgressBar({ value }: Props) {
    const determinate = typeof value === "number";
    return (
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-md-primary/15">
            {determinate ? (
                <div
                    className="h-full rounded-full bg-md-primary transition-[width] duration-150 ease-out"
                    style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }}
                />
            ) : (
                <>
                    <div className="absolute inset-y-0 w-2/5 animate-shimmer bg-linear-r from-transparent via-md-primary to-transparent" />
                </>
            )}
        </div>
    );
}