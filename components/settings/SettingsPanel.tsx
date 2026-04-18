"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Settings, Cpu, Map, Bell, Sliders, X, ShieldCheck, LogOut } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [purifierForce, setPurifierForce] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        // Listen for real-time updates for the purifier command
        const unsub = onSnapshot(doc(db, "commands", "purifier"), (doc) => {
            if (doc.exists()) {
                setPurifierForce(doc.data().active || false);
            }
        });

        return () => unsub();
    }, [isOpen]);

    const togglePurifierForce = async () => {
        const newState = !purifierForce;
        setPurifierForce(newState);
        try {
            await setDoc(doc(db, "commands", "purifier"), {
                active: newState,
                updatedAt: new Date().toISOString(),
                updatedBy: user?.uid || "system"
            });
        } catch (error) {
            console.error("Error updating purifier command:", error);
            setPurifierForce(!newState); // Rollback on error
        }
    };

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/login");
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        <div className="flex flex-col md:flex-row border-b border-white/10">
                            {/* Desktop Sidebar / Mobile Top Bar */}
                            <div className="w-full md:w-1/3 bg-white/5 p-6 md:p-8 flex md:flex-col gap-2 border-b md:border-b-0 md:border-r border-white/10 overflow-x-auto">
                                <TabItem icon={Sliders} label="Control" active />
                                <TabItem icon={Cpu} label="Hardware" />
                                <TabItem icon={Map} label="Geospatial" />
                            </div>

                            <div className="flex-1 p-8 md:p-10 relative">
                                <button onClick={onClose} className="absolute right-6 top-6 md:right-8 md:top-8 p-2 rounded-full hover:bg-white/10 transition-colors">
                                    <X className="w-5 h-5 text-white/40" />
                                </button>

                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-display font-medium text-white mb-1">Calibration Hub</h2>
                                        <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Node Infrastructure</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Auto-Purify Threshold</p>
                                                <p className="text-primary font-mono text-sm font-bold">110 AQI</p>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="50" 
                                                max="300" 
                                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" 
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 group hover:border-primary/20 transition-all">
                                            <div>
                                                <p className="text-sm font-medium text-white">Purifier Force On</p>
                                                <p className="text-[10px] text-white/20 mt-1 uppercase tracking-widest font-bold">Manual Hardware Override</p>
                                            </div>
                                            <button 
                                                onClick={togglePurifierForce}
                                                className={`w-14 h-7 rounded-full relative p-1 transition-all duration-300 ${purifierForce ? "bg-primary shadow-[0_0_20px_rgba(0,255,157,0.3)]" : "bg-white/10"}`}
                                            >
                                                <motion.div 
                                                    animate={{ x: purifierForce ? 28 : 0 }}
                                                    className="w-5 h-5 bg-white rounded-full shadow-lg"
                                                />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck className="w-5 h-5 text-primary" />
                                                <span className="text-sm font-medium text-white">System Auto-Guard</span>
                                            </div>
                                            <div className="w-12 h-6 rounded-full bg-primary/20 relative p-1 shadow-[0_0_15px_rgba(0,255,157,0.2)]">
                                                <div className="w-4 h-4 bg-primary rounded-full float-right shadow-[0_0_10px_rgba(0,255,157,0.5)]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5 space-y-4">
                                        <NeonButton className="w-full py-5 rounded-2xl text-xs uppercase tracking-widest">
                                            Flash Configuration
                                        </NeonButton>
                                        
                                        <button 
                                            onClick={handleSignOut}
                                            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-all group"
                                        >
                                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Terminate Session</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function TabItem({ icon: Icon, label, active = false }: any) {
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-primary/10 text-primary' : 'text-white/30 hover:text-white/60 cursor-pointer'}`}>
            <Icon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
        </div>
    );
}

function SettingItem({ label, desc, value }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-[10px] text-white/30 mt-1">{desc}</p>
                </div>
                <span className="text-xs font-mono text-primary font-bold">{value}</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-primary/40 rounded-full" />
            </div>
        </div>
    );
}
