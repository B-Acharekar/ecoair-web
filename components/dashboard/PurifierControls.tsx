"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Power, Cpu, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

type FanSpeed = 0 | 1 | 2 | 3;

interface PurifierControlsProps {
    isOn: boolean;
    isAuto: boolean;
    fanSpeed: FanSpeed;
    onTogglePower: () => void;
    onToggleAuto: () => void;
    onSetFanSpeed: (speed: FanSpeed) => void;
}

export function PurifierControls({
    isOn, isAuto, fanSpeed,
    onTogglePower, onToggleAuto, onSetFanSpeed
}: PurifierControlsProps) {

    return (
        <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-white uppercase tracking-wider opacity-80">System Control</h3>
                <StatusIndicator status={isOn ? "good" : "idle"} label={isOn ? "Active" : "Standby"} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <NeonButton
                    variant={isOn ? "primary" : "ghost"}
                    onClick={onTogglePower}
                    className="w-full h-16 text-lg"
                    glow={isOn}
                >
                    <Power className="w-5 h-5 mr-2" />
                    {isOn ? "ON" : "OFF"}
                </NeonButton>

                <NeonButton
                    variant={isAuto ? "secondary" : "ghost"}
                    onClick={onToggleAuto}
                    disabled={!isOn}
                    className="w-full h-16 text-lg"
                    glow={isAuto}
                >
                    <Cpu className="w-5 h-5 mr-2" />
                    {isAuto ? "AUTO" : "MANUAL"}
                </NeonButton>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-white/50">
                    <span>FAN SPEED</span>
                    <span>{isOn ? `${fanSpeed * 33}%` : "0%"}</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {([1, 2, 3] as FanSpeed[]).map((speed) => (
                        <button
                            key={speed}
                            disabled={!isOn || isAuto}
                            onClick={() => onSetFanSpeed(speed)}
                            className={cn(
                                "h-12 rounded-lg border border-white/10 flex items-center justify-center transition-all duration-300 relative overflow-hidden",
                                isOn && fanSpeed >= speed ? "bg-white/10 text-white" : "text-white/20 hover:bg-white/5",
                                isOn && fanSpeed === speed && !isAuto && "border-primary/50 bg-primary/20 text-primary shadow-[0_0_15px_var(--primary)]"
                            )}
                        >
                            <Wind
                                className={cn("w-5 h-5 z-10", { "animate-spin": isOn && fanSpeed >= speed })}
                                style={{ animationDuration: `${2 / speed}s` }}
                            />
                            {/* Fill bar for visual buildup */}
                            {isOn && fanSpeed >= speed && (
                                <div className="absolute inset-0 bg-white/5 z-0" />
                            )}
                        </button>
                    ))}
                    <div className="flex items-center justify-center text-xs text-white/30 font-mono">
                        RPM
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
