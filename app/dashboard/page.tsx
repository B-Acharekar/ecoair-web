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

// Keep mock as fallback
import { data as initialData } from "@/lib/mock";

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<any>(null);

  const [purifierOn, setPurifierOn] = useState(initialData.purifierOn);
  const [isAuto, setIsAuto] = useState<boolean>(
    initialData.purifierMode === "AUTO"
  );
  const [fanSpeed, setFanSpeed] = useState(initialData.fanSpeed);
  const [showSetup, setShowSetup] = useState(false);

  // 🔥 Fetch ESP32 data every 5 sec
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

  // Use live data if available, otherwise fallback to mock
  const activeAQI = sensorData?.mq135 ?? initialData.aqi;
  const temperature = sensorData?.temp ?? initialData.temperature;
  const humidity = sensorData?.hum ?? initialData.humidity;

  return (
    <main className="min-h-screen p-4 sm:p-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tight">
              EcoAir<span className="text-primary">.ai</span>
            </h1>
            <p className="text-white/50 mt-1">Smart Environment Control</p>
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column */}
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

          {/* Center Column */}
          <div className="lg:col-span-5 min-h-[500px]">
            <AQIHero
              aqi={activeAQI}
              level={initialData.level}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-8 flex flex-col">
            <div className="flex-1">
              <PollutantDominance gases={initialData.gases} />
            </div>

            <div className="h-64">
              <AQITrendChart data={initialData.trend} />
            </div>
          </div>

        </div>

        {/* Assistant */}
        <AssistantOrb />
      </div>
    </main>
  );
}
