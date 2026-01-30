"use client";

import { useState } from "react";

export default function AssistantOrb({
  gases,
  purifierOn,
  onToggle,
}: {
  gases: Record<string, number>; // gas readings like { CO: 5, NO2: 30, O3: 40, VOC: 120 }
  purifierOn: boolean;
  onToggle: () => void;
}) {
  const [thinking, setThinking] = useState(false);

  // Compute AQI as the highest gas value
  const aqi = gases ? Math.max(...Object.values(gases)) : 0;

  // Glow color based on AQI
  const glow =
    aqi <= 50
      ? "from-emerald-400 to-teal-400"
      : aqi <= 100
      ? "from-amber-400 to-orange-400"
      : "from-red-500 to-rose-600";

  // Pulse speed based on AQI
  const pulseSpeed =
    aqi <= 50
      ? "animate-pulse-slow"
      : aqi <= 100
      ? "animate-pulse"
      : "animate-pulse-fast";

  // Status text based on AQI
  const statusText =
    aqi <= 50
      ? "Good Air"
      : aqi <= 100
      ? "Moderate Air"
      : "Poor Air";

  return (
    <button
      className="fixed bottom-6 right-6 z-50 group select-none"
      onClick={onToggle}
      onMouseDown={() => setThinking(true)}
      onMouseUp={() => setThinking(false)}
      onTouchStart={() => setThinking(true)}
      onTouchEnd={() => setThinking(false)}
    >
      {/* Glow layer */}
      <div
        className={`
          absolute inset-0
          w-16 h-16
          rounded-full
          bg-gradient-to-br
          ${glow}
          blur-xl
          opacity-70
          ${pulseSpeed}
        `}
      />

      {/* Core orb */}
      <div
        className={`
          relative
          w-16 h-16
          rounded-full
          bg-black/70
          backdrop-blur-xl
          flex flex-col
          items-center
          justify-center
          text-[10px]
          tracking-wide
          transition-all
          duration-300
          ${thinking ? "scale-110" : "scale-100"}
        `}
      >
        <span className="opacity-70">ECOAIR</span>
        <span className="text-xs font-medium">{statusText}</span>
        <span
          className={purifierOn ? "text-emerald-400" : "text-neutral-400"}
        >
          {purifierOn ? "PURIFYING" : "IDLE"}
        </span>
      </div>
    </button>
  );
}
