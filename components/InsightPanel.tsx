"use client";

export default function InsightPanel({ data }: any) {
  // Determine highest alert level among all gases
  const maxGasValue = data.gases
    ? Math.max(...Object.values(data.gases) as number[])
    : 0;

  const status =
    maxGasValue <= 50
      ? {
          label: "Air quality stable",
          tone: "text-emerald-400",
          detail:
            "All monitored gases are within safe levels. No action required.",
        }
      : maxGasValue <= 100
      ? {
          label: "Moderate air quality",
          tone: "text-amber-400",
          detail:
            "Some gases are approaching unsafe levels. System is monitoring closely.",
        }
      : {
          label: "Poor air quality detected",
          tone: "text-rose-500",
          detail:
            "One or more gas levels exceed safe thresholds. Purification is recommended.",
        };

  // Optional: create insight message from gas readings
  const insight = data.gases
    ? Object.entries(data.gases)
        .map(([gas, value]) => {
          const v = value as number;
          return `${formatGasLabel(gas)}: ${v} ${gasUnit(gas)}${
            v > gasThreshold(gas) ? " ⚠️" : ""
          }`;
        })
        .join(", ")
    : "Air quality data not available.";

  return (
    <div className="relative rounded-2xl bg-white/5 p-6 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-widest text-neutral-400">
          System Insight
        </p>

        <span className={`text-xs font-medium tracking-wide ${status.tone}`}>
          {status.label}
        </span>
      </div>

      {/* Main insight */}
      <p className="text-sm leading-relaxed text-neutral-200">{insight}</p>

      {/* System detail */}
      <p className="mt-4 text-xs text-neutral-500">{status.detail}</p>

      {/* Ambient divider */}
      <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

/* ---------- Gas Label Formatter ---------- */
function formatGasLabel(gas: string) {
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

/* ---------- Gas Thresholds ---------- */
function gasThreshold(gas: string) {
  switch (gas) {
    case "CO":
      return 9; // ppm
    case "NO2":
      return 53; // ppb
    case "O3":
      return 70; // ppb
    case "VOC":
      return 300; // arbitrary AQI index
    default:
      return 100;
  }
}

/* ---------- Gas Units ---------- */
function gasUnit(gas: string) {
  switch (gas) {
    case "CO":
      return "ppm";
    case "NO2":
    case "O3":
      return "ppb";
    case "VOC":
      return "index";
    default:
      return "";
  }
}
