"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

interface Gas {
    name: string;
    value: number;
}

interface PollutantDominanceProps {
    gases: Gas[];
}

export function PollutantDominance({ gases }: PollutantDominanceProps) {

    const maxVal = Math.max(...gases.map(g => g.value), 50);

    return (
        <GlassCard className="p-6 h-full flex flex-col justify-center">
            <h3 className="text-xl font-light text-white mb-6 uppercase tracking-wider opacity-80">
                Gas Analysis
            </h3>

            <div className="space-y-6">
                {gases.map(({ name, value }, i) => (
                    <div key={name} className="relative group">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-white/70 font-medium">{name}</span>
                            <span className="text-white/90 font-mono">
                                {value} <span className="text-xs text-white/40">ppm</span>
                            </span>
                        </div>

                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(value / maxVal) * 100}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`h-full rounded-full ${
                                    value > 40
                                        ? "bg-accent shadow-[0_0_10px_var(--accent)]"
                                        : value > 25
                                        ? "bg-yellow-400"
                                        : "bg-primary"
                                }`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
