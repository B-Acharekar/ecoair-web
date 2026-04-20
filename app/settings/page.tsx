"use client";

import { motion } from "framer-motion";
import { Wifi, WifiOff, Activity, AlertCircle, Home } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { Navbar } from "@/components/ui/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DeviceStatus {
  connected: boolean;
  deviceId: string;
  lastSeen: string;
}

interface SensorStatus {
  isWorking: boolean;
  pm25: number | null;
  pm10: number | null;
  co2: number | null;
  temperature: number | null;
  humidity: number | null;
}

export default function SettingsPage() {
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    connected: false,
    deviceId: "ESP32-12345",
    lastSeen: new Date().toLocaleTimeString(),
  });

  const [sensorStatus, setSensorStatus] = useState<SensorStatus>({
    isWorking: false,
    pm25: null,
    pm10: null,
    co2: null,
    temperature: null,
    humidity: null,
  });

  const [loading, setLoading] = useState(true);

  // Simulate fetching device and sensor status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Simulate API call to get sensor data
        const response = await fetch("/api/data");
        const data = await response.json();

        // Check if device is connected (has recent data)
        const isConnected = data?.timestamp ? 
          (Date.now() - new Date(data.timestamp).getTime()) < 60000 : false;

        // Check if sensors are working (values are valid numbers, not 0, NaN, or null)
        const isSensorWorking = 
          data?.pm25 && data.pm25 !== 0 && !isNaN(data.pm25) &&
          data?.pm10 && data.pm10 !== 0 && !isNaN(data.pm10) &&
          data?.co2 && data.co2 !== 0 && !isNaN(data.co2);

        setDeviceStatus(prev => ({
          ...prev,
          connected: isConnected,
          lastSeen: new Date().toLocaleTimeString(),
        }));

        setSensorStatus({
          isWorking: isSensorWorking,
          pm25: data?.pm25 || null,
          pm10: data?.pm10 || null,
          co2: data?.co2 || null,
          temperature: data?.temperature || null,
          humidity: data?.humidity || null,
        });
      } catch (error) {
        console.error("Error fetching status:", error);
        setDeviceStatus(prev => ({
          ...prev,
          connected: false,
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      className="min-h-screen p-6 transition-all duration-700 bg-[#050505] relative overflow-hidden"
    >
      <BackgroundGradient />

      <div className="space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/40">Device & Sensor Status</p>
        </div>
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition"
          >
            <Home size={24} />
          </motion.button>
        </Link>
      </motion.div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Connection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Device Connection
                </h2>
                <p className="text-white/40 text-sm mb-4">
                  ESP32 with MQ135 & MQ7
                </p>
              </div>
              <motion.div
                animate={{
                  scale: deviceStatus.connected ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: deviceStatus.connected ? 2 : 0, repeat: deviceStatus.connected ? Infinity : 0 }}
              >
                {deviceStatus.connected ? (
                  <Wifi className="text-green-400" size={32} />
                ) : (
                  <WifiOff className="text-red-400" size={32} />
                )}
              </motion.div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-white/60">Status</span>
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: deviceStatus.connected
                      ? "rgba(34, 197, 94, 0.2)"
                      : "rgba(239, 68, 68, 0.2)",
                  }}
                  className="px-3 py-1 rounded text-sm font-medium"
                >
                  <span
                    className={
                      deviceStatus.connected
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {deviceStatus.connected ? "Connected" : "Disconnected"}
                  </span>
                </motion.div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-white/60">Device ID</span>
                <span className="text-white font-mono text-sm">
                  {deviceStatus.deviceId}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-white/60">Last Seen</span>
                <span className="text-white text-sm">{deviceStatus.lastSeen}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Sensor Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Sensor Status
                </h2>
                <p className="text-white/40 text-sm mb-4">
                  MQ135 & MQ7 Sensors
                </p>
              </div>
              <motion.div
                animate={{
                  scale: sensorStatus.isWorking ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: sensorStatus.isWorking ? 2 : 0, repeat: sensorStatus.isWorking ? Infinity : 0 }}
              >
                {sensorStatus.isWorking ? (
                  <Activity className="text-green-400" size={32} />
                ) : (
                  <AlertCircle className="text-red-400" size={32} />
                )}
              </motion.div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-white/60">Sensor Health</span>
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: sensorStatus.isWorking
                      ? "rgba(34, 197, 94, 0.2)"
                      : "rgba(239, 68, 68, 0.2)",
                  }}
                  className="px-3 py-1 rounded text-sm font-medium"
                >
                  <span
                    className={
                      sensorStatus.isWorking
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {sensorStatus.isWorking ? "Working" : "Not Working"}
                  </span>
                </motion.div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-white/60">MQ7 (CO)</span>
                <span className="text-white font-mono">
                  {sensorStatus.pm25 ? `${sensorStatus.pm25.toFixed(1)} ppm` : "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-white/60">MQ135 (CO2)</span>
                <span className="text-white font-mono">
                  {sensorStatus.co2 ? `${sensorStatus.co2.toFixed(0)} ppm` : "N/A"}
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Additional Readings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2"
        >
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Environment Readings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                <p className="text-white/40 text-sm mb-2">DHT22 (Temp)</p>
                <p className="text-2xl font-bold text-white">
                  {sensorStatus.temperature
                    ? `${sensorStatus.temperature.toFixed(1)}°C`
                    : "N/A"}
                </p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                <p className="text-white/40 text-sm mb-2">DHT22 (Humidity)</p>
                <p className="text-2xl font-bold text-white">
                  {sensorStatus.humidity
                    ? `${sensorStatus.humidity.toFixed(1)}%`
                    : "N/A"}
                </p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                <p className="text-white/40 text-sm mb-2">Sensor Status</p>
                <p
                  className={`text-lg font-bold ${
                    sensorStatus.isWorking
                      ? "text-primary"
                      : "text-accent"
                  }`}
                >
                  {sensorStatus.isWorking ? "Active" : "Offline"}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
        </div>

        <Navbar />
      </div>
    </main>
  );
}
