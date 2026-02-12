"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { useState } from "react";
import { Wifi, Smartphone, Check, Loader2, X } from "lucide-react";

interface DeviceSetupModalProps {
  onClose: () => void;
}


export function DeviceSetupModal({ onClose }: DeviceSetupModalProps) {
  const [step, setStep] = useState<
    "idle" | "searching" | "connected" | "sending" | "success" | "error"
  >("idle");

  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("Ready to Pair");

  const connectAndProvision = async () => {
    const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
    const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

    const payload = `${ssid}:${password}`;

    try {
      setStep("searching");
      setStatusMessage("Searching for EcoAir device...");
      const nav = navigator as any; // TypeScript workaround for Web Bluetooth API
      const device = await nav.bluetooth.requestDevice({
        filters: [{ name: "EcoAir_Setup" }],
        optionalServices: [SERVICE_UUID],
      });

      setStatusMessage("Connecting to device...");
      const server = await device.gatt?.connect();
      if (!server) throw new Error("GATT connection failed");

      setStep("connected");

      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic =
        await service.getCharacteristic(CHARACTERISTIC_UUID);

      setStep("sending");
      setStatusMessage("Sending WiFi credentials...");

      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(payload));

      setStatusMessage("Provisioning successful!");
      setStep("success");

      device.gatt?.disconnect();
    } catch (error: any) {
      setStep("error");
      setStatusMessage("Failed: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 relative overflow-hidden" intensity="high">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/30 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-6">

            {/* Icon Section */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              {step === "searching" && (
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              )}
              {step === "connected" && (
                <Smartphone className="w-12 h-12 text-primary" />
              )}
              {step === "sending" && (
                <Wifi className="w-12 h-12 text-primary animate-pulse" />
              )}
              {step === "success" && (
                <Check className="w-14 h-14 text-primary" />
              )}
              {step === "error" && (
                <span className="text-red-400 text-sm">⚠</span>
              )}
              {step === "idle" && (
                <Wifi className="w-12 h-12 text-white/40" />
              )}
            </div>

            <h2 className="text-2xl font-display text-white">
              EcoAir WiFi Setup
            </h2>

            <p className="text-white/50 text-sm font-mono">
              {statusMessage}
            </p>

            {/* Inputs */}
            {step === "idle" && (
              <>
                <input
                  type="text"
                  placeholder="WiFi Name (SSID)"
                  className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
                  onChange={(e) => setSsid(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <NeonButton
                  className="w-full"
                  onClick={connectAndProvision}
                  glow
                >
                  Send to Device
                </NeonButton>
              </>
            )}

            {step === "success" && (
              <NeonButton className="w-full" onClick={onClose} glow>
                Open Dashboard
              </NeonButton>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
