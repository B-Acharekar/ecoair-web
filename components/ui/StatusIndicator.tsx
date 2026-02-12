import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
    status: "good" | "moderate" | "critical" | "idle";
    label?: string;
    className?: string;
    pulse?: boolean;
}

export function StatusIndicator({ status, label, className, pulse = true }: StatusIndicatorProps) {
    const colors = {
        good: "bg-primary shadow-[0_0_10px_var(--primary)]",
        moderate: "bg-yellow-400 shadow-[0_0_10px_#FACC15]",
        critical: "bg-accent shadow-[0_0_10px_var(--accent)]",
        idle: "bg-white/20",
    };

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <span className="relative flex h-3 w-3">
                {pulse && status !== "idle" && (
                    <span className={cn(
                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 duration-1000",
                        colors[status]
                    )} />
                )}
                <span className={cn(
                    "relative inline-flex rounded-full h-3 w-3 transition-all duration-500",
                    colors[status]
                )} />
            </span>
            {label && <span className="text-sm font-medium tracking-wide text-white/50 uppercase text-xs">{label}</span>}
        </div>
    );
}
