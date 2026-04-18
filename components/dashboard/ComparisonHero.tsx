"use client";

import { motion, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AlertTriangle, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";

interface ComparisonHeroProps {
    homeAQI: number;
    cityAQI: number;
    cityName: string;
    onActivatePurifier?: () => void;
}

function AnimatedNumber({ value }: { value: number }) {
    const springValue = useSpring(0, { stiffness: 40, damping: 20 });
    const displayValue = useTransform(springValue, (latest) => Math.round(latest));
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        springValue.set(value);
        return displayValue.on("change", (latest) => setCurrent(latest));
    }, [value, springValue, displayValue]);

    return <span>{current}</span>;
}

export function ComparisonHero({ homeAQI, cityAQI, cityName, onActivatePurifier }: ComparisonHeroProps) {
    const diff = homeAQI - cityAQI;
    const isWorse = diff > 0;
    const percent = Math.abs(Math.round((diff / (cityAQI || 1)) * 100));

    return (
        <GlassCard className="relative overflow-hidden group p-8 md:p-12 mb-8">
            {/* Background Glows */}
            <div className={`absolute -right-20 -top-20 w-80 h-80 blur-[120px] rounded-full transition-colors duration-1000 ${isWorse ? 'bg-red-500/10' : 'bg-primary/10'}`} />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className={`p-2 rounded-xl ${isWorse ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
                            {isWorse ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                            Home Sync Analysis
                        </span>
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-display font-medium text-white leading-tight"
                    >
                        {isWorse ? (
                            <>
                                Your indoor air is <span className="text-red-400">{percent}% more polluted</span> than {cityName}.
                            </>
                        ) : (
                            <>
                                Your air is <span className="text-primary italic">{percent}% cleaner</span> than the active city.
                            </>
                        )}
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 max-w-lg leading-relaxed"
                    >
                        {isWorse 
                            ? "Significant particulate matter detected. We recommend activating high-speed purification immediately to protect your health."
                            : "Excellent work! Your EcoAir system is maintaining a superior environment compared to the local global average."
                        }
                    </motion.p>

                    {isWorse && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <NeonButton onClick={onActivatePurifier} className="px-8 py-6 rounded-2xl group">
                                Optimize Environment <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                            </NeonButton>
                        </motion.div>
                    )}
                </div>

                <div className="flex gap-8 relative">
                    <ComparisonCard label="Home" aqi={homeAQI} primary />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center z-20 backdrop-blur-xl">
                        <Zap className="w-3 h-3 text-white/20" />
                    </div>
                    <ComparisonCard label={cityName} aqi={cityAQI} />
                </div>
            </div>
        </GlassCard>
    );
}

function ComparisonCard({ label, aqi, primary = false }: { label: string, aqi: number, primary?: boolean }) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className={`w-32 md:w-40 p-6 rounded-[2rem] border transition-all ${
                primary 
                ? 'bg-primary/20 border-primary/30 shadow-[0_0_40px_rgba(0,255,157,0.1)]' 
                : 'bg-white/5 border-white/10'
            }`}
        >
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">{label}</p>
            <div className={`text-4xl md:text-5xl font-display font-medium ${primary ? 'text-primary' : 'text-white'}`}>
                <AnimatedNumber value={aqi} />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/20 mt-2 font-mono">AQI INDEX</div>
        </motion.div>
    );
}
