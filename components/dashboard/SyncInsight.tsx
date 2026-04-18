"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AlertTriangle, CheckCircle2, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface SyncInsightProps {
    homeAQI: number;
    cityAQI: number;
    cityName: string;
}

function RollingNumber({ value }: { value: number }) {
    const springValue = useSpring(0, { stiffness: 40, damping: 20 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        springValue.set(value);
    }, [value, springValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => setDisplay(Math.round(latest)));
    }, [springValue]);

    return <span>{display}</span>;
}

export function SyncInsight({ homeAQI, cityAQI, cityName }: SyncInsightProps) {
    const diff = homeAQI - cityAQI;
    const isWorse = diff > 0;
    const absDiff = Math.abs(diff);
    const percent = Math.round((absDiff / (cityAQI || 1)) * 100);

    return (
        <GlassCard className="relative overflow-hidden p-8 border-primary/20 bg-primary/[0.02]">
            {/* Vibe Glow */}
            <div className={`absolute -right-20 -top-20 w-64 h-64 blur-[100px] rounded-full ${isWorse ? 'bg-red-500/5' : 'bg-primary/5'}`} />

            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-white/5 ${isWorse ? 'text-red-400' : 'text-primary'}`}>
                            {isWorse ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Sync Analytics</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-display font-medium text-white leading-tight">
                        {isWorse ? (
                            <>
                                Indoor air is <span className="text-red-400 font-bold">{percent}% more polluted</span> than {cityName}.
                            </>
                        ) : (
                            <>
                                Environment is <span className="text-primary font-bold">{percent}% cleaner</span> than external city data.
                            </>
                        )}
                    </h2>

                    <p className="text-white/30 text-xs leading-relaxed max-w-md">
                        {isWorse 
                            ? "Significant particulate variance detected. High-efficiency purification recommended to equalize atmospheric safety."
                            : "Excellent filtration threshold reached. Your indoor ecosystem is outperforming local global averages."
                        }
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-[9px] uppercase tracking-widest text-white/20 mb-2 font-bold font-mono">Home Node</p>
                        <div className="text-5xl font-display font-medium text-white">
                            <RollingNumber value={homeAQI} />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 px-6 border-x border-white/5">
                        {isWorse ? <ArrowUpRight className="w-6 h-6 text-red-400" /> : <ArrowDownRight className="w-6 h-6 text-primary" />}
                        <span className="text-[10px] text-white/20 font-mono">{percent}%</span>
                    </div>

                    <div className="text-center">
                        <p className="text-[9px] uppercase tracking-widest text-white/20 mb-2 font-bold font-mono">{cityName}</p>
                        <div className="text-5xl font-display font-medium text-white/40">
                            <RollingNumber value={cityAQI} />
                        </div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
