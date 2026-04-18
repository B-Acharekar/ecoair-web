"use client";

import { useState } from "react";

export default function BluetoothSetup() {
  const [status, setStatus] = useState("Ready to Pair");
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");

  const connectAndProvision = async () => {
    const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
    const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
    
    // Format the data exactly as the ESP32 expects it (SSID:PASS)
    const payload = `${ssid}:${password}`;

    try {
      setStatus("Searching for EcoAir...");
      const nav = navigator as any;
      const device = await nav.bluetooth.requestDevice({
        filters: [{ name: "EcoAir_Setup" }],
        optionalServices: [SERVICE_UUID]
      });

      setStatus("Connecting...");
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

      setStatus("Sending Credentials...");
      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(payload));

      setStatus("Success! Watch the OLED.");
      device.gatt.disconnect();
    } catch (error: any) {
      setStatus("Failed: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
      <div className="p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl max-w-sm w-full">
        <h3 className="text-2xl font-bold mb-6 text-center">WiFi Setup</h3>
        
        <input 
          type="text" 
          placeholder="WiFi Name (SSID)" 
          className="w-full p-3 mb-3 bg-black/40 rounded-lg border border-white/10 text-white"
          onChange={(e) => setSsid(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-3 mb-6 bg-black/40 rounded-lg border border-white/10 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="mb-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-blue-400 text-xs font-mono">{status}</p>
        </div>

        <button 
          onClick={connectAndProvision}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          Send to Device
        </button>
      </div>
    </div>
  );
}