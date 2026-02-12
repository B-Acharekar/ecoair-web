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
}

export function AQITrendChart({ data }: AQITrendChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const maxAQI = Math.max(...data.map(d => d.value), 100) * 1.2; // Add some headroom

    // Normalize points for SVG (0-100 coordinate system)
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.value / maxAQI) * 100;
        return { x, y, ...d };
    });

    const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;
    const areaD = `${pathD} L 100,100 L 0,100 Z`;

    return (
        <GlassCard className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-white uppercase tracking-wider opacity-80">AQI Trend</h3>
                <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-xs text-white/50">Live Updates</span>
                </div>
            </div>

            <div className="flex-1 relative w-full min-h-[150px] flex items-end group">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Gradient Defs */}
                    <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines (optional) */}
                    <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                    <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />

                    {/* Area */}
                    <motion.path
                        d={areaD}
                        fill="url(#trendGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />

                    {/* Line */}
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke="var(--primary)"
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
                            {/* Invisible hit area column */}
                            <rect
                                x={i === 0 ? 0 : points[i - 1].x + (p.x - points[i - 1].x) / 2}
                                y={0}
                                width={100 / data.length}
                                height="100"
                                fill="transparent"
                                onMouseEnter={() => setHoveredIndex(i)}
                            // onMouseLeave={() => setHoveredIndex(null)} // Don't clear immediately for better UX
                            />

                            {/* Visible Point on Hover */}
                            <AnimatePresence>
                                {hoveredIndex === i && (
                                    <motion.circle
                                        initial={{ r: 0 }}
                                        animate={{ r: 4 }}
                                        exit={{ r: 0 }}
                                        cx={p.x} cy={p.y}
                                        stroke="white" strokeWidth="2" fill="var(--primary)"
                                        vectorEffect="non-scaling-stroke"
                                        pointerEvents="none"
                                    />
                                )}
                            </AnimatePresence>
                        </g>
                    ))}
                </svg>

                {/* Tooltip */}
                <AnimatePresence>
                    {hoveredIndex !== null && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bg-black/80 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 text-xs text-white transform -translate-x-1/2 pointer-events-none z-20"
                            style={{
                                left: `${points[hoveredIndex].x}%`,
                                bottom: `${100 - points[hoveredIndex].y + 10}%`
                            }}
                        >
                            <div className="font-bold text-primary">{points[hoveredIndex].value} AQI</div>
                            <div className="text-white/50">{points[hoveredIndex].time}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between mt-4 text-xs text-white/30 font-mono">
                {data.map((d, i) => (
                    <motion.span
                        key={i}
                        className="cursor-default"
                        animate={{ color: hoveredIndex === i ? "var(--primary)" : "rgba(255,255,255,0.3)" }}
                    >
                        {d.time}
                    </motion.span>
                ))}
            </div>
        </GlassCard>
    );
}
