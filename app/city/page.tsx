"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { Navbar } from "@/components/ui/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { Search, Globe, Wind, Zap, History, MapPin, AlertTriangle } from "lucide-react";

// Dynamically import Leaflet with SSR: false to avoid build errors
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false }) as any;
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false }) as any;
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false }) as any;
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false }) as any;

// Import Leaflet CSS (requires standard import)
import "leaflet/dist/leaflet.css";

interface CityData {
    city: string;
    aqi: number;
    pollutant: string;
    lat: number;
    lon: number;
}

// Component to handle map center changes
function RecenterMap({ lat, lon }: { lat: number, lon: number }) {
    // We'll use this internally if needed, or remove if unused
    return null;
}

export default function CityExplorer() {
    const [search, setSearch] = useState("");
    const [cityData, setCityData] = useState<CityData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [mapInstance, setMapInstance] = useState<any>(null);
    const [homeAQI, setHomeAQI] = useState<number | null>(null);

    useEffect(() => {
        const history = localStorage.getItem("ecoair_searches");
        if (history) setRecentSearches(JSON.parse(history));
        
        // Fetch Home AQI for comparison
        const fetchHome = async () => {
            try {
                const res = await fetch('/api/data');
                const data = await res.json();
                if (data && data.mq135_raw) {
                    // Simple AQI calculation logic matches dashboard
                    const co2ppm = Math.round(400 + (Math.pow(data.mq135_raw / 4095, 2) * 1600));
                    setHomeAQI(Math.round((co2ppm / 800) * 50));
                }
            } catch (e) {}
        };
        fetchHome();
    }, []);

    const handleSearch = async (cityOverride?: string) => {
        const query = cityOverride || search;
        if (!query) return;

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/city?city=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (data.status === "ok" && data.aqi !== undefined) {
                const newCity: CityData = {
                    city: data.city,
                    aqi: data.aqi,
                    pollutant: data.dominentpol,
                    lat: data.geo[0],
                    lon: data.geo[1],
                };
                setCityData(newCity);
                
                // Fly to city using Leaflet
                if (mapInstance) {
                    mapInstance.flyTo([newCity.lat, newCity.lon], 12, { animate: true, duration: 2 });
                }

                // Update history
                const updatedHistory = [newCity.city, ...recentSearches.filter(s => s !== newCity.city)].slice(0, 5);
                setRecentSearches(updatedHistory);
                localStorage.setItem("ecoair_searches", JSON.stringify(updatedHistory));
            } else {
                setError("Station Unavailable or Unknown.");
            }
        } catch (err) {
            setError("Atmospheric Link Failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white relative">
            <BackgroundGradient />
            
            {/* Hacker-Dark Leaflet Map Container */}
            <div className="absolute inset-0 z-0 grayscale filter invert opacity-40">
                <MapContainer 
                    center={[20, 0] as any} 
                    zoom={2} 
                    style={{ height: "100%", width: "100%", background: "#050505" }}
                    ref={setMapInstance}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {cityData && (
                        <Marker position={[cityData.lat, cityData.lon] as any}>
                            <Popup>
                                {cityData.city}: {cityData.aqi} AQI
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-12 flex flex-col items-start gap-8 pointer-events-none">
                <header className="pointer-events-auto">
                    <h1 className="text-4xl font-display font-medium text-white tracking-tighter">Global <span className="text-primary italic">Atmospherics</span></h1>
                    <p className="text-white/30 text-xs mt-2 uppercase tracking-[0.4em]">Integrated WAQI Sensor Grid</p>
                </header>

                {/* Search Panel */}
                <GlassCard className="w-full max-w-md p-6 pointer-events-auto" intensity="high">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Enter global city..."
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                        />
                    </div>
                    {recentSearches.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                             {recentSearches.map((s, i) => (
                                <button key={i} onClick={() => handleSearch(s)} className="px-3 py-1.5 rounded-lg bg-white/2 border border-white/5 text-[10px] text-white/40 hover:text-white transition-all">
                                    {s}
                                </button>
                             ))}
                        </div>
                    )}
                </GlassCard>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="max-w-md w-full px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center justify-center gap-3 backdrop-blur-md pointer-events-auto"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {cityData && (
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full max-w-md pointer-events-auto">
                            <GlassCard 
                                className={`p-8 space-y-6 transition-all duration-500 ${cityData && homeAQI && cityData.aqi < homeAQI ? "border-primary/50 shadow-[0_0_50px_rgba(0,255,157,0.3)] ring-2 ring-primary/20" : ""}`} 
                                intensity="high"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-display font-medium text-white">{cityData.city}</h2>
                                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                                            {cityData && homeAQI && cityData.aqi < homeAQI ? "Vibe: Cleaner than Home" : "Active Station"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-5xl font-display font-medium text-white">{cityData.aqi}</div>
                                        <div className="text-[10px] text-white/20 font-mono mt-1">AQI</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <Wind className="w-4 h-4 text-white/20 mb-2" />
                                        <p className="text-[9px] text-white/40 uppercase">Dominant</p>
                                        <p className="text-sm text-white font-bold">{cityData.pollutant}</p>
                                     </div>
                                     <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <MapPin className="w-4 h-4 text-white/20 mb-2" />
                                        <p className="text-[9px] text-white/40 uppercase">Position</p>
                                        <p className="text-sm text-white font-bold">{cityData.lat.toFixed(1)}, {cityData.lon.toFixed(1)}</p>
                                     </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Navbar />
        </main>
    );
}
