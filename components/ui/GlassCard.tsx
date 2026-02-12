import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    intensity?: "low" | "medium" | "high";
    hoverEffect?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ children, className, intensity = "medium", hoverEffect = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-2xl border border-white/5 backdrop-blur-xl transition-all duration-500 ease-out",
                    {
                        "bg-white/5": intensity === "low",
                        "bg-white/10 shadow-lg shadow-black/20": intensity === "medium",
                        "bg-white/15 border-white/10 shadow-xl shadow-black/30": intensity === "high",
                        "hover:bg-white/15 hover:border-white/20 hover:shadow-2xl hover:-translate-y-1": hoverEffect
                    },
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

GlassCard.displayName = "GlassCard";
