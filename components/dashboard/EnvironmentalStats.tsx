import { GlassCard } from "@/components/ui/GlassCard";
import { Thermometer, Droplets } from "lucide-react";
import { RollingNumber } from "@/components/ui/RollingNumber";

interface EnvironmentalStatsProps {
    temperature: number;
    humidity: number;
}

export function EnvironmentalStats({ temperature, humidity }: EnvironmentalStatsProps) {
    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            <GlassCard className="p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-colors group">
                <div className="p-3 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors">
                    <Thermometer className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                    <div className="flex items-baseline justify-center">
                        <RollingNumber value={temperature} className="text-3xl font-display font-medium text-white" />
                        <span className="text-xl text-white/50 ml-1">°C</span>
                    </div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Temp</p>
                </div>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-colors group">
                <div className="p-3 rounded-full bg-white/5 group-hover:bg-secondary/20 transition-colors">
                    <Droplets className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-center">
                    <div className="flex items-baseline justify-center">
                        <RollingNumber value={humidity} className="text-3xl font-display font-medium text-white" />
                        <span className="text-xl text-white/50 ml-1">%</span>
                    </div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Humidity</p>
                </div>
            </GlassCard>
        </div>
    );
}
