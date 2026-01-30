export type AQILevel = "good" | "moderate" | "poor";

export type Theme = {
  level: AQILevel;

  // Backgrounds
  bg: string;
  ambient: string;

  // Text & accents
  accent: string;
  accentSoft: string;

  // Surfaces (cards, panels)
  surface: string;
  surfaceStrong: string;

  // Glow & effects
  glow: string;
  glowSoft: string;

  // Motion tuning (used by animations)
  pulseSpeed: string;
};

export const aqiTheme: Record<AQILevel, Theme> = {
  good: {
    level: "good",

    bg: "from-emerald-500/30 via-teal-400/20 to-sky-400/30",
    ambient: "bg-emerald-500/10",

    accent: "text-emerald-400",
    accentSoft: "text-emerald-300/70",

    surface: "bg-white/10 backdrop-blur-xl border border-white/10",
    surfaceStrong: "bg-white/20 backdrop-blur-2xl",

    glow: "shadow-[0_0_60px_rgba(16,185,129,0.45)]",
    glowSoft: "shadow-[0_0_30px_rgba(16,185,129,0.25)]",

    pulseSpeed: "animate-[pulse_6s_ease-in-out_infinite]",
  },

  moderate: {
    level: "moderate",

    bg: "from-amber-400/30 via-orange-400/25 to-yellow-300/30",
    ambient: "bg-amber-400/10",

    accent: "text-amber-400",
    accentSoft: "text-amber-300/70",

    surface: "bg-white/10 backdrop-blur-xl border border-white/10",
    surfaceStrong: "bg-white/25 backdrop-blur-2xl",

    glow: "shadow-[0_0_70px_rgba(245,158,11,0.45)]",
    glowSoft: "shadow-[0_0_40px_rgba(245,158,11,0.3)]",

    pulseSpeed: "animate-[pulse_4s_ease-in-out_infinite]",
  },

  poor: {
    level: "poor",

    bg: "from-red-500/35 via-rose-500/30 to-orange-400/30",
    ambient: "bg-red-500/10",

    accent: "text-red-400",
    accentSoft: "text-red-300/70",

    surface: "bg-black/20 backdrop-blur-xl border border-white/10",
    surfaceStrong: "bg-black/30 backdrop-blur-2xl",

    glow: "shadow-[0_0_90px_rgba(239,68,68,0.6)]",
    glowSoft: "shadow-[0_0_50px_rgba(239,68,68,0.35)]",

    pulseSpeed: "animate-[pulse_2.5s_ease-in-out_infinite]",
  },
};

export function themeByAQI(aqi: number): Theme {
  if (aqi <= 50) return aqiTheme.good;
  if (aqi <= 100) return aqiTheme.moderate;
  return aqiTheme.poor;
}
