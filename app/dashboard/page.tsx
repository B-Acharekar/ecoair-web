"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

// Components
import { AQIHero } from "@/components/dashboard/AQIHero";
import { PollutantDominance } from "@/components/dashboard/PollutantDominance";
import { EnvironmentalStats } from "@/components/dashboard/EnvironmentalStats";
import { PurifierControls } from "@/components/dashboard/PurifierControls";
import { AQITrendChart } from "@/components/dashboard/AQITrendChart";
import { AssistantOrb } from "@/components/assistant/AssistantOrb";
import { DeviceSetupModal } from "@/components/setup/DeviceSetupModal";
import { Settings } from "lucide-react";

// Mock fallback
import { data as initialData } from "@/lib/mock";

type SensorPayload = {
  temperature: number;
  humidity: number;
  mq135_raw: number;
  mq7_raw: number;
};

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorPayload | null>(null);
  const [aqiHistory, setAqiHistory] = useState<number[]>([]);

  const [purifierOn, setPurifierOn] = useState(initialData.purifierOn);
  const [isAuto, setIsAuto] = useState<boolean>(
    initialData.purifierMode === "AUTO"
  );
  const [fanSpeed, setFanSpeed] = useState(initialData.fanSpeed);
  const [showSetup, setShowSetup] = useState(false);

  // ==============================
  // FETCH DATA
  // ==============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data");
        const data = await res.json();
        setSensorData(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ==============================
  // RAW VALUES
  // ==============================
  const temperature =
    sensorData?.temperature ?? initialData.temperature;
  const humidity =
    sensorData?.humidity ?? initialData.humidity;

  const mq135Raw = sensorData?.mq135_raw ?? 0;
  const mq7Raw = sensorData?.mq7_raw ?? 0;

  // ==============================
  // SENSOR CONVERSION
  // ==============================

  const co2ppm = Math.round((mq135Raw / 4095) * 2000); // Scale up to 2000ppm
  const coppm = Math.round((mq7Raw / 4095) * 500);    // Scale up to 500ppm

  // ==============================
  // AQI CALCULATION
  // ==============================

  const co2Index = Math.min((co2ppm / 1200) * 150, 300);
  const coIndex = Math.min((coppm / 100) * 150, 300);

  const activeAQI = Math.round(co2Index + coIndex);

  // ==============================
  // AQI LEVEL
  // ==============================

  let level = "Good";
  let statusColor = "#10b981"; // Default Green

  if (activeAQI > 200) {
    level = "Hazardous";
    statusColor = "#ef4444"; // Red
  } else if (activeAQI > 150) {
    level = "Very Poor";
    statusColor = "#f97316"; // Orange
  } else if (activeAQI > 100) {
    level = "Moderate";
    statusColor = "#eab308"; // Yellow
  }

  // ==============================
  // DOMINANT GAS
  // ==============================

  const dominantGas =
    co2ppm > coppm
      ? { name: "CO₂", value: co2ppm }
      : { name: "CO", value: coppm };

  // ==============================
  // TREND HISTORY (Real, not random)
  // ==============================

  useEffect(() => {
    if (!activeAQI) return;

    setAqiHistory((prev) => {
      const updated = [...prev, activeAQI];
      return updated.slice(-12); // keep last 12 readings
    });
  }, [activeAQI]);

  const trendData = aqiHistory.map((value, index) => ({
    time: index.toString(),
    value,
  }));

  // ==============================
  // AUTO PURIFIER LOGIC
  // ==============================

  useEffect(() => {
    if (!isAuto) return;

    if (activeAQI > 200) {
      setPurifierOn(true);
      setFanSpeed(3);
    } else if (activeAQI > 120) {
      setPurifierOn(true);
      setFanSpeed(2);
    } else if (activeAQI > 80) {
      setPurifierOn(true);
      setFanSpeed(1);
    } else {
      setPurifierOn(false);
    }
  }, [activeAQI, isAuto]);

  return (
    <main className="min-h-screen p-4 sm:p-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tight">
              EcoAir<span className="text-primary">.ai</span>
            </h1>
            <p className="text-white/50 mt-1">
              Smart Environment Control
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSetup(true)}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70 hover:bg-white/10 hover:border-primary/30 transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10B981]"></span>
              {initialData.location} • {sensorData ? "Live" : "Mock"}
            </button>

            <button className="p-2 rounded-full bg-white/5 text-white/70 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Setup Modal */}
        <AnimatePresence>
          {showSetup && (
            <DeviceSetupModal onClose={() => setShowSetup(false)} />
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left */}
          <div className="lg:col-span-4 space-y-8 flex flex-col">
            <div className="flex-1 min-h-[300px]">
              <PurifierControls
                isOn={purifierOn}
                isAuto={isAuto}
                fanSpeed={fanSpeed}
                onTogglePower={() => setPurifierOn(!purifierOn)}
                onToggleAuto={() => setIsAuto(!isAuto)}
                onSetFanSpeed={setFanSpeed}
              />
            </div>

            <div className="h-48">
              <EnvironmentalStats
                temperature={temperature}
                humidity={humidity}
              />
            </div>
          </div>

          {/* Center */}
          <div className="lg:col-span-5 min-h-[500px]">
            <AQIHero
              aqi={activeAQI}
              level={level}
            />
          </div>

          {/* Right */}
          <div className="lg:col-span-3 space-y-8 flex flex-col">
            <div className="flex-1">
              <PollutantDominance
                gases={[
                  { name: "CO₂", value: co2ppm },
                  { name: "CO", value: coppm },
                ]}
              />
            </div>

            <div className="h-64">
              <AQITrendChart data={trendData} />
            </div>
          </div>

        </div>

        <AssistantOrb />
      </div>
    </main>
  );
}
