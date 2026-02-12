import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    glow?: boolean;
    isLoading?: boolean;
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
    ({ className, variant = "primary", glow = true, isLoading = false, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={isLoading || props.disabled}
                className={cn(
                    "relative px-6 py-3 rounded-xl font-medium tracking-wide transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden",
                    "flex items-center justify-center gap-2",
                    {
                        // Primary (Green)
                        "bg-primary text-black hover:bg-primary/90": variant === "primary",
                        "shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_35px_rgba(0,255,157,0.5)]": variant === "primary" && glow,

                        // Secondary (Blue)
                        "bg-secondary text-black hover:bg-secondary/90": variant === "secondary",
                        "shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_35px_rgba(0,210,255,0.5)]": variant === "secondary" && glow,

                        // Danger (Red)
                        "bg-accent text-white hover:bg-accent/90": variant === "danger",
                        "shadow-[0_0_20px_rgba(255,46,46,0.3)] hover:shadow-[0_0_35px_rgba(255,46,46,0.5)]": variant === "danger" && glow,

                        // Ghost
                        "bg-transparent border border-white/10 text-white hover:bg-white/5": variant === "ghost",
                    },
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span className="relative z-10 flex items-center gap-2">{children}</span>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
            </button>
        );
    }
);

NeonButton.displayName = "NeonButton";
