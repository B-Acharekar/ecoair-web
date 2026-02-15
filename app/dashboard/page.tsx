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
  lastUpdated?: string;
};

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorPayload | null>(null);
  const [aqiHistory, setAqiHistory] = useState<number[]>([]);

  const [purifierOn, setPurifierOn] = useState(initialData.purifierOn);
  const [isAuto, setIsAuto] = useState<boolean>(initialData.purifierMode === "AUTO");
  const [fanSpeed, setFanSpeed] = useState(initialData.fanSpeed);
  const [showSetup, setShowSetup] = useState(false);

  // ==============================
  // FETCH DATA (ZERO LAG CONFIG)
  // ==============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // We add a timestamp query to bypass any browser cache
        const res = await fetch(`/api/data?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        const data = await res.json();
        
        if (data && !data.error) {
          setSensorData(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ==============================
  // DATA PARSING
  // ==============================
  const temperature = sensorData?.temperature ?? initialData.temperature;
  const humidity = sensorData?.humidity ?? initialData.humidity;
  const mq135Raw = sensorData?.mq135_raw ?? 0;
  const mq7Raw = sensorData?.mq7_raw ?? 0;

  // Sensitivity adjusted for ESP32 12-bit ADC
  const co2ppm = Math.round((mq135Raw / 4095) * 2000); 
  const coppm = Math.round((mq7Raw / 4095) * 500);    

  const co2Index = Math.min((co2ppm / 1200) * 150, 300);
  const coIndex = Math.min((coppm / 100) * 150, 300);

  // Take the highest value to determine the risk level
  const activeAQI = Math.round(Math.max(co2Index, coIndex));

  // ==============================
  // DYNAMIC STYLING
  // ==============================
  let level = "Good";
  let statusColor = "#10b981"; // Primary Green

  if (activeAQI > 200) {
    level = "Hazardous";
    statusColor = "#ef4444"; 
  } else if (activeAQI > 150) {
    level = "Very Poor";
    statusColor = "#f97316"; 
  } else if (activeAQI > 100) {
    level = "Moderate";
    statusColor = "#eab308"; 
  }

  // ==============================
  // TREND HISTORY
  // ==============================
  useEffect(() => {
    if (!activeAQI) return;
    setAqiHistory((prev) => [...prev, activeAQI].slice(-12));
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
    if (activeAQI > 150) {
      setPurifierOn(true);
      setFanSpeed(3);
    } else if (activeAQI > 100) {
      setPurifierOn(true);
      setFanSpeed(2);
    } else if (activeAQI > 60) {
      setPurifierOn(true);
      setFanSpeed(1);
    } else {
      setPurifierOn(false);
    }
  }, [activeAQI, isAuto]);

  return (
    <main className="min-h-screen p-4 sm:p-8 pb-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tight">
              EcoAir<span style={{ color: statusColor }}>.ai</span>
            </h1>
            <p className="text-white/50 mt-1">Smart Environment Control</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSetup(true)}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70 hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <span 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ backgroundColor: statusColor, boxShadow: `0 0 8px ${statusColor}` }}
              ></span>
              {sensorData ? "Live Connection" : "Connecting..."}
            </button>
            <button className="p-2 rounded-full bg-white/5 text-white/70 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <AnimatePresence>
          {showSetup && <DeviceSetupModal onClose={() => setShowSetup(false)} />}
        </AnimatePresence>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
              <EnvironmentalStats temperature={temperature} humidity={humidity} />
            </div>
          </div>

          <div className="lg:col-span-5 min-h-[500px]">
            <AQIHero aqi={activeAQI} level={level} color={statusColor} />
          </div>

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
              {/* Pass the dynamic color to the chart */}
              <AQITrendChart data={trendData} color={statusColor} />
            </div>
          </div>
        </div>

        <AssistantOrb />
      </div>
    </main>
  );
}