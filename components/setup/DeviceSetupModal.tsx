"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { useState } from "react";
import { Wifi, Smartphone, Check, Loader2, X } from "lucide-react";

interface DeviceSetupModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeviceSetupModal({ onClose, onSuccess }: DeviceSetupModalProps) {
  const [step, setStep] = useState<
    "idle" | "searching" | "connected" | "sending" | "success" | "error"
  >("idle");

  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("Ready to Pair");

  const connectAndProvision = async () => {
    const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
    const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

    try {
      if (!ssid || !password) {
        setStatusMessage("Enter WiFi credentials");
        return;
      }

      setStep("searching");
      setStatusMessage("Searching for EcoAir device...");

      const nav = navigator as any;

      const device = await nav.bluetooth.requestDevice({
        filters: [{ name: "EcoAir_Setup" }],
        optionalServices: [SERVICE_UUID],
      });

      setStatusMessage("Connecting...");
      const server = await device.gatt?.connect();
      if (!server) throw new Error("Connection failed");

      setStep("connected");

      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic =
        await service.getCharacteristic(CHARACTERISTIC_UUID);

      setStep("sending");
      setStatusMessage("Sending credentials...");

      const encoder = new TextEncoder();
      await characteristic.writeValue(
        encoder.encode(`${ssid}:${password}`)
      );

      setStep("success");
      setStatusMessage("Setup successful!");

      device.gatt?.disconnect();

      // ✅ Notify Dashboard
      if (onSuccess) {
        setTimeout(() => onSuccess(), 800);
      }

    } catch (error: any) {
      setStep("error");
      setStatusMessage("Failed: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 relative">

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40"
          >
            <X />
          </button>

          <div className="space-y-6 text-center">

            <div className="flex justify-center">
              {step === "searching" && <Loader2 className="animate-spin" />}
              {step === "connected" && <Smartphone />}
              {step === "sending" && <Wifi className="animate-pulse" />}
              {step === "success" && <Check />}
              {step === "idle" && <Wifi />}
            </div>

            <p className="text-white/60">{statusMessage}</p>

            {step === "idle" && (
              <>
                <input
                  placeholder="SSID"
                  className="w-full p-2 bg-black/40 text-white"
                  onChange={(e) => setSsid(e.target.value)}
                />
                <input
                  placeholder="Password"
                  type="password"
                  className="w-full p-2 bg-black/40 text-white"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <NeonButton onClick={connectAndProvision}>
                  Pair Device
                </NeonButton>
              </>
            )}

            {step === "success" && (
              <NeonButton
                onClick={() => {
                  if (onSuccess) onSuccess();
                  onClose();
                }}
              >
                Continue
              </NeonButton>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}