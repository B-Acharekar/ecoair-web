export type GasKey = "CO" | "NO2" | "O3" | "VOC";
export type Gases = Record<GasKey, number>;

export type TrendPoint = {
  timestamp: string;
  gases: Gases;
  aqi: number;
};

export type EcoAirData = {
  aqi: number;
  level: string;
  insight: string;

  temperature: number;
  humidity: number;

  sensorType: string;
  gasIndex: number;
  gasPpm?: number;
  gases: Gases;

  purifierOn: boolean;
  purifierMode: "AUTO" | "MANUAL";
  fanSpeed: 0 | 1 | 2 | 3;

  trend: TrendPoint[];

  thresholds: {
    safe: number;
    moderate: number;
    unhealthy: number;
  };

  location: string;
};

export const data:EcoAirData = {
  // --- Core AQI ---
  aqi: 50, // computed as max of gases
  level: "good",

  // --- System Insight (used by InsightPanel & Assistant) ---
  insight:
    "Gas concentration is elevated. Air purification is actively reducing VOC levels.",

  // --- Environment ---
  temperature: 29,
  humidity: 64,

  // --- Sensor Info ---
  sensorType: "MQ135", // MQ135 | other MQ sensors
  gasIndex: 420, // relative index (mapped from ppm internally)
  gasPpm: 180, // raw sensor ppm (optional)
  gases: {
    CO: 40, // ppm
    NO2: 35,
    O3: 28,
    VOC: 42,
  },

  // --- System State ---
  purifierOn: true,
  purifierMode: "AUTO", // AUTO | MANUAL
  fanSpeed: 2, // 0–3

  // --- AQI Trend (used for animated graph) ---
  trend: [
    {
      timestamp: "10:00",
      gases: { CO: 32, NO2: 28, O3: 25, VOC: 35 },
      aqi: 35,
    },
    {
      timestamp: "11:00",
      gases: { CO: 38, NO2: 33, O3: 27, VOC: 40 },
      aqi: 40,
    },
    {
      timestamp: "12:00",
      gases: { CO: 42, NO2: 36, O3: 29, VOC: 45 },
      aqi: 45,
    },
    {
      timestamp: "13:00",
      gases: { CO: 48, NO2: 40, O3: 32, VOC: 50 },
      aqi: 50,
    },
    {
      timestamp: "14:00",
      gases: { CO: 46, NO2: 38, O3: 30, VOC: 48 },
      aqi: 48,
    },
    {
      timestamp: "15:00",
      gases: { CO: 44, NO2: 36, O3: 29, VOC: 46 },
      aqi: 46,
    },
  ],

  // --- Thresholds (logic + UI coloring) ---
  thresholds: {
    safe: 50,
    moderate: 100,
    unhealthy: 150,
  },

  // --- Location / Room Context ---
  location: "Living Room",
};
