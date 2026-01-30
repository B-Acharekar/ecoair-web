"use client";

import type { EcoAirData, GasKey } from "@/lib/mock";

export default function MiniStats({ data }: { data: EcoAirData }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Temperature */}
      <StatCard
        label="Temperature"
        value={`${data.temperature}°C`}
        tone="neutral"
      />

      {/* Humidity */}
      <StatCard
        label="Humidity"
        value={`${data.humidity}%`}
        tone="neutral"
      />

      {/* Gas Sensors */}
      {Object.entries(data.gases).map(([gas, value]) => (
        <StatCard
          key={gas}
          label={formatGasLabel(gas as GasKey)}
          value={value}
          tone={value > gasThreshold(gas as GasKey) ? "alert" : "neutral"}
        />
      ))}

      {/* Purifier Status */}
      <StatCard
        label="Purifier"
        value={data.purifierOn ? "ON" : "OFF"}
        tone={data.purifierOn ? "active" : "neutral"}
      />
    </div>
  );
}

/* ---------- Gas Label Formatter ---------- */
function formatGasLabel(gas: GasKey) {
  switch (gas) {
    case "CO":
      return "Carbon Monoxide";
    case "NO2":
      return "Nitrogen Dioxide";
    case "O3":
      return "Ozone";
    case "VOC":
      return "VOCs";
    default:
      return gas;
  }
}

/* ---------- Gas Thresholds (for alert styling) ---------- */
function gasThreshold(gas: GasKey) {
  switch (gas) {
    case "CO":
      return 9; // ppm, WHO safe limit
    case "NO2":
      return 53; // ppb
    case "O3":
      return 70; // ppb
    case "VOC":
      return 300; // arbitrary safe index
    default:
      return 100;
  }
}

/* ---------- Card Component ---------- */
function StatCard({
  label,
  value,
  unit,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  unit?: string;
  tone?: "neutral" | "active" | "alert";
}) {
  const toneStyles =
    tone === "active"
      ? "text-emerald-400 bg-emerald-400/10"
      : tone === "alert"
      ? "text-rose-400 bg-rose-400/10"
      : "text-neutral-200 bg-white/5";

  return (
    <div
      className={`
        rounded-xl
        p-4
        backdrop-blur-md
        transition-all
        duration-300
        hover:bg-white/10
        ${toneStyles}
      `}
    >
      <p className="text-xs uppercase tracking-widest text-neutral-400">
        {label}
      </p>

      <div className="mt-2 flex items-end gap-1">
        <span className="text-lg font-medium">{value}</span>
        {unit && <span className="text-xs text-neutral-400 mb-0.5">{unit}</span>}
      </div>
    </div>
  );
}
