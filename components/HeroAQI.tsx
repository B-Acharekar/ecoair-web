"use client";

import { useEffect, useState } from "react";

export default function HeroAQI({ data }: any) {
  // Compute AQI as the highest gas value or use provided AQI
  const computedAQI = data.gases
    ? Math.max(...Object.values(data.gases) as number[])
    : data.aqi || 0;

  const [displayAQI, setDisplayAQI] = useState(computedAQI);

  // Smooth number transition (Tesla-style)
  useEffect(() => {
    let start = displayAQI;
    let end = computedAQI;
    if (start === end) return;

    let frame = 0;
    const frames = 24;

    const interval = setInterval(() => {
      frame++;
      const value = Math.round(start + ((end - start) * frame) / frames);
      setDisplayAQI(value);
      if (frame >= frames) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [computedAQI]);

  // AQI color logic
  const color =
    displayAQI <= 50
      ? "text-emerald-400"
      : displayAQI <= 100
      ? "text-amber-400"
      : "text-rose-500";

  const glow =
    displayAQI <= 50
      ? "from-emerald-400/30 to-teal-400/10"
      : displayAQI <= 100
      ? "from-amber-400/30 to-orange-400/10"
      : "from-rose-500/30 to-red-600/10";

  // Compute textual AQI level
  const level =
    displayAQI <= 50
      ? "Air Quality Good"
      : displayAQI <= 100
      ? "Moderate Air Quality"
      : "Poor Air Quality";

  return (
    <section className="text-center select-none">
      {/* Context */}
      <p className="text-xs tracking-widest uppercase text-neutral-400">
        Living Room · Gas Sensor
      </p>

      {/* AQI Core */}
      <div className="relative mt-6 inline-block">
        {/* Glow */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${glow} blur-3xl`}
        />

        <h1
          className={`
            relative
            text-[96px] md:text-[140px]
            font-bold
            leading-none
            font-[var(--font-display)]
            transition-colors
            duration-500
            ${color}
          `}
        >
          {displayAQI}
        </h1>

        <span className="absolute -right-8 top-6 text-xs tracking-wide text-neutral-400">
          AQI
        </span>
      </div>

      {/* Status */}
      <p className="mt-3 text-sm tracking-wide text-neutral-300">{level}</p>

      <p className="mt-1 text-xs text-neutral-500">
        EcoAir autonomous monitoring active
      </p>
    </section>
  );
}
