"use client";

import type { EcoAirData } from "@/lib/mock";

interface AQIFlowProps {
  data: EcoAirData;
  activeIndex: number;
  onSelect: (i: number) => void;
}

export default function AQIFlow({ data, activeIndex, onSelect }: AQIFlowProps) {
  // Compute AQI for each trend point (max of gases)
  const trend = data.trend.map((point) => {
    if (point.gases) {
      const maxGas = Math.max(...Object.values(point.gases) as number[]);
      return { ...point, aqi: maxGas };
    }
    return { ...point, aqi: point.aqi || 0 };
  });

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-neutral-400 mb-4">
        AQI Trend · Last Hours
      </p>

      {/* Graph */}
      <div className="flex gap-2 items-end h-32 select-none">
        {trend.map((point, i) => {
          const isActive = i === activeIndex;

          // Bar color based on AQI
          const barColor =
            point.aqi <= 50
              ? "bg-emerald-400"
              : point.aqi <= 100
              ? "bg-amber-400"
              : "bg-rose-500";

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`
                relative
                flex-1
                rounded-full
                transition-all
                duration-500
                ease-out
                ${isActive ? "opacity-100" : "opacity-50"}
                hover:opacity-80
              `}
              style={{
                height: `${Math.max(point.aqi, 14)}px`,
                transform: isActive ? "scaleY(1.08)" : "scaleY(1)",
              }}
            >
              {/* Glow for active bar */}
              {isActive && (
                <div
                  className={`absolute inset-0 rounded-full blur-md opacity-30 ${barColor}`}
                />
              )}

              {/* Main bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 rounded-full ${barColor}`}
                style={{ height: "100%" }}
              />
            </button>
          );
        })}
      </div>

      {/* Readout */}
      <div className="mt-4 text-center">
        <p className="text-xs text-neutral-400">
          Selected AQI · {trend[activeIndex].timestamp}
        </p>
        <p className="text-lg font-[var(--font-display)] tracking-wide">
          {trend[activeIndex].aqi}
        </p>
      </div>
    </div>
  );
}
