"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Components
import { AQIHero } from "@/components/dashboard/AQIHero";
import { PollutantDominance } from "@/components/dashboard/PollutantDominance";
import { EnvironmentalStats } from "@/components/dashboard/EnvironmentalStats";
import { AQITrendChart } from "@/components/dashboard/AQITrendChart";
import { SyncInsight } from "@/components/dashboard/SyncInsight";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { Navbar } from "@/components/ui/Navbar";
import { DeviceSetupModal } from "@/components/setup/DeviceSetupModal";

import { RefreshCw } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type SensorPayload = {
  temperature: number;
  humidity: number;
  mq135_raw: number;
  mq7_raw: number;
  lastUpdated: string;
};

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorPayload | null>(null);
  const [aqiHistory, setAqiHistory] = useState<number[]>([]);
  const [cityData, setCityData] = useState<{ aqi: number; city: string } | null>(null);

  const [isOffline, setIsOffline] = useState(false);
  const [failCount, setFailCount] = useState(0);

  const [refreshKey, setRefreshKey] = useState(0);
  const [showSetup, setShowSetup] = useState(false);

  const [user, authLoading] = useAuthState(auth);
  const router = useRouter();

  // 🔐 Auth
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // ==============================
  // DATA FETCH
  // ==============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/data?t=${Date.now()}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data && !data.error) {
          setSensorData(data);

          const lastUpdate = new Date(data.lastUpdated).getTime();
          const now = Date.now();

          setFailCount(0);

          if (now - lastUpdate > 30000) {
            setFailCount((prev) => prev + 1);
          } else {
            setIsOffline(false);
          }
        }
      } catch {
        setFailCount((prev) => prev + 1);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  // ==============================
  // OFFLINE LOGIC
  // ==============================
  useEffect(() => {
    if (failCount >= 3) {
      setIsOffline(true);
    }
  }, [failCount]);

  // ==============================
  // AUTO OPEN SETUP
  // ==============================
  useEffect(() => {
    if (!isOffline) return;

    const timer = setTimeout(() => {
      setShowSetup(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isOffline]);

// City AQI
  useEffect(() => {
  const fetchCityAQI = async () => {
    try {
      // You can change 'mumbai' to a dynamic user preference later
      const res = await fetch(`/api/aqi?city=Mumbai`); 
      const data = await res.json();
      if (data.status === "ok") {
        setCityData({ aqi: data.aqi, city: data.city });
      }
    } catch (err) {
      console.error("Failed to fetch city AQI", err);
    }
  };

  fetchCityAQI();
  // Refresh city data every 30 minutes (AQI doesn't change every 5 seconds)
  const cityInterval = setInterval(fetchCityAQI, 1000 * 60 * 30);
  return () => clearInterval(cityInterval);
}, []);

// ==============================
// 🔥 TUNED HYBRID CALIBRATION
// ==============================
const calibration = useMemo(() => {
  if (!sensorData) return null;

  const raw135 = sensorData.mq135_raw; // Your air quality sensor
  const raw7 = sensorData.mq7_raw;     // Your CO sensor

  // 1. TUNE THESE TWO NUMBERS
  // Set 'minRaw' to the value you see when your room air is CLEAN (e.g., 2500)
  // Set 'maxRaw' to what you'd expect if someone blew smoke on the sensor (e.g., 3800)
  const minRaw = 2600; 
  const maxRaw = 3600;

  // 2. Calculate AQI (Linear Mapping)
  // This converts your raw 2600-3600 range into a 20-400 AQI range
  let calculatedAqi = ((raw135 - minRaw) / (maxRaw - minRaw)) * 400;
  
  // Base offset so it doesn't show 0
  calculatedAqi = Math.max(25, Math.round(calculatedAqi)); 

  // 3. Realistic Gas Estimates
  // CO2: Base is 400ppm, max is 2000ppm
  const co2ppm = Math.round(400 + (calculatedAqi * 4));
  // CO: Just a simple scale of the MQ7 raw
  const coppm = Math.round((raw7 / 4095) * 40);

  return {
    temp: sensorData.temperature,
    humidity: sensorData.humidity,
    co2ppm: Math.min(co2ppm, 5000),
    coppm: coppm,
    aqi: Math.min(calculatedAqi, 500),
  };
}, [sensorData]);

  const activeAQI = calibration?.aqi ?? 0;

  // ==============================
  // AQI LEVEL + COLOR
  // ==============================
  let level = "Good";
  let statusColor = "#10b981";

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
    if (!calibration?.aqi) return;

    setAqiHistory((prev) =>
      [...prev, calibration.aqi].slice(-12)
    );
  }, [calibration?.aqi]);

  const trendData = aqiHistory.map((v, i) => ({
    time: i.toString(),
    value: v,
  }));

  // ==============================
  // LOADING
  // ==============================
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <RefreshCw className="animate-spin text-green-400" />
      </div>
    );
  }

  return (
    <main
      className="min-h-screen p-6 transition-all duration-700"
      style={{
        filter: isOffline
          ? "grayscale(0.5) brightness(0.8)"
          : "none",
      }}
    >
      <BackgroundGradient />

      {/* OFFLINE BANNER */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 bg-red-500 px-6 py-3 rounded-full text-white shadow-lg"
          >
            Hardware Link Severed
          </motion.div>
        )}

      </AnimatePresence>

      {/* CONNECT DEVICE BUTTON */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowSetup(true)}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-full shadow-lg hover:bg-green-400 transition"
      >
        🔌 Connect Device
      </motion.button>

      <div className="space-y-8">

        <SyncInsight 
        homeAQI={activeAQI} 
        cityAQI={cityData?.aqi ?? 0} // Use real AQI, fallback to 0
        cityName={cityData?.city ?? "Loading..."} // Use real City Name
        />

        <AQIHero aqi={activeAQI} level={level} color={statusColor} />

        <EnvironmentalStats
          temperature={calibration?.temp ?? 0}
          humidity={calibration?.humidity ?? 0}
        />

        <PollutantDominance
          gases={[
            { name: "CO₂", value: calibration?.co2ppm ?? 0 },
            { name: "CO", value: calibration?.coppm ?? 0 },
          ]}
        />

        <AQITrendChart data={trendData} color={statusColor} />

        <Navbar />
      </div>

      {/* DEVICE MODAL */}
      {showSetup && (
        <DeviceSetupModal
          onClose={() => setShowSetup(false)}
          onSuccess={() => {
            setIsOffline(false);
            setShowSetup(false);
            setFailCount(0);
            setRefreshKey((p) => p + 1);
          }}
        />
      )}
    </main>
  );
}