"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TrendPoint {
    time: string;
    value: number;
}
interface AQITrendChartProps {
    data: TrendPoint[];
    color: string; // Add this line
}

export function AQITrendChart({ data, color }: AQITrendChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const maxAQI = Math.max(...data.map(d => d.value), 100) * 1.2;

    const points = data.map((d, i) => {
        const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 50;
        const y = 80 - (d.value / maxAQI) * 60; // Keep space for tooltips
        return { x, y, ...d };
    });

    const pathD = points.length > 0 
        ? `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`
        : "";

    const areaD = points.length > 0
        ? `${pathD} L 100,100 L 0,100 Z`
        : "";

    return (
        <GlassCard className="p-6 h-full flex flex-col relative group overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] opacity-40">24H AQI Trend</h3>
                <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse bg-[#10b981]" />
                    <span className="text-[10px] text-white/30 uppercase tracking-widest">Live</span>
                </div>
            </div>

            <div className="flex-1 relative w-full min-h-[150px] flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[25, 50, 75].map(v => (
                        <line key={v} x1="0" y1={v} x2="100" y2={v} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                    ))}

                    <motion.path
                        d={areaD}
                        fill="url(#trendGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />

                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        vectorEffect="non-scaling-stroke"
                    />

                    {/* Interactive Points */}
                    {points.map((p, i) => (
                        <g key={i}>
                            <rect
                                x={p.x - 52 / (data.length || 1)}
                                y={0}
                                width={100 / (data.length || 1)}
                                height="100"
                                fill="transparent"
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            />
                            <AnimatePresence>
                                {hoveredIndex === i && (
                                    <motion.circle
                                        initial={{ r: 0 }}
                                        animate={{ r: 4 }}
                                        exit={{ r: 0 }}
                                        cx={p.x} cy={p.y}
                                        stroke="white" strokeWidth="2" fill="#10b981"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                )}
                            </AnimatePresence>
                        </g>
                    ))}
                </svg>

                {/* Tooltip */}
                <AnimatePresence>
                    {hoveredIndex !== null && points[hoveredIndex] && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute bg-black/60 backdrop-blur-3xl border border-primary/20 rounded-2xl px-6 py-4 text-xs text-white z-50 pointer-events-none shadow-[0_10px_40px_rgba(0,255,157,0.15)] flex flex-col gap-1 items-center"
                            style={{
                                left: `${points[hoveredIndex].x}%`,
                                transform: `translateX(-50%)`,
                                bottom: `${100 - points[hoveredIndex].y + 15}%`
                            }}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping absolute -bottom-1" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Recorded AQI</span>
                            <div className="text-2xl font-display font-medium text-primary">
                                {points[hoveredIndex].value}
                            </div>
                            <div className="text-[9px] uppercase tracking-widest text-white/20 font-mono">
                                Interval: {hoveredIndex}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex justify-between mt-6 text-[10px] text-white/20 font-mono tracking-widest uppercase">
                <span>0H</span>
                <span>12H</span>
                <span>24H</span>
            </div>
        </GlassCard>
    );
}