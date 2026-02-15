"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

interface AQIHeroProps {
    aqi: number;
    level: string;
    color: string; // Add this line
}

export function AQIHero({ aqi, level, color }: AQIHeroProps) {
    return (
        <GlassCard className="relative flex flex-col items-center justify-center p-10 overflow-hidden min-h-[400px]" intensity="medium">
            {/* Background Glow - Now uses the dynamic color prop */}
            <div
                className="absolute inset-0 opacity-20 blur-[100px] transition-colors duration-1000"
                style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
            />

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative"
                >
                    <svg className="w-72 h-72 transform -rotate-90">
                        <circle
                            cx="144" cy="144" r="130"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="4"
                            fill="transparent"
                        />
                        <motion.circle
                            cx="144" cy="144" r="130"
                            stroke={color} // Use dynamic color
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 130}
                            strokeDashoffset={2 * Math.PI * 130}
                            strokeLinecap="round"
                            animate={{ strokeDashoffset: 2 * Math.PI * 130 * (1 - Math.min(aqi, 300) / 300) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-8xl font-bold font-display tracking-tighter drop-shadow-lg"
                            style={{ color: color }} // Use dynamic color
                        >
                            {aqi}
                        </motion.span>
                        <span className="text-sm uppercase tracking-widest text-white/50 mt-4">AQI Index</span>
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 text-3xl font-light tracking-wide text-white uppercase"
                >
                    {level}
                </motion.h2>
            </div>
        </GlassCard>
    );
}